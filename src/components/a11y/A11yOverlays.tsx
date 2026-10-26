"use client";

import { useEffect, useRef, useState } from "react";
import { useA11y } from "@/lib/a11y/store";
import { intro } from "@/lib/intro";
import { gsap } from "@/lib/gsap";

/*
  The few adjustments CSS can't do alone:
  - Reading guide: a bar that follows the pointer's line.
  - Reading mask: dims everything except a band around the pointer.
  - Text magnifier: shows the hovered text enlarged in a tooltip.
  - Mute sounds / Stop animations: side effects on the audio blips, GSAP and Lenis.
*/
export function A11yOverlays() {
  const s = useA11y();
  const [y, setY] = useState<number | null>(null);
  const [mag, setMag] = useState<{ text: string; x: number; y: number } | null>(null);
  const raf = useRef(0);

  const tracking = s.readingGuide || s.readingMask || s.textMagnifier;

  useEffect(() => {
    if (!tracking) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear overlays when every pointer tool is off
      setY(null);
      setMag(null);
      return;
    }
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setY(e.clientY);
        if (!s.textMagnifier) return;
        const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("p, li, h1, h2, h3, h4, a, button, span, figcaption, blockquote, label");
        const text = el && !el.closest(".a11y-ui") ? el.innerText.trim().slice(0, 220) : "";
        setMag(text ? { text, x: e.clientX, y: e.clientY } : null);
      });
    };
    const onLeave = () => {
      setY(null);
      setMag(null);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [tracking, s.textMagnifier]);

  // Mute: silence UI blips (the music player is removed by CSS).
  useEffect(() => {
    if (s.muteSounds) intro.setSound(false);
  }, [s.muteSounds]);

  // Stop animations: finish running tweens, freeze smooth-scroll inertia. Future
  // animations check motionDisabled() themselves.
  useEffect(() => {
    if (!s.stopAnimations) {
      intro.lenis?.start();
      return;
    }
    gsap.globalTimeline.getChildren(true, true, false).forEach((tw) => {
      if (tw.repeat() === -1) tw.pause();
      else tw.progress(1);
    });
    intro.lenis?.stop();
    intro.lenis?.start(); // restart without inertia carried over
  }, [s.stopAnimations]);

  return (
    <div className="a11y-ui pointer-events-none" aria-hidden>
      {s.readingGuide && y !== null && (
        <div className="fixed inset-x-0 z-[85] h-3 -translate-y-1/2 border-y-2 border-[#1a1822] bg-[#ffd23a]/70" style={{ top: y }} />
      )}
      {s.readingMask && y !== null && (
        <>
          <div className="fixed inset-x-0 top-0 z-[85] bg-black/60" style={{ height: Math.max(0, y - 60) }} />
          <div className="fixed inset-x-0 bottom-0 z-[85] bg-black/60" style={{ top: y + 60 }} />
        </>
      )}
      {s.textMagnifier && mag && (
        <div
          className="fixed z-[95] max-w-[min(560px,90vw)] rounded-2xl bg-[#14121a] px-4 py-3 text-[26px] leading-snug font-semibold text-white shadow-2xl"
          style={{ left: Math.min(mag.x + 16, window.innerWidth - 580), top: mag.y + 24 }}
        >
          {mag.text}
        </div>
      )}
    </div>
  );
}
