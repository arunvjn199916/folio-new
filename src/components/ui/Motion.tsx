"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { motionDisabled } from "@/lib/a11y/store";

// Heading whose words blur in on scroll (Sanjay / Anjali section titles).
export function BlurHeading({
  children,
  as: Tag = "h2",
  className,
  by = "words",
}: {
  children: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  by?: "words" | "chars";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      if (!ref.current || motionDisabled()) return;
      // chars are always nested in words so a line never breaks mid-word
      const split = SplitText.create(ref.current, { type: by === "chars" ? "words,chars" : "words", aria: "auto" });
      const items = by === "chars" ? split.chars : split.words;
      gsap.from(items, {
        opacity: 0,
        filter: "blur(10px)",
        y: 8,
        duration: 0.8,
        ease: "power3.out",
        stagger: by === "chars" ? 0.025 : 0.06,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
      return () => split.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

// Generic scroll reveal: fade + rise + unblur, staggered over direct children marked [data-reveal].
export function Reveal({ children, className, stagger = 0.08 }: { children: React.ReactNode; className?: string; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (motionDisabled()) return;
      const items = ref.current?.querySelectorAll("[data-reveal]");
      if (!items?.length) return;
      gsap.from(items, {
        opacity: 0,
        y: 24,
        filter: "blur(6px)",
        duration: 0.9,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Endless ticker with bullet separators (Anjali hero strip).
export function Marquee({ items, className, speed = 40, decor }: { items: readonly string[]; className?: string; speed?: number; decor?: boolean }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t) => (
        <span key={t} className="flex items-center whitespace-nowrap">
          <span className="mx-5 inline-block size-1.5 rounded-full bg-red" />
          {t}
        </span>
      ))}
    </div>
  );
  return (
    <div
      data-decor={decor || undefined}
      className={cn(
        "flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]",
        className,
      )}
    >
      <div className="flex" style={{ animation: `marquee ${speed}s linear infinite` }}>
        {row}
        {row}
      </div>
    </div>
  );
}

// Counts up from ~a quarter of the target when `play` turns true (Anjali stats).
export function CountUp({ to, suffix = "", play }: { to: number; suffix?: string; play: boolean }) {
  const [v, setV] = useState(Math.round(to * 0.25));
  useEffect(() => {
    if (!play) return;
    const o = { v: to * 0.25 };
    const tw = gsap.to(o, { v: to, duration: 1.8, ease: "power2.out", onUpdate: () => setV(Math.round(o.v)) });
    return () => {
      tw.kill();
    };
  }, [play, to]);
  return (
    <span className="tabular-nums">
      {v}
      <span className="text-pink">{suffix}</span>
    </span>
  );
}
