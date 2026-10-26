"use client";

import { useRef } from "react";
import { MapPin } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useI18n } from "@/i18n/client";
import { RichText } from "@/components/ui/Text";
import { BlurHeading } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";
import { motionDisabled } from "@/lib/a11y/store";

/*
  Sanjay — "the journey so far". The section sticks; scrolling moves a horizontal track
  with a thin line, dots and date pills. Cards alternate above and below the line,
  blur in as they enter from the right and fade at the left edge. Hovering a card
  fans three screenshots out above it. Below md it's a plain vertical list.
*/
export function Experience() {
  const { roles, experienceIntro } = useI18n().dict;
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scaler = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        if (!ctx.conditions?.desktop) return;
        const t = track.current!;
        const sec = root.current!;
        const box = stage.current!;
        const zoom = scaler.current!;
        const still = !!ctx.conditions.reduce || motionDisabled();
        let scale = 1;

        // Cards sit above and below the centre line, so the track must be twice the tallest
        // card (plus the connector). If that doesn't fit under the heading on this screen,
        // the whole timeline scales down instead of cards spilling over the heading.
        const fit = () => {
          const tallest = Math.max(...gsap.utils.toArray<HTMLElement>(".xp-card", t).map((c) => c.offsetHeight));
          const need = 2 * (tallest + 48);
          t.style.height = `${need}px`;
          scale = still ? 1 : Math.min(1, box.clientHeight / need);
          zoom.style.transform = scale < 1 ? `scale(${scale})` : "";
        };
        fit();

        if (still) {
          // No scroll-driven motion: let people scroll the timeline sideways themselves.
          box.style.overflow = "auto";
          return () => {
            box.style.overflow = "";
            t.style.height = "";
          };
        }

        // Track travel in its own (unscaled) units, so the last card ends inside the screen.
        const distance = () => Math.max(0, t.scrollWidth - (window.innerWidth - 80) / scale);
        // The section is as tall as the horizontal travel; its inner viewport is CSS-sticky,
        // so the browser keeps it in place (no JS pin to fall out of sync with Lenis).
        const setHeight = () => {
          fit();
          sec.style.height = `${window.innerHeight + distance() * scale}px`;
        };
        setHeight();
        ScrollTrigger.addEventListener("refreshInit", setHeight);
        // Web fonts change card heights after first paint.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        const scroll = { trigger: sec, start: "top top", end: "bottom bottom", invalidateOnRefresh: true };
        const tween = gsap.to(t, { x: () => -distance(), ease: "none", scrollTrigger: { ...scroll, scrub: 0.6 } });
        gsap.fromTo(".xp-line", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { ...scroll, scrub: true } });
        // Cards ride in from the right. Transform + opacity only: a scrubbed blur would
        // repaint every card on every scroll frame.
        gsap.utils.toArray<HTMLElement>(".xp-node").forEach((node) => {
          gsap.from(node.querySelectorAll(".xp-card, .xp-pill, .xp-dot"), {
            opacity: 0,
            x: 80,
            scale: 0.96,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: node, containerAnimation: tween, start: "left 95%", end: "left 60%", scrub: true },
          });
        });
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", setHeight);
          sec.style.height = "";
          t.style.height = "";
          zoom.style.transform = "";
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" className="relative">
      <div ref={viewport} className="relative flex min-h-svh flex-col justify-center overflow-hidden py-24 md:sticky md:top-0 md:h-screen md:min-h-0 md:justify-start md:pt-24 md:pb-6">
        <div className="shrink-0 px-6 text-center">
          <p className="eyebrow flex items-center justify-center gap-2 text-blue">
            <span className="size-1.5 rounded-full bg-blue" /> {experienceIntro.eyebrow}
          </p>
          <BlurHeading className="mt-3 font-display text-[clamp(34px,4vw,52px)] leading-none font-semibold tracking-[-0.02em]">
            {experienceIntro.title}
          </BlurHeading>
          <p className="mx-auto mt-3 max-w-[460px] text-[14px] text-ink-2 md:[@media(max-height:780px)]:hidden">{experienceIntro.sub}</p>
        </div>

        {/* stage = the space left under the heading; the scaler shrinks the timeline to fit it */}
        <div
          ref={stage}
          className="relative mt-10 md:mt-4 md:flex md:min-h-0 md:flex-1 md:items-center md:[mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]"
        >
          <div ref={scaler} className="md:shrink-0 md:origin-left">
          <div ref={track} className="relative flex flex-col gap-8 px-6 md:h-[640px] md:w-max md:flex-row md:items-center md:gap-0 md:px-[12vw]">
            <span aria-hidden className="xp-line absolute top-1/2 right-0 left-0 hidden h-px origin-left bg-ink/15 md:block" />
            {roles.map((r, i) => {
              const up = i % 2 === 0;
              return (
                <div key={r.company} className="xp-node relative md:h-full md:w-[500px] md:shrink-0">
                  {/* dot + date pill on the line */}
                  <span
                    className={cn(
                      "xp-dot absolute top-1/2 left-10 z-10 hidden size-3 -translate-y-1/2 rounded-full border-2 border-surface shadow md:block",
                      r.current ? "bg-green" : "bg-ink/40",
                    )}
                  />
                  <span
                    className={cn(
                      "xp-pill z-10 mb-3 inline-block rounded-full border px-3 py-1 text-[11px] font-medium whitespace-nowrap md:absolute md:left-4 md:mb-0",
                      up ? "md:top-[calc(50%+16px)]" : "md:bottom-[calc(50%+16px)]",
                      r.current ? "border-green/30 bg-green/10 text-green" : "border-ink/10 bg-surface/80 text-ink-2",
                    )}
                  >
                    {r.from} – {r.to}
                  </span>
                  {/* connector */}
                  <span
                    aria-hidden
                    className={cn("absolute left-[45px] hidden w-px bg-ink/15 md:block", up ? "bottom-1/2 h-8" : "top-1/2 h-8")}
                  />
                  <article
                    className={cn(
                      "xp-card group relative w-full rounded-[18px] border border-surface/80 bg-card p-5 shadow-[var(--card-shadow)] md:absolute md:left-0 md:w-[520px]",
                      up ? "md:bottom-[calc(50%+32px)]" : "md:top-[calc(50%+32px)]",
                    )}
                  >
                    {/* hover fan */}
                    <div aria-hidden className="pointer-events-none absolute -top-6 left-1/2 hidden h-0 w-0 md:block">
                      {r.shots.map((tint, k) => (
                        <span
                          key={k}
                          className="fan-shot absolute bottom-0 h-[90px] w-[130px] rounded-[8px] border-[3px] border-photo shadow-lg"
                          style={{
                            background: tint,
                            transitionDelay: `${k * 40}ms`,
                            ["--fan-x" as string]: `${(k - 1) * 90}px`,
                            ["--fan-r" as string]: `${(k - 1) * 9}deg`,
                          }}
                        />
                      ))}
                    </div>
                    <header className="flex items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-[10px] font-display text-[13px] font-bold text-ink" style={{ background: r.tint }}>
                        {r.initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-[16px] leading-tight font-semibold">{r.role}</h3>
                        <p className="text-[13px] text-ink-3">{r.company}</p>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] whitespace-nowrap text-ink-3">
                        <MapPin size={11} /> {r.location}
                      </span>
                    </header>
                    <ul className="mt-4 space-y-2 border-t border-ink/5 pt-4 text-[13px] leading-relaxed text-ink-2">
                      {r.bullets.map((b, k) => (
                        <li key={k} className="flex gap-2">
                          <span className="mt-[7px] size-1 shrink-0 rounded-full bg-ink/40" />
                          <span>
                            <RichText segments={b} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
