import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createEtrackerTracker } from "@/src/lib/analytics/etracker-tracker";
import { getAnalyticsTracker, resetAnalyticsTrackerForTests } from "@/src/lib/analytics/index";
import { createMockTracker } from "@/src/lib/analytics/mock-tracker";

describe("TS-012-A1/A9: the mock tracker records nothing", () => {
  it("never touches document.cookie or web storage", () => {
    const cookieBefore = typeof document === "undefined" ? "" : document.cookie;
    const tracker = createMockTracker();
    tracker.trackConversion("register-as-publisher", "handover", { place: "schlatkow" });
    tracker.trackPageView?.();
    if (typeof document !== "undefined") expect(document.cookie).toBe(cookieBefore);
    if (typeof localStorage !== "undefined") expect(localStorage.length).toBe(0);
    if (typeof sessionStorage !== "undefined") expect(sessionStorage.length).toBe(0);
  });

  it("logs to the console instead of collecting anything", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const tracker = createMockTracker();
    tracker.trackConversion("register-as-publisher", "handover");
    expect(spy).toHaveBeenCalledWith(
      "[analytics:mock] conversion",
      expect.objectContaining({ goalId: "register-as-publisher", stage: "handover" }),
    );
    spy.mockRestore();
  });
});

describe("TS-012-A4: trackConversion never throws and never blocks", () => {
  it("the mock tracker never throws, loader ready or not", () => {
    const tracker = createMockTracker();
    expect(() => tracker.trackConversion("buy-calendar-licence", "completed")).not.toThrow();
  });

  it("the real adapter is a silent no-op with no vendor global present", () => {
    const tracker = createEtrackerTracker();
    expect(() => tracker.trackConversion("buy-calendar-licence", "completed")).not.toThrow();
  });

  it("the real adapter is a silent no-op when the vendor call throws", () => {
    const original = (globalThis as { window?: unknown }).window;
    (globalThis as { window?: unknown }).window = {
      _etracker: {
        sendEvent: () => {
          throw new Error("blocked");
        },
      },
    };
    const tracker = createEtrackerTracker();
    expect(() => tracker.trackConversion("buy-calendar-licence", "completed")).not.toThrow();
    (globalThis as { window?: unknown }).window = original;
  });
});

describe("TS-012 D2: getAnalyticsTracker is the one injection point", () => {
  beforeEach(() => {
    resetAnalyticsTrackerForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetAnalyticsTrackerForTests();
  });

  it("returns the mock while the real adapter is disabled (row 12/Q-040)", () => {
    vi.stubEnv("NEXT_PUBLIC_ETRACKER_REAL_ADAPTER", "");
    const tracker = getAnalyticsTracker();
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    tracker.trackConversion("register-as-publisher", "handover");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("caches one tracker instance per process", () => {
    expect(getAnalyticsTracker()).toBe(getAnalyticsTracker());
  });
});
