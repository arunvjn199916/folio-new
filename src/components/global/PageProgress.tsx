"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/*
  v2 page-progress rail (desktop): a thin vertical line on the left edge with one tick per
  section; a glowing accent dot follows the scroll position, and ticks already passed brighten.
  Decorative only (hidden from assistive tech); the nav carries the real navigation.
*/
export function PageProgress() {
  const pathname = usePathname();
  const dot = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [ticks, setTicks] = useState<number[]>([]);
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    let marks: number[] = [];
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const els = Array.from(document.querySelectorAll<HTMLElement>("section[id], footer[id]"));
      marks = max > 0 ? els.map((el) => Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY) / max))) : [];
      setTicks(marks);
    };
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (dot.current) dot.current.style.top = `${p * 100}%`;
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
      tickRefs.current.forEach((t, i) => t?.classList.toggle("is-on", (marks[i] ?? 1) <= p + 0.002));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const remeasure = () => {
      measure();
      onScroll();
    };
    const first = requestAnimationFrame(remeasure);
    const late = setTimeout(remeasure, 1500);
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      clearTimeout(late);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <div aria-hidden className="pointer-events-none fixed top-1/2 left-5 z-40 hidden h-[44vh] -translate-y-1/2 lg:block xl:left-7">
      <span className="absolute inset-y-0 left-0 w-px bg-ink/15" />
      <span ref={fill} className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-accent/60" />
      {ticks.map((t, i) => (
        <span
          key={i}
          ref={(el) => {
            tickRefs.current[i] = el;
          }}
          className="progress-tick absolute left-0 h-px w-2.5 bg-ink/30 transition-colors duration-300"
          style={{ top: `${t * 100}%` }}
        />
      ))}
      <span ref={dot} className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
        <span className="block size-[7px] rounded-full bg-accent shadow-[0_0_10px_2px_rgb(var(--c-globe-lit)/0.7)]" />
      </span>
    </div>
  );
}
