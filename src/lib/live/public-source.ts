/**
 * The tokenless tier-1 source, in the live layer's own vocabulary.
 *
 * `src/clients/community-site/client.ts` reads the public village-calendar
 * site; this module turns what it reads into `Place`s and `LiveEvent`s and
 * answers exactly the three questions the interface modules ask it. It exists
 * so `places.ts`, `nearby.ts` and `region.ts` each gain **one more source**
 * rather than a second shape to understand.
 *
 * Why there is a second source at all: every data operation of geo-api and
 * events-api is path-scoped (`/api/{token}/…`) and this environment has no
 * read token (state/open.md row 77). Before this module that meant every
 * list on every page was demo data. The village calendar in front of those
 * services is public, carries the same dates and the same geo-api slugs, and
 * needs no credential — so the order each module now follows is:
 *
 *   token-scoped API  →  this (public, tokenless)  →  mock
 *
 * and a deployment with no secrets at all still shows real dates.
 *
 * What it cannot do, and does not pretend to:
 *
 *  - **no postcode lookup.** The public surfaces carry no ZIP, so ZIP search
 *    stays geo-api's and stays token-gated.
 *  - **no county filter.** A community page answers for one community and
 *    its surroundings, so the county activity ranking is approximated from
 *    the county's showcase community rather than queried — `region.ts` says
 *    so where it uses it.
 *  - **no hierarchy.** A place built here has no county; the caller supplies
 *    the county it already knows.
 */

import { fetchCommunityPage } from "@/src/clients/community-site/client";

import { toLiveEventsFromSite } from "./adapters";
import { communitySiteConfig } from "./config";
import {
  communityRouteSlugFor,
  nearestPlace,
  placeByCommunityId,
  placesWithin,
} from "./place-index";
import { byStart, withinWindow, type EventWindow } from "./widening";

import type { LiveEvent, Place } from "./types";

/**
 * The scopes the village calendar tags its rows with. `community` and
 * `municipality` are "in this place"; `nearby` (~5–7 km) and `region`
 * (~20–30 km) are the widening it already did for us.
 */
const OWN_SCOPES = new Set(["community", "municipality"]);

/**
 * Position 1's rows for one place — its own dates, in its own window.
 *
 * The page carries the widened rows too, so they are filtered out here:
 * TS-008 D1 forbids a module presenting a widened list as the narrow one,
 * and the empty result is not a failure but the conversion moment of D4.
 */
export async function publicPlaceEvents(
  place: Place,
  { window, rowCount, now }: { window: EventWindow; rowCount: number; now: Date },
): Promise<LiveEvent[]> {
  const { events } = await fetchCommunityPage(communitySiteConfig(), communityRouteSlugFor(place));

  const own = events.filter((event) => {
    const byId = event.community?._id === place.communityId;
    return byId || (event.community?._id === undefined && OWN_SCOPES.has(event.scope ?? ""));
  });

  return byStart(withinWindow(toLiveEventsFromSite(own), window, now)).slice(0, rowCount);
}

export interface PublicNearby {
  readonly events: readonly LiveEvent[];
  readonly places: readonly Place[];
  /** The source page's own row cap ended the list, not the radius. */
  readonly truncated: boolean;
}

/**
 * The village calendar caps one community page at 100 rows; a page that long
 * may have had more behind it, and the module then claims no completeness
 * (TS-008 D3 rule 2).
 */
export const PUBLIC_PAGE_ROW_CAP = 100;

/**
 * Position 2 — this week within the ~15 km cut, from the public surfaces.
 *
 * One page fetch. The **cut is exact and local**: the committed index holds
 * every covered community's own coordinate, so which places are inside the
 * radius is arithmetic rather than a proximity query — which matters, because
 * every proximity source available here caps its result count (geo-api's own
 * constant, the calendar's public proxy at five) and a cap truncates a radius
 * silently.
 *
 * The anchor's own community is excluded: position 1 already showed those
 * dates, and a widened module repeating the narrow one beside it is not a
 * widening (TS-008 D1).
 */
export async function publicNearbyEvents(
  anchor: { readonly lat: number; readonly lng: number },
  { radiusKm, rowCount, now }: { radiusKm: number; rowCount: number; now: Date },
): Promise<PublicNearby> {
  const seed = nearestPlace(anchor);
  if (seed === undefined) return { events: [], places: [], truncated: false };

  const ring = placesWithin(anchor, radiusKm).filter(
    (place) => place.communityId !== seed.communityId,
  );
  if (ring.length === 0) return { events: [], places: [], truncated: false };

  const { events } = await fetchCommunityPage(communitySiteConfig(), communityRouteSlugFor(seed));
  const ids = new Set(ring.map((place) => place.communityId));

  const rows = toLiveEventsFromSite(
    events.filter((event) => {
      const id = event.community?._id;
      return id === undefined ? false : ids.has(id);
    }),
  );

  return {
    events: byStart(withinWindow(rows, "week", now)).slice(0, rowCount),
    places: ring,
    truncated: events.length >= PUBLIC_PAGE_ROW_CAP,
  };
}

export interface RankedPlace {
  readonly name: string;
  readonly slug: string;
  readonly eventCount: number;
}

/**
 * Position 3's ranking, approximated.
 *
 * There is no activity-ranking operation anywhere (Q-015 residue,
 * state/open.md row 6), so this counts the dates the **seed community's own
 * region feed** carries per place — the same ~20–30 km the village calendar
 * itself calls a region. It is an approximation of a county, not a county
 * query, and `region.ts` is where that is said out loud.
 *
 * The seed's own community is excluded: "active places around here" that
 * leads with the place you are already standing in is not an example set.
 */
export async function publicRegionRanking(
  seed: Place,
  { max, now }: { max: number; now: Date },
): Promise<RankedPlace[]> {
  const { events } = await fetchCommunityPage(communitySiteConfig(), communityRouteSlugFor(seed));

  const counts = new Map<string, number>();
  for (const event of events) {
    const id = event.community?._id;
    if (id === undefined || id === seed.communityId) continue;
    const starts = new Date(event.start);
    if (Number.isNaN(starts.getTime()) || starts < now) continue;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  return [...counts.entries()]
    .flatMap(([communityId, eventCount]) => {
      // A slug is what the example links with, and only the committed index
      // has one for an id — the events themselves never carry it.
      const place = placeByCommunityId(communityId);
      return place ? [{ name: place.name, slug: place.slug, eventCount }] : [];
    })
    .sort((a, b) => b.eventCount - a.eventCount || a.name.localeCompare(b.name, "de"))
    .slice(0, max);
}
