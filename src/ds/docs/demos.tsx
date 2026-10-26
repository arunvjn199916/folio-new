"use client";

import { useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Bold, Copy, FileText, Globe, Grid2x2, Italic, LayoutList, Mail, MessageSquarePlus, Paperclip, Pencil, Search, Settings, Sparkles, Trash2, Underline } from "lucide-react";
import { Button } from "../ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Kbd,
  Label,
  Progress,
  Separator,
  Skeleton,
  Textarea,
} from "../ui/primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from "../ui/controls";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/overlays";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/menus";
import { Breadcrumb, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, Pagination, ScrollArea, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/data";
import { Calendar, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, ResizableHandle, ResizablePanel, ResizablePanelGroup, toast } from "../ui/pickers";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, zodResolver } from "../ui/form";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarItem, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { ChatMessage, MessageFeedback, ModelSelector, PromptInput, Reasoning, StreamingText, SuggestionChips, ThinkingIndicator, VoiceInput, type VoiceState } from "../ai/conversation";
import { AgentPlan, ApprovalCard, Citation, ConfidenceIndicator, SourcesPanel, ToolCall, UndoToast, UsageMeter } from "../ai/agent";
import { AIEmptyState, AIErrorState, ArtifactPanel } from "../ai/states";
import { AISearch, AgentRun, ChatWorkspace, CitedText, SettingsPermissions } from "../patterns/patterns";
import { conversations, models, reasoningSteps, reply, sources, suggestions } from "./sample";

// Live previews for every docs entry. Each is the real component, wired with sample data.

const Row = ({ children }: { children: React.ReactNode }) => <div className="flex flex-wrap items-center gap-3">{children}</div>;

function FormDemo() {
  const schema = z.object({ name: z.string().min(2, "Give the agent a name of at least 2 characters."), goal: z.string().min(10, "Describe the goal in a sentence.") });
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: "", goal: "" } });
  const [saved, setSaved] = useState<string | null>(null);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => setSaved(v.name))} className="grid w-full max-w-sm gap-4" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent name</FormLabel>
              <FormControl>
                <Input placeholder="Churn watcher" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal</FormLabel>
              <FormControl>
                <Textarea placeholder="Flag accounts likely to churn each Monday" {...field} />
              </FormControl>
              <FormDescription>Aura will ask before taking any action.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit">
          Create agent
        </Button>
        {saved && <p role="status" className="text-sm text-ds-success">“{saved}” created.</p>}
      </form>
    </Form>
  );
}

function PromptDemo() {
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState("aura-pro");
  const [files, setFiles] = useState([{ id: "1", name: "q3-feedback.csv", size: "84 KB" }]);
  return (
    <div className="grid w-full max-w-xl gap-2">
      <PromptInput
        busy={busy}
        onSubmit={() => {
          setBusy(true);
          setTimeout(() => setBusy(false), 2500);
        }}
        onStop={() => setBusy(false)}
        attachments={files}
        onRemoveAttachment={(id) => setFiles((f) => f.filter((x) => x.id !== id))}
        onAttach={() => setFiles((f) => [...f, { id: String(Date.now()), name: "roadmap-h2.pdf", size: "1.2 MB" }])}
        models={models}
        model={model}
        onModelChange={setModel}
      />
      <p className="text-xs text-ds-muted-foreground">{busy ? "Generating — press Stop to interrupt." : "Type and press Enter. Shift+Enter for a new line."}</p>
    </div>
  );
}

function StreamingDemo() {
  const [run, setRun] = useState(0);
  return (
    <div className="grid w-full max-w-xl gap-3">
      <StreamingText key={run} text={reply} streaming />
      <Button variant="outline" size="sm" className="w-fit" onClick={() => setRun((r) => r + 1)}>
        Replay
      </Button>
    </div>
  );
}

function VoiceDemo() {
  const [state, setState] = useState<VoiceState>("idle");
  const [text, setText] = useState("");
  return (
    <div className="grid gap-3">
      <VoiceInput
        state={state}
        onStart={() => setState("listening")}
        onStop={() => {
          setState("processing");
          setTimeout(() => {
            setState("idle");
            setText("Summarise this week's customer feedback");
          }, 1200);
        }}
      />
      {text && <p className="text-sm">“{text}”</p>}
    </div>
  );
}

