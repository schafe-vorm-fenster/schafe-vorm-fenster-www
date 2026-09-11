/**
 * Upstream shape → the website's shape. One place, so a dotted upstream key
 * never reaches a component and an upstream rename is one diff.
 */

import type { GeoCommunity } from "@/src/clients/geo-api/client";
import type { UpstreamEvent } from "@/src/clients/events-api/client";
import type { LiveEvent, Place } from "./types";

/** events-api carries `start` as a number; seconds and milliseconds both occur. */
export function epochToIso(value: number | undefined): string | undefined {
  if (value === undefined || !Number.isFinite(value)) return undefined;
  const ms = value < 1e12 ? value * 1000 : value;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function toPlace(community: GeoCommunity): Place {
  return {
    communityId: `geoname.${community.geonameId}`,
    name: community.name,
    slug: community.slug,
    lat: community.geo.point.lat,
    lng: community.geo.point.lng,
    county: community.hierarchy?.county
      ? {
          id:
            community.hierarchy.county.geonameId == null
              ? undefined
              : `geoname.${community.hierarchy.county.geonameId}`,
          name: community.hierarchy.county.name ?? undefined,
        }
      : undefined,
  };
}

/** An event without a usable start is dropped — a row with no date cannot render. */
export function toLiveEvent(event: UpstreamEvent): LiveEvent | undefined {
  const startsAt = epochToIso(event.start);
  if (startsAt === undefined) return undefined;
  return {
    id: event.id,
    title: event.summary,
    startsAt,
    placeName: event["community.name"] ?? event["location.name"],
    categoryId: event.categories[0],
  };
}

export function toLiveEvents(events: readonly UpstreamEvent[]): LiveEvent[] {
  return events.flatMap((event) => {
    const mapped = toLiveEvent(event);
    return mapped ? [mapped] : [];
  });
}
