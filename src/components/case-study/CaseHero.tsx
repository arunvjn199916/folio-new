import Link from "next/link";
import type { CaseStudy } from "@/content/case-studies/types";
import { Reveal } from "@/components/ui/Motion";
import { Phone } from "./Devices";

/*
  v2 case-study hero (reference: eezyinn project page). Breadcrumb, category, the product
  name as a huge uppercase title, headline + summary on the left and the scope (meta) on
  the right, then the phone fan inside a dark rounded panel lit by the product's colour.
*/
export function CaseHero({
  study,
  title,
  summary,
  conceptLabel,
  crumbs,
}: {
  study: CaseStudy;
  title: string;
  summary: string;
  conceptLabel: string;
  crumbs: { label: string; href?: string }[];
}) {
  const { hero, meta, brand } = study;
  const fan = hero.shots.slice(0, 5);
  const lift = [22, 10, 0, 10, 22];
  return (
    <section className="px-4 pt-28 md:px-12 md:pt-32">
      <Reveal>
        <nav data-reveal aria-label="Breadcrumb" className="font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-ink">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p data-reveal className="mt-10 flex items-center gap-2 text-[12px] font-semibold tracking-[0.1em] text-ink-3 uppercase">
          <span className="size-1.5 rounded-full" style={{ background: "var(--case-accent)" }} />
          {conceptLabel} · {hero.kicker}
        </p>
        <h1 data-reveal className="display-xl mt-4 text-ink">
          {brand.name}
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-16">
          <div data-reveal>
            <p className="max-w-[22ch] text-[clamp(22px,2.2vw,34px)] leading-[1.15] font-semibold tracking-[-0.03em] text-ink">{hero.title || title}</p>
            <p className="mt-5 max-w-[560px] text-[16px] leading-[1.6] text-ink-2 md:text-[17px]">{hero.sub || summary}</p>
          </div>
          <dl data-reveal className="grid grid-cols-2 gap-x-6 gap-y-6 self-end border-t border-ink/10 pt-6">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase">{m.label}</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {m.value.map((v) => (
                    <span key={v} className="rounded-full border border-ink/15 px-2.5 py-1 text-[12px] font-semibold text-ink">
                      {v}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      {/* media panel */}
      <div
        className="relative mt-14 overflow-hidden rounded-[28px] border border-ink/10 bg-night pt-14 md:mt-20 md:rounded-[40px] md:pt-20"
        style={{ backgroundImage: "radial-gradient(70% 80% at 50% 100%, color-mix(in srgb, var(--case-accent) 45%, transparent), transparent 70%)" }}
      >
        <div className="mx-auto flex h-[clamp(240px,32vw,460px)] max-w-[1040px] items-start justify-center gap-3 overflow-hidden px-4 sm:gap-5">
          {fan.map((s, i) => (
            <div
              key={s.src}
              className={i === 0 || i === 4 ? "hidden w-[18%] shrink-0 sm:block" : "w-[30%] shrink-0 sm:w-[19%]"}
              style={{ transform: `translateY(${lift[i]}%)` }}
            >
              <Phone src={s.src} alt={s.label} sizes="(max-width: 640px) 30vw, 200px" priority={i === 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
