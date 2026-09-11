import { describe, expect, it } from "vitest";

import { formatPriceFigure } from "./format";

describe("TS-006 D10: the price figure is one readable string", () => {
  it("formats the amount, the interval and the VAT qualifier together", () => {
    const value = formatPriceFigure({ amount: 480, currency: "EUR", interval: "year", vatNote: "zzgl. USt." });
    expect(value).toContain("480");
    expect(value).toContain("€");
    expect(value).toContain("Jahr");
    expect(value).toContain("zzgl. USt.");
  });

  it("omits the interval and the VAT qualifier when absent", () => {
    const value = formatPriceFigure({ amount: 480 });
    expect(value).not.toContain("/");
    expect(value).not.toContain(",");
  });

  it("localizes the interval word for English", () => {
    const value = formatPriceFigure({ amount: 480, interval: "year" }, "en");
    expect(value).toContain("year");
    expect(value).not.toContain("Jahr");
  });
});
