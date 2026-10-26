"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/*
  Single-line text that scales to exactly fill its container's width, whatever the
  language or length (e.g. "ARUN VIJAYAN" vs "அருண் விஜயன்"). It measures the text at a
  reference size and sets font-size proportionally; re-measures on resize and once
  web fonts have loaded (their metrics differ from the fallback's).
*/
export function FitText({ children, className, fill = 0.98, max = 520 }: { children: string; className?: string; fill?: number; max?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const b = box.current;
    const t = text.current;
    if (!b || !t) return;
    const REF = 100;
    const fit = () => {
      t.style.fontSize = `${REF}px`;
      const natural = t.getBoundingClientRect().width;
      if (!natural) return;
      t.style.fontSize = `${Math.min(max, (REF * b.clientWidth * fill) / natural)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [children, fill, max]);

  return (
    <div ref={box} className="w-full text-center">
      <span ref={text} className={cn("inline-block whitespace-nowrap", className)}>
        {children}
      </span>
    </div>
  );
}
