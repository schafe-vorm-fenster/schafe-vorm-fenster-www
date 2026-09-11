import { describe, expect, it } from "vitest";

import { GEO_TIER_WEIGHTS, geoProximity, geoTier } from "./geo";
import { geo, NO_GEO } from "./types";

const lehre = geo({
  country: "de",
  state: "niedersachsen",
  county: "helmstedt",
  municipality: "lehre",
  community: "flechtorf",
});

describe("TS-005-A1: geo tiers 0–6 per D1 for every level combination", () => {
  it("tier 0 — same community", () => {
    expect(geoTier(lehre, lehre)).toBe(0);
  });

  it("tier 1 — same municipality, different community", () => {
    expect(geoTier(geo({ ...lehre, community: "wendhausen" }), lehre)).toBe(1);
  });

  it("tier 2 — same county, different municipality", () => {
    expect(geoTier(geo({ ...lehre, municipality: "koenigslutter", community: null }), lehre)).toBe(2);
  });

  it("tier 3 — same state, different county", () => {
    expect(geoTier(geo({ country: "de", state: "niedersachsen", county: "gifhorn" }), lehre)).toBe(3);
  });

  it("tier 4 — same country, different state", () => {
    expect(geoTier(geo({ country: "de", state: "mecklenburg-vorpommern" }), lehre)).toBe(4);
  });

  it("tier 4 — a nationwide element against a German viewer", () => {
    expect(geoTier(geo({ country: "de" }), lehre)).toBe(4);
  });

  it("tier 5 — a different country", () => {
    expect(geoTier(geo({ country: "at", state: "wien" }), lehre)).toBe(5);
  });

  it("tier 6 — the element has no geo at all", () => {
    expect(geoTier(NO_GEO, lehre)).toBe(6);
  });

  it("tier 6 — the viewer has no geo at all (stage 0)", () => {
    expect(geoTier(lehre, NO_GEO)).toBe(6);
  });

  it("matches on the most specific level both sides carry, not on a finer one", () => {
    // The viewer knows only her county (stage 1's realistic ceiling, TS-010 D4);
    // a community-level element in that county is tier 2, never tier 0.
    const countyOnly = geo({ country: "de", state: "niedersachsen", county: "helmstedt" });
    expect(geoTier(lehre, countyOnly)).toBe(2);
  });

  it("a level that matches only by name under a different parent does not count", () => {
    // Same community name, different county — containment decides, not the label.
    const elsewhere = geo({
      country: "de",
      state: "bayern",
      county: "hof",
      municipality: "lehre",
      community: "flechtorf",
    });
    expect(geoTier(elsewhere, lehre)).toBe(4);
  });

  it("weights the seven tiers per the D1 table", () => {
    expect(GEO_TIER_WEIGHTS).toEqual([1.0, 0.8, 0.6, 0.45, 0.3, 0.15, 0.1]);
    expect(geoProximity(lehre, lehre)).toBe(1.0);
    expect(geoProximity(NO_GEO, lehre)).toBe(0.1);
  });
});
