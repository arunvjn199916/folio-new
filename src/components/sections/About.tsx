import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import { getDictionary } from "@/i18n/server";
import { RichText, ExternalLink } from "@/components/ui/Text";
import { img } from "@/content/images";
import { CopyEmail } from "./AboutClient";
import { BlurHeading, Reveal } from "@/components/ui/Motion";

/*
  v2 about (reference: the agency block): portrait behind a dot-matrix screen on one side;
  eyebrow, the "engineer first" headline, the story, companies and actions on the other.
*/
export async function About() {
  const { about, profile, ui } = await getDictionary();
  const portrait = img("about-portrait.webp");

  return (
    <section id="about" className="relative px-4 py-24 md:px-12 md:py-32">
      <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 xl:gap-24">
        {/* portrait */}
        <Reveal className="relative">
          <div data-reveal className="group relative aspect-[4/5] overflow-hidden rounded-[28px] border border-ink/10 bg-card">
            {portrait && (
              <Image
                src={portrait}
                alt={profile.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover grayscale-[35%] transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
              />
            )}
            {/* dot-matrix screen + brand wash */}
            <span aria-hidden className="absolute inset-0 bg-[radial-gradient(color-mix(in_srgb,var(--c-paper)_70%,transparent)_1.1px,transparent_1.5px)] [background-size:6px_6px] opacity-70 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-30" />
            <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,color-mix(in_srgb,var(--c-crimson)_35%,transparent))]" />
            <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-white uppercase backdrop-blur">
              <span className="size-1.5 rounded-full bg-[#ffef93]" /> {profile.location}
            </span>
          </div>
        </Reveal>

        {/* story */}
        <div>
          <p className="eyebrow flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--c-globe-lit)/0.8)]" />
            {ui.about.tape}
          </p>
          <BlurHeading className="display-m mt-4 max-w-[16ch] text-ink">{about.greeting}</BlurHeading>
          <Reveal className="mt-8 max-w-[600px] space-y-4 text-[16px] leading-[1.65] text-ink-2 md:text-[17px]">
            {about.paragraphs.map((p, i) => (
              <p key={i} data-reveal>
                <RichText segments={p} highlightClass="font-semibold text-ink" />
              </p>
            ))}
          </Reveal>

          <div className="mt-10 border-t border-ink/10 pt-6">
            <p className="eyebrow">{ui.about.workedWith}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {about.workedWith.map((c) => (
                <li key={c} className="rounded-full border border-ink/15 px-4 py-2 text-[13px] font-bold tracking-[0.02em] text-ink uppercase">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={profile.links.resume} target="_blank" rel="noopener" className="btn-accent">
              {ui.nav.resume} <ArrowUpRight size={18} strokeWidth={2.4} />
            </a>
            <ExternalLink href={profile.links.linkedin} className="btn-outline">
              LinkedIn <ArrowUpRight size={18} />
            </ExternalLink>
            <CopyEmail email={profile.email} label={ui.about.copyEmail} copiedLabel={ui.about.copied}>
              <Mail size={15} />
            </CopyEmail>
          </div>
        </div>
      </div>
    </section>
  );
}
