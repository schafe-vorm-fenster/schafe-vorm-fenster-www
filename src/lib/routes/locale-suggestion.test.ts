import { describe, expect, it } from "vitest";

import { DOMAIN_MATRIX } from "@/src/lib/routes/host-matrix";
import {
  parseAcceptLanguage,
  suggestedLanguage,
  suggestionServerTiming,
} from "@/src/lib/routes/locale-suggestion";

const deDomain = DOMAIN_MATRIX[0]!;

describe("DEC-038/053: Accept-Language parsing", () => {
  it("orders by descending quality", () => {
    expect(parseAcceptLanguage("en;q=0.5, de;q=0.9, fr;q=0.1")).toEqual(["de", "en", "fr"]);
  });

  it("treats a missing q as 1", () => {
    expect(parseAcceptLanguage("de, en;q=0.5")).toEqual(["de", "en"]);
  });

  it("reduces a region subtag to its base language", () => {
    expect(parseAcceptLanguage("en-US,en;q=0.9")).toEqual(["en", "en"]);
  });

  it("returns nothing for an absent header", () => {
    expect(parseAcceptLanguage(null)).toEqual([]);
    expect(parseAcceptLanguage(undefined)).toEqual([]);
  });
});

describe("TS-001 D3 note / DEC-038: the suggestion signal never matches the render", () => {
  it("suggests nothing when the preferred language is already rendering", () => {
    expect(suggestedLanguage("de", deDomain, "/mitmachen")).toBeUndefined();
  });

  it("suggests the best-matching offered language that differs from the render", () => {
    expect(suggestedLanguage("en-GB,en;q=0.9,de;q=0.5", deDomain, "/mitmachen")).toBe("en");
  });

  it("suggests nothing when nothing preferred is offered on this domain", () => {
    expect(suggestedLanguage("fr", deDomain, "/mitmachen")).toBeUndefined();
  });

  it("suggests nothing with no Accept-Language header at all", () => {
    expect(suggestedLanguage(null, deDomain, "/mitmachen")).toBeUndefined();
  });

  it("formats the Server-Timing entry", () => {
    expect(suggestionServerTiming("en")).toBe('suggested-locale;desc="en"');
  });
});
