export const skillPills = [
  "UX Research",
  "User Testing",
  "Information Architecture",
  "Wireframing",
  "Prototyping",
  "Interaction Design",
  "Design Systems",
  "Journey Mapping",
  "A/B Testing",
  "Design Sprints",
  "GenAI Product Design",
  "AI Search",
  "Voice UX",
  "Agentic UX",
  "Multi-Agent Workflows",
  "Human-AI Interaction",
];

export type Tool = { name: string; slug: string; note: string };

export const toolGroups: { label: string; tools: Tool[] }[] = [
  {
    label: "AI & thinking",
    tools: [
      { name: "Claude", slug: "claude", note: "Design thinking partner" },
      { name: "ChatGPT", slug: "chatgpt", note: "Research & synthesis" },
      { name: "Gemini", slug: "googlegemini", note: "Visual exploration" },
      { name: "NotebookLM", slug: "notebooklm", note: "Knowledge bases" },
      { name: "Perplexity", slug: "perplexity", note: "Fast research" },
      { name: "v0", slug: "v0", note: "UI generation" },
    ],
  },
  {
    label: "Design & prototyping",
    tools: [
      { name: "Figma", slug: "figma", note: "Design systems" },
      { name: "Cursor", slug: "cursor", note: "Prototyping in code" },
      { name: "Framer", slug: "framer", note: "Sites & motion" },
      { name: "LottieFiles", slug: "lottiefiles", note: "Lottie Lab motion" },
      { name: "Adobe XD", slug: "adobexd", note: "Prototypes" },
      { name: "Balsamiq", slug: "balsamiq", note: "Wireframes" },
    ],
  },
  {
    label: "Visual & collaboration",
    tools: [
      { name: "Illustrator", slug: "adobeillustrator", note: "Vector & brand" },
      { name: "Photoshop", slug: "adobephotoshop", note: "Imagery" },
      { name: "Miro", slug: "miro", note: "Workshops & journeys" },
      { name: "Notion", slug: "notion", note: "Docs & specs" },
      { name: "GitHub", slug: "github", note: "Versioning" },
      { name: "Netlify", slug: "netlify", note: "Shipping prototypes" },
    ],
  },
];

export const tools: Tool[] = toolGroups.flatMap((g) => g.tools);

export const process = ["Discover", "Define", "Design", "Validate", "Deliver"];

export const education = [
  { title: "B.Tech — Information Technology", place: "Sathyabama Institute of Science and Technology, Chennai", years: "2016 – 2020" },
  { title: "Advanced Design & Technology", place: "Buff Creative College, Coimbatore", years: "Sep 2022 – Jun 2023" },
  { title: "Python Programming Course", place: "Qtree Technology", years: "Mar 2021" },
];
