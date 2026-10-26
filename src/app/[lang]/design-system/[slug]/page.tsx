import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { docBySlug, docs } from "@/ds/docs/registry";
import { DemoView } from "@/ds/docs/DocsShell";

// Every slug is prerendered from generateStaticParams, so navigations are already
// served from the static shell; opt out of the dev-time instant-navigation check.
export const instant = false;

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/design-system/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = docBySlug(slug);
  const { ui } = await getDictionary();
  return d ? { title: `${d.name} — ${ui.dsDocs.title}`, description: d.summary.replace(/`/g, "") } : {};
}

/** `code` spans in registry summaries. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith("`") ? (
          <code key={i} className="rounded-ds-sm bg-ds-muted px-1 py-0.5 font-mono text-[0.9em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default async function ComponentDoc({ params }: PageProps<"/[lang]/design-system/[slug]">) {
  const { slug } = await params;
  const d = docBySlug(slug);
  if (!d) notFound();
  const { ui } = await getDictionary();
  const t = ui.dsDocs;
  const base = localePath(await getLocale(), "/design-system");
  // prev/next follow the sidebar order: AI, patterns, components
  const order = [...docs.filter((x) => x.category === "ai"), ...docs.filter((x) => x.category === "patterns"), ...docs.filter((x) => x.category === "components")];
  const i = order.findIndex((x) => x.slug === slug);
  const prev = order[i - 1];
  const next = order[i + 1];
  const H2 = "text-lg font-semibold";
  return (
    <article className="grid gap-10">
      <header>
        <p className="text-xs font-medium tracking-wide text-ds-muted-foreground uppercase">
          {d.category === "ai" ? t.ai : d.category === "patterns" ? t.patterns : t.components}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{d.name}</h1>
        <p className="mt-2 max-w-2xl text-ds-muted-foreground">
          <Inline text={d.summary} />
        </p>
        <p className="mt-3 inline-flex rounded-full border px-2.5 py-0.5 text-xs text-ds-muted-foreground">{d.base === "new" ? t.newInAura : `${t.basedOn}: ${d.base}`}</p>
      </header>

      <section aria-label={t.preview}>
        <DemoView slug={d.slug} wide={d.category === "patterns"} />
      </section>

      <section aria-labelledby="usage">
        <h2 id="usage" className={H2}>
          {t.usage}
        </h2>
        <pre className="mt-3 overflow-x-auto rounded-ds-lg border bg-ds-muted p-4 font-mono text-[12.5px] leading-relaxed">
          <code>{d.usage}</code>
        </pre>
      </section>

      {d.props && (
        <section aria-labelledby="props">
          <h2 id="props" className={H2}>
            {t.props}
          </h2>
          <div className="mt-3 overflow-x-auto rounded-ds-lg border">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b bg-ds-muted/60 text-xs text-ds-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">{t.prop}</th>
                  <th className="px-3 py-2 font-medium">{t.type}</th>
                  <th className="px-3 py-2 font-medium">{t.default}</th>
                  <th className="px-3 py-2 font-medium">{t.description}</th>
                </tr>
              </thead>
              <tbody>
                {d.props.map((p) => (
                  <tr key={p.name} className="border-b last:border-0">
                    <td className="px-3 py-2 align-top font-mono text-xs font-medium">{p.name}</td>
                    <td className="px-3 py-2 align-top font-mono text-xs text-ds-muted-foreground">{p.type}</td>
                    <td className="px-3 py-2 align-top font-mono text-xs">{p.default ?? "—"}</td>
                    <td className="px-3 py-2 align-top">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section aria-labelledby="a11y">
        <h2 id="a11y" className={H2}>
          {t.accessibility}
        </h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {d.a11y.map((a) => (
            <li key={a} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ds-primary" />
              {a}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-ds-lg border border-ds-success/30 bg-ds-success/5 p-4">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-ds-success">
            <Check className="size-4" /> {t.do}
          </h2>
          <ul className="mt-2 grid gap-1.5 text-sm">
            {d.dos.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-ds-lg border border-ds-destructive/30 bg-ds-destructive/5 p-4">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-ds-destructive">
            <X className="size-4" /> {t.dont}
          </h2>
          <ul className="mt-2 grid gap-1.5 text-sm">
            {d.donts.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <nav className="flex justify-between gap-4 border-t pt-6 text-sm">
        {prev ? (
          <Link href={`${base}/${prev.slug}`} className="group flex items-center gap-2 text-ds-muted-foreground hover:text-ds-foreground">
            <ArrowLeft className="size-4" />
            <span>
              <span className="block text-xs">{t.previous}</span>
              <span className="font-medium text-ds-foreground">{prev.name}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`${base}/${next.slug}`} className="group flex items-center gap-2 text-right text-ds-muted-foreground hover:text-ds-foreground">
            <span>
              <span className="block text-xs">{t.next}</span>
              <span className="font-medium text-ds-foreground">{next.name}</span>
            </span>
            <ArrowRight className="size-4" />
          </Link>
        )}
      </nav>
    </article>
  );
}
