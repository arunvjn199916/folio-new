"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, ChevronDown, CircleDashed, ExternalLink, Loader2, Pencil, ShieldCheck, Undo2, Wrench, X, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Badge, Progress } from "../ui/primitives";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/controls";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/overlays";
import { cn } from "@/lib/utils";

/*
  Agent & trust components: ToolCall, AgentPlan, ApprovalCard, UndoToast,
  ConfidenceIndicator, Citation, SourcesPanel, UsageMeter.
  Principles: show the work, keep a human in the loop for consequential actions,
  be honest about uncertainty, make everything recoverable.
*/

export type StepStatus = "pending" | "running" | "done" | "failed" | "skipped";

const STATUS_ICON: Record<StepStatus, React.ReactNode> = {
  pending: <CircleDashed className="size-4 text-ds-muted-foreground" />,
  running: <Loader2 className="size-4 animate-spin text-ds-ai-accent" />,
  done: <Check className="size-4 text-ds-success" />,
  failed: <XCircle className="size-4 text-ds-destructive" />,
  skipped: <CircleDashed className="size-4 text-ds-muted-foreground opacity-50" />,
};
const STATUS_LABEL: Record<StepStatus, string> = { pending: "Pending", running: "Running", done: "Done", failed: "Failed", skipped: "Skipped" };

