"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MousePointerClick } from "lucide-react";
import { img } from "@/content/images";
import type { Shot } from "@/content/case-studies/types";
import { cn } from "@/lib/utils";

export type LiveLabels = { title: string; sub: string; hint: string; prev: string; next: string; screens: string; screen: string };

/*
  Clickable prototype: the app's real screens inside a phone (or browser) frame.
  Click/tap the screen or use the arrows to move through the flow; long screens scroll
  inside the frame like the real app. Keyboard: the screen region is focusable, ← / → move.
*/
export function LivePreview({ shots, device = "phone", labels, accent }: { shots: Shot[]; device?: "phone" | "web"; labels: LiveLabels; accent: string }) {
  const [i, setI] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const n = shots.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [i]);

  if (!n) return null;
  const s = shots[i];
  const url = img(s.src);
  const [w, h] = (s.ratio ?? (device === "web" ? "1440/900" : "375/812")).split("/").map(Number);

  const screen = (
    <div
      ref={scroller}
      tabIndex={0}
      role="region"
      aria-roledescription={labels.screen}
      aria-label={`${s.label} — ${i + 1} / ${n}`}
      onClick={() => go(1)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      }}
      className={cn(
        "relative cursor-pointer overflow-x-hidden overflow-y-auto overscroll-contain bg-white outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-accent",
        device === "phone" ? "aspect-[390/844] rounded-[12.5%/5.8%]" : "aspect-[1440/900]",
      )}
    >
      {url && (
        <Image key={s.src} src={url} alt={s.label} width={w * 2} height={h * 2} sizes={device === "phone" ? "320px" : "(max-width: 768px) 100vw, 900px"} className="lp-in block h-auto w-full" />
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
      <div className={cn("relative mx-auto w-full", device === "phone" ? "max-w-[320px]" : "max-w-[900px]")}>
        <div aria-hidden className="pointer-events-none absolute inset-[-14%] -z-10 rounded-full opacity-60 blur-3xl" style={{ background: `radial-gradient(closest-side, color-mix(in srgb, ${accent} 45%, transparent), transparent)` }} />
        {device === "phone" ? (
          <div className="relative rounded-[15%/7%] bg-[#0e0d12] p-[3.2%] shadow-[0_40px_80px_-30px_rgba(20,16,40,0.6),inset_0_0_0_1.5px_#3a3842,inset_0_0_0_3px_#16151b]">
            {screen}
            <span aria-hidden className="pointer-events-none absolute top-[3.4%] left-1/2 h-[2.9%] w-[28%] -translate-x-1/2 rounded-full bg-[#0e0d12]" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-[14px] border border-black/10 bg-white shadow-[0_30px_70px_-35px_rgba(20,16,40,0.45)]">
            <div className="flex h-8 items-center gap-1.5 border-b border-black/[0.06] bg-[#f5f4f7] px-3">
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
              ))}
              <span className="mx-auto h-4 w-[40%] rounded-full bg-black/[0.06]" />
            </div>
            {screen}
          </div>
        )}
      </div>

      <div>
        <p className="flex items-center gap-2 text-[13px] text-ink-3">
          <MousePointerClick size={16} aria-hidden /> {labels.hint}
        </p>
        <div className="mt-6 flex items-center gap-4">
          <button type="button" onClick={() => go(-1)} aria-label={labels.prev} className="grid size-12 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:border-accent hover:bg-accent hover:text-on-accent">
            <ArrowLeft size={18} />
          </button>
          <p aria-live="polite" className="min-w-0 flex-1">
            <span className="block font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase">
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <span className="mt-1 block truncate text-[20px] font-semibold tracking-[-0.02em] text-ink">{s.label}</span>
          </p>
          <button type="button" onClick={() => go(1)} aria-label={labels.next} className="grid size-12 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:border-accent hover:bg-accent hover:text-on-accent">
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink/10">
          <span className="block h-full rounded-full transition-[width] duration-500" style={{ width: `${((i + 1) / n) * 100}%`, background: "var(--case-accent-text)" }} />
        </div>
        <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase">{labels.screens}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {shots.map((x, k) => (
            <li key={x.src + k}>
              <button
                type="button"
                aria-pressed={k === i}
                onClick={() => setI(k)}
                className={cn(
                  "min-h-8 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                  k === i ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink-2 hover:border-ink/40 hover:text-ink",
                )}
              >
                {x.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
