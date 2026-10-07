import { describe, expect, it } from "vitest";

import { formatDistance } from "./distance";
import { fitEvents, hasText, isPlaceholderTitle } from "./quality";

import type { LiveEvent } from "./types";

const event = (overrides: Partial<LiveEvent>): LiveEvent => ({
  id: "a",
  title: "Volleyball",
  startsAt: "2026-10-12T17:00:00.000Z",
  placeName: "Schlatkow",
  ...overrides,
});

describe("DEC-0152 / TS-WEB-0020-A15: a placeholder is not a date, and one date is not two", () => {
  it("drops the calendars' own empty-slot invitation, in any casing", () => {
    expect(isPlaceholderTitle("hier könnte dein Termin stehen")).toBe(true);
    expect(isPlaceholderTitle("Hier koennte Ihr Termin stehen!")).toBe(true);
    expect(isPlaceholderTitle("  ")).toBe(true);
    expect(isPlaceholderTitle("Termin für die Feuerwehr")).toBe(false);
  });

  it("keeps the first of two rows with one title, one start and one place, whatever their ids", () => {
    const rows = fitEvents([
      event({ id: "1", title: "hier könnte dein Termin stehen", placeName: "Rubkow" }),
      event({ id: "2", title: "hier könnte dein Termin stehen", placeName: "Rubkow" }),
      event({ id: "3" }),
      event({ id: "4" }),
      event({ id: "5", startsAt: "2026-10-13T17:00:00.000Z" }),
    ]);
    expect(rows.map((row) => row.id)).toEqual(["3", "5"]);
  });

  it("counts a description only when it says more than the title", () => {
    expect(hasText(event({ description: "Volleyball" }))).toBe(false);
    expect(hasText(event({ description: "Training in der Sporthalle, Gäste willkommen, Bälle sind da." }))).toBe(true);
  });

  it("states a distance in whole kilometres and never as zero", () => {
    expect(formatDistance(0.3)).toBe("1 km");
    expect(formatDistance(6.4)).toBe("6 km");
  });
});
