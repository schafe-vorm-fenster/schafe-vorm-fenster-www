/**
 * The one fact the chrome needs from the content pipeline — row 204.
 *
 * The header lies transparent on a hero photograph and turns solid once it
 * has scrolled past (Jan's round-3 point 2). Whether a route *has* a
 * photograph is a content fact, not a declaration: a hero whose image is
 * still missing renders the light hatch, which paper-coloured header items
 * could not sit on. The page used to compute it from its own image inventory
 * and hand it to `PageFrame`.
 *
 * The header now sits in `app/[lang]/layout.tsx`, above the route segment, so
 * that the router's Activity bfcache cannot keep a second copy of it in the
 * document (`state/open.md` row 204). A layout cannot ask the page anything,
 * so the answer is resolved for **every** route at once, here, and the chrome
 * picks the entry for whichever route is active.
 *
 * It costs one cached read per locale: `pageContent` is `"use cache"` at
 * `cacheLife("max")` and the six pages below already load exactly these
 * artifacts, so the work is shared rather than added.
 */

import { cacheLife } from "next/cache";

import { pageImage } from "@/src/lib/content/images";
import { HERO_IMAGE_ID } from "@/src/lib/pages/hero-images";

import { pageContent } from "./_content";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

/** route → does its first block carry a photograph in this language? */
export type HeroPhotoByRoute = Readonly<Partial<Record<RouteId, boolean>>>;

export async function heroPhotoByRoute(
  locale: Locale,
): Promise<HeroPhotoByRoute> {
  "use cache";
  cacheLife("max");

  const entries = await Promise.all(
    Object.entries(HERO_IMAGE_ID).map(async ([route, imageId]) => {
      const page = await pageContent(route as RouteId, locale);
      return [route, pageImage(page, imageId)?.src !== undefined] as const;
    }),
  );

  return Object.fromEntries(entries) as HeroPhotoByRoute;
}
