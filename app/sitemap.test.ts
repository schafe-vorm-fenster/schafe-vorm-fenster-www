import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { LOCALES } from "@/src/lib/i18n/locales";
import { canonicalUrl, ROUTE_IDS, ROUTES } from "@/src/lib/routes/routes";

describe("TS-WEB-0004-A5 / TS-WEB-0011: the sitemap, one entry per route per locale", () => {
  const entries = sitemap();

  it("has exactly one entry per indexable route per locale", () => {
    const indexable = ROUTE_IDS.filter((route) => !ROUTES[route].noindex);
    expect(entries).toHaveLength(indexable.length * LOCALES.length);
  });

  it("carries no query parameter on any URL (TS-WEB-0011 D6/D9)", () => {
    for (const entry of entries) {
      expect(entry.url).not.toContain("?");
      expect(entry.url).not.toContain("etcc_");
    }
  });

  it("every entry's alternates cover every configured locale plus x-default", () => {
    for (const entry of entries) {
      const languages = Object.keys(entry.alternates?.languages ?? {});
      for (const locale of LOCALES) expect(languages).toContain(locale);
      expect(languages).toContain("x-default");
    }
  });

  it("lists no bare /start row — TS-WEB-0016 owns that route, not the sitemap-visible inventory", () => {
    expect(entries.some((entry) => new URL(entry.url).pathname === "/start")).toBe(false);
  });

  it("lists no URL of a noindex route, in url or alternates (issue 228, TS-WEB-0025-A10)", () => {
    const noindexUrls = new Set(
      ROUTE_IDS.filter((route) => ROUTES[route].noindex).flatMap((route) =>
        LOCALES.map((locale) => canonicalUrl(route, locale)),
      ),
    );
    expect(noindexUrls.size).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(noindexUrls.has(entry.url)).toBe(false);
      for (const alt of Object.values(entry.alternates?.languages ?? {})) {
        expect(noindexUrls.has(alt as string)).toBe(false);
      }
    }
  });
});