function UndoDemo() {
  const [key, setKey] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="grid w-full max-w-md gap-3">
      <UndoToast key={key} message="Moved 3 meetings to Thursday" seconds={10} onUndo={() => setMsg("Undone — meetings are back where they were.")} onExpire={() => setMsg("Done — the change is final.")} />
      {msg && <p role="status" className="text-sm text-ds-muted-foreground">{msg}</p>}
      <Button variant="outline" size="sm" className="w-fit" onClick={() => { setMsg(null); setKey((k) => k + 1); }}>
        Show again
      </Button>
    </div>
  );
}

function ApprovalDemo() {
  const [key, setKey] = useState(0);
  return (
    <div className="grid w-full max-w-lg gap-3">
      <ApprovalCard
        key={key}
        title="Send renewal reminder"
        description="Aura drafted a reminder to Acme Ltd about their renewal on 30 Nov."
        risk="medium"
        changes={[
          { label: "To", to: "priya@acme.example" },
          { label: "Discount", from: "0%", to: "10%" },
          { label: "Send", to: "Now" },
        ]}
        onApprove={() => {}}
        onEdit={() => {}}
        onReject={() => {}}
      />
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => setKey((k) => k + 1)}>
        Reset
      </Button>
    </div>
  );
}

function SliderDemo() {
  const [v, setV] = useState([0.7]);
  return (
    <div className="grid w-full max-w-sm gap-3">
      <div className="flex justify-between text-sm">
        <Label>Creativity</Label>
        <span className="text-ds-muted-foreground tabular-nums">{v[0].toFixed(1)}</span>
      </div>
      <Slider value={v} onValueChange={setV} max={1} step={0.1} aria-label="Creativity" />
    </div>
  );
}

// "Today" only exists in the browser: the calendar renders after hydration, with a same-size
// placeholder during prerender (reading the clock while prerendering is not allowed).
const noop = () => () => {};
function CalendarDemo() {
  const client = useSyncExternalStore(noop, () => true, () => false);
  const [date, setDate] = useState<Date | undefined>();
  if (!client) return <Skeleton className="h-[300px] w-[276px] rounded-ds-lg" />;
  return <Calendar mode="single" selected={date ?? new Date()} onSelect={setDate} className="rounded-ds-lg border shadow-ds-1" />;
}

function PaginationDemo() {
  const [page, setPage] = useState(3);
  return <Pagination page={page} pages={9} onPage={setPage} />;
}

function SidebarDemo() {
  const [active, setActive] = useState(conversations[0]);
  return (
    <SidebarProvider className="h-80 w-full max-w-md overflow-hidden rounded-ds-lg border">
      <Sidebar>
        <SidebarHeader>
          <span className="font-semibold group-data-[collapsed=true]/sidebar:sr-only">Aura</span>
          <SidebarTrigger className="ml-auto group-data-[collapsed=true]/sidebar:ml-0" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem icon={MessageSquarePlus} label="New chat" />
            <SidebarItem icon={Search} label="Search" />
          </SidebarGroup>
          <SidebarGroup label="Recent">
            {conversations.slice(0, 3).map((c) => (
              <SidebarItem key={c} icon={FileText} label={c} active={active === c} onClick={() => setActive(c)} />
            ))}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="grid flex-1 place-items-center text-sm text-ds-muted-foreground">{active}</div>
    </SidebarProvider>
  );
}

