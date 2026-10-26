import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// localStorage that never throws (private mode, blocked storage) and validates what it reads.
export const safeStore = {
  get<T>(key: string, validate: (v: unknown) => v is T): T | null {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      const parsed: unknown = JSON.parse(raw);
      return validate(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: unknown) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: preference simply isn't remembered */
    }
  },
};

export const isBool = (v: unknown): v is boolean => typeof v === "boolean";
export const isPoint = (v: unknown): v is { x: number; y: number } =>
  typeof v === "object" &&
  v !== null &&
  Number.isFinite((v as { x: unknown }).x) &&
  Number.isFinite((v as { y: unknown }).y);

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
