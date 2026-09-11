import { describe, expect, it } from "vitest";

import { calendarServiceNode, regionServiceNode } from "@/src/lib/seo/structured-data/service";

describe("TS-011 D4a: the calendar Service carries a scoped, net price", () => {
  it("emits 480 EUR/year, net, per organisation", () => {
    const node = calendarServiceNode("de", "Kalenderlizenz");
    const spec = node.offers?.priceSpecification;
    expect(spec?.price).toBe(480);
    expect(spec?.priceCurrency).toBe("EUR");
    expect(spec?.unitCode).toBe("ANN");
    // D4a: the net half.
    expect(spec?.valueAddedTaxIncluded).toBe(false);
    // D4a: the scope half — organisation, not place.
    expect(spec?.referenceQuantity.unitText).toBe("Organisation");
    expect(spec?.referenceQuantity.value).toBe(1);
  });

  it("never invents the page's copy — name is passed in, not hardcoded", () => {
    const node = calendarServiceNode("de", "Some Page Title");
    expect(node.name).toBe("Some Page Title");
  });
});

describe("TS-011 D4: the region Service carries no price (WEB-F-020)", () => {
  it("emits no offers property at all", () => {
    const node = regionServiceNode("de", "Regionalkalender");
    expect(node).not.toHaveProperty("offers");
  });
});
