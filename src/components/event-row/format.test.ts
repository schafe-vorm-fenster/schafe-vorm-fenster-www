import { describe, expect, it } from "vitest";

import { formatEventDay, SITE_TIME_ZONE } from "./format";

describe("TS-008-A: the event row splits a date into day and month", () => {
  it("returns the day number without a leading zero", () => {
    expect(formatEventDay("2026-09-05").day).toBe("5");
    expect(formatEventDay("2026-09-12").day).toBe("12");
  });

  it("returns the month uppercase and without the abbreviation dot", () => {
    expect(formatEventDay("2026-09-12").month).toMatch(/^SEP/);
    expect(formatEventDay("2026-09-12").month).not.toContain(".");
    expect(formatEventDay("2026-01-02").month).toMatch(/^JAN/);
  });

  it("localises the month, keeping the day numeric", () => {
    expect(formatEventDay("2026-10-03", "en").month).toBe("OCT");
    expect(formatEventDay("2026-10-03", "en").day).toBe("3");
  });

  it("reads every date in one time zone, so server and client agree", () => {
    expect(SITE_TIME_ZONE).toBe("Europe/Berlin");
    // 23:30 UTC on the 12th is already the 13th in Berlin.
    expect(formatEventDay("2026-09-12T23:30:00Z").iso).toBe("2026-09-13");
    expect(formatEventDay("2026-09-12T10:00:00Z").iso).toBe("2026-09-12");
  });

  it("emits an ISO day for `<time datetime>`", () => {
    expect(formatEventDay("2026-09-12").iso).toBe("2026-09-12");
  });

  it("refuses a value that is not a date rather than rendering NaN", () => {
    expect(() => formatEventDay("übermorgen")).toThrow(RangeError);
  });
});
