"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useI18n } from "@/i18n/client";
import { a11y, motionDisabled } from "@/lib/a11y/store";
import { cn } from "@/lib/utils";

const getStill = () => motionDisabled();
const serverStill = () => false;

/*
  v2 story crawl (reference: eezyinn /agency/ "EPISODE IV" crawl). A dark sticky stage
  with stars: a short intro line fades in and out, then the episode title and Arun's
  story roll away in perspective as you scroll, fading into the distance.
  Motion off: the same text, plainly laid out.
*/
export function Crawl() {
  const { crawl } = useI18n().dict;
  const root = useRef<HTMLElement>(null);
  const still = useSyncExternalStore(a11y.subscribe, getStill, serverStill);

  useGSAP(
    () => {
      if (still) return;
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      tl.fromTo(q(".cr-intro"), { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0)
        .to(q(".cr-intro"), { opacity: 0, duration: 0.05 }, 0.1)
        .fromTo(q(".cr-text"), { yPercent: 40 }, { yPercent: -120, duration: 0.85 }, 0.12)
        .fromTo(q(".cr-outro"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.06 }, 0.92);
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root, dependencies: [still] },
  );

  const stars = Array.from({ length: 90 }, (_, i) => {
    const a = Math.sin(i * 12.9898) * 43758.5453;
    const b = Math.sin(i * 78.233) * 12543.123;
    // rounded so server and browser print identical styles (no hydration mismatch)
    return { x: Math.round((a - Math.floor(a)) * 10000) / 100, y: Math.round((b - Math.floor(b)) * 10000) / 100, s: 1 + (i % 3) };
  });

  return (
    <section ref={root} id="story" aria-label={`${crawl.episode} · ${crawl.title}`} className={cn("dark-stage relative bg-night text-on-night", !still && "h-[420vh]")}>
      <div className={cn("relative overflow-hidden", still ? "px-4 py-24 md:px-12" : "sticky top-0 h-svh")}>
        {/* stars */}
        <div aria-hidden className="absolute inset-0">
          {stars.map((st, i) => (
            <span key={i} className="absolute rounded-full bg-on-night" style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, opacity: 0.25 + (i % 5) * 0.1 }} />
          ))}
        </div>

        {still ? (
          <div className="relative mx-auto max-w-[760px] text-center">
            <p className="font-mono text-[12px] tracking-[0.2em] text-[#ffef93] uppercase">{crawl.episode}</p>
            <h2 className="display-m mt-3">{crawl.title}</h2>
            <div className="mt-8 space-y-5 text-[18px] leading-[1.6] text-on-night/85">
              {crawl.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-10 text-[20px] font-semibold text-[#ffef93]">{crawl.outro}</p>
          </div>
        ) : (
          <>
            <p className="cr-intro absolute inset-x-4 top-1/2 -translate-y-1/2 text-center text-[clamp(20px,2.4vw,34px)] font-medium tracking-[-0.02em] text-[#ff6b60] opacity-0">
              {crawl.intro}
            </p>
            {/* perspective crawl, fading into the distance */}
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_38%,#000_100%)] [perspective:420px]">
              <div className="absolute inset-x-0 top-0 mx-auto h-full w-[min(92vw,820px)] origin-[50%_100%] [transform:rotateX(24deg)]">
                <div className="cr-text absolute inset-x-0 top-full text-center">
                  <p className="font-mono text-[clamp(13px,1.2vw,18px)] tracking-[0.3em] text-[#ffef93] uppercase">{crawl.episode}</p>
                  <h2 className="mt-3 font-display text-[clamp(40px,6vw,96px)] leading-[0.9] font-[650] tracking-[-0.04em] text-[#ffef93] uppercase">{crawl.title}</h2>
                  <div className="cr-body mt-10 space-y-8 text-justify text-[clamp(22px,2.6vw,40px)] leading-[1.3] font-semibold tracking-[-0.02em] [hyphens:auto]">
                    {crawl.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="cr-outro absolute inset-x-4 bottom-[12vh] text-center text-[clamp(22px,2.6vw,40px)] font-[650] tracking-[-0.03em] text-[#ffef93] uppercase opacity-0">
              {crawl.outro}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
