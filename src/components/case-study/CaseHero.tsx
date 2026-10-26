import type { CaseStudy } from "@/content/case-studies/types";
import { Reveal } from "@/components/ui/Motion";
import { Phone } from "./Devices";

// Tushar's hero: italic serif product name on a soft brand tint with a fan of phones
// rising from the bottom edge, then the headline, summary and the meta row.
export function CaseHero({ study, title, summary, conceptLabel }: { study: CaseStudy; title: string; summary: string; conceptLabel: string }) {
  const { hero, meta, brand } = study;
  const fan = hero.shots.slice(0, 5);
  // middle phone tallest, neighbours step down (Tushar's 5-phone fan)
  const lift = [22, 10, 0, 10, 22];
  return (
    <>
      <section className="relative overflow-hidden pt-28" style={{ background: "var(--case-tint)" }}>
        <Reveal className="relative mx-auto max-w-[1240px] px-4 text-center">
          <p data-reveal className="font-serif text-[clamp(44px,6vw,84px)] leading-none text-(--case-accent) italic">
            {brand.name}
          </p>
          <p data-reveal className="mt-2 font-serif text-[clamp(18px,1.8vw,24px)] text-[#3b3946] italic">
            {hero.kicker}
          </p>
          {/* phones are cropped by the band's bottom edge; outer ones sit lower */}
          <div data-reveal className="mx-auto mt-12 flex h-[clamp(240px,30vw,420px)] max-w-[980px] items-start justify-center gap-3 overflow-hidden sm:gap-5">
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
        </Reveal>
      </section>

      <Reveal className="mx-auto max-w-[640px] px-6 pt-20">
        <p data-reveal className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-2">
          <span className="size-1.5 rounded-full" style={{ background: "var(--case-accent)" }} />
          {conceptLabel}
        </p>
        <h1 data-reveal className="mt-5 font-serif text-[clamp(36px,4.6vw,56px)] leading-[1.04] text-balance text-ink">
          {hero.title || title}
        </h1>
        <p data-reveal className="mt-5 text-[16px] leading-relaxed text-ink-2">{hero.sub || summary}</p>
        <dl data-reveal className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="font-display text-[16px] font-semibold text-ink">{m.label}</dt>
              <dd className="mt-1.5 space-y-0.5 text-[12.5px] leading-snug text-ink-2">
                {m.value.map((v) => (
                  <span key={v} className="block">
                    {v}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </>
  );
}
