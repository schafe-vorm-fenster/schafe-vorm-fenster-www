import { afterEach, describe, expect, it, vi } from "vitest";

import page from "@/src/clients/community-site/fixtures/community-page.json";

import { publicNearbyEvents, publicPlaceEvents, publicRegionRanking } from "./public-source";
import { nearbyWindow } from "./widening";
import { SHOWCASE_COMMUNITY } from "./showcase";

/**
 * The tokenless source, module level: one recorded page in, the three
 * answers the interface modules ask for out.
 *
 * The fixture is the real Schlatkow page of 2026-09-18, trimmed to three of
 * its own dates and three widened ones. `now` is pinned just before them, so
 * these assert the window logic rather than the calendar.
 */

const NOW = new Date("2026-09-17T12:00:00.000Z");

const PLACE = {
  communityId: SHOWCASE_COMMUNITY.communityId,
  name: SHOWCASE_COMMUNITY.name,
  slug: SHOWCASE_COMMUNITY.slug,
  lat: SHOWCASE_COMMUNITY.lat,
  lng: SHOWCASE_COMMUNITY.lng,
};

function servePage(events?: readonly unknown[]): ReturnType<typeof vi.fn> {
  const served =
    events === undefined
      ? page
      : { ...page, props: { ...page.props, pageProps: { ...page.props.pageProps, events } } };
  const body = [
    "<!doctype html><html><body>",
    `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify(served)}</script>`,
    "</body></html>",
  ].join("");
  const fetchMock = vi.fn(async () => new Response(body, { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("position 1 — a place's own dates", () => {
  it("keeps the place's own rows and drops the widening the page already did", async () => {
    servePage();
    const events = await publicPlaceEvents(PLACE, { window: "upcoming", rowCount: 5, now: NOW });

    expect(events.length).toBeGreaterThan(0);
    // TS-WEB-0008 D1: position 1 may not present a widened list as the narrow one.
    for (const event of events) expect(event.placeName).toBe("Schlatkow");
  });

  it("returns them in chronological order, whatever order the source had", async () => {
    servePage();
    const events = await publicPlaceEvents(PLACE, { window: "upcoming", rowCount: 5, now: NOW });
    const starts = events.map((event) => event.startsAt);
    expect([...starts].sort()).toEqual(starts);
  });

  it("honours the row count the module asked for", async () => {
    servePage();
    const events = await publicPlaceEvents(PLACE, { window: "upcoming", rowCount: 1, now: NOW });
    expect(events).toHaveLength(1);
  });

  it("answers empty for a window nothing falls into — the conversion moment, not a failure", async () => {
    servePage();
    const events = await publicPlaceEvents(PLACE, {
      window: "upcoming",
      rowCount: 5,
      now: new Date("2027-01-01T00:00:00.000Z"),
    });
    expect(events).toEqual([]);
  });

  it("asks the canonical route of the public site, once", async () => {
    const fetchMock = servePage();
    await publicPlaceEvents(PLACE, { window: "upcoming", rowCount: 3, now: NOW });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("/schlatkow.2838887");
  });
});

describe("position 2 — this week nearby", () => {
  it("shows the neighbours and not the anchor's own place", async () => {
    servePage();
    const { events, places } = await publicNearbyEvents(PLACE, {
      radiusKm: 15,
      rowCount: 5,
      now: NOW,
    });

    expect(places.some((place) => place.slug === SHOWCASE_COMMUNITY.slug)).toBe(false);
    for (const event of events) expect(event.placeName).not.toBe("Schlatkow");
  });

  it("cuts by the radius it was given, not by a result cap", async () => {
    servePage();
    const near = await publicNearbyEvents(PLACE, { radiusKm: 15, rowCount: 5, now: NOW });
    const wide = await publicNearbyEvents(PLACE, { radiusKm: 40, rowCount: 5, now: NOW });
    expect(wide.places.length).toBeGreaterThan(near.places.length);
  });

  it("spends one page fetch, not one per neighbour", async () => {
    const fetchMock = servePage();
    await publicNearbyEvents(PLACE, { radiusKm: 15, rowCount: 5, now: NOW });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("TS-WEB-0008-A18: position 2 fills its rows — this week first, then the dates after it", () => {
  const DAY = 24 * 60 * 60 * 1000;
  /** A neighbour's date `days` after NOW, cloned from the fixture's own widened rows. */
  async function neighbourTemplate() {
    servePage();
    const { events } = await publicNearbyEvents(PLACE, { radiusKm: 15, rowCount: 5, now: NOW });
    const id = events[0]?.communityId;
    const template = page.props.pageProps.events.find((event) => event.community?._id === id);
    if (template === undefined) throw new Error("the fixture carries no neighbour within 15 km");
    vi.unstubAllGlobals();
    return (days: number, index: number) => ({
      ...template,
      _id: `${template._id}-${index}`,
      summary: `Termin ${index}`,
      start: new Date(NOW.getTime() + days * DAY).toISOString(),
      end: new Date(NOW.getTime() + days * DAY + 3_600_000).toISOString(),
    });
  }

  it("fills a thin week with the next dates and says the list reaches past it", async () => {
    const at = await neighbourTemplate();
    // Lehre's shape on 2026-10-27: two dates in the week, more after it.
    servePage([at(30, 6), at(2, 1), at(12, 4), at(5, 2), at(9, 3), at(20, 5)]);
    const { events } = await publicNearbyEvents(PLACE, { radiusKm: 15, rowCount: 5, now: NOW });

    expect(events.map((event) => event.title)).toEqual(["Termin 1", "Termin 2", "Termin 3", "Termin 4", "Termin 5"]);
    expect(nearbyWindow(events, NOW)).toBe("upcoming");
  });

  it("stays inside the week where the week alone fills the rows", async () => {
    const at = await neighbourTemplate();
    servePage([1, 2, 3, 4, 5, 6, 9].map((days, index) => at(days, index)));
    const { events } = await publicNearbyEvents(PLACE, { radiusKm: 15, rowCount: 5, now: NOW });

    expect(events).toHaveLength(5);
    expect(nearbyWindow(events, NOW)).toBe("week");
  });

  it("never reaches back before now", async () => {
    const at = await neighbourTemplate();
    servePage([at(-1, 0), at(3, 1)]);
    const { events } = await publicNearbyEvents(PLACE, { radiusKm: 15, rowCount: 5, now: NOW });
    expect(events.map((event) => event.title)).toEqual(["Termin 1"]);
  });
});

describe("position 3 — the county's active places", () => {
  it("ranks the neighbours by how many dates they carry, and resolves their slugs", async () => {
    servePage();
    const examples = await publicRegionRanking(PLACE, { max: 6, now: NOW });

    expect(examples.length).toBeGreaterThan(0);
    for (const example of examples) {
      // The slug is the whole point: an events row carries an id and a name,
      // never a slug, so an unresolvable one must not become an example.
      expect(example.slug).toMatch(/^[a-z0-9-]+$/u);
      expect(example.eventCount).toBeGreaterThan(0);
    }
    expect(examples.map((example) => example.slug)).not.toContain(SHOWCASE_COMMUNITY.slug);
  });

  it("orders by count, so the set is a ranking and not a list", async () => {
    servePage();
    const counts = (await publicRegionRanking(PLACE, { max: 6, now: NOW })).map(
      (example) => example.eventCount,
    );
    expect([...counts].sort((a, b) => b - a)).toEqual(counts);
  });
});
