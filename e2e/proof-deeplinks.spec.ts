import { expect, test } from "@playwright/test";

import { href } from "../src/lib/routes/routes";

/**
 * Issue #36 (TS-WEB-0019 proof stream, TS-WEB-0027, TS-WEB-0005) — every proof
 * teaser on the home page carries exactly one link to its evidence entry, the
 * entry exists under the anchor the link names, and following the link scrolls
 * to it and marks it (`:target`).
 */
for (const locale of ["de", "en"] as const) {
  const home = href("home", locale);

  test.describe(`${home} proof teasers`, () => {
    test("every teaser has one link, and its anchor exists on the target page", async ({
      page,
    }) => {
      await page.goto(home);
      const teasers = page.locator("#proof-stream article");
      const count = await teasers.count();
      expect(count).toBeGreaterThan(0);

      const targets: string[] = [];
      for (let i = 0; i < count; i += 1) {
        const links = teasers.nth(i).locator("a");
        await expect(links, `teaser ${i + 1} has exactly one link`).toHaveCount(1);
        const target = await links.first().getAttribute("href");
        expect(target, `teaser ${i + 1} deeplinks to an anchor`).toMatch(/#[^#]+$/);
        targets.push(target!);
      }

      for (const target of new Set(targets)) {
        const [path, anchor] = target.split("#");
        await page.goto(path);
        await expect(page.locator(`[id="${anchor}"]`), `${path} carries #${anchor}`).toHaveCount(1);
      }
    });

    test("following a teaser link scrolls to the entry and highlights it", async ({ page }) => {
      await page.goto(home);
      const link = page.locator("#proof-stream article a").first();
      const target = await link.getAttribute("href");
      const anchor = target!.split("#")[1];

      await link.click();
      await page.waitForURL(new RegExp(`#${anchor}$`));

      const entry = page.locator(`[id="${anchor}"]`);
      await expect(entry).toBeInViewport();
      // Marked: its ground differs from an unmarked row's.
      const ground = (selector: string) =>
        page.evaluate(
          (sel) => getComputedStyle(document.querySelector(sel)!).backgroundColor,
          selector,
        );
      const marked = await ground(`[id="${anchor}"]`);
      const plain = await ground(`article[data-archive-type]:not([data-anchored])`);
      expect(marked).not.toBe(plain);
      await expect(entry).toHaveAttribute("data-anchored", "true");
    });
  });
}
