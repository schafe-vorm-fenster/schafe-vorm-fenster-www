import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createViewerLocationResolver,
  DEMO_LOCATION_LABEL,
  disabledLocationResolver,
  mockLocationResolver,
  truncateToCeiling,
} from "./geolocation";
import { geo } from "../relevance/types";

describe("TS-010-A2: the granularity ceiling is a hard truncation, not a preference", () => {
  it("drops a community the lookup returned, and keeps county", () => {
    const truncated = truncateToCeiling(
      geo({
        country: "de",
        state: "niedersachsen",
        county: "helmstedt",
        municipality: "lehre",
        community: "flechtorf",
      }),
    );
    expect(truncated.community).toBeNull();
    expect(truncated.county).toBe("helmstedt");
  });

  it("keeps a municipality only when the lookup was unambiguous", () => {
    const scope = geo({ country: "de", state: "niedersachsen", county: "helmstedt", municipality: "lehre" });
    expect(truncateToCeiling(scope, { unambiguousMunicipality: true }).municipality).toBe("lehre");
    expect(truncateToCeiling(scope).municipality).toBeNull();
  });
});

describe("TS-010-A1: the location resolver answers every input path without throwing", () => {
  it("the mock returns a labelled demo location at the stage-1 ceiling", async () => {
    const location = await mockLocationResolver.resolveViewerLocation({});
    expect(location.demo).toBe(true);
    expect(location.label).toBe(DEMO_LOCATION_LABEL);
    expect(location.source).toBe("mock");
    expect(location.geo.county).not.toBeNull();
    expect(location.geo.community).toBeNull();
  });

  it("a stated place wins over everything inferred, and overwrites the hierarchy completely", async () => {
    const location = await mockLocationResolver.resolveViewerLocation({
      statedPlace: {
        country: "de",
        state: "niedersachsen",
        county: "helmstedt",
        municipality: "lehre",
        community: "flechtorf",
      },
    });
    expect(location.source).toBe("stated-place");
    expect(location.demo).toBe(false);
    expect(location.geo.community).toBe("flechtorf");
    expect(location.geo.state).toBe("niedersachsen");
  });

  it("the disabled resolver — production while Q-008 is open — knows nothing and says so", async () => {
    const location = await disabledLocationResolver.resolveViewerLocation({});
    expect(location.source).toBe("none");
    expect(location.geo.country).toBeNull();
  });

  it("skips the lookup on a Sec-GPC or DNT signal and renders stage 0", async () => {
    const location = await mockLocationResolver.resolveViewerLocation({ privacySignal: true });
    expect(location.source).toBe("none");
    expect(location.geo.country).toBeNull();
  });

  it("honours a stated place even under a privacy signal — the visitor said it herself", async () => {
    const location = await mockLocationResolver.resolveViewerLocation({
      privacySignal: true,
      statedPlace: { community: "flechtorf" },
    });
    expect(location.geo.community).toBe("flechtorf");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is chosen by configuration, and is off unless a source is named", () => {
    vi.stubEnv("GEO_STAGE1_SOURCE", undefined);
    expect(createViewerLocationResolver({ source: "mock" })).toBe(mockLocationResolver);
    expect(createViewerLocationResolver({ source: "off" })).toBe(disabledLocationResolver);
    expect(createViewerLocationResolver({})).toBe(disabledLocationResolver);
  });
});
