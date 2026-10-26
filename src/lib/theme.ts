"use client";

import { THEME_KEY_SERVER } from "@/lib/preferences/keys";

// Theme preference: "system" follows the OS, "light"/"dark" are explicit.
// The resolved theme lives on <html data-theme>, where the CSS tokens pick it up.
// The head script (lib/preferences/headScript) applies it before first paint.

export type ThemePref = "system" | "light" | "dark";
export const THEME_KEY = THEME_KEY_SERVER;
const listeners = new Set<() => void>();

const isPref = (v: unknown): v is ThemePref => v === "system" || v === "light" || v === "dark";

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return isPref(v) ? v : "system";
  } catch {
    return "system";
  }
}

const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

function apply(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "system" && systemDark());
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

let current: ThemePref | null = null;
let watching = false;

export const theme = {
  get(): ThemePref {
    if (current === null) current = readPref();
    return current;
  },
  set(pref: ThemePref) {
    current = pref;
    try {
      localStorage.setItem(THEME_KEY, pref);
    } catch {}
    apply(pref);
    listeners.forEach((l) => l());
  },
  subscribe(cb: () => void) {
    listeners.add(cb);
    if (!watching) {
      watching = true;
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (theme.get() === "system") apply("system");
        listeners.forEach((l) => l());
      });
    }
    return () => listeners.delete(cb);
  },
  resolved(): "light" | "dark" {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  },
};

let colorCtx: CanvasRenderingContext2D | null = null;
/**
 * Any CSS colour ("#fff", "#ffffff", "rgb(…)", "oklch(…)", named) → [r, g, b] in 0–1, using
 * the browser's own parser (minified CSS may shorten hex, so never hand-parse it).
 */
export function cssColorToRgb(value: string, fallback: [number, number, number] = [1, 1, 1]): [number, number, number] {
  colorCtx ??= document.createElement("canvas").getContext("2d");
  if (!colorCtx || !value) return fallback;
  colorCtx.fillStyle = "#000";
  colorCtx.fillStyle = value; // invalid values are ignored, leaving #000
  const v = String(colorCtx.fillStyle);
  if (v.startsWith("#")) {
    const n = parseInt(v.slice(1, 7), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const m = v.match(/[\d.]+/g);
  return m && m.length >= 3 ? [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255] : fallback;
}

/** Read a CSS custom property from <html>. */
export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Call `cb` whenever the resolved theme (or any a11y colour override) changes on <html>. */
export function onThemeChange(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-a11y-contrast", "style"] });
  return () => mo.disconnect();
}
