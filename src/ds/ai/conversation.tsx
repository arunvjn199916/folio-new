"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Brain, Check, ChevronDown, Copy, Mic, MicOff, Paperclip, RotateCcw, Sparkles, Square, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/primitives";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/controls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/menus";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/overlays";
import { cn } from "@/lib/utils";

/*
  Conversation components: PromptInput, ChatMessage, StreamingText, Reasoning,
  SuggestionChips, ModelSelector, VoiceInput, MessageFeedback.
  Principles they encode: the user can always stop the model, see what it's doing,
  and tell it when it's wrong.
*/

/* ── ModelSelector ── */
export type Model = { id: string; name: string; note: string; tier?: "fast" | "smart" | "reasoning" };
export function ModelSelector({ models, value, onChange, className }: { models: Model[]; value: string; onChange: (id: string) => void; className?: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" aria-label="Model" className={cn("border-transparent bg-transparent shadow-none hover:bg-ds-accent", className)}>
        <Sparkles className="text-ds-ai-accent" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-64">
        {models.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            <span className="flex flex-col">
              <span>{m.name}</span>
              <span className="text-xs text-ds-muted-foreground">{m.note}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ── PromptInput ── */
export type Attachment = { id: string; name: string; size: string };
export function PromptInput({
  onSubmit,
  onStop,
  busy = false,
  placeholder = "Ask Aura anything…",
  attachments = [],
  onRemoveAttachment,
  onAttach,
  models,
  model,
  onModelChange,
  maxLength = 4000,
  className,
}: {
  onSubmit: (text: string) => void;
  /** While `busy`, the send button becomes Stop — the user can always interrupt. */
  onStop?: () => void;
  busy?: boolean;
  placeholder?: string;
  attachments?: Attachment[];
  onRemoveAttachment?: (id: string) => void;
  onAttach?: () => void;
  models?: Model[];
  model?: string;
  onModelChange?: (id: string) => void;
  maxLength?: number;
  className?: string;
}) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const send = () => {
    const v = text.trim();
    if (!v || busy) return;
    onSubmit(v);
    setText("");
  };
  return (
    <div
      className={cn(
        "rounded-ds-xl border bg-ds-background shadow-ds-2 transition-[border-color,box-shadow] focus-within:border-ds-ring focus-within:ring-3 focus-within:ring-ds-ring/15",
        className,
      )}
    >
      {attachments.length > 0 && (
        <ul className="flex flex-wrap gap-2 px-3 pt-3" aria-label="Attachments">
          {attachments.map((a) => (
            <li key={a.id} className="flex items-center gap-2 rounded-ds-md border bg-ds-muted px-2 py-1 text-xs">
              <Paperclip className="size-3.5 text-ds-muted-foreground" />
              <span className="max-w-40 truncate font-medium">{a.name}</span>
              <span className="text-ds-muted-foreground">{a.size}</span>
              {onRemoveAttachment && (
                <button onClick={() => onRemoveAttachment(a.id)} aria-label={`Remove ${a.name}`} className="rounded-full p-0.5 hover:bg-ds-accent">
                  <X className="size-3" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxLength))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            send();
          }
        }}
        placeholder={placeholder}
        aria-label="Message"
        rows={1}
        className="max-h-48 min-h-12 resize-none border-0 bg-transparent px-4 pt-3 shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center gap-1 px-2 pb-2">
        {onAttach && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={onAttach} aria-label="Attach files">
                <Paperclip />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach files</TooltipContent>
          </Tooltip>
        )}
        {models && model && onModelChange && <ModelSelector models={models} value={model} onChange={onModelChange} />}
        <span className="ml-auto pr-1 text-[11px] text-ds-muted-foreground tabular-nums" aria-live="polite">
          {text.length > maxLength * 0.8 ? `${text.length}/${maxLength}` : ""}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-pressed={listening}
          aria-label={listening ? "Stop dictation" : "Dictate"}
          onClick={() => setListening((l) => !l)}
          className={cn(listening && "text-ds-ai-accent")}
        >
          {listening ? <MicOff /> : <Mic />}
        </Button>
        {busy ? (
          <Button size="icon-sm" variant="secondary" onClick={onStop} aria-label="Stop generating">
            <Square className="size-3.5 fill-current" />
          </Button>
        ) : (
          <Button size="icon-sm" onClick={send} disabled={!text.trim()} aria-label="Send">
            <ArrowUp />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── StreamingText ── */
/** Reveals `text` progressively while `streaming`, with a caret. Screen readers get the final text once, not every token. */
export function StreamingText({ text, streaming, speed = 18, className }: { text: string; streaming: boolean; speed?: number; className?: string }) {
  // Progress is tied to the text it belongs to, so new text starts from zero without a reset effect.
  const [progress, setProgress] = useState({ text, n: 0 });
  const shown = !streaming ? text.length : progress.text === text ? progress.n : 0;
  useEffect(() => {
    if (!streaming) return;
    const step = Math.max(1, Math.round(text.length / 120));
    const id = setInterval(() => {
      setProgress((p) => {
        const n = Math.min(text.length, (p.text === text ? p.n : 0) + step);
        if (n >= text.length) clearInterval(id);
        return { text, n };
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, streaming, speed]);
  const done = shown >= text.length;
  return (
    <div className={cn("whitespace-pre-wrap", className)} aria-busy={!done}>
      <span aria-hidden={!done}>{text.slice(0, shown)}</span>
      {!done && <span aria-hidden className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-ds-ai-accent [animation:ds-caret_var(--ds-stream-tick)_steps(1)_infinite]" />}
      {!done && <span className="sr-only">Aura is writing…</span>}
    </div>
  );
}

/* ── ThinkingIndicator ── */
export function ThinkingIndicator({ label = "Thinking" }: { label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm text-ds-muted-foreground">
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 rounded-full bg-ds-ai-accent [animation:ds-pulse-dot_1s_ease-in-out_infinite]" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </span>
      {label}…
    </span>
  );
}

/* ── Reasoning ── */
export function Reasoning({ steps, seconds, active = false, defaultOpen = false }: { steps: string[]; seconds?: number; active?: boolean; defaultOpen?: boolean }) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="group/reasoning">
      <CollapsibleTrigger className="inline-flex items-center gap-1.5 rounded-ds-sm text-[13px] text-ds-muted-foreground transition-colors outline-none hover:text-ds-foreground focus-visible:ring-3 focus-visible:ring-ds-ring/30">
        <Brain className={cn("size-3.5 text-ds-ai-accent", active && "animate-pulse")} />
        {active ? "Reasoning…" : `Reasoned${seconds ? ` for ${seconds}s` : ""}`}
        <ChevronDown className="size-3.5 transition-transform group-data-[state=open]/reasoning:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ol className="mt-2 space-y-1.5 border-l-2 border-ds-ai-accent/30 pl-3 text-[13px] text-ds-muted-foreground">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ── MessageFeedback ── */
const REASONS = ["Not accurate", "Not helpful", "Unsafe or harmful", "Didn't follow instructions"];
export function MessageFeedback({ onFeedback, onCopy, onRegenerate }: { onFeedback?: (v: { rating: "up" | "down"; reason?: string }) => void; onCopy?: () => void; onRegenerate?: () => void }) {
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-0.5 text-ds-muted-foreground">
        {onCopy && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={copied ? "Copied" : "Copy"}
            onClick={() => {
              onCopy();
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? <Check /> : <Copy />}
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" aria-label="Good response" aria-pressed={rating === "up"} onClick={() => { setRating("up"); onFeedback?.({ rating: "up" }); }} className={cn(rating === "up" && "text-ds-success")}>
          <ThumbsUp />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Bad response" aria-pressed={rating === "down"} onClick={() => setRating("down")} className={cn(rating === "down" && "text-ds-destructive")}>
          <ThumbsDown />
        </Button>
        {onRegenerate && (
          <Button variant="ghost" size="icon-sm" aria-label="Regenerate" onClick={onRegenerate}>
            <RotateCcw />
          </Button>
        )}
      </div>
      {rating === "down" && !reason && (
        <div className="ds-animate-in flex flex-wrap items-center gap-1.5" role="group" aria-label="What went wrong?">
          <span className="text-xs text-ds-muted-foreground">What went wrong?</span>
          {REASONS.map((r) => (
            <button
              key={r}
              onClick={() => {
                setReason(r);
                onFeedback?.({ rating: "down", reason: r });
              }}
              className="rounded-full border px-2.5 py-1 text-xs transition-colors hover:bg-ds-accent"
            >
              {r}
            </button>
          ))}
        </div>
      )}
      {reason && <p className="text-xs text-ds-muted-foreground" role="status">Thanks — this helps Aura improve.</p>}
    </div>
  );
}

/* ── ChatMessage ── */
export function ChatMessage({
  role,
  name,
  children,
  meta,
  footer,
  className,
}: {
  role: "user" | "assistant" | "system";
  name?: string;
  children: React.ReactNode;
  /** Small line under the name: model, time, "edited". */
  meta?: React.ReactNode;
  /** Feedback row, citations, actions. */
  footer?: React.ReactNode;
  className?: string;
}) {
  if (role === "system")
    return (
      <div role="note" className={cn("mx-auto flex w-fit items-center gap-2 rounded-full bg-ds-muted px-3 py-1 text-xs text-ds-muted-foreground", className)}>
        {children}
      </div>
    );
  const user = role === "user";
  return (
    <article aria-label={user ? "You said" : `${name ?? "Aura"} replied`} className={cn("flex gap-3", user && "flex-row-reverse", className)}>
      {!user && (
        <span aria-hidden className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-(image:--ds-ai-gradient) text-white">
          <Sparkles className="size-3.5" />
        </span>
      )}
      <div className={cn("grid max-w-[85%] min-w-0 gap-1.5", user && "justify-items-end")}>
        {!user && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold">{name ?? "Aura"}</span>
            {meta && <span className="text-ds-muted-foreground">{meta}</span>}
          </div>
        )}
        <div className={cn("text-sm leading-relaxed", user ? "rounded-ds-xl rounded-tr-ds-sm bg-ds-primary px-3.5 py-2 text-ds-primary-foreground" : "text-ds-foreground")}>{children}</div>
        {footer}
      </div>
    </article>
  );
}

/* ── SuggestionChips ── */
export function SuggestionChips({ suggestions, onPick, className }: { suggestions: string[]; onPick: (s: string) => void; className?: string }) {
  return (
    <div role="group" aria-label="Suggestions" className={cn("flex flex-wrap gap-2", className)}>
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onPick(s)}
          className="inline-flex items-center gap-1.5 rounded-full border bg-ds-background px-3 py-1.5 text-[13px] shadow-ds-1 transition-colors outline-none hover:border-ds-ai-accent/40 hover:bg-ds-ai focus-visible:ring-3 focus-visible:ring-ds-ring/30"
        >
          <Sparkles className="size-3.5 text-ds-ai-accent" />
          {s}
        </button>
      ))}
    </div>
  );
}

/* ── VoiceInput ── */
export type VoiceState = "idle" | "listening" | "processing";
/** Controlled: the app owns speech recognition and passes the state in. */
export function VoiceInput({ state, onStart, onStop }: { state: VoiceState; onStart: () => void; onStop: () => void }) {
  const toggle = () => (state === "listening" ? onStop() : onStart());
  return (
    <div className="flex items-center gap-3 rounded-full border bg-ds-background py-1.5 pr-4 pl-1.5 shadow-ds-1">
      <Button size="icon" variant={state === "listening" ? "ai" : "secondary"} onClick={toggle} aria-pressed={state === "listening"} aria-label={state === "listening" ? "Stop listening" : "Start voice input"} disabled={state === "processing"} className="rounded-full">
        <Mic />
      </Button>
      <div className="flex h-6 items-center gap-[3px]" aria-hidden>
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            className={cn("w-[3px] origin-center rounded-full bg-ds-ai-accent/70", state === "listening" ? "[animation:ds-wave_900ms_ease-in-out_infinite]" : "scale-y-[0.25]")}
            style={{ height: "100%", animationDelay: `${(i % 6) * 90}ms` }}
          />
        ))}
      </div>
      <span role="status" className="text-sm text-ds-muted-foreground">
        {state === "idle" ? "Tap to speak" : state === "listening" ? "Listening…" : "Transcribing…"}
      </span>
    </div>
  );
}
