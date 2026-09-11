import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchStats } from "@/src/clients/events-api/client";
import { eventsApiHost, geoApiHost, geoApiToken } from "@/src/clients/hosts";

import { memoryStore } from "./last-good";
import { liveCounters } from "./counters";
import { searchPlaces } from "./places";

/**
 * The one suite that talks to the **real** ecosystem services — TS-008-A13's
 * runtime half and the evidence behind "these two APIs are reachable".
 *
 * It is guarded twice, so it never turns a network outage or a missing
 * credential into a red build:
 *
 *  - `RUN_LIVE_API_TESTS=0` skips it outright;
 *  - a reachability probe against each service's `/api/health`-class endpoint
 *    skips the block when the host does not answer within two seconds;
 *  - the geo-api block additionally skips without `GEOAPI_READ_TOKEN`, which
 *    this environment does not have (`state/open.md`).
 *
 * `/api/stats` is tokenless, so the counters half runs wherever there is a
 * network — and it is the assertion that the *dates* figure in the prototype
 * is a counted one, not a demo number.
 */

const PROBE_TIMEOUT_MS = 2000;

async function reachable(url: string): Promise<boolean> {
  if (process.env.RUN_LIVE_API_TESTS === "0") return false;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) });
    return response.ok;
  } catch {
    return false;
  }
}

const eventsUp = await reachable(`${eventsApiHost()}/api/stats`);
const geoUp = (await reachable(`${geoApiHost()}/api/health`)) && geoApiToken() !== undefined;

beforeEach(() => {
  vi.stubEnv("LIVE_DATA", "auto");
  vi.stubEnv("LIVE_TIMEOUT_MS", "5000");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe.skipIf(!eventsUp)("TS-008-A13 (live): events-api answers the shape the pinned spec promises", () => {
  it("returns a numeric totalEvents from the tokenless /api/stats", async () => {
    const stats = await fetchStats({ host: eventsApiHost(), timeoutMs: 5000 });
    expect(typeof stats.totalEvents).toBe("number");
    expect(stats.totalEvents).toBeGreaterThan(0);
  });

  it("still carries no places and no updates-today field — Q-037 is unresolved", async () => {
    const stats = await fetchStats({ host: eventsApiHost(), timeoutMs: 5000 });
    expect(stats).not.toHaveProperty("totalCommunities");
    expect(stats).not.toHaveProperty("updatesToday");
  });

  it("renders the dates counter from real data, with the other two figures marked demo", async () => {
    const envelope = await liveCounters({ store: memoryStore() });
    expect(envelope?.data.dates).toBeGreaterThan(0);
    expect(envelope?.demo).toBe(true);
  });
});

describe.skipIf(!geoUp)("TS-008-A14 (live): geo-api resolves a ZIP to a community with a slug", () => {
  it("classifies a real covered ZIP as covered and hands back its geo-api slug", async () => {
    const envelope = await searchPlaces({ query: "17509", store: memoryStore() });
    expect(envelope.demo).toBe(false);
    if (envelope.data.outcome.kind === "covered") {
      expect(envelope.data.outcome.place.slug).toMatch(/^[a-z0-9-]+$/);
      expect(envelope.data.outcome.place.communityId).toMatch(/^geoname\.\d+$/);
    }
  });
});
