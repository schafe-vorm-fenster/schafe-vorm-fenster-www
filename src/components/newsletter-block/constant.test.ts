import { describe, expect, it } from "vitest";

import { NEWSLETTER_SENDING_SYSTEM, newsletterOffered } from "./constant";

/**
 * TS-WEB-0016-A21 (static half): the block is withheld while no sending
 * system is named. The rendered half — no `[data-newsletter]` on any route —
 * is `e2e/newsletter.spec.ts`.
 */
describe("TS-WEB-0016-A21: the newsletter is withheld until a sending system exists", () => {
  it("names no sending system today (Q-0020 open)", () => {
    expect(NEWSLETTER_SENDING_SYSTEM).toBeNull();
  });

  it("offers the block only once a system is named", () => {
    expect(newsletterOffered()).toBe(NEWSLETTER_SENDING_SYSTEM !== null);
    expect(newsletterOffered()).toBe(false);
  });
});
