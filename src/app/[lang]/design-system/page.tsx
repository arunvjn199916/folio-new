import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { docs, docsIn } from "@/ds/docs/registry";
import { Foundations } from "@/ds/docs/Foundations";
import { DemoView } from "@/ds/docs/DocsShell";

export async function generateMetadata(): Promise<Metadata> {
  const { ui, profile } = await getDictionary();
  return { title: `${ui.dsDocs.title} — ${profile.name}`, description: ui.dsDocs.sub };
}

const PRINCIPLES = [
  ["Show the work", "Plans, tool calls, reasoning and sources are visible by default, one click from detail."],
  ["Human in the loop", "Consequential actions stop for approval; reversible ones get an undo window."],
  ["Honest uncertainty", "Confidence is labelled with a reason, never implied by colour alone."],
  ["Always recoverable", "Stop, undo, retry and edit exist wherever the model acts."],
];

export default async function DesignSystemOverview() {
  const { ui } = await getDictionary();
  const t = ui.dsDocs;
  const base = localePath(await getLocale(), "/design-system");
  const counts = { components: docsIn("components").length, ai: docsIn("ai").length, patterns: docsIn("patterns").length };
  return (
    <article className="grid gap-14">
      <header>
        <p className="text-xs font-medium tracking-wide text-ds-ai-accent uppercase">{t.navLabel}</p>
        <h1 className="mt-2 text-[clamp(32px,4vw,48px)] leading-tight font-semibold tracking-tight">{t.title}</h1>
        <p className="mt-3 max-w-2xl text-ds-muted-foreground">{t.sub}</p>
        <dl className="mt-6 flex flex-wrap gap-8">
          {(
            [
              [counts.components, t.components],
              [counts.ai, t.ai],
              [counts.patterns, t.patterns],
            ] as const
          ).map(([n, l]) => (
            <div key={l}>
              <dt className="text-xs text-ds-muted-foreground">{l}</dt>
              <dd className="text-3xl font-semibold tabular-nums">{n}</dd>
            </div>
          ))}
        </dl>
      </header>

      <DemoView slug="chat-workspace" wide />

      <section aria-labelledby="principles">
        <h2 id="principles" className="text-xl font-semibold">
          {t.principles}
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map(([title, body]) => (
            <li key={title} className="rounded-ds-lg border bg-ds-card p-4">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-ds-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="foundations">
        <h2 id="foundations" className="sr-only">
          {t.foundations}
        </h2>
        <Foundations labels={t} />
      </section>

      {(
        [
          ["ai", t.ai],
          ["patterns", t.patterns],
          ["components", t.components],
        ] as const
      ).map(([cat, label]) => (
        <section key={cat} aria-labelledby={`cat-${cat}`}>
          <h2 id={`cat-${cat}`} className="text-xl font-semibold">
            {label}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {docs
              .filter((d) => d.category === cat)
              .map((d) => (
                <li key={d.slug}>
                  <Link href={`${base}/${d.slug}`} className="group flex h-full flex-col rounded-ds-lg border bg-ds-card p-4 transition-colors hover:border-ds-primary/40">
                    <span className="flex items-center justify-between font-medium">
                      {d.name}
                      <ArrowRight className="size-4 text-ds-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1 line-clamp-2 text-sm text-ds-muted-foreground">{d.summary.replace(/`/g, "")}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
