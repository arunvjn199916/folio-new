export type ProjectFilter = "AI" | "Enterprise" | "Mobile" | "Web";

export type Project = {
  slug: string;
  audience: string;
  descriptor: string;
  title: string;
  summary: string;
  filters: ProjectFilter[];
  media: string; // path under /public; swapped for real work later
  tint: string; // placeholder gradient while media is missing
  wip?: boolean;
};

export const projectFilters: ("All" | ProjectFilter)[] = ["All", "AI", "Enterprise", "Mobile", "Web"];

export const projects: Project[] = [
  {
    slug: "retirement-participant-portal",
    audience: "B2B",
    descriptor: "Enterprise AI search",
    title: "Designing the US Retirement Participant Portal MVP",
    summary: "Intelligent search UX for document discovery and financial queries — query efficiency up 35%.",
    filters: ["AI", "Enterprise", "Web"],
    media: "/images/projects/retirement-portal.webp",
    tint: "linear-gradient(135deg,#cdb8ff,#a8d8ff)",
  },
  {
    slug: "retirement-mobile-app",
    audience: "B2C",
    descriptor: "Vibecoded with Claude + Cursor",
    title: "Shipping a retirement mobile MVP in 6 weeks",
    summary: "Wireframes to production for Android & iOS — 500+ beta users, 4.2/5 satisfaction.",
    filters: ["AI", "Mobile"],
    media: "/images/projects/retirement-mobile.webp",
    tint: "linear-gradient(135deg,#ffb6d9,#cdb8ff)",
  },
  {
    slug: "ai-search-investor-relations",
    audience: "B2B",
    descriptor: "AI search",
    title: "AI search for Investor Relations managers",
    summary: "Unified discovery, contextual navigation and task execution across every platform module.",
    filters: ["AI", "Enterprise"],
    media: "/images/projects/ir-ai-search.webp",
    tint: "linear-gradient(135deg,#a8d8ff,#bff0e0)",
    wip: true,
  },
  {
    slug: "crm-task-management",
    audience: "B2B",
    descriptor: "SaaS dashboard",
    title: "A CRM and task platform for IR teams",
    summary: "End-to-end CRM dashboards and task tools that lifted user engagement by 25%.",
    filters: ["Enterprise", "Web"],
    media: "/images/projects/crm-platform.webp",
    tint: "linear-gradient(135deg,#ffe3a8,#ffb6d9)",
  },
  {
    slug: "magnil-employee-management",
    audience: "B2B",
    descriptor: "Android app",
    title: "Magnil — tracking daily work on the factory floor",
    summary: "An Android app for the automobile industry that improved operational efficiency by 30%.",
    filters: ["Mobile", "Enterprise"],
    media: "/images/projects/magnil.webp",
    tint: "linear-gradient(135deg,#bff0e0,#a8d8ff)",
  },
  {
    slug: "food-delivery-app",
    audience: "B2C",
    descriptor: "Consumer app",
    title: "A food ordering app built around real-time tracking",
    summary: "Live order tracking and secure payments that contributed to a 40% lift in retention.",
    filters: ["Mobile"],
    media: "/images/projects/food-delivery.webp",
    tint: "linear-gradient(135deg,#ffc2a8,#ffb6d9)",
  },
  {
    slug: "ecommerce-website",
    audience: "B2C",
    descriptor: "Website design",
    title: "An e-commerce storefront with a calmer checkout",
    summary: "Responsive storefront with seamless navigation and an optimised checkout on every device.",
    filters: ["Web"],
    media: "/images/projects/ecommerce.webp",
    tint: "linear-gradient(135deg,#cdb8ff,#ffe3a8)",
  },
];

// Screens that fly out of the "UI archive" folder.
export const archive = [
  { src: "/images/archive/archive-1.webp", tint: "#cdb8ff", w: 220, h: 150 },
  { src: "/images/archive/archive-2.webp", tint: "#a8d8ff", w: 120, h: 240 },
  { src: "/images/archive/archive-3.webp", tint: "#ffb6d9", w: 200, h: 200 },
  { src: "/images/archive/archive-4.webp", tint: "#bff0e0", w: 120, h: 240 },
  { src: "/images/archive/archive-5.webp", tint: "#ffe3a8", w: 240, h: 140 },
  { src: "/images/archive/archive-6.webp", tint: "#ffc2a8", w: 160, h: 220 },
];
