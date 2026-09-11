/**
 * The anchor the live modules speak about when the visitor has not said
 * where she is — TS-010's stage 0, from the live layer's point of view.
 *
 * Position 1 needs a place slug and position 2 needs a coordinate. At stage 0
 * the website has neither: the platform's request geo headers are not handed
 * down yet (`src/lib/personalization/README.md` → "What this folder needs
 * from others", row 1), and geo-api has no coordinate → hierarchy endpoint
 * (Q-032). Two ways to answer that:
 *
 *   1. render no live module at all, which the mock rule forbids — "never as
 *      a hole, never as a bare empty state" (plan/guardrails.md);
 *   2. anchor the modules on one configured reference community, whose
 *      payloads every backend marks `demo: true` so the `Demo-Daten` badge
 *      renders itself.
 *
 * This module is (2), in one place. It is **configuration, not data**: when
 * the proxy hands the request geo down, `resolveLiveAnchor()` gains a second
 * source and no page changes. `Mock aktiv`, `state/open.md`.
 */

import { resolvePlace, searchPlaces } from "@/src/lib/live/places";

import type { Place } from "@/src/lib/live/types";

/**
 * The demo backend's own first community (`src/lib/live/mocks/fixtures.ts`
 * `DEMO_PLACES[0]`). Restated here rather than imported: a page may not
 * reach into `src/lib/live/mocks/` — that is the boundary `boundary.test.ts`
 * enforces — and the values are configuration either way.
 */
export const STAGE_ZERO_ANCHOR = {
  slug: "beispielgemeinde-musterdorf",
  lat: 54.0,
  lng: 13.4,
  /** geo-api id of the demo county; `region.ts` takes the id, not the label. */
  county: "geoname.900001",
} as const;

export interface LiveAnchor {
  readonly slug: string;
  readonly lat: number;
  readonly lng: number;
  readonly county: string;
  /** `true` once the visitor stated a place — TS-010 stage 3. */
  readonly stated: boolean;
}

/**
 * `?ort=` → an anchor for the live modules. The value is raw visitor input
 * (`place-parameter.ts` has already decided whether it may be echoed), so it
 * is re-resolved here against the same `resolvePlace`/`searchPlaces` pair
 * every other place lookup on the site uses.
 *
 * An unresolvable value is **not an error**: the placeless variant renders,
 * which is TS-020 D2's own rule ("the parameter is dropped and the placeless
 * variant renders — never an error page").
 */
export async function resolveLiveAnchor(raw: string | undefined): Promise<LiveAnchor> {
  const place = await resolveAnchorPlace(raw);
  if (place === undefined) return { ...STAGE_ZERO_ANCHOR, stated: false };
  return {
    slug: place.slug,
    lat: place.lat,
    lng: place.lng,
    county: place.county?.id ?? STAGE_ZERO_ANCHOR.county,
    stated: true,
  };
}

/** The place behind `?ort=`, by slug first and by postcode second (TS-008 D7). */
export async function resolveAnchorPlace(
  raw: string | undefined,
): Promise<Place | undefined> {
  if (!raw) return undefined;
  const bySlug = await resolvePlace(raw);
  if (bySlug) return bySlug;

  const search = await searchPlaces({ query: raw });
  return search.data.outcome.kind === "covered" ? search.data.outcome.place : undefined;
}
