import { describe, expect, it } from "vitest";

import { CONTEXT_MATRIX, contextProximity, contextRow } from "./context-matrix";
import { ENTRY_TRAITS, ITEM_TYPES } from "./types";

describe("TS-005-A14: the SRC-002 context matrix decides the starting type and the time window", () => {
  it("carries a row for every entry trait", () => {
    expect(Object.keys(CONTEXT_MATRIX).sort()).toEqual([...ENTRY_TRAITS].sort());
  });

  it.each([
    ["social", ["conference", "social-media", "live-dates"], "last-90-days"],
    ["professional", ["reference-case", "testimonial", "award"], "last-12-months"],
    ["purchase-intent", ["reference-case", "metric", "partner"], "timeless"],
    ["reader-search", ["live-dates", "save-to-homescreen"], "today-this-week"],
    ["print-qr", ["live-dates", "place-calendar"], "today"],
    ["press", ["press", "podcast", "award", "portrait"], "last-12-months"],
    ["activated", ["publishing-path", "promotion-material"], "current"],
  ] as const)("%s starts at its documented types, in the matrix's window", (trait, starting, window) => {
    const row = contextRow(trait);
    expect(row.startingTypes).toEqual(starting);
    expect(row.timeWindow).toBe(window);
    for (const type of starting) expect(contextProximity(type, trait)).toBe(1.0);
  });

  it("direct is the default case: widest spread, every type at the widening step", () => {
    const row = contextRow("direct");
    expect(row.startingTypes).toEqual([]);
    expect(row.timeWindow).toBe("last-12-months");
    for (const type of ITEM_TYPES) expect(contextProximity(type, "direct")).toBe(0.6);
  });

  it("scores a named widening type at 0.6 and an unnamed type at the 0.3 floor", () => {
    expect(contextProximity("press", "social")).toBe(0.6);
    expect(contextProximity("testimonial", "social")).toBe(0.6);
    expect(contextProximity("funding", "social")).toBe(0.3);
    expect(contextProximity("embed-demo", "press")).toBe(0.3);
  });

  it("never leaves a type without a relation — every type × trait pair scores", () => {
    for (const trait of ENTRY_TRAITS) {
      for (const type of ITEM_TYPES) {
        expect([1.0, 0.6, 0.3]).toContain(contextProximity(type, trait));
      }
    }
  });

  it("reads recognition as award and a podcast as press [PROPOSED alias]", () => {
    expect(contextProximity("recognition", "professional")).toBe(1.0);
    expect(contextProximity("podcast", "press")).toBe(1.0);
  });
});
