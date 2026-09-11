import { describe, expect, it } from "vitest";

import {
  conversionEvent,
  CONVERSION_EVENTS,
  eventRegistryViolations,
} from "@/src/lib/analytics/event-registry";
import { isKnownConversionGoalId } from "@/src/lib/analytics/goal-ids";

import type { ConversionEventDefinition } from "@/src/lib/analytics/event-registry";

describe("TS-012-A3: the event registry resolves against @schafe-vorm-fenster/goals", () => {
  it("carries the nine goal ids of D4, one event per conversion goal", () => {
    expect(CONVERSION_EVENTS).toHaveLength(9);
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
