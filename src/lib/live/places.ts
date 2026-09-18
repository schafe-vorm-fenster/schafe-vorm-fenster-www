/**
 * Place search and a place's dates — TS-008 D7 and D3 step 1, D4.
 *
 * The interface module the BFF routes call. It picks a backend per capability
 * (`config.ts`), wraps every upstream call in `resilient()` (TS-009 D4), and
 * returns an envelope — never markup, never a thrown error for an empty
 * result.
 *
 * Each of its three jobs now has an ordered list of sources rather than one
 * source and a mock, so a deployment without read tokens still answers with
 * real places and real dates:
 *
 * | Job | 1st | 2nd | 3rd |
 * | --- | --- | --- | --- |
 * | postcode search | geo-api (token) | — (no public surface carries a ZIP) | mock |
 * | name search | the committed community index | — | mock |
 * | slug → place | geo-api (token) | the committed index | mock |
 * | a place's dates | events-api (token) | the public village-calendar page | mock |
 */

import { searchByZip as realSearchByZip, communityBySlug as realCommunityBySlug } from "@/src/clients/geo-api/client";
import { searchEvents } from "@/src/clients/events-api/client";

import { toLiveEvents, toPlace } from "./adapters";
import { cacheTags } from "./cache-profiles";
import { eventsConfig, geoConfig, hasRealBackend } from "./config";
import { mockEventsForPlace } from "./mocks/events";
import { mockCommunityBySlug, mockSearchByName, mockSearchByZip } from "./mocks/geo";
import { hasPlaceIndex, placeBySlug, searchByName } from "./place-index";
import { publicPlaceEvents } from "./public-source";
import { resilient, type ResilientOptions } from "./resilient";
import { placeEventsFallback } from "./snapshots";
import { byStart, EVENT_WINDOWS, type EventWindow } from "./widening";

import type { LiveEnvelope, Place, PlaceEvents, PlaceSearchResult } from "./types";

/** A German postcode. The only input geo-api resolves that the index cannot. */
const ZIP = /^\d{5}$/;

export function isZip(query: string): boolean {
  return ZIP.test(query.trim());
}

/** How many suggestions the typeahead may show (TS-008 D7's chip row). */
export const MAX_SUGGESTIONS = 6;

export interface PlaceSearchInput {
  readonly query: string;
  readonly store?: ResilientOptions<PlaceSearchResult>["store"];
  readonly now?: () => Date;
}

/**
 * The three outcomes of TS-008 D7 — covered, uncovered, and the interim
 * "typed a name while there is nothing to ask".
 *
 * The third one used to be the normal answer for every typed name, because
 * geo-api has no name search (Q-025). It is now the **exceptional** answer:
 * the committed community index resolves names without a credential, so
 * `unsupported` is reached only where that index did not ship at all.
 */
export async function searchPlaces({ query, store, now }: PlaceSearchInput): Promise<LiveEnvelope<PlaceSearchResult>> {
  const trimmed = query.trim();
  const byZip = isZip(trimmed);
  const capability = byZip ? "placeSearchByZip" : "placeSearchByName";
  const real = hasRealBackend(capability) && (byZip || hasPlaceIndex());

  // A typed name with no index shipped and no mock in play: answer the
  // documented hint rather than nothing (TS-008-A14).
  if (!byZip && !real && hasRealBackend("placeSearchByZip")) {
    return {
      data: { query: trimmed, outcome: { kind: "unsupported", query: trimmed, hint: "zip-only" }, suggestions: [] },
      tier: "live",
      fetchedAt: (now?.() ?? new Date()).toISOString(),
      stale: false,
      demo: false,
      source: "real",
    };
  }

  const fetcher = async (): Promise<PlaceSearchResult> => {
    const places: Place[] = real
      ? byZip
        ? (await realSearchByZip(geoConfig(), trimmed)).map(toPlace)
        : searchByName(trimmed, MAX_SUGGESTIONS)
      : byZip
        ? mockSearchByZip(trimmed)
        : mockSearchByName(trimmed);

    const first = places[0];
    return first
      ? { query: trimmed, outcome: { kind: "covered", place: first }, suggestions: places.slice(0, MAX_SUGGESTIONS) }
      : { query: trimmed, outcome: { kind: "uncovered", query: trimmed }, suggestions: [] };
  };

  return resilient(fetcher, {
    key: `place-search:${trimmed.toLowerCase()}`,
    kind: "activePlaces",
    tags: [cacheTags.places()],
    // No snapshot: a search that cannot run keeps its own inline state
    // (TS-009 D9) rather than answering with an unrelated place.
    snapshot: () => ({ query: trimmed, outcome: { kind: "uncovered", query: trimmed }, suggestions: [] }),
    store,
    now,
    demo: !real,
  });
}

/**
 * Resolves a slug that arrived on `?ort=` — the precondition of the handover
 * (TS-008 D9).
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
  // link (TS-008 D9) — the caller decides, this returns nothing.
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
 * empty: TS-008 D4's conversion moment, tier 1, no error styling, no retry.
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
