"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { intro } from "@/lib/intro";
import { motionDisabled } from "@/lib/a11y/store";

// Lenis drives the page; ScrollTrigger reads Lenis' scroll so pinned sections stay in sync.
export function SmoothScroll() {
  useEffect(() => {
    if (motionDisabled()) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    intro.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor links scroll smoothly through Lenis.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -20 });
    };
    document.addEventListener("click", onClick);

    // Re-measure every trigger once fonts and late sections have settled.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    const late = setTimeout(refresh, 1200);

    return () => {
      document.removeEventListener("click", onClick);
      clearTimeout(late);
      gsap.ticker.remove(tick);
      lenis.destroy();
      intro.lenis = null;
    };
  }, []);
  return null;
}