/* ── ToolCall ── */
export function ToolCall({
  tool,
  summary,
  status,
  input,
  output,
  duration,
}: {
  tool: string;
  summary: string;
  status: Exclude<StepStatus, "skipped" | "pending">;
  input?: string;
  output?: string;
  duration?: string;
}) {
  return (
    <Collapsible className="group/tool rounded-ds-lg border bg-ds-card text-sm">
      <CollapsibleTrigger className="flex w-full items-center gap-2.5 rounded-ds-lg px-3 py-2 text-left outline-none hover:bg-ds-muted/50 focus-visible:ring-3 focus-visible:ring-ds-ring/30">
        <span className="grid size-6 place-items-center rounded-ds-sm bg-ds-muted">
          <Wrench className="size-3.5 text-ds-muted-foreground" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-mono text-xs text-ds-muted-foreground">{tool}</span>
          <span className="block truncate">{summary}</span>
        </span>
        <span role="status" className="flex items-center gap-1.5 text-xs text-ds-muted-foreground">
          {STATUS_ICON[status]}
          <span className="sr-only">{STATUS_LABEL[status]}</span>
          {duration && <span aria-hidden>{duration}</span>}
        </span>
        <ChevronDown className="size-4 text-ds-muted-foreground transition-transform group-data-[state=open]/tool:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="grid gap-2 border-t px-3 py-3">
        {input && (
          <div>
            <p className="text-[11px] font-medium tracking-wide text-ds-muted-foreground uppercase">Input</p>
            <pre className="mt-1 overflow-x-auto rounded-ds-md bg-ds-muted p-2 font-mono text-xs">{input}</pre>
          </div>
        )}
        {output && (
          <div>
            <p className="text-[11px] font-medium tracking-wide text-ds-muted-foreground uppercase">Output</p>
            <pre className={cn("mt-1 overflow-x-auto rounded-ds-md bg-ds-muted p-2 font-mono text-xs", status === "failed" && "text-ds-destructive")}>{output}</pre>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ── AgentPlan ── */
export function AgentPlan({ title, steps }: { title: string; steps: { label: string; detail?: string; status: StepStatus }[] }) {
  const done = steps.filter((s) => s.status === "done").length;
  return (
    <section aria-label={title} className="rounded-ds-lg border bg-ds-card p-4">
      <header className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold">{title}</h4>
        <span className="text-xs text-ds-muted-foreground tabular-nums">
          {done} of {steps.length}
        </span>
      </header>
      <Progress value={(done / steps.length) * 100} aria-label={`${done} of ${steps.length} steps done`} className="mt-3 h-1" indicatorClassName="bg-(image:--ds-ai-gradient)" />
      <ol className="mt-4 grid gap-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3" aria-current={s.status === "running" ? "step" : undefined}>
            <span className="mt-0.5">{STATUS_ICON[s.status]}</span>
            <span className="min-w-0">
              <span className={cn("block text-sm", s.status === "pending" && "text-ds-muted-foreground", s.status === "skipped" && "text-ds-muted-foreground line-through")}>{s.label}</span>
              {s.detail && <span className="block text-xs text-ds-muted-foreground">{s.detail}</span>}
              <span className="sr-only">{STATUS_LABEL[s.status]}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── ApprovalCard (human in the loop) ── */
export function ApprovalCard({
  title,
  description,
  changes,
  risk = "medium",
  onApprove,
  onEdit,
  onReject,
}: {
  title: string;
  description: string;
  /** What will change, shown before anything happens. */
  changes: { label: string; from?: string; to: string }[];
  risk?: "low" | "medium" | "high";
  onApprove: () => void;
  onEdit?: () => void;
  onReject: () => void;
}) {
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  return (
    <section aria-labelledby="approval-title" className="rounded-ds-lg border border-ds-human/30 bg-ds-human-surface p-4">
      <header className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ds-human/15 text-ds-human">
          <ShieldCheck className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 id="approval-title" className="text-sm font-semibold">
              {title}
            </h4>
            <Badge variant={risk === "high" ? "destructive" : risk === "medium" ? "warning" : "secondary"}>{risk} impact</Badge>
          </div>
          <p className="mt-0.5 text-sm text-ds-muted-foreground">{description}</p>
        </div>
      </header>
      <dl className="mt-3 grid gap-1.5 rounded-ds-md border bg-ds-background p-3 text-sm">
        {changes.map((c) => (
          <div key={c.label} className="grid grid-cols-[120px_1fr] gap-2">
            <dt className="text-ds-muted-foreground">{c.label}</dt>
            <dd>
              {c.from && <span className="mr-1.5 text-ds-muted-foreground line-through">{c.from}</span>}
              <span className="font-medium">{c.to}</span>
            </dd>
          </div>
        ))}
      </dl>
      {decision ? (
        <p role="status" className="mt-3 flex items-center gap-2 text-sm">
          {decision === "approved" ? <Check className="size-4 text-ds-success" /> : <X className="size-4 text-ds-destructive" />}
          {decision === "approved" ? "Approved — Aura is carrying this out." : "Rejected — nothing was changed."}
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => { setDecision("approved"); onApprove(); }}>
            Approve
          </Button>
          {onEdit && (
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Pencil /> Edit
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => { setDecision("rejected"); onReject(); }}>
            Reject
          </Button>
        </div>
      )}
    </section>
  );
}

/* ── UndoToast ── */
export function UndoToast({ message, seconds = 10, onUndo, onExpire }: { message: string; seconds?: number; onUndo: () => void; onExpire?: () => void }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) {
      onExpire?.();
      return;
    }
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [left, onExpire]);
  if (left <= 0) return null;
  return (
    <div role="status" className="ds-animate-in flex items-center gap-3 rounded-ds-lg bg-ds-foreground py-2 pr-2 pl-4 text-sm text-ds-background shadow-ds-4">
      <span className="min-w-0 flex-1 truncate">{message}</span>
      <Button size="sm" variant="secondary" onClick={onUndo} className="bg-ds-background/15 text-ds-background hover:bg-ds-background/25">
        <Undo2 /> Undo <span className="tabular-nums opacity-70">{left}s</span>
      </Button>
    </div>
  );
}

/* ── ConfidenceIndicator ── */
const CONF = {
  high: { label: "High confidence", color: "bg-ds-confidence-high", text: "text-ds-confidence-high", bars: 3 },
  medium: { label: "Medium confidence", color: "bg-ds-confidence-medium", text: "text-ds-confidence-medium", bars: 2 },
  low: { label: "Low confidence", color: "bg-ds-confidence-low", text: "text-ds-confidence-low", bars: 1 },
} as const;
/** Never colour alone: bars + label, and an optional reason. */
export function ConfidenceIndicator({ level, reason }: { level: keyof typeof CONF; reason?: string }) {
  const c = CONF[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", c.text)} title={reason}>
      <span aria-hidden className="flex items-end gap-[2px]">
        {[1, 2, 3].map((b) => (
          <span key={b} className={cn("w-[3px] rounded-full", b <= c.bars ? c.color : "bg-ds-border")} style={{ height: 4 + b * 3 }} />
        ))}
      </span>
      {c.label}
      {reason && <span className="font-normal text-ds-muted-foreground">· {reason}</span>}
    </span>
  );
}

/* ── Citation + SourcesPanel ── */
export type Source = { id: number; title: string; url: string; site: string; snippet: string };
export function Citation({ source }: { source: Source }) {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Source ${source.id}: ${source.title}`}
          className="mx-0.5 inline-grid size-[18px] translate-y-[-1px] place-items-center rounded-full bg-ds-citation-surface align-middle text-[10px] font-semibold text-ds-citation no-underline transition-colors hover:bg-ds-citation hover:text-white"
        >
          {source.id}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <p className="text-xs text-ds-muted-foreground">{source.site}</p>
        <p className="mt-0.5 text-sm font-medium">{source.title}</p>
        <p className="mt-1.5 line-clamp-3 text-xs text-ds-muted-foreground">{source.snippet}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
export function SourcesPanel({ sources }: { sources: Source[] }) {
  return (
    <section aria-label="Sources" className="grid gap-2">
      <h4 className="text-xs font-medium tracking-wide text-ds-muted-foreground uppercase">Sources</h4>
      <ol className="grid gap-2 sm:grid-cols-2">
        {sources.map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="group flex gap-2.5 rounded-ds-md border bg-ds-card p-2.5 transition-colors hover:border-ds-citation/40 hover:bg-ds-citation-surface/50">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ds-citation-surface text-[10px] font-semibold text-ds-citation">{s.id}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{s.title}</span>
                <span className="flex items-center gap-1 text-xs text-ds-muted-foreground">
                  {s.site} <ExternalLink className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── UsageMeter ── */
export function UsageMeter({ used, limit, unit = "credits", resetsIn }: { used: number; limit: number; unit?: string; resetsIn?: string }) {
  const pct = Math.min(100, (used / limit) * 100);
  const tone = pct >= 90 ? "bg-ds-destructive" : pct >= 70 ? "bg-ds-warning" : "bg-ds-primary";
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">
          {used.toLocaleString()} / {limit.toLocaleString()} {unit}
        </span>
        {resetsIn && <span className="text-ds-muted-foreground">Resets in {resetsIn}</span>}
      </div>
      <Progress value={pct} aria-label={`${Math.round(pct)}% of ${unit} used`} className="h-1.5" indicatorClassName={tone} />
      {pct >= 90 && (
        <p className="flex items-center gap-1.5 text-xs text-ds-destructive">
          <AlertTriangle className="size-3.5" /> Almost at your limit
        </p>
      )}
    </div>
  );
}
