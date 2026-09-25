/**
 * Place search and a place's dates — TS-WEB-0008 D7 and D3 step 1, D4.
 *
 * The interface module the BFF routes call. It picks a backend per capability
 * (`config.ts`), wraps every upstream call in `resilient()` (TS-WEB-0009 D4), and
 * returns an envelope — never markup, never a thrown error for an empty
 * result.
 *
 * Each of its jobs has an ordered list of sources rather than one source and
 * a mock, so a deployment without read tokens still answers with real places
 * and real dates:
 *
 * | Job | 1st | 2nd | 3rd |
 * | --- | --- | --- | --- |
 * | name search (the place search, DEC-0079) | the committed community index | — | mock |
 * | nearest place to a point (the geolocation control) | geo-api (token) | the committed index | mock |
 * | slug → place | geo-api (token) | the committed index | mock |
 * | a place's dates | events-api (token) | the public village-calendar page | mock |
 * | postcode → places (the order flow's scope step only, DEC-0079 §7) | geo-api (token) | — | mock |
 *
 * **The place search takes a name and nothing else.** Five typed digits are
 * not a mode: they are matched like any other string, match nothing, and the
 * submit reaches the founding route (TS-WEB-0008 D7). The postcode lookup
 * survives as `searchPlacesByZip` for one caller — the order flow's scope
 * step, which is a purchase configuration and not the place search.
 */

import {
  searchByPoint as realSearchByPoint,
  searchByZip as realSearchByZip,
  communityBySlug as realCommunityBySlug,
} from "@/src/clients/geo-api/client";
import { searchEvents } from "@/src/clients/events-api/client";

import { toLiveEvents, toPlace } from "./adapters";
import { cacheTags } from "./cache-profiles";
import { eventsConfig, geoConfig, hasRealBackend } from "./config";
import { mockEventsForPlace } from "./mocks/events";
import { mockCommunityBySlug, mockSearchByName, mockSearchByPoint, mockSearchByZip } from "./mocks/geo";
import { hasPlaceIndex, MAX_NAME_MATCHES, nearestPlace, placeBySlug, searchByName } from "./place-index";
import { publicPlaceEvents } from "./public-source";
import { resilient, type ResilientOptions } from "./resilient";
import { placeEventsFallback } from "./snapshots";
import { byStart, EVENT_WINDOWS, type EventWindow } from "./widening";

import type { LiveEnvelope, NearestPlace, Place, PlaceEvents, PlaceSearchResult } from "./types";

/**
 * A German postcode. Kept for the one surface that still takes one — the
 * order flow's scope step (TS-WEB-0025 D3, DEC-0079 §7). The place search
 * itself never asks.
 */
const ZIP = /^\d{5}$/;

export function isZip(query: string): boolean {
  return ZIP.test(query.trim());
}

/** How many suggestions the typeahead may show — D7a's 3–4 rows, capped at four (DEC-0119). */
export const MAX_SUGGESTIONS = MAX_NAME_MATCHES;

export interface PlaceSearchInput {
  readonly query: string;
  readonly store?: ResilientOptions<PlaceSearchResult>["store"];
  readonly now?: () => Date;
}

function classify(query: string, places: readonly Place[]): PlaceSearchResult {
  const first = places[0];
  return first
    ? { query, outcome: { kind: "covered", place: first }, suggestions: places.slice(0, MAX_SUGGESTIONS) }
    : { query, outcome: { kind: "uncovered", query }, suggestions: [] };
}

/**
 * The place search — a typed **name**, matched against place names and
 * municipality names (TS-WEB-0008 D7, DEC-0079 §1).
 *
 * Two outcomes: `covered` when the index knows a place for the string,
 * `uncovered` when it does not. An uncovered name is not an error and not a
 * dead end — the caller routes it to `/dein-ort/starten?ort=<query>` (D7's
 * third row, FUN-WEB-0047). Nothing here looks at the shape of the string:
 * digits, umlauts, a village nobody has heard of — all of it is a name.
 */
export async function searchPlaces({ query, store, now }: PlaceSearchInput): Promise<LiveEnvelope<PlaceSearchResult>> {
  const trimmed = query.trim();
  const real = hasRealBackend("placeSearchByName") && hasPlaceIndex();

  const fetcher = async (): Promise<PlaceSearchResult> =>
    classify(trimmed, real ? searchByName(trimmed, MAX_SUGGESTIONS) : mockSearchByName(trimmed));

  return resilient(fetcher, {
    key: `place-search:${trimmed.toLowerCase()}`,
    kind: "activePlaces",
    tags: [cacheTags.places()],
    // No snapshot: a search that cannot run keeps its own inline state
    // (TS-WEB-0009 D9) rather than answering with an unrelated place.
    snapshot: () => ({ query: trimmed, outcome: { kind: "uncovered", query: trimmed }, suggestions: [] }),
    store,
    now,
    demo: !real,
  });
}

/**
 * Postcode → the covered places inside it. **Not the place search.** This is
 * the order flow's scope input (TS-WEB-0025 D3): a buyer configuring which
 * places a purchased calendar covers, which DEC-0079 §7 leaves in postcode
 * mode. It answers `GET /api/places/search?zip=` and nothing on a search
 * surface calls it.
 *
 * A string that is not a postcode is `uncovered` at once — geo-api is not
 * asked a question it cannot answer.
 */
