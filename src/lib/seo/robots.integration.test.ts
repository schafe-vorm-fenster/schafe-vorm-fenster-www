import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Integration level: the actual `app/robots.ts` route handler, invoked
 * in-process. Routes are integration, not e2e (verification-strategy).
 */

const headerStore = { host: "localhost:3100" };

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) =>
      name.toLowerCase() === "host" ? headerStore.host : null,
  }),
}));

async function robotsFor(vercelEnv: string | undefined, host: string) {
  headerStore.host = host;
  vi.stubEnv("VERCEL_ENV", vercelEnv ?? "");
  const route = await import("@/app/robots");
  return route.default();
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TS-015-A1: noindex on everything that is not production", () => {
  it("disallows all and names no sitemap on a preview deployment", async () => {
    const robots = await robotsFor("preview", "next.schafe-vorm-fenster.de");
    expect(robots.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
    expect(robots.sitemap).toBeUndefined();
  });

  it("disallows all on a production build under a non-canonical host", async () => {
    const robots = await robotsFor("production", "svf-www.vercel.app");
    expect(robots.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
    expect(robots.sitemap).toBeUndefined();
  });

  it("disallows all locally", async () => {
    const robots = await robotsFor(undefined, "localhost:3100");
    expect(robots.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
  });

  it("allows all and names the sitemap on production under a canonical host", async () => {
    const robots = await robotsFor("production", "www.schafe-vorm-fenster.de");
    expect(robots.rules).toEqual([{ userAgent: "*", allow: "/" }]);
    expect(robots.sitemap).toBe(
      "https://www.schafe-vorm-fenster.de/sitemap.xml",
    );
  });
});
