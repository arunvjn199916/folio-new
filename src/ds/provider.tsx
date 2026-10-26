"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
  Aura root. Everything in the system renders inside a `.ds` element so its tokens never
  leak into (or get overridden by) the surrounding app. Radix normally portals dialogs,
  menus and tooltips to <body>, outside that scope, so the root also offers itself as the
  portal container through context.
*/
const PortalContainer = createContext<HTMLElement | null>(null);

export function useDsPortal() {
  return useContext(PortalContainer) ?? undefined;
}

export function DsRoot({
  children,
  theme,
  className,
}: {
  children: ReactNode;
  /** Force a theme; omit to follow the site's light/dark setting. */
  theme?: "light" | "dark";
  className?: string;
}) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setEl} className={cn("ds", className)} data-ds-theme={theme}>
      <PortalContainer.Provider value={el}>{children}</PortalContainer.Provider>
    </div>
  );
}
