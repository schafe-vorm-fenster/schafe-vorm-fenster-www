import { describe, expect, it } from "vitest";

import { englishSlugRedirects, legacyRedirects, redirectTable } from "./next-routing";
import { LEGACY_REDIRECTS } from "./redirect-map";

/** Issue 217 — a German slug under `/en` is not a second URL for the page. */
describe("englishSlugRedirects", () => {
  const rows = englishSlugRedirects();

  it("sends /en/dein-ort to /en/your-place with a 308", () => {
    expect(rows).toContainEqual({
      source: "/en/dein-ort",
      destination: "/en/your-place",
      statusCode: 308,
    });
  });

  it("covers every route whose English slug differs, and never the home page", () => {
    expect(rows.map((r) => r.source)).not.toContain("/en");
    expect(rows).toHaveLength(11);
    for (const row of rows) expect(row.source).not.toBe(row.destination);
  });

  it("leaves the legacy map untouched and ahead of the slug rows", () => {
    const table = redirectTable();
    expect(table.slice(0, legacyRedirects().length)).toEqual(legacyRedirects());
    const lastLegacy = table.findLastIndex((r) => r.source === "/hilfe/:path*");
    const firstSlug = table.findIndex((r) => r.statusCode === 308);
    expect(lastLegacy).toBeLessThan(firstSlug);
    const sources = new Set(rows.map((r) => r.source));
    for (const legacy of LEGACY_REDIRECTS) expect(sources.has(legacy.from)).toBe(false);
  });
});
