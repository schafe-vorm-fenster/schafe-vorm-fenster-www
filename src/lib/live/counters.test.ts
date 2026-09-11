import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { liveCounters } from "./counters";
import { memoryStore } from "./last-good";

const fetchStats = vi.hoisted(() => vi.fn());

vi.mock("@/src/clients/events-api/client", () => ({ fetchStats }));

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  fetchStats.mockReset();
});

describe("TS-008-A9: only counted figures render, and none is ever substituted", () => {
  it("renders the dates figure from the upstream's own totalEvents", async () => {
    vi.stubEnv("LIVE_DATA", "auto");
    fetchStats.mockResolvedValue({ totalEvents: 9125 });

    const envelope = await liveCounters({ store: memoryStore() });
    expect(envelope?.data.dates).toBe(9125);
  });

  it("renders a counted zero as zero — a real count is never hidden", async () => {
    vi.stubEnv("LIVE_DATA", "auto");
    fetchStats.mockResolvedValue({ totalEvents: 0 });

    const envelope = await liveCounters({ store: memoryStore() });
    expect(envelope?.data.dates).toBe(0);
  });

  it("omits the whole module when the stats payload omits the one field it has (schema failure)", async () => {
    vi.stubEnv("LIVE_DATA", "auto");
    fetchStats.mockRejectedValue(new Error("events-api: schema: totalEvents missing"));

    await expect(liveCounters({ store: memoryStore() })).resolves.toBeUndefined();
  });

  it("marks the band demo:true while two of the three figures have no upstream field (Q-037)", async () => {
    vi.stubEnv("LIVE_DATA", "auto");
    fetchStats.mockResolvedValue({ totalEvents: 9125 });

    const envelope = await liveCounters({ store: memoryStore() });
    expect(envelope?.demo).toBe(true);
    expect(envelope?.data.places).toBeDefined();
    expect(envelope?.data.updatesToday).toBeDefined();
  });

  it("serves tier 2 with the timestamp rather than hiding, while last-good is inside its window", async () => {
    vi.stubEnv("LIVE_DATA", "auto");
    const now = new Date("2026-09-11T12:00:00.000Z");
    const store = memoryStore(
      new Map([["stats", { data: { dates: 9000 }, fetchedAt: "2026-09-11T11:00:00.000Z" }]]),
    );
    fetchStats.mockRejectedValue(new Error("HTTP 500"));

    const envelope = await liveCounters({ store, now: () => now });
    expect(envelope?.tier).toBe("stale");
    expect(envelope?.fetchedAt).toBe("2026-09-11T11:00:00.000Z");
  });
});
