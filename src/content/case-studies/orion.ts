import type { CaseStudy, Shot } from "./types";

// Screens are from the shipped product, anonymised: client names, people, logos and brand colours replaced.
// v1 screens are 1440×1024, Orion screens 1920×1080, design-system sheets keep their own size
const RATIO: Record<string, string> = { "ds-kanban": "747/698" };
const s = (name: string, label: string, note?: string): Shot => ({ src: `cases/orion/${name}.webp`, label, note, ratio: RATIO[name] ?? (name.startsWith("v1-") ? (name === "v1-roles" ? "1920/1080" : name === "v1-requirement" ? "1440/1530" : "1440/1024") : "1920/1080") });

export const orion: CaseStudy = {
  slug: "orion-support-system",
  brand: { name: "Orion", tint: "#dff3ef", band: "#e8f5f2", accent: "#0f766e" },
  hero: {
    kicker: "internal tool · client onboarding & support",
    title: "From a task tracker to the command centre for every client rollout",
    sub: "Version one helped a team create boards and move tickets. Orion, the redesign, answers the question the business actually asked every morning: where does each client's rollout stand — tool by tool — and who is holding it up?",
    layout: "web",
    shots: [s("ticket-view", "Ticket view"), s("kanban", "Onboarding board"), s("tool-center", "Tool Center")],
  },
  client: true,
  meta: [
    { label: "My role", value: ["Product design lead", "Design system", "UX research"] },
    { label: "Platform", value: ["Web app (desktop)"] },
    { label: "Team & timeline", value: ["3 designers", "8 months"] },
    { label: "Shipped", value: ["v1 Support System", "v2 Orion"] },
  ],
  blocks: [
    {
      kind: "metrics",
      title: "What success looks like",
      intro: "Targets the redesign was built to move — goals, not measured results.",
      targets: true,
      items: [
        { tone: "down", label: "Time to answer “where is client X?”", value: "<30s" },
        { tone: "down", label: "Status-check messages to the onboarding team", value: "−50%" },
        { tone: "up", label: "Tickets with an owner and due date", value: "100%" },
        { tone: "down", label: "Tools that miss their go-live date", value: "−30%" },
      ],
    },
    {
      kind: "text",
      eyebrow: "Background",
      body: [
        "An investor-relations provider ships around 25 web tools — share graphs, financial reports, calculators, tickers, analyst consensus — to listed companies. Every new client means setting up a subset of those tools, in several languages, with data from sales and from the client.",
        "Version one, the “Support System”, was a general task tracker: create a board, add members, set roles, move tickets through columns. It brought the work into one place, but it treated a client rollout like any other task — so the one thing managers needed to know was still buried inside each card.",
      ],
    },
    {
      kind: "numbered",
      title: "Questions the v1 board couldn't answer",
      intro: "A ticket was a whole client, but the work happened tool by tool. These were the questions people asked each other on chat instead.",
      items: [
        { title: "Which tools are live for this client?", body: "A ticket held one status for the whole client; the five or six tools inside it each had their own state that nobody could see without opening the card." },
        { title: "Who is this waiting on?", body: "Tickets passed between sales, onboarding, production and QA. The board showed the column, not the person or team holding it." },
        { title: "Is it going to be late?", body: "Due dates lived in the order form. Nothing on the board showed time remaining or warned before a deadline slipped." },
        { title: "Where is the link I need?", body: "Every tool had test, trial and live links in different places. Support spent time hunting for URLs before they could answer a client." },
      ],
    },
    {
      kind: "personas",
      title: "Who uses it (simulated roles)",
      items: [
        { name: "Onboarding Manager", role: "Owns client rollouts end to end", quote: "I don't need every card — I need to know which three clients are about to be late.", needs: ["Portfolio view across boards", "Time remaining on every rollout", "Assign and reassign quickly"] },
        { name: "Team Lead", role: "Splits a client into tool tasks", quote: "Half my day is telling people which tool is next.", needs: ["Tool-by-tool progress inside a ticket", "Create tickets from a template", "See who is overloaded"] },
        { name: "Team Member", role: "Builds and configures tools", quote: "Just tell me what's mine, what's blocked and where the requirements are.", needs: ["My tickets first", "Requirements and data in one place", "Mentions instead of chat threads"] },
        { name: "Support Engineer", role: "Answers live client issues", quote: "When a client calls, I have ten seconds to find their live link.", needs: ["Tool Center with every link", "Client directory", "Ticket history and comments"] },
      ],
    },
    {
      kind: "statement",
      eyebrow: "The design question",
      line: "How might we show where every client's rollout stands — tool by tool — without opening a single card?",
      sub: "The answer changed the unit of the product from “a task” to “a client's tools”.",
    },
    {
      kind: "steps",
      eyebrow: "The solution at a glance",
      title: "Board, ticket, tools.",
      items: [
        { quote: "I can see who's stuck from the board.", title: "Five purpose-built boards", body: "Onboarding, Support, Updates, Dividends and Analyst consensus — each with its own columns, filters and role views for managers, leads and members." },
        { quote: "Every tool has its own progress bar now.", title: "A ticket that tracks tools", body: "The ticket view lists each tool with its own stage (onboarding → support → updates), owner and progress, plus time remaining for the whole rollout." },
        { quote: "The live link is one click away.", title: "Tool Center & products", body: "One directory of every tool with its service, trial and live links, languages and link status — and a product table with version, subscription and owner." },
      ],
    },
    {
      kind: "journey",
      eyebrow: "How a rollout moves",
      title: "One client, end to end",
      sub: "The flow the boards and statuses were designed around.",
      start: { kicker: "Trigger", title: "Client signs", body: "Sales hands over the order and client data." },
      steps: [
        { title: "Manager creates the ticket", body: "Template picks the tools in the package; due date comes from the order." },
        { title: "Lead assigns the tools", body: "Each tool gets an owner; requirements and data inputs attach to the ticket." },
        { title: "Members build & QA", body: "Cards move Open → In progress → Production → QC; mentions replace chat threads." },
      ],
      alt: { kicker: "Shortcut", title: "Automated tickets", body: "Routine updates (e.g. a new annual report) create themselves and skip manual setup." },
      end: { kicker: "Done", title: "Live & notified", body: "Links go into the Tool Center; the client's support board takes over." },
    },
    {
      kind: "web",
      title: "The boards",
      body: "Role-aware Kanban boards for each workflow. Cards carry the client, priority, tool chips, checklist count, due date and the people on it — enough to triage without opening anything.",
      shots: [s("kanban", "Onboarding board — manager view"), s("create-ticket", "Creating a ticket from a column")],
    },
    {
      kind: "web",
      title: "The ticket becomes a rollout tracker",
      body: "Each tool in the client's package gets its own progress row through onboarding, support and updates, with an owner and a time-remaining bar for the whole rollout. Data inputs from sales and the client sit right above it.",
      shots: [s("ticket-view", "Ticket view with tool-by-tool progress"), s("comments", "Comments, mentions and pinned notes"), s("automated-ticket", "Automated ticket with checklist")],
    },
    {
      kind: "web",
      title: "One source of truth for tools and clients",
      body: "The Tool Center and product table replaced the spreadsheets support used to hunt through; the customer directory gives every client a profile with orders, services, contacts and documents.",
      shots: [s("tool-center", "Tool Center — every link, language and status"), s("products-tools", "Products & tools inventory"), s("customers", "Customer directory"), s("notification", "Desktop notifications for mentions")],
    },
    {
      kind: "test",
      title: "The test script",
      intro: "Four tasks that map to the questions v1 couldn't answer. They drive the simulated walkthrough below and the moderated test that should follow it.",
      tasks: ["Find which clients will miss their go-live this week", "For one client, say which tools are live and which are blocked", "Hand a stuck tool to another member", "Find the live Share Graph link for a client"],
      measures: ["Time to first correct answer", "Cards opened before answering", "Errors and dead ends", "Confidence (1–5) after each task"],
    },
    {
      kind: "walkthrough",
      title: "Four roles, four tasks",
      intro: "I wrote four characters based on the roles above and walked each through the tasks on the real screens, first on v1 and then on Orion, noting where they would get stuck. It's a structured expert review, not user research — a moderated test with real team members is the next step.",
      participants: [
        { name: "Anita", age: 36, city: "Chennai", role: "Onboarding manager", comfort: "High", context: "Runs 30+ rollouts a quarter; lives in the board view." },
        { name: "Vikram", age: 31, city: "Chennai", role: "Team lead", comfort: "High", context: "Splits each client into tool tasks every morning." },
        { name: "Divya", age: 25, city: "Coimbatore", role: "Team member", comfort: "Medium", context: "New to the team; configures tickers and share graphs." },
        { name: "Rahul", age: 29, city: "Bengaluru", role: "Support engineer", comfort: "Medium", context: "Answers client calls; needs links fast." },
      ],
      tasks: ["Late rollouts this week", "Tool status for one client", "Hand over a stuck tool", "Find a live link"],
      results: [
        ["pass", "pass", "pass", "hard"],
        ["pass", "pass", "pass", "pass"],
        ["hard", "pass", "hard", "pass"],
        ["hard", "pass", "pass", "pass"],
      ],
      quotes: [
        { by: "Anita, onboarding manager", text: "The time-remaining bar is what I wanted — but give me a ‘late this week’ filter on the board." },
        { by: "Divya, team member", text: "I wasn't sure if handing over the tool also handed over the whole ticket." },
        { by: "Rahul, support engineer", text: "Tool Center is great. I just need to search it by client, not only by tool." },
      ],
    },
    {
      kind: "feedback",
      title: "What the walkthrough showed",
      source: "simulated",
      liked: ["Tool-by-tool progress answered “which tools are live?” without leaving the ticket", "Role views kept members focused on their own cards", "Tool Center turned link-hunting into one search"],
      disliked: ["No ‘due this week’ filter, so finding late rollouts still meant scanning the board", "Handing over a tool vs the whole ticket was ambiguous", "Tool Center searched by tool, not by client"],
    },
    {
      kind: "web",
      title: "Before → after: v1 Support System vs Orion",
      body: "Same team, same tickets — a different unit of work. v1 started from empty boards and generic roles; Orion starts from the client's tools.",
      shots: [s("v1-kanban", "v1 — one status per client card"), s("v1-requirement", "v1 — requirements in a long form"), s("v1-roles", "v1 — generic roles & permissions"), s("v1-archive", "v1 — archive and admin")],
    },
    {
      kind: "web",
      title: "The design system behind it",
      body: "Both versions run on one component kit: ticket cards, Kanban columns, status chips, progress bars, button states and data-input blocks, documented with variants so developers could build new boards without new designs. The rebrand to Orion was a token change, not a redesign.",
      shots: [s("ds-kanban", "Kanban column & ticket card variants"), s("logo-kanban", "Rebranded to Orion"), s("wireframe-ticket", "Ticket wireframe before visual design")],
    },
    {
      kind: "list",
      title: "What I learned",
      items: [
        { title: "Find the real unit of work", body: "v1 tracked tickets because that's what task trackers do. The business thought in clients and tools — once the ticket mirrored that, most status questions disappeared." },
        { title: "Design systems make rebrands cheap", body: "Because every screen used the same tokens and components, moving from “Support System” to Orion was days of work, not weeks." },
        { title: "Role views beat permissions", body: "Hiding what people can't use mattered less than showing each role its own starting point." },
      ],
    },
    {
      kind: "list",
      title: "What I'd do next",
      items: [
        { title: "Run the moderated test", body: "Five team members, the four tasks above, timed against v1." },
        { title: "Add ‘at risk’ views", body: "A board filter and digest for rollouts due this week, from the walkthrough's top finding." },
        { title: "Client-first search", body: "Search the Tool Center by client so support can answer a call in seconds." },
      ],
    },
  ],
  sources: [],
};
