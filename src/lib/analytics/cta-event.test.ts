import { describe, expect, it } from "vitest";

import { ctaEvent, GOAL_BY_ROUTE, isTrackedCta, type CtaElement } from "@/src/lib/analytics/cta-event";
import { isKnownConversionGoalId } from "@/src/lib/analytics/goal-ids";
import { NOT_FOUND_PAGE, pageView } from "@/src/lib/analytics/page-view";
import { BRIEFING_URL } from "@/src/lib/live/briefing";
import { calendarUrl } from "@/src/lib/live/app-handover";
import { ROUTE_IDS, href } from "@/src/lib/routes/routes";
import { LOCALES } from "@/src/lib/i18n/locales";

const ORIGIN = "http://localhost:3494";
const onHome = pageView("home", "de");
const onCalendar = pageView("calendar", "de");

function link(hrefValue: string, rank?: string, channel?: string): CtaElement {
  return { tag: "a", href: hrefValue, rank, channel };
}

describe("TS-WEB-0012-A13 · DEC-0218 §2: page names are the route trail plus the language", () => {
  it("names every route in both languages, uniquely", () => {
    const names = ROUTE_IDS.flatMap((route) => LOCALES.map((locale) => pageView(route, locale).pageName));
    expect(new Set(names).size).toBe(names.length);
  });

  it("nests a child page under its parent's area", () => {
    expect(pageView("order", "de")).toMatchObject({ pageName: "de/calendar/order", areas: "de/calendar" });
    expect(pageView("archive", "en")).toMatchObject({ pageName: "en/about/archive", areas: "en/about" });
    expect(pageView("home", "de")).toMatchObject({ pageName: "de/home", areas: "de/home" });
  });

  it("counts a page without a route as not-found", () => {
    expect(pageView(undefined, "en")).toMatchObject({ pageName: `en/${NOT_FOUND_PAGE}`, areas: `en/${NOT_FOUND_PAGE}` });
  });
});

describe("TS-WEB-0012-A13 · DEC-0218 §3: every category is a hub conversion goal or one of the two fixed ones", () => {
  it("maps every route to a known goal or to navigation", () => {
    for (const route of ROUTE_IDS) {
      const category = GOAL_BY_ROUTE[route];
      expect(category === "navigation" || isKnownConversionGoalId(category), `${route} → ${category}`).toBe(true);
    }
  });
});

describe("TS-WEB-0012-A13 · DEC-0218 §3: which clicks count as a CTA", () => {
  it("counts anything with a data-cta rank", () => {
    expect(isTrackedCta(link("/dein-kalender", "secondary"), ORIGIN)).toBe(true);
    expect(isTrackedCta({ tag: "button", rank: "primary" }, ORIGIN)).toBe(true);
  });

  it("counts every link that leaves the site, ranked or not", () => {
    expect(isTrackedCta(link("https://wa.me/49123"), ORIGIN)).toBe(true);
    expect(isTrackedCta(link("tel:+49123"), ORIGIN)).toBe(true);
    expect(isTrackedCta(link("mailto:hallo@example.org"), ORIGIN)).toBe(true);
  });

  it("does not count an internal link or a button without a rank", () => {
    expect(isTrackedCta(link("/ueber-uns"), ORIGIN)).toBe(false);
    expect(isTrackedCta(link("#main"), ORIGIN)).toBe(false);
    expect(isTrackedCta({ tag: "button" }, ORIGIN)).toBe(false);
    expect(ctaEvent(link("/ueber-uns"), onHome, ORIGIN)).toBeUndefined();
  });
});

