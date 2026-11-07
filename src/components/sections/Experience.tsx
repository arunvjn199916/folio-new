"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { MapPin } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useI18n } from "@/i18n/client";
import { RichText } from "@/components/ui/Text";
import { a11y, motionDisabled } from "@/lib/a11y/store";
import { cn } from "@/lib/utils";

const getStill = () => motionDisabled();
const serverStill = () => false;

/*
  v2 "journey" timeline (always on a dark stage, in both themes).
  Desktop: the section is ~2.8 screens tall with a sticky stage — perspective road lines
  converge on the horizon, a horizontal track holds one stop per role (oldest first) plus
  "what's next", with an AI marker where the career turned to product design. Scrolling
  slides a glowing dot along the track; passed stops light up and the active role's
  details swap in underneath. Phones, tablets and reduced motion get a vertical timeline with a
  scroll-filled line and every role written out.
*/
export function Experience() {
  const { roles, experienceIntro, ui } = useI18n().dict;
  const t = ui.experience;
  const root = useRef<HTMLElement>(null);
  const runner = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const road = useRef<SVGGElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const still = useSyncExternalStore(a11y.subscribe, getStill, serverStill);

  // oldest → newest, then the open "next" stop
  const chrono = [...roles].reverse();
  const stops = [
    ...chrono.map((r) => ({ key: r.company, title: r.role, sub: r.company, when: r.from, current: !!r.current })),
    { key: "next", title: t.nextTitle, sub: t.nextSub, when: t.nextWhen, current: false },
  ];
  // the AI marker sits between the engineering years and the first product-design role
  const shift = chrono.findIndex((r) => r.aiShift);
  const markerAfter = shift > 0 ? shift - 1 : Math.floor((stops.length - 2) / 2);
  const pos = (i: number) => (stops.length === 1 ? 0.5 : i / (stops.length - 1));
  const markerX = (pos(markerAfter) + pos(markerAfter + 1)) / 2;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (still) return;
        const sec = root.current!;
        const q = gsap.utils.selector(sec);
        let last = -1;
        const st = ScrollTrigger.create({
          trigger: sec,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            // hold at the first stop for a moment, reach the last stop just before the end
            const f = gsap.utils.clamp(0, 1, (self.progress - 0.08) / 0.84);
            if (runner.current) runner.current.style.left = `${f * 100}%`;
            if (fill.current) fill.current.style.transform = `scaleX(${f})`;
            if (road.current) road.current.style.strokeDashoffset = `${-self.progress * 900}`;
            let idx = 0;
            stops.forEach((_, i) => {
              const on = f >= pos(i) - 0.002;
              if (on) idx = i;
              q(`[data-stop="${i}"]`)[0]?.classList.toggle("is-on", on);
            });
            if (idx !== last) {
              last = idx;
              setActiveIdx(idx);
            }
          },
        });
        gsap.from(q(".xp-head > *"), { opacity: 0, y: 30, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: sec, start: "top 70%" } });
        return () => st.kill();
      });
      // vertical (phones / still): the line fills as you scroll past it
      mm.add("(max-width: 1023px)", () => {
        if (still) return;
        const line = root.current!.querySelector<HTMLElement>(".xp-vfill");
        if (!line) return;
        const tw = gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: line.parentElement, start: "top 70%", end: "bottom 60%", scrub: true } });
        gsap.utils.toArray<HTMLElement>(".xp-vstop", root.current).forEach((el) =>
          ScrollTrigger.create({ trigger: el, start: "top 65%", onToggle: (s) => el.classList.toggle("is-on", s.isActive || s.progress > 0), end: "bottom -100%" }),
        );
        return () => tw.scrollTrigger?.kill();
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [still, stops.length] },
  );

  const role = activeIdx < chrono.length ? chrono[activeIdx] : null;

  const vertical = (
    <div className={cn("relative px-4 pt-6 pb-24 md:px-12", !still && "lg:hidden")}>
      <div className="relative pl-8">
        <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-on-night/15" />
        <span aria-hidden className={cn("xp-vfill absolute top-2 bottom-2 left-[7px] w-px origin-top bg-champagne", still && "scale-y-100")} />
        {stops.map((s, i) => {
          const r = i < chrono.length ? chrono[i] : null;
          return (
            <div key={s.key}>
              {i === markerAfter + 1 && (
                <div className="relative mb-8 -ml-8 flex items-center gap-3">
                  <span className="rounded-full border border-on-night/40 bg-night px-2.5 py-0.5 font-mono text-[11px] tracking-[0.12em] text-on-night">{t.marker}</span>
                  <span className="eyebrow !text-on-night/60">{t.afterLabel}</span>
                </div>
              )}
              <div className={cn("xp-vstop group relative pb-10", still && "is-on")}>
                <span className="xp-dot absolute top-1.5 -left-8 size-[15px] rounded-full border-2 border-on-night/30 bg-night transition-all duration-500" />
                <p className="font-mono text-[11px] tracking-[0.12em] text-on-night/50 uppercase">
                  {s.when}
                  {r && ` – ${r.to}`}
                </p>
                <h3 className="mt-1 text-[22px] leading-tight font-bold tracking-[-0.03em] text-on-night uppercase">{s.title}</h3>
                <p className="text-[14px] text-on-night/60">{s.sub}</p>
                {r && (
                  <ul className="mt-3 space-y-1.5 text-[14px] leading-relaxed text-on-night/75">
                    {r.bullets.slice(0, 2).map((b, k) => (
                      <li key={k}>
                        <RichText segments={b} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section ref={root} id="experience" className={cn("dark-stage relative bg-night text-on-night", !still && "lg:h-[280vh]")}>
      {/* Desktop sticky stage */}
      {!still && (
        <div className="sticky top-0 hidden h-svh overflow-hidden lg:block">
          {/* glow + perspective road */}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_0%,rgba(220,2,8,0.28),transparent_70%)]" />
          <svg aria-hidden viewBox="0 0 1440 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <g stroke="rgba(247,241,227,0.1)" strokeWidth="1" fill="none">
              {[-1400, -700, -200, 260, 1180, 1640, 2140, 2840].map((x) => (
                <line key={x} x1="720" y1="560" x2={x} y2="900" />
              ))}
              <line x1="0" y1="560" x2="1440" y2="560" stroke="rgba(247,241,227,0.05)" />
            </g>
            <g ref={road} stroke="rgba(247,241,227,0.22)" strokeWidth="1.5" strokeDasharray="16 26" fill="none">
              <line x1="720" y1="560" x2="-200" y2="900" />
              <line x1="720" y1="560" x2="1640" y2="900" />
            </g>
          </svg>

          <div className="relative flex h-full flex-col px-12 pt-[18vh] pb-10">
            {/* heading row */}
            <div className="xp-head flex items-start justify-between gap-10">
              <div>
                <p className="eyebrow flex items-center gap-2 !text-on-night/60">
                  <span className="size-1.5 rounded-full bg-champagne" /> {experienceIntro.eyebrow}
                </p>
                <h2 className="display-l mt-4">{experienceIntro.title}</h2>
              </div>
              <p className="mt-10 max-w-[360px] text-[17px] leading-[1.5] text-on-night/65">{experienceIntro.sub}</p>
            </div>

            {/* track */}
            <div className="relative mt-auto mb-[6vh]">
              <div className="relative mx-3 mb-5 h-4 font-mono text-[11px] tracking-[0.14em] whitespace-nowrap text-on-night/50 uppercase">
                <span className="absolute left-0">{t.beforeLabel}</span>
                <span className="absolute translate-x-6" style={{ left: `${markerX * 100}%` }}>
                  {t.afterLabel}
                </span>
              </div>
              <div className="relative mx-3 h-[2px]">
                <span className="absolute inset-0 rounded bg-on-night/15" />
                <span ref={fill} className="absolute inset-0 origin-left scale-x-0 rounded bg-champagne/80" />
                {/* AI marker */}
                <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${markerX * 100}%` }}>
                  <span className="block h-14 w-px -translate-y-[calc(50%-1px)] bg-on-night/30" />
                  <span className="absolute top-8 left-1/2 -translate-x-1/2 rounded-full border border-on-night/40 bg-night px-2.5 py-0.5 font-mono text-[11px] tracking-[0.14em] text-on-night">
                    {t.marker}
                  </span>
                </span>
                {stops.map((s, i) => (
                  <div key={s.key} data-stop={i} className="xp-stop absolute top-1/2" style={{ left: `${pos(i) * 100}%` }}>
                    <span className="xp-dot absolute top-0 left-0 size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-on-night/40 bg-night transition-all duration-500" />
                    <div className={cn("absolute top-5 w-[min(17vw,220px)]", i === stops.length - 1 ? "right-0 text-right" : i === 0 ? "left-0" : "left-0 -translate-x-1/2 text-center")}>
                      <p className="xp-label text-[15px] leading-tight font-semibold tracking-[-0.01em] text-on-night/35 transition-colors duration-500">{s.title}</p>
                      <p className="mt-1 font-mono text-[11px] tracking-[0.1em] text-on-night/35 uppercase">{s.when}</p>
                    </div>
                  </div>
                ))}
                {/* runner */}
                <span ref={runner} className="absolute top-1/2 left-0 z-10 -translate-x-1/2 -translate-y-1/2">
                  <span className="block size-[18px] rounded-full bg-champagne shadow-[0_0_0_6px_rgba(255,239,147,0.15),0_0_30px_6px_rgba(255,239,147,0.55)]" />
                </span>
              </div>

              {/* active role details */}
              <div className="mt-[92px] grid min-h-[132px] grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10 border-t border-on-night/10 pt-6">
                <div key={`h-${activeIdx}`} className="animate-[xp-in_0.6s_cubic-bezier(0.22,1,0.36,1)]">
                  <p className="font-mono text-[11px] tracking-[0.12em] text-champagne uppercase">
                    {role ? `${role.from} – ${role.to}` : stops[activeIdx]?.when}
                  </p>
                  <h3 className="mt-2 text-[clamp(22px,2vw,32px)] leading-none font-bold tracking-[-0.035em] uppercase">{stops[activeIdx]?.title}</h3>
                  <p className="mt-2 flex items-center gap-2 text-[14px] text-on-night/60">
                    {stops[activeIdx]?.sub}
                    {role && (
                      <>
                        <span className="text-on-night/30">·</span>
                        <MapPin size={13} /> {role.location}
                      </>
                    )}
                  </p>
                </div>
                <ul key={`b-${activeIdx}`} className="animate-[xp-in_0.7s_cubic-bezier(0.22,1,0.36,1)] space-y-2 text-[15px] leading-relaxed text-on-night/75">
                  {role
                    ? role.bullets.map((b, k) => (
                        <li key={k} className="flex gap-3">
                          <span className="mt-[9px] size-1 shrink-0 rounded-full bg-champagne" />
                          <span>
                            <RichText segments={b} />
                          </span>
                        </li>
                      ))
                    : null}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vertical timeline: phones, and everyone when motion is off */}
      <div className={cn(!still && "lg:hidden")}>
        <div className="px-4 pt-24 md:px-12">
          <p className="eyebrow flex items-center gap-2 !text-on-night/60">
            <span className="size-1.5 rounded-full bg-champagne" /> {experienceIntro.eyebrow}
          </p>
          <h2 className="display-l mt-4">{experienceIntro.title}</h2>
          <p className="mt-4 max-w-[460px] text-[16px] leading-[1.5] text-on-night/65">{experienceIntro.sub}</p>
          <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-on-night/50 uppercase">{t.beforeLabel}</p>
        </div>
        {vertical}
      </div>
    </section>
  );
}
