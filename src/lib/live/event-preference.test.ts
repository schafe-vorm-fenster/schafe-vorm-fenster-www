import { describe, expect, it } from "vitest";

import { compareByPreference, isCulture, isRecurring, pickPreferred } from "./event-preference";

import type { LiveEvent } from "./types";

/** DEC-0210 — the one preference every date selection shares. */
const day = (n: number, hour = 18) => new Date(Date.UTC(2026, 10, 12 + n, hour)).toISOString();

let counter = 0;
const date = (over: Partial<LiveEvent> & { startsAt: string }): LiveEvent => ({
  id: `p${(counter += 1)}`,
  title: "Termin",
  ...over,
});

describe("isRecurring / isCulture", () => {
  it("knows the four non-once occurrence values", () => {
    for (const occurrence of ["recurring", "series", "openinghours", "schedule"]) {
      expect(isRecurring({ occurrence })).toBe(true);
    }
    expect(isRecurring({ occurrence: "once" })).toBe(false);
    expect(isRecurring({})).toBe(false);
  });

  it("takes culture-tourism as culture and nothing else", () => {
    expect(isCulture({ categoryId: "culture-tourism" })).toBe(true);
    expect(isCulture({ categoryId: "community-life" })).toBe(false);
    expect(isCulture({})).toBe(false);
  });
});

describe("compareByPreference", () => {
  it("puts a one-off before a recurring date, however late", () => {
    const weekly = date({ startsAt: day(1), occurrence: "recurring" });
    const once = date({ startsAt: day(20), occurrence: "once" });
    expect([weekly, once].sort(compareByPreference)[0]).toBe(once);
  });

  it("puts culture first on a tie of kind, whatever the start", () => {
    const sport = date({ startsAt: day(1), categoryId: "sports" });
    const culture = date({ startsAt: day(5), categoryId: "culture-tourism" });
    expect([sport, culture].sort(compareByPreference)[0]).toBe(culture);
  });

  it("then takes the earlier start, then the id", () => {
    const later = date({ startsAt: day(3), id: "a" });
    const earlier = date({ startsAt: day(2), id: "z" });
    expect([later, earlier].sort(compareByPreference)[0]).toBe(earlier);
    const x = date({ startsAt: day(2), id: "a" });
    const y = date({ startsAt: day(2), id: "b" });
    expect([y, x].sort(compareByPreference)[0]).toBe(x);
  });
});

describe("TS-WEB-0008-A22: pickPreferred, the shared date preference", () => {
  it("takes one-offs before recurring ones, though the recurring ones start first", () => {
    const weekly = [1, 2, 3].map((n) => date({ startsAt: day(n), occurrence: "recurring", categoryId: `w${n}` }));
    const once = [4, 5, 6].map((n) => date({ startsAt: day(n), occurrence: "once", categoryId: `o${n}` }));
    const picked = pickPreferred([...weekly, ...once], 3);
    expect(picked.every((event) => !isRecurring(event))).toBe(true);
  });

  it("fills with recurring dates only where one-offs run out", () => {
    const weekly = [1, 2].map((n) => date({ startsAt: day(n), occurrence: "series", categoryId: `w${n}` }));
    const once = date({ startsAt: day(5), occurrence: "once" });
    const picked = pickPreferred([...weekly, once], 3);
    expect(picked).toHaveLength(3);
    expect(picked.filter(isRecurring)).toHaveLength(2);
  });

  it("mixes the themes: a second sports date waits for a new category", () => {
    const sport = [1, 2, 3].map((n) => date({ startsAt: day(n), categoryId: "sports" }));
    const school = date({ startsAt: day(6), categoryId: "education-health" });
    const picked = pickPreferred([...sport, school], 2);
    expect(picked.map((event) => event.categoryId).sort()).toEqual(["education-health", "sports"]);
  });

  it("takes culture on a tie of the theme count", () => {
    const sport = date({ startsAt: day(1), categoryId: "sports" });
    const supply = date({ startsAt: day(2), categoryId: "everyday-supply" });
    const culture = date({ startsAt: day(9), categoryId: "culture-tourism" });
    const picked = pickPreferred([sport, supply, culture], 1);
    expect(picked).toEqual([culture]);
  });

  it("returns the chosen dates in start order", () => {
    const a = date({ startsAt: day(7), categoryId: "culture-tourism" });
    const b = date({ startsAt: day(2), categoryId: "sports" });
    expect(pickPreferred([a, b], 2)).toEqual([b, a]);
  });

  it("returns only dates of the candidate list, each once", () => {
    const a = date({ startsAt: day(1), id: "same" });
    const b = date({ startsAt: day(2), id: "same" });
    const picked = pickPreferred([a, b], 5);
    expect(picked).toEqual([a]);
  });

  it("keeps one date per organiser and caps recurring dates when asked", () => {
    const vhs = [1, 2, 3].map((n) => date({ startsAt: day(n), organizerId: "vhs", categoryId: `c${n}` }));
    const weekly = [4, 5, 6].map((n) =>
      date({ startsAt: day(n), organizerId: `r${n}`, categoryId: `r${n}`, occurrence: "recurring" }),
    );
    const picked = pickPreferred([...vhs, ...weekly], 5, { distinctOrganisers: true, maxRecurring: 2 });
    expect(picked.filter((event) => event.organizerId === "vhs")).toHaveLength(1);
    expect(picked.filter(isRecurring)).toHaveLength(2);
  });

  it("repeats organisers and recurring dates freely without those options", () => {
    const same = [1, 2, 3].map((n) => date({ startsAt: day(n), organizerId: "o", occurrence: "recurring" }));
    expect(pickPreferred(same, 3)).toHaveLength(3);
  });

  it("returns nothing for count 0 or no candidates", () => {
    expect(pickPreferred([], 3)).toEqual([]);
    expect(pickPreferred([date({ startsAt: day(1) })], 0)).toEqual([]);
  });
});
