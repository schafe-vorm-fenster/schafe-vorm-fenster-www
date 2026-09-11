/**
 * Position 3 — active example places in a county, TS-008 D3 step 3, DEC-034.
 *
 * A **designed set**, never a place list and never an "alle Orte anzeigen"
 * control. The activity ranking this module needs has no upstream operation
 * (TS-008's open points, Q-015 residue), so the ranking half is mocked by
 * necessity rather than by environment — `state/open.md` row 6.
 */

import { searchEvents } from "@/src/clients/events-api/client";

import { cacheTags } from "./cache-profiles";
import { eventsConfig, hasRealBackend } from "./config";
import { mockRegionExamples } from "./mocks/events";
import { resilient, type ResilientOptions } from "./resilient";
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
  const realRanking = hasRealBackend("countyActivityRanking");
  const realEvents = hasRealBackend("eventsSearch");
  const clock = now ?? (() => new Date());

  const fetcher = async (): Promise<RegionExamples> => {
    if (!realRanking || !realEvents) return mockRegionExamples(county, max, clock());

    // Until the activity signal exists upstream, the ranking is derived from
    // the county's own event list: places with the most dates in the window.
    const events = await searchEvents(eventsConfig(), {
      counties: [county],
      after: EVENT_WINDOWS.week.after,
    });

    const byPlace = new Map<string, { name: string; slug: string; eventCount: number }>();
    for (const event of events) {
      const slug = event["community.slug"];
      const name = event["community.name"];
      if (!slug || !name) continue;
      const entry = byPlace.get(slug) ?? { name, slug, eventCount: 0 };
      byPlace.set(slug, { ...entry, eventCount: entry.eventCount + 1 });
    }

    const examples = [...byPlace.values()]
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, max);

    return { county, examples };
  };

  return resilient(fetcher, {
    key: `region-examples:${county}:${max}`,
    kind: "activePlaces",
    tags: [cacheTags.placesInCounty(county)],
    snapshot: () => regionExamplesFallback(county),
    store,
    now,
    demo: !realRanking || !realEvents,
  });
}
