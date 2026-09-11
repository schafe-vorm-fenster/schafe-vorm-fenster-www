import { describe, expect, it } from "vitest";

import { OFFER_TIER_CTA_VARIANT, OFFER_TIERS } from "./offer-tier";

describe("TS-024 D6/D6a: the CTA variant is derived from the tier, never chosen freely", () => {
  it("orders the three tiers community, portalize-calendar, portalize-enterprise", () => {
    expect(OFFER_TIERS).toEqual(["community-calendar", "portalize-calendar", "portalize-enterprise"]);
  });

  it("never assigns pulse to the middle, paid-conversion-shaped tier", () => {
    expect(OFFER_TIER_CTA_VARIANT["portalize-calendar"]).toBe("primary-light");
    for (const variant of Object.values(OFFER_TIER_CTA_VARIANT)) {
      expect(variant).not.toBe("pulse");
    }
  });

  it("gives the third tier the quiet treatment and the first the secondary one", () => {
    expect(OFFER_TIER_CTA_VARIANT["portalize-enterprise"]).toBe("quiet");
    expect(OFFER_TIER_CTA_VARIANT["community-calendar"]).toBe("secondary");
  });
});
