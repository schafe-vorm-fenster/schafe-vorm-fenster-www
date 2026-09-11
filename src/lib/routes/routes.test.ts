import { describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, LOCALES } from "@/src/lib/i18n/locales";
import {
  alternateUrls,
  canonicalUrl,
  everyRoute,
  href,
  internalPath,
  normalisePath,
  routeIdForPath,
  ROUTE_IDS,
  ROUTES,
  SITE_ORIGIN,
  trail,
} from "@/src/lib/routes/routes";

/** The TS-004 D1 inventory, written out so the table cannot drift silently. */
const GERMAN_INVENTORY = [
  "/",
  "/dein-ort",
  "/dein-ort/starten",
  "/mitmachen",
  "/mitmachen/registrieren",
  "/dein-kalender",
  "/dein-kalender/bestellen",
  "/deine-region",
  "/deine-region/angebot",
  "/ueber-uns",
  "/ueber-uns/archiv",
  "/rechtliches",
];

const ENGLISH_INVENTORY = [
  "/",
  "/your-place",
  "/your-place/start",
  "/take-part",
  "/take-part/register",
  "/your-calendar",
  "/your-calendar/order",
  "/your-region",
  "/your-region/quote",
  "/about",
  "/about/archive",
  "/legal",
];

describe("TS-004 D1/D3a: the route table is the URL inventory", () => {
  it("carries exactly the German paths of the inventory", () => {
    expect(ROUTE_IDS.map((id) => ROUTES[id].path.de)).toEqual(GERMAN_INVENTORY);
  });

  it("carries exactly the proposed English segments", () => {
    expect(ROUTE_IDS.map((id) => ROUTES[id].path.en)).toEqual(
      ENGLISH_INVENTORY,
    );
  });

  it("holds every language of the table for every route", () => {
    for (const id of ROUTE_IDS)
      for (const locale of LOCALES)
        expect(ROUTES[id].path[locale]).toMatch(/^\//);
  });
});

describe("TS-004-A10: no route segment is a place slug", () => {
  it("declares no dynamic segment anywhere in the inventory", () => {
    for (const id of ROUTE_IDS)
      for (const locale of LOCALES)
        expect(ROUTES[id].path[locale]).not.toMatch(/[[\]:*]/);
  });

  it("nests every second-level route under a base of the inventory", () => {
    for (const id of ROUTE_IDS) {
      const parent = ROUTES[id].parent;
      if (!parent) continue;
      expect(ROUTES[id].path.de.startsWith(`${ROUTES[parent].path.de}/`)).toBe(
        true,
      );
      expect(ROUTES[id].path.en.startsWith(`${ROUTES[parent].path.en}/`)).toBe(
        true,
      );
    }
  });
});

describe("TS-001-A1/A2: the link facade prefixes iff the language is not the default", () => {
  it("emits the bare path for the TLD default", () => {
    expect(href("takePart", "de")).toBe("/mitmachen");
    expect(href("home", "de")).toBe("/");
  });

  it("emits exactly one prefix segment for every other language", () => {
    expect(href("takePart", "en")).toBe("/en/take-part");
    expect(href("home", "en")).toBe("/en");
  });

  it("never produces a double slash or a missing slash", () => {
    for (const { route, locale } of everyRoute()) {
      const path = href(route, locale);
      expect(path.startsWith("/")).toBe(true);
      expect(path).not.toMatch(/\/\//);
    }
  });
});

describe("TS-004 D2: the internal path is the German tree under the language", () => {
  it("maps every public path onto a German-segment internal path", () => {
    expect(internalPath("takePart", "en")).toBe("/en/mitmachen");
    expect(internalPath("takePart", "de")).toBe("/de/mitmachen");
    expect(internalPath("home", "en")).toBe("/en");
  });
});

describe("TS-001-A5: the hreflang set is symmetric and self-canonical", () => {
  it("gives both variants of a page the same alternate set", () => {
    expect(alternateUrls("place")).toEqual(alternateUrls("place"));
    for (const id of ROUTE_IDS) {
      const alternates = alternateUrls(id);
      expect(Object.keys(alternates).sort()).toEqual([
        ...[...LOCALES].sort(),
        "x-default",
      ]);
      expect(alternates["x-default"]).toBe(alternates[DEFAULT_LOCALE]);
    }
  });

  it("points every alternate at the canonical host, absolute", () => {
    for (const id of ROUTE_IDS)
      for (const url of Object.values(alternateUrls(id)))
        expect(url.startsWith(`${SITE_ORIGIN}/`)).toBe(true);
  });

  it("makes each language's canonical its own public URL", () => {
    expect(canonicalUrl("place", "de")).toBe(`${SITE_ORIGIN}/dein-ort`);
    expect(canonicalUrl("place", "en")).toBe(`${SITE_ORIGIN}/en/your-place`);
  });
});

describe("TS-004 D8/DEC-071: the breadcrumb trail comes out of the table", () => {
  it("returns the root first and the page last", () => {
    expect(trail("archive")).toEqual(["about", "archive"]);
    expect(trail("home")).toEqual(["home"]);
  });
});

describe("TS-011 D1: path normalisation before the map is consulted", () => {
  it("lowercases and strips a trailing slash", () => {
    expect(normalisePath("/Mitmachen/")).toBe("/mitmachen");
    expect(normalisePath("/")).toBe("/");
  });

  it("resolves a normalised public path back to its route", () => {
    expect(routeIdForPath("/Dein-Ort/", "de")).toBe("place");
    expect(routeIdForPath("/your-place", "en")).toBe("place");
    expect(routeIdForPath("/your-place", "de")).toBeUndefined();
  });
});
