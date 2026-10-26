"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { motionDisabled } from "@/lib/a11y/store";
import { animationUnits } from "@/lib/text";

// The last line of the hero headline (Sudhanva): the current phrase blurs out unit by
// unit, the next one blurs in, each in its own colour (Anjali).
//
// Layout stability: every phrase is rendered in the same grid cell (only the active one is
// visible), so the line is always as tall as the longest phrase and nothing below it moves.
// Script safety: units come from animationUnits() — graphemes for Latin, whole words for
// Indic scripts, so Tamil/Devanagari letters are never split from their vowel signs.
export function BlurCycle({ words, play, interval = 2.6 }: { words: { text: string; color: string }[]; play: boolean; interval?: number }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const [i, setI] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    const el = refs.current[i];
    if (!el || !play) return;
    const units = el.querySelectorAll("[data-unit]");
    const tw = gsap.fromTo(
      units,
      { opacity: 0, filter: "blur(10px)", y: 6 },
      { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.55, stagger: 0.03, ease: "power3.out", delay: first.current ? 0.5 : 0 },
    );
    first.current = false;
    if (motionDisabled()) return () => tw.kill();
    const out = gsap.delayedCall(interval, () => {
      gsap.to(units, {
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.35,
        stagger: 0.02,
        ease: "power2.in",
        onComplete: () => setI((n) => (n + 1) % words.length),
      });
    });
    return () => {
      tw.kill();
      out.kill();
    };
  }, [i, play, interval, words.length]);

  return (
    <span className="grid [overflow-wrap:anywhere]" aria-live="polite">
      {words.map((w, k) => (
        <span
          key={k}
          ref={(node) => {
            refs.current[k] = node;
          }}
          aria-hidden={k !== i}
          className="col-start-1 row-start-1 block"
          style={{ color: w.color, visibility: k === i ? "visible" : "hidden" }}
        >
          {w.text.split(" ").map((word, wi, arr) => (
            <span key={wi} className="inline-block max-w-full">
              {animationUnits(word).map((u, ui) => (
                <span key={ui} data-unit className="inline-block opacity-0">
                  {u}
                </span>
              ))}
              {wi < arr.length - 1 && (
                <span data-unit className="inline-block opacity-0">
                  &nbsp;
                </span>
              )}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
