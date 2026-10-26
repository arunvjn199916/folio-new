import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects as baseProjects } from "@/content/projects";
import { caseStudies } from "@/content/case-studies";
import { Media } from "@/components/ui/Placeholder";
import { CaseHero } from "@/components/case-study/CaseHero";
import { BlockView } from "@/components/case-study/Blocks";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";

// Slugs are language-neutral; [lang] comes from the parent layout's static params.
export function generateStaticParams() {
  return baseProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { projects, profile } = await getDictionary();
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: `${p.title} — ${profile.name}`, description: p.summary } : {};
}

export default async function CaseStudyPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { slug } = await params;
  const { projects, ui } = await getDictionary();
  const locale = await getLocale();
  const home = localePath(locale);
  const i = projects.findIndex((x) => x.slug === slug);
  const p = projects[i];
  if (!p) notFound();
  const study = caseStudies[slug];
  const t = ui.caseStudy;

  // Projects without a written study yet keep the simple shell.
  if (!study) {
    return (
      <article className="mx-auto max-w-[960px] px-6 pt-36 pb-28">
        <Link href={`${home}#work`} className="text-[13px] text-ink-2 hover:text-ink">
          {t.back}
        </Link>
        <p className="mt-8 text-[12px] font-semibold tracking-[0.12em] text-violet uppercase">
          {p.audience} · {p.descriptor}
        </p>
        <h1 className="mt-3 font-display text-[clamp(34px,4.4vw,58px)] leading-[1.04] font-semibold tracking-[-0.02em]">{p.title}</h1>
        <p className="mt-4 max-w-[620px] text-[17px] text-ink-2">{p.summary}</p>
        <Media src={p.media} alt={p.title} label={t.cover} tint={p.tint} className="mt-12 aspect-video w-full rounded-[22px]" sizes="960px" priority />
        <div className="mt-12 rounded-[18px] border border-dashed border-ink/20 bg-surface/50 p-8 text-center font-mono text-[12px] text-ink-3">{t.soon}</div>
      </article>
    );
  }

  const next = projects[(i + 1) % projects.length];
  return (
    <article
      className="pb-16"
      style={
        {
          "--case-tint": study.brand.tint,
          "--case-band": study.brand.band,
          "--case-accent": study.brand.accent,
        } as React.CSSProperties
      }
    >
      <CaseHero study={study} title={p.title} summary={p.summary} conceptLabel={t.concept} />

      <div className="mt-24 space-y-28 sm:space-y-36">
        {study.blocks.map((b, k) => (
          <BlockView key={k} block={b} brand={study.brand} labels={t.blocks} />
        ))}
      </div>

      <section id="sources" className="mx-auto mt-28 max-w-[640px] px-6">
        <h2 className="font-mono text-[11px] font-semibold tracking-[0.16em] text-ink-3 uppercase">{t.sources}</h2>
        <ol className="mt-4 space-y-2 text-[12.5px] text-ink-2">
          {study.sources.map((s, n) => (
            <li key={s.url} id={`source-${n + 1}`} className="flex gap-2">
              <span className="font-mono text-ink-3">[{n + 1}]</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-ink hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-28 text-center font-display text-[clamp(26px,3vw,36px)] font-semibold text-ink">{t.thanks}</p>
      <nav className="mx-auto mt-14 flex max-w-[1000px] items-center justify-between gap-6 px-6">
        <Link href={`${home}#work`} className="group flex items-center gap-3 font-display text-[18px] font-semibold text-ink">
          <span className="grid size-10 place-items-center rounded-full bg-surface-3 transition group-hover:-translate-x-0.5">
            <ArrowLeft size={16} />
          </span>
          {t.backHome}
        </Link>
        <Link href={`${home}/work/${next.slug}`} className="group flex min-w-0 items-center gap-3 text-right">
          <span className="min-w-0">
            <span className="block text-[12px] text-ink-3">{t.next}</span>
            <span className="block max-w-[260px] truncate font-display text-[16px] font-semibold text-ink sm:text-[18px]">{next.title}</span>
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-3 transition group-hover:translate-x-0.5">
            <ArrowUpRight size={16} />
          </span>
        </Link>
      </nav>
    </article>
  );
}
