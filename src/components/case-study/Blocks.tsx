import { Fragment } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Block, CaseStudy, Outcome } from "@/content/case-studies/types";
import { Reveal } from "@/components/ui/Motion";
import { Browser, Phone } from "./Devices";
import { cn } from "@/lib/utils";

export type CaseLabels = {
  targets: string;
  planned: string;
  liked: string;
  disliked: string;
  likedPlanned: string;
  dislikedPlanned: string;
  tasks: string;
  measures: string;
  conclusion: string;
  case: string;
  simulated: string;
  likedSimulated: string;
  dislikedSimulated: string;
  participants: string;
  comfort: string;
  taskSuccess: string;
  outcomes: Record<Outcome, string>;
};

const OUTCOME_STYLE: Record<Outcome, string> = {
  pass: "bg-[#1f8a3a]",
  hard: "bg-[#e0a100]",
  fail: "bg-[#d64545]",
};

type Brand = CaseStudy["brand"];

// Reading column and full-bleed widths (Tushar: ~560px text, bands edge to edge).
const COL = "mx-auto w-full max-w-[640px] px-6";
const WIDE = "mx-auto w-full max-w-[1240px] px-4 sm:px-6";

const H2 = "font-display text-[clamp(28px,3.2vw,40px)] leading-[1.08] font-semibold tracking-[-0.02em] text-ink";
const EYEBROW = "font-mono text-[11px] font-semibold tracking-[0.16em] text-ink-3 uppercase";
const BODY = "text-[15.5px] leading-[1.7] text-ink-2";

