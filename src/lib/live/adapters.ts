/**
 * Upstream shape → the website's shape. One place, so a dotted upstream key
 * never reaches a component and an upstream rename is one diff.
 */

import type { GeoCommunity } from "@/src/clients/geo-api/client";
import type { UpstreamEvent } from "@/src/clients/events-api/client";
import type {
  CommunitySiteCommunity,
  CommunitySiteEvent,
} from "@/src/clients/community-site/client";
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
    ...(community.hierarchy?.municipality?.name ? { municipality: community.hierarchy.municipality.name } : {}),
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

/**
 * An event without a usable start is dropped — a row with no date cannot
 * render. So is one without an id: `id` is optional in the upstream contract,
 * and a React list keyed on `undefined` is a rendering bug waiting for the
 * second such row.
 */
export function toLiveEvent(event: UpstreamEvent): LiveEvent | undefined {
  const startsAt = epochToIso(event.start);
  if (startsAt === undefined || event.id === undefined) return undefined;
  return {
    id: event.id,
    title: event.summary,
    startsAt,
    placeName: event["community.name"] ?? event["location.localname"] ?? event["location.name"],
    categoryId: event.categories[0],
  };
}

export function toLiveEvents(events: readonly UpstreamEvent[]): LiveEvent[] {
  return events.flatMap((event) => {
    const mapped = toLiveEvent(event);
    return mapped ? [mapped] : [];
  });
}

/* ------------------------------------------------------------------ */
/* The public village-calendar site's shapes                           */
/* ------------------------------------------------------------------ */

/**
 * The site has already done the work the two API clients leave to us — it
 * localized the event, resolved the place name and turned the epoch into an
 * ISO string — so this mapping is a rename, not a conversion. The one thing
 * it still checks is that the date parses: a row with an unreadable date
 * cannot render, whichever source produced it.
 */
export function toLiveEventFromSite(event: CommunitySiteEvent): LiveEvent | undefined {
  const startsAt = new Date(event.start);
  if (Number.isNaN(startsAt.getTime())) return undefined;
  return {
    id: event._id,
    title: event.summary,
    startsAt: startsAt.toISOString(),
    placeName: event.community?.name ?? event.placeName ?? event.location,
    categoryId: event.categories[0],
  };
}

export function toLiveEventsFromSite(events: readonly CommunitySiteEvent[]): LiveEvent[] {
  return events.flatMap((event) => {
    const mapped = toLiveEventFromSite(event);
    return mapped ? [mapped] : [];
  });
}

/**
 * A community as the public site carries it. It has no hierarchy block, so a
 * place built from it has **no county** — the caller supplies the county it
 * already knows (the configured showcase county, or the one geo-api gave it).
 */
export function toPlaceFromSite(community: CommunitySiteCommunity): Place | undefined {
  const point = community.geoLocation?.point;
  const geonameId = community.geoLocation?.identifiers.geonamesId;
  if (point === undefined || geonameId === undefined || community.slug.trim() === "") return undefined;
  return {
    communityId: `geoname.${geonameId}`,
    name: community.name,
    slug: community.slug,
    lat: point.lat,
    lng: point.lng,
  };
}
