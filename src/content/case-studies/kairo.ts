import type { CaseStudy, Shot } from "./types";

const s = (name: string, label: string, note?: string): Shot => ({ src: `cases/kairo/${name}.webp`, label, note });

export const kairo: CaseStudy = {
  slug: "kairo-ai-personal-assistant",
  brand: { name: "Kairo", tint: "#ece8ff", band: "#f1eefc", accent: "#6e56ff" },
  hero: {
    kicker: "an assistant you can actually hand things to",
    title: "Designing an AI assistant that acts for you without taking control away",
    sub: "A permission ladder, receipts for everything and a one-tap undo — so delegating to AI feels like delegating to a trusted colleague, not gambling with your inbox.",
    shots: [s("connect-accounts", "Connect accounts"), s("morning-brief", "Morning brief"), s("plan-preview", "Plan preview"), s("review-message", "Review message"), s("activity-log", "Activity log")],
  },
  meta: [
    { label: "My role", value: ["Product strategy", "UX & UI design", "Prototyping"] },
    { label: "Platform", value: ["iOS / Android", "Web command centre"] },
    { label: "Timeline", value: ["3 weeks", "Concept"] },
    { label: "Built with", value: ["UX Magic", "Claude", "Figma"] },
  ],
  blocks: [
    {
      kind: "metrics",
      title: "What success looks like",
      intro: "The goals this concept is designed to move. They're targets for a pilot, not results.",
      targets: true,
      items: [
        { tone: "up", label: "Tasks delegated per active user per week", value: "5+" },
        { tone: "up", label: "Approvals accepted without edits", value: "70%" },
        { tone: "down", label: "Actions undone after running", value: "<5%" },
        { tone: "down", label: "Users who switch a task back to 'Suggest only'", value: "<15%" },
      ],
    },
    {
      kind: "text",
      eyebrow: "Background",
      body: [
        "AI assistants have learned to talk. In 2026 they're learning to act: rescheduling meetings, replying to email, paying bills. Technology leaders expect scheduling and personal-assistant agents to be the first agent use case to reach the mass market.",
        "But the people being asked to hand over their calendar and inbox aren't there yet. Concern about mainstream assistants sits around two in three users, and most say they'd switch off a device the moment it collected more than they expected.",
      ],
    },
    {
      kind: "insights",
      title: "The gap between capability and trust",
      intro: "Desk research across four recent studies. Each figure links to its source at the end of the page.",
      items: [
        { value: "~64%", label: "are concerned about the AI assistants they already use", source: 1 },
        { value: "78%", label: "would disconnect a device that collects more data than expected", source: 1 },
        { value: "44%", label: "of US consumers would use an AI agent as a personal assistant (70% of Gen Z)", source: 3 },
        { value: "52%", label: "of tech leaders name personal-assistant agents the top consumer use case for 2026", source: 4 },
      ],
    },
    {
      kind: "numbered",
      title: "What was the problem?",
      items: [
        { title: "All or nothing", body: "Today's assistants either only suggest (so you still do the work) or act silently (so you can't trust them). There's no middle ground per task." },
        { title: "Invisible actions", body: "When an assistant acts, there's rarely a record of what it touched, why, or how to reverse it — so a single mistake ends the relationship." },
      ],
    },
    {
      kind: "text",
      title: "What does it cost?",
      body: [
        "People who try delegation and get burned don't come back. The assistant becomes a fancy search box, and the time it could save is lost.",
      ],
      bullets: [
        "Low repeat use after the first wrong action",
        "Users re-checking everything the assistant did, which cancels out the time saved",
        "Access to sensitive accounts withheld, which caps what the assistant can do",
      ],
    },
    {
      kind: "personas",
      title: "Who it's for",
      items: [
        {
          name: "Priya Raman",
          role: "Product manager, Bengaluru · 30+ meetings a week",
          quote: "I'd hand it my calendar tomorrow if I could see what it's about to do.",
          needs: ["Reschedule and decline without writing the same message ten times", "A morning view of what actually matters", "Never send anything to her manager without a look first"],
        },
        {
          name: "Farhan Ali",
          role: "Founder of a 12-person studio, Hyderabad",
          quote: "Small stuff on autopilot. Money and clients — ask me.",
          needs: ["Different rules for different kinds of task", "A record he can check at the end of the day", "An instant way to undo"],
        },
      ],
    },
    {
      kind: "statement",
      eyebrow: "The design question",
      line: "Can an assistant act for you without you feeling out of control?",
      sub: "To answer it, I looked at how people delegate to other people: a new hire earns autonomy task by task.",
    },
    {
      kind: "steps",
      eyebrow: "The solution at a glance",
      title: "Trust, earned one task at a time.",
      items: [
        { quote: "Ask me first.", title: "Set the permission per task", body: "Email, calendar, reminders and payments each sit on their own rung: Suggest, Draft, Act with confirm or Autopilot." },
        { quote: "Show me the plan.", title: "See before it acts", body: "Every request becomes a step-by-step plan that names the apps it'll touch." },
        { quote: "Oops — undo.", title: "Receipts and undo", body: "Every action leaves a receipt, with a 10-second undo window and a full log." },
      ],
    },
    {
      kind: "journey",
      eyebrow: "How it fits",
      title: "One request, one predictable path.",
      sub: "The ladder decides how far Kairo goes on its own. The plan and the receipt are always there.",
      start: { kicker: "Start here", title: "Ask in plain words", body: "Type or speak a request." },
      steps: [
        { title: "Plan", body: "Kairo lists the steps and the apps it'll touch." },
        { title: "Check the ladder", body: "Each step runs at the rung you set for that task type." },
        { title: "Approve or edit", body: "Drafts wait for you, and autopilot steps just run." },
      ],
      alt: { kicker: "Or, when unsure", title: "Kairo asks first", body: "Ambiguity (which Arjun?) always stops the run, whatever the rung." },
      end: { kicker: "Always", title: "Receipt + undo", body: "Logged with a 10s undo." },
    },
    {
      kind: "numbered",
      title: "What were the foreseen challenges?",
      items: [
        { body: "Making four permission levels understandable in one glance, without a settings maze." },
        { body: "Showing a plan that's detailed enough to trust but short enough to approve in seconds." },
        { body: "Designing failure: partial success, ambiguity and revoked access had to feel calm, not alarming." },
      ],
    },
    {
      kind: "explore",
      title: "Exploring the approval moment",
      body: [
        "Approval is the screen users will see most, so I explored it first. I generated six low-fidelity directions in UX Magic and judged each on two questions: can you tell what will happen, and can you change it before it does?",
        "The bottom sheet won. It keeps the user's context visible behind it and puts Approve and Edit within thumb reach. I borrowed the diff view's 'what changes' highlighting for the final design.",
      ],
      variants: [
        s("approval-wireframe-vertical-stack", "Vertical stack"),
        s("approval-wireframe-card-swipe", "Card swipe"),
        s("approval-wireframe-timeline", "Timeline"),
        s("approval-wireframe-diff-view", "Diff view"),
        s("approval-wireframe-inline-chips", "Inline chips"),
        s("approval-wireframe-bottom-sheet", "Bottom sheet"),
      ],
      credit: "Generated in UX Magic · judged against the plan-first principle",
    },
    {
      kind: "band",
      title: "Setting up trust",
      sub: "(first run)",
      crumbs: ["Welcome", "Connect accounts", "Permission ladder", "Morning brief"],
      caption: "Onboarding that asks for the least access first",
      items: [
        { shot: s("welcome-to-kairo", "Welcome", "States the promise: you keep the say") },
        { shot: s("connect-accounts", "Connect accounts", "Scoped toggles per account, never all-or-nothing") },
        { node: "Scopes saved", sub: "read-only by default" },
        { shot: s("permission-ladder", "Permission ladder", "One rung per task type, with examples") },
        { shot: s("morning-brief", "Morning brief", "The first win: a calm view of today") },
      ],
    },
    {
      kind: "band",
      title: "Delegating a task",
      sub: "(the core loop)",
      crumbs: ["Delegate", "Plan preview", "Approval", "Done"],
      caption: "From a sentence to a receipt in four screens",
      items: [
        { shot: s("delegate-a-task", "Delegate", "Plain language with smart suggestions") },
        { shot: s("plan-preview", "Plan preview", "Every step and every app it'll touch") },
        { node: "Ladder check", sub: "Email = Draft" },
        { shot: s("review-message", "Approval sheet", "Review the draft to Arjun, then Edit or Approve") },
        { shot: s("task-complete", "Done + undo", "A 10-second undo window and a receipt") },
      ],
    },
    {
      kind: "test",
      title: "The test script",
      intro: "The same four tasks drive the simulated walkthrough below and the moderated test that comes next.",
      tasks: ["Connect your calendar so Kairo can only read it", "Ask Kairo to move tomorrow's 1:1 and tell the other person why", "Change Calendar to 'Draft' only", "Find and undo the last thing Kairo did"],
      measures: ["Task success without help", "Time to approve a plan", "Confidence before and after (1–7)", "Words they use to describe Kairo"],
    },
    {
      kind: "walkthrough",
      title: "Five characters, four tasks",
      intro: "I wrote five characters who differ in age, city, confidence with technology and history with the problem, then walked each one through the script on the actual prototype screens, noting where their goals and habits would trip them up. It's a structured expert review, not user research: it finds friction quickly, but a moderated test with five real people is still the next step.",
      participants: [
        { name: "Meenakshi Sundaram", age: 34, city: "Chennai", role: "Engineering manager", comfort: "High", context: "25 meetings a week; already lives in Gmail filters and Calendly." },
        { name: "Rohit Bansal", age: 29, city: "Gurugram", role: "Sales lead", comfort: "Medium", context: "Runs his day from WhatsApp and Google Calendar; wary of AI writing to clients." },
        { name: "Ayesha Khan", age: 41, city: "Hyderabad", role: "Clinic owner", comfort: "Low", context: "Delegates to a front-desk assistant; does everything on her phone." },
        { name: "Vivek Nair", age: 25, city: "Kochi", role: "Freelance designer", comfort: "High", context: "Tried an AI agent once and stopped after it sent the wrong email." },
        { name: "Lakshmi Iyer", age: 52, city: "Bengaluru", role: "HR director", comfort: "Medium", context: "Careful with access; reads every permission prompt twice." },
      ],
      tasks: ["Connect calendar read-only", "Move a 1:1 and explain why", "Set Calendar to Draft", "Find and undo the last action"],
      results: [
        ["pass", "pass", "pass", "pass"],
        ["hard", "pass", "hard", "pass"],
        ["fail", "hard", "hard", "hard"],
        ["pass", "pass", "pass", "hard"],
        ["hard", "pass", "pass", "pass"],
      ],
      quotes: [
        { by: "Ayesha, clinic owner", text: "Is ‘View availability’ on or off? I can't tell what it's allowed to read." },
        { by: "Rohit, sales lead", text: "Confirm, Act with confirm, Auto, Autopilot — are those the same thing?" },
        { by: "Vivek, freelance designer", text: "The receipt says delivered. Where's the undo for the message?" },
      ],
    },
    {
      kind: "feedback",
      title: "What the walkthrough showed",
      source: "simulated",
      liked: ["The plan preview worked for all five: they could say which apps Kairo would touch before approving", "‘You stay in control’ next to Edit / Approve made the approval feel safe, even for Lakshmi", "The 10-second undo toast was noticed by four of five, without prompting"],
      disliked: ["Scope chips on Connect accounts (View availability, Propose changes) don't read as switches, so ‘read-only’ was a guess for three of five", "The ladder uses two vocabularies: the badge says Autopilot or Confirm while the control says Auto or Confirm", "Reminders and Payments rows hide their control until tapped, so Ayesha couldn't find how to change them", "Sent messages can't be undone, and the log doesn't say why. Vivek read that as a bug"],
    },
    {
      kind: "numbered",
      title: "Improvements after the walkthrough",
      intro: "Each change maps to a moment where a character got stuck.",
      items: [
        { title: "Explicit scopes", body: "Each account gets real switches with a ‘Read only’ preset that is on by default." },
        { title: "One vocabulary", body: "Suggest · Draft · Ask first · Autopilot, worded the same on the badge, the control and every receipt." },
        { title: "No hidden controls", body: "Every ladder row shows its control, with no tap-to-expand rows." },
        { title: "Honest receipts", body: "Irreversible actions say so up front: ‘Messages can't be unsent. Undo moves the meeting back and sends a short correction.’" },
      ],
    },
    {
      kind: "edges",
      title: "Designing for when things go wrong",
      intro: "An assistant earns trust in the moments it fails, so each failure got its own designed state.",
      cases: [
        {
          title: "Kairo isn't sure which person you mean",
          conclusion: "It stops and asks, whatever rung the task is on. Ambiguity always beats autopilot.",
          shot: s("not-sure-asks-first", "Not sure — asks first"),
          notes: [
            { title: "Constraint #1", body: "Showing both contacts with their last interaction made the choice instant, so no typing is needed." },
            { title: "Constraint #2", body: "The answer is remembered for next time, so the same question isn't asked twice." },
          ],
        },
        {
          title: "One step worked, another failed",
          conclusion: "Show exactly what's done and what isn't, then offer Retry or Do it myself. Never leave a half-done task hidden.",
          shot: s("step-failed", "Step failed"),
        },
        {
          title: "You removed Gmail access",
          conclusion: "Tasks that need it pause, and Kairo explains which ones. Reconnecting is one tap, and keeping them paused is respected.",
          shot: s("permission-revoked", "Permission revoked"),
        },
        {
          title: "You're offline",
          conclusion: "Actions queue and wait. Each can be cancelled before it runs.",
          shot: s("offline", "Offline queue"),
        },
      ],
    },
    {
      kind: "web",
      title: "The command centre on a larger screen",
      body: "At a desk, the same model spreads out: agenda in the centre, pending approvals and receipts on the right, so a day's delegation can be reviewed in one view.",
      shots: [s("kairo-command-centre", "Kairo command centre — web")],
    },
    {
      kind: "gallery",
      title: "The whole system, together.",
      sub: "Ten core screens and four failure states, designed as one system.",
      shots: [
        s("welcome-to-kairo", "Welcome"),
        s("connect-accounts", "Connect"),
        s("permission-ladder", "Ladder"),
        s("morning-brief", "Brief"),
        s("delegate-a-task", "Delegate"),
        s("plan-preview", "Plan"),
        s("review-message", "Approve"),
        s("task-complete", "Done"),
        s("resolve-a-conflict", "Conflict"),
        s("activity-log", "Receipts"),
      ],
    },
    {
      kind: "list",
      title: "What could be better?",
      items: [
        { title: "Shared rungs", body: "Teams will want a manager to set the ceiling. Personal and team ladders need a merge rule." },
        { title: "Learning the ladder", body: "Kairo could suggest moving a task up a rung after 10 clean approvals, so trust grows from evidence instead of a settings screen." },
      ],
    },
    {
      kind: "list",
      title: "Learnings & reflections",
      items: [
        { title: "Trust is a feature you design", body: "The receipt and the undo took more design time than any 'smart' screen, and they're what make the smart screens usable." },
        { title: "Design the failures first", body: "Starting from 'what if it's wrong?' produced a calmer, more honest product than starting from the happy path." },
        { title: "AI to explore, judgement to decide", body: "Generating six approval directions in minutes meant the time went into choosing, not drawing." },
      ],
    },
  ],
  sources: [
    { label: "Forkast — Reviews.org 2026 Consumer Trust Survey coverage", url: "https://forkast.news/64-of-americans-dont-trust-their-ai-assistants-the-agent-revolution-has-a-permission-problem/" },
    { label: "PPC Land — Channel V Media: 40% of Americans would let AI agents act for them", url: "https://ppc.land/40-of-americans-would-let-ai-agents-act-for-them-channel-v-media-finds/" },
    { label: "Master of Code — AI agent statistics", url: "https://masterofcode.com/blog/ai-agent-statistics/amp" },
    { label: "Intelligent CIO — IEEE global survey on agentic AI in 2026", url: "https://www.intelligentcio.com/africa/2025/12/28/ieee-global-survey-predicts-agentic-ai-will-reach-consumer-mass-market-in-2026/" },
  ],
};
