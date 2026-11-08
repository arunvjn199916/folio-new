"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { intro } from "@/lib/intro";
import { useI18n } from "@/i18n/client";
import { a11y, motionDisabled } from "@/lib/a11y/store";
import { Globe } from "@/components/hero/Globe";
import { cn } from "@/lib/utils";

const getStill = () => motionDisabled();
const serverStill = () => false;

/*
  v2 hero. The section is ~2.3 screens tall with a sticky stage, so scrolling plays a story
  instead of moving the page: the planet horizon pulls back into a dot globe, the first
  statement dims, "users" on the globe light up, then gather into one glowing dot as the
  hero hands over to the next section. The globe can be dragged at any point.
  Reduced motion / Stop animations: one screen tall, finished state, no scrubbing.
*/
export function Hero() {
  const { dict } = useI18n();
  const { hero } = dict;
  const t = dict.ui.hero;
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const state = useRef<HTMLSpanElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const [play, setPlay] = useState(false);
  const still = useSyncExternalStore(a11y.subscribe, getStill, serverStill);

  useEffect(() => intro.onRelease(() => setPlay(true)), []);

  // Live local time in Chennai for the HUD (client only, so no hydration mismatch).
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => clock.current && (clock.current.textContent = fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  // Entrance after the intro: headline lines rise out of their masks, the rest fades up.
  useGSAP(
    () => {
      if (!play) return;
      const q = gsap.utils.selector(root);
      gsap.set(q("[data-hide]"), { visibility: "visible" });
      if (still) return;
      const splits = q(".hero-line").map((el) => SplitText.create(el, { type: "words", mask: "words", aria: "auto" }));
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(q(".hero-globe"), { opacity: 0, scale: 1.04, duration: 2.2, ease: "power2.out" }, 0)
        .from(q(".hero-eyebrow"), { opacity: 0, y: 12, duration: 0.8 }, 0.15)
        .from(splits.flatMap((s) => s.words), { yPercent: 110, duration: 1.2, stagger: 0.07 }, 0.2)
        .from(q(".hero-fade"), { opacity: 0, y: 18, duration: 1, stagger: 0.08 }, 0.7);
      return () => splits.forEach((s) => s.revert());
    },
    { scope: root, dependencies: [play, still] },
  );

  // Scroll story (desktop + mobile; skipped when motion is off).
  useGSAP(
    () => {
      const sec = root.current!;
      const q = gsap.utils.selector(sec);
      if (still) {
        progress.current = 0.5;
        if (state.current) state.current.textContent = t.after;
        return;
      }
      let after = false;
      const st = ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          const now = self.progress > 0.42;
          if (now !== after && state.current) {
            after = now;
            state.current.textContent = now ? t.after : t.before;
            gsap.fromTo(state.current.parentElement, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 });
          }
        },
      });
      const scrub = { trigger: sec, start: "top top", end: "bottom bottom", scrub: 0.4 };
      const tl = gsap.timeline({ scrollTrigger: scrub, defaults: { ease: "none" } });
      // timeline length = 1 so positions read as scroll progress
      tl.to(q(".hero-a"), { opacity: 0.45, duration: 0.18 }, 0.12) // stays ≥3:1 for large text
        .to(q(".hero-text"), { yPercent: -4, duration: 0.6 }, 0.3)
        .to(q(".hero-bleed"), { opacity: 1, duration: 0.25 }, 0.72)
        .set({}, {}, 1);
      return () => {
        st.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root, dependencies: [still, t.after, t.before] },
  );

  const [a, b] = hero.statements;

  return (
    <section ref={root} id="top" className={cn("relative", still ? "h-svh" : "h-[260vh] md:h-[230vh]")}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* space backdrop + end-of-section colour bleed */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_110%,var(--c-space-3)_0%,var(--c-space-2)_35%,transparent_70%)] opacity-60 [:root:not([data-theme=dark])_&]:opacity-30" />
        <div aria-hidden className="hero-bleed absolute inset-0 bg-[radial-gradient(80%_60%_at_68%_50%,color-mix(in_srgb,var(--c-space-3)_55%,transparent),transparent_75%)] opacity-0" />

        <div className="hero-globe absolute inset-0">
          <Globe progress={progress} still={still} label={t.globeLabel} className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing" />
        </div>

        {/* HUD */}
        <div data-hide className="hero-hud hero-fade pointer-events-none invisible absolute top-[86px] right-4 left-4 flex flex-col items-end gap-2 font-mono text-[11px] tracking-[0.12em] text-ink-2 uppercase md:top-[104px] md:right-10 md:left-auto">
          <div className="flex items-center gap-3 md:gap-4">
            <span>
              {t.city} <span ref={clock} className="ml-1 text-ink">--:--</span>
            </span>
            <span className="h-3 w-px bg-ink/25" />
            <span className="hidden items-center gap-1.5 sm:flex">
              <span className="size-1.5 rounded-full bg-ink/50" /> {t.users}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--c-globe-lit)/0.9)]" /> {t.trusted}
            </span>
          </div>
          <div className="hidden items-center gap-1.5 text-ink sm:flex">
            <span className="size-1.5 rounded-full bg-accent" />
            <span ref={state}>{t.before}</span>
          </div>
          <span className="hidden text-ink-3 md:block">{t.drag}</span>
        </div>

        {/* Text */}
        <div className="hero-text pointer-events-none absolute inset-0 flex flex-col px-4 pt-[124px] pb-[140px] md:px-12 md:pt-[22vh] md:pb-[100px]">
          <div data-hide className="hero-eyebrow invisible flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-2 rounded-full border border-ink/15 bg-paper/40 px-3 py-1 text-[12px] font-semibold tracking-[0.04em] text-ink backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-green opacity-60" />
                <span className="relative size-2 rounded-full bg-green" />
              </span>
              {hero.status}
            </span>
            <p className="eyebrow">{hero.eyebrow}</p>
          </div>
          <h1 data-hide className="invisible mt-4 text-ink md:mt-6">
            <span className="hero-a block">
              {a.map((line) => (
                <span key={line} className="hero-line display-xl block">
                  {line}
                </span>
              ))}
            </span>
            <span className="hero-b mt-[0.08em] block pl-[6vw] md:pl-[8vw]">
              {b.map((line) => (
                <span key={line} className="hero-line display-xl block">
                  {line}
                </span>
              ))}
            </span>
          </h1>

          <div data-hide className="invisible mt-auto flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="hero-fade max-w-[660px]">
              <p className="[text-shadow:0_1px_14px_var(--c-paper)] text-[16px] leading-[1.45] tracking-[-0.01em] text-ink md:text-[clamp(17px,1.3vw,21px)]">{hero.sub}</p>
              <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 md:flex-nowrap">
                {hero.stats.map((st) => (
                  <div key={st.label} className="flex items-baseline gap-2">
                    <dt className="sr-only">{st.label}</dt>
                    <dd className="font-display text-[22px] leading-none font-extrabold tracking-[-0.04em] text-accent md:text-[26px]">
                      {st.value}
                      {st.suffix}
                    </dd>
                    <span aria-hidden className="font-mono text-[11px] tracking-[0.12em] text-ink-2 uppercase">
                      {st.label}
                    </span>
                  </div>
                ))}
              </dl>
            </div>
            <div className="hero-fade pointer-events-auto flex flex-col gap-3 sm:flex-row md:mr-[10vw]">
              <a href="#contact" className="btn-accent">
                {t.talk} <ArrowRight size={18} strokeWidth={2.4} />
              </a>
              <a href="#work" className="btn-outline">
                {t.viewWork} <ArrowDownRight size={18} strokeWidth={2.2} className="arrow-diag" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
