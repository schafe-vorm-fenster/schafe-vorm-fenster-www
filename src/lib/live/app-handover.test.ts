import { afterEach, describe, expect, it, vi } from "vitest";

import {
  APP_ORIGIN,
  calendarUrl,
  calendarUrlForSlug,
  helpUrl,
  isSlugShaped,
  registrationQuery,
} from "./app-handover";

import type { Place } from "./types";

const resolved: Place = {
  communityId: "geoname.900101",
  name: "Beispielgemeinde Musterdorf",
  slug: "beispielgemeinde-musterdorf",
  lat: 54,
  lng: 13.4,
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TS-008-A11: the handover URL is {APP_ORIGIN}/{slug}, built from a geo-api slug", () => {
  it("builds the calendar URL from a resolved place", () => {
    expect(calendarUrl(resolved)).toBe(`${APP_ORIGIN}/beispielgemeinde-musterdorf`);
  });

  it("refuses a slug that geo-api has not confirmed", () => {
    expect(calendarUrlForSlug("beispielgemeinde-musterdorf", { resolved: false })).toBeUndefined();
  });

  it("refuses a slug that is not slug-shaped, even when the caller says it resolved", () => {
    expect(calendarUrlForSlug("../../admin", { resolved: true })).toBeUndefined();
    expect(calendarUrlForSlug("Groß Kiesow", { resolved: true })).toBeUndefined();
    expect(isSlugShaped("gross-kiesow")).toBe(true);
  });

  it("preserves inbound campaign parameters across the handover (WEB-F-048)", () => {
    const url = calendarUrl(resolved, {
      campaign: new URLSearchParams({ etcc_cmp: "plakat-2026", etcc_med: "qr", unrelated: "x" }),
    });
    expect(url).toContain("etcc_cmp=plakat-2026");
    expect(url).toContain("etcc_med=qr");
    expect(url).not.toContain("unrelated");
  });

  it("appends nothing to the app URL for registration — no prefill contract exists (DEC-029)", () => {
    expect(calendarUrl(resolved)).not.toContain("ort=");
    expect(registrationQuery(resolved)).toEqual({ ort: "beispielgemeinde-musterdorf" });
    expect(registrationQuery(undefined)).toEqual({});
  });

  it("follows the environment when the calendars move off the apex (DEC-035)", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_ORIGIN", "https://schafe-vorm-fenster.de");
    vi.resetModules();
    const fresh = await import("./app-handover");
    expect(fresh.calendarUrl(resolved)).toBe("https://schafe-vorm-fenster.de/beispielgemeinde-musterdorf");
    vi.resetModules();
  });
});

describe("TS-017-A11: help URLs come out of the same one module", () => {
  it("answers the app root for an article the mocked table does not know (Q-041)", () => {
    expect(helpUrl("gibt-es-nicht")).toBe(APP_ORIGIN);
    expect(helpUrl()).toBe(APP_ORIGIN);
  });

  it("answers the mocked per-article path for a known article", () => {
    expect(helpUrl("kalender")).toBe(`${APP_ORIGIN}/hilfe/kalender`);
  });
});
