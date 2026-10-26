import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects as baseProjects } from "@/content/projects";
import { Media } from "@/components/ui/Placeholder";
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

// Case-study shell: filled in once the real project material arrives.
export default async function CaseStudy({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { slug } = await params;
  const { projects, ui } = await getDictionary();
  const locale = await getLocale();
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <article className="mx-auto max-w-[960px] px-6 pt-36 pb-28">
      <Link href={`${localePath(locale)}#work`} className="text-[13px] text-ink-2 hover:text-ink">
        {ui.caseStudy.back}
      </Link>
      <p className="mt-8 text-[12px] font-semibold tracking-[0.12em] text-violet uppercase">
        {p.audience} · {p.descriptor}
      </p>
      <h1 className="mt-3 font-display text-[clamp(34px,4.4vw,58px)] leading-[1.04] font-semibold tracking-[-0.02em]">{p.title}</h1>
      <p className="mt-4 max-w-[620px] text-[17px] text-ink-2">{p.summary}</p>
      <Media src={p.media} alt={p.title} label={ui.caseStudy.cover} tint={p.tint} className="mt-12 aspect-video w-full rounded-[22px]" sizes="960px" priority />
      <div className="mt-12 rounded-[18px] border border-dashed border-ink/20 bg-surface/50 p-8 text-center font-mono text-[12px] text-ink-3">
        {ui.caseStudy.soon}
      </div>
    </article>
  );
}
