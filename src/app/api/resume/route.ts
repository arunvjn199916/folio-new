import { NextResponse, type NextRequest } from "next/server";

/*
  One Resume link, two versions. Visitors in India get the India resume (relocation within
  India, notice period); everyone else — and anyone whose country is unknown — gets the
  International one. `?v=india` or `?v=international` picks one explicitly.
  The country comes from the host's geo headers (Netlify, plus common CDNs); nothing is
  stored and no third-party service is called.
*/
const FILES = {
  international: "/resume/Arun-Vijayan-Product-Designer-Resume-International.pdf",
  india: "/resume/Arun-Vijayan-Product-Designer-Resume-India.pdf",
} as const;

function country(req: NextRequest): string | null {
  const h = req.headers;
  const direct = h.get("x-country") ?? h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry");
  if (direct) return direct.toUpperCase();
  const geo = h.get("x-nf-geo"); // Netlify: base64 JSON { country: { code } }
  if (geo) {
    try {
      const code = JSON.parse(atob(geo))?.country?.code;
      if (typeof code === "string") return code.toUpperCase();
    } catch {}
  }
  return null;
}

export function GET(request: NextRequest) {
  const v = request.nextUrl.searchParams.get("v");
  const pick = v === "india" || v === "international" ? v : country(request) === "IN" ? "india" : "international";
  const res = NextResponse.redirect(new URL(FILES[pick], request.url), 302);
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("Vary", "x-country, x-nf-geo, cf-ipcountry");
  return res;
}
