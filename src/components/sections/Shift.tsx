"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useI18n } from "@/i18n/client";
import { motionDisabled } from "@/lib/a11y/store";
import { SectionHead } from "@/components/ui/SectionHead";

/*
  v2 "two gaps" section, right after the hero. A thin line runs from USER to TRUST with
  an ANSWER pill in the middle; a glowing dot travels along it as the section scrolls
  through. Below: the gap before the answer and the gap after it, each a big uppercase
  statement with tag chips and a link to the work that answers it.
*/
export function Shift() {
  const { dict, href } = useI18n();
  const s = dict.shift;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (motionDisabled()) return;
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q(".shift-dot"),
        { left: "0%" },
        { left: "100%", ease: "none", scrollTrigger: { trigger: q(".shift-line")[0], start: "top 85%", end: "top 15%", scrub: 0.6 } },
      );
      gsap.fromTo(q(".shift-fill"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: q(".shift-line")[0], start: "top 85%", end: "top 15%", scrub: 0.6 } });
      gsap.from(q(".shift-col"), {
        opacity: 0,
        y: 50,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.15,
        scrollTrigger: { trigger: q(".shift-cols")[0], start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  const cols = [s.before, s.after];

  return (
    <section ref={root} id="gaps" className="relative overflow-hidden px-4 py-24 md:px-12 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_srgb,var(--c-space-3)_45%,transparent),transparent_70%)]" />
      <div className="relative">
        <SectionHead eyebrow={s.eyebrow} title={s.title} size="m" />

        {/* the line */}
        <div className="shift-line relative mt-14 md:mt-20">
          <div className="flex justify-between font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase">
            <span>{s.start}</span>
            <span className="text-ink">{s.end}</span>
          </div>
          <div className="relative mt-3 h-px">
            <span className="absolute inset-0 bg-ink/20" />
            <span className="shift-fill absolute inset-0 origin-left bg-accent/70" />
            {[0.25, 0.75].map((x) => (
              <span key={x} className="absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/40 bg-paper" style={{ left: `${x * 100}%` }} />
            ))}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2">
              <span className="block h-12 w-px -translate-y-1/2 bg-ink/30" />
              <span className="absolute top-7 left-1/2 -translate-x-1/2 rounded-full border border-ink/40 bg-paper px-2.5 py-0.5 font-mono text-[11px] tracking-[0.14em] whitespace-nowrap text-ink uppercase">
                {s.marker}
              </span>
            </span>
            <span className="shift-dot absolute top-1/2 left-full -translate-x-1/2 -translate-y-1/2">
              <span className="block size-3.5 rounded-full bg-accent shadow-[0_0_0_5px_rgb(var(--c-globe-lit)/0.15),0_0_24px_4px_rgb(var(--c-globe-lit)/0.6)]" />
            </span>
          </div>
        </div>

        {/* the two gaps */}
        <div className="shift-cols mt-20 grid gap-14 md:mt-24 md:grid-cols-2 md:gap-10">
          {cols.map((c) => (
            <div key={c.label} className="shift-col md:pr-8">
              <p className="eyebrow">{c.label}</p>
              <h3 className="display-m mt-4 max-w-[14ch] text-ink">{c.title}</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {c.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-ink/20 px-3 py-1 text-[12px] font-semibold tracking-[0.04em] text-ink-2 uppercase">
                    {chip}
                  </span>
                ))}
              </div>
              <Link href={href(c.href)} className="btn-outline mt-8 !min-h-11 !text-[13px]">
                {c.cta} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
