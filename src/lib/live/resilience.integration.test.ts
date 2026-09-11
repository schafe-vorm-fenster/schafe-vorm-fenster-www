import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { liveCounters } from "./counters";
import { memoryStore, type LastGoodEntry } from "./last-good";
import { EMPTY_DEMO_SLUG } from "./mocks/fixtures";
import { nearbyEvents } from "./nearby";
import { placeEvents } from "./places";
import { regionExamples } from "./region";

/**
 * Integration level: the interface modules with a **failing upstream**, so
 * the three-tier chain of TS-009 D4 is exercised end to end rather than only
 * in `resilient()`'s own unit test.
 *
 * The failure is a real one: a real backend pointed at an unroutable host.
 * Nothing is stubbed inside the chain, so what these assert is the behaviour
 * a genuine outage produces.
 */

const outage = () => {
  vi.stubEnv("LIVE_DATA", "real");
  vi.stubEnv("EVENTSAPI_HOST", "http://127.0.0.1:1");
  vi.stubEnv("GEOAPI_HOST", "http://127.0.0.1:1");
  vi.stubEnv("GEOAPI_READ_TOKEN", "not-a-real-token");
  vi.stubEnv("EVENTSAPI_READ_TOKEN", "not-a-real-token");
  vi.stubEnv("LIVE_TIMEOUT_MS", "200");
};

const silent = { now: () => new Date("2026-09-11T12:00:00.000Z") };

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("TS-008-A5 / TS-009-A6: upstream down, cache warm — tier 2 with a freshness label", () => {
  it("serves the last good dates and says how old they are", async () => {
    const store = memoryStore(
      new Map<string, LastGoodEntry<unknown>>([
        [
          "dates:geoname.900101:upcoming",
          {
            data: {
              place: { communityId: "geoname.900101", name: "Beispielgemeinde Musterdorf", slug: "beispielgemeinde-musterdorf", lat: 54, lng: 13.4 },
              events: [{ id: "cached-1", title: "Zwischengespeicherter Termin (Beispiel)", startsAt: "2026-09-12T16:00:00.000Z" }],
              publishInvitation: false,
            },
            fetchedAt: "2026-09-11T09:00:00.000Z",
          },
        ],
      ]),
    );
    outage();

    const envelope = await placeEvents({ slug: "beispielgemeinde-musterdorf", store, ...silent });

    expect(envelope?.tier).toBe("stale");
    expect(envelope?.stale).toBe(true);
    expect(envelope?.fetchedAt).toBe("2026-09-11T09:00:00.000Z");
    expect(envelope?.data.events).toHaveLength(1);
  });
});

describe("TS-008-A5 / TS-009-A7: upstream down, cache cold — the tier-3 snapshot, labelled", () => {
  it("serves the committed snapshot for the place module", async () => {
    outage();
    const envelope = await placeEvents({ slug: "beispielgemeinde-musterdorf", store: memoryStore(), ...silent });

    expect(envelope?.tier).toBe("snapshot");
    expect(envelope?.stale).toBe(true);
    expect(envelope?.data.events.length).toBeGreaterThan(0);
    // Tier 3 has no segment: the snapshot is re-anchored on the place asked for.
    expect(envelope?.data.place.slug).toBe("beispielgemeinde-musterdorf");
  });

  it("serves the committed snapshot for the nearby module", async () => {
    outage();
    const nearby = await nearbyEvents({ lat: 54, lng: 13.4, store: memoryStore(), ...silent });

    expect(nearby.tier).toBe("snapshot");
    expect(nearby.data.events.length).toBeGreaterThan(0);
  });

  it("keeps a fully mocked module at tier 1 through an outage — it has no upstream to lose", async () => {
    // The county activity ranking has no upstream operation at all (Q-015
    // residue), so the region examples are mock-backed whatever the flag says
    // and an outage cannot degrade them. They are labelled `demo`, not stale.
    outage();
    const region = await regionExamples({ county: "geoname.900001", store: memoryStore(), ...silent });

    expect(region.tier).toBe("live");
    expect(region.demo).toBe(true);
    expect(region.data.examples.length).toBeGreaterThan(0);
  });

  it("removes the counter band instead of snapshotting it", async () => {
    outage();
    await expect(liveCounters({ store: memoryStore(), ...silent })).resolves.toBeUndefined();
  });
});

describe("TS-009-A11: a failing module degrades one module, not the page", () => {
  it("lets a tier-3 module, a tier-2 module and a tier-1 module stand side by side", async () => {
    const store = memoryStore(
      new Map<string, LastGoodEntry<unknown>>([
        [
          "dates:geoname.900101:upcoming",
          {
            data: {
              place: { communityId: "geoname.900101", name: "Beispielgemeinde Musterdorf", slug: "beispielgemeinde-musterdorf", lat: 54, lng: 13.4 },
              events: [{ id: "cached-1", title: "Zwischengespeicherter Termin (Beispiel)", startsAt: "2026-09-12T16:00:00.000Z" }],
              publishInvitation: false,
            },
            fetchedAt: "2026-09-11T11:59:00.000Z",
          },
        ],
      ]),
    );
    outage();

    const dates = await placeEvents({ slug: "beispielgemeinde-musterdorf", store, ...silent });
    const nearby = await nearbyEvents({ lat: 54, lng: 13.4, store, ...silent });
    const region = await regionExamples({ county: "geoname.900001", store, ...silent });

    expect(dates?.tier).toBe("stale");
    expect(nearby.tier).toBe("snapshot");
    expect(region.tier).toBe("live");
  });

  it("never throws into the caller for a module that has a fallback", async () => {
    outage();
    await expect(nearbyEvents({ lat: 54, lng: 13.4, store: memoryStore(), ...silent })).resolves.toBeDefined();
  });
});

describe("TS-008-A4 / WEB-F-045: an empty answer is tier 1, not a degradation", () => {
  it("keeps the covered place with no dates at tier 1 and sets the publish invitation", async () => {
    vi.stubEnv("LIVE_DATA", "mock");
    const envelope = await placeEvents({ slug: EMPTY_DEMO_SLUG, store: memoryStore(), ...silent });

    expect(envelope?.tier).toBe("live");
    expect(envelope?.stale).toBe(false);
    expect(envelope?.data.publishInvitation).toBe(true);
  });
});
