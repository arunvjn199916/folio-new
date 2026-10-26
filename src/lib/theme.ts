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

/** Read a CSS custom property from <html>. */
export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Call `cb` whenever the resolved theme (or any a11y colour override) changes on <html>. */
export function onThemeChange(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-a11y-contrast", "style"] });
  return () => mo.disconnect();
}
