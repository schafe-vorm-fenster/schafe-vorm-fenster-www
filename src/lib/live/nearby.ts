/**
 * Position 2 — "this week nearby", TS-WEB-0008 D3 step 2.
 *
 * The one module whose radius is an **approximation, and the approximation is
 * ours**: geo-api's proximity search runs against a server-side 20 km
 * constant and caps the result count (TS-WEB-0008 D2.2), so the ~15 km cut happens
 * here, on the positions the response carries, and a truncated candidate set
 * is reported as `truncated` so the module claims no completeness.
 */

import { searchEventsByScope } from "@/src/clients/events-api/client";

import { toLiveEvents, toPlace } from "./adapters";
import { withDistance } from "./distance";
import { cacheTags } from "./cache-profiles";
import { eventsConfig, hasRealBackend } from "./config";
import { pointSegment, quantisePoint, type GeoLookupOptions } from "./geo-lookup";
import { mockEventsForPlaces } from "./mocks/events";
import { mockSearchByPoint } from "./mocks/geo";
import { nearestPlace } from "./place-index";
import { publicNearbyEvents } from "./public-source";
import { resilient, type ResilientOptions } from "./resilient";
import { nearbyFallback } from "./snapshots";
import { pickVariedWeek, WIDENED_DAYS } from "./varied-week";
import { haversineKm, NEARBY_RADIUS_KM, nearbyWindow, selectNearby } from "./widening";

import type { LiveEnvelope, LiveEvent, NearbyEvents, Place } from "./types";

/** geo-api's own default for a proximity search; we ask for it explicitly so the cap is visible. */
export const GEO_MAX_RESULTS = 10;

export interface NearbyInput {
  readonly lat: number;
  readonly lng: number;
  readonly radiusKm?: number;
  readonly rowCount?: number;
  readonly store?: ResilientOptions<NearbyEvents>["store"];
  /** The geo lookup's own cache (DEC-0181) — tests hand in `memoryStore()`. */
  readonly geoStore?: GeoLookupOptions["store"];
  readonly now?: () => Date;
}

export async function nearbyEvents({
  lat,
  lng,
  radiusKm = NEARBY_RADIUS_KM,
  rowCount = 5,
  store,
  geoStore,
  now,
}: NearbyInput): Promise<LiveEnvelope<NearbyEvents>> {
  const realGeo = hasRealBackend("placesNearPoint");
  const realEvents = hasRealBackend("eventsSearch");
  // The public path: the committed index cuts the radius, the village
  // calendar's community page carries the dates. Both halves real, so the
  // module is either entirely real or entirely demo — never half of each.
  const viaPublic = hasRealBackend("placesNearPointIndex") && hasRealBackend("eventsByCommunityPublic");
  const clock = now ?? (() => new Date());
  const anchor = { lat, lng };

  const fetcher = async (): Promise<NearbyEvents> => {
    if (!realGeo || !realEvents) {
      if (viaPublic) {
        const { events, truncated } = await publicNearbyEvents(anchor, {
          radiusKm,
          rowCount,
          now: clock(),
        });
        return { events, radiusKm, truncated, window: nearbyWindow(events, clock()) };
      }
      const places = mockSearchByPoint(anchor, GEO_MAX_RESULTS);
      const selection = selectNearby(anchor, places, { radiusKm, maxResults: GEO_MAX_RESULTS });
      const events =
        selection.places.length === 0 ? [] : mockNearbyRows(selection.places, anchor, rowCount, clock());
      return {
        events,
        radiusKm,
        truncated: selection.truncated,
        window: nearbyWindow(events, clock()),
      };
    }

    // The place's neighbours are the events-api's business now: its `region`
    // scope is 20 km around the community (DEC-0185), so no ring is computed
    // here and geo-api is not asked. The committed place index only names the
    // community the anchor sits in.
    const seed = nearestPlace(anchor);
    if (seed === undefined) return { events: [], radiusKm, truncated: false, window: "week" };

    // The fortnight in one call; the selection takes the week out of it and
    // widens only where the week does not make five rows (DEC-0185 §2).
    const now = clock();
    const { events, total } = await searchEventsByScope(eventsConfig(), {
      community: seed.communityId,
      scope: "region",
      after: now.toISOString(),
      before: new Date(now.getTime() + WIDENED_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    });

    // The anchor's own community is position 1's, not a widening of it.
    const candidates = withDistance(
      toLiveEvents(events).filter((event) => event.communityId !== seed.communityId),
      anchor,
    );
    const picked = pickVariedWeek(candidates, now, rowCount);
    return { events: picked.events, radiusKm, truncated: total > events.length, window: picked.window };
  };

  return resilient(fetcher, {
    // The key is the rounded anchor, not the exact coordinate: a cache key
    // carries a segment, never something traceable to a visitor (TS-WEB-0013 D6).
    key: `nearby:${pointSegment(quantisePoint(anchor))}:${radiusKm}`,
    kind: "dates",
    tags: [cacheTags.places()],
    snapshot: () => nearbyFallback(radiusKm, clock()),
    store,
    now,
    demo: (!realGeo || !realEvents) && !viaPublic,
  });
}

/**
 * The demo ring, shaped like the real one: the anchor's own village is not
 * "nearby" (the public path drops the seed community too), and every row
 * carries its distance, measured from the demo place's own coordinate because
 * demo ids are not in the committed index (TS-WEB-0020-A15).
 */
function mockNearbyRows(
  places: readonly Place[],
  anchor: { readonly lat: number; readonly lng: number },
  rowCount: number,
  now: Date,
): LiveEvent[] {
  const ring = places
    .map((place) => ({ place, km: haversineKm(anchor, place) }))
    .filter(({ km }) => km >= 0.5);
  const distance = new Map(ring.map(({ place, km }) => [place.communityId, km]));
  return mockEventsForPlaces(
    ring.map(({ place }) => place),
    rowCount,
    now,
  ).map((event) => {
    const km = event.communityId === undefined ? undefined : distance.get(event.communityId);
    return km === undefined ? event : { ...event, distanceKm: km };
  });
}
