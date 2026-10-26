import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { Media } from "@/components/ui/Placeholder";
import { BlurHeading, Reveal } from "@/components/ui/Motion";

export async function generateMetadata(): Promise<Metadata> {
  const { ui } = await getDictionary();
  return { title: ui.meta.aiTitle, description: ui.meta.aiDescription };
}

// Muskaan reference: hero image + serif title on light, then a long-form black essay with
// "✦" phase headings and a red tool line under each.
export default async function AiWorkflowPage() {
  const { aiWorkflow, ui } = await getDictionary();
  const locale = await getLocale();
  return (
    <article>
      <header className="flex flex-col items-center px-6 pt-36 pb-16 text-center">
        <Media
          src="/images/ai-workflow-hero.webp"
          alt={ui.aiPage.heroAlt}
          label={ui.aiPage.heroLabel}
          className="aspect-[3/2] w-[260px] rounded-[16px]"
          tint="linear-gradient(135deg,#cdb8ff,#a8d8ff)"
          sizes="260px"
          priority
        />
        <BlurHeading as="h1" className="mt-8 font-serif text-[clamp(40px,5vw,68px)] leading-none text-pink">
          {aiWorkflow.title}
        </BlurHeading>
      </header>
      <div className="bg-night px-6 py-24 text-on-night">
        <div className="mx-auto max-w-[760px]">
          <Reveal>
            <h2 data-reveal className="font-serif text-[clamp(28px,3vw,38px)]">
              ✦ {ui.aiPage.introTitle}
            </h2>
            {aiWorkflow.intro.map((p) => (
              <p data-reveal key={p} className="mt-4 text-[15px] leading-relaxed text-on-night/75">
                {p}
              </p>
            ))}
          </Reveal>
          {aiWorkflow.phases.map((ph) => (
            <Reveal key={ph.title} className="mt-16">
              <h2 data-reveal className="font-serif text-[clamp(28px,3vw,38px)]">
                ✦ {ph.title}
              </h2>
              {ph.tools && (
                <p data-reveal className="mt-3 text-[15px] font-semibold text-pink">
                  {ph.tools}
                </p>
              )}
              {ph.body.map((p) => (
                <p data-reveal key={p} className="mt-4 text-[15px] leading-relaxed text-on-night/75">
                  {p}
                </p>
              ))}
            </Reveal>
          ))}
          <Link href={`${localePath(locale)}#work`} className="mt-20 inline-flex rounded-full bg-on-night px-5 py-2.5 text-[14px] font-medium text-night transition hover:scale-[1.03]">
            {ui.aiPage.back}
          </Link>
        </div>
      </div>
    </article>
  );
}
