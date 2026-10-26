"use client";

import { useSyncExternalStore } from "react";
import { applyA11y, DEFAULTS, sanitize, toggleProfile, withBackground, type A11ySettings, type ProfileId } from "./model";
import { A11Y_KEY_SERVER } from "@/lib/preferences/keys";

export const A11Y_KEY = A11Y_KEY_SERVER;
const listeners = new Set<() => void>();
let state: A11ySettings | null = null;

function load(): A11ySettings {
  try {
    const raw = localStorage.getItem(A11Y_KEY);
    return sanitize(raw ? JSON.parse(raw) : null);
  } catch {
    return { ...DEFAULTS };
  }
}

function commit(next: A11ySettings) {
  state = next;
  try {
    localStorage.setItem(A11Y_KEY, JSON.stringify(next));
  } catch {}
  applyA11y(next, document.documentElement);
  listeners.forEach((l) => l());
}

export const a11y = {
  get(): A11ySettings {
    if (state === null) state = load();
    return state;
  },
  set(patch: Partial<A11ySettings>) {
    commit({ ...a11y.get(), ...patch });
  },
  toggleProfile(id: ProfileId, on: boolean) {
    commit(toggleProfile(a11y.get(), id, on));
  },
  setBackground(bg: string | null) {
    commit(withBackground(a11y.get(), bg));
  },
  reset() {
    commit({ ...DEFAULTS, hidden: a11y.get().hidden });
  },
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

const server = () => DEFAULTS;
export function useA11y() {
  return useSyncExternalStore(a11y.subscribe, a11y.get, server);
}

/**
 * Single source of truth for "should things move?": the OS reduced-motion setting OR the
 * site's own Stop-animations adjustment. Every animation checks this instead of matchMedia.
 */
export function motionDisabled() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.hasAttribute("data-a11y-stop-animations")
  );
}
