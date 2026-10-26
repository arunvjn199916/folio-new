import type { Segment } from "./profile";

export type Role = {
  role: string;
  company: string;
  location: string;
  from: string;
  to: string;
  current?: boolean;
  initials: string;
  tint: string;
  bullets: Segment[][];
  shots: string[]; // tints for the hover fan until real screenshots arrive
};

export const experienceIntro = {
  eyebrow: "Experience",
  title: "the journey so far",
  sub: "From graphic design to engineering to AI-first product design — four roles across five years, and counting.",
};

export const roles: Role[] = [
  {
    role: "Executive UI/UX Designer",
    company: "Congruent Solutions",
    location: "Chennai, TN",
    from: "Sep '25",
    to: "Present",
    current: true,
    initials: "CS",
    tint: "#cdb8ff",
    bullets: [
      [{ text: "Lead " }, { text: "AI-first product design", bold: true }, { text: " for US retirement (401(k)) platforms — AI search, voice and agentic workflows." }],
      [{ text: "Defined " }, { text: "AI trust patterns", bold: true }, { text: " for regulated finance: citations, confirmations before transactions, fallbacks." }],
      [{ text: "Ran " }, { text: "9 usability sessions", bold: true }, { text: " and a UX audit that surfaced 11 issues across the CORE portals." }],
    ],
    shots: ["#cdb8ff", "#a8d8ff", "#ffb6d9"],
  },
  {
    role: "Product Designer",
    company: "Euroland IR",
    location: "Chennai, TN",
    from: "Jul '23",
    to: "Sep '25",
    initials: "EU",
    tint: "#a8d8ff",
    bullets: [
      [{ text: "Owned CRM dashboards, task tools and apps for IR managers — " }, { text: "engagement up 25%", bold: true }, { text: "." }],
      [{ text: "Designed natural-language " }, { text: "AI search", bold: true }, { text: " over documents and financial data — query efficiency up 35%." }],
      [{ text: "Built a " }, { text: "design system adopted across 4 products", bold: true }, { text: "; research lifted satisfaction 30%." }],
    ],
    shots: ["#a8d8ff", "#bff0e0", "#ffe3a8"],
  },
  {
    role: "Application Engineer",
    company: "Embarckle",
    location: "Coimbatore, TN",
    from: "Aug '21",
    to: "Aug '22",
    initials: "EM",
    tint: "#bff0e0",
    bullets: [
      [{ text: "Worked on client-facing web apps across the " }, { text: "full development lifecycle", bold: true }, { text: " — the engineering lens behind build-ready designs." }],
      [{ text: "Wrote " }, { text: "UI requirements and specifications", bold: true }, { text: " connecting engineering, QA and business stakeholders." }],
    ],
    shots: ["#bff0e0", "#cdb8ff", "#a8d8ff"],
  },
  {
    role: "Graphic Designer",
    company: "Apexs Automation",
    location: "Chennai, TN",
    from: "Oct '20",
    to: "Aug '21",
    initials: "AA",
    tint: "#ffb6d9",
    bullets: [
      [{ text: "Brand identities, logo systems and guidelines for " }, { text: "6+ B2B clients", bold: true }, { text: "." }],
      [{ text: "Marketing and social campaigns that " }, { text: "increased client engagement by 15%", bold: true }, { text: "." }],
    ],
    shots: ["#ffb6d9", "#ffe3a8", "#ffc2a8"],
  },
];
