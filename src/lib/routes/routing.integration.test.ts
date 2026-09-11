import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it, vi } from "vitest";

import { LOCALES } from "@/src/lib/i18n/locales";
import {
  legacyRedirects,
  localeRedirects,
  localeRewrites,
  redirectTable,
} from "@/src/lib/routes/next-routing";
import { redirectMapViolations } from "@/src/lib/routes/redirect-map";
import {
  canonicalUrl,
  everyRoute,
  href,
  internalPath,
  ROUTE_IDS,
  ROUTES,
} from "@/src/lib/routes/routes";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";
import type { Metadata } from "next";

/**
 * `next/root-params` is a compiler placeholder outside a Next build, so the
 * 404 page's language source is stubbed here. The store is what the test
 * varies — that is the whole point of the module.
 */
const rootParams = { lang: "de" };
vi.mock("next/root-params", () => ({ lang: async () => rootParams.lang }));

/** The concatenated text of a rendered element tree. */
function textOf(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join(" ");
  const props = (node as { props?: { children?: unknown } }).props;
  return props ? textOf(props.children) : "";
}

/**
 * Integration level: the real App Router modules and the real URL tables,
 * invoked in-process. Routes are integration, not e2e
 * (specs/verification/verification-strategy.md). The browser half — a status
 * 200 walk over all 24 public URLs and the layout law at 360 px — is
 * `e2e/routes.spec.ts`.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const APP_TREE = join(ROOT, "app", "[lang]");

/** The page module of a route, addressed by its German segments (D2). */
function pageFile(route: RouteId): string {
  const path = ROUTES[route].path.de;
  return path === "/"
    ? join(APP_TREE, "page.tsx")
    : join(APP_TREE, ...path.slice(1).split("/"), "page.tsx");
}

async function loadPage(route: RouteId) {
  return (await import(/* @vite-ignore */ pageFile(route))) as {
    default: (props: { params: Promise<{ lang: string }> }) => Promise<unknown>;
    generateMetadata: (props: {
      params: Promise<{ lang: string }>;
    }) => Promise<Metadata>;
  };
}

async function layoutFor(lang: string) {
  const layout = (await import("@/app/[lang]/layout")) as {
    default: (props: {
      children: unknown;
      params: Promise<{ lang: string }>;
    }) => Promise<{ type: string; props: Record<string, unknown> }>;
  };
  return layout.default({ children: null, params: Promise.resolve({ lang }) });
}

