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
  // v2 hero: two uppercase statements over the globe (statement one dims on scroll).
  eyebrow: "AI-first product designer · Chennai, India",
  status: "Available for full-time roles — GCC & remote",
  statements: [
    ["Hi, I'm", "Arun Vijayan."],
    ["Engineer turned", "designer."],
  ],
  sub: "Product designer with 5+ years in enterprise SaaS and FinTech — today designing AI search, voice and agentic experiences for US retirement platforms at Congruent Solutions.",
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
    { value: 5, suffix: "+", label: "Years in design" },
    { value: 500, suffix: "+", label: "Beta users in 6 weeks" },
    { value: 4.2, suffix: "/5", label: "User satisfaction" },
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

// v2 "hire" rows above the footer.
export const hire = {
  eyebrow: "Next step",
  title: "What are you hiring for?",
  rows: [
    { label: "A full-time product designer", kind: "email" as const },
    { label: "A look at my résumé", kind: "resume" as const },
    { label: "Just saying hello", kind: "linkedin" as const },
  ],
};

export const about = {
  greeting: "Engineer first. Designer by choice.",
  paragraphs: richList([
    [
      { text: "I'm Arun, an AI-first product designer in Chennai. At Congruent Solutions I lead design for enterprise US retirement (401(k)) platforms — turning legacy dashboards into " },
      { text: "AI workspaces", highlight: true },
      { text: " that participants, plan sponsors and administrators can act on with confidence." },
    ],
    [
      { text: "I started out as an application engineer on client-facing web apps, then retrained in design and technology. So my designs are " },
      { text: "built to ship", highlight: true },
      { text: ": I know what engineering needs, and I prototype in real code with Claude and Cursor to test ideas with users in days, not weeks." },
    ],
    [
      { text: "Before that I was a graphic designer, building brand systems for 6+ B2B clients — which is where my eye for detail comes from." },
    ],
    [
      { text: "Open to full-time roles in the UAE, Oman, Saudi Arabia & GCC", highlight: true },
      { text: ", or remote. English (fluent), Tamil (native)." },
    ],
  ]),
  workedWith: ["Congruent Solutions", "Euroland IR", "Embarckle", "Apexs Automation"],
};

// v2 About page (reference: eezyinn /agency/). Home uses `hero` + the first statement.
export const aboutPage = {
  eyebrow: "Arun Vijayan / About",
  title: "I'm Arun Vijayan.",
  line: "AI-first product designer from Chennai. I design products people understand — and I build the prototypes myself.",
  more: "Know more",
  // Home About (no name/companies — the hero and Experience already say those)
  homeTitle: "Engineer first. Designer by choice.",
  hook: "I write the prototype before I write the spec — so ideas get tested with real people in days.",
  traits: [
    { title: "Thinks in systems", body: "Design systems, tokens and AI patterns that scale across products." },
    { title: "Builds what he designs", body: "Real-code prototypes with Claude & Cursor, ready for engineering." },
    { title: "Designs for trust", body: "Clear states, sources and a way back — for regulated finance." },
  ],
  seeWork: "See my work",
  statement: {
    title: "A designer who speaks engineer.",
    body: [
      "I started out writing code — client web apps, specs that QA could test and engineers could build. Then I retrained in design and technology, and never looked back.",
      "That mix is my favourite tool. I can sit with users in the morning, map the system at noon and hand engineering a working prototype by evening.",
    ],
  },
  companies: { eyebrow: "Who I've worked with", title: "Four teams. One thread." },
  toolbox: { eyebrow: "Toolbox", title: "The tools on my desk." },
  dna: {
    eyebrow: "Design DNA",
    title: "Logic and craft, in one head.",
    body: "Graphic design gave me the eye, engineering gave me the logic, and enterprise SaaS taught me patience. Today I bring all three to AI products — clear flows, honest states and details that hold up in code.",
  },
  base: {
    eyebrow: "Base",
    title: "Chennai. For now.",
    body: "Open to full-time roles in the UAE, Oman, Saudi Arabia & GCC — or remote. English (fluent), Tamil (native).",
  },
  enough: { title: "Enough about me.", body: "My work says the most." },
};

// v2 story crawl (reference: the agency page's "Episode IV" crawl).
export const crawl = {
  intro: "A long time ago, in a design studio in Chennai…",
  episode: "Episode V",
  title: "A new designer",
  paragraphs: [
    "It began with logos — brand systems for six B2B clients in Chennai.",
    "Then came code: Python, client web apps, and specs that engineering and QA could trust.",
    "Curiosity pulled the other way. A year of design and technology at Buff Creative College, and the engineer became a designer.",
    "At Euroland he gave investor-relations teams AI search that answered in plain language.",
    "Today, at Congruent Solutions, he designs AI for people's retirement savings — and prototypes it in real code, in days.",
    "Somewhere between the logic and the craft, he found his favourite job.",
  ],
  outro: "The next chapter could be with your team…",
};

export const greetings = ["Hello", "வணக்கம்", "नमस्ते", "Hola", "Bonjour", "Ciao"];

export const loaderLine = ["Where", "ideas", "ship"];

export const contact = {
  lead: "Let's",
  verbs: ["design", "build", "ship"],
  line: "AI people trust.",
};
