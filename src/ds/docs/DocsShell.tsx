"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Monitor, Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { safeStore } from "@/lib/utils";
import { DsRoot } from "../provider";
import { TooltipProvider } from "../ui/overlays";
import { Toaster } from "../ui/pickers";
import { docsIn, type DocCategory } from "./registry";
import { demos } from "./demos";
import { cn } from "@/lib/utils";

type ThemeChoice = "site" | "light" | "dark";
const isChoice = (v: unknown): v is ThemeChoice => v === "site" || v === "light" || v === "dark";

// Remembered docs theme, read through useSyncExternalStore so server and client agree on
// first paint ("site") and the stored choice applies right after hydration.
const listeners = new Set<() => void>();
const themeStore = {
  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  get: (): ThemeChoice => safeStore.get("ds-theme", isChoice) ?? "site",
  server: (): ThemeChoice => "site",
  set: (c: ThemeChoice) => {
    safeStore.set("ds-theme", c);
    listeners.forEach((fn) => fn());
  },
};

/*
  Docs frame: left nav (overview + every entry by category), a theme switch that can
  follow the portfolio's theme or force light/dark, and the Aura root that scopes tokens
  and portals. Wheel events inside are native (data-lenis-prevent) so nested scroll
  areas behave like a real app.
*/
export function DocsShell({ children }: { children: React.ReactNode }) {
  const { dict, href } = useI18n();
  const t = dict.ui.dsDocs;
  const pathname = usePathname();
  const choice = useSyncExternalStore(themeStore.subscribe, themeStore.get, themeStore.server);
  const pick = themeStore.set;
  const groups: [DocCategory, string][] = [
    ["ai", t.ai],
    ["patterns", t.patterns],
    ["components", t.components],
  ];
  const base = href("/design-system");
  return (
    <DsRoot theme={choice === "site" ? undefined : choice} className="min-h-svh">
      <TooltipProvider>
        <div data-lenis-prevent className="mx-auto flex max-w-[1400px] gap-8 px-4 pt-24 pb-20 sm:px-6">
          <nav aria-label={t.navLabel} className="sticky top-24 hidden h-[calc(100svh-7rem)] w-56 shrink-0 overflow-y-auto pr-2 lg:block">
            <Link href={base} aria-current={pathname === base ? "page" : undefined} className="block rounded-ds-md px-2 py-1.5 text-sm font-semibold hover:bg-ds-accent aria-[current=page]:bg-ds-accent">
              {t.overview}
            </Link>
            {groups.map(([cat, label]) => (
              <div key={cat} className="mt-5">
                <p className="px-2 pb-1 text-[11px] font-medium tracking-wide text-ds-muted-foreground uppercase">{label}</p>
                <ul>
                  {docsIn(cat).map((d) => {
                    const url = `${base}/${d.slug}`;
                    return (
                      <li key={d.slug}>
                        <Link
                          href={url}
                          aria-current={pathname === url ? "page" : undefined}
                          className="block rounded-ds-md px-2 py-1 text-[13px] text-ds-muted-foreground transition-colors hover:bg-ds-accent hover:text-ds-foreground aria-[current=page]:bg-ds-accent aria-[current=page]:font-medium aria-[current=page]:text-ds-foreground"
                        >
                          {d.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex justify-end">
              <div role="radiogroup" aria-label={t.theme} className="flex gap-0.5 rounded-ds-lg border bg-ds-muted p-0.5">
                {(
                  [
                    ["site", t.system, Monitor],
                    ["light", t.light, Sun],
                    ["dark", t.dark, Moon],
                  ] as const
                ).map(([v, l, Icon]) => (
                  <button
                    key={v}
                    role="radio"
                    aria-checked={choice === v}
                    onClick={() => pick(v)}
                    className={cn("flex items-center gap-1.5 rounded-ds-md px-2.5 py-1 text-xs font-medium text-ds-muted-foreground", choice === v && "bg-ds-background text-ds-foreground shadow-ds-1")}
                  >
                    <Icon className="size-3.5" /> {l}
                  </button>
                ))}
              </div>
            </div>
            {children}
          </div>
        </div>
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </DsRoot>
  );
}

/** Live preview for one registry entry. */
export function DemoView({ slug, wide }: { slug: string; wide?: boolean }) {
  const Demo = demos[slug];
  if (!Demo) return null;
  return (
    <div className={cn("flex min-h-56 items-center justify-center rounded-ds-xl border bg-ds-background p-6 sm:p-10", wide && "block p-3 sm:p-4")}>
      <Demo />
    </div>
  );
}
