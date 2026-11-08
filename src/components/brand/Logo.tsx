import { cn } from "@/lib/utils";

/*
  Arun's mark: a hand-drawn "A" inside an open ring. Original drawing — the ring opens at the
  lower left and the A's crossbar sweeps out to the right, so the mark reads as the "A" of
  "Arun" when "run" follows it. Strokes use pathLength=1 so they can draw themselves in
  (add `logo-draw` to animate; see globals.css).
*/
export function LogoMark({ className, draw = false, title }: { className?: string; draw?: boolean; title?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(draw && "logo-draw", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* open ring: starts low-left, sweeps clockwise round the top, stops short of where it began */}
      <path className="logo-ring" pathLength={1} strokeWidth={3.4} d="M22 76 C 8 58, 10 30, 30 16 C 50 2, 80 8, 90 32 C 100 56, 86 84, 60 91 C 46 95, 33 92, 26 86" />
      {/* the A: one stroke up the left leg, over the apex, down the right leg */}
      <path className="logo-a" pathLength={1} strokeWidth={4.4} d="M30 80 C 36 60, 44 38, 52 20 C 53.5 17, 56 17, 57 20 C 61 38, 65 58, 70 78" />
      {/* crossbar: a curved sweep that carries on past the right leg */}
      <path className="logo-bar" pathLength={1} strokeWidth={3.4} d="M36 60 C 48 55, 62 56, 82 64" />
    </svg>
  );
}

/** The mark followed by "run" — reads as "Arun". */
export function LogoWordmark({ className, sub, draw = false, runClassName }: { className?: string; sub?: string; draw?: boolean; runClassName?: string }) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className="flex items-end">
        <LogoMark draw={draw} className="size-[1.6em] text-accent" />
        <span className={cn("-ml-[0.1em] mb-[0.14em] font-display font-extrabold tracking-[-0.06em]", draw && "logo-run", runClassName)}>run</span>
      </span>
      {sub && <span className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-ink-3 uppercase">{sub}</span>}
    </span>
  );
}