describe("TS-WEB-0012-A13 · DEC-0218 §3: CTA → event mapping", () => {
  it("names an internal CTA after the route and the goal its page serves", () => {
    expect(ctaEvent(link(href("order", "de"), "primary"), onCalendar, ORIGIN)).toEqual({
      category: "buy-calendar-licence",
      action: "click",
      object: "order.primary",
      type: "de/calendar",
    });
  });

  it("resolves the English public path to the same route", () => {
    expect(ctaEvent(link(href("register", "en"), "primary"), pageView("takePart", "en"), ORIGIN)).toMatchObject({
      category: "register-as-publisher",
      object: "register.primary",
      type: "en/takePart",
    });
  });

  it("ignores a query and a trailing slash on an internal target", () => {
    expect(ctaEvent(link("/mitmachen/registrieren/?ort=lehre", "primary"), onHome, ORIGIN)).toMatchObject({
      object: "register.primary",
      category: "register-as-publisher",
    });
  });

  it("gives a page without a goal the navigation category", () => {
    expect(ctaEvent(link(href("about", "de"), "secondary"), onHome, ORIGIN)).toMatchObject({
      category: "navigation",
      object: "about.secondary",
    });
  });

  it("counts /start, the registration surface, under register-as-publisher", () => {
    expect(ctaEvent(link("/start", "secondary"), onHome, ORIGIN)).toMatchObject({
      category: "register-as-publisher",
      object: "start.secondary",
    });
  });

  it("maps the four contact channels by their data-channel marker", () => {
    const rows: [string, string, string][] = [
      ["appointment", BRIEFING_URL, "request-product-briefing"],
      ["whatsapp", "https://wa.me/4915112345678", "make-contact"],
      ["phone", "tel:+4915112345678", "make-contact"],
      ["mail", "mailto:hallo@example.org", "make-contact"],
    ];
    for (const [channel, target, goal] of rows) {
      expect(ctaEvent(link(target, "secondary", channel), onCalendar, ORIGIN)).toEqual({
        category: goal,
        action: "click",
        object: `${channel}.secondary`,
        type: "de/calendar",
      });
    }
  });

  it("maps external targets without a channel marker by their address", () => {
    expect(ctaEvent(link(BRIEFING_URL), onCalendar, ORIGIN)).toMatchObject({
      category: "request-product-briefing",
      object: "appointment.link",
    });
    expect(ctaEvent(link("https://wa.me/4915112345678"), onHome, ORIGIN)).toMatchObject({
      category: "make-contact",
      object: "whatsapp.link",
    });
    expect(
      ctaEvent(link("https://docs.google.com/forms/d/e/abc/viewform", "primary"), pageView("register", "de"), ORIGIN),
    ).toMatchObject({ category: "register-as-publisher", object: "registration-form.primary" });
  });

  it("counts a village calendar link under save-calendar-to-homescreen", () => {
    const calendar = calendarUrl({ slug: "lehre", communityId: "geoname.2879378" })!;
    expect(ctaEvent(link(calendar, "primary"), onHome, ORIGIN)).toMatchObject({
      category: "save-calendar-to-homescreen",
      object: "village-calendar.primary",
    });
  });

  it("counts any other external link as outbound, named by its host", () => {
    expect(ctaEvent(link("https://www.ndr.de/artikel"), pageView("about", "de"), ORIGIN)).toMatchObject({
      category: "outbound",
      object: "external:www.ndr.de.link",
    });
  });

  it("names a ranked plain button after its name and counts it under the page's goal", () => {
    expect(ctaEvent({ tag: "button", rank: "primary", name: "advance" }, pageView("order", "de"), ORIGIN)).toEqual({
      category: "buy-calendar-licence",
      action: "click",
      object: "action:advance.primary",
      type: "de/calendar/order",
    });
  });

  it("names a submit after the route its form goes to", () => {
    expect(ctaEvent({ tag: "button", rank: "primary", formAction: "/dein-ort" }, onHome, ORIGIN)).toEqual({
      category: "save-calendar-to-homescreen",
      action: "click",
      object: "submit:place.primary",
      type: "de/home",
    });
    // A function action renders no path; the button falls back to its name.
    expect(
      ctaEvent({ tag: "button", rank: "primary", name: "send", formAction: "javascript:throw 1" }, onHome, ORIGIN),
    ).toMatchObject({ object: "action:send.primary" });
  });

  it("never carries free text: an odd button name becomes the generic key", () => {
    expect(ctaEvent({ tag: "button", rank: "primary", name: "«r1» some label" }, onHome, ORIGIN)).toMatchObject({
      object: "action:button.primary",
    });
  });

  it("keeps an in-page anchor on the current page", () => {
    expect(ctaEvent(link("#kontakt", "secondary"), onCalendar, ORIGIN)).toMatchObject({
      category: "buy-calendar-licence",
      object: "calendar.secondary",
    });
  });
});
