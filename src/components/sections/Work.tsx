import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { archive } from "@/content/projects";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { Media } from "@/components/ui/Placeholder";
import { img } from "@/content/images";
import { BlurHeading } from "@/components/ui/Motion";
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
        className="group flex h-full flex-col rounded-[var(--radius)] bg-card p-5 shadow-[var(--card-shadow)] transition-[transform,box-shadow] duration-[400ms] ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--card-shadow-hover)] md:p-6"
      >
        <Media
          src={p.media}
          alt={p.title}
          label={`${p.title.split(" ").slice(0, 3).join(" ")}… 16:9`}
          tint={p.tint}
          className="aspect-[512/300] w-full rounded-[14px]"
          sizes="(max-width: 768px) 100vw, 460px"
        />
        <p className="mt-5 text-[12px] font-semibold tracking-[0.12em] text-violet uppercase">
          {p.audience} <span className="text-ink-3">·</span> {p.descriptor}
        </p>
        <h3 className="mt-2 line-clamp-2 font-display text-[clamp(20px,1.9vw,26px)] leading-[1.15] font-semibold tracking-[-0.01em] text-ink">
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
            <span className="inline-grid h-11 w-[68px] place-items-center rounded-[12px] bg-ink text-on-ink">
              <ArrowRight size={18} className="transition-transform duration-[400ms] ease-[var(--ease-out)] group-hover:translate-x-1" />
            </span>
          )}
        </div>
      </Link>
    ),
  }));

  const windows = archive.map((a) => ({ ...a, src: img(a.src) }));

  return (
    <section id="work" className="relative px-6 py-28">
      <div className="mx-auto max-w-[936px]">
        <p className="text-center font-serif text-[20px] text-ink-2 italic">{ui.work.eyebrow}</p>
        <BlurHeading className="mt-2 text-center font-display text-[clamp(34px,4vw,52px)] leading-[1.05] font-semibold tracking-[-0.02em]">
          {ui.work.title}
        </BlurHeading>
        <WorkGrid filters={Object.entries(projectFilters).map(([id, label]) => ({ id, label }))} cards={cards} ariaLabel={ui.work.filterLabel} />
      </div>
      <PrismFolderMount windows={windows} labels={ui.work.folder} />
    </section>
  );
}