export function BlockView({ block, brand, labels }: { block: Block; brand: Brand; labels: CaseLabels }) {
  switch (block.kind) {
    case "text":
      return (
        <Reveal className={COL}>
          {block.eyebrow && <p data-reveal className={EYEBROW}>{block.eyebrow}</p>}
          {block.title && <h2 data-reveal className={cn(H2, block.eyebrow && "mt-3")}>{block.title}</h2>}
          <div className={cn("space-y-4", (block.title || block.eyebrow) && "mt-5")}>
            {block.body.map((p) => (
              <p data-reveal key={p} className={BODY}>{p}</p>
            ))}
          </div>
          {block.bullets && (
            <ul data-reveal className="mt-5 space-y-2 pl-5 text-[15px] leading-relaxed text-ink-2 marker:text-ink-3 [list-style:disc]">
              {block.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </Reveal>
      );

    case "statement":
      return (
        <Reveal className="mx-auto max-w-[820px] px-6 text-center">
          <p data-reveal className={EYEBROW}>{block.eyebrow}</p>
          <p data-reveal className="mt-4 font-display text-[clamp(30px,4vw,52px)] leading-[1.08] font-semibold tracking-[-0.02em] text-balance text-ink">
            {block.line}
          </p>
          {block.sub && <p data-reveal className="mx-auto mt-4 max-w-[520px] text-[15px] text-ink-2">{block.sub}</p>}
        </Reveal>
      );

    case "numbered":
      return (
        <Reveal className={COL}>
          <h2 data-reveal className={H2}>{block.title}</h2>
          {block.intro && <p data-reveal className={cn(BODY, "mt-4")}>{block.intro}</p>}
          <div className={cn("mt-7 grid gap-3", block.items.length > 2 && "sm:grid-cols-2")}>
            {block.items.map((it, i) => (
              <div data-reveal key={i} className="rounded-[14px] bg-[#1d1c21] p-5 text-white/85">
                <p className="font-display text-[26px] font-bold text-white/20">#{i + 1}</p>
                {it.title && <p className="mt-1 text-[16px] font-semibold text-white">{it.title}</p>}
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/70">{it.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      );

    case "metrics":
      return (
        <Reveal className={COL}>
          <h2 data-reveal className="font-display text-[20px] font-semibold text-ink">{block.title}</h2>
          {block.intro && <p data-reveal className={cn(BODY, "mt-2")}>{block.intro}</p>}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {block.items.map((m) => (
              <div
                data-reveal
                key={m.label}
                className={cn("rounded-[14px] p-5", m.tone === "up" ? "bg-[#e9f9e6] dark:bg-[#183322]" : "bg-[#fdecea] dark:bg-[#3a1d1d]")}
              >
                {m.tone === "up" ? <ArrowUp size={16} className="text-[#1f8a3a]" /> : <ArrowDown size={16} className="text-[#c0392b]" />}
                <p className="mt-3 text-[13px] leading-snug text-ink-2">{m.label}</p>
                <p className="mt-2 font-display text-[30px] font-semibold text-ink">{m.value}</p>
              </div>
            ))}
          </div>
          {block.targets && <p data-reveal className="mt-3 font-mono text-[11px] text-ink-3">{labels.targets}</p>}
        </Reveal>
      );

    case "insights":
      return (
        <Reveal className={WIDE}>
          <div className="mx-auto max-w-[640px]">
            <h2 data-reveal className={H2}>{block.title}</h2>
            {block.intro && <p data-reveal className={cn(BODY, "mt-4")}>{block.intro}</p>}
          </div>
          <div className="mx-auto mt-10 grid max-w-[1000px] gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {block.items.map((it) => (
              <div data-reveal key={it.label} className="bg-paper p-6">
                <p className="font-display text-[clamp(34px,3.4vw,44px)] leading-none font-semibold" style={{ color: "var(--case-accent)" }}>
                  {it.value}
                </p>
                <p className="mt-3 text-[13.5px] leading-snug text-ink-2">
                  {it.label}
                  <a href={`#source-${it.source}`} className="ml-1 align-super font-mono text-[10px] text-ink-3 hover:text-ink">
                    [{it.source}]
                  </a>
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      );

    case "personas":
      return (
        <Reveal className={WIDE}>
          <h2 data-reveal className={cn(H2, "mx-auto max-w-[1000px]")}>{block.title}</h2>
          <div className="mx-auto mt-8 grid max-w-[1000px] gap-4 md:grid-cols-2">
            {block.items.map((p) => (
              <div data-reveal key={p.name} className="rounded-[20px] border border-line bg-surface/70 p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full font-display text-[14px] font-semibold text-white" style={{ background: "var(--case-accent)" }}>
                    {p.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{p.name}</p>
                    <p className="text-[13px] text-ink-3">{p.role}</p>
                  </div>
                </div>
                <p className="mt-5 font-script text-[24px] leading-tight" style={{ color: "var(--case-accent)" }}>
                  “{p.quote}”
                </p>
                <ul className="mt-4 space-y-1.5 text-[14px] text-ink-2">
                  {p.needs.map((n) => (
                    <li key={n} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-3" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      );

    case "steps":
      return (
        <Reveal className={WIDE}>
          <div className="text-center">
            <p data-reveal className={EYEBROW}>{block.eyebrow}</p>
            <h2 data-reveal className={cn(H2, "mt-3")}>{block.title}</h2>
            {block.sub && <p data-reveal className="mx-auto mt-3 max-w-[520px] text-[15px] text-ink-2">{block.sub}</p>}
          </div>
          <ol className="mx-auto mt-12 grid max-w-[1000px] gap-8 md:grid-cols-3">
            {block.items.map((s, i) => (
              <li data-reveal key={s.title} className="relative text-center">
                <span className="mx-auto grid size-24 place-items-center rounded-full font-display text-[34px] font-semibold" style={{ background: "var(--case-tint)", color: "var(--case-accent)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-5 font-script text-[22px] leading-tight" style={{ color: "var(--case-accent)" }}>
                  “{s.quote}”
                </p>
                <p className="mt-2 font-display text-[18px] font-semibold text-ink">{s.title}</p>
                <p className="mx-auto mt-1 max-w-[260px] text-[14px] text-ink-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      );

    case "journey":
      return (
        <Reveal className={WIDE}>
          <div className="mx-auto max-w-[1000px]">
            {block.eyebrow && <p data-reveal className={EYEBROW}>{block.eyebrow}</p>}
            <h2 data-reveal className={cn(H2, block.eyebrow && "mt-3")}>{block.title}</h2>
            {block.sub && <p data-reveal className={cn(BODY, "mt-3 max-w-[560px]")}>{block.sub}</p>}
            <div data-reveal className="mt-10 grid gap-6 border-y border-line py-8 md:grid-cols-[150px_minmax(0,1fr)_150px] md:items-center">
              <JourneyNode {...block.start} />
              <div className="md:border-x md:border-line md:px-6">
                <ol className="grid gap-5 sm:grid-cols-3">
                  {block.steps.map((s, i) => (
                    <li key={s.title}>
                      <p className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</p>
                      <p className="mt-1 font-semibold text-ink">{s.title}</p>
                      <p className="mt-1 text-[13.5px] leading-snug text-ink-2">{s.body}</p>
                    </li>
                  ))}
                </ol>
                {block.alt && (
                  <div className="mt-6 border-t border-dashed border-line pt-4">
                    <JourneyNode {...block.alt} />
                  </div>
                )}
              </div>
              <JourneyNode {...block.end} />
            </div>
          </div>
        </Reveal>
      );

    case "band":
      return (
        <section className={WIDE}>
          {(block.title || block.sub) && (
            <Reveal className="mx-auto mb-10 max-w-[640px]">
              {block.title && <h2 data-reveal className={H2}>{block.title}</h2>}
              {block.sub && <p data-reveal className="mt-2 font-serif text-[20px] text-ink-2 italic">{block.sub}</p>}
            </Reveal>
          )}
          <Reveal stagger={0.1}>
            <div className="overflow-hidden rounded-[24px]" style={{ background: "var(--case-band)" }}>
              {block.crumbs && (
                <p className="flex flex-wrap items-center gap-2 px-6 pt-6 font-serif text-[14px] text-[#3b3946] italic">
                  {block.crumbs.map((c, i) => (
                    <Fragment key={c}>
                      {i > 0 && <span className="text-[#3b3946]/40">→</span>}
                      {c}
                    </Fragment>
                  ))}
                </p>
              )}
              <div className="overflow-x-auto px-6 pt-8 pb-6 [scrollbar-width:thin]">
              {/* w-max + mx-auto centres the row when it fits and scrolls from the start when it doesn't */}
              <div className="mx-auto flex w-max snap-x items-center gap-4 sm:gap-6">
                {block.items.map((it, i) =>
                  "shot" in it ? (
                    <figure data-reveal key={it.shot.src} className="w-[168px] shrink-0 snap-center sm:w-[190px]">
                      <Phone src={it.shot.src} alt={it.shot.label} sizes="190px" />
                      <figcaption className="mt-3 text-center">
                        <span className="block font-serif text-[15px] text-[#1c1b22]">{it.shot.label}</span>
                        {it.shot.note && <span className="mt-0.5 block text-[11.5px] leading-snug text-[#55535f]">{it.shot.note}</span>}
                      </figcaption>
                    </figure>
                  ) : (
                    <div data-reveal key={`${it.node}-${i}`} className="shrink-0 pb-14">
                      <span className="block rounded-full border-[5px] border-white/80 bg-white/60 px-4 py-2 text-center text-[12.5px] font-semibold text-[#1c1b22] shadow-sm" style={{ borderColor: "color-mix(in srgb, var(--case-accent) 25%, white)" }}>
                        {it.node}
                        {it.sub && <span className="block text-[10.5px] font-normal text-[#55535f]">{it.sub}</span>}
                      </span>
                    </div>
                  ),
                )}
              </div>
              </div>
              <p className="px-6 pb-8 text-center font-serif text-[clamp(20px,2vw,26px)] text-[#2b2a33] italic">{block.caption}</p>
            </div>
          </Reveal>
        </section>
      );

    case "explore":
      return (
        <section className={WIDE}>
          <Reveal className="mx-auto max-w-[640px]">
            <h2 data-reveal className={H2}>{block.title}</h2>
            <div className="mt-4 space-y-3">
              {block.body.map((p) => (
                <p data-reveal key={p} className={BODY}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal className="mt-10 rounded-[24px] bg-gradient-to-br from-[#0d0b1f] via-[#17133a] to-[#0d0b1f] px-5 py-10 sm:px-10" stagger={0.06}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
              {block.variants.map((v) => (
                <figure data-reveal key={v.src}>
                  <Phone src={v.src} alt={v.label} sizes="170px" />
                  <figcaption className="mt-3 text-center font-serif text-[15px] text-white/85">{v.label}</figcaption>
                </figure>
              ))}
            </div>
            {block.credit && <p className="mt-8 text-center font-mono text-[10.5px] tracking-wide text-white/40">{block.credit}</p>}
          </Reveal>
        </section>
      );

    case "feedback":
      return (
        <Reveal className={COL}>
          <h2 data-reveal className={H2}>{block.title}</h2>
          {block.intro && <p data-reveal className={cn(BODY, "mt-4")}>{block.intro}</p>}
          {block.source && (
            <p data-reveal className="mt-4 inline-block rounded-full border border-dashed border-ink/25 px-3 py-1 font-mono text-[11px] text-ink-2">
              {block.source === "planned" ? labels.planned : labels.simulated}
            </p>
          )}
          <div className="mt-6 space-y-3">
            <div data-reveal className="rounded-[14px] bg-[#e9f9e6] p-5 dark:bg-[#183322]">
              <p className="text-[13px] font-medium text-ink-2">
                {block.source === "planned" ? labels.likedPlanned : block.source === "simulated" ? labels.likedSimulated : labels.liked}
              </p>
              <ul className="mt-2 space-y-1.5 pl-5 text-[14px] leading-relaxed text-ink [list-style:disc]">
                {block.liked.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div data-reveal className="rounded-[14px] bg-[#fdecea] p-5 dark:bg-[#3a1d1d]">
              <p className="text-[13px] font-medium text-ink-2">
                {block.source === "planned" ? labels.dislikedPlanned : block.source === "simulated" ? labels.dislikedSimulated : labels.disliked}
              </p>
              <ul className="mt-2 space-y-1.5 pl-5 text-[14px] leading-relaxed text-ink [list-style:disc]">
                {block.disliked.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      );

    case "edges":
      return (
        <section className={COL}>
          <Reveal>
            <h2 data-reveal className={H2}>{block.title}</h2>
            {block.intro && <p data-reveal className={cn(BODY, "mt-4")}>{block.intro}</p>}
          </Reveal>
          <div className="mt-10 space-y-16">
            {block.cases.map((c, i) => (
              <Reveal key={c.title}>
                <p data-reveal className={EYEBROW}>
                  {labels.case} {i + 1}
                </p>
                <h3 data-reveal className="mt-2 font-display text-[21px] leading-snug font-semibold text-ink">{c.title}</h3>
                <p data-reveal className="mt-2 text-[14.5px] text-ink-2">
                  <strong className="font-semibold text-ink">{labels.conclusion}</strong> {c.conclusion}
                </p>
                <div data-reveal className="mt-6 grid place-items-center rounded-[18px] px-6 py-10" style={{ background: "var(--case-band)" }}>
                  <Phone src={c.shot.src} alt={c.shot.label} className="w-[200px]" sizes="200px" />
                </div>
                {c.notes && (
                  <div data-reveal className="mt-6 grid gap-5 sm:grid-cols-2">
                    {c.notes.map((n) => (
                      <div key={n.title} className="border-l-[3px] border-[#e5484d] pl-3">
                        <p className="text-[13.5px] font-semibold text-ink">{n.title}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{n.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </section>
      );

    case "web":
      return (
        <section className={WIDE}>
          <Reveal className="mx-auto max-w-[640px]">
            <h2 data-reveal className={H2}>{block.title}</h2>
            {block.body && <p data-reveal className={cn(BODY, "mt-4")}>{block.body}</p>}
          </Reveal>
          <Reveal className="mx-auto mt-10 max-w-[1100px]" stagger={0.12}>
            <div className="space-y-8 rounded-[24px] p-4 sm:p-10" style={{ background: "var(--case-band)" }}>
              {block.shots.map((s) => (
                <figure data-reveal key={s.src}>
                  <Browser src={s.src} alt={s.label} />
                  <figcaption className="mt-3 text-center font-serif text-[16px] text-[#2b2a33] italic">{s.label}</figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </section>
      );

    case "gallery":
      return (
        <section className={WIDE}>
          <Reveal className="text-center">
            <h2 data-reveal className={H2}>{block.title}</h2>
            {block.sub && <p data-reveal className="mt-3 text-[15px] text-ink-2">{block.sub}</p>}
          </Reveal>
          <Reveal className="mt-10 overflow-x-auto pb-4 [scrollbar-width:thin]" stagger={0.07}>
            <div className="mx-auto flex w-max snap-x gap-5">
            {block.shots.map((s, i) => (
              <figure data-reveal key={s.src} className="w-[170px] shrink-0 snap-center">
                <Phone src={s.src} alt={s.label} sizes="170px" />
                <figcaption className="mt-3 text-[12px] text-ink-2">
                  <span className="font-mono text-ink-3">{String(i + 1).padStart(2, "0")}</span> {s.label}
                </figcaption>
              </figure>
            ))}
            </div>
          </Reveal>
        </section>
      );

    case "list":
      return (
        <Reveal className={COL}>
          <h2 data-reveal className={H2}>{block.title}</h2>
          {block.intro && <p data-reveal className={cn(BODY, "mt-4")}>{block.intro}</p>}
          <ol className="mt-6 space-y-5">
            {block.items.map((it) => (
              <li data-reveal key={it.title} className={BODY}>
                <strong className="font-semibold text-ink">{it.title}:</strong> {it.body}
              </li>
            ))}
          </ol>
        </Reveal>
      );

    case "walkthrough": {
      const rate = (t: number) => {
        const done = block.results.filter((r) => r[t] !== "fail").length;
        return Math.round((done / block.results.length) * 100);
      };
      return (
        <section className={WIDE}>
          <Reveal className="mx-auto max-w-[640px]">
            <h2 data-reveal className={H2}>{block.title}</h2>
            <p data-reveal className="mt-4 inline-block rounded-full border border-dashed border-ink/25 px-3 py-1 font-mono text-[11px] text-ink-2">
              {labels.simulated}
            </p>
            <p data-reveal className={cn(BODY, "mt-4")}>{block.intro}</p>
          </Reveal>

          {/* the five characters */}
          <Reveal className="mx-auto mt-10 grid max-w-[1000px] gap-3 sm:grid-cols-2 lg:grid-cols-5" stagger={0.06}>
            {block.participants.map((p, i) => (
              <div data-reveal key={p.name} className="rounded-[16px] border border-line bg-surface/70 p-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full font-mono text-[11px] font-semibold text-white" style={{ background: "var(--case-accent)" }}>
                    P{i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-ink">{p.name}</p>
                    <p className="text-[12px] text-ink-3">
                      {p.age} · {p.city}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[12.5px] font-medium text-ink-2">{p.role}</p>
                <p className="mt-1 text-[12px] leading-snug text-ink-3">{p.context}</p>
                <p className="mt-3 font-mono text-[10.5px] text-ink-3">
                  {labels.comfort}: {p.comfort}
                </p>
              </div>
            ))}
          </Reveal>

          {/* task × participant grid */}
          <Reveal className="mx-auto mt-6 max-w-[1000px] overflow-x-auto rounded-[16px] border border-line bg-surface/70">
            <table data-reveal className="w-full min-w-[560px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-line text-ink-3">
                  <th className="px-4 py-3 font-medium">{labels.tasks}</th>
                  {block.participants.map((_, i) => (
                    <th key={i} className="px-2 py-3 text-center font-mono text-[11px] font-medium">
                      P{i + 1}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium">{labels.taskSuccess}</th>
                </tr>
              </thead>
              <tbody>
                {block.tasks.map((task, t) => (
                  <tr key={task} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 text-ink">{task}</td>
                    {block.results.map((r, p) => (
                      <td key={p} className="px-2 py-3 text-center">
                        <span role="img" aria-label={labels.outcomes[r[t]]} title={labels.outcomes[r[t]]} className={cn("inline-block size-3 rounded-full", OUTCOME_STYLE[r[t]])} />
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right font-mono text-ink">{rate(t)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="flex flex-wrap gap-4 border-t border-line px-4 py-3 text-[11.5px] text-ink-3">
              {(Object.keys(OUTCOME_STYLE) as Outcome[]).map((o) => (
                <span key={o} className="flex items-center gap-1.5">
                  <span className={cn("size-2.5 rounded-full", OUTCOME_STYLE[o])} /> {labels.outcomes[o]}
                </span>
              ))}
            </p>
          </Reveal>

          {/* in-character reactions */}
          <Reveal className="mx-auto mt-10 grid max-w-[1000px] gap-6 md:grid-cols-3" stagger={0.08}>
            {block.quotes.map((q) => (
              <figure data-reveal key={q.text}>
                <blockquote className="font-script text-[22px] leading-tight" style={{ color: "var(--case-accent)" }}>
                  “{q.text}”
                </blockquote>
                <figcaption className="mt-2 text-[12px] text-ink-3">— {q.by}</figcaption>
              </figure>
            ))}
          </Reveal>
        </section>
      );
    }

    case "test":
      return (
        <Reveal className={COL}>
          <h2 data-reveal className={H2}>{block.title}</h2>
          <p data-reveal className={cn(BODY, "mt-4")}>{block.intro}</p>
          <div data-reveal className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[14px] border border-line bg-surface/70 p-5">
              <p className="text-[13px] font-semibold text-ink">{labels.tasks}</p>
              <ol className="mt-2 space-y-1.5 pl-5 text-[13.5px] leading-relaxed text-ink-2 [list-style:decimal]">
                {block.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </div>
            <div className="rounded-[14px] border border-line bg-surface/70 p-5">
              <p className="text-[13px] font-semibold text-ink">{labels.measures}</p>
              <ul className="mt-2 space-y-1.5 pl-5 text-[13.5px] leading-relaxed text-ink-2 [list-style:disc]">
                {block.measures.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      );
  }
}

function JourneyNode({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-[11px]" style={{ color: "var(--case-accent)" }}>
        {kicker}
      </p>
      <p className="mt-1 font-semibold text-ink">{title}</p>
      <p className="mt-0.5 text-[13.5px] leading-snug text-ink-2">{body}</p>
    </div>
  );
}
