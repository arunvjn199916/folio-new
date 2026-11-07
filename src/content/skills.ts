export const skillPills = [
  "Agentic AI UX",
  "AI Search",
  "Conversational & Voice UX",
  "Multi-Agent Workflows",
  "Human-in-the-Loop",
  "AI Trust & Explainability",
  "Prompt Design",
  "User Research",
  "Usability Testing",
  "UX Audits",
  "Journey Mapping",
  "Information Architecture",
  "Prototyping",
  "Design Systems",
  "Design Tokens",
  "Accessibility (WCAG 2.2)",
];

export type Tool = { name: string; slug: string; note: string };

export const toolGroups: { label: string; tools: Tool[] }[] = [
  {
    label: "AI & prototyping",
    tools: [
      { name: "Claude", slug: "claude", note: "Design thinking partner" },
      { name: "Claude Code", slug: "claudecode", note: "Agentic prototyping" },
      { name: "Cursor", slug: "cursor", note: "Prototyping in code" },
      { name: "Framer", slug: "framer", note: "Sites & motion" },
    ],
  },
  {
    label: "Design",
    tools: [
      { name: "Figma", slug: "figma", note: "Variables · Dev Mode" },
      { name: "Adobe XD", slug: "adobexd", note: "Prototypes" },
      { name: "Balsamiq", slug: "balsamiq", note: "Wireframes" },
      { name: "Illustrator", slug: "adobeillustrator", note: "Vector & brand" },
      { name: "Photoshop", slug: "adobephotoshop", note: "Imagery" },
    ],
  },
  {
    label: "Collaboration",
    tools: [
      { name: "Miro", slug: "miro", note: "Workshops & journeys" },
      { name: "Notion", slug: "notion", note: "Docs & specs" },
    ],
  },
];

export const tools: Tool[] = toolGroups.flatMap((g) => g.tools);

export const process = ["Discover", "Define", "Design", "Validate", "Deliver"];

/** One line per process step (same order as `process`). */
export const processNotes = [
  "Interviews, UX audits and the legacy screens nobody wants to touch.",
  "Journeys, information architecture and the one question the design must answer.",
  "Flows, systems and AI patterns — citations, confirmations, undo.",
  "Real-code prototypes with Claude & Cursor, tested with users in days.",
  "Specs, tokens and design QA, side by side with engineering.",
];

export const education = [
  { title: "Advanced Program in Design & Technology", place: "Buff Creative College, Coimbatore", years: "Sep 2022 – Jun 2023" },
  { title: "B.Tech — Information Technology", place: "Sathyabama Institute of Science and Technology, Chennai", years: "2016 – 2020" },
  { title: "Python Programming", place: "Qtree Technology", years: "2021" },
];
