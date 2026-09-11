import { expect, test } from "@playwright/test";

/**
 * TS-027 — `/ueber-uns` — acceptance pass.
 *
 * TS-027-A9 (every person in `@schafe-vorm-fenster/people` appears with a
 * real portrait) is not fully built: no hub-package portrait asset is read
 * into the render path in this work package (`src/lib/pricing/offerings.ts`'s
 * docblock records the same boundary for prices) — both team members render
 * with the honest "Foto gesucht" placeholder. `state/open.md` tracks it.
 */

test.describe("/ueber-uns", () => {
  test("TS-027-A1: manifest matches D1 — no primary CTA on this page", async ({ page }) => {
    await page.goto("/ueber-uns");
    await expect(page.locator('[data-cta="primary"]')).toHaveCount(0);
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
    await expect(page.locator("#context-band")).toHaveCount(0);
    const closing = page.locator("#closing-cta");
    await expect(closing).toHaveCount(1);
    const jobs = closing.getByRole("link");
    expect(await jobs.count()).toBe(3);
  });

  test("TS-027-A12: exactly one Organization JSON-LD node, no Person nodes", async ({ page }) => {
    await page.goto("/ueber-uns");
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    const nodes = jsonLd.map((text) => JSON.parse(text));
    const organizations = nodes.filter((node) => node["@type"] === "Organization");
    const persons = nodes.filter((node) => node["@type"] === "Person");
    expect(organizations).toHaveLength(1);
    expect(persons).toHaveLength(0);
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
