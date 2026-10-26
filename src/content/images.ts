import { imageManifest } from "./images.generated";

/**
 * Resolve a logical image name ("portrait.webp", "projects/magnil.webp") to its
 * content-hashed URL, or null when that image hasn't been added yet (→ placeholder).
 */
export const img = (name: string | undefined | null): string | null => (name ? (imageManifest[name] ?? null) : null);
