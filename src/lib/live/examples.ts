/**
 * The pool a value story picks its live example from — DEC-0152, round 4's
 * F-4-2 and F-4-6, TS-WEB-0020 D3's example ladder.
 *
 * Until 2026-10-07 the stories borrowed what position 1 and the nearby module
 * had left over: twelve dates of one place plus this week's ring, for the
 * showcase village whatever place the reader had searched. A council story
 * then got a women's-sport date because nothing else was left. The pool is
 * now the searched place's whole surroundings for the coming weeks, the same
 * widening the village calendar itself does (`community` → `municipality` →
 * `nearby` → `region`), with each date's distance from the place attached, so
 * the selector can ask for the right category first and the nearest, most
 * informative date second.
 *
 * Three sources, the same order every live module uses: the token API (which
 * also carries an image), the public village-calendar page (text, no image),
 * the demo fixtures.
 */

import { fetchCommunityPage } from "@/src/clients/community-site/client";
import { searchEvents } from "@/src/clients/events-api/client";

import { toLiveEvents, toLiveEventsFromSite } from "./adapters";
import { cacheTags } from "./cache-profiles";
import { communitySiteConfig, eventsConfig, hasRealBackend } from "./config";
import { withDistance } from "./distance";
import { mockEventsForPlace } from "./mocks/events";
import { communityRouteSlugFor } from "./place-index";
import { resolvePlace } from "./places";
import { resilient, type ResilientOptions } from "./resilient";
import { byStart, withinWindow } from "./widening";

import type { LiveEnvelope, LiveEvent, Place } from "./types";

/** Enough to find a date of every category in a quiet month, few enough to stay one request. */
export const EXAMPLE_POOL_LIMIT = 100;

export interface ExamplePool {
  readonly place: Place;
  readonly events: readonly LiveEvent[];
}

export interface ExamplePoolInput {
  readonly slug: string;
  readonly store?: ResilientOptions<ExamplePool>["store"];
  readonly now?: () => Date;
}

export async function exampleEvents({
  slug,
  store,
  now,
}: ExamplePoolInput): Promise<LiveEnvelope<ExamplePool> | undefined> {
  const place = await resolvePlace(slug);
  if (place === undefined) return undefined;

  const viaApi = hasRealBackend("eventsSearch");
  const viaPublic = hasRealBackend("eventsByCommunityPublic");
  const clock = now ?? (() => new Date());

  const fetcher = async (): Promise<ExamplePool> => {
    let events: LiveEvent[];
    if (viaApi) {
      const county = place.county?.id;
      const { events: upstream } = await searchEvents(eventsConfig(), {
        ...(county === undefined ? { communities: [place.communityId] } : { counties: [county] }),
        after: "now",
        limit: EXAMPLE_POOL_LIMIT,
      });
      events = toLiveEvents(upstream);
    } else if (viaPublic) {
      const { events: served } = await fetchCommunityPage(communitySiteConfig(), communityRouteSlugFor(place));
      events = withinWindow(toLiveEventsFromSite(served), "upcoming", clock());
    } else {
      events = mockEventsForPlace(place, 12, clock());
    }
    return { place, events: withDistance(byStart(events), place) };
  };

  return resilient(fetcher, {
    key: `examples:${place.communityId}`,
    kind: "dates",
    tags: [cacheTags.dates(place.communityId)],
    snapshot: () => ({ place, events: [] }),
    store,
    now,
    demo: !viaApi && !viaPublic,
  });
}
