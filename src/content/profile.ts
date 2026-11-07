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
  eyebrow: "AI-first product designer · FinTech & enterprise SaaS · Chennai",
  status: "Available for full-time roles — GCC & remote",
  statements: [
    ["Arun Vijayan.", "Product designer."],
    ["I design AI", "you can bank on."],
  ],
  sub: "I design AI search, voice and agentic workflows for US 401(k) platforms at Congruent Solutions — with citations, confirmations and fallbacks built in. Former engineer: I prototype in real code with Claude & Cursor.",
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
    { value: 35, suffix: "%", label: "Faster AI search queries" },
    { value: 500, suffix: "+", label: "Beta users in 6 weeks" },
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

// v2 "before / after" line section (right after the hero).
export const shift = {
  eyebrow: "Where AI loses people",
  title: "AI fails quietly in two places.",
  start: "Question",
  marker: "Answer",
  end: "Action",
  before: {
    label: "Before the answer",
    title: "People can't find what the AI can do.",
    chips: ["AI search", "Command bar", "Voice"],
    cta: "AI search for investor relations",
    href: "/work/ai-search-investor-relations",
  },
  after: {
    label: "After the answer",
    title: "People don't trust what it did.",
    chips: ["Citations", "Confirmations", "Fallbacks"],
    cta: "Agentic AI participant portal",
    href: "/work/agentic-ai-participant-portal",
  },
};

// v2 "stance" section: short principles revealed one at a time.
export const principles = {
  eyebrow: "How I design AI",
  items: [
    { lead: "Not every AI feature", rest: "needs a chat box." },
    { lead: "Not every answer", rest: "should be trusted without a source." },
    { lead: "Not every action", rest: "should happen without a way back." },
  ],
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

export const greetings = ["Hello", "வணக்கம்", "नमस्ते", "Hola", "Bonjour", "Ciao"];

export const loaderLine = ["Where", "ideas", "ship"];

export const contact = {
  lead: "Let's",
  verbs: ["design", "build", "ship"],
  line: "AI people trust.",
};
