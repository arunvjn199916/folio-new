import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { archive } from "@/content/projects";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { Media } from "@/components/ui/Placeholder";
import { img } from "@/content/images";
import { SectionHead } from "@/components/ui/SectionHead";
import { WorkGrid } from "./WorkGrid";
import { PrismFolderMount } from "./PrismFolderMount";

// Shriya reference — "Work I'm proud of": filter pills over a strict two-column grid of
// single-link cards (media → eyebrow → title → summary → icon CTA), lift on hover,
// caution-tape sticker for work in progress, then the "UI archive" prism folder.
export async function Work() {
  const { projects, projectFilters, ui } = await getDictionary();
  const locale = await getLocale();
  const cards = projects.map((p) => ({
    slug: p.slug,
    filters: p.filters,
    node: (
      <Link
        href={localePath(locale, p.href ?? `/work/${p.slug}`)}
        className="group flex h-full flex-col rounded-[24px] border border-ink/10 bg-card p-4 shadow-[var(--card-shadow)] transition-[transform,box-shadow,border-color] duration-[400ms] ease-[var(--ease-out)] hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-[var(--card-shadow-hover)] md:p-5"
      >
        <Media
          src={p.media}
          alt={p.title}
          label={`${p.title.split(" ").slice(0, 3).join(" ")}… 16:9`}
          tint={p.tint}
          className="aspect-[512/300] w-full rounded-[16px] transition-transform duration-700 ease-[var(--ease-out)]"
          sizes="(max-width: 768px) 100vw, 460px"
        />
        <p className="mt-5 flex items-center gap-2 text-[12px] font-semibold tracking-[0.1em] text-ink-3 uppercase">
          <span className="size-1.5 shrink-0 rounded-full bg-accent" />
          <span className="truncate">
            {p.audience} · {p.descriptor}
          </span>
        </p>
        <h3 className="mt-3 line-clamp-2 font-display text-[clamp(21px,1.9vw,28px)] leading-[1] font-[650] tracking-[-0.035em] text-ink uppercase">
          {p.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed font-medium text-ink-2">{p.summary}</p>
        <div className="mt-auto pt-6">
          {p.wip ? (
            <span className="caution-tape inline-block -rotate-3 rounded-[4px] p-[3px] shadow-sm">
              <span className="block rounded-[2px] bg-[#ffd23a] px-3 py-1 font-mono text-[11px] font-bold tracking-[0.12em] text-ink">
                {ui.work.fixingBugs}
              </span>
            </span>
          ) : (
            <span className="inline-grid size-12 place-items-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
              <ArrowRight size={18} className="transition-transform duration-[400ms] ease-[var(--ease-out)] group-hover:-rotate-45" />
            </span>
          )}
        </div>
      </Link>
    ),
  }));

  const windows = archive.map((a) => ({ ...a, src: img(a.src) }));

  return (
    <section id="work" className="relative px-4 py-24 md:px-12 md:py-32">
      <div>
        <SectionHead eyebrow={ui.work.eyebrow} title={ui.work.title} />
        <WorkGrid filters={Object.entries(projectFilters).map(([id, label]) => ({ id, label }))} cards={cards} ariaLabel={ui.work.filterLabel} />
      </div>
      <PrismFolderMount windows={windows} labels={ui.work.folder} />
    </section>
  );
}
