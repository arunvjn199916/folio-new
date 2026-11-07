"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/client";

export default function NotFound() {
  const { dict, href } = useI18n();
  const t = dict.ui.notFound;
  return (
    <section className="relative grid min-h-svh place-items-center overflow-hidden px-4 text-center">
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 h-[60vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--c-space-3)_55%,transparent),transparent)] blur-2xl" />
      <div className="relative">
        <p className="font-display text-[clamp(120px,22vw,320px)] leading-[0.85] font-extrabold tracking-[-0.06em] text-accent [text-shadow:0_0_80px_rgb(var(--c-globe-lit)/0.35)]">{t.eyebrow}</p>
        <h1 className="display-m mt-6 text-ink">{t.title}</h1>
        <Link href={href("/")} className="btn-accent mt-10">
          <ArrowLeft size={18} strokeWidth={2.4} /> {t.home}
        </Link>
      </div>
    </section>
  );
}
