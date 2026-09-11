import { describe, expect, it } from "vitest";

import { selectRegionalVariant, validateVariantSet } from "./regional";
import { geo, NO_GEO } from "../relevance/types";

const set = [
  { key: "neutral" as const, value: "neutral copy" },
  { key: { state: "mecklenburg-vorpommern" }, value: "MV copy" },
  { key: { state: "mecklenburg-vorpommern", county: "vorpommern-greifswald" }, value: "VG copy" },
  { key: { state: "niedersachsen" }, value: "NI copy" },
];

describe("TS-010-A10: county beats state beats neutral", () => {
  it("takes the county variant where one exists", () => {
    expect(
      selectRegionalVariant(set, geo({ country: "de", state: "mecklenburg-vorpommern", county: "vorpommern-greifswald" })),
    ).toBe("VG copy");
  });

  it("falls back to the state variant", () => {
    expect(
      selectRegionalVariant(set, geo({ country: "de", state: "mecklenburg-vorpommern", county: "rostock" })),
    ).toBe("MV copy");
  });

  it("falls back silently to neutral for a region with no variant, and at stage 0", () => {
    expect(selectRegionalVariant(set, geo({ country: "de", state: "bayern" }))).toBe("neutral copy");
    expect(selectRegionalVariant(set, NO_GEO)).toBe("neutral copy");
  });

  it("never keys below county — a municipality is the spooky effect at content level", () => {
    expect(
      validateVariantSet([
        { key: "neutral" as const, value: "n" },
        { key: { state: "ni", county: "helmstedt", municipality: "lehre" } as never, value: "too fine" },
      ]),
    ).toEqual(["a variant is keyed below county level"]);
  });

  it("fails a set without a neutral variant", () => {
    expect(validateVariantSet([{ key: { state: "ni" }, value: "NI" }])).toEqual([
      "the set has no neutral variant",
    ]);
    expect(validateVariantSet(set)).toEqual([]);
  });

  it("returns null rather than throwing when a set is empty", () => {
    expect(selectRegionalVariant([], geo({ state: "ni" }))).toBeNull();
  });
});
