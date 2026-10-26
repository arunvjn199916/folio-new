"use client";

import { Clock, FileText, Maximize2, ShieldAlert, Sparkles, WifiOff, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// AI states and surfaces: AIEmptyState, AIErrorState, ArtifactPanel.

/* ── AIEmptyState ── */
export function AIEmptyState({ title, description, children, className }: { title: string; description: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto grid max-w-md justify-items-center gap-3 px-6 py-10 text-center", className)}>
      <span className="relative grid size-12 place-items-center rounded-ds-xl bg-(image:--ds-ai-gradient) text-white shadow-ds-3">
        <Sparkles className="size-5" />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-ds-muted-foreground">{description}</p>
      {children && <div className="mt-2 w-full">{children}</div>}
    </div>
  );
}

/* ── AIErrorState ── */
const ERRORS = {
  "rate-limit": { icon: Clock, title: "You've hit the hourly limit", body: "Aura will be ready again in a few minutes. Your draft is saved.", action: "Try again" },
  refusal: { icon: ShieldAlert, title: "Aura can't help with that", body: "This request goes against the usage policy. Try rephrasing what you need.", action: "Rephrase" },
  offline: { icon: WifiOff, title: "You're offline", body: "Your message is queued and will send when you're back online.", action: "Retry now" },
  failed: { icon: ShieldAlert, title: "Something went wrong", body: "Aura couldn't finish this response. Nothing was changed.", action: "Retry" },
} as const;
export type AIErrorKind = keyof typeof ERRORS;
export function AIErrorState({ kind, onAction, detail }: { kind: AIErrorKind; onAction?: () => void; detail?: string }) {
  const e = ERRORS[kind];
  const Icon = e.icon;
  return (
    <div role="alert" className="flex gap-3 rounded-ds-lg border bg-ds-card p-4">
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", kind === "offline" ? "bg-ds-muted text-ds-muted-foreground" : "bg-ds-destructive/10 text-ds-destructive")}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{e.title}</p>
        <p className="mt-0.5 text-sm text-ds-muted-foreground">{detail ?? e.body}</p>
        {onAction && (
          <Button size="sm" variant="outline" className="mt-3" onClick={onAction}>
            {e.action}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── ArtifactPanel ── */
export function ArtifactPanel({ title, kind, children, onClose, actions, className }: { title: string; kind: string; children: React.ReactNode; onClose?: () => void; actions?: React.ReactNode; className?: string }) {
  return (
    <section aria-label={title} className={cn("flex h-full min-h-0 flex-col rounded-ds-lg border bg-ds-card shadow-ds-2", className)}>
      <header className="flex items-center gap-2 border-b px-3 py-2">
        <FileText className="size-4 text-ds-ai-accent" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="text-[11px] text-ds-muted-foreground">{kind}</p>
        </div>
        {actions}
        <Button variant="ghost" size="icon-sm" aria-label="Expand">
          <Maximize2 />
        </Button>
        {onClose && (
          <Button variant="ghost" size="icon-sm" aria-label="Close artifact" onClick={onClose}>
            <X />
          </Button>
        )}
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
    </section>
  );
}
