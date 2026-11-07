import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects as baseProjects } from "@/content/projects";
import { caseStudies } from "@/content/case-studies";
import { Media } from "@/components/ui/Placeholder";
import { CaseHero } from "@/components/case-study/CaseHero";
import { BlockView } from "@/components/case-study/Blocks";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";

// Slugs are language-neutral; [lang] comes from the parent layout's static params.
// Every slug is prerendered from generateStaticParams, so navigations are already
// served from the static shell; opt out of the dev-time instant-navigation check.
export const instant = false;

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
  const { projects, ui, profile } = await getDictionary();
  const locale = await getLocale();
  const home = localePath(locale);
  const i = projects.findIndex((x) => x.slug === slug);
  const p = projects[i];
  if (!p) notFound();
  const study = caseStudies[slug];
  const t = ui.caseStudy;
  const next = projects[(i + 1) % projects.length];
  const crumbs = [
    { label: t.home, href: home },
    { label: t.work, href: `${home}#work` },
    { label: p.title.split(" — ")[0] },
  ];

  // Closing block shared by both layouts: big "next case" row + back link.
  const closing = (
    <section className="mt-28 px-4 md:px-12">
      <Link href={localePath(locale, next.href ?? `/work/${next.slug}`)} className="group block border-y border-ink/10 py-10 md:py-14">
        <span className="eyebrow">{t.nextCase}</span>
        <span className="mt-4 flex items-center justify-between gap-6">
          <span className="display-m max-w-[20ch] text-ink transition-colors duration-300 group-hover:text-accent">{next.title}</span>
          <span className="grid size-14 shrink-0 place-items-center rounded-full border border-ink/20 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent md:size-20">
            <ArrowUpRight size={26} className="transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </span>
      </Link>
      <Link href={`${home}#work`} className="group mt-8 inline-flex items-center gap-3 text-[13px] font-bold tracking-[0.08em] text-ink uppercase">
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> {t.backHome}
      </Link>
    </section>
  );

  // Projects without a written study yet: reference-style hero + "in progress" panel.
  if (!study) {
    return (
      <article className="pb-16">
        <section className="px-4 pt-28 md:px-12 md:pt-32">
          <nav aria-label="Breadcrumb" className="font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, k) => (
                <li key={c.label} className="flex items-center gap-2">
                  {k > 0 && <span aria-hidden>/</span>}
                  {c.href ? <Link href={c.href} className="hover:text-ink">{c.label}</Link> : <span aria-current="page" className="text-ink">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
          <p className="mt-10 flex items-center gap-2 text-[12px] font-semibold tracking-[0.1em] text-ink-3 uppercase">
            <span className="size-1.5 rounded-full bg-accent" /> {p.audience} · {p.descriptor}
          </p>
          <h1 className="display-l mt-4 max-w-[18ch] text-ink">{p.title}</h1>
          <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-16">
            <p className="max-w-[600px] text-[17px] leading-[1.6] text-ink-2 md:text-[19px]">{p.summary}</p>
            <div className="self-end border-t border-ink/10 pt-6">
              <p className="font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase">{t.scope}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.filters.map((f) => (
                  <span key={f} className="rounded-full border border-ink/15 px-2.5 py-1 text-[12px] font-semibold text-ink">{f}</span>
                ))}
              </div>
            </div>
          </div>
          <Media src={p.media} alt={p.title} label={t.cover} tint={p.tint} className="mt-14 aspect-video w-full rounded-[28px] md:rounded-[40px]" sizes="100vw" priority />
          <div className="mt-14 grid gap-8 rounded-[28px] border border-ink/10 bg-card p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-10">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <span className="size-1.5 animate-pulse rounded-full bg-accent" /> {t.inProgress}
              </p>
              <p className="mt-3 max-w-[640px] text-[16px] leading-[1.6] text-ink-2">{t.inProgressSub}</p>
            </div>
            <a href={`mailto:${profile.email}?subject=${encodeURIComponent(`Walkthrough: ${p.title}`)}`} className="btn-accent">
              {t.walkthrough} <ArrowRight size={18} strokeWidth={2.4} />
            </a>
          </div>
        </section>
        {closing}
      </article>
    );
  }

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
      <CaseHero study={study} title={p.title} summary={p.summary} conceptLabel={t.concept} crumbs={crumbs} />

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

      {closing}
    </article>
  );
}
