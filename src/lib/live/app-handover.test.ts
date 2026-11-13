import { afterEach, describe, expect, it, vi } from "vitest";

import {
  APP_HOST,
  APP_URL,
  appUrl,
  CALENDAR_ORIGIN,
  calendarSlug,
  calendarUrl,
  helpUrl,
  isSlugShaped,
  registrationQuery,
} from "./app-handover";

import type { Place } from "./types";

const resolved: Place = {
  communityId: "geoname.900101",
  name: "Schlatkow",
  slug: "schlatkow",
  lat: 54,
  lng: 13.4,
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TS-WEB-0008-A11: the calendar URL is {CALENDAR_ORIGIN}/{slug}.{geonameId}, both from one geo-api place", () => {
  it("builds the village calendar's own address from a resolved place (issue #81)", () => {
    expect(CALENDAR_ORIGIN).toBe("https://schafe-vorm-fenster.de");
    expect(calendarUrl(resolved)).toBe("https://schafe-vorm-fenster.de/schlatkow.900101");
    expect(
      calendarUrl({ slug: "lehre", communityId: "geoname.2879378" }),
    ).toBe("https://schafe-vorm-fenster.de/lehre.2879378");
  });

  it("never points at the app host, which serves no calendar yet (DEC-0035, measured 2026-10-27)", () => {
    expect(calendarUrl(resolved)).not.toContain("app.");
  });

  it("refuses a place whose slug or geoname id is not what geo-api answers", () => {
    expect(calendarUrl({ slug: "../../admin", communityId: "geoname.1" })).toBeUndefined();
    expect(calendarUrl({ slug: "Groß Kiesow", communityId: "geoname.1" })).toBeUndefined();
    expect(calendarUrl({ slug: "schlatkow", communityId: "" })).toBeUndefined();
    expect(calendarUrl({ slug: "schlatkow", communityId: "geoname.abc" })).toBeUndefined();
    expect(calendarSlug({ slug: "gross-kiesow", communityId: "geoname.2916593" })).toBe("gross-kiesow.2916593");
    expect(isSlugShaped("gross-kiesow")).toBe(true);
  });

  it("preserves inbound campaign parameters across the handover (FUN-WEB-0048)", () => {
    const url = calendarUrl(resolved, {
      campaign: new URLSearchParams({ etcc_cmp: "plakat-2026", etcc_med: "qr", unrelated: "x" }),
    });
    expect(url).toContain("etcc_cmp=plakat-2026");
    expect(url).toContain("etcc_med=qr");
    expect(url).not.toContain("unrelated");
  });

  it("appends nothing to the app URL for registration — no prefill contract exists (DEC-0029)", () => {
    expect(calendarUrl(resolved)).not.toContain("ort=");
    expect(registrationQuery(resolved)).toEqual({ ort: "schlatkow" });
    expect(registrationQuery(undefined)).toEqual({});
  });

  it("follows the environment when the calendars move (DEC-0035)", async () => {
    vi.stubEnv("NEXT_PUBLIC_COMMUNITY_SITE_ORIGIN", "https://kalender.example.org");
    vi.resetModules();
    const fresh = await import("./app-handover");
    expect(fresh.calendarUrl(resolved)).toBe("https://kalender.example.org/schlatkow.900101");
    vi.resetModules();
  });
});

describe("TS-WEB-0017-A11: every link to the app is APP_URL from the one module (DEC-0177)", () => {
  it("is the Schlatkow village calendar while the app has no domain of its own", () => {
    expect(APP_URL).toBe("https://schafe-vorm-fenster.de/schlatkow.2838887");
    expect(APP_HOST).toBeUndefined();
    expect(APP_URL).not.toContain("app.schafe-vorm-fenster.de");
  });

  it("answers APP_URL for help — the per-article paths answered 404 (DEC-0177)", () => {
    expect(helpUrl()).toBe(APP_URL);
  });

  it("hands over to APP_URL with the campaign parameters and nothing else (FUN-WEB-0048)", () => {
    expect(appUrl()).toBe(APP_URL);
    const url = new URL(appUrl({ campaign: { etcc_cmp: "frühjahr", ort: "lehre" } }));
    expect(`${url.origin}${url.pathname}`).toBe(APP_URL);
    expect(url.searchParams.get("etcc_cmp")).toBe("frühjahr");
    expect(url.searchParams.has("ort")).toBe(false);
  });
});
