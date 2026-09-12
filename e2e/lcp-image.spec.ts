import { expect, test } from "@playwright/test";

/**
 * TS-003-A8, the `/ueber-uns` half of F-3-2.
 *
 * A8: "Every image below the fold carries `loading="lazy"`; the declared LCP
 * element of each page (D2) carries `loading="eager"` and
 * `fetchpriority="high"`. No image outside the D2 table is eager."
 *
 * TS-003 D2 declares the founder portrait as `/ueber-uns`'s LCP element, and
 * the QA sweep measured it as the LCP element in the browser — carrying
 * `loading="lazy"` and no `fetchpriority` at all. A `grep` for
 * `fetchpriority="high"` over all 24 rendered routes returned **0 hits**, and
 * so did `loading="eager"`: the attribute half of A8 had no satisfied case
 * anywhere in the tree.
 *
 * The `photo-surface` half of F-3-2 — the hero on `/` and `/dein-ort`, whose
 * image is a CSS `background-image` and can carry neither attribute — is
 * explicitly not this round's, and is not asserted here.
 */

const PAGES = ["/ueber-uns", "/en/about"] as const;

for (const path of PAGES) {
  test(`TS-003-A8: the declared LCP image on ${path} is eager and high priority`, async ({
    page,
  }) => {
    await page.goto(path);

    const portrait = page.locator('img[src*="gruender"]').first();
    await expect(portrait).toHaveAttribute("loading", "eager");
    await expect(portrait).toHaveAttribute("fetchpriority", "high");
  });

  test(`TS-003-A8: no other image on ${path} is eager`, async ({ page }) => {
    await page.goto(path);

    const eager = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((img) => img.getAttribute("loading") === "eager")
        .map((img) => img.getAttribute("src") ?? ""),
    );

    expect(eager.filter((src) => !src.includes("gruender"))).toEqual([]);
  });
}
