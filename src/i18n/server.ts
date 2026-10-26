import "server-only";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.en),
  ta: () => import("./dictionaries/ta").then((m) => m.ta),
  hi: () => import("./dictionaries/hi").then((m) => m.hi),
};

/** The active locale, read from the [lang] root param (404 for unknown locales). */
export async function getLocale(): Promise<Locale> {
  const l = await lang();
  if (!isLocale(l)) notFound();
  return l;
}

/** Dictionary for the current request's locale — server components only. */
export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}

export const loadDictionary = (locale: Locale) => dictionaries[locale]();
