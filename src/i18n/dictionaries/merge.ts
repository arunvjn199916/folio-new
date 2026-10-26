import type { Segment } from "@/content/profile";

// Translations overlay text onto the English structures by position, so links, colours,
// images and ids are never duplicated per language. A missing entry falls back to English.

export function withText<T extends object>(base: readonly T[], values: readonly string[], key?: keyof T): T[];
export function withText<T extends object>(base: readonly T[], values: readonly Partial<T>[]): T[];
export function withText<T extends object>(base: readonly T[], values: readonly (string | Partial<T>)[], key?: keyof T): T[] {
  return base.map((item, i) => {
    const v = values[i];
    if (v === undefined) return item;
    return typeof v === "string" ? { ...item, [key ?? "text"]: v } : { ...item, ...v };
  });
}

/** Replace the text of each rich-text segment, keeping its bold/highlight marks. */
export const withSegments = (base: readonly Segment[], texts: readonly string[]): Segment[] =>
  base.map((s, i) => ({ ...s, text: texts[i] ?? s.text }));
