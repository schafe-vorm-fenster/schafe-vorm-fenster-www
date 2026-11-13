import { afterEach, describe, expect, it, vi } from "vitest";

import { CommunitySiteEventSchema } from "@/src/clients/community-site/client";
import page from "@/src/clients/community-site/fixtures/community-page.json";

import { toLiveEvents, toLiveEventsFromSite } from "./adapters";
import { publicNearbyEvents, publicPlaceEvents } from "./public-source";
import { SHOWCASE_COMMUNITY } from "./showcase";
import { isTestOrganizer, testOrganizerIds } from "./test-organizers";

/**
 * TS-WEB-0008-A20 — a test organizer's date reaches no surface (DEC-0173 §3).
 *
 * The rule is the village calendar's own (`community-site`,
 * `filterTestEvents`): the organizer ids in `MATEO_TEST_USER_IDS` are test
 * accounts and their dates are dropped. The ids here are invented; the real
 * list is configuration and never appears in this repository.
 */

const TEST_ORGANIZER = "test-organizer-1";
const REAL_ORGANIZER = "real-organizer";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("the id list — the community site's semantics", () => {
  it("is empty when the variable is unset or blank, and then filters nothing", () => {
    expect(testOrganizerIds({}).size).toBe(0);
    expect(testOrganizerIds({ MATEO_TEST_USER_IDS: " , " }).size).toBe(0);
    expect(isTestOrganizer(TEST_ORGANIZER, new Set())).toBe(false);
  });

  it("splits on commas, trims each id and matches exactly", () => {
    const ids = testOrganizerIds({ MATEO_TEST_USER_IDS: ` ${TEST_ORGANIZER} , other ` });
    expect([...ids]).toEqual([TEST_ORGANIZER, "other"]);
    expect(isTestOrganizer(TEST_ORGANIZER, ids)).toBe(true);
    expect(isTestOrganizer(TEST_ORGANIZER.toUpperCase(), ids)).toBe(false);
    expect(isTestOrganizer(undefined, ids)).toBe(false);
  });
});

describe("TS-WEB-0008-A20: both adapters drop a test organizer's date", () => {
  const upstream = (id: string, organizer: string | undefined, summary: string) => ({
    id,
    summary,
    start: 1_791_000_000,
    categories: [],
    tags: [],
    ...(organizer === undefined ? {} : { "organizer.id": organizer }),
  });

  const site = (id: string, organizer: string | undefined, summary: string) =>
    CommunitySiteEventSchema.parse({
      _id: id,
      summary,
      start: "2026-10-12T17:00:00.000Z",
      ...(organizer === undefined ? {} : { calendar: { organizer: { _id: organizer } } }),
    });

  it("events-api: drops the date by `organizer.id`, keeps the rest in order", () => {
    vi.stubEnv("MATEO_TEST_USER_IDS", TEST_ORGANIZER);
    const events = toLiveEvents([
      upstream("1", REAL_ORGANIZER, "Chorprobe"),
      upstream("2", TEST_ORGANIZER, "Recurring TEST Event"),
      upstream("3", undefined, "Lesung"),
    ]);
    expect(events.map((event) => event.id)).toEqual(["1", "3"]);
  });

  it("public site: drops the date by `calendar.organizer._id`, keeps the rest in order", () => {
    vi.stubEnv("MATEO_TEST_USER_IDS", TEST_ORGANIZER);
    const events = toLiveEventsFromSite([
      site("1", REAL_ORGANIZER, "Chorprobe"),
      site("2", TEST_ORGANIZER, "Allday TEST Event"),
      site("3", undefined, "Lesung"),
    ]);
    expect(events.map((event) => event.id)).toEqual(["1", "3"]);
  });

  it("keeps a real date whose title says TEST — the rule is who organised it, not what it is called", () => {
    vi.stubEnv("MATEO_TEST_USER_IDS", TEST_ORGANIZER);
    expect(toLiveEvents([upstream("1", REAL_ORGANIZER, "Sirenen-TEST")])).toHaveLength(1);
  });

  it("filters nothing while the list is unset", () => {
    vi.stubEnv("MATEO_TEST_USER_IDS", "");
    expect(toLiveEvents([upstream("2", TEST_ORGANIZER, "Recurring TEST Event")])).toHaveLength(1);
  });
});

describe("TS-WEB-0008-A20: through the modules that read the public site", () => {
  const NOW = new Date("2026-09-17T12:00:00.000Z");
  const PLACE = {
    communityId: SHOWCASE_COMMUNITY.communityId,
    name: SHOWCASE_COMMUNITY.name,
    slug: SHOWCASE_COMMUNITY.slug,
    lat: SHOWCASE_COMMUNITY.lat,
    lng: SHOWCASE_COMMUNITY.lng,
  };

  /** The recorded Schlatkow page with every date moved to a test organizer's calendar. */
  function serveTestOrganizerPage(): void {
    const events = page.props.pageProps.events.map((event) => ({
      ...event,
      summary: `TEST ${event.summary}`,
      calendar: { organizer: { _id: TEST_ORGANIZER } },
    }));
    const data = { ...page, props: { ...page.props, pageProps: { ...page.props.pageProps, events } } };
    const body = `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify(data)}</script>`;
    vi.stubGlobal("fetch", vi.fn(async () => new Response(body, { status: 200 })));
  }

  const read = async () => ({
    own: await publicPlaceEvents(PLACE, { window: "upcoming", rowCount: 5, now: NOW }),
    nearby: (await publicNearbyEvents(PLACE, { radiusKm: 15, rowCount: 5, now: NOW })).events,
  });

  it("shows them while no list is configured — the control", async () => {
    vi.stubEnv("MATEO_TEST_USER_IDS", "");
    serveTestOrganizerPage();
    const { own, nearby } = await read();
    expect(own.length).toBeGreaterThan(0);
    expect(nearby.length).toBeGreaterThan(0);
  });

  it("position 1 and the nearby list show none of them once the organizer is listed", async () => {
    vi.stubEnv("MATEO_TEST_USER_IDS", TEST_ORGANIZER);
    serveTestOrganizerPage();
    const { own, nearby } = await read();
    expect(own).toEqual([]);
    expect(nearby).toEqual([]);
  });
});
