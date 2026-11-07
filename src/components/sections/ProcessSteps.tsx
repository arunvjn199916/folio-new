"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motionDisabled } from "@/lib/a11y/store";
import { BlurHeading } from "@/components/ui/Motion";

/*
  v2 process (reference: "FROM BOTTLENECK TO RESULT."). The heading column sticks while the
  numbered steps scroll past; each step lights up as it crosses the middle of the screen
  and a dot slides down the rail beside them. Motion off: every step is lit.
*/
export function ProcessSteps({
  eyebrow,
  heading,
  line,
  steps,
  educationTitle,
  education,
}: {
  eyebrow: string;
  heading: string;
  line: string;
  steps: { title: string; note: string }[];
  educationTitle: string;
  education: { title: string; place: string; years: string }[];
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const items = q(".ps-step");
      if (motionDisabled()) {
        items.forEach((el) => el.classList.add("is-on"));
        return;
      }
      const triggers = items.map((el) =>
        ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 40%", onToggle: (s) => el.classList.toggle("is-on", s.isActive) }),
      );
      const dot = q(".ps-dot")[0];
      const list = q(".ps-list")[0];
      const tw = gsap.fromTo(dot, { top: "0%" }, { top: "100%", ease: "none", scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 40%", scrub: 0.4 } });
      return () => {
        triggers.forEach((t) => t.kill());
        tw.scrollTrigger?.kill();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" className="relative px-4 py-24 md:px-12 md:py-36">
      <div className="grid gap-14 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--c-globe-lit)/0.8)]" />
            {eyebrow}
          </p>
          <BlurHeading className="display-m mt-4 max-w-[12ch] text-ink">{heading}</BlurHeading>
          <p className="mt-5 max-w-[420px] text-[16px] leading-[1.55] text-ink-2">{line}</p>
          <div className="mt-12 border-t border-ink/10 pt-6">
            <p className="eyebrow">{educationTitle}</p>
            <ul className="mt-4 space-y-4">
              {education.map((e) => (
                <li key={e.title}>
                  <p className="text-[15px] font-bold text-ink">{e.title}</p>
                  <p className="text-[13px] text-ink-2">{e.place}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-3">{e.years}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ps-list relative pl-8 md:pl-12">
          <span aria-hidden className="absolute top-0 bottom-0 left-[3px] w-px bg-ink/15" />
          <span aria-hidden className="ps-dot absolute left-0 -translate-y-1/2">
            <span className="block size-[7px] rounded-full bg-accent shadow-[0_0_12px_3px_rgb(var(--c-globe-lit)/0.6)]" />
          </span>
          <ol>
            {steps.map((s, i) => (
              <li key={s.title} className="ps-step group py-8 md:py-12">
                <span className="font-mono text-[12px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display-l mt-2 text-ink/20 transition-colors duration-500 group-[.is-on]:text-ink">{s.title}</h3>
                <p className="mt-3 max-w-[460px] text-[16px] leading-[1.55] text-ink-3 transition-colors duration-500 group-[.is-on]:text-ink-2">{s.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
