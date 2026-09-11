/**
 * A static image import resolves to an object in Next.js (and to a path
 * string under Vitest's module resolution) — the same helper
 * `src/components/gallery.tsx` already uses for the generated placeholders
 * (DEC-068), pulled out so a page does not duplicate it.
 */
import type { StaticImageData } from "next/image";

export function assetSrc(asset: StaticImageData | string): string {
  return typeof asset === "string" ? asset : asset.src;
}
