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
      [{ text: "Driving " }, { text: "AI-first product design", bold: true }, { text: " for enterprise retirement platforms with voice-enabled workflows." }],
      [{ text: "Designed " }, { text: "AI search and command systems", bold: true }, { text: " for unified discovery and task execution." }],
      [{ text: "Prototyped production-grade AI experiences with " }, { text: "Cursor and Claude", bold: true }, { text: ", shipped on GitHub and Netlify." }],
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
      [{ text: "Led end-to-end design of " }, { text: "CRM dashboards", bold: true }, { text: " and mobile apps — engagement up 25%." }],
      [{ text: "Research and usability testing that raised " }, { text: "satisfaction by 30%", bold: true }, { text: "." }],
      [{ text: "Built a " }, { text: "design system adopted across 4 products", bold: true }, { text: "." }],
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
      [{ text: "Built responsive web apps in " }, { text: ".NET and C#", bold: true }, { text: " with Selenium testing." }],
      [{ text: "Worked across the " }, { text: "full SDLC", bold: true }, { text: " — the engineering lens behind my design decisions." }],
      [{ text: "Front-end layout, component styling and " }, { text: "cross-browser QA", bold: true }, { text: "." }],
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
      [{ text: "Branding and campaigns for B2B clients — " }, { text: "15% more engagement", bold: true }, { text: "." }],
      [{ text: "Brand guidelines and logo systems for " }, { text: "6+ clients", bold: true }, { text: "." }],
      [{ text: "Print-ready layouts and mockups on " }, { text: "tight deadlines", bold: true }, { text: "." }],
    ],
    shots: ["#ffb6d9", "#ffe3a8", "#ffc2a8"],
  },
];
