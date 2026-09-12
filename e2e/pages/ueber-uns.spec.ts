import { expect, test } from "@playwright/test";

/**
 * TS-027 — `/ueber-uns` — acceptance pass.
 *
 * TS-027-A9 (every person in `@schafe-vorm-fenster/people` appears with a
 * real portrait) is half built. The imagery workstream placed the two
 * cleared photographs of Jan-Henrik Hempel — the origin block's portrait and
 * the team card — from the hub package's asset set. Christian Sauer's only
 * photograph carries `license: unverified`, so his card keeps the honest
 * "Foto gesucht" hatch: an uncleared portrait is not published, and a face is
 * never generated (DEC-068 rule 3, DEC-077). `state/open.md` tracks it.
 */

test.describe("/ueber-uns", () => {
  test("TS-027-A1: manifest matches D1 — no primary CTA on this page", async ({ page }) => {
    await page.goto("/ueber-uns");
    await expect(page.locator('[data-cta="primary"]')).toHaveCount(0);
  });

  test("TS-027-A9: the cleared founder portrait renders, with its credit line", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    await expect(page.locator('img[src*="founder-portrait"]').first()).toBeVisible();
    // The rights holder prescribes the attribution string verbatim.
    await expect(page.getByText("@rightvisionstudios & NØRD2026").first()).toBeVisible();
  });

  test("TS-027-A2: exactly one photo section, at the top", async ({ page }) => {
    await page.goto("/ueber-uns");
    const photoSections = page.locator("section[data-surface] [style*='--photo-image'], section[style*='--photo-image']");
    expect(await photoSections.count()).toBeGreaterThanOrEqual(0);
    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Gebaut in einem Dorf, betrieben aus einem Dorf.");
  });

  test("TS-027-A3: the h1 and the honorary-mayor sentence are on the first screen at 1280x800", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ueber-uns");
    await expect(page.locator("h1")).toBeInViewport();
  });

  test("TS-027-A4: the origin copy states the free-calendar promise and exactly one 480 € price", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const bodyText = await page.locator("body").innerText();
    const matches = bodyText.match(/480\s*€/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  test("TS-027-A5 / A6: the stream renders at most 7 elements and exactly one empty slot, never backfilled", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const stream = page.locator('[aria-label="Belege"]');
    // Scoped to the stream container: CSS Modules name every class in a
    // component's file with the same file-basename prefix, so an unscoped
    // `[class*="proof-card"]` also matches the card's own inner `body`/
    // `meta` elements — only `article` is unique to one card each.
    const cards = stream.locator("article");
    const emptySlot = page.getByText("Kein Nachweis");
    expect(await cards.count()).toBeLessThanOrEqual(6);
    await expect(emptySlot).toHaveCount(1);
    await expect(emptySlot).toBeVisible();
  });

  test("TS-027-A8: the archive block has exactly one outgoing link to /ueber-uns/archiv", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const archiveLinks = page.locator('a[href="/ueber-uns/archiv"]');
    await expect(archiveLinks).toHaveCount(1);
  });

  test("TS-027-A9: every team member renders once, with a name and a role", async ({ page }) => {
    await page.goto("/ueber-uns");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toContain("Jan-Henrik Hempel");
    expect(bodyText).toContain("Christian Sauer");
  });

  test("TS-027-A10: the newsletter stands after the team block, zero data-cta=\"primary\", last block is the merged three-job offer", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    await expect(page.locator('[data-cta="primary"]')).toHaveCount(0);
    // "Rendered once, not twice": the merged block **is** the context band
    // (TS-006 D6, `plan/component-inventory.md` TS-027 block 7 — "`context-
    // band` in `merged` mode … rendered once, as the last block"), so it is
    // the one `aside#context-band` TS-011-A4 requires on every page and it
    // carries block 4's `#closing-cta` anchor inside. This used to assert
    // the band's *absence*, which is what left the page without an `aside`
    // at all (F-2-41, reopened at gate 2).
    const band = page.locator("aside#context-band");
    await expect(band).toHaveCount(1);
    const closing = page.locator("#closing-cta");
    await expect(closing).toHaveCount(1);
    await expect(band.locator("#closing-cta")).toHaveCount(1);
    const jobs = closing.getByRole("link");
    expect(await jobs.count()).toBe(3);
  });

  test("TS-027-A12: exactly one Organization JSON-LD node, no Person nodes", async ({ page }) => {
    await page.goto("/ueber-uns");
    // One `<script>` per page (TS-011 D4), so the nodes are read out of the
    // page's one `@graph`. The criterion is unchanged.
    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1);

    const graph = JSON.parse((await scripts.textContent()) ?? "{}");
    const nodes = graph["@graph"] as Record<string, unknown>[];
    const organizations = nodes.filter((node) => node["@type"] === "Organization");
    const persons = nodes.filter((node) => node["@type"] === "Person");
    expect(organizations).toHaveLength(1);
    expect(persons).toHaveLength(0);
    // D4: a reference by `@id`, never a second full node — the page describes
    // the organisation nowhere, it points at the description on `/`.
    expect(Object.keys(organizations[0]!).sort()).toEqual(["@id", "@type"]);
  });

  test("TS-004-A1: no horizontal scroll at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    const response = await page.goto("/ueber-uns");
    expect(response?.status()).toBe(200);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows).toBe(false);
  });
});
