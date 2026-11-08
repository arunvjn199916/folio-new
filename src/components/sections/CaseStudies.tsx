import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { caseStudies } from "@/content/case-studies";
import { Media } from "@/components/ui/Placeholder";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Motion";
import { Browser, Phone } from "@/components/case-study/Devices";

type Dict = Awaited<ReturnType<typeof getDictionary>>;
type Project = Dict["projects"][number];

/*
  Case-study card (reference: the home "Solutions" cards — dark card, eyebrow, big title,
  list rows, button). Thumbnail on top, product name, headline, meta rows, "Read case".
  Dark in both themes so the screens pop.
*/
export function CaseCard({ p, href, readLabel }: { p: Project; href: string; readLabel: string }) {
  const study = caseStudies[p.slug];
  const name = study?.brand.name ?? p.title.split(" — ")[0];
  const rows = study ? study.meta.slice(0, 3) : [{ label: p.audience, value: [p.descriptor] }];
  return (
    <Link
      href={href}
      data-reveal
      className="dark-stage group flex h-full flex-col overflow-hidden rounded-[28px] border border-on-night/10 bg-night p-4 text-on-night transition-colors duration-300 hover:border-[#ffef93]/50 md:p-5"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
        <Media
          src={p.media}
          alt=""
          label={name}
          tint={p.tint}
          className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 45vw"
        />
      </div>
      <div className="flex flex-1 flex-col px-2 pt-6 pb-2 md:px-3">
        <p className="font-mono text-[11px] tracking-[0.12em] text-on-night/60 uppercase">
          {p.audience} · {p.descriptor}
        </p>
        <h3 className="mt-3 font-display text-[clamp(30px,3.2vw,48px)] leading-[0.92] font-[650] tracking-[-0.045em] uppercase">{name}</h3>
        <p className="mt-3 text-[16px] leading-[1.45] text-on-night/80">{study?.hero.title ?? p.summary}</p>
        <dl className="mt-6 border-t border-on-night/10">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-4 border-b border-on-night/10 py-3">
              <dt className="font-mono text-[11px] tracking-[0.12em] text-on-night/55 uppercase">{r.label}</dt>
              <dd className="text-right text-[14px] font-semibold">{r.value.join(" · ")}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-auto inline-flex items-center gap-2 self-start pt-6 text-[13px] font-bold tracking-[0.08em] uppercase">
          <span className="rounded-full border border-on-night/30 px-4 py-2.5 transition-colors group-hover:border-[#ffef93] group-hover:bg-[#ffef93] group-hover:text-[#100001]">
            {readLabel} <ArrowRight size={15} className="ml-1 inline transition-transform group-hover:translate-x-1" />
          </span>
        </span>
      </div>
    </Link>
  );
}

const HOME_PICKS = ["orion-support-system", "myir-investor-app", "agentic-ai-participant-portal"];
const CHAPTERS = ["problem", "research", "design", "validation"] as const;

/*
  Home: the reference "solutions" block — two tall numbered cards, each with the product
  name, its headline, chapter rows that jump into that part of the case, and "Read case";
  a real screen from the product floats at the card's corner. Then "View all case studies".
*/
export async function CaseStudies() {
  const { projects, ui } = await getDictionary();
  const locale = await getLocale();
  const t = ui.caseStudies;
  const ch = ui.caseStudy.chapters;
  const picks = HOME_PICKS.map((s) => projects.find((p) => p.slug === s)).filter((p): p is Project => !!p);
  return (
    <section id="case-studies" className="px-4 py-24 md:px-12 md:py-32">
      <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
      <Reveal className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {picks.map((p, i) => {
          const study = caseStudies[p.slug];
          const href = localePath(locale, `/work/${p.slug}`);
          const shot = study?.hero.layout === "web" ? study.hero.shots[0] : (study?.hero.shots[2] ?? study?.hero.shots[0]);
          return (
            <article
              key={p.slug}
              data-reveal
              className="dark-stage relative isolate flex flex-col overflow-hidden rounded-[28px] border border-on-night/10 bg-night p-5 text-on-night md:rounded-[36px] md:p-7"
              style={{ backgroundImage: `radial-gradient(60% 50% at 100% 0%, color-mix(in srgb, ${study?.brand.accent ?? "#dc0208"} 30%, transparent), transparent 70%)` }}
            >
              {shot && (
                <div aria-hidden className="relative mb-7 h-[190px] overflow-hidden rounded-[20px] md:h-[210px]" style={{ background: `color-mix(in srgb, ${study?.brand.accent ?? "#dc0208"} 22%, transparent)` }}>
                  {study?.hero.layout === "web" ? (
                    <div className="cs-float absolute top-7 left-1/2 w-[88%] -translate-x-1/2">
                      <Browser src={shot.src} alt="" ratio={shot.ratio} sizes="420px" />
                    </div>
                  ) : (
                    <div className="cs-float absolute top-7 left-1/2 w-[44%] max-w-[170px] -translate-x-1/2">
                      <Phone src={shot.src} alt="" sizes="170px" />
                    </div>
                  )}
                </div>
              )}
              <p className="font-mono text-[11px] tracking-[0.14em] text-on-night/60 uppercase">
                {String(i + 1).padStart(2, "0")} · {p.descriptor}
              </p>
              <h3 className="mt-4 font-display text-[clamp(40px,4.4vw,72px)] leading-[0.9] font-[650] tracking-[-0.045em] uppercase">{study?.brand.name ?? p.title}</h3>
              <p className="mt-4 mb-8 text-[16px] leading-[1.45] text-on-night/80">{study?.hero.title ?? p.summary}</p>
              <ul className="mt-auto border-t border-on-night/10 pt-2">
                {CHAPTERS.map((c) => (
                  <li key={c} className="border-b border-on-night/10">
                    <Link href={`${href}#${c}`} className="group flex items-center justify-between gap-4 py-4">
                      <span className="text-[clamp(17px,1.4vw,21px)] font-semibold tracking-[-0.01em] transition-colors group-hover:text-[#ffef93]">{ch[c]}</span>
                      <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-[#ffef93]" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={href} className="btn-accent mt-8 self-start !bg-[#ffef93] !text-[#100001]">
                {t.read} <ArrowRight size={18} strokeWidth={2.4} />
              </Link>
            </article>
          );
        })}
      </Reveal>
      <Link href={localePath(locale, "/case-studies")} className="group mt-8 flex items-center justify-between gap-6 border-y border-ink/10 py-6 md:mt-10">
        <span className="font-display text-[clamp(22px,2.6vw,38px)] leading-none font-[650] tracking-[-0.04em] text-ink uppercase transition-colors group-hover:text-accent">
          {t.viewAll}
        </span>
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-ink/20 text-ink transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent md:size-14">
          <ArrowUpRight size={20} className="transition-transform group-hover:rotate-45" />
        </span>
      </Link>
    </section>
  );
}
