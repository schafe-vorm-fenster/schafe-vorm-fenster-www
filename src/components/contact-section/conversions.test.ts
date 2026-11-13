import { describe, expect, it } from "vitest";

import { contactRowConversions } from "./conversions";
import { CONTACT_CHANNEL_IDS } from "@/src/lib/contact/contact-channels";
import { ROUTE_IDS } from "@/src/lib/routes/routes";

/**
 * TS-WEB-0016-A17, the half a unit can answer: which goals one click on which
 * row emits. The browser half — that the click on the rendered row fires
 * exactly these through the mock tracker — is the layout mount's e2e
 * (`e2e/contact-section.spec.ts`, T-10).
 */
describe("TS-WEB-0016-A17: one click, its goals", () => {
  it("every row fires make-contact once, carrying its channel and the route", () => {
    for (const channel of CONTACT_CHANNEL_IDS) {
      for (const route of ROUTE_IDS) {
        const bindings = contactRowConversions(channel, route);
        const makeContact = bindings.filter((binding) => binding.goalId === "make-contact");
        expect(makeContact, `${channel} on ${route}`).toHaveLength(1);
        expect(makeContact[0]?.attributes).toEqual({ channel, route });
        expect(makeContact[0]?.stage).toBe("handover");
      }
    }
  });

  it("row 1 fires request-product-briefing in addition, on the same click", () => {
    const bindings = contactRowConversions("appointment", "home");
    expect(bindings.map((binding) => binding.goalId)).toEqual([
      "make-contact",
      "request-product-briefing",
    ]);
    expect(bindings[1]?.attributes).toEqual({ channel: "appointment", route: "home" });
  });

  it("rows 2–4 never fire request-product-briefing (DEC-0081 amendment §3)", () => {
    for (const channel of ["whatsapp", "phone", "mail"] as const) {
      const ids = contactRowConversions(channel, "calendar").map((binding) => binding.goalId);
      expect(ids, channel).toEqual(["make-contact"]);
    }
  });

  it("no goal id fires twice for one click", () => {
    for (const channel of CONTACT_CHANNEL_IDS) {
      const ids = contactRowConversions(channel, "region").map((binding) => binding.goalId);
      expect(new Set(ids).size, channel).toBe(ids.length);
    }
  });

  it("A19 / D4 rule 3: the payload is the channel and the route, nothing else", () => {
    for (const channel of CONTACT_CHANNEL_IDS) {
      for (const binding of contactRowConversions(channel, "about")) {
        expect(Object.keys(binding.attributes ?? {}).sort()).toEqual(["channel", "route"]);
      }
    }
  });
});
