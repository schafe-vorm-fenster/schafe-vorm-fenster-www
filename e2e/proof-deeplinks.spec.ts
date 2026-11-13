import { expect, test } from "@playwright/test";

import { href } from "../src/lib/routes/routes";

/**
 * Issue #36 (TS-WEB-0019 proof stream, TS-WEB-0027, TS-WEB-0005) — every proof
 * teaser on the home page carries exactly one link to its evidence entry, the
 * entry exists under the anchor the link names, and following the link scrolls
 * to it and marks it (`:target`).
 */
const PROOF_SECTION =
  "section:has(h2#proof-stream-heading, h2#proof-heading, h2#beleg, h2#beleg-heading)";

/**
 * Issue 220 — every page that shows proof teasers links each teaser to its own
 * archive entry: one link per teaser, a unique anchor per page, and the anchor
 * exists exactly once on the archive page (both locales).
 */
const PAGES = ["home", "calendar", "region", "takePart"] as const;

for (const locale of ["de", "en"] as const) {
  test.describe(`${locale}: proof teasers link to their own archive entry`, () => {
    test("every teaser link on every page targets an existing, unique anchor", async ({
      page,
    }) => {
      const archive = href("archive", locale);
      const seen: string[] = [];

      for (const route of PAGES) {
        const path = href(route, locale);
        await page.goto(path);
        const teasers = page.locator(`${PROOF_SECTION} article`);
        const count = await teasers.count();
        expect(count, `${path} shows proof teasers`).toBeGreaterThan(0);

        const anchors: string[] = [];
        for (let i = 0; i < count; i += 1) {
          const links = teasers.nth(i).locator("a");
          await expect(links, `${path}: teaser ${i + 1} has exactly one link`).toHaveCount(1);
          const target = await links.first().getAttribute("href");
          expect(target, `${path}: teaser ${i + 1}`).toMatch(
            new RegExp(`^${archive.replace(/\//g, "\\/")}#[^#]+$`),
          );
          anchors.push(target!.split("#")[1]);
        }
        expect(new Set(anchors).size, `${path}: anchors are unique`).toBe(anchors.length);
        seen.push(...anchors);
      }

      await page.goto(archive);
      for (const anchor of new Set(seen)) {
        await expect(page.locator(`[id="${anchor}"]`), `${archive} carries #${anchor}`).toHaveCount(1);
      }
    });
  });
}

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
