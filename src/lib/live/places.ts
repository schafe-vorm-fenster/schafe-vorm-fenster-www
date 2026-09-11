/**
 * Place search and a place's dates — TS-008 D7 and D3 step 1, D4.
 *
 * The interface module the BFF routes call. It picks the real geo-api client
 * or the mock per capability (`config.ts`), wraps every upstream call in
 * `resilient()` (TS-009 D4), and returns an envelope — never markup, never a
 * thrown error for an empty result.
 */

import { searchByZip as realSearchByZip, communityBySlug as realCommunityBySlug } from "@/src/clients/geo-api/client";
import { searchEvents } from "@/src/clients/events-api/client";

import { toLiveEvents, toPlace } from "./adapters";
import { cacheTags } from "./cache-profiles";
import { eventsConfig, geoConfig, hasRealBackend } from "./config";
import { mockEventsForPlace } from "./mocks/events";
import { mockCommunityBySlug, mockSearchByName, mockSearchByZip } from "./mocks/geo";
import { resilient, type ResilientOptions } from "./resilient";
import { placeEventsFallback } from "./snapshots";
import { EVENT_WINDOWS, type EventWindow } from "./widening";

import type { LiveEnvelope, Place, PlaceEvents, PlaceSearchResult } from "./types";

/** A German postcode. The only input geo-api can resolve today (Q-025). */
const ZIP = /^\d{5}$/;

export function isZip(query: string): boolean {
  return ZIP.test(query.trim());
}

export interface PlaceSearchInput {
  readonly query: string;
  readonly store?: ResilientOptions<PlaceSearchResult>["store"];
  readonly now?: () => Date;
}

/**
 * The three outcomes of TS-008 D7 — covered, uncovered, and the interim
 * "typed a name while Q-025 is open". The third is **not** an empty answer:
 * a silent empty state would read as "your place is not in the system", which
 * is the one thing it does not mean.
 */
export async function searchPlaces({ query, store, now }: PlaceSearchInput): Promise<LiveEnvelope<PlaceSearchResult>> {
  const trimmed = query.trim();
  const byZip = isZip(trimmed);
  const capability = byZip ? "placeSearchByZip" : "placeSearchByName";
  const real = hasRealBackend(capability);

  // A typed name, no name search upstream, and no mock backend in play:
  // answer the documented hint rather than nothing (TS-008-A14).
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
      ? (await realSearchByZip(geoConfig(), trimmed)).map(toPlace)
      : byZip
        ? mockSearchByZip(trimmed)
        : mockSearchByName(trimmed);

    const first = places[0];
    return first
      ? { query: trimmed, outcome: { kind: "covered", place: first }, suggestions: places.slice(0, 6) }
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

/** Resolves a slug that arrived on `?ort=` — the precondition of the handover (TS-008 D9). */
export async function resolvePlace(slug: string): Promise<Place | undefined> {
  const real = hasRealBackend("communityBySlug");
  try {
    if (!real) return mockCommunityBySlug(slug);
    const community = await realCommunityBySlug(geoConfig(), slug);
    return community ? toPlace(community) : undefined;
  } catch {
    // An unresolvable slug leads to the founding route, never to a broken
    // app link (TS-008 D9) — the caller decides, this returns nothing.
    return mockCommunityBySlug(slug);
  }
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
 * `publishInvitation` is set when geo-api resolved the place **and** the
 * window is empty: TS-008 D4's conversion moment, tier 1, no error styling,
 * no retry. A place that does not resolve is a different state entirely and
 * is signalled by `undefined`, not by an empty list.
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

  const real = hasRealBackend("eventsSearch");
  const clock = now ?? (() => new Date());
  const { after, before } = EVENT_WINDOWS[window];

  const fetcher = async (): Promise<PlaceEvents> => {
    const events = real
      ? toLiveEvents(
          await searchEvents(eventsConfig(), { communities: [place.communityId], after, before }),
        ).slice(0, rowCount)
      : mockEventsForPlace(place, rowCount, clock());
    return { place, events, publishInvitation: events.length === 0 };
  };

  return resilient(fetcher, {
    key: `dates:${place.communityId}:${window}`,
    kind: "dates",
    tags: [cacheTags.dates(place.communityId)],
    snapshot: () => placeEventsFallback(place),
    store,
    now,
    demo: !real,
  });
}
