import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { LOCALES } from "@/src/lib/i18n/locales";
import { ROUTE_IDS } from "@/src/lib/routes/routes";

describe("TS-WEB-0004-A5 / TS-WEB-0011: the sitemap, one entry per route per locale", () => {
  const entries = sitemap();

  it("has exactly ROUTE_IDS × LOCALES entries", () => {
    expect(entries).toHaveLength(ROUTE_IDS.length * LOCALES.length);
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
});
