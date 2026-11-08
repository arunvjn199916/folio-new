"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { FitText } from "@/components/ui/FitText";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionDisabled } from "@/lib/a11y/store";

/*
  v2 closing (reference: the CTA rows + footer).
  1. "What are you hiring for?" — full-width rows with arrow circles.
  2. Dark footer panel: "LET'S [design → build → ship] AI PEOPLE TRUST.", email / LinkedIn
     rows, link columns, location, and a giant wordmark with a glowing dot.
*/
export function Contact() {
  const { dict, href } = useI18n();
  const { contact, profile, ui, hire } = dict;
  const t = ui.contactUi;
  const [i, setI] = useState(0);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (motionDisabled()) return;
    const id = setInterval(() => setI((n) => (n + 1) % contact.verbs.length), 2200);
    return () => clearInterval(id);
  }, [contact.verbs.length]);

  useGSAP(
    () => {
      if (motionDisabled()) return;
      gsap.from(".ct-row", { opacity: 0, y: 30, duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".ct-rows", start: "top 85%", once: true } });
      gsap.from(".ct-word", { yPercent: 50, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".ct-word", start: "top 98%", once: true } });
    },
    { scope: root },
  );

  const hireHref = (kind: "email" | "resume" | "linkedin") =>
    kind === "email"
      ? `mailto:${profile.email}?subject=${encodeURIComponent("Full-time product designer role")}`
      : kind === "resume"
        ? profile.links.resume
        : profile.links.linkedin;

  const pages = [
    { label: ui.nav.work, href: `${href("/")}#work` },
    { label: ui.nav.journey, href: `${href("/")}#experience` },
    { label: ui.nav.about, href: `${href("/")}#about` },
    { label: ui.nav.aiWorkflow, href: href("/ai-workflow") },
    { label: ui.dsDocs.title, href: href("/design-system") },
  ];
  const elsewhere = [
    { label: "LinkedIn", href: profile.links.linkedin },
    { label: "Behance", href: profile.links.behance },
    { label: ui.nav.resume, href: profile.links.resume },
  ];

  return (
    <footer ref={root} id="contact" className="relative">
      {/* 1 — hire rows */}
      <div className="px-4 pt-24 pb-20 md:px-12 md:pt-32">
        <p className="eyebrow flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--c-globe-lit)/0.8)]" />
          {hire.eyebrow}
        </p>
        <h2 className="display-m mt-4 text-ink">{hire.title}</h2>
        <ul className="ct-rows mt-10 border-t border-ink/10">
          {hire.rows.map((r) => (
            <li key={r.kind} className="ct-row border-b border-ink/10">
              <a
                href={hireHref(r.kind)}
                target={r.kind === "email" ? undefined : "_blank"}
                rel={r.kind === "email" ? undefined : "noopener"}
                className="group flex items-center justify-between gap-6 py-6 md:py-8"
              >
                <span className="font-display text-[clamp(24px,3.2vw,48px)] leading-none font-[650] tracking-[-0.04em] text-ink uppercase transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-accent">
                  {r.label}
                </span>
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent md:size-14">
                  <ArrowRight size={20} className="transition-transform duration-300 group-hover:-rotate-45" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 2 — dark footer panel */}
      <div className="dark-stage relative overflow-hidden rounded-t-[32px] bg-night text-on-night md:rounded-t-[56px]">
        <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(220,2,8,0.35),transparent)] blur-2xl" />
        <div className="relative grid grid-cols-1 gap-12 px-4 pt-20 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:px-12 md:pt-28">
          <div>
            <p className="eyebrow">{ui.nav.contact}</p>
            <h2 className="display-l mt-4">
              {contact.lead}{" "}
              <span className="relative inline-block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={i}
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
                    className="inline-block text-[#ffef93]"
                  >
                    {contact.verbs[i]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              {contact.line}
            </h2>
          </div>

          <div className="md:pt-10">
            {[
              { label: t.email, value: profile.email, href: `mailto:${profile.email}` },
              { label: "LinkedIn", value: profile.links.linkedin.replace("https://www.", ""), href: profile.links.linkedin },
            ].map((row) => (
              <a key={row.label} href={row.href} target={row.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener" className="group flex items-center justify-between gap-6 border-b border-on-night/15 py-5">
                <span className="min-w-0">
                  <span className="block font-mono text-[11px] tracking-[0.14em] text-on-night/50 uppercase">{row.label}</span>
                  <span className="mt-1 block truncate text-[clamp(18px,1.8vw,26px)] font-semibold tracking-[-0.02em] transition-colors group-hover:text-[#ffef93]">{row.value}</span>
                </span>
                <ArrowUpRight size={22} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            ))}
            <a href={`mailto:${profile.email}`} className="btn-accent mt-8 !bg-[#ffef93] !text-[#100001]">
              {t.emailMe} <ArrowRight size={18} strokeWidth={2.4} />
            </a>
          </div>
        </div>

        {/* columns */}
        <div className="relative mt-20 grid grid-cols-2 gap-10 px-4 md:grid-cols-4 md:px-12">
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] text-on-night/50 uppercase">{t.pages}</p>
            <ul className="mt-4 space-y-2 text-[15px]">
              {pages.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition-colors hover:text-[#ffef93]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] text-on-night/50 uppercase">{t.elsewhere}</p>
            <ul className="mt-4 space-y-2 text-[15px]">
              {elsewhere.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener" className="inline-flex min-h-6 items-center gap-1 py-0.5 transition-colors hover:text-[#ffef93]">
                    {l.label} <ArrowUpRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2">
            <p className="font-mono text-[11px] tracking-[0.14em] text-on-night/50 uppercase">{t.location}</p>
            <p className="mt-4 text-[15px] font-semibold">{profile.location}</p>
            <p className="mt-1 max-w-[360px] text-[14px] text-on-night/60">{profile.availability}</p>
          </div>
        </div>

        <div className="relative mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-on-night/10 px-4 py-5 text-[12px] text-on-night/50 md:px-12">
          <span>{t.copyright}</span>
          <a href={`${href("/")}#top`} className="inline-flex min-h-6 items-center gap-1.5 hover:text-on-night">
            {t.backTop} <ArrowUp size={13} />
          </a>
        </div>

        {/* giant wordmark */}
        <div aria-hidden className="relative overflow-hidden px-4 md:px-8">
          <div className="ct-word relative font-display leading-[1] font-extrabold text-on-night">
            <FitText className="-mb-[0.18em] tracking-[-0.06em] lowercase">{profile.name}</FitText>
            <span className="absolute top-[6%] right-[1.5%] size-[2.2vw] min-h-3 min-w-3 rounded-full bg-[#ffef93] shadow-[0_0_40px_10px_rgba(255,239,147,0.45)]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
