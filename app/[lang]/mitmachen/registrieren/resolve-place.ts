/**
 * TS-WEB-0023 D3/D4/D5 — step 1's place resolution, on top of the shared live-data
 * layer (`src/lib/live/places.ts`) rather than a page-local mock: the same
 * `resolvePlace`/`searchPlaces` pair `/dein-ort` and `/dein-ort/starten` use,
 * so this route degrades and demo-labels exactly like every other place
 * lookup on the site, and a later real geo-api credential lights this page
 * up with zero page-side changes (`state/open.md`, live-data row 5).
 *
 * `?ort=` arrives two ways (D5): already a resolved community slug (from
 * `/dein-ort/starten`, `/mitmachen`, the empty calendar state), or the place
 * **name** the visitor just typed into this page's own search field. Both are
 * re-validated here, every request (D4).
 *
 * **A name, and nothing else** (DEC-0079 §1, TS-WEB-0008 D7, DEC-0128). The
 * earlier `isZip` gate let a typed postcode through and dropped every typed
 * name unread, which made this page the one search surface of the site that
 * still ran in postcode mode. Five typed digits now travel the same path as
 * any other string: they are matched against names, match nothing, and the
 * step stays unanswered (A5). The order flow keeps its postcode entry — that
 * is a purchase configuration and not this search (DEC-0079 §7).
 */

import { hasRealBackend } from "@/src/lib/live/config";
import { resolvePlace, searchPlaces } from "@/src/lib/live/places";

import type { Place } from "@/src/lib/live/types";

export type PlaceLookup =
  | { readonly kind: "resolved"; readonly place: Place; readonly demo: boolean }
  | { readonly kind: "ambiguous"; readonly candidates: readonly Place[]; readonly demo: boolean }
  | { readonly kind: "unresolved" };

/**
 * D3's row format, the same one the typeahead prints: the community carries
 * its municipality "only as context", so a candidate chip reads
 * `Ort (Gemeinde)` and the value taken from it is still the community slug
 * (TS-WEB-0008 D7a, TS-WEB-0008-A14). An index entry without a municipality
 * prints the bare name rather than empty brackets.
 */
export function placeRowLabel(place: Place): string {
  return place.municipality ? `${place.name} (${place.municipality})` : place.name;
}

/**
 * A municipality hit with several communities does not advance (D3): more than
 * one suggestion is read as "ask which one" rather than auto-selected, because
 * `searchPlaces` always resolves its `outcome.place` to the first match and
 * registering the wrong village is not a correctable mistake here — the slug
 * is what travels to the app.
 */
export async function resolveRegisterPlace(raw: string | undefined): Promise<PlaceLookup> {
  if (!raw) return { kind: "unresolved" };

  const bySlug = await resolvePlace(raw);
  if (bySlug) return { kind: "resolved", place: bySlug, demo: !hasRealBackend("communityBySlug") };

  const result = await searchPlaces({ query: raw });
  if (result.data.outcome.kind !== "covered") return { kind: "unresolved" };

  const demo = result.demo;
  if (result.data.suggestions.length > 1) {
    return { kind: "ambiguous", candidates: result.data.suggestions, demo };
  }
  return { kind: "resolved", place: result.data.outcome.place, demo };
}
