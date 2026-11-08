"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motionDisabled } from "@/lib/a11y/store";

/*
  Reference solution page: "Every visitor answers a series of questions…" — a list whose
  lines light up one by one as they cross the middle of the screen, with a dot rail.
  Here: the problems users faced, each with one line of detail.
*/
export function QuestionList({ title, intro, items }: { title: string; intro?: string; items: { title?: string; body: string }[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const rows = q(".ql-row");
      if (motionDisabled()) {
        rows.forEach((r) => r.classList.add("is-on"));
        return;
      }
      const ts = rows.map((r) => ScrollTrigger.create({ trigger: r, start: "top 62%", end: "bottom 38%", onToggle: (s) => r.classList.toggle("is-on", s.isActive || s.progress === 1) }));
      const tw = gsap.fromTo(q(".ql-dot"), { top: "0%" }, { top: "100%", ease: "none", scrollTrigger: { trigger: q(".ql-list")[0], start: "top 62%", end: "bottom 38%", scrub: 0.4 } });
      return () => {
        ts.forEach((t) => t.kill());
        tw.scrollTrigger?.kill();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
      <div className="md:sticky md:top-28 md:self-start">
        <h2 className="font-display text-[clamp(30px,3.8vw,60px)] leading-[0.95] font-[650] tracking-[-0.04em] text-balance text-ink uppercase">{title}</h2>
        {intro && <p className="mt-5 max-w-[420px] text-[16px] leading-[1.6] text-ink-2">{intro}</p>}
      </div>
      <ol className="ql-list relative pl-8">
        <span aria-hidden className="absolute top-0 bottom-0 left-[3px] w-px bg-ink/15" />
        <span aria-hidden className="ql-dot absolute left-0 -translate-y-1/2">
          <span className="block size-[7px] rounded-full bg-accent shadow-[0_0_12px_3px_rgb(var(--c-globe-lit)/0.6)]" />
        </span>
        {items.map((it, i) => (
          <li key={i} className="ql-row group py-6 md:py-8">
            <p className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</p>
            {it.title && (
              <p className="mt-2 font-display text-[clamp(24px,2.6vw,40px)] leading-[1] font-[650] tracking-[-0.035em] text-ink/25 uppercase transition-colors duration-500 group-[.is-on]:text-ink">
                {it.title}
              </p>
            )}
            <p className="mt-3 max-w-[540px] text-[16px] leading-[1.6] text-ink-3 transition-colors duration-500 group-[.is-on]:text-ink-2">{it.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
