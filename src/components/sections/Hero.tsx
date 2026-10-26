"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { intro } from "@/lib/intro";
import { useI18n } from "@/i18n/client";
import { BlurCycle } from "@/components/ui/BlurCycle";
import { CountUp, Marquee } from "@/components/ui/Motion";
import { RichText } from "@/components/ui/Text";
import { ToolIcon, toolSlug } from "@/components/ui/ToolIcon";
import { motionDisabled } from "@/lib/a11y/store";
import { splitTypeFor } from "@/lib/text";

const PenHeadline = dynamic(
  () => import("@/components/ui/PenHeadline").then((m) => m.PenHeadline),
  { ssr: false },
);

const MOSAIC = { cols: 8, rows: 10 };

/*
  Sudhanva layout (chip → headline with a blur-cycling last line → bio → builder stack,
  tilted polaroid on the right), Anjali's stats column with count-up, pixel-mosaic photo
  reveal and the skills marquee, and Ashu's editable vector "PRODUCT DESIGNER" wordmark.
  Everything waits for the intro to release it.
*/
export function Hero({ portrait }: { portrait: React.ReactNode }) {
  const { dict } = useI18n();
  const { hero, profile, ui } = dict;
  const root = useRef<HTMLElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => intro.onRelease(() => setPlay(true)), []);

  useGSAP(
    () => {
      if (!play) return;
      const reduce = motionDisabled();
      const q = gsap.utils.selector(root);
      gsap.set(q("[data-hide]"), { visibility: "visible" });
      if (reduce) return;
      // chars for Latin, words for Indic scripts (keeps letters shaped correctly)
      const leadType = splitTypeFor(hero.lead, "chars");
      const lead = SplitText.create(q(".hero-lead"), { type: leadType, aria: "auto" });
      const leadUnits = leadType === "words" ? lead.words : lead.chars;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(
        q(".hero-chip"),
        { opacity: 0, y: 8, filter: "blur(6px)", duration: 0.6 },
        0,
      )
        .from(
          leadUnits,
          {
            opacity: 0,
            filter: "blur(12px)",
            y: 6,
            duration: 0.7,
            stagger: 0.018,
          },
          0.1,
        )
        .from(
          q(".hero-bio"),
          { opacity: 0, filter: "blur(8px)", y: 10, duration: 0.8 },
          0.6,
        )
        .from(q(".hero-stack-label"), { opacity: 0, duration: 0.5 }, 0.8)
        .from(
          q(".hero-stack > *"),
          {
            opacity: 0,
            y: 8,
            scale: 0.6,
            duration: 0.45,
            stagger: 0.07,
            ease: "back.out(2)",
          },
          0.85,
        )
        .from(
          q(".hero-stat"),
          { opacity: 0, x: 12, duration: 0.6, stagger: 0.1 },
          0.3,
        )
        .from(q(".hero-marquee"), { opacity: 0, y: 20, duration: 0.8 }, 0.9)
        .from(
          q(".hero-caption"),
          { opacity: 0, rotate: -6, duration: 0.6 },
          1.0,
        );

      // Pixel mosaic reveal unless the loader already dropped the card in place.
      const cells = q(".mosaic-cell");
      if (intro.handoff) gsap.set(cells, { opacity: 0 });
      else
        gsap.to(cells, {
          opacity: 0,
          duration: 0.12,
          stagger: { each: 0.008, from: "random" },
          delay: 0.2,
        });
      return () => lead.revert();
    },
    { scope: root, dependencies: [play] },
  );

  // Polaroid follows the pointer a little (tilt), like a physical card.
  const card = useRef<HTMLDivElement>(null);
  const onCardMove = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: x * 10,
      rotateX: -y * 10,
      rotate: 3 + x * 2,
      duration: 0.6,
      ease: "power3.out",
    });
  };
  const onCardLeave = () =>
    card.current &&
    gsap.to(card.current, {
      rotateY: 0,
      rotateX: 0,
      rotate: 3,
      duration: 0.8,
      ease: "elastic.out(1,0.6)",
    });

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-svh flex-col pt-28"
    >
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)_auto] md:gap-10">
        {/* Left — Sudhanva text column */}
        <div className="invisible" data-hide>
          <span className="hero-chip inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface/70 px-3 py-1.5 text-[12px] text-ink-2 backdrop-blur">
            {profile.currently.title} @{" "}
            <strong className="font-semibold text-ink">
              {profile.currently.company}
            </strong>
          </span>
          <h1 className="mt-5 font-display text-[clamp(34px,3.9vw,56px)] leading-[1.02] font-semibold tracking-[-0.02em] text-ink">
            <span className="hero-lead block">{hero.lead}</span>
            <BlurCycle words={hero.words} play={play} />
          </h1>
          <p className="hero-bio mt-6 max-w-[440px] text-[15px] leading-relaxed text-ink-2">
            <RichText segments={hero.bio} />
          </p>
          <p className="hero-stack-label mt-9 text-[15px] font-semibold text-ink">
            {ui.hero.builderStack}
          </p>
          <div className="hero-stack mt-3.5 flex max-w-[560px] flex-wrap items-center gap-2.5">
            {hero.stack.map((t) => (
              // GSAP staggers the outer span in; the hover lift is on the inner chip.
              <span key={t}>
                <span className="flex items-center gap-2.5 rounded-2xl border border-ink/[0.06] bg-surface/85 py-2 pr-4 pl-2 text-[14px] font-medium text-ink shadow-[0_4px_14px_-8px_rgba(26,24,34,0.35)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-2deg]">
                  <span className="grid size-9 place-items-center rounded-xl bg-paper">
                    <ToolIcon slug={toolSlug(t)} size={22} />
                  </span>
                  {t}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Middle — polaroid portrait (landing spot for the loader's card) */}
        <div className="flex justify-center [perspective:900px]">
          <div
            ref={card}
            onPointerMove={onCardMove}
            onPointerLeave={onCardLeave}
            className="w-full max-w-[330px] rotate-[3deg] rounded-[6px] bg-photo p-3 pb-12 shadow-[0_30px_60px_-25px_rgba(26,24,34,0.45)] [transform-style:preserve-3d]"
          >
            <div
              data-hero-card
              className="relative aspect-[4/5] overflow-hidden rounded-[2px]"
            >
              {portrait}
              <div
                aria-hidden
                className="absolute inset-0 grid"
                style={{ gridTemplateColumns: `repeat(${MOSAIC.cols},1fr)` }}
              >
                {Array.from({ length: MOSAIC.cols * MOSAIC.rows }).map(
                  (_, i) => (
                    <span key={i} className="mosaic-cell bg-paper" />
                  ),
                )}
              </div>
            </div>
            <p className="hero-caption mt-3 text-center font-script text-[22px] text-on-photo">
              {hero.polaroidCaption}
            </p>
          </div>
        </div>

        {/* Right — Anjali stats column */}
        <div
          className="invisible flex flex-row justify-between gap-6 border-ink/10 md:flex-col md:justify-center md:gap-0 md:border-l md:pl-8"
          data-hide
        >
          {hero.stats.map((s) => (
            <div
              key={s.label}
              className="hero-stat border-ink/10 py-2 text-right md:border-b md:py-8 md:last:border-b-0"
            >
              <div className="font-display text-[clamp(30px,3vw,44px)] leading-none font-semibold">
                <CountUp to={s.value} suffix={s.suffix} play={play} />
              </div>
              <div className="mt-2 text-[10px] font-semibold tracking-[0.18em] text-ink-3 uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ashu — editable vector wordmark */}
      <div data-decor className="mx-auto mt-14 w-full max-w-[1240px] px-6 text-ink">
        <PenHeadline text={ui.hero.wordmark} label={profile.role} hint={ui.hero.penHint} resetLabel={ui.hero.reset} play={play} />
      </div>

      {/* Anjali — skills strip */}
      <Marquee
        decor
        items={hero.marquee}
        className="hero-marquee mt-auto border-y border-ink/10 bg-surface/60 py-3 font-serif text-[19px] text-ink"
      />
    </section>
  );
}
