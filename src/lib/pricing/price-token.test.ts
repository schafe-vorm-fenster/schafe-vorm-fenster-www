import { describe, expect, it } from "vitest";

import { resolvePriceTokens } from "./price-token";

/**
 * `Intl.NumberFormat("de-DE")` separates the amount from the currency with a
 * **non-breaking** space, which is correct German typography and invisible in a
 * diff. Written as an escape here so the expectation says which space it means.
 */
const NBSP = "\u00a0";

describe("TS-WEB-0006-A12: a price is read from the offering package, never typed", () => {
  it("resolves the token to the package's amount in German", () => {
    expect(
      resolvePriceTokens(
        "Deshalb kostet die Lizenz für den eigenen Kalender {price:portalize-calendar} im Jahr.",
        "de",
      ),
    ).toBe(`Deshalb kostet die Lizenz für den eigenen Kalender 480${NBSP}€ im Jahr.`);
  });

  it("formats the same amount by the English locale's rules", () => {
    expect(
      resolvePriceTokens("the licence costs {price:portalize-calendar} a year", "en"),
    ).toBe("the licence costs €480 a year");
  });

  it("leaves the interval word to the sentence", () => {
    // The amount is data and the package owns it; "im Jahr" is grammar and the
    // author owns it. So the token never expands to an interval.
    const resolved = resolvePriceTokens("{price:portalize-calendar}", "de");
    expect(resolved).toBe(`480${NBSP}€`);
    expect(resolved).not.toMatch(/Jahr|year/);
  });

  it("returns a string with no token unchanged", () => {
    const plain = "Deshalb ist der Dorfkalender kostenlos, und das bleibt so.";
    expect(resolvePriceTokens(plain, "de")).toBe(plain);
  });

  it("resolves several tokens in one field", () => {
    expect(
      resolvePriceTokens("{price:portalize-calendar} und {price:portalize-calendar}", "de"),
    ).toBe(`480${NBSP}€ und 480${NBSP}€`);
  });

  it("throws on an offering id that does not exist, rather than rendering a gap", () => {
    expect(() => resolvePriceTokens("{price:portalize-kalender}")).toThrow(
      /names no offering/,
    );
  });

  it("throws on an offering that publishes no figure, so `on-request` cannot leak its number", () => {
    // `portalize-enterprise` carries 4000 in the package and
    // `price_status: on-request`. TS-WEB-0018-A3 forbids that figure on any
    // page; the token must not be the way around it.
    expect(() => resolvePriceTokens("{price:portalize-enterprise}")).toThrow(
      /publishes no figure/,
    );
    expect(() => resolvePriceTokens("{price:local-advertising}")).toThrow(
      /publishes no figure/,
    );
  });

  it("does not resolve a token the offering package would price at zero into a figure", () => {
    // `community-calendar` is permanent-free: `publishablePrice` is true but it
    // carries no figure, so a sentence cannot accidentally print "0 €".
    expect(() => resolvePriceTokens("{price:community-calendar}")).toThrow(
      /publishes no figure/,
    );
  });
});
