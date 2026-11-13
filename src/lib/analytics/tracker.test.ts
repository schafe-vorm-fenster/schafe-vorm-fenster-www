import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { etrackerSecureCode } from "@/src/lib/analytics/config";
import { attributesObject, createEtrackerTracker } from "@/src/lib/analytics/etracker-tracker";
import { createMockTracker } from "@/src/lib/analytics/mock-tracker";
import { pageView } from "@/src/lib/analytics/page-view";
import { getAnalyticsTracker, resetAnalyticsTrackerForTests } from "@/src/lib/analytics/tracker";

const CODE = "TestCode1";
const CTA = { category: "buy-calendar-licence", action: "click", object: "order.primary", type: "de/calendar" } as const;

type Win = Record<string, unknown>;

function withWindow(win: Win, run: () => void): void {
  const original = (globalThis as { window?: unknown }).window;
  (globalThis as { window?: unknown }).window = win;
  try {
    run();
  } finally {
    (globalThis as { window?: unknown }).window = original;
  }
}

/** A stand-in for the loader's globals that records what the adapter sends. */
function fakeVendor() {
  const sent: unknown[] = [];
  const wrapperCalls: unknown[] = [];
  class UserDefinedEvent {
    constructor(
      readonly object: string,
      readonly category: string,
      readonly action: string,
      readonly type: string,
    ) {}
  }
  const win: Win = {
    _etracker: { sendEvent: (event: unknown) => sent.push(event) },
    et_UserDefinedEvent: UserDefinedEvent,
    et_eC_Wrapper: (parameters: unknown) => wrapperCalls.push(parameters),
  };
  return { win, sent, wrapperCalls };
}

describe("TS-WEB-0012-A1/A9: the mock tracker records nothing", () => {
  it("never touches document.cookie or web storage", () => {
    const cookieBefore = typeof document === "undefined" ? "" : document.cookie;
    const tracker = createMockTracker();
    tracker.trackConversion("register-as-publisher", "handover", { place: "schlatkow" });
    tracker.trackPageView(pageView("home", "de"));
    tracker.trackCtaClick(CTA);
    if (typeof document !== "undefined") expect(document.cookie).toBe(cookieBefore);
    if (typeof localStorage !== "undefined") expect(localStorage.length).toBe(0);
    if (typeof sessionStorage !== "undefined") expect(sessionStorage.length).toBe(0);
  });

  it("logs to the console instead of collecting anything", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const tracker = createMockTracker();
    tracker.trackConversion("register-as-publisher", "handover");
    tracker.trackCtaClick(CTA);
    expect(spy).toHaveBeenCalledWith(
      "[analytics:mock] conversion",
      expect.objectContaining({ goalId: "register-as-publisher", stage: "handover" }),
    );
    expect(spy).toHaveBeenCalledWith("[analytics:mock] cta", expect.objectContaining(CTA));
    spy.mockRestore();
  });
});

describe("TS-WEB-0012-A4: trackConversion never throws and never blocks", () => {
  it("the mock tracker never throws, loader ready or not", () => {
    const tracker = createMockTracker();
    expect(() => tracker.trackConversion("buy-calendar-licence", "completed")).not.toThrow();
  });

  it("the real adapter is a silent no-op with no vendor global present", () => {
    const tracker = createEtrackerTracker(CODE);
    withWindow({}, () => {
      expect(() => tracker.trackConversion("buy-calendar-licence", "completed")).not.toThrow();
      expect(() => tracker.trackCtaClick(CTA)).not.toThrow();
      expect(() => tracker.trackPageView(pageView("order", "de"))).not.toThrow();
    });
  });

  it("the real adapter is a silent no-op when the vendor call throws", () => {
    const tracker = createEtrackerTracker(CODE);
    const { win } = fakeVendor();
    win._etracker = {
      sendEvent: () => {
        throw new Error("blocked");
      },
    };
    win.et_eC_Wrapper = () => {
      throw new Error("blocked");
    };
    withWindow(win, () => {
      expect(() => tracker.trackConversion("buy-calendar-licence", "completed")).not.toThrow();
      expect(() => tracker.trackCtaClick(CTA)).not.toThrow();
      expect(() => tracker.trackPageView(pageView("order", "de"))).not.toThrow();
    });
  });
});

