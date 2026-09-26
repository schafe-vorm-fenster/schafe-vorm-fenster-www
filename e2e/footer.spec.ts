import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * The global footer's own budget — the polish brief's shared-component pass,
 * re-based on the footer that remains after DEC-0081.
 *
 * The footer stands under **every** one of the 24 routes, so its height is
 * subtracted from every page's budget before the page has written a word. It
 * measured **1110 px at 390 × 844** (1.32 phone screens — more than G-4 allows
 * a whole *section*) and 883 px at 1280 × 800, which is why no page reached the
 * brief's length target. 480 px of it was a general contact form, rendered open
 * on a page the visitor came to for something else.
 *
 * That form is not folded any more, it is **gone**: one contact surface exists
 * for the whole site — the contact section, rendered by the chrome directly
 * above this footer (`e2e/contact-section.spec.ts`) — and TS-WEB-0006-A17
 * forbids a general contact form anywhere. The newsletter went with it for a
 * different reason: TS-WEB-0016-A21 refuses a form that posts nowhere while no
 * sending system accepts a subscription (DEC-0122 §2, §3).
 *
 * So what this file measures is the footer's floor: the wordmark, the three
 * legal links of TS-WEB-0004-A9, TS-WEB-0001-A7's language switch, the 44 px
 * target of SRC-0014 §Touch targets, and the no-JavaScript behaviour of
 * TS-WEB-0009. "Contact and newsletter are still there" is now the opposite
 * assertion, and it is made here as well, because the criterion it discharges
 * (A9, as D4 amends it) reads "the footer carries no contact entry and no
 * form".
 */

/** ~0.6 phone screens at 844 px — unchanged; the footer is well under it now. */
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

test("TS-WEB-0004-A9: the three legal links and the language switch — no contact entry, no form", async ({
  page,
}) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  const footer = page.getByRole("contentinfo");

  // The three legal links, visible — TS-WEB-0002-A8 asks for footer-linked on
  // every page, which a link behind a disclosure would not be.
  for (const hash of ["impressum", "datenschutz", "barrierefreiheit"]) {
    await expect(footer.locator(`a[href="/rechtliches#${hash}"]`).first()).toBeVisible();
  }

  // TS-WEB-0001-A7's switch, on the same base line.
  await expect(footer.getByRole("navigation", { name: "Sprache" })).toBeVisible();

  // No contact entry and no form of any kind: the disclosure, its summary and
  // the envoy mount are deleted (DEC-0081, TS-WEB-0006-A17), and the newsletter
  // is withheld (TS-WEB-0016-A21).
  await expect(footer.locator("details, summary")).toHaveCount(0);
  await expect(footer.locator("form, input, textarea")).toHaveCount(0);
  await expect(footer.locator("[data-newsletter]")).toHaveCount(0);
  await expect(footer.locator("[data-envoy-form-kind]")).toHaveCount(0);
  // The contact surface it was replaced by stands directly above the footer.
  await expect(page.locator("section#kontakt[data-contact-section]")).toHaveCount(1);
});

/**
 * SRC-0014 §Touch targets — 44 px, on the controls the rule is about.
 *
 * The **logo** is deliberately not on the list, named rather than filtered out
 * of a selector without a reason: SRC-0014 §Logo fixes it at "38–40 px, clipped
 * to radius 999", which is a size the design system states, not a target that
 * slipped. The consent sentence's inline privacy link used to be the second
 * exemption; it went with the newsletter form.
 *
 * Everything else here is a standalone control, and the three legal links were
 * 24 px of inline text before the polish pass.
 */
const FOOTER_TARGETS = "body > footer nav a";

test("SRC-0014 §Touch targets: every standalone footer control clears 44 px", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  const heights = await page.$$eval(FOOTER_TARGETS, (elements) =>
    elements.map((element) => ({
      label: (element.textContent ?? element.tagName).trim().slice(0, 30),
      height: element.getBoundingClientRect().height,
    })),
  );
  // Three legal links and the one other language (DEC-0120: the current one is
  // not a control). It was 7 while the footer carried the contact summary, the
  // newsletter field and its submit (DEC-0122 §2).
  expect(heights.length).toBe(4);
  const small = heights.filter((entry) => entry.height < 44);
  expect(small, `controls under 44 px: ${JSON.stringify(small)}`).toEqual([]);
});

test("TS-WEB-0009: the whole footer works with no JavaScript at all", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: PHONE });
  const page = await context.newPage();
  await page.goto("/");

  // Nothing here needs scripting any more: there is no disclosure to open and
  // no form to cancel, only links — so the served HTML *is* the footer.
  expect(await footerHeight(page)).toBeLessThanOrEqual(BUDGET_PX);
  const footer = page.locator("body > footer");
  for (const hash of ["impressum", "datenschutz", "barrierefreiheit"]) {
    await expect(footer.locator(`a[href="/rechtliches#${hash}"]`).first()).toBeVisible();
  }
  await expect(footer.locator("nav a")).toHaveCount(4);
  await expect(footer.locator("details, summary, form, input")).toHaveCount(0);

  await context.close();
});
