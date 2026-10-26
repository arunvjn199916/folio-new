// Foundations: rendered straight from the CSS custom properties in tokens.css, so the
// documentation can't drift from the system.

const COLOR_GROUPS: { title: string; tokens: [string, string][] }[] = [
  {
    title: "Neutral",
    tokens: [
      ["background", "Page"],
      ["foreground", "Text"],
      ["card", "Card"],
      ["muted", "Muted surface"],
      ["muted-foreground", "Secondary text"],
      ["border", "Border"],
    ],
  },
  {
    title: "Brand & status",
    tokens: [
      ["primary", "Primary"],
      ["secondary", "Secondary"],
      ["destructive", "Destructive"],
      ["success", "Success"],
      ["warning", "Warning"],
      ["info", "Info"],
    ],
  },
  {
    title: "AI roles",
    tokens: [
      ["ai", "Assistant surface"],
      ["ai-accent", "Agent activity"],
      ["citation", "Citation"],
      ["human", "Needs a human"],
      ["confidence-high", "Confidence · high"],
      ["confidence-low", "Confidence · low"],
    ],
  },
];

const TYPE = [
  ["Display", "text-4xl font-semibold tracking-tight", "36 / 40 · 600"],
  ["Title", "text-2xl font-semibold", "24 / 32 · 600"],
  ["Heading", "text-lg font-semibold", "18 / 28 · 600"],
  ["Body", "text-sm", "14 / 20 · 400"],
  ["Caption", "text-xs text-ds-muted-foreground", "12 / 16 · 400"],
  ["Code", "font-mono text-xs", "12 / 16 · mono"],
] as const;

export function Foundations({ labels }: { labels: { colors: string; type_: string; spacing: string; elevation: string; motion: string } }) {
  return (
    <div className="grid gap-12">
      <section aria-labelledby="f-color">
        <h2 id="f-color" className="text-xl font-semibold">
          {labels.colors}
        </h2>
        <p className="mt-1 text-sm text-ds-muted-foreground">Semantic roles, not raw colours. Every role has a light and a dark value; AI roles mark model activity, sources and human decisions.</p>
        <div className="mt-5 grid gap-6">
          {COLOR_GROUPS.map((g) => (
            <div key={g.title}>
              <p className="mb-2 text-xs font-medium tracking-wide text-ds-muted-foreground uppercase">{g.title}</p>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {g.tokens.map(([tok, name]) => (
                  <li key={tok} className="overflow-hidden rounded-ds-lg border">
                    <span className="block h-14" style={{ background: `var(--ds-${tok})` }} />
                    <span className="block px-2.5 py-2">
                      <span className="block text-xs font-medium">{name}</span>
                      <code className="block truncate font-mono text-[11px] text-ds-muted-foreground">--ds-{tok}</code>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="h-3 rounded-full bg-(image:--ds-ai-gradient)" aria-label="AI gradient, used only for AI actions and the assistant avatar" role="img" />
        </div>
      </section>

      <section aria-labelledby="f-type">
        <h2 id="f-type" className="text-xl font-semibold">
          {labels.type_}
        </h2>
        <p className="mt-1 text-sm text-ds-muted-foreground">Geist for interface text, DM Mono for code and tool calls. Six steps cover every screen.</p>
        <ul className="mt-5 divide-y rounded-ds-lg border">
          {TYPE.map(([name, cls, spec]) => (
            <li key={name} className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-3">
              <span className={cls}>{name}</span>
              <code className="font-mono text-[11px] text-ds-muted-foreground">{spec}</code>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="f-space" className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 id="f-space" className="text-xl font-semibold">
            {labels.spacing}
          </h2>
          <p className="mt-1 text-sm text-ds-muted-foreground">4-point spacing; radius derives from one token.</p>
          <ul className="mt-5 grid gap-2">
            {[4, 8, 12, 16, 24, 32, 48].map((s) => (
              <li key={s} className="flex items-center gap-3 text-xs">
                <code className="w-10 font-mono text-ds-muted-foreground">{s}px</code>
                <span className="h-3 rounded-sm bg-ds-primary/70" style={{ width: s * 3 }} />
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            {["sm", "md", "", "lg", "xl"].map((r) => (
              <span key={r} className={`grid size-14 place-items-center border-2 border-ds-primary/40 bg-ds-secondary text-[10px] font-medium rounded-ds${r ? `-${r}` : ""}`}>
                {r || "base"}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{labels.elevation}</h2>
          <p className="mt-1 text-sm text-ds-muted-foreground">Four shadow levels: resting, raised, floating, modal.</p>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((e) => (
              <div key={e} className="grid h-20 place-items-center rounded-ds-lg border bg-ds-card text-xs font-medium" style={{ boxShadow: `var(--ds-shadow-${e})` }}>
                shadow-ds-{e}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="f-motion">
        <h2 id="f-motion" className="text-xl font-semibold">
          {labels.motion}
        </h2>
        <p className="mt-1 text-sm text-ds-muted-foreground">Fast feedback, calm transitions. Every animation stops under prefers-reduced-motion.</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["--ds-duration-fast", "120ms", "Hover, press"],
            ["--ds-duration-base", "200ms", "Open, close"],
            ["--ds-duration-slow", "320ms", "Progress, panels"],
            ["--ds-stream-tick", "900ms", "Streaming caret"],
          ].map(([tok, v, use]) => (
            <li key={tok} className="rounded-ds-lg border p-3">
              <p className="text-lg font-semibold tabular-nums">{v}</p>
              <p className="text-xs text-ds-muted-foreground">{use}</p>
              <code className="mt-2 block font-mono text-[11px] text-ds-muted-foreground">{tok}</code>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
