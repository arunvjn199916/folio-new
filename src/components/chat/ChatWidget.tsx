"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Briefcase, Mail, Sparkles, User, X } from "lucide-react";
import { Orb } from "./Orb";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

// Icon + placement of each floating suggestion chip; the text comes from the dictionary.
const CHIP_LAYOUT = [
  { icon: User, pos: "left-[4%] top-[18%]" },
  { icon: Sparkles, pos: "right-[2%] top-[26%]" },
  { icon: Briefcase, pos: "left-[0%] top-[62%]" },
  { icon: Mail, pos: "right-[6%] top-[70%]" },
];

/** Opens the chat from anywhere (e.g. the accessibility panel's "AI Assistant" card). */
export const OPEN_CHAT_EVENT = "portfolio:open-chat";

/*
  Chat reference (Pinterest): a white rounded panel with an iridescent orb in the middle,
  suggestion chips floating around it, a gradient greeting and an input bar with a
  gradient send button. Once the conversation starts the orb moves to the header and the
  messages take over. Opened from a floating orb button (bottom-left).
*/
export function ChatWidget() {
  const { dict, locale } = useI18n();
  const t = dict.ui.chat;
  const greeting = () => {
    const h = new Date().getHours();
    return h < 12
      ? t.greetingMorning
      : h < 17
        ? t.greetingAfternoon
        : t.greetingEvening;
  };
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => field.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    list.current?.scrollTo({
      top: list.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => () => abort.current?.abort(), []);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, openChat);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, openChat);
  }, []);

  const send = async (text: string) => {
    const q = text.trim().slice(0, 800);
    if (!q || busy) return;
    const history: Msg[] = [
      ...messages,
      { role: "user" as const, content: q },
    ].slice(-12);
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    abort.current = new AbortController();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, locale }),
        signal: abort.current.signal,
      });
      if (!res.ok || !res.body) {
        const msg = (await res.text().catch(() => "")) || t.error;
        setMessages((m) => [
          ...m.slice(0, -1),
          { role: "assistant", content: msg.slice(0, 200) },
        ]);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((m) => [
          ...m.slice(0, -1),
          { role: "assistant", content: acc },
        ]);
      }
      if (!acc.trim()) {
        setMessages((m) => [
          ...m.slice(0, -1),
          { role: "assistant", content: t.empty },
        ]);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setMessages((m) => [
          ...m.slice(0, -1),
          { role: "assistant", content: t.lost },
        ]);
      }
    } finally {
      setBusy(false);
    }
  };

  const started = messages.length > 0;

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            onClick={() => setOpen(true)}
            aria-label={t.fab}
            className="group fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-surface/80 bg-surface/90 p-1.5 pr-1.5 shadow-[0_12px_30px_-10px_rgba(61,107,255,0.45)] transition-[padding] duration-300 hover:pr-4"
          >
            <Orb size={44} />
            <span className="max-w-0 overflow-hidden text-[13px] font-medium whitespace-nowrap text-ink transition-[max-width] duration-300 group-hover:max-w-[160px]">
              {t.fab}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="false"
            aria-label={t.dialog}
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.94,
              transformOrigin: "bottom left",
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            data-lenis-prevent
            className="fixed inset-x-3 bottom-3 z-[60] flex h-[min(640px,calc(100svh-24px))] flex-col overflow-hidden rounded-[30px] border border-surface bg-surface shadow-[0_40px_90px_-30px_rgba(26,24,34,0.45)] sm:inset-x-auto sm:left-4 sm:w-[420px]"
          >
            <header className="flex items-center justify-between px-5 pt-4">
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {started && (
                    <Orb key="mini" size={26} energy={busy ? 1 : 0} />
                  )}
                </AnimatePresence>
                <span className="text-[12px] font-medium text-ink-3">
                  {started ? t.fab : ""}
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="grid size-8 place-items-center rounded-full text-ink-3 hover:bg-ink/5 hover:text-ink"
              >
                <X size={16} />
              </button>
            </header>

            {!started ? (
              <div className="relative flex flex-1 flex-col items-center justify-center px-6">
                <div className="relative grid h-[230px] w-full place-items-center">
                  <Orb size={170} energy={busy ? 1 : 0} />
                  {t.suggestions.map((s, i) => {
                    const chip = CHIP_LAYOUT[i % CHIP_LAYOUT.length];
                    return (
                      <motion.button
                        key={s.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: [0, i % 2 ? -4 : 4, 0],
                        }}
                        transition={{
                          opacity: { delay: 0.15 + i * 0.07 },
                          scale: { delay: 0.15 + i * 0.07 },
                          y: {
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                        onClick={() => send(s.q)}
                        className={cn(
                          "absolute flex items-center gap-1.5 rounded-full bg-surface-3 px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:bg-ink/10 hover:text-ink",
                          chip.pos,
                        )}
                      >
                        <chip.icon size={13} /> {s.label}
                      </motion.button>
                    );
                  })}
                </div>
                <p className="mt-6 bg-gradient-to-r from-[#7aa2ff] via-[#9d8cff] to-[#c48cff] bg-clip-text text-[19px] text-transparent">
                  {greeting()}
                  {t.greetingSuffix === "!" ? "!" : `, ${t.greetingSuffix}`}
                </p>
                <p className="mt-1 text-center font-display text-[22px] font-semibold text-ink-2">
                  {t.question}
                </p>
              </div>
            ) : (
              <div
                ref={list}
                className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-[18px] px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap",
                        m.role === "user"
                          ? "rounded-br-[6px] bg-ink text-on-ink"
                          : "rounded-bl-[6px] bg-card text-ink shadow-[0_2px_10px_-6px_rgba(0,0,0,0.2)]",
                      )}
                    >
                      {m.content || <TypingDots label={t.thinking} />}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="m-4 mt-2 rounded-[20px] border border-ink/10 bg-card p-3"
            >
              <textarea
                ref={field}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                maxLength={800}
                placeholder={t.placeholder}
                aria-label={t.inputLabel}
                className="max-h-24 w-full resize-none bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-3"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wide text-ink-3">
                  {t.disclaimer}
                </span>
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  aria-label={t.send}
                  className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#7cc8ff] via-[#8b7bff] to-[#e07bff] text-white transition-opacity disabled:opacity-40"
                >
                  <ArrowUp size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TypingDots({ label }: { label: string }) {
  return (
    <span
      className="flex h-5 items-center gap-1"
      role="status"
      aria-label={label}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-ink-3"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}