export const demos: Record<string, () => React.ReactNode> = {
  button: () => (
    <div className="grid gap-4">
      <Row>
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="link">Link</Button>
      </Row>
      <Row>
        <Button variant="ai">
          <Sparkles /> Generate
        </Button>
        <Button loading>Saving</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="Copy">
          <Copy />
        </Button>
        <Button disabled>Disabled</Button>
      </Row>
    </div>
  ),
  badge: () => (
    <Row>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Live</Badge>
      <Badge variant="warning">Review</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="ai">
        <Sparkles /> AI
      </Badge>
    </Row>
  ),
  card: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Weekly digest</CardTitle>
        <CardDescription>Aura summarises your workspace every Monday.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">12 docs changed · 3 decisions logged · 2 open questions</CardContent>
      <CardFooter>
        <Button size="sm">Open digest</Button>
        <Button size="sm" variant="ghost">
          Settings
        </Button>
      </CardFooter>
    </Card>
  ),
  input: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-2">
        <Label htmlFor="d-email">Work email</Label>
        <Input id="d-email" type="email" placeholder="you@company.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="d-bad">With error</Label>
        <Input id="d-bad" aria-invalid defaultValue="not-an-email" aria-describedby="d-bad-msg" />
        <p id="d-bad-msg" className="text-sm text-ds-destructive">Enter a valid email address.</p>
      </div>
      <Input disabled placeholder="Disabled" aria-label="Disabled input" />
    </div>
  ),
  textarea: () => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="d-ta">Instructions for Aura</Label>
      <Textarea id="d-ta" placeholder="Always reply in British English and keep summaries under 100 words." />
    </div>
  ),
  label: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="d-lbl" />
      <Label htmlFor="d-lbl">Clicking the label toggles the box</Label>
    </div>
  ),
  checkbox: () => (
    <div className="grid gap-3">
      {["Read documents", "Draft replies", "Send without asking"].map((l, i) => (
        <Label key={l} className="font-normal">
          <Checkbox defaultChecked={i < 2} disabled={i === 2} /> {l}
        </Label>
      ))}
    </div>
  ),
  "radio-group": () => (
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
  ),
  switch: () => (
    <div className="grid gap-3">
      <Label className="font-normal">
        <Switch defaultChecked /> Web search
      </Label>
      <Label className="font-normal">
        <Switch /> Memory
      </Label>
    </div>
  ),
  slider: SliderDemo,
  toggle: () => (
    <Row>
      <Toggle aria-label="Web search" defaultPressed>
        <Globe />
      </Toggle>
      <Toggle variant="outline" aria-label="Attach">
        <Paperclip />
      </Toggle>
    </Row>
  ),
  "toggle-group": () => (
    <div className="grid gap-4">
      <ToggleGroup type="multiple" variant="outline" aria-label="Formatting">
        <ToggleGroupItem value="b" aria-label="Bold">
          <Bold />
        </ToggleGroupItem>
        <ToggleGroupItem value="i" aria-label="Italic">
          <Italic />
        </ToggleGroupItem>
        <ToggleGroupItem value="u" aria-label="Underline">
          <Underline />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" defaultValue="list" aria-label="View">
        <ToggleGroupItem value="list" aria-label="List view">
          <LayoutList />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <Grid2x2 />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
  select: () => (
    <Select defaultValue="aura-pro">
      <SelectTrigger className="w-60" aria-label="Model">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Models</SelectLabel>
          {models.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  tabs: () => (
    <Tabs defaultValue="answer" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="answer">Answer</TabsTrigger>
        <TabsTrigger value="sources">Sources</TabsTrigger>
        <TabsTrigger value="steps">Steps</TabsTrigger>
      </TabsList>
      <TabsContent value="answer" className="text-sm">The quickest win is a guided setup checklist.</TabsContent>
      <TabsContent value="sources" className="text-sm">4 sources: Notion, Zendesk, Typeform, Linear.</TabsContent>
      <TabsContent value="steps" className="text-sm">Searched, grouped, cross-checked, matched to roadmap.</TabsContent>
    </Tabs>
  ),
  accordion: () => (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="1">
        <AccordionTrigger>Does Aura train on my data?</AccordionTrigger>
        <AccordionContent>No. Workspace content is used to answer your questions and is never used for training.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger>Can Aura send emails on its own?</AccordionTrigger>
        <AccordionContent>Only if you allow it, and only for low-risk tasks. Otherwise it asks first.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  collapsible: () => (
    <Collapsible className="w-full max-w-sm rounded-ds-md border p-3">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm">
          Show 3 more sources
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 grid gap-1 text-sm text-ds-muted-foreground">
        {sources.slice(1).map((s) => (
          <p key={s.id}>{s.title}</p>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
  dialog: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Rename chat</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
          <DialogDescription>Give this conversation a name you’ll recognise later.</DialogDescription>
        </DialogHeader>
        <Input defaultValue="Q3 feedback summary" aria-label="Chat name" />
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  "alert-dialog": () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 /> Delete drafts
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete 12 drafts?</AlertDialogTitle>
          <AlertDialogDescription>The emails Aura drafted for the churn outreach will be removed. This can’t be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-ds-destructive text-ds-destructive-foreground hover:bg-ds-destructive/90">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  sheet: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Settings /> Chat settings
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chat settings</SheetTitle>
          <SheetDescription>Applies to this conversation only.</SheetDescription>
        </SheetHeader>
        <Label className="font-normal">
          <Switch defaultChecked /> Use connected sources
        </Label>
        <Label className="font-normal">
          <Switch /> Remember this chat
        </Label>
      </SheetContent>
    </Sheet>
  ),
  drawer: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Share answer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share this answer</DrawerTitle>
          <DrawerDescription>Anyone in your workspace with the link can view it.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Copy link</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  popover: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Response length</Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-3">
        <p className="text-sm font-medium">How long should answers be?</p>
        <RadioGroup defaultValue="short">
          {["short", "medium", "detailed"].map((v) => (
            <Label key={v} className="font-normal capitalize">
              <RadioGroupItem value={v} /> {v}
            </Label>
          ))}
        </RadioGroup>
      </PopoverContent>
    </Popover>
  ),
  tooltip: () => (
    <Row>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Attach files">
            <Paperclip />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Attach files</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Edit">
            <Pencil />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Edit message <Kbd className="ml-1 border-ds-background/20 bg-transparent text-ds-background">E</Kbd>
        </TooltipContent>
      </Tooltip>
    </Row>
  ),
  "hover-card": () => (
    <p className="max-w-md text-sm leading-relaxed">
      Ticket volume rose 12% in September <Citation source={sources[1]} />. Hover or focus the number to preview the source.
    </p>
  ),
  "dropdown-menu": () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Chat actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Q3 feedback summary</DropdownMenuLabel>
        <DropdownMenuItem>
          <Pencil /> Rename <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mail /> Share by email
        </DropdownMenuItem>
        <DropdownMenuCheckboxItem defaultChecked>Pin to sidebar</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 className="text-ds-destructive" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  "context-menu": () => (
    <ContextMenu>
      <ContextMenuTrigger className="grid h-32 w-full max-w-sm place-items-center rounded-ds-lg border border-dashed text-sm text-ds-muted-foreground">Right-click (or long-press) here</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem>
          Copy <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>Ask Aura about this</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Remove</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  command: () => (
    <Command className="w-full max-w-md border shadow-ds-2">
      <CommandInput placeholder="Search or ask Aura…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Ask">
          <CommandItem>
            <Sparkles /> Ask Aura…
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent chats">
          {conversations.slice(0, 3).map((c) => (
            <CommandItem key={c}>
              <FileText /> {c}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  form: FormDemo,
  "input-otp": () => (
    <InputOTP maxLength={6} aria-label="Verification code">
      <InputOTPGroup>
        {[0, 1, 2].map((i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {[3, 4, 5].map((i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
  calendar: CalendarDemo,
  table: () => (
    <Table>
      <TableCaption>Agent runs this week</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          ["Churn watcher", "success", "Done", 12],
          ["Weekly digest", "success", "Done", 1],
          ["Invoice chaser", "warning", "Needs approval", 4],
        ].map(([n, v, s, a]) => (
          <TableRow key={n as string}>
            <TableCell className="font-medium">{n}</TableCell>
            <TableCell>
              <Badge variant={v as "success" | "warning"}>{s}</Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">{a}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  breadcrumb: () => <Breadcrumb items={[{ label: "Workspace", href: "#" }, { label: "Projects", href: "#" }, { label: "Q3 feedback" }]} />,
  pagination: PaginationDemo,
  "navigation-menu": () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-72 gap-1">
              {[
                ["Chat", "Ask anything about your work"],
                ["Agents", "Multi-step tasks with approvals"],
                ["Search", "Answers with sources"],
              ].map(([t, d]) => (
                <li key={t}>
                  <NavigationMenuLink href="#">
                    <span className="font-medium">{t}</span>
                    <span className="text-ds-muted-foreground">{d}</span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="h-9 justify-center px-4 font-medium">
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  sidebar: SidebarDemo,
  "scroll-area": () => (
    <ScrollArea className="h-48 w-full max-w-xs rounded-ds-md border">
      <ul className="p-3 text-sm">
        {Array.from({ length: 24 }, (_, i) => (
          <li key={i} className="border-b py-2 last:border-0">
            Conversation {i + 1}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
  resizable: () => (
    <ResizablePanelGroup orientation="horizontal" className="!h-56 max-w-xl rounded-ds-lg border">
      <ResizablePanel defaultSize="55%" minSize="30%">
        <div className="grid h-full place-items-center p-4 text-sm">Conversation</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="45%" minSize="25%">
        <div className="grid h-full place-items-center bg-ds-muted/50 p-4 text-sm">Artifact</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  separator: () => (
    <div className="w-full max-w-sm">
      <p className="text-sm font-medium">Aura Pro</p>
      <p className="text-sm text-ds-muted-foreground">Balanced model for writing and analysis.</p>
      <Separator className="my-3" />
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>API</span>
        <Separator orientation="vertical" />
        <span>Status</span>
      </div>
    </div>
  ),
  avatar: () => (
    <Row>
      <Avatar>
        <AvatarFallback>NK</AvatarFallback>
      </Avatar>
      <Avatar className="size-10">
        <AvatarFallback className="bg-(image:--ds-ai-gradient) text-white">
          <Sparkles className="size-4" />
        </AvatarFallback>
      </Avatar>
    </Row>
  ),
  alert: () => (
    <div className="grid w-full max-w-lg gap-3">
      <Alert variant="ai">
        <Sparkles />
        <AlertTitle>Aura Deep is available</AlertTitle>
        <AlertDescription>Use it for multi-step reasoning. Replies take a little longer.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <Trash2 />
        <AlertTitle>Connection lost</AlertTitle>
        <AlertDescription>Slack disconnected. Reconnect to keep using it as a source.</AlertDescription>
      </Alert>
    </div>
  ),
  skeleton: () => (
    <div className="flex w-full max-w-sm items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
  progress: () => (
    <div className="grid w-full max-w-sm gap-2">
      <div className="flex justify-between text-sm">
        <span>Indexing your workspace</span>
        <span className="tabular-nums">64%</span>
      </div>
      <Progress value={64} aria-label="Indexing progress" />
    </div>
  ),
  kbd: () => (
    <p className="text-sm">
      Open the command palette with <Kbd>⌘</Kbd> <Kbd>K</Kbd>
    </p>
  ),
  toast: () => (
    <Row>
      <Button variant="outline" onClick={() => toast("Brief saved", { description: "Q3 feedback brief is up to date." })}>
        Show toast
      </Button>
      <Button variant="outline" onClick={() => toast("Chat deleted", { action: { label: "Undo", onClick: () => toast("Restored") } })}>
        With undo
      </Button>
    </Row>
  ),

  /* AI */
  "prompt-input": PromptDemo,
  "chat-message": () => (
    <div className="grid w-full max-w-xl gap-5">
      <ChatMessage role="system">Aura Pro · 4 sources connected</ChatMessage>
      <ChatMessage role="user">What should we fix first?</ChatMessage>
      <ChatMessage role="assistant" meta="Aura Pro · just now" footer={<MessageFeedback onCopy={() => {}} onRegenerate={() => {}} />}>
        A guided setup checklist — onboarding is the top complaint and it’s already on the roadmap.
      </ChatMessage>
    </div>
  ),
  "streaming-text": StreamingDemo,
  "thinking-indicator": () => (
    <div className="grid gap-3">
      <ThinkingIndicator />
      <ThinkingIndicator label="Reading 4 sources" />
      <ThinkingIndicator label="Running 3 tools" />
    </div>
  ),
  reasoning: () => (
    <div className="grid gap-4">
      <Reasoning steps={reasoningSteps} seconds={6} defaultOpen />
      <Reasoning steps={reasoningSteps.slice(0, 2)} active />
    </div>
  ),
  "tool-call": () => (
    <div className="grid w-full max-w-lg gap-2">
      <ToolCall tool="search.workspace" summary="Found 212 comments tagged Q3" status="done" duration="0.8s" input={'{ "query": "feedback", "quarter": "Q3" }'} output="212 results · Notion, Zendesk, Typeform" />
      <ToolCall tool="calendar.create" summary="Creating review meeting" status="running" />
      <ToolCall tool="crm.update" summary="Update 3 contacts" status="failed" output="403 — Aura doesn't have write access to HubSpot." />
    </div>
  ),
  "agent-plan": () => (
    <div className="w-full max-w-md">
      <AgentPlan
        title="Prepare board update"
        steps={[
          { label: "Collect metrics from Stripe", status: "done" },
          { label: "Summarise customer feedback", status: "done" },
          { label: "Draft slides", detail: "8 of 12 slides", status: "running" },
          { label: "Share with Neha for review", status: "pending" },
        ]}
      />
    </div>
  ),
  "approval-card": ApprovalDemo,
  "undo-toast": UndoDemo,
  "confidence-indicator": () => (
    <div className="grid gap-2">
      <ConfidenceIndicator level="high" reason="4 sources agree" />
      <ConfidenceIndicator level="medium" reason="based on one source" />
      <ConfidenceIndicator level="low" reason="no direct source found" />
    </div>
  ),
  citation: () => (
    <p className="max-w-lg text-sm leading-relaxed">
      <CitedText text="NPS moved from 31 to 36 [3], while ticket volume rose 12% [2]. Guided setup ships in November [4]." sources={sources} />
    </p>
  ),
  "sources-panel": () => (
    <div className="w-full max-w-xl">
      <SourcesPanel sources={sources} />
    </div>
  ),
  "suggestion-chips": () => <SuggestionChips suggestions={suggestions} onPick={(s) => toast(`Asked: ${s}`)} />,
  "model-selector": function ModelDemo() {
    const [m, setM] = useState("aura-pro");
    return <ModelSelector models={models} value={m} onChange={setM} />;
  },
  "usage-meter": () => (
    <div className="grid w-full max-w-sm gap-5">
      <UsageMeter used={3200} limit={10000} resetsIn="18 days" />
      <UsageMeter used={7400} limit={10000} resetsIn="6 days" />
      <UsageMeter used={9500} limit={10000} resetsIn="2 days" />
    </div>
  ),
  "voice-input": VoiceDemo,
  "message-feedback": () => <MessageFeedback onCopy={() => {}} onRegenerate={() => {}} onFeedback={() => {}} />,
  "artifact-panel": () => (
    <ArtifactPanel title="Launch checklist" kind="Document · v3" className="h-64 w-full max-w-md" onClose={() => {}}>
      <ol className="list-decimal space-y-1 pl-5 text-sm">
        <li>Final QA on onboarding flow</li>
        <li>Update help centre articles</li>
        <li>Email beta customers</li>
      </ol>
    </ArtifactPanel>
  ),
  "ai-empty-state": () => (
    <AIEmptyState title="What should we work on?" description="Aura can read your connected tools, draft documents and run tasks — always with your approval.">
      <SuggestionChips suggestions={["Summarise Q3 feedback", "Plan next sprint"]} onPick={() => {}} className="justify-center" />
    </AIEmptyState>
  ),
  "ai-error-state": () => (
    <div className="grid w-full max-w-lg gap-3">
      <AIErrorState kind="rate-limit" onAction={() => {}} />
      <AIErrorState kind="refusal" onAction={() => {}} />
      <AIErrorState kind="offline" onAction={() => {}} />
    </div>
  ),

  /* Patterns */
  "chat-workspace": ChatWorkspace,
  "agent-run": AgentRun,
  "ai-search": AISearch,
  "settings-permissions": SettingsPermissions,
};
