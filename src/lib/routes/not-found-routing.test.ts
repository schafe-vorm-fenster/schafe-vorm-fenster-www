import { afterEach, describe, expect, it, vi } from "vitest";

import { isUnservablePath, notFoundLocale, notFoundPathFor } from "./not-found-routing";
import { internalPath, normalisePath, ROUTE_IDS } from "./routes";
import { VARIANTS_PREFIX } from "./static-variants";
import { everyD1Path } from "./url-inventory";
import { LOCALES } from "../i18n/locales";

/**
 * TS-WEB-0004-A4 / TS-WEB-0004 D6 and TS-WEB-0001 D1/D4 — the predicate that keeps an
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
    "/.well-known/security.txt",
    // F-3-8 — platform-owned paths. TS-WEB-0003 D7 names Vercel Speed Insights as
    // the production RUM mechanism, and its beacon posts to one of these.
    "/_vercel/insights/view",
    "/_vercel/speed-insights/vitals",
    "/_vercel/image",
    "/de/mitmachen",
  ])("%s is servable or answers for itself", (path) => {
    expect(isUnservablePath(path)).toBe(false);
  });
});

describe("isUnservablePath: every route's internal path still answers for itself", () => {
  // `/en/dein-ort` renders the page `/en/your-place` is rewritten onto. It
  // always did; DEC-0164 has no mandate to change that answer.
  it.each(ROUTE_IDS.map((route) => internalPath(route, "en")))("%s is servable", (path) => {
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
    // F-3-13: asset-shaped, and no file behind any of them. They used to be
    // exempted by extension alone, which sent them to `app/[lang]` with a
    // non-language `lang` — the empty `__next_error__` document F-2-70
    // removed, reopened by every browser's automatic favicon request.
    "/favicon.ico",
    "/does-not-exist.js",
    "/nope.css",
    "/nope.png",
    "/robots.txt.map",
    // DEC-0164: an unknown path under a served language prefix used to fall
    // through to `global-not-found`, which read the language off a request
    // header. It now takes the prerendered English 404 like any other.
    "/en/anything",
    "/en/does-not-exist",
    "/en/mitmachen/nope",
    // The build-time variants are reached only through the proxy's rewrite.
    "/variants/robots/noindex",
    "/variants/llms/www-schafe-vorm-fenster-de",
    "/variants/not-found/de",
  ])("%s is routed to the 404 surface", (path) => {
    expect(isUnservablePath(path)).toBe(true);
  });
});

describe("TS-WEB-0004-A12: the 404 target is the prerendered document of the URL's language", () => {
  it.each([
    ["/dies-gibt-es-nicht", undefined, "/de"],
    ["/en/anything", undefined, "/en"],
    ["/mitmachen", "en", "/en"],
    ["/mitmachen", "pl", "/de"],
    ["/en/mitmachen", "de", "/en"],
  ] as const)("%s (TLD default %s) goes to …/not-found%s", (path, tld, suffix) => {
    expect(notFoundPathFor(path, tld)).toBe(`${VARIANTS_PREFIX}/not-found${suffix}`);
  });

  it("is not a path the site serves", () => {
    const served = everyD1Path().map(normalisePath);
    for (const locale of LOCALES) {
      expect(served).not.toContain(notFoundPathFor(`/${locale}/x`));
    }
  });
});

describe("notFoundLocale: TS-WEB-0001 D1/D4", () => {
  it.each(LOCALES)("reads the %s prefix off the path", (locale) => {
    expect(notFoundLocale(`/${locale}/anything`)).toBe(locale);
  });

  it("falls back to the TLD default where the path carries no language", () => {
    expect(notFoundLocale("/dies-gibt-es-nicht")).toBe("de");
  });

  it("ignores a TLD default this phase does not serve", () => {
    // `.pl` is a landing-only domain (TS-WEB-0001 D1) and has no German-or-English
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
