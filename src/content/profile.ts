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
  location: string;
  email: string;
  currently: { title: string; company: string };
  links: { linkedin: string; behance: string; github: string; resume: string };
  spotifyEmbed: string;
};

export const profile: Profile = {
  name: "Arun Vijayan",
  firstName: "Arun",
  role: "Senior Product Designer",
  location: "Chennai, India",
  email: "arunvjn1999@gmail.com",
  currently: { title: "Executive UI/UX Designer", company: "Congruent Solutions" },
  links: {
    linkedin: "https://www.linkedin.com/in/arunvijayan-6",
    behance: "https://www.behance.net/arunvijayan",
    github: "https://github.com/arunvijayan",
    resume: "/Arunvijayan-Product-Designer-Resume.pdf",
  },
  // Spotify album chosen for the Now Playing window.
  spotifyEmbed: "https://open.spotify.com/embed/album/4AGLzJHGevDOnuHsQ0gxO5?utm_source=generator&theme=0",
};

export const hero = {
  lead: "I'm Arun Vijayan, a product designer who",
  words: [
    { text: "designs AI workflows.", color: "var(--c-violet)" },
    { text: "ships with Claude & Cursor.", color: "var(--c-pink)" },
    { text: "builds design systems.", color: "var(--c-blue)" },
    { text: "stays curious.", color: "var(--c-green)" },
  ],
  bio: rich([
    { text: "Senior product designer with 5+ years across enterprise SaaS, AI-powered workflows and intelligent product experiences. I bridge product strategy and UX architecture with " },
    { text: "rapid AI-assisted prototyping", bold: true },
    { text: " to ship systems people actually act on." },
  ]),
  stack: ["Figma", "Cursor", "Claude", "ChatGPT", "Gemini", "Framer", "GitHub", "Netlify"],
  stats: [
    { value: 5, suffix: "+", label: "Years" },
    { value: 4, suffix: "", label: "Companies" },
    { value: 500, suffix: "+", label: "Beta users" },
  ],
  marquee: [
    "AI Search",
    "Voice UX",
    "Agentic UX",
    "Multi-Agent Workflows",
    "Design Systems",
    "UX Research",
    "Rapid Prototyping",
    "Enterprise SaaS",
    "Human-AI Interaction",
  ],
  polaroidCaption: "Based in Chennai, TN",
};

export const about = {
  greeting: "Hey, I'm Arun Vijayan.",
  paragraphs: richList([
    [
      { text: "I'm a " },
      { text: "Senior Product Designer", highlight: true },
      { text: " who turns legacy dashboards into intelligent, action-oriented " },
      { text: "AI workspaces", highlight: true },
      { text: " — with voice-enabled workflows, AI search and multi-agent flows." },
    ],
    [
      { text: "Before design I was an application engineer writing .NET and C#, so I know where the engineering constraints live. Today I prototype " },
      { text: "production-grade AI experiences with Cursor and Claude", highlight: true },
      { text: " and ship them alongside product and engineering." },
    ],
    [
      { text: "When I'm not designing, I'm building small tools, sketching brand systems, or getting lost in a new design rabbit hole in " },
      { text: "Tamil and English", highlight: true },
      { text: "." },
    ],
  ]),
  workedWith: ["Congruent Solutions", "Euroland IR", "Embarckle", "Apexs Automation"],
};

export const greetings = ["Hello", "வணக்கம்", "नमस्ते", "Hola", "Bonjour", "Ciao"];

export const loaderLine = ["Where", "ideas", "ship"];

export const contact = {
  verbs: ["build", "design", "ship"],
  line: "incredible work together.",
};
