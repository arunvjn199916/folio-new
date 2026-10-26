"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { motionDisabled } from "@/lib/a11y/store";

// The last line of the hero headline (Sudhanva): the current phrase blurs out
// letter by letter, the next one blurs in, each in its own colour (Anjali).
export function BlurCycle({ words, play, interval = 2.6 }: { words: { text: string; color: string }[]; play: boolean; interval?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [i, setI] = useState(0);
  const first = useRef(true);

  // Animate the current word in.
  useEffect(() => {
    const el = ref.current;
    if (!el || !play) return;
    const chars = el.querySelectorAll("span");
    const tw = gsap.fromTo(
      chars,
      { opacity: 0, filter: "blur(10px)", y: 6 },
      { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.55, stagger: 0.03, ease: "power3.out", delay: first.current ? 0.5 : 0 },
    );
    first.current = false;
    if (motionDisabled()) return () => tw.kill();
    const out = gsap.delayedCall(interval, () => {
      gsap.to(chars, {
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

  const w = words[i];
  // Characters are grouped per word so long phrases wrap between words, never inside one.
  // min-height keeps two lines reserved so the layout doesn't jump between phrases.
  return (
    <span className="relative block min-h-[2.04em]" aria-live="polite">
      <span ref={ref} className="block" style={{ color: w.color }} key={i}>
        {w.text.split(" ").map((word, wi, arr) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {[...word].map((c, k) => (
              <span key={k} className="inline-block opacity-0">
                {c}
              </span>
            ))}
            {wi < arr.length - 1 && <span className="inline-block opacity-0">&nbsp;</span>}
          </span>
        ))}
      </span>
    </span>
  );
}
