/**
 * Position 2 — "this week nearby", TS-008 D3 step 2.
 *
 * The one module whose radius is an **approximation, and the approximation is
 * ours**: geo-api's proximity search runs against a server-side 20 km
 * constant and caps the result count (TS-008 D2.2), so the ~15 km cut happens
 * here, on the positions the response carries, and a truncated candidate set
 * is reported as `truncated` so the module claims no completeness.
 */

import { searchByPoint } from "@/src/clients/geo-api/client";
import { searchEvents } from "@/src/clients/events-api/client";

import { toLiveEvents, toPlace } from "./adapters";
import { cacheTags } from "./cache-profiles";
import { eventsConfig, geoConfig, hasRealBackend } from "./config";
import { mockEventsForPlaces } from "./mocks/events";
import { mockSearchByPoint } from "./mocks/geo";
import { resilient, type ResilientOptions } from "./resilient";
import { nearbyFallback } from "./snapshots";
import { EVENT_WINDOWS, NEARBY_RADIUS_KM, selectNearby } from "./widening";

import type { LiveEnvelope, NearbyEvents, Place } from "./types";

/** geo-api's own default for a proximity search; we ask for it explicitly so the cap is visible. */
export const GEO_MAX_RESULTS = 10;

export interface NearbyInput {
  readonly lat: number;
  readonly lng: number;
  readonly radiusKm?: number;
  readonly rowCount?: number;
  readonly store?: ResilientOptions<NearbyEvents>["store"];
  readonly now?: () => Date;
}

export async function nearbyEvents({
  lat,
  lng,
  radiusKm = NEARBY_RADIUS_KM,
  rowCount = 5,
  store,
  now,
}: NearbyInput): Promise<LiveEnvelope<NearbyEvents>> {
  const realGeo = hasRealBackend("placesNearPoint");
  const realEvents = hasRealBackend("eventsSearch");
  const clock = now ?? (() => new Date());
  const anchor = { lat, lng };

  const fetcher = async (): Promise<NearbyEvents> => {
    const candidates: Place[] = realGeo
      ? (await searchByPoint(geoConfig(), anchor, GEO_MAX_RESULTS)).map(toPlace)
      : mockSearchByPoint(anchor, GEO_MAX_RESULTS);

    const { places, truncated } = selectNearby(anchor, candidates, {
      radiusKm,
      maxResults: GEO_MAX_RESULTS,
    });

    if (places.length === 0) return { events: [], radiusKm, truncated };

    const events = realEvents
      ? toLiveEvents(
          await searchEvents(eventsConfig(), {
            communities: places.map((place) => place.communityId),
            after: EVENT_WINDOWS.week.after,
            before: EVENT_WINDOWS.week.before,
          }),
        ).slice(0, rowCount)
      : mockEventsForPlaces(places, rowCount, clock());

    return { events, radiusKm, truncated };
  };

  return resilient(fetcher, {
    // The key is the rounded anchor, not the exact coordinate: a cache key
    // carries a segment, never something traceable to a visitor (TS-013 D6).
    key: `nearby:${lat.toFixed(2)}:${lng.toFixed(2)}:${radiusKm}`,
    kind: "dates",
    tags: [cacheTags.places()],
    snapshot: () => nearbyFallback(radiusKm),
    store,
    now,
    demo: !realGeo || !realEvents,
  });
}
