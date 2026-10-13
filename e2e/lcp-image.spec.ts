import { expect, test } from "@playwright/test";

/**
 * TS-WEB-0003-A8, the `/ueber-uns` half of F-3-2.
 *
 * Since the imagery workstream the portrait is the **real** photograph from
 * `@schafe-vorm-fenster/people` rather than the DEC-0068 hatch, so the file it
 * is served from is `/images/real/ueber-uns-founder-portrait.webp` (through
 * the image optimiser, hence the substring match).
 *
 * A8: "Every image below the fold carries `loading="lazy"`; the declared LCP
 * element of each page (D2) carries `loading="eager"` and
 * `fetchpriority="high"`. No image outside the D2 table is eager."
 *
 * TS-WEB-0003 D2 declares the founder portrait as `/ueber-uns`'s LCP element, and
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

/*
 * DEC-0162 §1: since the rebuild on the owner's design the stage photograph is
 * `/ueber-uns`'s LCP element (TS-WEB-0003 D2 as amended). It is a `photo-surface`
 * background, so its priority signal is the preload link per rendition, and the
 * founder portrait — now the quote band's background further down — is no
 * `img` any more. No `img` on the page is eager.
 */
for (const path of PAGES) {
  test(`TS-WEB-0003-A8: the declared LCP image on ${path} is preloaded at high priority`, async ({
    page,
  }) => {
    await page.goto(path);
    const preload = page.locator('link[rel="preload"][as="image"][href*="ueber-uns-hero"]');
    expect(await preload.count()).toBeGreaterThan(0);
    await expect(preload.first()).toHaveAttribute("fetchpriority", "high");
  });

  test(`TS-WEB-0003-A8: no image on ${path} is eager`, async ({ page }) => {
    await page.goto(path);

    const eager = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((img) => img.getAttribute("loading") === "eager")
        .map((img) => img.getAttribute("src") ?? ""),
    );

    expect(eager).toEqual([]);
  });
}
