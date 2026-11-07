import { getDictionary } from "@/i18n/server";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { SectionHead } from "@/components/ui/SectionHead";
import { ProcessSteps } from "./ProcessSteps";

/*
  v2 toolkit (reference: the clients marquee) — two rows of tool tiles drifting in opposite
  directions on the dark panel, pausing on hover. Then the process: numbered steps that
  light up on scroll (ProcessSteps), with education alongside.
*/
export async function Toolkit() {
  const { toolGroups, process, processNotes, education, ui } = await getDictionary();
  const tiles = toolGroups.flatMap((g) => g.tools.map((t) => ({ ...t, group: g.label })));
  const half = Math.ceil(tiles.length / 2);
  const rows = [tiles.slice(0, half), tiles.slice(half)];

  return (
    <>
      <section id="tools" className="dark-stage relative rounded-b-[32px] bg-night pt-16 pb-24 text-on-night md:rounded-b-[56px] md:pt-24 md:pb-32">
        <div className="px-4 md:px-12">
          <SectionHead eyebrow={ui.tools.eyebrow} title={ui.tools.title} sub={ui.tools.sub} />
        </div>
        <div className="mt-14 space-y-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] md:mt-20">
          {rows.map((row, r) => (
            <ul
              key={r}
              className="flex w-max gap-4 pr-4 hover:[animation-play-state:paused]"
              style={{ animation: `marquee ${34 + r * 6}s linear infinite`, animationDirection: r % 2 ? "reverse" : "normal" }}
            >
              {[...row, ...row].map((t, k) => (
                <li
                  key={`${t.slug}-${k}`}
                  aria-hidden={k >= row.length || undefined}
                  className="flex h-[96px] w-[230px] shrink-0 items-center gap-4 rounded-[20px] border border-on-night/10 bg-on-night/[0.04] px-5 transition-colors hover:border-[#ffef93]/50 hover:bg-on-night/[0.08]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-white/95">
                    <ToolIcon slug={t.slug} size={24} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[16px] font-bold tracking-[-0.01em]">{t.name}</span>
                    <span className="block truncate text-[12px] text-on-night/50">{t.note}</span>
                    <span className="mt-1 block truncate font-mono text-[10px] tracking-[0.12em] text-[#ffef93]/70 uppercase">{t.group}</span>
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      <ProcessSteps
        eyebrow={ui.processCard.title}
        heading={ui.processCard.heading}
        line={ui.processCard.line}
        steps={process.map((s, i) => ({ title: s, note: processNotes[i] ?? "" }))}
        educationTitle={ui.educationCard.title}
        education={education}
      />
    </>
  );
}
