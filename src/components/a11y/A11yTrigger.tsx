"use client";

import { Accessibility } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { useA11y } from "@/lib/a11y/store";
import { cn } from "@/lib/utils";

export const OPEN_A11Y_EVENT = "portfolio:open-a11y";

// Nav-pill button for the accessibility panel. Sits with the theme and language
// controls instead of floating over content; "Hide interface" removes it (Alt+A still works).
export function A11yTrigger({ className }: { className?: string }) {
  const t = useI18n().dict.ui.a11y;
  const { hidden } = useA11y();
  if (hidden) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_A11Y_EVENT))}
      aria-label={`${t.open} (Alt + A)`}
      aria-haspopup="dialog"
      title={`${t.open} (Alt + A)`}
      className={cn("grid size-8 place-items-center rounded-full text-ink-2 transition-colors hover:bg-ink/[0.07] hover:text-ink", className)}
    >
      <Accessibility size={16} />
    </button>
  );
}
