import { systemPrompt } from "@/lib/chat/knowledge";
import { isLocale, localeMeta, defaultLocale, type Locale } from "@/i18n/config";

/*
  Portfolio assistant endpoint. The Groq key lives only in the server environment
  (GROQ_API_KEY) and never reaches the browser. Guard rails, in order:
  same-origin check → JSON + size limit → schema validation → per-IP rate limit →
  upstream call with timeout → only the answer text is streamed back (the model's
  reasoning channel is dropped). Errors never echo upstream details.
*/

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const MAX_BODY = 16_000; // bytes
const MAX_MESSAGES = 16;
const MAX_CHARS = 800;
const WINDOW_MS = 60_000;
const PER_WINDOW = 8;
const PER_DAY = 80;

type Msg = { role: "user" | "assistant"; content: string };

// In-memory limiter: per server instance, which is enough to stop casual abuse of the
// free key. (A shared store such as Redis would be needed to enforce it across instances.)
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 86_400_000);
  const recent = list.filter((t) => now - t < WINDOW_MS).length;
  if (recent >= PER_WINDOW || list.length >= PER_DAY) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.delete(hits.keys().next().value!); // bound memory
  return false;
}

const fail = (status: number, message: string) =>
  new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Only a known locale code ever reaches the prompt — never free text from the client.
function parseLocale(body: unknown): Locale {
  const l = typeof body === "object" && body !== null ? (body as { locale?: unknown }).locale : undefined;
  return isLocale(l) ? l : defaultLocale;
}

function parse(body: unknown): Msg[] | null {
  if (typeof body !== "object" || body === null) return null;
  const msgs = (body as { messages?: unknown }).messages;
  if (!Array.isArray(msgs) || msgs.length === 0 || msgs.length > MAX_MESSAGES) return null;
  const out: Msg[] = [];
  for (const m of msgs) {
    if (typeof m !== "object" || m === null) return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const c = content.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
    if (!c || c.length > MAX_CHARS) return null;
    out.push({ role, content: c });
  }
  return out[out.length - 1].role === "user" ? out : null;
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail(403, "Forbidden");
  if (!req.headers.get("content-type")?.includes("application/json")) return fail(415, "Unsupported media type");

  const key = process.env.GROQ_API_KEY;
  if (!key) return fail(503, "The assistant isn't configured yet.");

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  if (limited(ip)) return fail(429, "You're asking quickly — give it a minute and try again.");

  const raw = await req.text();
  if (raw.length > MAX_BODY) return fail(413, "Message too long.");
  let messages: Msg[] | null = null;
  let locale: Locale = defaultLocale;
  try {
    const body: unknown = JSON.parse(raw);
    messages = parse(body);
    locale = parseLocale(body);
  } catch {
    messages = null;
  }
  if (!messages) return fail(400, "Invalid request.");

  let upstream: Response;
  try {
    upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.4,
        reasoning_effort: "low",
        max_completion_tokens: 600,
        messages: [
          {
            role: "system",
            content:
              locale === "en"
                ? systemPrompt
                : `${systemPrompt}\n\nLANGUAGE: The visitor is browsing in ${localeMeta[locale].english}. Reply in ${localeMeta[locale].english} (${localeMeta[locale].label}); keep product, company and tool names in English.`,
          },
          ...messages,
        ],
      }),
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    return fail(504, "The assistant took too long to respond. Please try again.");
  }
  if (!upstream.ok || !upstream.body) {
    return fail(upstream.status === 429 ? 429 : 502, "The assistant is unavailable right now. Please try again shortly.");
  }

  // Re-stream only the answer text from Groq's SSE (drop reasoning + metadata).
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const piece = JSON.parse(data).choices?.[0]?.delta?.content;
            if (typeof piece === "string" && piece) controller.enqueue(encoder.encode(piece));
          } catch {
            /* partial or non-JSON line: skip */
          }
        }
      },
    }),
  );

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
