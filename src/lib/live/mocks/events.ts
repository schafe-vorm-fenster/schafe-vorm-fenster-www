/**
 * The mock events backend — `state/open.md` rows 5 and 6 (`Mock aktiv`).
 *
 * The events search itself exists upstream and is token-scoped; this mock
 * answers while no read token is provisioned. The **county activity ranking**
 * behind `/api/region/{county}/examples` has no upstream operation at all
 * (TS-008 open points, Q-015 residue), so that one is a mock by necessity and
 * not by environment.
 */

import { DEMO_PLACES, demoEvents, DEMO_COUNTER_FIGURES } from "./fixtures";

import type { LiveEvent, LiveCounters, Place, RegionExamples } from "../types";

export function mockEventsForPlace(place: Place, count: number, now: Date): LiveEvent[] {
  return demoEvents(place, count, now);
}

export function mockEventsForPlaces(places: readonly Place[], count: number, now: Date): LiveEvent[] {
  return places
    .flatMap((place) => demoEvents(place, 2, now))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, count);
}

/**
 * Active example places in a county — a *designed set*, never a place list
 * and never an "alle Orte anzeigen" control (DEC-034).
 */
export function mockRegionExamples(county: string, max: number, now: Date): RegionExamples {
  const examples = DEMO_PLACES.filter((place) => demoEvents(place, 3, now).length > 0)
    .slice(0, max)
    .map((place) => ({
      name: place.name,
      slug: place.slug,
      eventCount: demoEvents(place, 3, now).length,
    }));
  return { county, examples };
}

/**
 * The figures the mock backend supplies. `dates` is only read when the events
 * backend itself is mocked — in the default mode the real, tokenless
 * `/api/stats` answers it, so the band is part real and part demo, which is
 * exactly what Q-037 leaves us with.
 */
export function mockCounterFigures(): Required<LiveCounters> {
  return { ...DEMO_COUNTER_FIGURES };
}
