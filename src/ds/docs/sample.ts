import type { Model } from "../ai/conversation";
import type { Source } from "../ai/agent";

// Sample content for docs previews and pattern screens. Kept in one place so demos never
// hardcode copy inside components.

export const models: Model[] = [
  { id: "aura-swift", name: "Aura Swift", note: "Fastest · everyday tasks", tier: "fast" },
  { id: "aura-pro", name: "Aura Pro", note: "Balanced · writing & analysis", tier: "smart" },
  { id: "aura-deep", name: "Aura Deep", note: "Reasoning · complex problems", tier: "reasoning" },
];

export const sources: Source[] = [
  { id: 1, title: "Q3 customer feedback summary", url: "https://example.com/q3-feedback", site: "Notion · Research", snippet: "Onboarding friction was the top theme: 38% of comments mention setup taking longer than expected." },
  { id: 2, title: "Support tickets — September", url: "https://example.com/tickets-sep", site: "Zendesk", snippet: "Ticket volume rose 12% month on month, mostly password resets and invoice questions." },
  { id: 3, title: "NPS survey results", url: "https://example.com/nps", site: "Typeform", snippet: "NPS moved from 31 to 36. Detractors cite missing integrations and slow exports." },
  { id: 4, title: "Product roadmap H2", url: "https://example.com/roadmap", site: "Linear", snippet: "Guided setup and a faster export pipeline are scheduled for November." },
];

export const reply =
  "Here's what customers said this quarter. Onboarding is the biggest pain point — setup takes longer than people expect, and it shows up in support volume. NPS still improved, from 31 to 36, but detractors keep asking for integrations and faster exports. Both are already on the H2 roadmap, so the quickest win is a guided setup checklist.";

export const reasoningSteps = [
  "Searched 4 connected sources for Q3 feedback",
  "Grouped 212 comments into themes",
  "Cross-checked themes against ticket volume and NPS",
  "Matched open requests to the H2 roadmap",
];

export const suggestions = ["Draft an email to the team", "Turn this into a slide", "Which customers mentioned exports?"];

export const conversations = ["Q3 feedback summary", "Pricing page rewrite", "Hiring plan for design", "Churn analysis — EU", "Launch checklist v2"];
