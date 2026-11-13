import { describe, expect, it } from "vitest";

import { isRecurring, pickVaried, pickVariedWeek } from "./varied-week";

import type { LiveEvent } from "./types";

/**
 * DEC-0185 — the nearby module's selection. The fixtures are shaped by the
 * measurement of 2026-10-28 for Anklam (region scope, 14 days): 23 dates, 5
 * organisers, two categories, 18 of them courses of one organiser.
 */
const NOW = new Date("2026-10-28T12:00:00Z");

const day = (n: number, hour = 18) => new Date(Date.UTC(2026, 9, 28 + n, hour)).toISOString();

let counter = 0;
const date = (over: Partial<LiveEvent> & { startsAt: string }): LiveEvent => ({
  id: `e${(counter += 1)}`,
  title: "Termin",
  ...over,
});

describe("pickVaried", () => {
  it("never takes two dates of one organiser — four courses of the vhs are one row", () => {
    const courses = [3, 3, 3, 3, 4].map((n) =>
      date({ startsAt: day(n), organizerId: "vhs", categoryId: "education-health", occurrence: "once" }),
    );
    const halloween = date({ startsAt: day(3, 17), organizerId: "buddenhagen", categoryId: "culture-tourism" });
    const picked = pickVaried([...courses, halloween]);
    expect(picked.filter((event) => event.organizerId === "vhs")).toHaveLength(1);
    expect(picked).toHaveLength(2);
  });

  it("spreads over categories before it takes a second of one", () => {
    const sport = [1, 2, 3].map((n) => date({ startsAt: day(n), organizerId: `s${n}`, categoryId: "sports" }));
    const culture = date({ startsAt: day(6), organizerId: "c", categoryId: "culture-tourism" });
    const picked = pickVaried([...sport, culture], 2);
    expect(picked.map((event) => event.categoryId).sort()).toEqual(["culture-tourism", "sports"]);
  });

  it("keeps at most two recurring dates and prefers one-offs", () => {
    const weekly = ["recurring", "series", "openinghours", "schedule"].map((occurrence, n) =>
      date({ startsAt: day(1 + n), organizerId: `r${n}`, categoryId: `c${n}`, occurrence }),
    );
    const once = [5, 6, 7].map((n) => date({ startsAt: day(n), organizerId: `o${n}`, categoryId: `c${n}`, occurrence: "once" }));
    const picked = pickVaried([...weekly, ...once]);
    expect(picked.filter(isRecurring).length).toBeLessThanOrEqual(2);
    expect(picked.filter((event) => !isRecurring(event)).length).toBeGreaterThanOrEqual(3);
    expect(picked).toHaveLength(5);
  });

  it("shows what passes — fewer than five — and does not refill with a repeat", () => {
    const only = [1, 2, 3, 4, 5, 6].map((n) => date({ startsAt: day(n), organizerId: "one", categoryId: "x" }));
    expect(pickVaried(only)).toHaveLength(1);
  });

  it("treats a date without an organiser id as its own organiser", () => {
    const anonymous = [1, 2, 3].map((n) => date({ startsAt: day(n), categoryId: `c${n}` }));
    expect(pickVaried(anonymous)).toHaveLength(3);
  });

  it("answers in start order and is deterministic", () => {
    const events = [4, 1, 3, 2].map((n) => date({ startsAt: day(n), organizerId: `o${n}`, categoryId: `c${n}` }));
    const first = pickVaried(events);
    expect(first.map((event) => event.startsAt)).toEqual([...first.map((event) => event.startsAt)].sort());
    expect(pickVaried([...events].reverse()).map((event) => event.id)).toEqual(first.map((event) => event.id));
  });

  it("drops a repeated id", () => {
    const one = date({ startsAt: day(1), organizerId: "a", id: "same" });
    expect(pickVaried([one, { ...one }])).toHaveLength(1);
  });
});

describe("pickVariedWeek — the week, then the fortnight (DEC-0185 §2)", () => {
  const varied = (days: readonly number[]) =>
    days.map((n) => date({ startsAt: day(n), organizerId: `o${n}`, categoryId: `c${n % 3}` }));

  it("stays inside seven days where the week makes five", () => {
    const { events, window } = pickVariedWeek(varied([1, 2, 3, 4, 5, 6, 10, 12]), NOW);
    expect(events).toHaveLength(5);
    expect(window).toBe("week");
  });

  it("widens to 14 days where the week passes fewer than five", () => {
    const { events, window } = pickVariedWeek(varied([1, 2, 9, 10, 12, 13]), NOW);
    expect(events).toHaveLength(5);
    expect(window).toBe("upcoming");
  });

  it("counts what passes the rules, not what exists: eight courses of one organiser are a thin week", () => {
    const courses = Array.from({ length: 8 }, (_, n) =>
      date({ startsAt: day(1 + (n % 5)), organizerId: "vhs", categoryId: "education-health" }),
    );
    const later = varied([9, 10, 11]);
    const { events, window } = pickVariedWeek([...courses, ...later], NOW);
    expect(events).toHaveLength(4);
    expect(window).toBe("upcoming");
  });

  it("ignores everything past 14 days and everything already over", () => {
    const { events } = pickVariedWeek(varied([-1, 20, 30]), NOW);
    expect(events).toEqual([]);
  });

  it("answers an empty list for nothing on, with the week as its window", () => {
    expect(pickVariedWeek([], NOW)).toEqual({ events: [], window: "week" });
  });
});
