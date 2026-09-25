/**
 * The covered-community index — the place search's **name** lookup, and the
 * one place a geoname id turns back into a slug.
 *
 * Two problems it solves, both of which had no upstream operation:
 *
 *  1. **Name search** (Q-0025, state/open.md row 5). geo-api's
 *     `community/search` takes postcodes and administrative ids and nothing
 *     else, so a typed name could not be resolved at all and the search
 *     answered the `zip-only` hint. The public village-calendar site has the
 *     same gap and solves it the same way — it ships the whole covered-community
 *     list and filters it — so this website ships the same list, built by
 *     `scripts/build-place-index.ts` and committed as
 *     `src/generated/snapshots/communities.json`.
 *  2. **id → slug.** A localized events-api event carries `community.id` and
 *     `community.name` but no slug, so the county activity ranking of
 *     `region.ts` had nothing to link to. The index closes that too.
 *
 * It is **real data, not demo data**: every row is a community the village
 * calendar actually covers, with its geo-api slug and its own coordinates.
 * A payload built from it therefore does not carry `demo: true` — what it
 * carries instead is its build date, which `snapshotBuiltAt()` already
 * expresses for every other committed artefact.
 *
 * What it does **not** carry: postcodes (the public index has none, and the
 * place search offers none — DEC-0079) and county ids. What it **does**
 * carry beside the name is the municipality, which the typeahead prints in
 * brackets (TS-WEB-0008 D7a: "Ort (Gemeinde)").
 */

import index from "@/src/generated/snapshots/communities.json";
import { haversineKm } from "./widening";

import type { Place } from "./types";

interface IndexEntry {
  readonly name: string;
  readonly slug: string;
  readonly communityId: string;
  readonly lat: number;
  readonly lng: number;
  readonly municipality?: string;
}

const ENTRIES = index.communities as readonly IndexEntry[];

/** When the committed index was built — the freshness a page may claim for it. */
export const PLACE_INDEX_BUILT_AT: string = index.builtAt;

export const PLACE_INDEX_SIZE: number = ENTRIES.length;

/** `true` when the index actually shipped — a build that never ran leaves it empty. */
export function hasPlaceIndex(): boolean {
  return ENTRIES.length > 0;
}

function toPlace(entry: IndexEntry): Place {
  return {
    communityId: entry.communityId,
    name: entry.name,
    slug: entry.slug,
    lat: entry.lat,
    lng: entry.lng,
    ...(entry.municipality ? { municipality: entry.municipality } : {}),
  };
}

/** D7a's row budget: 3–4 rows, never paged, never scrolled. Four is the cap (DEC-0119). */
export const MAX_NAME_MATCHES = 4;

/**
 * Fold what a German place name spells differently from what a visitor types:
 * the combining marks left by NFD (`\u0300`–`\u036f`, so `ü` matches `u`)
 * and `ß`, which people type as `ss` as often as not. Written as escapes
 * rather than as literal marks, so the range survives every editor and every
 * diff.
 */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/\u00df/gu, "ss")
    .toLowerCase()
    .trim();
}

/**
 * The folded forms, computed once at module load rather than per keystroke:
 * the typeahead calls `searchByName` on every debounced input, and folding
 * 1760 names each time is work the answer does not change with.
 */
const FOLDED: readonly { readonly entry: IndexEntry; readonly name: string; readonly municipality: string }[] =
  ENTRIES.map((entry) => ({
    entry,
    name: fold(entry.name),
    municipality: fold(entry.municipality ?? ""),
  }));

const BY_ID = new Map<string, IndexEntry>(ENTRIES.map((entry) => [entry.communityId, entry]));
const BY_SLUG = new Map<string, IndexEntry>(ENTRIES.map((entry) => [entry.slug, entry]));

/**
 * Name search, ranked the way a typeahead has to rank: an exact name first,
 * then a name that starts with what was typed, then one that contains it,
 * then a municipality that starts with it, then one that contains it —
 * alphabetically inside each rank, so the order is stable between two
 * identical requests. Either way the suggestion is the place, never the
 * municipality (TS-WEB-0008 D7a).
 *
 * Minimum two characters: one letter matches hundreds of villages, and a
 * suggestion list nobody can read is worse than none. Five typed digits are
 * a name like any other here: nothing is called one, and nothing matches.
 */
export function searchByName(query: string, limit = MAX_NAME_MATCHES): Place[] {
  const needle = fold(query);
  if (needle.length < 2) return [];

  const ranked: { entry: IndexEntry; rank: number }[] = [];
  for (const { entry, name, municipality } of FOLDED) {
    const rank =
      name === needle
        ? 0
        : name.startsWith(needle)
          ? 1
          : name.includes(needle)
            ? 2
            : municipality.startsWith(needle)
              ? 3
              : municipality.includes(needle)
                ? 4
                : -1;
    if (rank >= 0) ranked.push({ entry, rank });
  }

  return ranked
    .sort((a, b) => a.rank - b.rank || a.entry.name.localeCompare(b.entry.name, "de"))
    .slice(0, limit)
    .map(({ entry }) => toPlace(entry));
}

/** The community behind a geo-api slug, without asking geo-api. */
export function placeBySlug(slug: string): Place | undefined {
  const entry = BY_SLUG.get(slug.trim().toLowerCase());
  return entry ? toPlace(entry) : undefined;
}

/** The community behind a `geoname.<id>` — the id an events-api event carries. */
export function placeByCommunityId(communityId: string): Place | undefined {
  const entry = BY_ID.get(communityId);
  return entry ? toPlace(entry) : undefined;
}

/**
 * The route segment the public village-calendar site serves a community
 * under: `{slug}.{geonameId}`. Only the id half is resolved upstream, but the
 * canonical URL carries both, so both are sent.
 */
export function communityRouteSlugFor(place: Place): string {
  return `${place.slug}.${place.communityId.replace(/^geoname\./u, "")}`;
}

/**
 * The covered communities within `radiusKm` of a point, nearest first.
 *
 * geo-api's proximity search exists but is token-scoped and runs against its
 * own fixed radius constant (TS-WEB-0008 D2.2, Q-0038); the village calendar's
 * public proxy in front of it answers five. The index has every community's
 * own coordinate, so the ~15 km cut of TS-WEB-0008 D3 step 2 can be made **here**,
 * exactly, for free, and without a cap that would truncate it.
 */
export function placesWithin(
  point: { readonly lat: number; readonly lng: number },
  radiusKm: number,
): Place[] {
  return ENTRIES.flatMap((entry) => {
    const distance = haversineKm(point, entry);
    return distance <= radiusKm ? [{ place: toPlace(entry), distance }] : [];
  })
    .sort((a, b) => a.distance - b.distance)
    .map(({ place }) => place);
}

/**
 * The covered community a coordinate sits in or next to — within `radiusKm`,
 * or nothing. The index holds every community of the region and nothing
 * beyond it, so without a cut a visitor anywhere on earth is answered the
 * region's edge: the geolocation control passes DEC-0119 §7's radius so that
 * "nothing nearby" is a real answer. Callers that resolve a region-level fact
 * for a point already known to be inside it (the county, a public source)
 * keep the unbounded default.
 */
export function nearestPlace(
  point: { readonly lat: number; readonly lng: number },
  radiusKm: number = Number.POSITIVE_INFINITY,
): Place | undefined {
  let best: { place: Place; distance: number } | undefined;
  for (const entry of ENTRIES) {
    const distance = haversineKm(point, entry);
    if (best === undefined || distance < best.distance) best = { place: toPlace(entry), distance };
  }
  return best !== undefined && best.distance <= radiusKm ? best.place : undefined;
}
