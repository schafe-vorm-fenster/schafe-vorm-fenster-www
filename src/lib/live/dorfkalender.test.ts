import { describe, expect, it } from "vitest";

import { dictionary } from "@/src/lib/i18n/dictionary";

import { legendCenters, legendLabels, PHONE_GEOMETRY, pickRows, SLOTS } from "./dorfkalender";

import type { LiveEvent } from "./types";

const DEFAULTS = dictionary("de").dorfkalender.defaults;

function event(over: Partial<LiveEvent> & Pick<LiveEvent, "id" | "startsAt">): LiveEvent {
  return { title: `Termin ${over.id}`, placeName: "Schlatkow", communityId: "geoname.1", ...over };
}

describe("the phone's geometry", () => {
  it("fills the display exactly: header plus five rows", () => {
    const { header, row, rim, height } = PHONE_GEOMETRY;
    expect(header + SLOTS.length * row).toBe(height - 2 * rim);
  });

  it("centres the legend entries on the header and on each row, 82 px apart", () => {
    const centers = legendCenters();
    expect(centers).toHaveLength(6);
    expect(centers[0]).toBe(85);
    expect(centers[1]).toBe(10 + 150 + 41);
    for (let index = 2; index < centers.length; index += 1) {
      expect(centers[index]! - centers[index - 1]!).toBe(82);
    }
  });
});

describe("the legend", () => {
  it("names the place, the four categories of categories.ts, and the neighbours", () => {
    expect(legendLabels("de", dictionary("de").dorfkalender)).toEqual([
      "Dein Ort",
      "Versorgung",
      "Gemeindeleben",
      "Bildung & Gesundheit",
      "Kultur & Tourismus",
      "In den Nachbarorten",
    ]);
  });
});

describe("pickRows", () => {
  const base = { communityId: "geoname.1", placeName: "Schlatkow", defaults: DEFAULTS, locale: "de" as const };

  it("falls back to the five fixed rows when nothing is found", () => {
    const rows = pickRows({ ...base, own: [], nearby: [] });
    expect(rows.map((row) => row.title)).toEqual(DEFAULTS.map((row) => row.title));
    expect(rows.every((row) => row.source === "default")).toBe(true);
  });

  it("fills every slot on its own: real and default rows mix", () => {
    const rows = pickRows({
      ...base,
      own: [
        event({ id: "b", startsAt: "2026-11-20T09:00:00Z", categoryId: "community-life", title: "Spaetes Treffen" }),
        event({ id: "a", startsAt: "2026-11-14T09:00:00Z", categoryId: "community-life", title: "Fruehes Treffen" }),
        event({ id: "c", startsAt: "2026-11-15T17:00:00Z", categoryId: "culture-tourism", title: "Konzert" }),
      ],
      nearby: [],
    });
    expect(rows[0]?.source).toBe("default");
    // The next date of its category, not the first in the list.
    expect(rows[1]).toMatchObject({ source: "real", title: "Fruehes Treffen", weekday: "Sa", day: 14, time: "10:00" });
    expect(rows[2]?.source).toBe("default");
    expect(rows[3]).toMatchObject({ source: "real", title: "Konzert" });
    expect(rows[4]?.source).toBe("default");
  });

  it("takes the neighbours slot from another place only", () => {
    const rows = pickRows({
      ...base,
      own: [],
      nearby: [
        event({ id: "own", startsAt: "2026-11-12T09:00:00Z", communityId: "geoname.1", title: "Hier" }),
        event({ id: "far", startsAt: "2026-11-13T09:00:00Z", communityId: "geoname.2", placeName: "Rubkow", title: "Dort" }),
      ],
    });
    expect(rows[4]).toMatchObject({ source: "real", title: "Dort", place: "Rubkow" });
  });

  it("prefers a one-off over an earlier recurring date of the same slot (DEC-0210)", () => {
    const rows = pickRows({
      ...base,
      own: [
        event({ id: "w", startsAt: "2026-11-13T09:00:00Z", categoryId: "community-life", occurrence: "recurring", title: "Woechentlich" }),
        event({ id: "o", startsAt: "2026-11-25T09:00:00Z", categoryId: "community-life", occurrence: "once", title: "Einmalig" }),
      ],
      nearby: [],
    });
    expect(rows[1]).toMatchObject({ title: "Einmalig" });
  });

  it("takes a one-off culture date for the neighbours slot over an earlier plain one", () => {
    const rows = pickRows({
      ...base,
      own: [],
      nearby: [
        event({ id: "n1", startsAt: "2026-11-13T09:00:00Z", communityId: "geoname.2", placeName: "Rubkow", categoryId: "sports", title: "Sport" }),
        event({ id: "n2", startsAt: "2026-11-15T09:00:00Z", communityId: "geoname.3", placeName: "Lassan", categoryId: "culture-tourism", title: "Lesung" }),
      ],
    });
    expect(rows[4]).toMatchObject({ title: "Lesung", place: "Lassan" });
  });

  it("reads an all-day date without a time", () => {
    const rows = pickRows({
      ...base,
      own: [event({ id: "d", startsAt: "2026-11-14T00:00:00Z", allDay: true, categoryId: "everyday-supply" })],
      nearby: [],
    });
    expect(rows[0]?.time).toBeUndefined();
  });

  it("keeps the fixed order whatever the dates say", () => {
    expect(SLOTS.map((slot) => (slot.kind === "category" ? slot.category : "neighbours"))).toEqual([
      "everyday-supply",
      "community-life",
      "education-health",
      "culture-tourism",
      "neighbours",
    ]);
  });
});
