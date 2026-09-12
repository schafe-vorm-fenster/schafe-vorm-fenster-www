import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { proxy } from "@/proxy";
import {
  NOT_FOUND_LOCALE_HEADER,
  NOT_FOUND_PATH,
} from "@/src/lib/routes/not-found-routing";
import { CSP_HASHES_ASSET_PATH, resetScriptHashCache } from "@/src/lib/security/csp-hashes";

// F-3-9 needs `placeHop` to throw, which nothing in the tree could make it do
// — `resolvePlace` swallows its own errors and `searchPlaces` has a tier-3
// snapshot. The module is mocked and its real implementation restored per
// call, so every other test in this file still exercises the real hop.
vi.mock("@/src/lib/routes/place-hop", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/src/lib/routes/place-hop")>();
  return { ...actual, placeHop: vi.fn(actual.placeHop) };
});

/**
 * `proxy.ts` had no test of its own (F-2-36). These are the guarantees it
 * makes for *every* request on the site — the canonical-host redirect
 * (TS-001 D2), the CSP and HSTS headers (TS-014 D4/D5), `X-Robots-Tag`
 * (TS-015 D3) — plus the one a security finding put on it: a request that
 * chooses its own `Host` must not be able to aim the deployment's
 * secret-bearing self-fetch at an origin of its choosing.
 */

interface Call {
  readonly url: string;
  readonly bypass: string | undefined;
}

let calls: Call[] = [];

function stubFetch(): void {
  vi.stubGlobal("fetch", (input: URL | string, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    calls.push({
      url: String(input),
      bypass: headers.get("x-vercel-protection-bypass") ?? undefined,
    });
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ hashes: [] }),
    } as Response);
  });
}

function request(url: string, headers: Record<string, string> = {}): NextRequest {
  const parsed = new URL(url);
  return new NextRequest(url, {
    headers: { host: parsed.host, ...headers },
  });
}

beforeEach(() => {
  calls = [];
  resetScriptHashCache();
  stubFetch();
  vi.stubEnv("VERCEL_ENV", "");
  vi.stubEnv("VERCEL_URL", "");
  vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
  vi.stubEnv("VERCEL_DEPLOYMENT_ID", "");
  vi.stubEnv("VERCEL_AUTOMATION_BYPASS_SECRET", "s3cret");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  resetScriptHashCache();
});

describe("F-2-36: a spoofed Host cannot aim the self-fetch", () => {
  it("fetches the hash asset from the deployment's own origin, not the request's", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");

    await proxy(request("https://attacker.example/mitmachen"));

    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe(
      `https://sheep-abc123.vercel.app${CSP_HASHES_ASSET_PATH}`,
    );
    expect(calls[0]!.bypass).toBe("s3cret");
  });

  it("sends the bypass secret to no host the request named — the Host-spoof case", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");

    for (const host of [
      "attacker.example",
      "169.254.169.254",
      "internal.corp",
      "www.schafe-vorm-fenster.de.attacker.example",
    ]) {
      await proxy(request(`https://${host}/`));
    }

    for (const call of calls) {
      expect(new URL(call.url).host).toBe("sheep-abc123.vercel.app");
    }
    expect(calls.some((call) => call.url.includes("attacker.example"))).toBe(false);
  });

  it("off Vercel, does not fetch at all for an unknown host", async () => {
    await proxy(request("https://attacker.example/"));
    expect(calls).toHaveLength(0);
  });

  it("does not recurse into the hash asset's own request", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");

    await proxy(request(`https://sheep-abc123.vercel.app${CSP_HASHES_ASSET_PATH}`));

    expect(calls).toHaveLength(0);
  });
});

describe("TS-014 D4/D5: every response carries the policy", () => {
  it("sets a Content-Security-Policy on an ordinary request", async () => {
    const response = await proxy(request("http://localhost:3100/mitmachen"));
    const csp = response.headers.get("Content-Security-Policy");
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("grades HSTS by environment and omits it locally", async () => {
    expect(
      (await proxy(request("http://localhost:3100/"))).headers.get(
        "Strict-Transport-Security",
      ),
    ).toBeNull();

    vi.stubEnv("VERCEL_ENV", "production");
    expect(
      (await proxy(request("https://www.schafe-vorm-fenster.de/"))).headers.get(
        "Strict-Transport-Security",
      ),
    ).toBe("max-age=63072000; includeSubDomains");
  });
});

describe("TS-015 D3: X-Robots-Tag on everything that is not the production site", () => {
  it("marks a preview noindex", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const response = await proxy(request("https://sheep-abc123.vercel.app/"));
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });

  it("leaves the canonical production host indexable", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const response = await proxy(request("https://www.schafe-vorm-fenster.de/"));
    expect(response.headers.get("X-Robots-Tag")).toBeNull();
  });
});

