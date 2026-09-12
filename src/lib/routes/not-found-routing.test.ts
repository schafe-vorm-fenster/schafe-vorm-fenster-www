import { afterEach, describe, expect, it, vi } from "vitest";

import {
  isUnservablePath,
  notFoundLocale,
  NOT_FOUND_PATH,
} from "./not-found-routing";
import { normalisePath } from "./routes";
import { everyD1Path } from "./url-inventory";
import { LOCALES } from "../i18n/locales";

/**
 * TS-004-A4 / TS-004 D6 and TS-001 D1/D4 — the predicate that keeps an
 * unknown URL out of `app/[lang]` (F-2-70).
 *
 * The safety property is the important half: a false positive here turns a
 * real page into a 404, so the first test walks the whole D1 inventory.
 */

describe("isUnservablePath: every path the site really serves stays served", () => {
  it.each(everyD1Path())("%s is servable", (path) => {
    expect(isUnservablePath(path)).toBe(false);
  });

  it.each([
    "/DEIN-ORT",
    "/dein-ort/",
    "/EN/your-place",
    "/api/places/search",
    "/dev/components",
    "/_next/static/chunks/main.js",
    "/favicon.ico",
    "/.well-known/security.txt",
    "/en/anything",
    "/en/does-not-exist",
    "/de/mitmachen",
    NOT_FOUND_PATH,
  ])("%s is servable or answers for itself", (path) => {
    expect(isUnservablePath(path)).toBe(false);
  });
});

describe("isUnservablePath: the URLs that produced the empty 404 document", () => {
  it.each([
    "/dies-gibt-es-nicht",
    "/uk/mitmachen",
    "/uk/dein-ort",
    "/pl/mitmachen",
    "/__landing-only",
    "/irgendwas/irgendwo",
  ])("%s is routed to the 404 surface", (path) => {
    expect(isUnservablePath(path)).toBe(true);
  });
});

describe("NOT_FOUND_PATH matches nothing in the route tree", () => {
  it("has two segments, which is what keeps it out of `app/[lang]`", () => {
    expect(NOT_FOUND_PATH.split("/").filter(Boolean)).toHaveLength(2);
  });

  it("is not a path the site serves", () => {
    expect(everyD1Path().map(normalisePath)).not.toContain(
      normalisePath(NOT_FOUND_PATH),
    );
  });
});

describe("notFoundLocale: TS-001 D1/D4", () => {
  it.each(LOCALES)("reads the %s prefix off the path", (locale) => {
    expect(notFoundLocale(`/${locale}/anything`)).toBe(locale);
  });

  it("falls back to the TLD default where the path carries no language", () => {
    expect(notFoundLocale("/dies-gibt-es-nicht")).toBe("de");
  });

  it("ignores a TLD default this phase does not serve", () => {
    // `.pl` is a landing-only domain (TS-001 D1) and has no German-or-English
    // 404 of its own; the default language answers rather than a missing one.
    expect(notFoundLocale("/mitmachen", "pl")).toBe("de");
  });

  it("prefers the path prefix over the domain default", () => {
    expect(notFoundLocale("/en/anything", "de")).toBe("en");
  });
});

describe("the component gallery is a tool, not a page", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("answers for itself wherever it exists", () => {
    for (const env of ["preview", "development", ""]) {
      vi.stubEnv("VERCEL_ENV", env);
      expect(isUnservablePath("/dev/components"), env).toBe(false);
    }
  });

  it("is routed to the 404 in a production build, where it calls `notFound()` itself", () => {
    // The one URL that would otherwise still reproduce the defect this module
    // removes: an in-route `notFound()` under Cache Components renders an
    // empty document (F-2-70).
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isUnservablePath("/dev/components")).toBe(true);
  });
});
