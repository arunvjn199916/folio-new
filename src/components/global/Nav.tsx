"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { blip, intro } from "@/lib/intro";
import { useI18n } from "@/i18n/client";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { switchLocale } from "./LanguageSwitcher";
import { A11yTrigger } from "@/components/a11y/A11yTrigger";

const sectionIds = ["about", "work", "experience", "contact"] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

/*
  v2 navigation.
  · Top of the page (≥1280px): full-width bar — wordmark · uppercase links (Work opens a
    two-column mega panel) · segmented language pill · accent CTA.
  · After scrolling (and always below 1280px): the bar folds into a centred pill —
    logo mark · CTA · burger. The burger drops a full menu panel with staggered links.
  Links glow in the accent colour on hover and while their section is on screen.
*/
export function Nav() {
  const { dict, locale, href } = useI18n();
  const { profile, ui, projects } = dict;
  const t = ui.nav;
  const pathname = usePathname();
  const onHome = pathname === `/${locale}`;
  const sectionHref = (id: string) => (onHome ? `#${id}` : `${href("/")}#${id}`);

  const [compact, setCompact] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // The bar folding away closes its dropdown; unfolding it closes the burger menu.
    const onScroll = () => {
      const c = window.innerWidth < 1280 || window.scrollY > 120;
      setCompact(c);
      if (c) setMega(false);
      else setMenu(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
    };
  }, [pathname]);

  const closeMenu = useCallback((refocus = true) => {
    setMenu(false);
    if (refocus) burger.current?.focus();
  }, []);

  // Menu open: freeze page scroll, Esc closes.
  useEffect(() => {
    if (!menu) return;
    const lenis = intro.lenis;
    lenis?.stop();
    const root = document.documentElement;
    const prev = root.style.overflow;
    if (!lenis) root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu, closeMenu]);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mega]);

  const openMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMegaSoon = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMega(false), 140);
  };

  const workHref = (p: (typeof projects)[number]) => href(p.href ?? `/work/${p.slug}`);
  const shortTitle = (title: string) => title.split(" — ")[0];
  const aura = projects.find((p) => p.slug === "aura-design-system");
  const concepts = projects.filter((p) => p.audience === "Concept");
  const client = projects.filter((p) => p.audience !== "Concept" && p.slug !== "aura-design-system" && !p.wip).slice(0, 4);

  const links = [
    { id: "about", label: t.about, href: sectionHref("about") },
    { id: "experience", label: t.journey, href: sectionHref("experience") },
    { id: "ai", label: t.aiWorkflow, href: href("/ai-workflow") },
  ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <AnimatePresence initial={false}>
        {!compact ? (
          /* ── Full bar ───────────────────────────────────────────── */
          <motion.div
            key="bar"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="pointer-events-auto absolute inset-x-0 top-0 flex h-[92px] items-center justify-between gap-6 px-8 xl:px-12"
          >
            <Wordmark href={sectionHref("top")} name={profile.name} role={profile.role} />

            <nav aria-label={t.primary} className="flex items-center">
              <ul className="flex items-center gap-1 xl:gap-2">
                <li className="relative" onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
                  <button
                    type="button"
                    aria-expanded={mega}
                    aria-controls="nav-mega"
                    onClick={() => setMega((m) => !m)}
                    onMouseEnter={() => blip(880, 0.03, 0.015)}
                    className={cn("nav-link group", (mega || active === "work") && "is-active")}
                  >
                    <span className="nav-link-label">{t.work}</span>
                    <ChevronDown size={14} strokeWidth={2.4} className={cn("transition-transform duration-300", mega && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {mega && (
                      <motion.div
                        id="nav-mega"
                        initial={{ opacity: 0, y: -10, scale: 0.97, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -8, scale: 0.98, filter: "blur(6px)" }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className="absolute top-[calc(100%+18px)] left-1/2 w-[min(720px,calc(100vw-64px))] origin-top -translate-x-1/2"
                      >
                        <div className="rounded-[26px] border border-ink/10 bg-card p-6 shadow-[var(--card-shadow-hover)] backdrop-blur-xl">
                          <div className="grid grid-cols-2 gap-8">
                            <MegaColumn eyebrow={t.megaConceptsEyebrow} title={t.megaConcepts} items={concepts.map((p) => ({ label: shortTitle(p.title), sub: p.descriptor, href: workHref(p) }))} onPick={() => setMega(false)} />
                            <MegaColumn eyebrow={t.megaClientEyebrow} title={t.megaClient} items={client.map((p) => ({ label: shortTitle(p.title), sub: p.descriptor, href: workHref(p) }))} onPick={() => setMega(false)} />
                          </div>
                          <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
                            {aura && (
                              <a
                                href={workHref(aura)}
                                onClick={() => setMega(false)}
                                className="group/aura flex items-center gap-4 rounded-2xl border border-ink/10 bg-gradient-to-r from-ink/[0.03] to-crimson/20 px-5 py-4 transition-colors hover:border-accent/60"
                              >
                                <span className="text-[15px] font-bold tracking-[-0.01em] text-ink">{t.megaAura}</span>
                                <span className="truncate text-[13px] text-ink-3">{t.megaAuraSub}</span>
                                <ArrowRight size={16} className="ml-auto shrink-0 text-ink transition-transform group-hover/aura:translate-x-1" />
                              </a>
                            )}
                            <a
                              href={sectionHref("work")}
                              onClick={() => setMega(false)}
                              className="flex items-center gap-2 rounded-2xl border border-ink/10 px-5 text-[13px] font-bold tracking-[0.06em] text-ink uppercase transition-colors hover:border-accent/60 hover:text-accent"
                            >
                              {t.allWork} <ArrowRight size={15} />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
                {links.map((l) => (
                  <li key={l.id}>
                    <a href={l.href} onMouseEnter={() => blip(880, 0.03, 0.015)} className={cn("nav-link", active === l.id && "is-active")}>
                      <span className="nav-link-label">{l.label}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href={profile.links.resume} target="_blank" rel="noopener" onMouseEnter={() => blip(880, 0.03, 0.015)} className="nav-link">
                    <span className="nav-link-label">{t.resume}</span>
                    <ArrowUpRight size={14} strokeWidth={2.4} />
                  </a>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-full border border-ink/10 p-0.5">
                <ThemeToggle className="size-9" />
                <A11yTrigger className="size-9" />
              </div>
              <LangPill locale={locale} label={ui.language.label} />
              <a href={sectionHref("contact")} className="btn-accent !min-h-11 !px-5 !text-[13px]">
                {t.letsTalk} <ArrowRight size={16} strokeWidth={2.4} />
              </a>
            </div>
          </motion.div>
        ) : (
          /* ── Compact pill ───────────────────────────────────────── */
          <motion.div
            key="pill"
            initial={{ opacity: 0, y: -14, scale: 0.9, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, scale: 0.94 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute inset-x-0 top-3 flex justify-center px-3 md:top-4"
          >
            <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper/70 p-1.5 shadow-[0_10px_40px_-14px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <a href={sectionHref("top")} aria-label={profile.name} className="grid size-10 place-items-center">
                <LogoMark />
              </a>
              <a href={sectionHref("contact")} onClick={() => setMenu(false)} className="btn-accent !min-h-10 !gap-2 !px-4 !text-[12px]">
                {t.letsTalk} <ArrowRight size={14} strokeWidth={2.4} />
              </a>
              <button
                ref={burger}
                type="button"
                onClick={() => setMenu((m) => !m)}
                aria-expanded={menu}
                aria-controls="nav-menu"
                aria-label={menu ? t.closeMenu : t.menu}
                className="relative grid size-10 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink/40"
              >
                <span className={cn("absolute h-[1.5px] w-4 rounded bg-ink transition-transform duration-300", menu ? "rotate-45" : "-translate-y-[3px]")} />
                <span className={cn("absolute h-[1.5px] w-4 rounded bg-ink transition-transform duration-300", menu ? "-rotate-45" : "translate-y-[3px]")} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Menu panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {menu && compact && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closeMenu(false)}
              className="pointer-events-auto fixed inset-0 -z-10 bg-paper/50 backdrop-blur-sm"
            />
            <motion.nav
              key="menu"
              id="nav-menu"
              aria-label={t.primary}
              initial={{ opacity: 0, y: -16, scale: 0.96, clipPath: "inset(0 0 100% 0 round 28px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0 0 0% 0 round 28px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.97, clipPath: "inset(0 0 100% 0 round 28px)" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="pointer-events-auto absolute top-[72px] left-1/2 max-h-[calc(100svh-88px)] w-[min(94vw,760px)] -translate-x-1/2 overflow-y-auto rounded-[28px] border border-ink/10 bg-card/95 p-6 shadow-[var(--card-shadow-hover)] backdrop-blur-xl md:top-[80px] md:p-10"
            >
              <p className="eyebrow">{t.menuEyebrow}</p>
              <ul className="mt-4">
                {[
                  { id: "work", label: t.work, href: sectionHref("work") },
                  ...links,
                  { id: "contact", label: t.contact, href: sectionHref("contact") },
                ].map((l, i) => (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.12 + i * 0.06 }}
                    className="border-b border-ink/10"
                  >
                    <a
                      href={l.href}
                      onClick={() => closeMenu(false)}
                      className={cn(
                        "group flex items-baseline gap-4 py-3 transition-colors hover:text-accent md:py-4",
                        active === l.id ? "text-accent" : "text-ink",
                      )}
                    >
                      <span className="w-7 font-mono text-[12px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                      <span className="display-m transition-transform duration-500 group-hover:translate-x-2">{l.label}</span>
                      <ArrowRight size={22} className="ml-auto self-center opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
                className="mt-6"
              >
                <p className="eyebrow">{t.megaConcepts}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {concepts.map((p) => (
                    <a key={p.slug} href={workHref(p)} onClick={() => closeMenu(false)} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent">
                      {shortTitle(p.title)}
                    </a>
                  ))}
                  {aura && (
                    <a href={workHref(aura)} onClick={() => closeMenu(false)} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent">
                      {t.megaAura}
                    </a>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-5">
                  <div className="flex items-center gap-2">
                    <LangPill locale={locale} label={ui.language.label} />
                    <div className="flex items-center rounded-full border border-ink/10 p-0.5">
                      <ThemeToggle className="size-9" />
                      <A11yTrigger className="size-9" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[13px] font-bold tracking-[0.06em] uppercase">
                    <a href={profile.links.resume} target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-accent">
                      {t.resume} <ArrowUpRight size={14} />
                    </a>
                    <a href={profile.links.linkedin} target="_blank" rel="noopener" className="hover:text-accent">LinkedIn</a>
                    <a href={profile.links.behance} target="_blank" rel="noopener" className="hover:text-accent">Behance</a>
                  </div>
                </div>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function Wordmark({ href, name, role }: { href: string; name: string; role: string }) {
  const [first, ...rest] = name.toLowerCase().split(" ");
  return (
    <a href={href} aria-label={name} className="group flex flex-col leading-none">
      <span className="flex items-start font-display text-[26px] font-extrabold tracking-[-0.06em] text-ink">
        {first}
        <span className="ml-[0.18em] text-ink/80">{rest.join(" ")}</span>
        <span className="mt-[3px] ml-0.5 size-[7px] rounded-full bg-accent shadow-[0_0_12px_rgb(var(--c-globe-lit)/0.9)] transition-transform duration-500 group-hover:scale-150" />
      </span>
      <span className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-ink-3 uppercase">{role}</span>
    </a>
  );
}

function LogoMark() {
  return (
    <span className="relative font-display text-[26px] leading-none font-extrabold tracking-[-0.06em] text-accent">
      a
      <span className="absolute -top-0.5 -right-1.5 size-[7px] rounded-full bg-crimson" />
    </span>
  );
}

function MegaColumn({ eyebrow, title, items, onPick }: { eyebrow: string; title: string; items: { label: string; sub: string; href: string }[]; onPick: () => void }) {
  return (
    <div>
      <p className="eyebrow !text-[11px]">{eyebrow}</p>
      <p className="mt-1.5 border-b border-ink/10 pb-3 font-display text-[26px] leading-none font-bold tracking-[-0.04em] text-ink uppercase">{title}</p>
      <ul>
        {items.map((it) => (
          <li key={it.href} className="border-b border-ink/10 last:border-b-0">
            <a href={it.href} onClick={onPick} className="group flex items-center gap-3 py-2.5">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-ink transition-colors group-hover:text-accent">{it.label}</span>
                <span className="block truncate text-[12px] text-ink-3">{it.sub}</span>
              </span>
              <ArrowRight size={15} className="shrink-0 -translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Segmented EN / TA / HI pill — the active language carries the accent dot. */
function LangPill({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div role="group" aria-label={label} className="flex items-center rounded-full border border-ink/10 p-0.5">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={localeMeta[l].htmlLang}
          aria-pressed={l === locale}
          aria-label={localeMeta[l].label}
          onClick={() => l !== locale && switchLocale(router, pathname, l)}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold tracking-[0.06em] transition-colors",
            l === locale ? "bg-ink/10 text-ink" : "text-ink-3 hover:text-ink",
          )}
        >
          {l === locale && <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--c-globe-lit)/0.9)]" />}
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
