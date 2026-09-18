/**
 * Position 3 — active example places in a county, TS-008 D3 step 3, DEC-034.
 *
 * A **designed set**, never a place list and never an "alle Orte anzeigen"
 * control. The activity ranking this module needs has no upstream operation
 * anywhere (TS-008's open points, Q-015 residue, `state/open.md` row 6), so
 * every source below is a ranking this website derives itself. What changed
 * on 2026-09-18 is *what it derives it from*:
 *
 * | Source | Ranking |
 * | --- | --- |
 * | events-api (token) | the county's own event list, counted per community |
 * | the public village-calendar page | the **county's showcase community's region feed**, counted per community — an approximation of a county, and it says so |
 * | mock | the demo ring |
 *
 * The middle row is an approximation on purpose: the public surface answers
 * for a community and its ~20–30 km surroundings, not for a county. It is a
 * better answer than demo data and a worse one than a county query, and the
 * open row stays open until events-api has the operation.
 *
 * An events-api event carries `community.id` and `community.name` but **no
 * slug**, so both real rankings resolve the slug through the committed
 * community index — before that, this module produced no examples at all
 * from real data, because it read a `community.slug` field that does not
 * exist.
 */

import { searchEvents } from "@/src/clients/events-api/client";

import { cacheTags } from "./cache-profiles";
import { eventsConfig, hasRealBackend } from "./config";
import { mockRegionExamples } from "./mocks/events";
import { placeByCommunityId } from "./place-index";
import { publicRegionRanking } from "./public-source";
import { resilient, type ResilientOptions } from "./resilient";
import { SHOWCASE_COMMUNITY, SHOWCASE_COUNTY } from "./showcase";
import { regionExamplesFallback } from "./snapshots";
import { EVENT_WINDOWS } from "./widening";

import type { LiveEnvelope, RegionExamples } from "./types";

/** DEC-034 caps the set at six on `/deine-region`, one on `/dein-ort/starten`. */
export const REGION_EXAMPLE_MAX = 6;

export interface RegionExamplesInput {
  readonly county: string;
  readonly max?: number;
  readonly store?: ResilientOptions<RegionExamples>["store"];
  readonly now?: () => Date;
}

export async function regionExamples({
  county,
  max = REGION_EXAMPLE_MAX,
  store,
  now,
}: RegionExamplesInput): Promise<LiveEnvelope<RegionExamples>> {
  const realEvents = hasRealBackend("eventsSearch");
  const viaPublic = hasRealBackend("eventsByCommunityPublic");
  const clock = now ?? (() => new Date());

  const fetcher = async (): Promise<RegionExamples> => {
    if (realEvents) {
      // Until the activity signal exists upstream, the ranking is derived
      // from the county's own event list: places with the most dates in the
      // window. A limit well above `max` on purpose — the ranking counts
      // across the county before it cuts.
      const { events } = await searchEvents(eventsConfig(), {
        counties: [county],
        after: EVENT_WINDOWS.week.after,
        limit: 200,
      });

      const counts = new Map<string, number>();
      for (const event of events) {
        const id = event["community.id"];
        if (!id) continue;
        counts.set(id, (counts.get(id) ?? 0) + 1);
      }

      const examples = [...counts.entries()]
        .flatMap(([communityId, eventCount]) => {
          const place = placeByCommunityId(communityId);
          return place ? [{ name: place.name, slug: place.slug, eventCount }] : [];
        })
        .sort((a, b) => b.eventCount - a.eventCount || a.name.localeCompare(b.name, "de"))
        .slice(0, max);

      if (examples.length > 0) return { county, examples };
    }

    if (viaPublic) {
      // The seed is the county's showcase community. One county is configured
      // today; another county's request falls back to the same seed rather
      // than to demo data, which is honest about being a regional example set
      // and never about being that county's own ranking.
      const examples = await publicRegionRanking(SHOWCASE_COMMUNITY, { max, now: clock() });
      if (examples.length > 0) {
        return { county: county === SHOWCASE_COUNTY.id ? county : SHOWCASE_COUNTY.id, examples };
      }
    }

    return mockRegionExamples(county, max, clock());
  };

  return resilient(fetcher, {
    key: `region-examples:${county}:${max}`,
    kind: "activePlaces",
    tags: [cacheTags.placesInCounty(county)],
    snapshot: () => regionExamplesFallback(county),
    store,
    now,
    demo: !realEvents && !viaPublic,
  });
}
