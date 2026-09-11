import { expect, test } from "@playwright/test";

/**
 * TS-001 — the host-dependent half of the detection algorithm, which only
 * `proxy.ts` runs (`src/lib/routes/host-matrix.ts`,
 * `src/lib/routes/locale-suggestion.ts` carry the pure logic and its unit
 * tests; this is the one thing that needs a real HTTP round trip).
 *
 * A real browser navigation cannot exercise a non-canonical *domain* against
 * the local dev server — there is no DNS entry routing
 * `schafe-vorm-fenster.de` to `localhost:3100`. Next.js reads the request
 * host from the `Host` header, not from DNS/SNI, so Playwright's
 * `APIRequestContext` (`request`) can spoof it against the same local
 * server without needing one. `maxRedirects: 0` is what lets the test see
 * the 301 itself rather than following it.
 */

/**
 * Every test in this file spoofs the `Host` header against `baseURL` and
 * only means something against `localhost` — where `proxy.ts`'s own
 * Host-header read is exactly what the spoof reaches, per the file's own
 * doc comment above — or against the real canonical domains themselves,
 * which this run never serves (preview only, `plan/guardrails.md`). A
 * Vercel preview URL (`*.vercel.app`) is neither: the platform's edge
 * network owns the TLS connection (SNI) for that specific deployment
 * hostname, and measured against a real preview deployment it does not
 * forward an unrelated spoofed `Host` header through to this app's
 * `proxy.ts` the way a plain `next dev`/`next start` process does — every
 * spoofed-Host request came back a flat platform `404`, never reaching the
 * code under test (confirmed by running this file against a live preview:
 * the D1-domain redirect tests, the unrecognised-host test and both
 * Accept-Language tests all failed on that `404`, not on a real assertion
 * about this app's behaviour). So the whole file is skipped, with a
 * reason, whenever `E2E_BASE_URL` is neither localhost nor one of the real
 * domains — never loosened, only skipped where the assertion would not be
 * testing this app at all.
 */
const REAL_DOMAINS = new Set([
  "schafe-vorm-fenster.de",
  "www.schafe-vorm-fenster.de",
  "owcezaoknem.pl",
  "www.owcezaoknem.pl",
  "schafvormfenster.at",
  "www.schafvormfenster.at",
  "sheepoutside.com",
  "www.sheepoutside.com",
]);

function isHostSpoofable(baseURL: string | undefined): boolean {
  if (!baseURL) return true;
  const host = new URL(baseURL).hostname;
  return host === "localhost" || host === "127.0.0.1" || REAL_DOMAINS.has(host);
}

const SKIP_REASON =
  "Host-header spoof: E2E_BASE_URL is neither localhost nor a real D1 domain (looks like a Vercel preview URL) — Host-header spoofing against the platform's own edge routing is not a meaningful test of this app's proxy.ts (measured: a flat platform 404, not a real response from this app)";

test.describe("TS-001-A4/D2: the canonical-host redirect", () => {
  test("a bare known domain 301s to its https www form, path and query intact", async ({
    request,
    baseURL,
  }) => {
    test.skip(!isHostSpoofable(baseURL), SKIP_REASON);
    const target = new URL("/mitmachen?etcc_cmp=x", baseURL);
    const response = await request.get(target.toString(), {
      headers: { host: "schafe-vorm-fenster.de" },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(301);
    expect(response.headers()["location"]).toBe(
      "https://www.schafe-vorm-fenster.de/mitmachen?etcc_cmp=x",
    );
  });

  test("the other D1 domains redirect to their own www form", async ({ request, baseURL }) => {
    test.skip(!isHostSpoofable(baseURL), SKIP_REASON);
    for (const [bareHost, canonicalHost] of [
      ["owcezaoknem.pl", "www.owcezaoknem.pl"],
      ["schafvormfenster.at", "www.schafvormfenster.at"],
      ["sheepoutside.com", "www.sheepoutside.com"],
    ] as const) {
      const target = new URL("/", baseURL);
      const response = await request.get(target.toString(), {
        headers: { host: bareHost },
        maxRedirects: 0,
      });
      expect(response.status(), bareHost).toBe(301);
      expect(response.headers()["location"], bareHost).toBe(`https://${canonicalHost}/`);
    }
  });

  test("an already-canonical host is not redirected", async ({ request, baseURL }) => {
    test.skip(!isHostSpoofable(baseURL), SKIP_REASON);
    const target = new URL("/mitmachen", baseURL);
    const response = await request.get(target.toString(), {
      headers: { host: "www.schafe-vorm-fenster.de" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(200);
  });
});

test.describe("TS-001-A6: an unrecognised host mirrors .de rather than being redirected away", () => {
  test("a *.vercel.app host renders the page instead of redirecting to a different domain", async ({
    request,
    baseURL,
  }) => {
    test.skip(!isHostSpoofable(baseURL), SKIP_REASON);
    const target = new URL("/mitmachen", baseURL);
    const response = await request.get(target.toString(), {
      headers: { host: "schafe-vorm-fenster-www.vercel.app" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(200);
  });
});

test.describe("DEC-038/053: the Accept-Language suggestion signal", () => {
  test("exposes a Server-Timing suggestion when the visitor prefers a different offered language", async ({
    request,
    baseURL,
  }) => {
    test.skip(!isHostSpoofable(baseURL), SKIP_REASON);
    const target = new URL("/mitmachen", baseURL);
    const response = await request.get(target.toString(), {
      headers: { host: "www.schafe-vorm-fenster.de", "accept-language": "en-GB,en;q=0.9" },
    });
    const serverTiming = response.headers()["server-timing"] ?? "";
    expect(serverTiming).toContain('suggested-locale;desc="en"');
  });

  test("suggests nothing — and never varies the render — when the preferred language is already rendering", async ({
    request,
    baseURL,
  }) => {
    test.skip(!isHostSpoofable(baseURL), SKIP_REASON);
    const target = new URL("/en/mitmachen", baseURL);
    const response = await request.get(target.toString(), {
      headers: { host: "www.schafe-vorm-fenster.de", "accept-language": "en" },
    });
    expect(response.status()).toBe(200);
    const serverTiming = response.headers()["server-timing"] ?? "";
    expect(serverTiming).not.toContain("suggested-locale");
  });

  test("sets no cookie and no locale storage (TS-001-A8)", async ({ request, baseURL }) => {
    test.skip(!isHostSpoofable(baseURL), SKIP_REASON);
    const target = new URL("/mitmachen", baseURL);
    const response = await request.get(target.toString(), {
      headers: { host: "www.schafe-vorm-fenster.de", "accept-language": "en" },
    });
    expect(response.headers()["set-cookie"]).toBeUndefined();
  });
});
