import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { BlurHeading, Reveal } from "@/components/ui/Motion";
import { CaseCard } from "@/components/sections/CaseStudies";
import { Contact } from "@/components/sections/Contact";
import { caseStudies } from "@/content/case-studies";

export async function generateMetadata(): Promise<Metadata> {
  const { ui, profile } = await getDictionary();
  return { title: `${ui.caseStudies.allTitle} — ${profile.name}`, description: ui.caseStudies.allSub };
}

/** Every written case study (client work and concepts) plus the Aura design system, as solution-style cards. */
export default async function CaseStudiesPage() {
  const { projects, ui } = await getDictionary();
  const locale = await getLocale();
  const t = ui.caseStudies;
  const list = projects.filter((p) => caseStudies[p.slug] || p.slug === "aura-design-system").sort((a, b) => Number(b.slug === "orion-support-system") - Number(a.slug === "orion-support-system"));
  return (
    <>
      <section className="px-4 pt-32 pb-24 md:px-12 md:pt-40 md:pb-32">
        <p className="eyebrow flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--c-globe-lit)/0.8)]" />
          {t.eyebrow}
        </p>
        <BlurHeading as="h1" className="display-xl mt-5 max-w-[14ch] text-ink">
          {t.allTitle}
        </BlurHeading>
        <p className="mt-6 max-w-[620px] text-[17px] leading-[1.6] text-ink-2 md:text-[20px]">{t.allSub}</p>
        <Reveal className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-2 md:gap-6">
          {list.map((p) => (
            <CaseCard key={p.slug} p={p} href={localePath(locale, p.href ?? `/work/${p.slug}`)} readLabel={t.read} />
          ))}
        </Reveal>
      </section>
      <Contact />
    </>
  );
}
