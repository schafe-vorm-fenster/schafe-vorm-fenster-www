import { describe, expect, it } from "vitest";

import { selectStoryExamples } from "./story-examples";

import type { LiveEvent } from "@/src/lib/live/types";

const at = (day: number) => `2026-10-${String(day).padStart(2, "0")}T17:00:00.000Z`;

const POOL: LiveEvent[] = [
  { id: "sport", title: "Frauensport", startsAt: at(8), categoryId: "community-life", distanceKm: 0 },
  { id: "supply", title: "Bäckerwagen", startsAt: at(8), categoryId: "everyday-supply", distanceKm: 0 },
  {
    id: "council-far",
    title: "Sitzung der Gemeindevertretung",
    startsAt: at(9),
    categoryId: "community-life",
    distanceKm: 40,
    description: "Öffentliche Sitzung, Tagesordnung: Haushalt, Straßenbeleuchtung, Anfragen der Einwohner.",
  },
  {
    id: "council-near",
    title: "Gemeindevertretung Schmatzin",
    startsAt: at(20),
    categoryId: "community-life",
    distanceKm: 4,
    description: "Öffentliche Sitzung der Gemeindevertretung mit Einwohnerfragestunde zu Beginn der Sitzung.",
  },
];

const COUNCIL = { category: "community-life", topic: /gemeindevertret|sitzung/i };

describe("DEC-0152 / TS-WEB-0020-A14: a story's example is of its category, and the best of it", () => {
  it("never falls back to another category — no date of it, no example", () => {
    expect(selectStoryExamples(POOL, [{ category: "culture-tourism" }])).toEqual([undefined]);
  });

  it("prefers the topic, then the text, then the nearer date over the sooner one", () => {
    expect(selectStoryExamples(POOL, [COUNCIL])[0]?.id).toBe("council-near");
  });

  it("with `topicRequired`, an off-topic date of the right category is no example", () => {
    const supply = { category: "everyday-supply", topic: /bäcker|markt/i, topicRequired: true };
    const pool: LiveEvent[] = [
      { id: "waste", title: "Restmüll", startsAt: at(8), categoryId: "everyday-supply" },
    ];
    expect(selectStoryExamples(pool, [supply])).toEqual([undefined]);
    expect(selectStoryExamples([...pool, { id: "van", title: "Bäckerwagen Kurzweg", startsAt: at(9), categoryId: "everyday-supply" }], [supply])[0]?.id).toBe("van");
  });

  it("does not choose a row the page already shows, nor one another story took", () => {
    const [first, second] = selectStoryExamples(POOL, [COUNCIL, COUNCIL], new Set(["council-near"]));
    expect(first?.id).toBe("council-far");
    expect(second?.id).toBe("sport");
  });
});
