// Accessibility settings: one typed model, presets for the profiles, and a single
// `applyA11y` function that maps settings onto <html> (data-a11y-* attributes and
// --a11y-* variables). a11y.css does the rest. The same function runs in the head
// script before first paint, so it must stay self-contained (no imports, no closures).

export type Align = "default" | "left" | "center" | "right";
export type Contrast = "none" | "dark" | "light" | "high";
export type Saturation = "none" | "high" | "low" | "mono";
export type Cursor = "default" | "black" | "white";

export type A11ySettings = {
  contentScale: number; // 1 = 100%
  fontScale: number;
  lineHeight: number; // 0 = site default, else unitless value
  letterSpacing: number; // em
  readableFont: boolean;
  highlightTitles: boolean;
  highlightLinks: boolean;
  textMagnifier: boolean;
  align: Align;
  contrast: Contrast;
  saturation: Saturation;
  textColor: string | null;
  titleColor: string | null;
  bgColor: string | null;
  muteSounds: boolean;
  hideImages: boolean;
  readMode: boolean;
  readingGuide: boolean;
  readingMask: boolean;
  stopAnimations: boolean;
  highlightHover: boolean;
  highlightFocus: boolean;
  cursor: Cursor;
  keyboardNav: boolean;
  hidden: boolean; // "Hide interface": trigger button hidden, Alt+A brings it back
  profiles: ProfileId[];
};

export const DEFAULTS: A11ySettings = {
  contentScale: 1,
  fontScale: 1,
  lineHeight: 0,
  letterSpacing: 0,
  readableFont: false,
  highlightTitles: false,
  highlightLinks: false,
  textMagnifier: false,
  align: "default",
  contrast: "none",
  saturation: "none",
  textColor: null,
  titleColor: null,
  bgColor: null,
  muteSounds: false,
  hideImages: false,
  readMode: false,
  readingGuide: false,
  readingMask: false,
  stopAnimations: false,
  highlightHover: false,
  highlightFocus: false,
  cursor: "default",
  keyboardNav: false,
  hidden: false,
  profiles: [],
};

export const STEPS = {
  contentScale: { min: 0.8, max: 1.5, step: 0.1 },
  fontScale: { min: 0.8, max: 1.8, step: 0.1 },
  lineHeight: { min: 0, max: 2.6, step: 0.2, base: 1.6 }, // first step up goes 0 → base
  letterSpacing: { min: 0, max: 0.3, step: 0.05 },
} as const;

export const SWATCHES = ["#0a66c2", "#7b3fe4", "#d62f2f", "#e2711d", "#0f9d8f", "#3c8d2f", "#ffffff", "#000000"];

// Profiles are named presets of the adjustments below — no special-case code paths.
export const PROFILE_IDS = ["seizure", "lowVision", "adhd", "cognitive", "keyboard", "screenReader", "olderAdults"] as const;
export type ProfileId = (typeof PROFILE_IDS)[number];

export const PROFILES: Record<ProfileId, Partial<A11ySettings>> = {
  seizure: { stopAnimations: true, saturation: "low" },
  lowVision: { contentScale: 1.1, fontScale: 1.2, readableFont: true, contrast: "high", highlightLinks: true },
  adhd: { stopAnimations: true, readingMask: true, saturation: "low" },
  cognitive: { readableFont: true, highlightTitles: true, highlightLinks: true, readingGuide: true },
  keyboard: { keyboardNav: true, highlightFocus: true },
  screenReader: { stopAnimations: true, highlightFocus: true, keyboardNav: true },
  olderAdults: { fontScale: 1.2, lineHeight: 1.8, readableFont: true, highlightLinks: true, cursor: "black" },
};

const KEYS = Object.keys(DEFAULTS) as (keyof A11ySettings)[];

