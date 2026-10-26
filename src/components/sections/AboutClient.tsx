"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { PlaceholderLabel } from "@/components/ui/PlaceholderLabel";
import { blip } from "@/lib/intro";
import { cn } from "@/lib/utils";
import { img } from "@/content/images";
import { motionDisabled } from "@/lib/a11y/store";

type Slide = { src: string | null; tint: string; label: string };

// Work screenshot that cycles every ~1.2s, with the tilted polaroid overlapping it.
export function AboutSlides({
  slides,
  portrait,
  photoLabel,
  portraitAlt,
}: {
  slides: Slide[];
  portrait: string | null;
  photoLabel: string;
  portraitAlt: string;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || motionDisabled()) return;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), 1200);
    return () => clearInterval(id);
  }, [paused, slides.length]);
  const s = slides[i];

  return (
    <div className="relative pb-24 pl-6 md:pl-20" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[16/11] w-full max-w-[480px] overflow-hidden border-[6px] border-photo bg-photo shadow-[0_18px_40px_-20px_rgba(26,24,34,0.4)]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0"
            style={{ background: s.tint }}
          >
            {s.src ? <Image src={s.src} alt={s.label} fill sizes="480px" className="object-cover" /> : <PlaceholderLabel label={s.label} />}
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
        whileHover={{ rotate: -3, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="absolute bottom-0 left-0 w-[46%] max-w-[220px] -rotate-[7deg] bg-photo p-2 pb-8 shadow-[0_20px_40px_-18px_rgba(26,24,34,0.5)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden" style={{ background: "linear-gradient(160deg,#cdb8ff,#ffb6d9)" }}>
          {portrait ? <Image src={portrait} alt={portraitAlt} fill sizes="220px" className="object-cover" /> : <PlaceholderLabel label={photoLabel} />}
        </div>
      </motion.div>
    </div>
  );
}

const shapes = {
  scallop: "rounded-[46%] px-6 py-6",
  stamp: "rounded-[6px] px-4 py-3 text-center text-white [outline:2px_dashed_rgba(255,255,255,0.7)] [outline-offset:-6px]",
  pill: "rounded-full px-6 py-2.5 font-display text-[18px] font-bold tracking-wide text-[#6b1450] border-2 border-[#6b1450]",
  label: "rounded-[4px] px-4 py-2 font-mono text-[13px] text-ink border border-ink/20",
  photo: "rounded-[6px] px-4 py-6 font-script text-[22px] text-white",
};

// Sticker-style navigation (Ishika): each one wobbles on hover like a peeled sticker.
export function Sticker({
  href,
  kind,
  color,
  rotate,
  children,
}: {
  href: string;
  kind: keyof typeof shapes;
  color: string;
  rotate: number;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      onMouseEnter={() => blip(760, 0.04, 0.02)}
      initial={{ rotate }}
      whileHover={{ rotate: rotate * -1.5, scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 14 }}
      className={cn(
        "inline-block font-semibold shadow-[0_6px_14px_-6px_rgba(26,24,34,0.35)] select-none",
        shapes[kind],
        kind === "scallop" && "font-display text-[17px] text-[#1e2a6b]",
      )}
      style={{
        background:
          kind === "photo"
            ? `linear-gradient(160deg, ${color}99, #1f7a52dd), center / cover no-repeat url(${img("reachout.webp")})`
            : color,
        ...(kind === "scallop"
          ? { clipPath: "polygon(50% 0%,61% 8%,75% 5%,80% 18%,95% 25%,91% 39%,100% 50%,91% 61%,95% 75%,80% 82%,75% 95%,61% 92%,50% 100%,39% 92%,25% 95%,20% 82%,5% 75%,9% 61%,0% 50%,9% 39%,5% 25%,20% 18%,25% 5%,39% 8%)" }
          : {}),
      }}
    >
      {children}
    </motion.a>
  );
}

export function CopyEmail({
  email,
  label,
  copiedLabel,
  children,
}: {
  email: string;
  label: string;
  copiedLabel: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      aria-label={`${label}: ${email}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className="relative grid size-8 place-items-center rounded-lg bg-ink text-on-ink transition hover:-translate-y-0.5"
    >
      {copied ? <Check size={15} /> : children}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-10 rounded-md bg-ink px-2 py-1 font-mono text-[10px] whitespace-nowrap text-on-ink"
          >
            {copiedLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
