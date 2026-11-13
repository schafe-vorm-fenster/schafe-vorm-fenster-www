/**
 * Which image inventory entry is a page's hero — one table, two readers.
 *
 * The page reads it to render the hero itself. The chrome reads it to answer
 * a question the page can no longer answer for the header: *does this route
 * open on a photograph?* Since row 204 the header lives in
 * `app/[lang]/layout.tsx` rather than in the page (the Activity bfcache would
 * otherwise keep a second copy of it in the document), and a layout cannot
 * ask the page anything. It resolves the fact for every route at once —
 * `app/[lang]/_chrome-data.ts` — and that resolution needs the same ids the
 * pages use, not a second list of them.
 *
 * A route without an entry has no hero photograph by construction: its first
 * block is not a `photo-surface`, so the header is solid there.
 */

import type { RouteId } from "@/src/lib/routes/routes";

export const HERO_IMAGE_ID = {
  home: "home-hero",
  place: "dein-ort-hero",
  takePart: "mitmachen-hero",
  calendar: "dein-kalender-hero",
  region: "deine-region-hero",
  about: "ueber-uns-hero",
} as const satisfies Partial<Record<RouteId, string>>;

/** The routes whose first block can carry a photograph. */
export const HERO_ROUTES = Object.keys(HERO_IMAGE_ID) as readonly (keyof typeof HERO_IMAGE_ID)[];
