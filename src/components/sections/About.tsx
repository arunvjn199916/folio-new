import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { RichText, ExternalLink } from "@/components/ui/Text";
import { img } from "@/content/images";
import { AboutSlides, Sticker, CopyEmail } from "./AboutClient";
import { Reveal } from "@/components/ui/Motion";
import { Mail } from "lucide-react";
import { ToolIcon } from "@/components/ui/ToolIcon";

// Ishika reference: a scrapbook board — tilted polaroid over an auto-cycling work
// screenshot, an "ABOUT ME" tape label, monospace copy with highlighter marks,
// sticker navigation, a vertical social stack and a "worked with" row.
export async function About() {
  const { about, profile, projects, ui } = await getDictionary();
  const locale = await getLocale();
  const slides = projects.map((p) => ({ src: img(p.media), tint: p.tint, label: p.title }));
  const portrait = img("about-portrait.webp");

  return (
    <section id="about" className="relative px-4 py-28 md:px-6">
      <div className="dot-grid relative mx-auto max-w-[1240px] overflow-hidden rounded-[28px] border border-surface/70 bg-surface/80 px-6 py-12 shadow-[0_30px_80px_-40px_rgba(26,24,34,0.35)] md:px-14 md:py-16">
        {/* scattered pins */}
        {[
          [8, 12],
          [46, 6],
          [92, 22],
          [60, 48],
          [12, 70],
          [88, 84],
          [40, 92],
        ].map(([x, y], i) => (
          <span key={i} aria-hidden className="absolute size-2 rounded-full bg-ink/15 shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]" style={{ left: `${x}%`, top: `${y}%` }} />
        ))}

        <div className="relative grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal className="relative">
            <div data-reveal>
              <AboutSlides slides={slides} portrait={portrait} photoLabel={ui.about.photo} portraitAlt={profile.name} />
            </div>

            <div data-reveal className="mt-10">
              <span className="inline-block -rotate-2 bg-[#f7a7b8] px-3 py-1 font-display text-[15px] font-semibold tracking-[0.08em] text-[#7a1730] shadow-[2px_2px_0_#e07b92]">
                {ui.about.tape}
              </span>
            </div>

            <div data-reveal className="mt-5 max-w-[520px] space-y-4 font-mono text-[13px] leading-[1.75] text-ink-2">
              <p>{about.greeting}</p>
              {about.paragraphs.map((p, i) => (
                <p key={i}>
                  <RichText segments={p} />
                </p>
              ))}
            </div>
          </Reveal>

          <div className="flex flex-col justify-between gap-12">
            {/* Sticker nav */}
            <div className="flex flex-wrap items-start justify-end gap-3 md:pr-14">
              <Sticker href="#about" kind="scallop" color="#c9d6ff" rotate={-4}>
                {ui.about.stickers.about}
              </Sticker>
              <Sticker href={localePath(locale, "/ai-workflow")} kind="stamp" color="#ff4d5e" rotate={3}>
                <span className="block font-serif text-[22px] leading-none italic">{ui.about.stickers.ai}</span>
                <span className="block text-[13px] font-bold tracking-wide">{ui.about.stickers.workflow}</span>
              </Sticker>
              <Sticker href="#work" kind="pill" color="#ff9fd0" rotate={-3}>
                {ui.about.stickers.work}
              </Sticker>
              <Sticker href={profile.links.resume} kind="label" color="#ffe066" rotate={4}>
                {ui.about.stickers.resume}
              </Sticker>
              <Sticker href="#contact" kind="photo" color="#3ec98a" rotate={-2}>
                {ui.about.stickers.reachOut}
              </Sticker>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow mb-4 text-ink">{ui.about.workedWith}</p>
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                  {about.workedWith.map((c) => (
                    <li key={c} className="font-display text-[15px] font-semibold tracking-tight text-ink/80 grayscale transition hover:text-ink">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              {/* vertical social stack */}
              <div className="flex flex-col gap-2">
                <ExternalLink href={profile.links.linkedin} aria-label="LinkedIn" className="grid size-8 place-items-center rounded-lg bg-ink text-on-ink transition hover:-translate-y-0.5">
                  <span className="font-sans text-[13px] font-bold">in</span>
                </ExternalLink>
                <ExternalLink href={profile.links.behance} aria-label="Behance" className="grid size-8 place-items-center rounded-lg bg-ink text-on-ink transition hover:-translate-y-0.5">
                  <ToolIcon slug="behance" size={15} mono />
                </ExternalLink>
                <CopyEmail email={profile.email} label={ui.about.copyEmail} copiedLabel={ui.about.copied}>
                  <Mail size={15} />
                </CopyEmail>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
