/*
  Testimonials — DRAFTS written for each person to approve or edit (see docs/testimonial-drafts.md).
  Only entries with approved: true are shown; the section appears once at least one is approved.
  Never publish a quote its author hasn't confirmed, and don't name a client company without permission.
*/
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  kind: "colleague" | "client";
  approved: boolean;
  photo?: string; // media/images/testimonials/<file>.webp once provided
  tint: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: "Arun made our four products finally feel like one family. His design system and the way he documented it saved both designers and developers hours every week.",
    name: "Nithi",
    role: "Product Designer, Euroland IR",
    kind: "colleague",
    approved: false,
    tint: "linear-gradient(135deg,#3a0207,#dc0208)",
  },
  {
    quote: "Working with Arun on AI search showed me how to turn complex financial queries into something an IR manager can use in seconds — and how to back every decision with research.",
    name: "Surya",
    role: "Product Designer, Euroland IR",
    kind: "colleague",
    approved: false,
    tint: "linear-gradient(135deg,#6b4a08,#ffef93)",
  },
  {
    quote: "Arun started on the engineering side with us, so his specs were always build-ready. He speaks both design and code, which made every handoff feel like a conversation.",
    name: "Gowtham",
    role: "Embarckle",
    kind: "colleague",
    approved: false,
    tint: "linear-gradient(135deg,#100001,#6b0410)",
  },
  {
    quote: "Arun brings calm structure to complex 401(k) workflows. His usability sessions and AI trust patterns gave the whole team a shared direction.",
    name: "Vairoshini",
    role: "Congruent Solutions",
    kind: "colleague",
    approved: false,
    tint: "linear-gradient(135deg,#dc0208,#ffef93)",
  },
  {
    quote: "The IR mobile app puts our investor information in people's hands — clear, fast and consistent with our brand.",
    name: "Investor Relations team",
    role: "Aramco · on the IR mobile app",
    kind: "client",
    approved: false,
    tint: "linear-gradient(135deg,#0a0001,#3a0207)",
  },
  {
    quote: "Investors find results, reports and share data in a few taps. The app feels like a natural extension of our IR website.",
    name: "Investor Relations team",
    role: "BAT · on the IR mobile app",
    kind: "client",
    approved: false,
    tint: "linear-gradient(135deg,#3a0207,#ffef93)",
  },
];

/** The section appears once at least one testimonial is approved. */
export const showTestimonials = testimonials.some((t) => t.approved);

export const aiWorkflow = {
  title: "How I Design in the Age of AI",
  intro: [
    "Enterprise projects rarely start with clarity. They start with legacy screens, compliance rules, half-written requirements and a dozen stakeholders.",
    "AI has become part of how I move from that ambiguity to a confident decision — not because it decides for me, but because it lets me think faster, explore wider and show real working software sooner.",
    "Here's how it fits into my workflow.",
  ],
  phases: [
    {
      title: "Making Sense of the Chaos",
      tools: "Claude · Notion · Miro",
      body: [
        "Every project starts with one goal: clarity. I feed PRDs, meeting notes and research into Claude to break information down, surface gaps and list the questions nobody has answered yet.",
        "The output lands in Notion and Miro as a living map of the problem — so the team argues about the right things.",
      ],
    },
    {
      title: "Exploring Before Committing",
      tools: "Figma",
      body: [
        "Once the problem is clear I explore widely. Generating early flows and wireframes is cheap now, which makes me more willing to try three directions before committing to one.",
      ],
    },
    {
      title: "Prototyping in Real Code",
      tools: "Claude · Claude Code · Cursor",
      body: [
        "For AI search, voice and multi-agent workflows a static mockup can't show the real behaviour. I build working prototypes with Claude, Claude Code and Cursor and put them in front of users, product and engineering in days rather than weeks.",
        "That's how the retirement mobile MVP went from wireframes to 500+ beta users in six weeks.",
      ],
    },
    {
      title: "Designing Trust Into AI",
      tools: "Design systems · UX patterns",
      body: [
        "In financial systems, AI has to be explainable. I define reusable patterns for citations, confidence, undo and human review so AI features stay clear, compliant and trusted.",
      ],
    },
    {
      title: "What AI Has Actually Changed For Me",
      tools: "",
      body: [
        "The biggest benefit isn't productivity. It's momentum.",
        "I spend less time stuck at the start of a problem and more time refining the solution — validating ideas sooner and making decisions with more confidence.",
      ],
    },
  ],
};