describe("DEC-0218: the real adapter's vendor calls", () => {
  it("sends a CTA click as et_UserDefinedEvent(object, category, action, type)", () => {
    const { win, sent } = fakeVendor();
    withWindow(win, () => createEtrackerTracker(CODE).trackCtaClick(CTA));
    expect(sent).toEqual([
      expect.objectContaining({ object: "order.primary", category: "buy-calendar-licence", action: "click", type: "de/calendar" }),
    ]);
  });

  it("sends a conversion with the goal as category, the stage as action and the page as type", () => {
    const { win, sent } = fakeVendor();
    withWindow(win, () => {
      const tracker = createEtrackerTracker(CODE);
      tracker.trackPageView(pageView("calendar", "en"));
      tracker.trackConversion("make-contact", "handover", { route: "calendar", channel: "whatsapp" });
    });
    expect(sent).toEqual([
      expect.objectContaining({
        object: "channel=whatsapp;route=calendar",
        category: "make-contact",
        action: "handover",
        type: "en/calendar",
      }),
    ]);
  });

  it("names the page for the loader and sends a virtual page view once the loader is there", () => {
    const { win, wrapperCalls } = fakeVendor();
    withWindow(win, () => createEtrackerTracker(CODE).trackPageView(pageView("order", "de")));
    expect(win.et_pagename).toBe("de/calendar/order");
    expect(win.et_areas).toBe("de/calendar");
    expect(wrapperCalls).toEqual([{ et_et: CODE, et_pagename: "de/calendar/order", et_areas: "de/calendar" }]);
  });

  it("before the loader has arrived, only names the page (the loader counts the first view itself)", () => {
    const win: Win = {};
    withWindow(win, () => createEtrackerTracker(CODE).trackPageView(pageView("home", "de")));
    expect(win.et_pagename).toBe("de/home");
    expect(win.et_areas).toBe("de/home");
  });

  it("serialises attributes in a stable order, and falls back to the goal id", () => {
    expect(attributesObject("make-contact", { route: "home", channel: "phone" })).toBe("channel=phone;route=home");
    expect(attributesObject("buy-calendar-licence")).toBe("buy-calendar-licence");
  });
});

describe("DEC-0218 §1: the secure code comes from NEXT_PUBLIC_ETRACKER_SECURE_CODE", () => {
  beforeEach(() => {
    resetAnalyticsTrackerForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetAnalyticsTrackerForTests();
  });

  it("is unset when the variable is missing or empty", () => {
    vi.stubEnv("NEXT_PUBLIC_ETRACKER_SECURE_CODE", "");
    expect(etrackerSecureCode()).toBeUndefined();
  });

  it("refuses a value outside the vendor's code shape", () => {
    vi.stubEnv("NEXT_PUBLIC_ETRACKER_SECURE_CODE", 'abc" onload="x');
    expect(etrackerSecureCode()).toBeUndefined();
  });

  it("accepts a code-shaped value, trimmed", () => {
    vi.stubEnv("NEXT_PUBLIC_ETRACKER_SECURE_CODE", ` ${CODE} `);
    expect(etrackerSecureCode()).toBe(CODE);
  });

  it("returns the mock without the variable", () => {
    vi.stubEnv("NEXT_PUBLIC_ETRACKER_SECURE_CODE", "");
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    getAnalyticsTracker().trackConversion("register-as-publisher", "handover");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("returns the real adapter with the variable, which logs nothing", () => {
    vi.stubEnv("NEXT_PUBLIC_ETRACKER_SECURE_CODE", CODE);
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    withWindow({}, () => getAnalyticsTracker().trackConversion("register-as-publisher", "handover"));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("caches one tracker instance per process", () => {
    expect(getAnalyticsTracker()).toBe(getAnalyticsTracker());
  });
});
