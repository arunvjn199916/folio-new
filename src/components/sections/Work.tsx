import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { archive } from "@/content/projects";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { Media } from "@/components/ui/Placeholder";
import { img } from "@/content/images";
import { SectionHead } from "@/components/ui/SectionHead";
import { WorkGrid } from "./WorkGrid";
import { PrismFolderMount } from "./PrismFolderMount";

const FEATURED = "kairo-ai-personal-assistant";

/*
  v2 work section (reference: "PROJECTS."): a large featured-case card, then a project
  index — numbered rows with an uppercase title, meta line, tags and an arrow circle.
  Hovering a row floats its cover next to the cursor (WorkGrid). Filters and the
  UI-archive folder are kept.
*/
export async function Work() {
  const { projects, projectFilters, ui } = await getDictionary();
  const locale = await getLocale();
  const t = ui.work;
  const link = (p: (typeof projects)[number]) => localePath(locale, p.href ?? `/work/${p.slug}`);
  const featured = projects.find((p) => p.slug === FEATURED) ?? projects[0];
  const rest = projects.filter((p) => p.slug !== featured.slug);

  const rows = rest.map((p, i) => ({
    slug: p.slug,
    filters: p.filters,
    preview: { src: img(p.media), tint: p.tint, alt: p.title },
    node: (
      <Link
        href={link(p)}
        className="group grid grid-cols-[34px_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 border-t border-ink/10 py-7 transition-colors duration-300 hover:bg-ink/[0.025] md:grid-cols-[56px_minmax(0,1fr)_200px_auto] md:items-center md:gap-x-8 md:px-4 md:py-8"
      >
        <span className="pt-1 font-mono text-[12px] text-ink-3 md:pt-0">{String(i + 1).padStart(2, "0")}</span>
        <span className="min-w-0">
          <span className="block max-w-[26ch] font-display text-[clamp(22px,2.4vw,38px)] leading-[0.98] font-[650] tracking-[-0.035em] text-ink uppercase transition-colors duration-300 group-hover:text-accent">
            {p.title}
          </span>
          <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-3">
            <span className="font-semibold text-ink-2">{p.audience}</span>
            <span aria-hidden>·</span>
            <span>{p.descriptor}</span>
          </span>
        </span>
        <span className="col-start-2 font-mono text-[11px] tracking-[0.12em] text-ink-3 uppercase md:col-start-auto">{p.filters.join(" · ")}</span>
        <span className="col-start-3 row-start-1 md:col-start-auto md:row-start-auto">
          {p.wip ? (
            <span className="rounded-full border border-ink/20 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-ink-2 uppercase">{t.fixingBugs}</span>
          ) : (
            <span className="grid size-11 place-items-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent md:size-12">
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
            </span>
          )}
        </span>
      </Link>
    ),
  }));

  const windows = archive.map((a) => ({ ...a, src: img(a.src) }));

  return (
    <section id="work" className="relative px-4 py-24 md:px-12 md:py-32">
      <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

      {/* Featured case */}
      <Link
        href={link(featured)}
        className="group mt-12 grid overflow-hidden rounded-[28px] border border-ink/10 bg-card shadow-[var(--card-shadow)] transition-colors duration-300 hover:border-accent/50 md:mt-16 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      >
        <div className="flex flex-col justify-between gap-10 p-6 md:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-[11px] font-bold tracking-[0.1em] text-on-accent uppercase">
              <span className="size-1.5 rounded-full bg-on-accent" /> {t.featured}
            </span>
            <h3 className="display-m mt-6 max-w-[16ch] text-ink">{featured.title}</h3>
            <p className="mt-4 max-w-[440px] text-[16px] leading-[1.55] text-ink-2">{featured.summary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="btn-accent">
              {t.viewCase} <ArrowRight size={18} strokeWidth={2.4} />
            </span>
            <span className="text-[13px] text-ink-3">
              {featured.audience} · {featured.descriptor}
            </span>
          </div>
        </div>
        <div className="relative min-h-[260px] overflow-hidden md:min-h-[440px]">
          <Media
            src={featured.media}
            alt={featured.title}
            label={featured.title}
            tint={featured.tint}
            className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        </div>
      </Link>

      <WorkGrid filters={Object.entries(projectFilters).map(([id, label]) => ({ id, label }))} rows={rows} ariaLabel={t.filterLabel} indexLabel={t.index} />
      <PrismFolderMount windows={windows} labels={t.folder} />
    </section>
  );
}
