/**
 * TS-023 D3/D4/D5 — step 1's place resolution, on top of the shared live-data
 * layer (`src/lib/live/places.ts`) rather than a page-local mock: the same
 * `resolvePlace`/`searchPlaces` pair `/dein-ort` and `/dein-ort/starten` use,
 * so this route degrades and demo-labels exactly like every other place
 * lookup on the site, and a later real geo-api credential lights this page
 * up with zero page-side changes (`state/open.md`, live-data row 5).
 *
 * `?ort=` arrives two ways (D5): already a resolved community slug (from
 * `/dein-ort/starten`, `/mitmachen`, the empty calendar state), or whatever
 * the visitor just typed into this page's own search field — a postcode,
 * per the ZIP-only floor (Q-025). Both are re-validated here, every request
 * (D4).
 */

import { hasRealBackend } from "@/src/lib/live/config";
import { isZip, resolvePlace, searchPlaces } from "@/src/lib/live/places";

import type { Place } from "@/src/lib/live/types";

export type PlaceLookup =
  | { readonly kind: "resolved"; readonly place: Place; readonly demo: boolean }
  | { readonly kind: "ambiguous"; readonly candidates: readonly Place[]; readonly demo: boolean }
  | { readonly kind: "unresolved" };

/**
 * A municipality hit with several communities behind it does not advance
 * (D3) — `searchPlaces` always resolves its `outcome.place` to the first
 * match, so more than one `suggestions` entry is read as "ask which one"
 * rather than auto-selected.
 */
export async function resolveRegisterPlace(raw: string | undefined): Promise<PlaceLookup> {
  if (!raw) return { kind: "unresolved" };

  const bySlug = await resolvePlace(raw);
  if (bySlug) return { kind: "resolved", place: bySlug, demo: !hasRealBackend("communityBySlug") };

  if (!isZip(raw)) return { kind: "unresolved" };

  const result = await searchPlaces({ query: raw });
  if (result.data.outcome.kind !== "covered") return { kind: "unresolved" };

  const demo = result.demo;
  if (result.data.suggestions.length > 1) {
    return { kind: "ambiguous", candidates: result.data.suggestions, demo };
  }
  return { kind: "resolved", place: result.data.outcome.place, demo };
}
