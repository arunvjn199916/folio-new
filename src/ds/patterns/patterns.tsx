"use client";

import { useState } from "react";
import { Bot, FileText, FolderKanban, History, MessageSquarePlus, Search, Settings, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Separator } from "../ui/primitives";
import { RadioGroup, RadioGroupItem, Switch, Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/controls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/menus";
import { TooltipProvider } from "../ui/overlays";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { ChatMessage, MessageFeedback, PromptInput, Reasoning, StreamingText, SuggestionChips, ThinkingIndicator } from "../ai/conversation";
import { AgentPlan, ApprovalCard, Citation, ConfidenceIndicator, SourcesPanel, ToolCall, UndoToast, UsageMeter, type Source } from "../ai/agent";
import { AIEmptyState, ArtifactPanel } from "../ai/states";
import { conversations, models, reasoningSteps, reply, sources, suggestions } from "../docs/sample";
import { cn } from "@/lib/utils";

// Full screens assembled only from Aura components — the proof that the system covers
// real AI product work: a chat workspace, an agent run, AI search, and permissions.

/** Renders text with [n] markers as Citation chips. */
export function CitedText({ text, sources: list }: { text: string; sources: Source[] }) {
  return (
    <>
      {text.split(/(\[\d+\])/).map((part, i) => {
        const m = part.match(/^\[(\d+)\]$/);
        const src = m && list.find((s) => s.id === Number(m[1]));
        return src ? <Citation key={i} source={src} /> : <span key={i}>{part}</span>;
      })}
    </>
  );
}

const citedReply =
  "Onboarding is the biggest pain point this quarter — setup takes longer than people expect [1], and it shows up in support volume [2]. NPS still improved from 31 to 36, but detractors keep asking for integrations and faster exports [3]. Both are already on the H2 roadmap [4], so the quickest win is a guided setup checklist.";

/* ── Chat workspace ── */
export function ChatWorkspace() {
  const [model, setModel] = useState("aura-pro");
  const [phase, setPhase] = useState<"empty" | "thinking" | "streaming" | "done">("done");
  const [artifact, setArtifact] = useState(false);
  const ask = () => {
    setPhase("thinking");
    setTimeout(() => setPhase("streaming"), 1200);
  };
  return (
    <TooltipProvider>
      <SidebarProvider className="h-[640px] overflow-hidden rounded-ds-xl border bg-ds-background">
        <Sidebar>
          <SidebarHeader>
            <span className="grid size-7 place-items-center rounded-ds-md bg-(image:--ds-ai-gradient) text-white">
              <Sparkles className="size-4" />
            </span>
            <span className="font-semibold group-data-[collapsed=true]/sidebar:sr-only">Aura</span>
            <SidebarTrigger className="ml-auto group-data-[collapsed=true]/sidebar:ml-0" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem icon={MessageSquarePlus} label="New chat" onClick={() => setPhase("empty")} />
              <SidebarItem icon={Search} label="Search" />
              <SidebarItem icon={FolderKanban} label="Projects" />
            </SidebarGroup>
            <SidebarGroup label="Recent">
              {conversations.map((c, i) => (
                <SidebarItem key={c} icon={History} label={c} active={i === 0 && phase !== "empty"} />
              ))}
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem icon={Settings} label="Settings" />
          </SidebarFooter>
        </Sidebar>

        <main className="flex min-w-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-12 items-center gap-2 border-b px-4">
              <p className="truncate text-sm font-medium">{phase === "empty" ? "New chat" : conversations[0]}</p>
              <Badge variant="ai" className="ml-1">
                4 sources
              </Badge>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setArtifact((a) => !a)} aria-pressed={artifact}>
                <FileText /> Brief
              </Button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8">
              {phase === "empty" ? (
                <AIEmptyState title="What should we work on?" description="Aura can read your connected tools, draft documents and run multi-step tasks — always with your approval.">
                  <SuggestionChips suggestions={["Summarise Q3 feedback", "Plan next sprint", "Draft a launch email"]} onPick={ask} className="justify-center" />
                </AIEmptyState>
              ) : (
                <div className="mx-auto grid max-w-2xl gap-6">
                  <ChatMessage role="user">Summarise what customers told us in Q3 and what we should do first.</ChatMessage>
                  <ChatMessage
                    role="assistant"
                    meta={models.find((m) => m.id === model)?.name}
                    footer={
                      phase === "done" && (
                        <div className="grid gap-4">
                          <ConfidenceIndicator level="high" reason="4 sources agree" />
                          <SourcesPanel sources={sources} />
                          <MessageFeedback onCopy={() => navigator.clipboard?.writeText(reply)} onRegenerate={ask} />
                          <SuggestionChips suggestions={suggestions} onPick={ask} />
                        </div>
                      )
                    }
                  >
                    {phase === "thinking" ? (
                      <ThinkingIndicator label="Reading 4 sources" />
                    ) : (
                      <div className="grid gap-3">
                        <Reasoning steps={reasoningSteps} seconds={6} />
                        {phase === "streaming" ? <StreamingText text={reply} streaming /> : <p><CitedText text={citedReply} sources={sources} /></p>}
                      </div>
                    )}
                  </ChatMessage>
                  {phase === "streaming" && (
                    <Button variant="link" size="sm" className="w-fit" onClick={() => setPhase("done")}>
                      Skip to the end
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="px-4 pb-4 sm:px-8">
              <PromptInput
                className="mx-auto max-w-2xl"
                busy={phase === "thinking" || phase === "streaming"}
                onStop={() => setPhase("done")}
                onSubmit={ask}
                onAttach={() => {}}
                models={models}
                model={model}
                onModelChange={setModel}
              />
              <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-ds-muted-foreground">Aura can make mistakes. Check important facts against the sources.</p>
            </div>
          </div>
          {artifact && (
            <ArtifactPanel title="Q3 feedback brief" kind="Document · draft" onClose={() => setArtifact(false)} className="m-3 hidden w-80 shrink-0 lg:flex">
              <h4 className="font-semibold">Q3 customer feedback</h4>
              <p className="mt-2 text-sm text-ds-muted-foreground">Top theme: onboarding friction. Recommended first step: a guided setup checklist, shipping alongside the November roadmap items.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                <li>NPS 31 → 36</li>
                <li>Tickets +12% (setup, invoices)</li>
                <li>Asks: integrations, faster exports</li>
              </ul>
            </ArtifactPanel>
          )}
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}

/* ── Agent run ── */
export function AgentRun() {
  const [stage, setStage] = useState<"approval" | "running" | "done" | "rejected">("approval");
  const [undone, setUndone] = useState(false);
  const steps = [
    { label: "Find churn-risk accounts", detail: "Billing + usage data, last 30 days", status: "done" as const },
    { label: "Draft a check-in email per account", detail: "12 drafts, personalised", status: "done" as const },
    { label: "Schedule emails for Tuesday 10:00", detail: "Needs your approval", status: stage === "approval" ? ("running" as const) : stage === "rejected" ? ("skipped" as const) : ("done" as const) },
    { label: "Log follow-ups in the CRM", status: stage === "done" ? ("done" as const) : stage === "running" ? ("running" as const) : ("pending" as const) },
  ];
  return (
    <div className="grid gap-4 rounded-ds-xl border bg-ds-background p-4 sm:p-6 lg:grid-cols-[1fr_320px]">
      <div className="grid content-start gap-4">
        <ChatMessage role="user">Reach out to accounts that might churn this month.</ChatMessage>
        <ChatMessage role="assistant" meta="Agent · Aura Deep">
          <div className="grid gap-3">
            <p>I found 12 accounts with falling usage and an upcoming renewal. I’ve drafted check-in emails — scheduling them needs your go-ahead.</p>
            <ToolCall tool="billing.query" summary="12 accounts with renewal in ≤30 days and usage −40%" status="done" duration="1.2s" input={'{ "renewal_within_days": 30, "usage_drop": 0.4 }'} output="12 rows · Acme Ltd, Northwind, Globex, …" />
            <ToolCall tool="email.draft" summary="Drafted 12 personalised check-in emails" status="done" duration="4.8s" />
            {stage === "approval" && (
              <ApprovalCard
                title="Schedule 12 emails"
                description="These go to customers from your address. You can edit any draft first."
                risk="medium"
                changes={[
                  { label: "Recipients", to: "12 account owners" },
                  { label: "Send time", to: "Tue, 10:00 (their local time)" },
                  { label: "From", to: "you@aura.app" },
                ]}
                onApprove={() => setStage("running")}
                onEdit={() => {}}
                onReject={() => setStage("rejected")}
              />
            )}
            {stage === "running" && <ToolCall tool="email.schedule" summary="Scheduling 12 emails" status="running" />}
            {stage === "rejected" && <p className="text-sm text-ds-muted-foreground">Okay — nothing was sent. The drafts are saved in your outbox.</p>}
          </div>
        </ChatMessage>
        {stage === "running" && !undone && <UndoToast message="12 emails scheduled for Tuesday" seconds={8} onUndo={() => { setUndone(true); setStage("rejected"); }} onExpire={() => setStage("done")} />}
      </div>
      <AgentPlan title="Churn outreach" steps={steps} />
    </div>
  );
}

/* ── AI search ── */
export function AISearch() {
  return (
    <div className="grid gap-5 rounded-ds-xl border bg-ds-background p-4 sm:p-6">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ds-muted-foreground" />
        <Input defaultValue="why did support tickets go up in September?" aria-label="Search" className="h-11 pl-9" />
      </div>
      <Tabs defaultValue="answer">
        <TabsList>
          <TabsTrigger value="answer">
            <Sparkles /> Answer
          </TabsTrigger>
          <TabsTrigger value="sources">Sources · 4</TabsTrigger>
        </TabsList>
        <TabsContent value="answer" className="mt-3 grid gap-3">
          <div className="rounded-ds-lg border border-ds-ai-accent/20 bg-ds-ai p-4 text-sm leading-relaxed text-ds-ai-foreground">
            <p>
              <CitedText text="Tickets rose 12% in September [2], driven by password resets and invoice questions. Both trace back to the new billing page launched on 2 Sep, which moved the reset link [1]." sources={sources} />
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <ConfidenceIndicator level="medium" reason="the launch link is inferred" />
            </div>
          </div>
          <SourcesPanel sources={sources.slice(0, 2)} />
        </TabsContent>
        <TabsContent value="sources" className="mt-3">
          <SourcesPanel sources={sources} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── Settings & permissions ── */
const DATA_SOURCES = [
  { id: "drive", name: "Google Drive", note: "Read documents you choose" },
  { id: "slack", name: "Slack", note: "Read public channels" },
  { id: "crm", name: "HubSpot", note: "Read and update contacts" },
  { id: "mail", name: "Gmail", note: "Draft — never send — emails" },
];
export function SettingsPermissions() {
  const [on, setOn] = useState<Record<string, boolean>>({ drive: true, slack: true, crm: false, mail: true });
  return (
    <div className="grid gap-4 rounded-ds-xl border bg-ds-background p-4 sm:p-6 md:grid-cols-[1fr_280px]">
      <Card>
        <CardHeader>
          <CardTitle>What Aura can access</CardTitle>
          <CardDescription>Aura only reads what you switch on. Changes apply immediately.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1">
          {DATA_SOURCES.map((d, i) => (
            <div key={d.id}>
              {i > 0 && <Separator className="my-2" />}
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor={`src-${d.id}`} className="grid gap-1 font-normal">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-xs text-ds-muted-foreground">{d.note}</span>
                </Label>
                <Switch id={`src-${d.id}`} checked={on[d.id]} onCheckedChange={(v) => setOn((o) => ({ ...o, [d.id]: v }))} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="grid content-start gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Agent autonomy</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="ask">
              {[
                ["suggest", "Suggest only"],
                ["ask", "Ask before acting"],
                ["auto", "Act on low-risk tasks"],
              ].map(([v, l]) => (
                <Label key={v} className="font-normal">
                  <RadioGroupItem value={v} /> {l}
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Default model</CardTitle>
          </CardHeader>
          <CardContent>
            <Select defaultValue="aura-pro">
              <SelectTrigger className="w-full" aria-label="Default model">
                <Bot />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card className={cn("gap-3")}>
          <CardHeader>
            <CardTitle className="text-sm">Usage this month</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageMeter used={7420} limit={10000} resetsIn="6 days" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
