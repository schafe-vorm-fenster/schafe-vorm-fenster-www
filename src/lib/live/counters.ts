/**
 * Position 4 — the live counters, WEB-F-041 / TS-008 D8 / TS-009 D6.
 *
 * "Counted live or not shown." Three rules make that true rather than said:
 *
 *  1. **Only figures that were counted.** `/api/stats` carries `totalEvents`
 *     and nothing else the band needs — no places count, no updates-today
 *     count (Q-037, `state/open.md` row 6). A figure with no field stays
 *     `undefined`; `live-counters` then renders one fewer slot. No estimate,
 *     no substitute, no static traction number anywhere.
 *  2. **Two tiers, never three.** Beyond the serve-stale window the module is
 *     **removed from the page** (TS-009 D6). `liveCounters()` answers
 *     `undefined` for exactly that case — there is no snapshot file and no
 *     branch that could produce one.
 *  3. **The band may be part real and part demo.** `/api/stats` is the one
 *     tokenless ecosystem operation, so `dates` is live even in an
 *     environment with no credentials, while the other two figures come from
 *     the mock and carry `demo: true` with them.
 */

import { fetchStats } from "@/src/clients/events-api/client";

import { cacheTags } from "./cache-profiles";
import { eventsApi, timeoutMs, hasRealBackend } from "./config";
import { mockCounterFigures } from "./mocks/events";
import { NoFallbackError, resilient, type ResilientOptions } from "./resilient";

import type { LiveCounters, LiveEnvelope } from "./types";

export interface CountersInput {
  readonly store?: ResilientOptions<LiveCounters>["store"];
  readonly now?: () => Date;
}

/**
 * `undefined` means: remove the counter band from the page. It is the
 * documented tier-2-expired branch of TS-009 D6, not an error.
 */
export async function liveCounters({ store, now }: CountersInput = {}): Promise<
  LiveEnvelope<LiveCounters> | undefined
> {
  const realDates = hasRealBackend("statsTotalEvents");
  const realPlaces = hasRealBackend("statsPlacesCount");
  const realUpdates = hasRealBackend("statsUpdatesToday");

  const fetcher = async (): Promise<LiveCounters> => {
    const mocked = mockCounterFigures();
    const dates = realDates
      ? (await fetchStats({ host: eventsApi().host, timeoutMs: timeoutMs() })).totalEvents
      : mocked.dates;

    return {
      ...(dates === undefined ? {} : { dates }),
      ...(realPlaces ? {} : { places: mocked.places }),
      ...(realUpdates ? {} : { updatesToday: mocked.updatesToday }),
    };
  };

  try {
    return await resilient(fetcher, {
      key: "stats",
      kind: "counters",
      tags: [cacheTags.stats()],
      // No `snapshot` — tier 3 must be unreachable for the counters (D6).
      store,
      now,
      demo: !realDates || !realPlaces || !realUpdates,
    });
  } catch (error) {
    if (error instanceof NoFallbackError) return undefined;
    throw error;
  }
}