describe("TS-004-A1: every path of the D1 inventory exists in both languages", () => {
  it("has a page module behind every route", () => {
    for (const route of ROUTE_IDS)
      expect(existsSync(pageFile(route)), pageFile(route)).toBe(true);
  });

  it("maps all 24 public URLs onto a page of the tree", () => {
    const urls = everyRoute().map(({ route, locale }) => href(route, locale));
    expect(urls).toHaveLength(ROUTE_IDS.length * LOCALES.length);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("titles and describes every page in every language", async () => {
    for (const { route, locale } of everyRoute()) {
      const page = await loadPage(route);
      const metadata = await page.generateMetadata({
        params: Promise.resolve({ lang: locale }),
      });
      expect(metadata.description, `${route}/${locale}`).toBeTruthy();
      expect(metadata.title, `${route}/${locale}`).toBeTruthy();
    }
  });
});

describe("TS-001-A1: the German page declares German", () => {
  it("renders <html lang=\"de\">", async () => {
    const html = await layoutFor("de");
    expect(html.type).toBe("html");
    expect(html.props.lang).toBe("de");
  });
});

describe("TS-001-A2: the English page declares English", () => {
  it("renders <html lang=\"en\">", async () => {
    const html = await layoutFor("en");
    expect(html.props.lang).toBe("en");
  });

  it("falls back to the TLD default for an unsupported code", async () => {
    const html = await layoutFor("uk");
    expect(html.props.lang).toBe("de");
  });
});

describe("TS-001-A5: every page carries the hreflang set and its self-canonical", () => {
  it("emits canonical plus de, en and x-default on every page", async () => {
    for (const { route, locale } of everyRoute()) {
      const page = await loadPage(route);
      const metadata = await page.generateMetadata({
        params: Promise.resolve({ lang: locale }),
      });
      const alternates = metadata.alternates;
      expect(alternates?.canonical, `${route}/${locale}`).toBe(
        canonicalUrl(route, locale),
      );
      const languages = alternates?.languages ?? {};
      expect(Object.keys(languages).sort()).toEqual(["de", "en", "x-default"]);
      for (const other of LOCALES)
        expect(languages[other as Locale]).toBe(canonicalUrl(route, other));
    }
  });
});

describe("TS-004-A2: the redundant default prefix redirects, an unknown code 404s", () => {
  it("redirects /de and /de/… with a 301, not a 308", () => {
    expect(localeRedirects()).toEqual([
      { source: "/de", destination: "/", statusCode: 301 },
      { source: "/de/:path*", destination: "/:path*", statusCode: 301 },
    ]);
  });

  it("answers 404 for a language code the domain does not serve", async () => {
    const page = await loadPage("takePart");
    await expect(
      page.default({ params: Promise.resolve({ lang: "uk" }) }),
    ).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/);
  });
});

describe("TS-004-A4: an unknown path answers 404, noindex, inside the language", () => {
  it("carries all four error surfaces of TS-004 D2", () => {
    expect(existsSync(join(ROOT, "app", "global-not-found.tsx"))).toBe(true);
    expect(existsSync(join(ROOT, "app", "global-error.tsx"))).toBe(true);
    expect(existsSync(join(APP_TREE, "not-found.tsx"))).toBe(true);
    expect(existsSync(join(APP_TREE, "error.tsx"))).toBe(true);
  });

  it("declares no catch-all, so an unknown path is genuinely unmatched", () => {
    expect(existsSync(join(APP_TREE, "[...rest]"))).toBe(false);
  });

  it("marks both 404 surfaces noindex, follow", async () => {
    const notFound = (await import("@/app/[lang]/not-found")) as {
      metadata: Metadata;
    };
    expect(notFound.metadata.robots).toBe("noindex, follow");
    const global = (await import("@/app/global-not-found")) as {
      metadata: Metadata;
      default: () => unknown;
    };
    expect(global.metadata.robots).toBe("noindex, follow");
    expect(textOf(global.default())).toContain("Seite nicht gefunden");
  });

  it("renders the 404 in the language of the request", async () => {
    const notFound = (await import("@/app/[lang]/not-found")) as {
      default: () => Promise<unknown>;
    };
    rootParams.lang = "de";
    expect(textOf(await notFound.default())).toContain("Seite nicht gefunden");
    rootParams.lang = "en";
    expect(textOf(await notFound.default())).toContain("Page not found");
    rootParams.lang = "uk";
    expect(textOf(await notFound.default())).toContain("Seite nicht gefunden");
    rootParams.lang = "de";
  });
});

describe("TS-004-A5: the sitemap lists the inventory in its languages", () => {
  it("lists every public URL once, with its alternates", async () => {
    const { default: sitemap } = (await import("@/app/sitemap")) as {
      default: () => { url: string; alternates?: { languages?: object } }[];
    };
    const entries = sitemap();
    expect(entries).toHaveLength(ROUTE_IDS.length * LOCALES.length);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(
      entries.length,
    );
    for (const entry of entries)
      expect(Object.keys(entry.alternates?.languages ?? {})).toContain(
        "x-default",
      );
  });
});

describe("TS-004 D3: the URL mapping is derived from the table", () => {
  it("rewrites every public path onto its internal route", () => {
    const rewrites = localeRewrites();
    for (const { route, locale } of everyRoute()) {
      const source = href(route, locale);
      const destination = internalPath(route, locale);
      if (source === destination) continue;
      expect(rewrites, `${source} → ${destination}`).toContainEqual({
        source,
        destination,
      });
    }
  });

  it("never rewrites a machine surface", () => {
    for (const { source } of localeRewrites())
      expect(["/robots.txt", "/sitemap.xml", "/llms.txt"]).not.toContain(
        source,
      );
  });
});

describe("TS-011-A1: the redirect map has one source per URL and no chains", () => {
  it("reports no violation", () => {
    expect(redirectMapViolations()).toEqual([]);
  });
});

describe("TS-011-A2: the /hilfe family redirects in one hop to the app", () => {
  it("carries the path and its subtree, both 301", () => {
    expect(legacyRedirects()).toEqual([
      {
        source: "/hilfe",
        destination: "https://app.schafe-vorm-fenster.de",
        statusCode: 301,
      },
      {
        source: "/hilfe/:path*",
        destination: "https://app.schafe-vorm-fenster.de",
        statusCode: 301,
      },
    ]);
  });

  it("evaluates the legacy map before any locale rule", () => {
    const table = redirectTable();
    const firstLocaleRule = table.findIndex((row) => row.source === "/de");
    const lastLegacyRule = table.findIndex((row) => row.source === "/hilfe");
    expect(lastLegacyRule).toBeLessThan(firstLocaleRule);
  });
});
