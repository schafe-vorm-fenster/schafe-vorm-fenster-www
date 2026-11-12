import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";
import { readSectionHeads, sectionHeadFindings } from "./support/section-heads";

import type { RouteId } from "../src/lib/routes/routes";

/**
 * TS-WEB-0006-A21 — at most three text levels before a section's content, and
 * no word stem repeated between them (DEC-0206, TS-WEB-0006 D12, issue 163).
 *
 * "Level" and "repeated stem" are defined once, in
 * `e2e/support/section-heads.ts`.
 *
 * ### Why a warning and not a failure — for now
 *
 * The owner took the rule on 2026-11-12 together with its order of work: the
 * rule first, then the sections page by page, once each page's running PRs
 * have landed (DEC-0206 §5). Until then this file **reports** every breach as
 * a `warning` annotation and a console line, and fails only where it could
 * not measure at all (no section read on a page that has some). Each page
 * PR that rebuilds its sections clears its lines here; the last one turns the
 * warning into an assertion, which DEC-0206 §5 already names as the end
 * state.
 *
 * Measured at 390 × 844, the width the polish brief reviewed and
 * `e2e/section-budget.spec.ts` measures at.
 */

const PHONE = { width: 390, height: 844 };

/**
 * Routes the rule is not measured on, and why — stated rather than silently
 * skipped. `/rechtliches` is six legal texts whose own headings are the
 * orientation, `/ueber-uns/archiv` a filtered chronology, and the two flow
 * routes compose their heads step by step (`e2e/page-order.spec.ts`).
 */
const EXEMPT: ReadonlySet<RouteId> = new Set<RouteId>(["legal", "archive", "register", "order"]);

for (const { route, locale } of everyRoute()) {
  if (EXEMPT.has(route)) continue;
  const path = href(route, locale);

  test(`TS-WEB-0006-A21: ${path} — section heads, at most three levels and no repeated stem (warning, DEC-0206 §5)`, async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);
    await page.goto(path);
    await expect(page.locator("#main")).toBeAttached();

    const heads = await page.evaluate(readSectionHeads);
    expect(heads.length, `${path} renders no section after its hero`).toBeGreaterThan(0);

    // `SECTION_HEADS_VERBOSE=1` prints every head read, for the page PRs that
    // rebuild them: what the instrument saw, not only what it objects to.
    if (process.env.SECTION_HEADS_VERBOSE) {
      for (const head of heads) {
        const levels = head.levels.map((level) => `${level.kind} "${level.text.slice(0, 60)}"`).join(" · ");
        console.log(`[section-heads] ${path} · ${head.section} (${head.levels.length}): ${levels}`);
      }
    }

    const breaches = heads.flatMap((head) =>
      sectionHeadFindings(head).map((finding) => `${path} · ${head.section}: ${finding}`),
    );
    for (const breach of breaches) {
      test.info().annotations.push({ type: "warning", description: breach });
      console.warn(`[section-heads] ${breach}`);
    }
  });
}
