import { describe, expect, it } from "vitest";

import { composeViewerContext, statedPlaceSlug, stageZeroViewer } from "./viewer-context";
import { mockLocationResolver, disabledLocationResolver } from "./geolocation";

const now = new Date("2026-09-11T12:00:00Z");
const base = { focusJob: "know-what-is-on", locale: "de", now } as const;

describe("TS-010-A1: the composer answers every input path, and never throws", () => {
  it("a bare request is stage 0 — direct, no geo, the page's own focus job", async () => {
    const resolved = await composeViewerContext({ ...base, resolver: disabledLocationResolver });
    expect(resolved.viewer.stage).toBe(0);
    expect(resolved.viewer.trait).toBe("direct");
    expect(resolved.viewer.geo.country).toBeNull();
    expect(resolved.viewer.job).toBe("know-what-is-on");
    expect(resolved.seed).toBe("2026-W37");
  });

  it("an IP-only request is stage 1 and stops at the granularity ceiling", async () => {
    const resolved = await composeViewerContext({ ...base, resolver: mockLocationResolver });
    expect(resolved.viewer.stage).toBe(1);
    expect(resolved.viewer.geo.county).not.toBeNull();
    expect(resolved.viewer.geo.community).toBeNull();
    expect(resolved.location.demo).toBe(true);
  });

  it("an IP request with campaign parameters is stage 2", async () => {
    const resolved = await composeViewerContext({
      ...base,
      params: { etcc_med: "print" },
      resolver: mockLocationResolver,
    });
    expect(resolved.viewer.stage).toBe(2);
    expect(resolved.viewer.trait).toBe("print-qr");
  });

  it("a stated place is stage 3 and overwrites the IP-derived hierarchy completely", async () => {
    const resolved = await composeViewerContext({
      ...base,
      resolver: mockLocationResolver,
      statedPlace: {
        country: "de",
        state: "niedersachsen",
        county: "helmstedt",
        municipality: "lehre",
        community: "flechtorf",
      },
    });
    expect(resolved.viewer.stage).toBe(3);
    expect(resolved.viewer.geo.community).toBe("flechtorf");
    expect(resolved.viewer.geo.state).toBe("niedersachsen");
    expect(resolved.location.demo).toBe(false);
  });

  it("keeps the page's focus job whatever the entry says (DEC-059)", async () => {
    for (const referrer of ["https://www.linkedin.com/", "https://www.instagram.com/", null]) {
      const resolved = await composeViewerContext({ ...base, referrer, resolver: mockLocationResolver });
      expect(resolved.viewer.job).toBe("know-what-is-on");
    }
  });

  it("reads the landing route for the two matrix rows that need it", async () => {
    const resolved = await composeViewerContext({
      ...base,
      referrer: "https://www.google.com/",
      path: "/dein-ort",
      resolver: disabledLocationResolver,
    });
    expect(resolved.viewer.trait).toBe("reader-search");
  });

  it("takes ?ort= as the stated-place signal", () => {
    expect(statedPlaceSlug({ ort: "flechtorf" })).toBe("flechtorf");
    expect(statedPlaceSlug(new URLSearchParams("ort=lehre"))).toBe("lehre");
    expect(statedPlaceSlug({})).toBeNull();
  });

  it("gives the prerendered shell its stage-0 viewer without any request at all", () => {
    const viewer = stageZeroViewer({ focusJob: "publish-our-dates", locale: "en" });
    expect(viewer).toEqual({
      geo: { country: null, state: null, county: null, municipality: null, community: null },
      trait: "direct",
      job: "publish-our-dates",
      stage: 0,
      locale: "en",
    });
  });
});
