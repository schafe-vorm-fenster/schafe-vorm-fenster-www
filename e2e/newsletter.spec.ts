import { expect, test } from "@playwright/test";

import { NEWSLETTER_SENDING_SYSTEM } from "../src/components/newsletter-block/constant";
import { everyRoute, href } from "../src/lib/routes/routes";


/**
 * TS-WEB-0016-A21 — the newsletter renders **nowhere** while no sending system
 * accepts a subscription: "neither the footer newsletter entry nor the inline
 * block on `/ueber-uns` renders … no form that posts nowhere, and no
 * click-to-chat link whose arriving message nothing records" (D10, DEC-0052 §4
 * as amended).
 *
 * The gate is one constant, `NEWSLETTER_SENDING_SYSTEM`
 * (`src/components/newsletter-block/constant.ts`, `null` while Q-0020 is open,
 * `state/open.md` row 22), read at the two mount sites — the footer slot in
 * `app/[lang]/layout.tsx` and the inline block on `/ueber-uns` — the same shape
 * `response-promise/constant.ts` uses for the two-working-day promise: removed,
 * never softened (DEC-0122 §3). The 2026-09-22 review called the section good
 * (R-home-35); the specification carries the truth (DEC-0104), and the block
 * keeps its shape so it returns with the owner's benefit heading the day a
 * system is named.
 *
 * ### What this file replaced, and where those cases went
 *
 * It held the four F-3-11 cases: the mock's submit must not perform a real GET
 * navigation that throws the page's other forms and its query string away, it
 * must confirm in a `role="status"` region, in the page's language, and its
 * input must stay unnamed so no address can leave the browser. All four need a
 * *rendered* block, so none of them can run while A21 holds. They are not kept
 * as skipped tests: `newsletter-form.tsx` still cancels its submit and still
 * carries no `name`, `src/components/live-modules-and-conversions.test.tsx`
 * asserts the unnamed input off the static markup, and these four walks come
 * back with the block.
 */

/*
 * The `INLINE_BLOCK_GATED_BY` exemption that stood here is gone: `/ueber-uns`
 * reads `newsletterOffered()` on its own page since T-14 (DEC-0122 §5,
 * DEC-0132 §5), so the walk below holds on all 24 routes without an entry.
 */

test("TS-WEB-0016-A21: no sending system is named, so the block is withheld", () => {
  expect(NEWSLETTER_SENDING_SYSTEM).toBeNull();
});

for (const { route, locale } of everyRoute()) {
  const path = href(route, locale);

  test(`TS-WEB-0016-A21: no newsletter surface on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("[data-newsletter]")).toHaveCount(0);
    await expect(page.locator("#newsletter-email")).toHaveCount(0);
    // And in particular not in the footer, which carried it on all 24 routes.
    await expect(page.locator("body > footer form, body > footer input")).toHaveCount(0);
  });
}
