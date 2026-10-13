import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { proxy } from "@/proxy";
import {
  ROBOTS_NOINDEX_VARIANT,
  ROBOTS_VARIANTS,
  robotsVariantPath,
} from "@/src/lib/routes/static-variants";
import { CANONICAL_PUBLIC_HOSTS } from "@/src/lib/seo/indexable";

/**
 * Integration level: the request the way it really travels since DEC-0164 —
 * `proxy.ts` picks a build-time variant for the request's environment and
 * host, and the variant's real route handler produces the body. Routes are
 * integration, not e2e (verification-strategy).
 */

async function handler(variant: string): Promise<Response> {
  const route = await import("@/app/variants/robots/[variant]/route");
  return route.GET(new Request(`http://localhost${robotsVariantPath(variant)}`), {
    params: Promise.resolve({ variant }),
  });
}

/** What `/robots.txt` answers for this environment and host. */
async function robotsTxt(vercelEnv: string | undefined, host: string): Promise<string> {
  vi.stubEnv("VERCEL_ENV", vercelEnv ?? "");
  const response = await proxy(new NextRequest(`https://${host}/robots.txt`, { headers: { host } }));
  const rewrite = new URL(response.headers.get("x-middleware-rewrite") ?? "").pathname;
  const variant = rewrite.split("/").pop() ?? "";
  expect(rewrite).toBe(robotsVariantPath(variant));
  return (await handler(variant)).text();
}

beforeEach(() => {
  // No build has run here, so the CSP hash map is absent and says so loudly
  // under a `VERCEL_ENV`; that is not what this file is about.
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("TS-WEB-0015-A1: noindex on everything that is not production", () => {
  it("disallows all and names no sitemap on a preview deployment", async () => {
    const robots = await robotsTxt("preview", "next.schafe-vorm-fenster.de");
    expect(robots).toBe("User-Agent: *\nDisallow: /\n\n");
  });

  it("disallows all on a production build under a non-canonical host", async () => {
    const robots = await robotsTxt("production", "svf-www.vercel.app");
    expect(robots).toContain("Disallow: /");
    expect(robots).not.toContain("Sitemap:");
  });

  it("disallows all on preview even under a canonical host", async () => {
    const robots = await robotsTxt("preview", "www.schafe-vorm-fenster.de");
    expect(robots).toContain("Disallow: /");
    expect(robots).not.toContain("Sitemap:");
  });

  it("disallows all locally", async () => {
    const robots = await robotsTxt(undefined, "localhost:3100");
    expect(robots).toContain("Disallow: /");
  });

  it("allows all and names the sitemap on production under a canonical host", async () => {
    const robots = await robotsTxt("production", "www.schafe-vorm-fenster.de");
    expect(robots).toBe(
      "User-Agent: *\nAllow: /\n\nSitemap: https://www.schafe-vorm-fenster.de/sitemap.xml\n",
    );
  });
});

describe("TS-WEB-0015-A13: robots.txt is a build-time variant per distinct body", () => {
  it("has exactly one noindex variant plus one per canonical host", () => {
    expect(ROBOTS_VARIANTS).toHaveLength(1 + CANONICAL_PUBLIC_HOSTS.length);
    expect(ROBOTS_VARIANTS).toContain(ROBOTS_NOINDEX_VARIANT);
  });

  it.each(CANONICAL_PUBLIC_HOSTS)(
    "answers %s in production with its own sitemap, never another host's",
    async (host) => {
      const robots = await robotsTxt("production", host);
      expect(robots).toContain(`Sitemap: https://${host}/sitemap.xml`);
      for (const other of CANONICAL_PUBLIC_HOSTS.filter((candidate) => candidate !== host)) {
        expect(robots).not.toContain(other);
      }
    },
  );

  it("generates every variant at build time and reads nothing from the request", async () => {
    const route = await import("@/app/variants/robots/[variant]/route");
    expect(route.generateStaticParams().map(({ variant }) => variant)).toEqual([...ROBOTS_VARIANTS]);
    // The handler's only input is the path parameter: the same variant
    // answers the same body whatever host or environment asks.
    vi.stubEnv("VERCEL_ENV", "production");
    const noindex = await (await handler(ROBOTS_NOINDEX_VARIANT)).text();
    expect(noindex).toContain("Disallow: /");
  });

  it("answers 404 for a variant the build does not know", async () => {
    expect((await handler("www-attacker-example")).status).toBe(404);
  });
});