export async function searchPlacesByZip({ query, store, now }: PlaceSearchInput): Promise<LiveEnvelope<PlaceSearchResult>> {
  const trimmed = query.trim();
  const real = hasRealBackend("placeSearchByZip");

  const fetcher = async (): Promise<PlaceSearchResult> => {
    if (!isZip(trimmed)) return classify(trimmed, []);
    const places = real ? (await realSearchByZip(geoConfig(), trimmed)).map(toPlace) : mockSearchByZip(trimmed);
    return classify(trimmed, places);
  };

  return resilient(fetcher, {
    key: `place-search-zip:${trimmed}`,
    kind: "activePlaces",
    tags: [cacheTags.places()],
    snapshot: () => ({ query: trimmed, outcome: { kind: "uncovered", query: trimmed }, suggestions: [] }),
    store,
    now,
    demo: !real,
  });
}

/**
 * The covered community a coordinate sits in or next to — what the
 * geolocation control beside the search resolves against (TS-WEB-0008 D7's
 * coordinates row, TS-WEB-0010 D5, DEC-0119).
 *
 * geo-api's proximity search first where a token exists; the committed index
 * second, which has every community's own coordinate and needs no
 * credential; the mock last. **Deliberately not `resilient()`:** a cache
 * key made of a visitor's coordinates would be a stored coordinate, and D5
 * says the coordinates are never stored. Nothing here writes them anywhere —
 * not to a cache, not to a log — and the answer carries the place only.
 */
export async function nearestCoveredPlace(point: {
  readonly lat: number;
  readonly lng: number;
}): Promise<LiveEnvelope<NearestPlace> | undefined> {
  const fetchedAt = new Date().toISOString();
  const viaGeo = hasRealBackend("placesNearPoint");
  const viaIndex = hasRealBackend("placesNearPointIndex") && hasPlaceIndex();

  if (viaGeo) {
    try {
      const [community] = await realSearchByPoint(geoConfig(), point, 1);
      if (community) {
        return { data: { place: toPlace(community) }, tier: "live", fetchedAt, stale: false, demo: false, source: "real" };
      }
    } catch {
      // Fall through: an unreachable geo-api is not "no place nearby".
    }
  }

  if (viaIndex) {
    const place = nearestPlace(point);
    return place === undefined
      ? undefined
      : { data: { place }, tier: "live", fetchedAt, stale: false, demo: false, source: "real" };
  }

  const [place] = mockSearchByPoint(point, 1);
  return place === undefined
    ? undefined
    : { data: { place }, tier: "live", fetchedAt, stale: false, demo: true, source: "mock" };
}

/**
 * Resolves a slug that arrived on `?ort=` — the precondition of the handover
 * (TS-WEB-0008 D9).
 *
 * geo-api first, because it is the authority and carries the hierarchy the
 * index does not. The committed index second, because it holds the same
 * slugs and needs no credential. The mock last.
 */
export async function resolvePlace(slug: string): Promise<Place | undefined> {
  if (hasRealBackend("communityBySlug")) {
    try {
      const community = await realCommunityBySlug(geoConfig(), slug);
      if (community) return toPlace(community);
    } catch {
      // Fall through: an unreachable geo-api is not an unresolvable slug.
    }
  }
  if (hasRealBackend("communityBySlugIndex")) {
    const indexed = placeBySlug(slug);
    if (indexed) return indexed;
  }
  // An unresolvable slug leads to the founding route, never to a broken app
  // link (TS-WEB-0008 D9) — the caller decides, this returns nothing.
  return mockCommunityBySlug(slug);
}

export interface PlaceEventsInput {
  readonly slug: string;
  readonly window?: EventWindow;
  readonly rowCount?: number;
  readonly store?: ResilientOptions<PlaceEvents>["store"];
  readonly now?: () => Date;
}

/**
 * Position 1 — the next dates of one place, and the empty-state verdict.
 *
 * `publishInvitation` is set when the place resolved **and** the window is
 * empty: TS-WEB-0008 D4's conversion moment, tier 1, no error styling, no retry.
 * A place that does not resolve is a different state entirely and is
 * signalled by `undefined`, not by an empty list.
 */
export async function placeEvents({
  slug,
  window = "upcoming",
  rowCount = 3,
  store,
  now,
}: PlaceEventsInput): Promise<LiveEnvelope<PlaceEvents> | undefined> {
  const place = await resolvePlace(slug);
  if (place === undefined) return undefined;

  const viaApi = hasRealBackend("eventsSearch");
  const viaPublic = hasRealBackend("eventsByCommunityPublic");
  const clock = now ?? (() => new Date());
  const { after, before } = EVENT_WINDOWS[window];

  const fetcher = async (): Promise<PlaceEvents> => {
    const events = viaApi
      ? byStart(
          toLiveEvents(
            (
              await searchEvents(eventsConfig(), {
                communities: [place.communityId],
                after,
                before,
                limit: rowCount,
              })
            ).events,
          ),
        )
      : viaPublic
        ? await publicPlaceEvents(place, { window, rowCount, now: clock() })
        : mockEventsForPlace(place, rowCount, clock());

    return { place, events: events.slice(0, rowCount), publishInvitation: events.length === 0 };
  };

  return resilient(fetcher, {
    key: `dates:${place.communityId}:${window}`,
    kind: "dates",
    tags: [cacheTags.dates(place.communityId)],
    snapshot: () => placeEventsFallback(place),
    store,
    now,
    demo: !viaApi && !viaPublic,
  });
}
