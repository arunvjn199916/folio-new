/** Testimonials stay hidden until real recommendations replace the placeholders below. */
export const showTestimonials = false;

// Placeholder quotes — replace with real recommendations.
// Two recommendations with a photo each (reference: client tiles → testimonial cards).
// Placeholders until Arun sends real quotes — the section stays hidden while showTestimonials is false.
export const testimonials = [
  {
    quote: "Real recommendation goes here — waiting for the quote from Arun.",
    name: "Recommender name",
    role: "Role, Company",
    photo: "testimonials/person-1.webp",
    tint: "linear-gradient(135deg,#3a0207,#dc0208)",
  },
  {
    quote: "Real recommendation goes here — waiting for the quote from Arun.",
    name: "Recommender name",
    role: "Role, Company",
    photo: "testimonials/person-2.webp",
    tint: "linear-gradient(135deg,#6b4a08,#ffef93)",
  },
];

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
