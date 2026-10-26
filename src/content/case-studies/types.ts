// Typed block model for long-form case studies. Layout follows the references in
// PLAN.md §15.1: a narrow reading column, broken up by full-bleed mockup bands.
// Every block is data; components/case-study/* renders one component per kind.

/** A screen image under media/images (e.g. "cases/kairo/morning-brief.webp"). */
export type Shot = { src: string; label: string; note?: string };

export type Tone = "up" | "down";

export type Block =
  /** Plain prose in the reading column (Tushar "BACKGROUND", Sai body copy). */
  | { kind: "text"; eyebrow?: string; title?: string; body: string[]; bullets?: string[] }
  /** Big centred line — Sai's "THE DESIGN QUESTION". */
  | { kind: "statement"; eyebrow: string; line: string; sub?: string }
  /** Dark #1 / #2 cards — Tushar's problems, challenges and improvements. */
  | { kind: "numbered"; title: string; intro?: string; items: { title?: string; body: string }[] }
  /** Green-up / red-down metric cards. `targets` marks them as goals, not results. */
  | { kind: "metrics"; title: string; intro?: string; targets?: boolean; items: { tone: Tone; label: string; value: string }[] }
  /** Desk-research figures with their source. */
  | { kind: "insights"; title: string; intro?: string; items: { value: string; label: string; source: number }[] }
  /** Proto-personas with a handwritten quote (Sai's "Target users"). */
  | { kind: "personas"; title: string; items: { name: string; role: string; quote: string; needs: string[] }[] }
  /** Solution at a glance: three steps with handwritten quotes (Sai). */
  | { kind: "steps"; eyebrow: string; title: string; sub?: string; items: { quote: string; title: string; body: string }[] }
  /** Where the feature sits in the journey: start → steps → end, with an optional shortcut row (Sai). */
  | {
      kind: "journey";
      eyebrow?: string;
      title: string;
      sub?: string;
      start: { kicker: string; title: string; body: string };
      steps: { title: string; body: string }[];
      alt?: { kicker: string; title: string; body: string };
      end: { kicker: string; title: string; body: string };
    }
  /** Full-bleed tinted band: phones in sequence, joined by connector pills (Tushar). */
  | { kind: "band"; title?: string; sub?: string; caption: string; crumbs?: string[]; items: ({ shot: Shot } | { node: string; sub?: string })[] }
  /** Dark band of low-fi concept variants (Tushar's "Initial ideas using generative AI tools"). */
  | { kind: "explore"; title: string; body: string[]; variants: Shot[]; credit?: string }
  /** What they liked / didn't like. `planned` shows it as validation still to run. */
  | { kind: "feedback"; title: string; intro?: string; planned?: boolean; liked: string[]; disliked: string[] }
  /** Case 1/2/3 — one phone on a tinted square, with red-bar constraint notes (Tushar). */
  | { kind: "edges"; title: string; intro?: string; cases: { title: string; conclusion: string; shot: Shot; notes?: { title: string; body: string }[] }[] }
  /** Larger-screen views in a browser frame. */
  | { kind: "web"; title: string; body?: string; shots: Shot[] }
  /** Row of phones with step labels (Sai's "Your choices come with you"). */
  | { kind: "gallery"; title: string; sub?: string; shots: Shot[] }
  /** Numbered list with bold lead-ins — learnings, what could be better. */
  | { kind: "list"; title: string; intro?: string; items: { title: string; body: string }[] }
  /** The 5-person test: what we'll ask and how we'll measure it. */
  | { kind: "test"; title: string; intro: string; tasks: string[]; measures: string[] };

export type CaseStudy = {
  slug: string;
  /** Brand of the concept product — tints the hero and the bands. */
  brand: { name: string; tint: string; band: string; accent: string };
  hero: { kicker: string; title: string; sub: string; shots: Shot[] };
  meta: { label: string; value: string[] }[];
  blocks: Block[];
  sources: { label: string; url: string }[];
};
