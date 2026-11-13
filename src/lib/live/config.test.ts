import { afterEach, describe, expect, it, vi } from "vitest";

import { CAPABILITIES, hasRealBackend, liveDataMode, timeoutMs } from "./config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("the mock rule's switch — plan/guardrails.md", () => {
  it("forces every capability to the mock backend under LIVE_DATA=mock", () => {
    vi.stubEnv("LIVE_DATA", "mock");
    vi.stubEnv("GEOAPI_READ_TOKEN", "a-token");
    for (const capability of Object.keys(CAPABILITIES) as (keyof typeof CAPABILITIES)[]) {
      expect(hasRealBackend(capability), capability).toBe(false);
    }
  });

  it("mocks a capability the upstream does not have, whatever the flag says", () => {
    vi.stubEnv("LIVE_DATA", "real");
    for (const capability of ["countyActivityRanking", "statsPlacesCount", "statsUpdatesToday"] as const) {
      expect(CAPABILITIES[capability].upstream, capability).toBe(false);
      expect(hasRealBackend(capability), capability).toBe(false);
    }
  });

  it("opens every credential-free capability in an environment with no token at all", () => {
    vi.stubEnv("LIVE_DATA", "auto");
    vi.stubEnv("GEOAPI_READ_TOKEN", "");
    vi.stubEnv("EVENTSAPI_READ_TOKEN", "");
    for (const [name, capability] of Object.entries(CAPABILITIES)) {
      if (capability.credential !== "none" || !capability.upstream) continue;
      expect(hasRealBackend(name as keyof typeof CAPABILITIES), name).toBe(true);
    }
  });

  it("still records geo-api's missing name search as an open row, though the index answers it", () => {
    // Q-0025 is upstream's gap and stays open (state/open.md row 5); what
    // changed is only that this website no longer needs it to answer a name.
    expect(CAPABILITIES.placeSearchByName.openRow).toBe("5");
    expect(CAPABILITIES.placeSearchByName.service).toBe("index");
  });

  it("picks the mock in auto mode while a token-scoped service has no read token", () => {
    vi.stubEnv("LIVE_DATA", "auto");
    vi.stubEnv("GEOAPI_READ_TOKEN", "");
    expect(hasRealBackend("placeSearchByZip")).toBe(false);
  });

  it("picks the real client in auto mode as soon as the read token is provisioned", () => {
    vi.stubEnv("LIVE_DATA", "auto");
    vi.stubEnv("GEOAPI_READ_TOKEN", "a-token");
    expect(hasRealBackend("placeSearchByZip")).toBe(true);
    expect(hasRealBackend("communityBySlug")).toBe(true);
  });

  it("keeps the tokenless /api/stats real even in an environment with no credentials", () => {
    vi.stubEnv("LIVE_DATA", "auto");
    expect(hasRealBackend("statsTotalEvents")).toBe(true);
  });

  it("defaults to auto and falls back to auto for an unknown flag value", () => {
    vi.stubEnv("LIVE_DATA", "");
    expect(liveDataMode()).toBe("auto");
    vi.stubEnv("LIVE_DATA", "halb");
    expect(liveDataMode()).toBe("auto");
  });

  it("names an open row for every mocked-by-necessity capability", () => {
    for (const [name, capability] of Object.entries(CAPABILITIES)) {
      if (!capability.upstream) expect(capability.openRow, name).toBeDefined();
    }
  });
});

describe("TS-WEB-0009 D4: one timeout budget, in one place", () => {
  it("is 800 ms unless the environment overrides it", () => {
    vi.stubEnv("LIVE_TIMEOUT_MS", "");
    expect(timeoutMs()).toBe(800);
    vi.stubEnv("LIVE_TIMEOUT_MS", "250");
    expect(timeoutMs()).toBe(250);
    vi.stubEnv("LIVE_TIMEOUT_MS", "nonsense");
    expect(timeoutMs()).toBe(800);
  });
});
