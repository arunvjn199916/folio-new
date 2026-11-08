"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, Flip, useGSAP } from "@/lib/gsap";
import { blip } from "@/lib/intro";
import { cn } from "@/lib/utils";
import { motionDisabled } from "@/lib/a11y/store";

type Row = { slug: string; filters: string[]; preview: { src: string | null; tint: string; alt: string }; node: React.ReactNode };

/*
  Project index: filter pills + numbered rows. Filtering closes rows up with Flip; on
  pointer devices the hovered row's cover floats beside the cursor (decorative only).
*/
export function WorkGrid({ filters, rows, ariaLabel, indexLabel }: { filters: { id: string; label: string }[]; rows: Row[]; ariaLabel: string; indexLabel: string }) {
  const [active, setActive] = useState("All");
  const [hover, setHover] = useState<string | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [placed, setPlaced] = useState(false); // preview only shows once it has followed the pointer

  const select = (f: string) => {
    if (f === active) return;
    blip(700, 0.04, 0.02);
    if (list.current) flipState.current = Flip.getState(list.current.children);
    setActive(f);
  };

  useGSAP(
    () => {
      const state = flipState.current;
      if (!state || !list.current) return;
      flipState.current = null;
      Flip.from(state, {
        duration: 0.55,
        ease: "power3.inOut",
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
      });
    },
    { dependencies: [active], scope: list },
  );

  useGSAP(
    () => {
      if (motionDisabled()) return;
      gsap.from(list.current!.children, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: list.current, start: "top 85%", once: true },
      });
    },
    { scope: list },
  );

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !float.current) return;
    if (!placed) {
      gsap.set(float.current, { x: e.clientX + 28, y: e.clientY - 120 });
      setPlaced(true);
    } else gsap.to(float.current, { x: e.clientX + 28, y: e.clientY - 120, duration: 0.6, ease: "expo.out" });
  };

  // only real screenshots float — projects without a cover image show no preview box
  const found = rows.find((r) => r.slug === hover)?.preview;
  const current = placed && found?.src ? found : undefined;

  return (
    <>
      <div className="mt-20 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <p className="eyebrow">{indexLabel}</p>
        <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={active === f.id}
              onClick={() => select(f.id)}
              className={cn(
                "rounded-full border px-5 py-3 text-[12px] leading-none font-bold tracking-[0.08em] uppercase transition-colors duration-[250ms]",
                active === f.id ? "border-accent bg-accent text-on-accent" : "border-ink/20 text-ink/70 hover:border-ink/45 hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={list} onPointerMove={onMove} onPointerLeave={() => {
          setHover(null);
          setPlaced(false);
        }} className="mt-6 border-b border-ink/10">
        {rows.map((r) => (
          <div
            key={r.slug}
            data-flip-id={r.slug}
            hidden={active !== "All" && !r.filters.includes(active)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(r.slug)}
          >
            {r.node}
          </div>
        ))}
      </div>
      {/* floating cover preview */}
      <div
        ref={float}
        aria-hidden
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-30 hidden aspect-[16/10] w-[300px] overflow-hidden rounded-[18px] border border-ink/10 shadow-[var(--card-shadow-hover)] transition-[opacity,scale] duration-300 lg:block",
          current ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
        style={{ background: current?.tint }}
      >
        {current?.src && <Image src={current.src} alt="" fill sizes="300px" className="object-cover" />}
      </div>
    </>
  );
}
