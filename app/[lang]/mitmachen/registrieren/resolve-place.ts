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
import { fold } from "@/src/lib/live/place-index";
import { resolvePlace, searchPlaces } from "@/src/lib/live/places";

import type { Place } from "@/src/lib/live/types";

export type PlaceLookup =
  | { readonly kind: "resolved"; readonly place: Place; readonly demo: boolean }
  | { readonly kind: "ambiguous"; readonly candidates: readonly Place[]; readonly demo: boolean }
  | { readonly kind: "unresolved" };

/**
 * A municipality hit with several communities does not advance (D3): the step
 * asks which of them rather than auto-selecting, because `searchPlaces` always
 * resolves its `outcome.place` to the first match and registering the wrong
 * village is not a correctable mistake here — the slug is what travels to the
 * app.
 *
 * A name the visitor spelled out in full is not that case (DEC-0128 §3).
 * `searchByName` ranks an exact folded name match ahead of every prefix,
 * substring and municipality match (`src/lib/live/place-index.ts`), so the
 * first suggestion for an exactly typed name is her place and not a guess,
 * even where an unrelated row merely contains the string — `Bömitz` beside
 * `Labömitz`, `Gülzow` beside `Gülzowshof`. What keeps the question open is a
 * *second* row of that same name, which is the "two villages of one name" case
 * `TS-WEB-0008 D7a` puts the municipality in brackets for. Exactness is
 * decided with the index's own `fold`, never a second normaliser.
 */
export async function resolveRegisterPlace(raw: string | undefined): Promise<PlaceLookup> {
  if (!raw) return { kind: "unresolved" };

  const bySlug = await resolvePlace(raw);
  if (bySlug) return { kind: "resolved", place: bySlug, demo: !hasRealBackend("communityBySlug") };

  const result = await searchPlaces({ query: raw });
  if (result.data.outcome.kind !== "covered") return { kind: "unresolved" };

  const demo = result.demo;
  const typed = fold(raw);
  const [exact, ...furtherExact] = result.data.suggestions.filter((place) => fold(place.name) === typed);
  if (exact && furtherExact.length === 0) return { kind: "resolved", place: exact, demo };

  if (result.data.suggestions.length > 1) {
    return { kind: "ambiguous", candidates: result.data.suggestions, demo };
  }
  return { kind: "resolved", place: result.data.outcome.place, demo };
}
