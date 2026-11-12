import { describe, expect, it } from "vitest";

import { AI_CRAWLERS, robotsFor, robotsTxt } from "@/src/lib/seo/robots";

describe("TS-WEB-0004-A5 / FUN-WEB-0169: robots.txt allows AI crawlers explicitly", () => {
  const production = robotsTxt(robotsFor("production", "www.schafe-vorm-fenster.de"));

  it.each(AI_CRAWLERS)("production allows %s in its own block", (agent) => {
    expect(production).toContain(`User-Agent: ${agent}\nAllow: /\n\n`);
  });

  it("production keeps the * block and names the sitemap last", () => {
    expect(production).toContain("User-Agent: *\nAllow: /\n\n");
    expect(production.endsWith("Sitemap: https://www.schafe-vorm-fenster.de/sitemap.xml\n")).toBe(true);
  });

  it("preview and other non-production names no agent, disallows all, no sitemap", () => {
    for (const [env, host] of [
      ["preview", "www.schafe-vorm-fenster.de"],
      ["production", "svf-www.vercel.app"],
      [undefined, "localhost:3100"],
    ] as const) {
      const text = robotsTxt(robotsFor(env, host));
      for (const agent of AI_CRAWLERS) expect(text).not.toContain(agent);
      expect(text).toContain("Disallow: /");
      expect(text).not.toContain("Sitemap:");
    }
  });
});
