/**
 * The mock geo backend — `state/open.md` row 5 (`Mock aktiv`).
 *
 * It stands behind exactly the interface `src/clients/geo-api/client.ts`
 * offers, so `places.ts` calls one or the other without knowing which. What
 * it stands in for, measured against the pinned specification:
 *
 *  - **name search** (Q-025) does not exist upstream at all;
 *  - **coordinate → county** (Q-032) and **nearest covered community**
 *    (Q-051) have no operation;
 *  - **a caller-supplied radius** (Q-038) is not a parameter, so the mock
 *    answers the same shape the real proximity search does and the ~15 km cut
 *    stays in `widening.ts` for both.
 *
 * Where the real geo-api *does* answer (ZIP search, slug lookup) this mock is
 * used only because the environment has no read token — see `config.ts`.
 */

import {
  AMBIGUOUS_DEMO_PLACES,
  AMBIGUOUS_DEMO_ZIP,
  DEMO_PLACES,
  demoPlaceBySlug,
  demoPlaceForZip,
  UNCOVERED_DEMO_ZIP,
} from "./fixtures";
import { haversineKm } from "../widening";

import type { Place } from "../types";

/**
 * TS-023-A6 (F-2-5, round 2): `AMBIGUOUS_DEMO_ZIP` is the one postcode that
 * answers more than one place, so `searchPlaces`' `suggestions.length > 1`
 * branch — "a municipality hit with several communities does not advance"
 * — has a real fixture to walk, not only the stubbed unit test in
 * `resolve-place.test.ts`.
 */
export function mockSearchByZip(zip: string): Place[] {
  if (zip === AMBIGUOUS_DEMO_ZIP) return [...AMBIGUOUS_DEMO_PLACES];
  const place = demoPlaceForZip(zip);
  return place ? [place] : [];
}

/**
 * Name search (Q-025). The real endpoint does not exist; the mock matches on
 * a case-insensitive prefix over the demo places, so the typeahead of TS-008
 * D7 is reviewable as the feature it will be.
 */
export function mockSearchByName(name: string): Place[] {
  const needle = name.trim().toLowerCase();
  if (needle.length < 2) return [];
  return DEMO_PLACES.filter((place) => place.name.toLowerCase().includes(needle));
}

/** Proximity search — nearest first, capped like the real default (10). */
export function mockSearchByPoint(
  point: { readonly lat: number; readonly lng: number },
  maxResults = 10,
): Place[] {
  return [...DEMO_PLACES]
    .sort((a, b) => haversineKm(point, a) - haversineKm(point, b))
    .slice(0, maxResults);
}

export function mockCommunityBySlug(slug: string): Place | undefined {
  return demoPlaceBySlug(slug);
}

/** Coordinate → county (Q-032): upstream has no such operation. */
export function mockCountyForPoint(point: { readonly lat: number; readonly lng: number }): Place["county"] {
  return mockSearchByPoint(point, 1)[0]?.county;
}

export { AMBIGUOUS_DEMO_ZIP, UNCOVERED_DEMO_ZIP };
