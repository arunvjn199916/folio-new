"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { usePathname } from "next/navigation";
import { blip } from "@/lib/intro";
import { useI18n } from "@/i18n/client";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

const sectionIds = ["about", "work", "experience", "contact"] as const;

// Floating glass pill (Sanjay + Sudhanva): full links at the top of the page,
// shrinks to "ARUN VIJAYAN •••" once you scroll, expands again on hover/click.
// The active section gets a sliding highlight.
export function Nav() {
  const { dict, locale, href } = useI18n();
  const { profile, ui } = dict;
  const pathname = usePathname();
  const onHome = pathname === `/${locale}`;
  // On the home page section links are plain anchors (smooth-scrolled); elsewhere they
  // navigate back to the localised home page at that section.
  const sectionHref = (id: string) => (onHome ? `#${id}` : `${href("/")}#${id}`);
  const labels: Record<(typeof sectionIds)[number], string> = {
    about: ui.nav.about,
    work: ui.nav.work,
    experience: ui.nav.journey,
    contact: ui.nav.contact,
  };
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    // phones always get the compact pill; desktop compacts after scrolling
    const onScroll = () => setCompact(window.innerWidth < 768 || window.scrollY > 160);
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
  }, []);

  const showLinks = !compact || open;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <LayoutGroup>
        <motion.nav
          layout
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          onMouseLeave={() => setOpen(false)}
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-surface/70 bg-surface/65 p-1.5 shadow-[0_8px_30px_-12px_rgba(26,24,34,0.25)] backdrop-blur-xl"
          aria-label={ui.nav.primary}
        >
          <motion.a layout href={sectionHref("top")} className="flex items-center gap-2 rounded-full py-1 pr-1 pl-1 sm:pr-3">
            <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-lav to-blush font-display text-[11px] font-semibold text-ink">
              {initials}
            </span>
            <span className="hidden font-display text-[13px] font-semibold tracking-[0.08em] whitespace-nowrap sm:inline">{profile.name.toUpperCase()}</span>
          </motion.a>

          <AnimatePresence initial={false} mode="popLayout">
            {showLinks ? (
              <motion.ul
                key="links"
                layout
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                className="flex max-w-[calc(100vw-180px)] flex-wrap items-center"
              >
                {sectionIds.map((id) => (
                  <li key={id} className="relative">
                    {active === id && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-ink/[0.07]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <a
                      href={sectionHref(id)}
                      onMouseEnter={() => blip(880, 0.03, 0.015)}
                      className="relative block rounded-full px-3 py-1.5 text-[13px] text-ink-2 transition-colors hover:text-ink"
                    >
                      {labels[id]}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={href("/ai-workflow")}
                    className="block rounded-full px-3 py-1.5 text-[13px] text-ink-2 transition-colors hover:text-ink"
                  >
                    {ui.nav.aiWorkflow}
                  </a>
                </li>
              </motion.ul>
            ) : (
              <motion.button
                key="more"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseEnter={() => setOpen(true)}
                onClick={() => setOpen(true)}
                aria-label={ui.nav.menu}
                aria-expanded={open}
                className="flex h-8 items-center gap-[3px] rounded-full px-3"
              >
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-1 rounded-full bg-ink" />
                ))}
              </motion.button>
            )}
          </AnimatePresence>

          <motion.div layout className="flex items-center">
            <ThemeToggle />
            <LanguageSwitcher />
          </motion.div>
          <motion.a
            layout
            href={profile.links.resume}
            className="ml-1 rounded-full bg-ink px-4 py-1.5 text-[13px] font-medium text-on-ink transition-transform hover:scale-[1.03]"
          >
            {ui.nav.resume}
          </motion.a>
        </motion.nav>
      </LayoutGroup>
    </header>
  );
}
