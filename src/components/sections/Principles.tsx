"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useI18n } from "@/i18n/client";
import { a11y, motionDisabled } from "@/lib/a11y/store";
import { cn } from "@/lib/utils";

const getStill = () => motionDisabled();
const serverStill = () => false;

/*
  v2 "stance" (reference: "Not every business needs a relaunch."). A sticky stage shows one
  principle at a time; as you scroll its words light up one by one, then it hands over to
  the next. Three dots track which one is on screen. Motion off: all three, stacked.
*/
export function Principles() {
  const { principles } = useI18n().dict;
  const root = useRef<HTMLElement>(null);
  const still = useSyncExternalStore(a11y.subscribe, getStill, serverStill);
  const n = principles.items.length;

  useGSAP(
    () => {
      if (still) return;
      const q = gsap.utils.selector(root);
      const items = q(".pr-item");
      const dots = q(".pr-dot");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.5 },
      });
      items.forEach((item, i) => {
        const words = item.querySelectorAll(".pr-word");
        const at = i;
        tl.fromTo(item, { opacity: 0, y: 40, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.18 }, at);
        tl.to(words, { color: "var(--c-ink)", stagger: 0.5 / words.length, duration: 0.12 }, at + 0.12);
        tl.to(dots[i], { backgroundColor: "var(--c-accent)", scale: 1.4, duration: 0.1 }, at + 0.1);
        if (i < items.length - 1) {
          tl.to(item, { opacity: 0, y: -40, filter: "blur(10px)", duration: 0.18 }, at + 0.82);
          tl.to(dots[i], { backgroundColor: "color-mix(in srgb, var(--c-ink) 25%, transparent)", scale: 1, duration: 0.1 }, at + 0.85);
        }
      });
      tl.set({}, {}, n);
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root, dependencies: [still, n] },
  );

  return (
    <section ref={root} id="principles" aria-label={principles.eyebrow} className={cn("relative", !still && "h-[320vh]")}>
      <div className={cn("flex flex-col items-center justify-center overflow-hidden px-4 md:px-12", still ? "py-24" : "sticky top-0 h-svh")}>
        <div aria-hidden className="absolute top-1/2 left-1/2 h-[60vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--c-space-3)_50%,transparent),transparent)] blur-2xl" />
        <p className="eyebrow relative">{principles.eyebrow}</p>
        <div className={cn("relative mt-8 w-full max-w-[1000px] text-center", !still && "grid [grid-template-areas:'stack']")}>
          {principles.items.map((it, i) => (
            <p
              key={i}
              className={cn(
                "pr-item text-[clamp(30px,4.4vw,68px)] leading-[1.08] font-medium tracking-[-0.035em]",
                still ? "mb-10 text-ink" : "opacity-0 [grid-area:stack]",
              )}
            >
              {`${it.lead} ${it.rest}`.split(" ").map((w, k) => (
                <span key={k} className={cn("pr-word", still ? "text-ink" : "text-ink/20")}>
                  {w}{" "}
                </span>
              ))}
            </p>
          ))}
        </div>
        {!still && (
          <div aria-hidden className="relative mt-10 flex gap-2.5">
            {principles.items.map((_, i) => (
              <span key={i} className="pr-dot size-1.5 rounded-full bg-ink/25" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
