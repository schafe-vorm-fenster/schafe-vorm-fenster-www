import { describe, expect, it } from "vitest";

import { OFFER_TIER_CTA_VARIANT, OFFER_TIERS } from "./offer-tier";
import { PRICE_TIER_CTA_VARIANT, PRICE_TIERS } from "../price-section/price-tier-row";

describe("offer-tier (deprecated) shares the price-section's order and weight table", () => {
  it("orders the three tiers community, portalize-calendar, portalize-enterprise", () => {
    expect(OFFER_TIERS).toBe(PRICE_TIERS);
    expect(OFFER_TIERS).toEqual(["community-calendar", "portalize-calendar", "portalize-enterprise"]);
  });

  it("is the same table — one place says quiet · primary-light · quiet", () => {
    expect(OFFER_TIER_CTA_VARIANT).toBe(PRICE_TIER_CTA_VARIANT);
    expect(OFFER_TIER_CTA_VARIANT["community-calendar"]).toBe("quiet");
    expect(OFFER_TIER_CTA_VARIANT["portalize-calendar"]).toBe("primary-light");
    expect(OFFER_TIER_CTA_VARIANT["portalize-enterprise"]).toBe("quiet");
  });
});
