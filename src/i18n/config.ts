// Locale list shared by proxy, routing, metadata and the language switcher.
// Adding a language = add it here + add a dictionary in ./dictionaries.

export const locales = ["en", "ta", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (locales as readonly string[]).includes(v);

export const localeMeta: Record<Locale, { label: string; english: string; htmlLang: string; og: string; flag: string }> = {
  en: { label: "English", english: "English", htmlLang: "en", og: "en_IN", flag: "EN" },
  ta: { label: "தமிழ்", english: "Tamil", htmlLang: "ta", og: "ta_IN", flag: "த" },
  hi: { label: "हिन्दी", english: "Hindi", htmlLang: "hi", og: "hi_IN", flag: "हि" },
};

/** Prefix an internal path with the locale ("/ai-workflow" → "/ta/ai-workflow"). */
export const localePath = (locale: Locale, path = "/") => {
  if (/^(https?:|mailto:|tel:|#)/.test(path) || /\.[a-z0-9]+$/i.test(path.split(/[?#]/)[0])) return path; // external, anchors, files
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
};

/** Pick the best supported locale from an Accept-Language header. */
export function negotiate(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.slice(2)) || 0 : 1 };
    })
    .filter((x) => x.tag && x.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}
