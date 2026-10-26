"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { locales, localeMeta, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";

/** Same page and section in another language; the choice is remembered in a cookie. */
export function switchLocale(router: ReturnType<typeof useRouter>, pathname: string, next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  const rest = pathname.split("/").slice(2).join("/");
  router.push(`/${next}${rest ? `/${rest}` : ""}${window.location.hash}`, { scroll: false });
}

export function LanguageSwitcher({ variant = "nav", className }: { variant?: "nav" | "panel"; className?: string }) {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (l: Locale) => {
    setOpen(false);
    if (l !== locale) switchLocale(router, pathname, l);
  };

  return (
    <div ref={root} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${dict.ui.language.change} (${localeMeta[locale].label})`}
        className={cn(
          "flex items-center gap-1 rounded-full transition-colors",
          variant === "nav" ? "h-8 px-2.5 text-[12px] font-semibold text-ink-2 hover:bg-ink/[0.07] hover:text-ink" : "px-2 py-1 text-[13px] font-semibold text-white hover:bg-white/15",
        )}
      >
        {variant === "nav" ? localeMeta[locale].flag : localeMeta[locale].label.toUpperCase()}
        <ChevronDown size={13} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={dict.ui.language.label}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-[80] mt-2 min-w-[150px] overflow-hidden rounded-2xl border border-ink/10 bg-card p-1 text-ink shadow-[var(--card-shadow-hover)]"
          >
            {locales.map((l) => (
              <li key={l} role="option" aria-selected={l === locale}>
                <button
                  type="button"
                  lang={localeMeta[l].htmlLang}
                  onClick={() => pick(l)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[13px] hover:bg-ink/[0.06]"
                >
                  <span>
                    {localeMeta[l].label}
                    {l !== "en" && <span className="ml-1.5 text-[11px] text-ink-3">{localeMeta[l].english}</span>}
                  </span>
                  {l === locale && <Check size={14} className="text-violet" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
