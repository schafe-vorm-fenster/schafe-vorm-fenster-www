import { expect, test } from "@playwright/test";

/**
 * The context band as a menu with a blurb — TS-WEB-0006 D5 with CG-030 as
 * DEC-0120 determines it, and the "Über uns" label of TS-WEB-0004 D4 as
 * amended (TS-WEB-0004-A8: labels match D4 exactly on every page).
 *
 * Browser facts, measured on `/` (a `PageFrame` page with its own band slot)
 * and on `/ueber-uns` (the merged shape, TS-WEB-0006 D6), in both languages.
 */

const PHONE = { width: 390, height: 844 };

const CASES = [
  { path: "/", label: "Über uns", targets: ["/mitmachen", "/dein-kalender", "/ueber-uns"] },
  { path: "/en", label: "About us", targets: ["/en/take-part", "/en/your-calendar", "/en/about"] },
  { path: "/ueber-uns", label: "Dein Kalender", targets: ["/dein-ort", "/mitmachen", "/dein-kalender"] },
] as const;

for (const { path, label, targets } of CASES) {
  test(`${path}: three framed rows of ≥ 44 px, each label + blurb + arrow, in registry order`, async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);
    await page.goto(path);

    const rows = page.locator("#context-band a");
    await expect(rows).toHaveCount(3);
    expect(await rows.evaluateAll((links) => links.map((a) => a.getAttribute("href")))).toEqual(
      targets,
    );

    for (const row of await rows.all()) {
      const box = await row.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      // The frame: a hairline border on the link itself (the whole row is the target).
      const border = await row.evaluate((a) => getComputedStyle(a).borderTopWidth);
      expect(border).toBe("1px");
      // Label and blurb are two lines inside the one link; the arrow is an svg beside them.
      const spans = row.locator("span > span");
      await expect(spans).toHaveCount(2);
      await expect(spans.nth(1)).not.toBeEmpty();
      expect((await spans.nth(1).textContent())?.length ?? 0).toBeLessThanOrEqual(80);
      await expect(row.locator("svg")).toHaveCount(1);
    }

    // The fourth job's label reads as TS-WEB-0004 D4 says since DEC-0120.
    await expect(page.locator("#context-band, header").getByRole("link", { name: label, exact: false }).first()).toBeVisible();
  });
}

test("a blurb that is not yet a CG-030 statement marks its row `data-demo`; the publish blurb is not marked", async ({
  page,
}) => {
  await page.goto("/");
  const band = page.locator("#context-band");
  const publish = band.locator('a[href="/mitmachen"]');
  await expect(publish).not.toHaveAttribute("data-demo", "true");
  await expect(publish).toContainText("WhatsApp");
  // The two question blurbs (state/open.md row 215) are marked in the markup, never in a word.
  await expect(band.locator('a[data-demo="true"]')).toHaveCount(2);
  await expect(band).not.toContainText(/Platzhalter|placeholder|demo/i);
});

test("TS-WEB-0004-A8: the header's fourth label is »Über uns« and never »Warum wir«", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/mitmachen");
  const header = page.getByRole("banner").first();
  await expect(header.getByRole("link", { name: "Über uns", exact: true })).toBeVisible();
  await expect(header).not.toContainText("Warum wir");
});
