import { getDictionary } from "@/i18n/server";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { BlurHeading, Reveal } from "@/components/ui/Motion";

// Anjali — dark "tools that matter" band: heading blurs in letter by letter, then a
// grid of tool cards. Followed by the design-process line and education cards.
export async function Toolkit() {
  const { toolGroups, process, education, ui } = await getDictionary();
  return (
    <>
      <section id="tools" className="bg-night px-6 pt-16 pb-28 text-on-night">
        <div className="mx-auto max-w-[1100px]">
          <p className="eyebrow text-on-night/40">{ui.tools.eyebrow}</p>
          <BlurHeading by="chars" className="mt-3 max-w-[680px] font-serif text-[clamp(32px,3.6vw,48px)] leading-[1.05]">
            {ui.tools.title}
          </BlurHeading>
          <p className="mt-4 max-w-[520px] text-[14px] text-on-night/50">
            {ui.tools.sub}
          </p>
          <div className="mt-14 space-y-12">
            {toolGroups.map((g) => (
              <div key={g.label} className="grid gap-5 md:grid-cols-[180px_1fr]">
                <p className="pt-2 font-mono text-[11px] tracking-[0.16em] text-on-night/45 uppercase">{g.label}</p>
                {/* GSAP animates the [data-reveal] wrappers; the hover transition lives on the inner
                    card so CSS transitions never fight GSAP over opacity/transform. */}
                <Reveal stagger={0.05} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {g.tools.map((t) => (
                    <div key={t.name} data-reveal>
                      <div className="group flex aspect-square flex-col justify-between rounded-[16px] border border-on-night/[0.06] bg-on-night/[0.04] p-4 transition-[transform,background-color,border-color] duration-300 hover:-translate-y-1 hover:border-on-night/15 hover:bg-on-night/[0.08]">
                        <span className="grid size-10 place-items-center rounded-[10px] bg-white/90 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
                          <ToolIcon slug={t.slug} size={20} />
                        </span>
                        <div>
                          <p className="font-serif text-[18px] leading-tight">{t.name}</p>
                          <p className="mt-0.5 text-[11px] text-on-night/40">{t.note}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="px-6 py-28">
        <div className="mx-auto grid max-w-[1100px] grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <Reveal className="rounded-[22px] border border-surface/70 bg-surface/80 p-8">
            <p data-reveal className="eyebrow">{ui.processCard.title}</p>
            <div data-reveal className="relative mt-10 grid grid-cols-5 gap-1">
              <span aria-hidden className="absolute top-[9px] right-[10%] left-[10%] h-[2px] bg-green/70" />
              {process.map((s) => (
                <div key={s} className="relative flex min-w-0 flex-col items-center gap-3">
                  <span className="grid size-5 place-items-center rounded-full bg-green shadow-[0_0_0_4px_rgba(24,169,87,0.15)]">
                    <span className="size-1.5 rounded-full bg-white" />
                  </span>
                  <span className="text-center text-[12px] leading-snug font-medium text-ink-2 [overflow-wrap:anywhere]">{s}</span>
                </div>
              ))}
            </div>
            <p data-reveal className="mt-10 max-w-[460px] font-serif text-[22px] leading-snug text-ink">
              {ui.processCard.line}
            </p>
          </Reveal>
          <Reveal className="rounded-[22px] border border-surface/70 bg-surface/80 p-8">
            <p data-reveal className="eyebrow">{ui.educationCard.title}</p>
            <ul className="mt-6 space-y-5">
              {education.map((e) => (
                <li key={e.title} data-reveal>
                  <p className="font-display text-[16px] font-semibold">{e.title}</p>
                  <p className="text-[13px] text-ink-2">{e.place}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-3">{e.years}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
