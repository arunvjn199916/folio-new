"use client";

import { useRef, useState } from "react";
import { gsap, Flip, useGSAP } from "@/lib/gsap";
import { blip } from "@/lib/intro";
import { cn } from "@/lib/utils";
import { motionDisabled } from "@/lib/a11y/store";

type Card = { slug: string; filters: string[]; node: React.ReactNode };

export function WorkGrid({ filters, cards, ariaLabel }: { filters: { id: string; label: string }[]; cards: Card[]; ariaLabel: string }) {
  const [active, setActive] = useState("All");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const select = (f: string) => {
    if (f === active) return;
    blip(700, 0.04, 0.02);
    if (grid.current) flipState.current = Flip.getState(grid.current.children);
    setActive(f);
  };

  // Cards that remain close up in order; the ones leaving fade, arriving ones rise in.
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state || !grid.current) return;
      flipState.current = null;
      Flip.from(state, {
        duration: 0.55,
        ease: "power3.inOut",
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.97, duration: 0.3 }),
      });
    },
    { dependencies: [active], scope: grid },
  );

  // Scroll entrance
  useGSAP(
    () => {
      if (motionDisabled()) return;
      gsap.from(grid.current!.children, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: grid.current, start: "top 82%", once: true },
      });
    },
    { scope: grid },
  );

  return (
    <>
      <div role="tablist" aria-label={ariaLabel} className="mt-8 mb-10 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={active === f.id}
            onClick={() => select(f.id)}
            className={cn(
              "rounded-full border px-5 py-3 text-[13px] leading-none transition-colors duration-[250ms]",
              active === f.id
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 bg-surface/40 text-ink/70 hover:border-ink/45 hover:text-ink",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div ref={grid} className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-10">
        {cards.map((c) => (
          <div key={c.slug} data-flip-id={c.slug} hidden={active !== "All" && !c.filters.includes(active)}>
            {c.node}
          </div>
        ))}
      </div>
    </>
  );
}
