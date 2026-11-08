export type ProjectFilter = "AI" | "Enterprise" | "Mobile" | "Web";

export type Project = {
  slug: string;
  audience: string;
  descriptor: string;
  title: string;
  summary: string;
  filters: ProjectFilter[];
  media: string; // logical name under media/images (see content/images.ts)
  tint: string; // placeholder gradient while media is missing
  wip?: boolean;
  /** Link somewhere other than /work/<slug> (e.g. the live design-system docs). */
  href?: string;
};

export const projectFilters: ("All" | ProjectFilter)[] = ["All", "AI", "Enterprise", "Mobile", "Web"];

export const projects: Project[] = [
  {
    slug: "aura-design-system",
    audience: "Design system",
    descriptor: "AI products · built on shadcn/ui",
    title: "Aura — a design system for AI products",
    summary: "43 shadcn-based components re-tokened, 20 new AI components (prompt input, streaming, citations, approvals, undo) and 4 full patterns, all live and documented.",
    filters: ["AI", "Web"],
    media: "cases/covers/aura.webp",
    tint: "linear-gradient(135deg,#eef0ff,#cfc6ff)",
    href: "/design-system",
  },
  // Self-initiated concept studies (full case studies in content/case-studies).
  {
    slug: "kairo-ai-personal-assistant",
    audience: "Concept",
    descriptor: "AI assistant · Mobile & Web",
    title: "Kairo — an AI assistant you can safely hand things to",
    summary: "A permission ladder, receipts for every action and one-tap undo, so delegating to AI feels like delegating to a trusted colleague.",
    filters: ["AI", "Mobile", "Web"],
    media: "cases/covers/kairo.webp",
    tint: "linear-gradient(135deg,#ece8ff,#cdb8ff)",
  },
  {
    slug: "kosh-personal-finance",
    audience: "Concept",
    descriptor: "Personal finance · Mobile",
    title: "Kosh — personal finance made simple for the UPI generation",
    summary: "One number — safe to spend today — with UPI spends auto-sorted through Account Aggregator consent and months you can see at a glance.",
    filters: ["Mobile"],
    media: "cases/covers/kosh.webp",
    tint: "linear-gradient(135deg,#e8f5d0,#c6f36b)",
  },
  {
    slug: "tandem-group-trip-planner",
    audience: "Concept",
    descriptor: "Collaborative travel · Mobile & Web",
    title: "Tandem — group trips without one person doing everything",
    summary: "A private budget handshake, voting on ideas, a day planner with owners and UPI settle-up, so the whole group plans the trip.",
    filters: ["Mobile", "Web"],
    media: "cases/covers/tandem.webp",
    tint: "linear-gradient(135deg,#fff0e0,#ffb59f)",
  },
  {
    slug: "secondly-trusted-marketplace",
    audience: "Concept",
    descriptor: "Marketplace · Mobile & Web",
    title: "Secondly — a second-hand marketplace strangers can trust",
    summary: "Verified listings, payment held until inspection, safe meet-ups and a trust score you can read, for used phones and electronics.",
    filters: ["Mobile", "Web"],
    media: "cases/covers/secondly.webp",
    tint: "linear-gradient(135deg,#e3ecff,#a9c2ff)",
  },
  {
    slug: "agentic-ai-participant-portal",
    audience: "B2B",
    descriptor: "Agentic AI · US retirement (ERISA)",
    title: "An agentic AI participant portal for US retirement",
    summary: "Agentic AI guides participants through enrollment, contributions and investment changes — with clear confirmations and human-in-the-loop controls.",
    filters: ["AI", "Enterprise", "Web"],
    media: "cases/covers/harbor-web.webp",
    tint: "linear-gradient(135deg,#dcf2ec,#0b7a66)",
  },
  {
    slug: "retirement-mobile-app",
    audience: "B2C",
    descriptor: "iOS & Android MVP · US retirement",
    title: "Shipping a retirement mobile MVP in 6 weeks",
    summary: "AI-assisted workflows for US retirement participants, from wireframes to production — 500+ beta users, 4.2/5 satisfaction.",
    filters: ["AI", "Mobile"],
    media: "cases/covers/harbor-app.webp",
    tint: "linear-gradient(135deg,#dcf2ec,#0b7a66)",
  },
  {
    slug: "ai-search-investor-relations",
    audience: "B2B",
    descriptor: "AI search · Euroland IR",
    title: "AI search for Investor Relations managers",
    summary: "Natural-language search over documents and financial data that improved IR managers' query efficiency by 35%.",
    filters: ["AI", "Enterprise"],
    media: "projects/ir-ai-search.webp",
    tint: "linear-gradient(135deg,#a8d8ff,#bff0e0)",
  },
  {
    slug: "ai-design-canvas",
    audience: "Personal",
    descriptor: "Multi-agent design tool",
    title: "AI Design Canvas — requirements to on-brand UI in Figma",
    summary: "A domain-aware, multi-agent tool that turns product requirements into on-brand interface designs inside Figma.",
    filters: ["AI"],
    media: "projects/ai-design-canvas.webp",
    tint: "linear-gradient(135deg,#bff0e0,#cdb8ff)",
    wip: true,
  },
  {
    slug: "feedback-portal",
    audience: "B2B",
    descriptor: "Enterprise tool · Congruent Solutions",
    title: "One place to capture, organise and act on feedback",
    summary: "A feedback portal that gives product teams a single view of client and user feedback to prioritise improvements.",
    filters: ["Enterprise", "Web"],
    media: "projects/feedback-portal.webp",
    tint: "linear-gradient(135deg,#ffe3a8,#ffb6d9)",
  },
  {
    slug: "orion-support-system",
    audience: "B2B",
    descriptor: "Internal tool & design system · Euroland IR",
    title: "Orion — from a task tracker to a command centre for client rollouts",
    summary: "Redesigned an internal support system around each client's tools: five role-based boards, tool-by-tool progress and one Tool Center — on a shared design system.",
    filters: ["Enterprise", "Web"],
    media: "cases/covers/orion.webp",
    tint: "linear-gradient(135deg,#dff3ef,#0f766e)",
  },
  {
    slug: "magnil-employee-management",
    audience: "B2B",
    descriptor: "Android app · Automotive",
    title: "Magnil — tracking daily work on the factory floor",
    summary: "Attendance, leave, shifts and payroll for every role in one Android app — improving operational efficiency by 30%. Now with an AI concept and its design system.",
    filters: ["Mobile", "Enterprise", "AI"],
    media: "cases/covers/magnil.webp",
    tint: "linear-gradient(135deg,#e6e4fb,#3b2fc9)",
  },
  {
    slug: "myir-investor-app",
    audience: "B2C",
    descriptor: "White-label mobile app · Investor relations",
    title: "MyIR — a company's investor-relations site in a shareholder's pocket",
    summary: "15+ desktop IR tools — share graph, announcements, dividends, reports, calendar — reworked into one brandable mobile app, price first.",
    filters: ["Mobile"],
    media: "cases/covers/myir.webp",
    tint: "linear-gradient(135deg,#dde6fb,#1d4ed8)",
  },
  {
    slug: "zeroq-food-ordering",
    audience: "B2C",
    descriptor: "Food ordering app · Client work",
    title: "zeroQ — order ahead, skip the queue",
    summary: "Delivery or self-pickup in one flow: pay ahead, get a ready time and walk in without waiting. Plus AI concepts for craving search and smart pickup slots.",
    filters: ["Mobile", "AI"],
    media: "cases/covers/zeroq.webp",
    tint: "linear-gradient(135deg,#fbe7dc,#b8461c)",
  },
  {
    slug: "baby-tracker",
    audience: "B2C",
    descriptor: "Parenting app · Client work",
    title: "Baby Tracker — logging a baby's day with one hand",
    summary: "Sleep, feeding and pumping tracked in two taps, with reports parents can read — and careful AI concepts that explain patterns without diagnosing.",
    filters: ["Mobile", "AI"],
    media: "cases/covers/baby.webp",
    tint: "linear-gradient(135deg,#ece4ff,#702ce2)",
  },
];

// Screens that fly out of the "UI archive" folder.
// UI archive windows: extra UX Magic explorations plus a few shots from the concept studies.
// w/h follow each image's ratio (web 1440×844, phone 390×844) so nothing is cropped oddly.
export const archive = [
  { src: "archive/kosh-insights-web.webp", tint: "#e9f3d6", w: 240, h: 141 },
  { src: "cases/kairo/morning-brief.webp", tint: "#ece8ff", w: 118, h: 255 },
  { src: "archive/secondly-badge-system.webp", tint: "#e3ebff", w: 220, h: 129 },
  { src: "cases/tandem/vote-result.webp", tint: "#ffeadb", w: 118, h: 255 },
  { src: "archive/tandem-landing-hero.webp", tint: "#ffeadb", w: 250, h: 147 },
  { src: "cases/secondly/listing-detail.webp", tint: "#e3ebff", w: 118, h: 255 },
  { src: "archive/kairo-notifications.webp", tint: "#ece8ff", w: 220, h: 129 },
  { src: "archive/kosh-widgets.webp", tint: "#e9f3d6", w: 200, h: 117 },
];
