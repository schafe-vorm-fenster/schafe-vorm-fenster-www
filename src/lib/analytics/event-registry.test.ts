import { describe, expect, it } from "vitest";

import {
  conversionEvent,
  CONVERSION_EVENTS,
  eventRegistryViolations,
} from "@/src/lib/analytics/event-registry";
import { isKnownConversionGoalId } from "@/src/lib/analytics/goal-ids";

import type { ConversionEventDefinition } from "@/src/lib/analytics/event-registry";

describe("TS-WEB-0012-A3: the event registry resolves against @schafe-vorm-fenster/goals", () => {
  it("carries the nine goal ids of D4 plus make-contact, one event per conversion goal", () => {
    expect(CONVERSION_EVENTS).toHaveLength(10);
  });

  it("TS-WEB-0016 D12/A18: make-contact is wired as a handover and named as an intent", () => {
    const event = conversionEvent("make-contact");
    expect(event?.wired).toBe(true);
    expect(event?.stage).toBe("handover");
    expect(event?.surface).toBe("chrome");
    expect(event?.trigger).toContain("intent");
    expect(event?.trigger.toLowerCase()).not.toMatch(/counts? (a )?contact\b/);
  });

  it("DEC-0081 §4: request-product-briefing fires from the contact section, and is an intent", () => {
    const event = conversionEvent("request-product-briefing");
    expect(event?.surface).toBe("chrome");
    expect(event?.trigger).toContain("intent");
  });

  it("has no violations against the hub package or against itself", () => {
    expect(eventRegistryViolations()).toEqual([]);
  });

  it("resolves every registry id to a known hub conversion goal id", () => {
    for (const event of CONVERSION_EVENTS) {
      expect(isKnownConversionGoalId(event.goalId)).toBe(true);
    }
  });

  it("fails an id that does not resolve to a hub goal", () => {
    const bogus: ConversionEventDefinition = {
      goalId: "does-not-exist-in-the-hub",
      stage: "handover",
      trigger: "x",
      surface: "app",
      wired: true,
    };
    expect(eventRegistryViolations([...CONVERSION_EVENTS, bogus])).toContain(
      "unknown hub goal id: does-not-exist-in-the-hub",
    );
  });

  it("flags a duplicate goal id", () => {
    const [first] = CONVERSION_EVENTS;
    expect(first).toBeDefined();
    expect(eventRegistryViolations([first!, first!])).toContain(
      `duplicate goal id: ${first!.goalId}`,
    );
  });

  it("D4 rule 1: wired events carry a stage, unwired events carry none", () => {
    for (const event of CONVERSION_EVENTS) {
      expect(event.wired).toBe(event.stage !== null);
    }
  });

  it("looks a definition up by id", () => {
    expect(conversionEvent("buy-calendar-licence")?.stage).toBe("completed");
    expect(conversionEvent("nope")).toBeUndefined();
  });

  it("D5/D4: the three goals with no launch surface carry stage null", () => {
    for (const id of [
      "request-ad-placement",
      "order-promotion-material",
      "publish-events-regularly",
    ]) {
      expect(conversionEvent(id)?.stage).toBeNull();
      expect(conversionEvent(id)?.wired).toBe(false);
    }
  });
});
