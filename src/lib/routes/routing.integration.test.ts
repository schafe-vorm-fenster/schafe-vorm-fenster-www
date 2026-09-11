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
  d1Inventory,
  D1_NON_PAGE_ROWS,
  everyD1Path,
  servedOnLandingDomain,
} from "@/src/lib/routes/url-inventory";
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

/**
 * `headers()` needs a request scope, which an in-process integration test has
 * no way to enter. The host is what the machine surfaces actually vary on, so
 * it is the only thing the stub has to carry.
 */
const requestHeaders = { host: "www.schafe-vorm-fenster.de" };
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ host: requestHeaders.host }),
}));

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
  /**
   * F-2-55: this block used to iterate `ROUTE_IDS` — the registry — which is
   * the one list that cannot be missing a row it defines. Two D1 rows
   * (`/start`, `/llms.txt`) were absent from the site and every assertion
   * here was green. It now walks `d1Inventory()`, and a separate check
   * holds the inventory against the spec text, so a row can only disappear
   * from both at once and deliberately.
   */
  it("has a handler behind every row of D1, not only behind every registry row", () => {
    for (const row of d1Inventory()) {
      if (row.kind === "page") {
        expect(existsSync(pageFile(row.routeId!)), row.path).toBe(true);
        continue;
      }
      const file =
        row.path === "/sitemap.xml"
          ? join(ROOT, "app", "sitemap.ts")
          : row.path === "/robots.txt"
            ? join(ROOT, "app", "robots.ts")
            : join(ROOT, "app", row.path.slice(1), "route.ts");
      expect(existsSync(file), `${row.path} → ${file}`).toBe(true);
    }
  });

  it("walks the whole inventory, not just the pages", () => {
    const paths = everyD1Path();
    // 12 routes × 2 languages + `/sitemap.xml` + `/robots.txt` + `/llms.txt`
    // + `/start`.
    expect(paths).toHaveLength(ROUTE_IDS.length * LOCALES.length + 4);
    expect(paths).toContain("/llms.txt");
    expect(paths).toContain("/start");
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("maps all 24 public page URLs onto a page of the tree", () => {
    const urls = everyRoute().map(({ route, locale }) => href(route, locale));
    expect(urls).toHaveLength(ROUTE_IDS.length * LOCALES.length);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("answers every non-page row through its real handler", async () => {
    const start = (await import("@/app/start/route")) as {
      GET: () => Response;
    };
    const response = start.GET();
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toMatch(/^https:\/\//);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");

    const llms = (await import("@/app/llms.txt/route")) as {
      GET: () => Promise<Response>;
    };
    const llmsResponse = await llms.GET();
    expect(llmsResponse.headers.get("content-type")).toContain("text/plain");
    const body = await llmsResponse.text();
    expect(body.startsWith("# ")).toBe(true);
    expect(body).toContain("https://www.schafe-vorm-fenster.de/");
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

describe("TS-004-A3: the landing-only domain rule", () => {
  it("serves `/`, the legal route and the machine surfaces there, and nothing else", () => {
    for (const path of ["/", "/en", "/rechtliches", "/en/legal", "/llms.txt", "/robots.txt", "/sitemap.xml"])
      expect(servedOnLandingDomain(path), path).toBe(true);
    for (const path of ["/mitmachen", "/en/take-part", "/dein-ort", "/dein-kalender/bestellen", "/start"])
      expect(servedOnLandingDomain(path), path).toBe(false);
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

  /**
   * F-2-55: A4's second half — "500 renders without any data dependency" —
   * was never asserted. `global-error` is rendered here with no arguments
   * beyond the error itself: if it ever grew a content or live-data read,
   * this throws instead of returning a tree.
   */
  it("renders the 500 surface with no data dependency at all", async () => {
    const globalError = (await import("@/app/global-error")) as {
      default: (props: { error: Error & { digest?: string } }) => unknown;
    };
    const tree = globalError.default({ error: new Error("boom") });
    expect(textOf(tree).length).toBeGreaterThan(0);
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

describe("TS-004-A5: the three machine surfaces answer, per domain", () => {
  /**
   * F-2-55: this block checked the sitemap alone and never requested
   * `llms.txt`, which is why the criterion stayed green while the route did
   * not exist. All three surfaces are exercised through their real handlers
   * now, and the per-domain half of A5 is asserted rather than assumed.
   */
  async function llmsFor(host: string): Promise<string> {
    const { llmsTxtFor } = await import("@/src/lib/routes/llms-txt");
    return llmsTxtFor(host);
  }

  it("serves llms.txt, naming the requesting domain and no other", async () => {
    const body = await llmsFor("www.schafe-vorm-fenster.de");
    expect(body).toContain("https://www.schafe-vorm-fenster.de/mitmachen");
    expect(body).toContain("https://www.schafe-vorm-fenster.de/en/take-part");
    expect(body).not.toContain("schafvormfenster.at");
    expect(body).not.toContain("owcezaoknem.pl");
  });

  it("narrows llms.txt on a landing-only domain to what that domain serves", async () => {
    const body = await llmsFor("www.schafvormfenster.at");
    expect(body).toContain("https://www.schafvormfenster.at/");
    expect(body).toContain("https://www.schafvormfenster.at/rechtliches");
    expect(body).not.toContain("/mitmachen");
    expect(body).not.toContain("/dein-kalender");
  });

  it("names every machine surface of D1 in llms.txt", async () => {
    const body = await llmsFor("www.schafe-vorm-fenster.de");
    for (const row of D1_NON_PAGE_ROWS)
      if (row.kind === "machine") expect(body).toContain(row.path);
  });

  it("serves robots.txt per domain", async () => {
    const { robotsFor } = await import("@/src/lib/seo/robots");
    const production = robotsFor("production", "www.schafe-vorm-fenster.de");
    expect(production.sitemap).toBe(
      "https://www.schafe-vorm-fenster.de/sitemap.xml",
    );
    const preview = robotsFor("preview", "sheep-abc123.vercel.app");
    expect(preview.sitemap).toBeUndefined();
  });

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
  // The legacy map is append-only (TS-011 D1) and grew at M4 with the rest
  // of SRC-010's inventory (`redirect-map.ts`) — this checks the /hilfe
  // family specifically, not the whole table's exact shape.
  it("carries the path and its subtree, both 301", () => {
    expect(legacyRedirects()).toEqual(
      expect.arrayContaining([
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
      ]),
    );
  });

  it("evaluates the legacy map before any locale rule", () => {
    const table = redirectTable();
    const firstLocaleRule = table.findIndex((row) => row.source === "/de");
    const lastLegacyRule = table.findIndex((row) => row.source === "/hilfe");
    expect(lastLegacyRule).toBeLessThan(firstLocaleRule);
  });
});
