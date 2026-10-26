"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { ExternalLink } from "@/components/ui/Text";
import { FitText } from "@/components/ui/FitText";
import { img } from "@/content/images";
import { ToolIcon } from "@/components/ui/ToolIcon";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motionDisabled } from "@/lib/a11y/store";

/*
  Sanjay footer: "let's [build] incredible work together." — the script word swaps
  (build → design → ship) with a handwritten wipe; a tilted clip card on the right,
  email + socials, and a giant ARUN VIJAYAN wordmark rising out of soft clouds.
*/
export function Contact() {
  const { contact, profile, ui } = useI18n().dict;
  const clip = img("contact-clip.webp");
  const [i, setI] = useState(0);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (motionDisabled()) return;
    const count = contact.verbs.length;
    const id = setInterval(() => setI((n) => (n + 1) % count), 2200);
    return () => clearInterval(id);
  }, [contact.verbs.length]);

  useGSAP(
    () => {
      if (motionDisabled()) return;
      gsap.from(".ct-word", {
        yPercent: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: { trigger: ".ct-word", start: "top 95%", once: true },
      });
      // Clouds drift only while the footer is visible.
      const drift = gsap.to(".ct-cloud", {
        x: (k) => (k % 2 ? 40 : -40),
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });
      ScrollTrigger.create({ trigger: root.current, start: "top bottom", end: "bottom top", onToggle: (st) => (st.isActive ? drift.play() : drift.pause()) });
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="contact" className="relative overflow-hidden bg-gradient-to-b from-transparent via-sky-1/70 to-sky-2 pt-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 md:grid-cols-[1fr_auto]">
        <h2 className="font-display text-[clamp(40px,5.2vw,76px)] leading-[1.02] font-semibold tracking-[-0.02em] text-ink">
          {contact.lead}{" "}
          <span className="relative inline-block min-w-[3.4em] align-baseline">
            <AnimatePresence mode="wait">
              <motion.span
                key={i}
                initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
                animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
                className="inline-block font-script text-[1.12em] font-bold text-pink"
              >
                {contact.verbs[i]}
              </motion.span>
            </AnimatePresence>
          </span>
          <br />
          {contact.line}
        </h2>
        <motion.div
          whileHover={{ rotate: 0, scale: 1.04 }}
          initial={{ rotate: 4 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="relative aspect-[16/10] w-[260px] overflow-hidden rounded-[14px] border-[5px] border-photo shadow-[0_24px_50px_-20px_rgba(26,24,34,0.5)]"
          style={{ background: "linear-gradient(135deg,#ffb6d9,#cdb8ff)" }}
        >
          {clip && <Image src={clip} alt={ui.contactUi.clipAlt} fill sizes="260px" className="object-cover" />}
        </motion.div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1200px] flex-wrap items-end gap-x-16 gap-y-6 px-6 text-[13px]">
        <div>
          <p className="mb-1.5 text-ink-3">{ui.contactUi.email}</p>
          <a href={`mailto:${profile.email}`} className="font-medium text-ink underline-offset-4 hover:underline">
            {profile.email}
          </a>
        </div>
        <div>
          <p className="mb-1.5 text-ink-3">{ui.contactUi.social}</p>
          <div className="flex gap-2">
            <ExternalLink href={profile.links.linkedin} aria-label="LinkedIn" className="grid size-8 place-items-center rounded-full bg-ink text-[12px] font-bold text-on-ink transition hover:-translate-y-0.5">
              in
            </ExternalLink>
            <ExternalLink href={profile.links.behance} aria-label="Behance" className="grid size-8 place-items-center rounded-full bg-ink text-on-ink transition hover:-translate-y-0.5">
              <ToolIcon slug="behance" size={14} mono />
            </ExternalLink>
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-ink-3">{ui.contactUi.location}</p>
          <p className="font-medium text-ink">{profile.location}</p>
          <p className="mt-0.5 max-w-[320px] text-[12px] text-ink-3">{profile.availability}</p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1200px] border-t border-ink/10 px-6 pt-4 text-[11px] text-ink-3">
        {ui.contactUi.copyright}
      </div>

      {/* giant wordmark in the clouds */}
      <div className="relative mt-6 overflow-hidden px-4">
        {/* sized by FitText to span the full width in any language; sinks slightly into the clouds */}
        <div aria-hidden className="ct-word font-display leading-[1.1] font-bold text-cloud/80">
          <FitText className="-mb-[0.14em] tracking-[-0.03em]">{profile.name.toUpperCase()}</FitText>
        </div>
        {[
          ["-6%", "34%", 420],
          ["70%", "50%", 480],
          ["30%", "68%", 380],
        ].map(([l, t, w], k) => (
          <span
            key={k}
            aria-hidden
            className="ct-cloud absolute rounded-full will-change-transform"
            style={{ left: l as string, top: t as string, width: w as number, height: (w as number) * 0.42, background: "radial-gradient(closest-side, var(--c-cloud) 30%, color-mix(in srgb, var(--c-cloud) 60%, transparent) 60%, transparent)" }}
          />
        ))}
      </div>
    </footer>
  );
}
