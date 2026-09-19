import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * The global footer's own budget — the polish brief's shared-component pass.
 *
 * The footer stands under **every** one of the 24 routes, so its height is
 * subtracted from every page's budget before the page has written a word. It
 * measured **1110 px at 390 × 844** (1.32 phone screens — more than G-4
 * allows a whole *section*) and 883 px at 1280 × 800, which is why no page
 * reached the brief's length target. 480 px of it was the contact form,
 * rendered open on a page the visitor came to for something else.
 *
 * This file is that measurement made repeatable, plus the four things the
 * shrink was not allowed to cost: TS-004-A9's contact, newsletter and three
 * legal links, TS-001-A7's language switch, the 44 px target of SRC-014
 * §Touch targets, and the no-JavaScript behaviour of TS-009.
 *
 * ### Why 0.6 screens
 *
 * The brief's own number: a visitor who has reached the end of the argument
 * should see the closing CTA and the footer's own offer together, not scroll
 * a screen and a third of chrome. 500 px at 844 is that, with the German
 * footer (the longer of the two locales) landing at 480.
 */

/** ~0.6 phone screens at 844 px. */
const BUDGET_PX = 500;

const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 800 };

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  name: `${route} (${locale})`,
}));

async function footerHeight(page: import("@playwright/test").Page): Promise<number> {
  const box = await page.locator("body > footer").boundingBox();
  expect(box, "the footer is rendered").not.toBeNull();
  return Math.round(box!.height);
}

for (const route of ROUTES) {
  test(`the footer on ${route.name} is at most ${BUDGET_PX} px at 390 px`, async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto(route.path);
    await expect(page.locator("body > footer")).toBeVisible();
    expect(await footerHeight(page)).toBeLessThanOrEqual(BUDGET_PX);
  });
}

test("the desktop footer is tidier than the phone one, not looser", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  // It was 883 px — two slots stacked in one column with a labelled block
  // per surface. Beside each other it is a third of that.
  expect(await footerHeight(page)).toBeLessThanOrEqual(400);
});

test("TS-004-A9: contact, newsletter and the three legal links are all still there", async ({
  page,
}) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  const footer = page.getByRole("contentinfo");

  // Contact: a native disclosure, labelled, and the form's own markup inside
  // it — server-rendered, present in the DOM, one tap away.
  const summary = footer.locator("details > summary");
  await expect(summary).toHaveCount(1);
  await expect(summary).toHaveText(/kontakt/i);
  await expect(footer.locator('details input[type="email"]')).toHaveCount(1);

  // Newsletter: usable where it stands. It is the conversion, not a link.
  await expect(footer.locator("[data-newsletter] input")).toBeVisible();
  await expect(footer.locator("[data-newsletter] button[type=submit]")).toBeVisible();

  // The three legal links, visible — TS-002-A8 asks for footer-linked on
  // every page, which a link behind a disclosure would not be.
  for (const hash of ["impressum", "datenschutz", "barrierefreiheit"]) {
    await expect(footer.locator(`a[href="/rechtliches#${hash}"]`).first()).toBeVisible();
  }

  // TS-001-A7's switch, on the same base line.
  await expect(footer.getByRole("navigation", { name: "Sprache" })).toBeVisible();
});

/**
 * SRC-014 §Touch targets — 44 px, on the controls the rule is about.
 *
 * Two things in this footer are deliberately not on the list, named rather
 * than filtered out of a selector without a reason:
 *
 *  - the **logo**, which SRC-014 §Logo fixes at "38–40 px, clipped to radius
 *    999"; it is a size the design system states, not a target that slipped;
 *  - the **consent sentence's inline link** to the privacy policy, which is
 *    a link inside running text. WCAG 2.5.8 exempts inline links for the
 *    reason it does: making one 44 px tall breaks the paragraph around it.
 *
 * Everything else here is a standalone control, and the three legal links
 * were 24 px of inline text before this pass.
 */
const FOOTER_TARGETS = [
  "body > footer nav a",
  "body > footer summary",
  "body > footer [data-newsletter] input",
  "body > footer [data-newsletter] button",
].join(", ");

test("SRC-014 §Touch targets: every standalone footer control clears 44 px", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  const heights = await page.$$eval(FOOTER_TARGETS, (elements) =>
    elements.map((element) => ({
      label: (element.textContent ?? element.tagName).trim().slice(0, 30),
      height: element.getBoundingClientRect().height,
    })),
  );
  // Three legal links, two languages, the summary, the field and its submit.
  expect(heights.length).toBe(8);
  const small = heights.filter((entry) => entry.height < 44);
  expect(small, `controls under 44 px: ${JSON.stringify(small)}`).toEqual([]);
});

test("the contact disclosure opens with no JavaScript at all", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: PHONE });
  const page = await context.newPage();
  await page.goto("/");

  const closed = await footerHeight(page);
  expect(closed).toBeLessThanOrEqual(BUDGET_PX);

  await page.locator("body > footer summary").click();
  await expect(page.locator("body > footer details")).toHaveAttribute("open", "");
  await expect(page.locator('body > footer details input[type="email"]')).toBeVisible();
  expect(await footerHeight(page)).toBeGreaterThan(closed);

  await context.close();
});