/** Parse untrusted JSON (localStorage) into a valid settings object. */
export function sanitize(raw: unknown): A11ySettings {
  const out: A11ySettings = { ...DEFAULTS, profiles: [] };
  if (typeof raw !== "object" || raw === null) return out;
  const r = raw as Record<string, unknown>;
  const num = (k: keyof typeof STEPS) => {
    const v = r[k];
    const s = STEPS[k];
    if (typeof v === "number" && Number.isFinite(v)) (out[k] as number) = Math.min(s.max, Math.max(s.min, v));
  };
  (Object.keys(STEPS) as (keyof typeof STEPS)[]).forEach(num);
  for (const k of KEYS) if (typeof DEFAULTS[k] === "boolean" && typeof r[k] === "boolean") (out[k] as boolean) = r[k] as boolean;
  const oneOf = <T extends string>(v: unknown, list: readonly T[], d: T): T => (list.includes(v as T) ? (v as T) : d);
  out.align = oneOf(r.align, ["default", "left", "center", "right"], "default");
  out.contrast = oneOf(r.contrast, ["none", "dark", "light", "high"], "none");
  out.saturation = oneOf(r.saturation, ["none", "high", "low", "mono"], "none");
  out.cursor = oneOf(r.cursor, ["default", "black", "white"], "default");
  for (const k of ["textColor", "titleColor", "bgColor"] as const) {
    const v = r[k];
    out[k] = typeof v === "string" && SWATCHES.includes(v) ? v : null;
  }
  out.profiles = Array.isArray(r.profiles) ? (r.profiles.filter((p) => PROFILE_IDS.includes(p as ProfileId)) as ProfileId[]) : [];
  return out;
}

/** Turn a profile on/off: on merges its preset, off restores those keys to defaults. */
export function toggleProfile(s: A11ySettings, id: ProfileId, on: boolean): A11ySettings {
  const preset = PROFILES[id];
  const next: A11ySettings = { ...s, ...(on ? preset : {}) };
  if (!on) {
    // keep values that another still-active profile also sets
    const others = s.profiles.filter((p) => p !== id).map((p) => PROFILES[p]);
    for (const k of Object.keys(preset) as (keyof A11ySettings)[]) {
      const kept = others.find((o) => k in o);
      (next as Record<string, unknown>)[k] = kept ? kept[k] : DEFAULTS[k];
    }
  }
  next.profiles = on ? [...new Set([...s.profiles, id])] : s.profiles.filter((p) => p !== id);
  return next;
}

/**
 * Map settings onto the root element. Self-contained on purpose: its source is also
 * inlined into the head script (via Function.prototype.toString) to apply settings
 * before first paint.
 */
export function applyA11y(s: A11ySettings, root: HTMLElement) {
  const flags: Record<string, boolean> = {
    "readable-font": s.readableFont,
    "highlight-titles": s.highlightTitles,
    "highlight-links": s.highlightLinks,
    "hide-images": s.hideImages,
    "read-mode": s.readMode,
    "stop-animations": s.stopAnimations,
    "highlight-hover": s.highlightHover,
    "highlight-focus": s.highlightFocus || s.keyboardNav,
    "keyboard-nav": s.keyboardNav,
    "mute-sounds": s.muteSounds,
  };
  for (const name in flags) {
    if (flags[name]) root.setAttribute("data-a11y-" + name, "");
    else root.removeAttribute("data-a11y-" + name);
  }
  const values: Record<string, string | null> = {
    align: s.align === "default" ? null : s.align,
    contrast: s.contrast === "none" ? null : s.contrast,
    saturation: s.saturation === "none" ? null : s.saturation,
    cursor: s.cursor === "default" ? null : s.cursor,
    "content-scale": s.contentScale === 1 ? null : "",
    "font-scale": s.fontScale === 1 ? null : "",
    "line-height": s.lineHeight ? "" : null,
    "letter-spacing": s.letterSpacing ? "" : null,
    "text-color": s.textColor ? "" : null,
    "title-color": s.titleColor ? "" : null,
    "bg-color": s.bgColor ? "" : null,
  };
  for (const name in values) {
    const v = values[name];
    if (v === null) root.removeAttribute("data-a11y-" + name);
    else root.setAttribute("data-a11y-" + name, v);
  }
  const st = root.style;
  const set = (k: string, v: string | null) => (v === null ? st.removeProperty(k) : st.setProperty(k, v));
  set("--a11y-content-scale", s.contentScale === 1 ? null : String(s.contentScale));
  set("--a11y-font-scale", s.fontScale === 1 ? null : String(s.fontScale));
  set("--a11y-line-height", s.lineHeight ? String(s.lineHeight) : null);
  set("--a11y-letter-spacing", s.letterSpacing ? s.letterSpacing + "em" : null);
  set("--a11y-text-color", s.textColor);
  set("--a11y-title-color", s.titleColor);
  set("--a11y-bg-color", s.bgColor);
}
