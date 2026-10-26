// Every piece of copy on the site comes from these typed files.
// Rich text is modelled as segments so nothing is ever injected as raw HTML.

export type Segment = { text: string; bold?: boolean; highlight?: boolean };
/** Types rich text as Segment[] (so translations can replace it) while still checking it. */
const rich = (s: Segment[]) => s;
const richList = (s: Segment[][]) => s;

export type Profile = {
  name: string;
  firstName: string;
  role: string;
  tagline: string;
  location: string;
  availability: string;
  email: string;
  currently: { title: string; company: string };
  links: { linkedin: string; behance: string; resume: string };
  spotifyEmbed: string;
};

export const profile: Profile = {
  name: "Arun Vijayan",
  firstName: "Arun",
  role: "AI-First Product Designer",
  tagline: "Enterprise SaaS · FinTech · Agentic & Conversational UX",
  location: "Chennai, India",
  availability: "Open to relocation (UAE, Oman, Saudi Arabia & GCC) · Remote-ready",
  email: "arunvjn1999@gmail.com",
  currently: { title: "Executive UI/UX Designer", company: "Congruent Solutions" },
  links: {
    linkedin: "https://www.linkedin.com/in/arunvijayan-6",
    behance: "https://www.behance.net/arunvijayan6",
    resume: "/resume/Arun-Vijayan-Product-Designer-Resume-2026-10.pdf",
  },
  // Spotify album chosen for the Now Playing window.
  spotifyEmbed: "https://open.spotify.com/embed/album/4AGLzJHGevDOnuHsQ0gxO5?utm_source=generator&theme=0",
};

export const hero = {
  lead: "I'm Arun Vijayan, a product designer who",
  words: [
    { text: "designs agentic AI experiences.", color: "var(--c-violet)" },
    { text: "ships with Claude & Cursor.", color: "var(--c-pink)" },
    { text: "builds design systems.", color: "var(--c-blue)" },
    { text: "designs for trust in FinTech.", color: "var(--c-green)" },
  ],
  bio: rich([
    { text: "AI-first product designer with 5+ years of experience, including 3+ years in enterprise SaaS and FinTech. I design AI-powered search, voice and agentic experiences for US retirement (401(k)) platforms — and use " },
    { text: "Claude and Cursor to go from research to validated prototypes faster", bold: true },
    { text: "." },
  ]),
  stack: ["Figma", "Claude", "Claude Code", "Cursor", "Framer", "Miro", "Notion", "Adobe XD"],
  stats: [
    { value: 5, suffix: "+", label: "Years" },
    { value: 4, suffix: "", label: "Companies" },
    { value: 500, suffix: "+", label: "Beta users" },
  ],
  marquee: [
    "Agentic AI",
    "AI Search",
    "Conversational & Voice UX",
    "Human-in-the-Loop",
    "AI Trust & Explainability",
    "FinTech · 401(k)",
    "Enterprise SaaS",
    "Design Systems",
    "UX Research",
    "WCAG 2.2",
  ],
  polaroidCaption: "Based in Chennai, TN",
};

export const about = {
  greeting: "Hey, I'm Arun Vijayan.",
  paragraphs: richList([
    [
      { text: "I'm an " },
      { text: "AI-first product designer", highlight: true },
      { text: " working on enterprise US retirement (401(k)) platforms — turning legacy dashboards into action-oriented " },
      { text: "AI workspaces", highlight: true },
      { text: " with AI search, voice and agentic workflows that participants, plan sponsors and administrators can trust." },
    ],
    [
      { text: "Before design I was an application engineer on client-facing web apps, so I design for what can actually be built. Today I use " },
      { text: "Claude and Cursor to prototype and validate in days, not weeks", highlight: true },
      { text: ", with users, product and engineering in the loop." },
    ],
    [
      { text: "Based in Chennai, " },
      { text: "open to relocation across the UAE, Oman, Saudi Arabia & GCC", highlight: true },
      { text: ", and happy to work remotely. I speak English and Tamil." },
    ],
  ]),
  workedWith: ["Congruent Solutions", "Euroland IR", "Embarckle", "Apexs Automation"],
};

export const greetings = ["Hello", "வணக்கம்", "नमस्ते", "Hola", "Bonjour", "Ciao"];

export const loaderLine = ["Where", "ideas", "ship"];

export const contact = {
  lead: "let's",
  verbs: ["build", "design", "ship"],
  line: "incredible work together.",
};
