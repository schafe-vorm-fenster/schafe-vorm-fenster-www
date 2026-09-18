/**
 * The covered-community index — the place search's **name** lookup, and the
 * one place a geoname id turns back into a slug.
 *
 * Two problems it solves, both of which had no upstream operation:
 *
 *  1. **Name search** (Q-025, state/open.md row 5). geo-api's
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
 * What it does **not** carry: postcodes (the public index has none — ZIP
 * search stays geo-api's, and stays token-gated) and county ids.
 */

import index from "@/src/generated/snapshots/communities.json";

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
  };
}

/**
 * Fold the diacritics a German place name carries so `gross`, `groß` and
 * `Groß` all find `Groß Kiesow`, and a keyboard without umlauts still works.
 */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/gu, "")
    .replace(/ß/gu, "ss")
    .toLowerCase()
    .trim();
}

const BY_ID = new Map<string, IndexEntry>(ENTRIES.map((entry) => [entry.communityId, entry]));
const BY_SLUG = new Map<string, IndexEntry>(ENTRIES.map((entry) => [entry.slug, entry]));

/**
 * Name search, ranked the way a typeahead has to rank: an exact name first,
 * then a name that starts with what was typed, then one that contains it,
 * then a municipality that does — alphabetically inside each rank, so the
 * order is stable between two identical requests.
 *
 * Minimum two characters: one letter matches hundreds of villages, and a
 * suggestion list nobody can read is worse than none.
 */
export function searchByName(query: string, limit = 6): Place[] {
  const needle = fold(query);
  if (needle.length < 2) return [];

  const ranked: { entry: IndexEntry; rank: number }[] = [];
  for (const entry of ENTRIES) {
    const name = fold(entry.name);
    const rank =
      name === needle ? 0 : name.startsWith(needle) ? 1 : name.includes(needle) ? 2 : fold(entry.municipality ?? "").startsWith(needle) ? 3 : -1;
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
