"use client";

import { createContext, useContext } from "react";
import { localePath, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

type I18n = { locale: Locale; dict: Dictionary; href: (path?: string) => string };
const Ctx = createContext<I18n | null>(null);

// The root layout passes the (server-loaded) dictionary down once; client islands read
// the strings they need from here instead of importing content directly.
export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: React.ReactNode }) {
  return <Ctx.Provider value={{ locale, dict, href: (p) => localePath(locale, p) }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside <I18nProvider>");
  return v;
}
