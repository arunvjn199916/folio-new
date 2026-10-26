"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { theme } from "@/lib/theme";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";

const getResolved = () => theme.resolved();
const serverResolved = () => "light" as const;

// One-tap light/dark switch for the nav. "System" lives in the accessibility panel.
export function ThemeToggle({ className }: { className?: string }) {
  const { ui } = useI18n().dict;
  const resolved = useSyncExternalStore(theme.subscribe, getResolved, serverResolved);
  const dark = resolved === "dark";
  return (
    <button
      type="button"
      onClick={() => theme.set(dark ? "light" : "dark")}
      aria-label={`${ui.theme.toggle}: ${dark ? ui.theme.light : ui.theme.dark}`}
      title={ui.theme.toggle}
      className={cn("relative grid size-8 place-items-center overflow-hidden rounded-full text-ink-2 transition-colors hover:bg-ink/[0.07] hover:text-ink", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={resolved}
          initial={{ y: 12, rotate: -60, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -12, rotate: 60, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid place-items-center"
        >
          {dark ? <Moon size={15} /> : <Sun size={15} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