describe("TS-001 D2: the canonical-host redirect", () => {
  it("redirects the bare apex to www with a 301, path and query intact", async () => {
    const response = await proxy(
      request("https://schafe-vorm-fenster.de/mitmachen?ort=beispieldorf"),
    );
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://www.schafe-vorm-fenster.de/mitmachen?ort=beispieldorf",
    );
  });

  it("never redirects a host outside the D1 matrix", async () => {
    const response = await proxy(request("https://sheep-abc123.vercel.app/"));
    expect(response.status).toBe(200);
  });
});

describe("TS-004-A3 (F-2-45): the landing-only domain rule", () => {
  it("404s every path outside the landing set on a landing-only domain", async () => {
    for (const host of [
      "www.schafvormfenster.at",
      "www.owcezaoknem.pl",
      "www.sheepoutside.com",
    ]) {
      for (const path of ["/mitmachen", "/en/take-part", "/dein-ort", "/start"]) {
        const response = await proxy(request(`https://${host}${path}`));
        // The proxy rewrites onto a path that matches nothing, so Next's own
        // 404 handling renders `global-not-found` with a real 404 — see
        // `landing-domain.ts` for why this is not `/_not-found`.
        expect(
          response.headers.get("x-middleware-rewrite"),
          `${host}${path}`,
        ).toContain(NOT_FOUND_PATH);
      }
    }
  });

  it("serves `/`, the legal route and the machine surfaces there", async () => {
    for (const path of ["/", "/en", "/rechtliches", "/en/legal", "/robots.txt", "/llms.txt", "/sitemap.xml"]) {
      const response = await proxy(request(`https://www.schafvormfenster.at${path}`));
      expect(response.headers.get("x-middleware-rewrite"), path).toBeNull();
      expect(response.headers.get("Content-Security-Policy"), path).toBeTruthy();
    }
  });

  it("still carries the full header set on a blocked request", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const response = await proxy(
      request("https://www.schafvormfenster.at/mitmachen"),
    );
    expect(response.headers.get("Content-Security-Policy")).toContain(
      "default-src 'self'",
    );
    expect(response.headers.get("Strict-Transport-Security")).toBe(
      "max-age=63072000; includeSubDomains",
    );
    // Not a canonical production host in `CANONICAL_PUBLIC_HOSTS`? It is —
    // so the 404 is indexable-by-host but 404 by status; the point of the
    // assertion is that the header logic ran at all.
    expect(response.headers.get("x-middleware-rewrite")).toContain(NOT_FOUND_PATH);
  });

  it("lets the landing page's own assets through", async () => {
    // `/_next/**` is the framework's own output and is what the landing page
    // actually loads. `public/` does not exist in this repository, so there
    // is no second kind of asset to let through.
    for (const path of ["/_next/static/chunks/main.js", "/_next/static/media/logo.svg"]) {
      const response = await proxy(request(`https://www.schafvormfenster.at${path}`));
      expect(response.headers.get("x-middleware-rewrite"), path).toBeNull();
    }
  });

  it("sends an asset-shaped path with no file behind it to the 404 surface (F-3-13)", async () => {
    // Before F-3-13 the extension alone exempted these, on every domain, and
    // they rendered the empty `__next_error__` shell instead of the 404 page.
    for (const path of ["/favicon.ico", "/logo.svg", "/nope.css"]) {
      const response = await proxy(request(`https://www.schafvormfenster.at${path}`));
      expect(response.headers.get("x-middleware-rewrite"), path).toContain(NOT_FOUND_PATH);
    }
  });

  it("changes nothing on the full-site domain", async () => {
    for (const path of ["/mitmachen", "/dein-ort", "/start"]) {
      const response = await proxy(
        request(`https://www.schafe-vorm-fenster.de${path}`),
      );
      expect(response.headers.get("x-middleware-rewrite"), path).toBeNull();
    }
  });

  it("redirects the bare landing apex to www before it judges the path", async () => {
    const response = await proxy(request("https://schafvormfenster.at/mitmachen"));
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://www.schafvormfenster.at/mitmachen",
    );
  });
});

