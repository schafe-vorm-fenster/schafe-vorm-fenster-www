import { describe, expect, it } from "vitest";

import { LOCALES } from "@/src/lib/i18n/locales";
import { href, ROUTE_IDS } from "@/src/lib/routes/routes";
import {
  d1Inventory,
  D1_NON_REGISTRY_ROWS,
  d1PageRows,
  everyD1Path,
  servedOnLandingDomain,
} from "@/src/lib/routes/url-inventory";

/**
 * F-2-55. The inventory and the registry are two lists, and the whole point
 * of having both is that one can catch the other drifting. These are the
 * assertions that make that true — held against TS-WEB-0004 D1's *text*, quoted
 * in each name, rather than against either list's own contents.
 */

describe("TS-WEB-0004 D1: the inventory is the spec's table, not the registry's", () => {
  it("carries every page row of the registry, in both languages", () => {
    // The registry's rows carry a `routeId`; `/start` is a page without one.
    const pages = d1Inventory().filter((row) => row.routeId !== undefined);
    expect(pages).toHaveLength(ROUTE_IDS.length * LOCALES.length);
    for (const locale of LOCALES)
      for (const route of ROUTE_IDS)
        expect(pages.map((row) => row.path)).toContain(href(route, locale));
  });

  it("carries the four rows the registry does not define", () => {
    expect(D1_NON_REGISTRY_ROWS.map((row) => row.path)).toEqual([
      "/sitemap.xml",
      "/robots.txt",
      "/llms.txt",
      "/start",
    ]);
  });

  it("makes `/start` a page row outside the registry — the registration surface, 200 (TS-WEB-0016 D15)", () => {
    const start = D1_NON_REGISTRY_ROWS.find((row) => row.path === "/start");
    expect(start?.kind).toBe("page");
    expect(start?.status).toBe(200);
    // No registry row: `/start` has no language segment and no localized
    // path, so it is not an `href()` target and not in the sitemap.
    expect(start?.routeId).toBeUndefined();
  });

  it("carries no redirect row any more — every D1 path answers 200", () => {
    for (const row of d1Inventory()) expect(row.status, row.path).toBe(200);
  });

  it("lists every D1 path exactly once", () => {
    const paths = everyD1Path();
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("TS-WEB-0004-A3 / D1: landing-only domains serve `/`, the legal routes and the machine surfaces", () => {
  it("admits exactly those", () => {
    const admitted = d1Inventory()
      .filter((row) => row.onLandingDomain)
      .map((row) => row.path)
      .sort();
    expect(admitted).toEqual(
      ["/", "/en", "/rechtliches", "/en/legal", "/sitemap.xml", "/robots.txt", "/llms.txt"].sort(),
    );
  });

  it("404s every other path there — `/mitmachen` by name", () => {
    expect(servedOnLandingDomain("/mitmachen")).toBe(false);
    expect(servedOnLandingDomain("/en/take-part")).toBe(false);
  });

  it("normalises case and a trailing slash before deciding", () => {
    expect(servedOnLandingDomain("/EN/Legal/")).toBe(true);
    expect(servedOnLandingDomain("/Rechtliches")).toBe(true);
  });

  it("keeps `/start` off a landing domain", () => {
    expect(servedOnLandingDomain("/start")).toBe(false);
  });
});

describe("d1PageRows is the per-language view of the same table", () => {
  it("returns one row per route in the requested language", () => {
    const rows = d1PageRows("en");
    expect(rows).toHaveLength(ROUTE_IDS.length);
    expect(rows.map((row) => row.path)).toContain("/en/take-part");
  });
});
