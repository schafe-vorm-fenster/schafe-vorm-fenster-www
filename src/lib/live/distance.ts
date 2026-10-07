/**
 * How far a date is from the place the reader asked about — TS-WEB-0020-A15,
 * round 4's F-4-7 ("Rubkow, 10 Minuten von Schlatkow entfernt").
 *
 * The nearby ring is already cut by `haversineKm` against the committed
 * index; the figure was computed and thrown away. This keeps it: a date's
 * community is looked up in the same index and measured from the anchor, so a
 * row can say "Rubkow · 6 km" instead of only "Rubkow". Straight-line
 * kilometres, not driving minutes — the index has no road network, and a
 * number that only looks precise would be worse than an honest one.
 */

import { placeByCommunityId } from "./place-index";
import { haversineKm } from "./widening";

import type { LiveEvent } from "./types";

export function withDistance<T extends LiveEvent>(
  events: readonly T[],
  anchor: { readonly lat: number; readonly lng: number },
): T[] {
  return events.map((event) => {
    if (event.communityId === undefined) return event;
    const place = placeByCommunityId(event.communityId);
    if (place === undefined) return event;
    return { ...event, distanceKm: haversineKm(anchor, place) };
  });
}

/** "6 km", never "0 km": a date in the next village is at least a kilometre away. */
export function formatDistance(km: number): string {
  return `${Math.max(1, Math.round(km))} km`;
}
