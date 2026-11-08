import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { img } from "@/content/images";
import { BlurHeading, Reveal } from "@/components/ui/Motion";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Contact } from "@/components/sections/Contact";

export async function generateMetadata(): Promise<Metadata> {
  const { aboutPage, profile } = await getDictionary();
  return { title: `${aboutPage.title} — ${profile.role}`, description: aboutPage.line };
}

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="eyebrow flex items-center gap-2">
    <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--c-globe-lit)/0.8)]" />
    {children}
  </p>
);

/*
  v2 About page — mirrors the reference agency page: photo hero → statement → who I've
  worked with → toolbox (in place of the team) → design DNA → how I work → base → "enough
  about me" → contact.
*/
export default async function AboutPage() {
  const { aboutPage: t, profile, roles, toolGroups, skillPills, process, processNotes, education, ui } = await getDictionary();
  const locale = await getLocale();
  const home = localePath(locale);
  const portrait = img("about-portrait.webp");
  const tools = toolGroups.flatMap((g) => g.tools.map((tool) => ({ ...tool, group: g.label })));

  return (
    <>
      {/* 1 — photo hero */}
      <section className="dark-stage relative isolate flex min-h-svh overflow-hidden bg-night text-on-night">
        {portrait && <Image src={portrait} alt={profile.name} fill priority sizes="100vw" className="-z-20 object-cover object-[70%_30%] grayscale-[40%]" />}
        <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,0,1,0.96)_0%,rgba(10,0,1,0.8)_40%,rgba(10,0,1,0.25)_80%)] max-md:bg-[linear-gradient(0deg,rgba(10,0,1,0.97)_0%,rgba(10,0,1,0.8)_55%,rgba(10,0,1,0.3)_100%)]" />
        <div className="mt-auto w-full px-4 pb-14 md:px-12 md:pb-20">
          <p className="font-mono text-[11px] tracking-[0.14em] text-on-night/60 uppercase">{t.eyebrow}</p>
          <BlurHeading as="h1" className="display-xl mt-5 max-w-[12ch]">
            {t.title}
          </BlurHeading>
          <p className="mt-6 max-w-[560px] text-[17px] leading-[1.55] text-on-night/80 md:text-[20px]">{t.line}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`${home}#work`} className="btn-accent !bg-[#ffef93] !text-[#100001]">
              {t.seeWork} <ArrowRight size={18} strokeWidth={2.4} />
            </Link>
            <a href={profile.links.resume} target="_blank" rel="noopener" className="btn-outline !border-on-night/30 !bg-transparent !text-on-night hover:!border-on-night">
              {ui.nav.resume} <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* 2 — statement */}
      <section className="px-4 py-28 text-center md:px-12 md:py-40">
        <BlurHeading className="display-l mx-auto max-w-[16ch] text-ink">{t.statement.title}</BlurHeading>
        <Reveal className="mx-auto mt-10 grid grid-cols-1 max-w-[980px] gap-6 text-left text-[17px] leading-[1.65] text-ink-2 md:grid-cols-2 md:gap-10 md:text-[19px]">
          {t.statement.body.map((p) => (
            <p key={p} data-reveal>
              {p}
            </p>
          ))}
        </Reveal>
      </section>

      {/* 3 — who I've worked with */}
      <section className="px-4 pb-24 md:px-12 md:pb-32">
        <Eyebrow>{t.companies.eyebrow}</Eyebrow>
        <h2 className="display-m mt-4 text-ink">{t.companies.title}</h2>
        <Reveal className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <div key={r.company} data-reveal className="flex min-h-[180px] flex-col justify-between rounded-[24px] border border-ink/10 bg-card p-6">
              <p className="font-mono text-[11px] tracking-[0.12em] text-ink-3 uppercase">
                {r.from} – {r.to}
              </p>
              <div>
                <p className="text-[clamp(22px,1.8vw,28px)] leading-[1] font-[650] tracking-[-0.035em] text-ink uppercase">{r.company}</p>
                <p className="mt-2 text-[14px] text-ink-2">{r.role}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* 4 — toolbox */}
      <section className="dark-stage rounded-[32px] bg-night px-4 py-20 text-on-night md:mx-4 md:rounded-[48px] md:px-10 md:py-28">
        <Eyebrow>{t.toolbox.eyebrow}</Eyebrow>
        <h2 className="display-m mt-4">{t.toolbox.title}</h2>
        <Reveal stagger={0.04} className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tools.map((tool) => (
            <div key={tool.slug} data-reveal className="flex aspect-[4/5] flex-col justify-between rounded-[22px] border border-on-night/10 bg-on-night/[0.04] p-5 transition-colors hover:border-[#ffef93]/50">
              <span className="grid size-12 place-items-center rounded-[14px] bg-white">
                <ToolIcon slug={tool.slug} size={24} />
              </span>
              <span>
                <span className="block text-[17px] font-bold tracking-[-0.01em]">{tool.name}</span>
                <span className="mt-1 block text-[13px] text-on-night/65">{tool.note}</span>
                <span className="mt-2 block font-mono text-[10px] tracking-[0.12em] text-[#ffef93] uppercase">{tool.group}</span>
              </span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* 5 — design DNA */}
      <section className="grid grid-cols-1 gap-12 px-4 py-28 md:grid-cols-2 md:gap-16 md:px-12 md:py-36">
        <div>
          <Eyebrow>{t.dna.eyebrow}</Eyebrow>
          <BlurHeading className="display-l mt-4 text-ink">{t.dna.title}</BlurHeading>
        </div>
        <div className="md:pt-10">
          <p className="text-[17px] leading-[1.65] text-ink-2 md:text-[19px]">{t.dna.body}</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {skillPills.map((s) => (
              <li key={s} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-[13px] font-semibold text-ink">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6 — how I work */}
      <ProcessSteps
        eyebrow={ui.processCard.title}
        heading={ui.processCard.heading}
        line={ui.processCard.line}
        steps={process.map((s, i) => ({ title: s, note: processNotes[i] ?? "" }))}
      />

      {/* 7 — base */}
      <section className="grid grid-cols-1 gap-12 border-t border-ink/10 px-4 py-24 md:grid-cols-2 md:gap-16 md:px-12 md:py-32">
        <div>
          <Eyebrow>{t.base.eyebrow}</Eyebrow>
          <h2 className="display-l mt-4 text-ink">{t.base.title}</h2>
          <p className="mt-6 max-w-[520px] text-[17px] leading-[1.65] text-ink-2">{t.base.body}</p>
        </div>
        <div className="md:pt-10">
          <p className="eyebrow">{ui.educationCard.title}</p>
          <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {education.map((e) => (
              <li key={e.title} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span>
                  <span className="block text-[17px] font-bold text-ink">{e.title}</span>
                  <span className="block text-[14px] text-ink-2">{e.place}</span>
                </span>
                <span className="shrink-0 font-mono text-[12px] text-ink-3">{e.years}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 — enough about me */}
      <section className="px-4 pb-8 text-center md:px-12">
        <div className="rounded-[32px] border border-ink/10 bg-card px-6 py-16 md:rounded-[48px] md:py-24">
          <h2 className="display-l text-ink">{t.enough.title}</h2>
          <p className="mt-4 text-[17px] text-ink-2 md:text-[20px]">{t.enough.body}</p>
          <Link href={`${home}#work`} className="btn-accent mt-8">
            {t.seeWork} <ArrowRight size={18} strokeWidth={2.4} />
          </Link>
        </div>
      </section>

      <Contact />
    </>
  );
}
