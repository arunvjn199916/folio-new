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
};

export const projectFilters: ("All" | ProjectFilter)[] = ["All", "AI", "Enterprise", "Mobile", "Web"];

export const projects: Project[] = [
  {
    slug: "agentic-ai-participant-portal",
    audience: "B2B",
    descriptor: "Agentic AI · Congruent Solutions",
    title: "An agentic AI participant portal for US retirement",
    summary: "Agentic AI guides participants through enrollment, contributions and investment changes — with clear confirmations and human-in-the-loop controls.",
    filters: ["AI", "Enterprise", "Web"],
    media: "projects/agentic-participant-portal.webp",
    tint: "linear-gradient(135deg,#cdb8ff,#a8d8ff)",
  },
  {
    slug: "retirement-mobile-app",
    audience: "B2C",
    descriptor: "iOS & Android MVP · Congruent Solutions",
    title: "Shipping a retirement mobile MVP in 6 weeks",
    summary: "AI-assisted workflows for US retirement participants, from wireframes to production — 500+ beta users, 4.2/5 satisfaction.",
    filters: ["AI", "Mobile"],
    media: "projects/retirement-mobile.webp",
    tint: "linear-gradient(135deg,#ffb6d9,#cdb8ff)",
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
    slug: "task-tracker-design-system",
    audience: "B2B",
    descriptor: "Design system · Euroland IR",
    title: "A design system for a task tracker app",
    summary: "Reusable components, tokens and patterns that standardised the UI and sped up design-to-development handoff.",
    filters: ["Enterprise", "Web"],
    media: "projects/task-tracker-design-system.webp",
    tint: "linear-gradient(135deg,#cdb8ff,#ffe3a8)",
  },
  {
    slug: "magnil-employee-management",
    audience: "B2B",
    descriptor: "Android app · Automotive",
    title: "Magnil — tracking daily work on the factory floor",
    summary: "An activity-tracking Android app for the automotive industry that improved operational efficiency by 30%.",
    filters: ["Mobile", "Enterprise"],
    media: "projects/magnil.webp",
    tint: "linear-gradient(135deg,#bff0e0,#a8d8ff)",
  },
];

// Screens that fly out of the "UI archive" folder.
export const archive = [
  { src: "archive/archive-1.webp", tint: "#cdb8ff", w: 220, h: 150 },
  { src: "archive/archive-2.webp", tint: "#a8d8ff", w: 120, h: 240 },
  { src: "archive/archive-3.webp", tint: "#ffb6d9", w: 200, h: 200 },
  { src: "archive/archive-4.webp", tint: "#bff0e0", w: 120, h: 240 },
  { src: "archive/archive-5.webp", tint: "#ffe3a8", w: 240, h: 140 },
  { src: "archive/archive-6.webp", tint: "#ffc2a8", w: 160, h: 220 },
];
