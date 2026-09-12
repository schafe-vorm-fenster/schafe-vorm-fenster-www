import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * One chrome per document — **across client-side navigation** (state/open.md
 * row 204, acceptance finding R-6).
 *
 * Every other suite in this folder navigates with `page.goto()`, which is a
 * fresh document every time. That is exactly the walk that cannot see this
 * class of defect: with Cache Components on, the App Router does not unmount
 * the page a visitor clicks away from — it keeps the last three route
 * segments mounted inside hidden React `<Activity>` boundaries so their state
 * survives a return (`node_modules/next/dist/docs/01-app/02-guides/
 * preserving-ui-state.md`, "Next.js preserves up to 3 routes"). Anything a
 * *page* renders is inside that boundary. While the chrome was the page's,
 * one click left two `<header>`, two `<main id="main">` and two `<footer>`
 * elements in the document and a second click left three: two `main`
 * landmarks is WCAG 1.3.1, and the skip link's `#main` target was ambiguous
 * for the rest of the session.
 *
 * So this file clicks. It walks **every internal link of every page in both
 * languages** and asserts, after each navigation and after the return, that
 * the document still has exactly one of each landmark. Nothing here would
 * fail on a page load.
 */

interface Landmarks {
  header: number;
  main: number;
  idMain: number;
  footer: number;
}

const ONE: Landmarks = { header: 1, main: 1, idMain: 1, footer: 1 };

/**
 * Everything the bfcache keeps is still in the DOM, so these count nodes
 * rather than roles — the hidden copies are what has to be absent.
 */
async function landmarks(page: Page): Promise<Landmarks> {
  return page.evaluate(() => ({
    header: document.querySelectorAll("body > header").length,
    main: document.querySelectorAll("main").length,
    idMain: document.querySelectorAll("#main").length,
    footer: document.querySelectorAll("body > footer").length,
  }));
}

/**
 * The router commits the new segment a beat after the URL changes, and a
 * duplicate left behind by the bfcache persists rather than flickering — so a
 * short settle measures the steady state the visitor is left in. `networkidle`
 * is not usable here: the live modules keep polling.
 */
async function settle(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(300);
}

/** The internal destinations a page actually offers a visitor to click. */
async function internalLinks(page: Page): Promise<string[]> {
  const hrefs = await page
    .locator("a[href^='/']")
    .filter({ visible: true })
    .evaluateAll((anchors) =>
      anchors.map((anchor) => anchor.getAttribute("href") ?? ""),
    );
  return [...new Set(hrefs.filter((candidate) => !candidate.startsWith("//")))];
}

for (const { route, locale } of everyRoute()) {
  const from = href(route, locale);

  test(`row 204: every link out of ${from} leaves one chrome behind`, async ({
    page,
  }) => {
    await page.goto(from);
    await settle(page);
    expect(await landmarks(page), `on load: ${from}`).toEqual(ONE);

    const startPath = new URL(page.url()).pathname;
    const targets = await internalLinks(page);
    expect(targets.length, `internal links on ${from}`).toBeGreaterThan(0);

    for (const target of targets) {
      await page
        .locator(`a[href="${target}"]`)
        .filter({ visible: true })
        .first()
        .click();
      await settle(page);
      expect(await landmarks(page), `${from} → ${target}`).toEqual(ONE);

      // A link that stays on this page (the logo, an in-page anchor) has no
      // previous entry of its own to come back to.
      if (new URL(page.url()).pathname === startPath) continue;

      // Back is the other half: the router *restores* a preserved segment
      // here rather than creating one, and that path duplicated too.
      await page.goBack();
      await page.waitForURL((url) => url.pathname === startPath);
      await settle(page);
      expect(await landmarks(page), `${target} → back to ${from}`).toEqual(ONE);
    }
  });
}

/**
 * The bfcache holds three entries, so a chain is what made a third copy
 * appear. Two clicks were enough to reach the cap before the fix.
 */
test("row 204: a chain of client navigations never accumulates chrome", async ({
  page,
}) => {
  const chain = ["/ueber-uns", "/mitmachen", "/dein-kalender", "/deine-region", "/"];

  await page.goto("/");
  await settle(page);
  for (const target of chain) {
    await page.locator(`a[href="${target}"]`).filter({ visible: true }).first().click();
    await page.waitForURL((url) => url.pathname === target);
    await settle(page);
    expect(await landmarks(page), `after → ${target}`).toEqual(ONE);
  }

  for (let step = 0; step < 3; step += 1) {
    await page.goBack();
    await settle(page);
    expect(await landmarks(page), `after back ${step + 1}`).toEqual(ONE);
  }
});

/**
 * TS-002 D5 — the skip link's target. `#main` resolved to whichever copy
 * stood first in the document while row 204 was open; a visitor who had
 * clicked once was jumping into an ambiguous id.
 */
test("row 204: the skip link keeps one unambiguous target after navigating", async ({
  page,
}) => {
  await page.goto("/");
  await settle(page);
  await page.locator('a[href="/ueber-uns"]').filter({ visible: true }).first().click();
  await page.waitForURL((url) => url.pathname === "/ueber-uns");
  await settle(page);

  const skip = page.locator('a[href="#main"]');
  await expect(skip).toHaveCount(1);

  const target = page.locator("#main");
  await expect(target).toHaveCount(1);
  await expect(target).toBeVisible();
  // And it is the page the visitor is actually on, not the one left behind.
  await expect(target.locator("h1").first()).toBeVisible();
});

/**
 * The landmarks the accessibility tree sees, after a navigation rather than
 * after a load — `getByRole` filters hidden content, so this asserts the
 * other half of the same fact.
 */
test("row 204: one banner, one main and one contentinfo in the a11y tree", async ({
  page,
}) => {
  await page.goto("/en");
  await settle(page);
  await page.locator('a[href="/en/take-part"]').filter({ visible: true }).first().click();
  await page.waitForURL((url) => url.pathname === "/en/take-part");
  await settle(page);

  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
});
