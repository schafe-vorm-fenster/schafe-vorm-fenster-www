import { describe, expect, it } from "vitest";

import { ctaLabelOnly, interpolate, splitQuoteAttribution } from "./text";

describe("content text helpers", () => {
  it("ctaLabelOnly strips the inline target arrow", () => {
    expect(ctaLabelOnly("Angebot anfragen → `/deine-region/angebot`")).toBe("Angebot anfragen");
  });

  it("ctaLabelOnly returns a plain label unchanged", () => {
    expect(ctaLabelOnly("Absenden")).toBe("Absenden");
  });

  it("ctaLabelOnly passes through undefined", () => {
    expect(ctaLabelOnly(undefined)).toBeUndefined();
  });

  it("splitQuoteAttribution splits on the last dash even with a dash inside the quote", () => {
    const value =
      '„Vierzig Orte redaktionell abzudecken war für uns nicht zu schaffen — jetzt liegt alles auf einer Karte." — Landrätin, Beispiel-Landkreis Musterkreis';
    expect(splitQuoteAttribution(value)).toEqual({
      claim: '„Vierzig Orte redaktionell abzudecken war für uns nicht zu schaffen — jetzt liegt alles auf einer Karte."',
      attribution: "Landrätin, Beispiel-Landkreis Musterkreis",
    });
  });

  it("splitQuoteAttribution returns the whole string as claim when there is no dash", () => {
    expect(splitQuoteAttribution("no attribution here")).toEqual({
      claim: "no attribution here",
      attribution: "",
    });
  });

  it("interpolate replaces a known token and leaves an unknown one untouched", () => {
    expect(interpolate("Beispiele aus {landkreis}", { landkreis: "deiner Region" })).toBe(
      "Beispiele aus deiner Region",
    );
    expect(interpolate("{unknown}", {})).toBe("{unknown}");
  });

  it("interpolate passes through undefined", () => {
    expect(interpolate(undefined, {})).toBeUndefined();
  });
});
