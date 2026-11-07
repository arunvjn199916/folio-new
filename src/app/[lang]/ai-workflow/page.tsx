import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { BlurHeading, Reveal } from "@/components/ui/Motion";

export async function generateMetadata(): Promise<Metadata> {
  const { ui } = await getDictionary();
  return { title: ui.meta.aiTitle, description: ui.meta.aiDescription };
}

/*
  v2 AI-workflow page: uppercase hero, intro beside its heading, then each phase as a
  numbered row (number · title + tool chips · body) like the reference's process list,
  and a closing pair of actions.
*/
export default async function AiWorkflowPage() {
  const { aiWorkflow, ui } = await getDictionary();
  const locale = await getLocale();
  const home = localePath(locale);
  return (
    <article className="pb-24">
      <header className="relative overflow-hidden px-4 pt-32 pb-16 md:px-12 md:pt-40 md:pb-24">
        <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[760px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--c-space-3)_60%,transparent),transparent)] blur-2xl" />
        <p className="eyebrow relative flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--c-globe-lit)/0.8)]" />
          {ui.nav.aiWorkflow}
        </p>
        <BlurHeading as="h1" className="display-xl relative mt-5 max-w-[14ch] text-ink">
          {aiWorkflow.title}
        </BlurHeading>
      </header>

      <section className="grid gap-8 border-t border-ink/10 px-4 py-14 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16 md:px-12 md:py-20">
        <h2 className="display-m text-ink">{ui.aiPage.introTitle}</h2>
        <Reveal className="space-y-4 text-[17px] leading-[1.6] text-ink-2 md:text-[19px]">
          {aiWorkflow.intro.map((p) => (
            <p data-reveal key={p}>
              {p}
            </p>
          ))}
        </Reveal>
      </section>

      <ol className="border-b border-ink/10">
        {aiWorkflow.phases.map((ph, i) => (
          <li key={ph.title} className="border-t border-ink/10">
            <Reveal className="grid gap-6 px-4 py-12 md:grid-cols-[80px_minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12 md:px-12 md:py-16">
              <span data-reveal className="font-mono text-[13px] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div data-reveal>
                <h2 className="font-display text-[clamp(26px,2.8vw,44px)] leading-[0.98] font-[650] tracking-[-0.04em] text-ink uppercase">{ph.title}</h2>
                {ph.tools && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {ph.tools.split("·").map((tool) => (
                      <span key={tool} className="rounded-full border border-ink/15 px-3 py-1 text-[12px] font-semibold text-ink">
                        {tool.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div data-reveal className="space-y-4 text-[16px] leading-[1.65] text-ink-2 md:text-[17px]">
                {ph.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="mt-16 flex flex-wrap gap-3 px-4 md:px-12">
        <Link href={`${home}#work`} className="btn-outline">
          <ArrowLeft size={18} /> {ui.aiPage.back.replace(/^←\s*/, "")}
        </Link>
        <Link href={`${home}#contact`} className="btn-accent">
          {ui.nav.letsTalk} <ArrowRight size={18} strokeWidth={2.4} />
        </Link>
      </div>
    </article>
  );
}