describe("TS-004-A4 (F-2-70): an unknown URL reaches a 404 that renders", () => {
  it.each(["/dies-gibt-es-nicht", "/uk/mitmachen", "/irgendwas/irgendwo"])(
    "rewrites %s onto the 404 surface before the route renders",
    async (path) => {
      const response = await proxy(
        request(`https://www.schafe-vorm-fenster.de${path}`),
      );
      // Without this the request lands in `app/[lang]` with a `lang` that is
      // not a language, the page calls `notFound()` one render too late, and
      // the visitor gets a 404 with zero rendered characters.
      expect(response.headers.get("x-middleware-rewrite")).toContain(
        NOT_FOUND_PATH,
      );
    },
  );

  it.each(["/", "/dein-ort", "/en/your-place", "/robots.txt", "/start", "/dev/components", "/api/stats"])(
    "leaves %s alone",
    async (path) => {
      const response = await proxy(
        request(`https://www.schafe-vorm-fenster.de${path}`),
      );
      expect(response.headers.get("x-middleware-rewrite"), path).toBeNull();
    },
  );

  it("hands the 404 its language, because the surface above `[lang]` has none", async () => {
    const german = await proxy(
      request("https://www.schafe-vorm-fenster.de/dies-gibt-es-nicht"),
    );
    expect(
      german.headers.get("x-middleware-override-headers"),
    ).toContain(NOT_FOUND_LOCALE_HEADER);
    expect(
      german.headers.get(`x-middleware-request-${NOT_FOUND_LOCALE_HEADER}`),
    ).toBe("de");

    const english = await proxy(
      request("https://www.schafe-vorm-fenster.de/en/anything"),
    );
    expect(
      english.headers.get(`x-middleware-request-${NOT_FOUND_LOCALE_HEADER}`),
    ).toBe("en");
  });

  it("still carries the full header set on an unknown URL", async () => {
    const response = await proxy(
      request("https://www.schafe-vorm-fenster.de/dies-gibt-es-nicht"),
    );
    expect(response.headers.get("Content-Security-Policy")).toContain(
      "default-src 'self'",
    );
  });
});

describe("TS-021-A7 (F-2-49): the re-resolution hop is an HTTP redirect", () => {
  it("307s a now-covered value off `/dein-ort/starten`", async () => {
    const response = await proxy(
      request("https://www.schafe-vorm-fenster.de/dein-ort/starten?ort=beispielwalde"),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://www.schafe-vorm-fenster.de/dein-ort?ort=beispielwalde",
    );
  });

  it("307s an uncovered value off `/dein-ort`", async () => {
    const response = await proxy(
      request("https://www.schafe-vorm-fenster.de/dein-ort?ort=99999"),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://www.schafe-vorm-fenster.de/dein-ort/starten?ort=99999",
    );
  });

  it("keeps the language prefix", async () => {
    const response = await proxy(
      request("https://www.schafe-vorm-fenster.de/en/your-place/start?ort=beispielwalde"),
    );
    expect(response.headers.get("location")).toBe(
      "https://www.schafe-vorm-fenster.de/en/your-place?ort=beispielwalde",
    );
  });

  it("does not hop a value that belongs where it is", async () => {
    for (const url of [
      "https://www.schafe-vorm-fenster.de/dein-ort?ort=beispielwalde",
      "https://www.schafe-vorm-fenster.de/dein-ort/starten?ort=99999",
      "https://www.schafe-vorm-fenster.de/dein-ort",
      "https://www.schafe-vorm-fenster.de/mitmachen?ort=beispielwalde",
    ]) {
      const response = await proxy(request(url));
      expect(response.status, url).not.toBe(307);
    }
  });
});

/**
 * F-3-9 — the place hop's failure arm leaves a trace.
 *
 * `proxy.ts` catches a `placeHop` throw and falls through to the render, on
 * purpose: an upstream that cannot answer must never cost a visitor her page.
 * The arm was empty, and its failure mode is the defect it exists to fix —
 * the render's own `redirect()` produces a 200 with an empty document on a
 * production build (F-2-49). No test made `placeHop` throw, so neither the
 * fall-through nor the silence had ever been exercised.
 */
describe("F-3-9: a failing place hop is logged, and still costs no page", () => {
  it("logs the pathname and the error, and serves the request anyway", async () => {
    const placeHop = vi.mocked(await import("@/src/lib/routes/place-hop")).placeHop;
    const logged: unknown[][] = [];
    const error = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      logged.push(args);
    });

    placeHop.mockRejectedValueOnce(new Error("geo-api unreachable"));

    const response = await proxy(
      request("https://www.schafe-vorm-fenster.de/dein-ort?ort=07743"),
    );

    // The visitor still gets her page: no redirect, no 404 rewrite.
    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-rewrite") ?? "").not.toContain(
      NOT_FOUND_PATH,
    );

    expect(logged, "the arm is no longer silent").toHaveLength(1);
    expect(String(logged[0]?.[0])).toContain("placeHop failed");
    expect(logged[0]?.[1]).toMatchObject({
      pathname: "/dein-ort",
      error: "geo-api unreachable",
    });
    // `?ort=` is attacker-controlled text and is not echoed into the log.
    expect(JSON.stringify(logged[0])).not.toContain("07743");

    error.mockRestore();
  });
});
