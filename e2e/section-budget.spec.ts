import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * No section is taller than a screen and a half on a phone — polish brief
 * G-4.
 *
 * "A section that wants to be longer is two sections with different grounds
 * and its own kicker each." The rule exists because a section is the unit a
 * reader orients by: past ~1.5 screens she has scrolled through a colour
 * field with no sign of where she is, and the page reads as one undivided
 * scroll. The brief measured seven violators; `/mitmachen`'s three
 * publishing paths (2035 px in one `surface-2` block) were the worst and are
 * fixed — one section per path.
 *
 * ### Why a ratchet and not a flat assertion
 *
 * The remaining violators are page composition, which the per-page pass owns
 * (brief Part B). Until then this file holds them at their **measured**
 * height: a section named below may shrink, and may not grow; a section not
 * named below may not exceed the budget at all. So the rule binds every new
 * section immediately, the known debt cannot quietly get worse, and each
 * page that is fixed deletes a line here rather than loosening a threshold.
 *
 * Measured at 390 × 844, the width the brief reviewed, against the live
 * composition — not against a stored screenshot.
 */

/** 1.5 phone screens at 844 px. */
const BUDGET_PX = 1270;

const PHONE = { width: 390, height: 844 };

/**
 * Sections over budget today, at the height they measure today, each with
 * the brief item that will remove it. Tolerance is 5 %: the content is
 * authored and a sentence may legitimately reflow, but a module may not grow
 * by a step.
 */
const KNOWN_OVER: Record<string, Record<string, number>> = {
  // G-9: the embed demo section. The brief's decision is a static screenshot
  // of a real embedded calendar at `ratio-map`, or no section at all.
  "/dein-kalender": { "embed-demo": 1772 },
  "/en/your-calendar": { "embed-demo": 1772 },
  // Brief Part B page 2: the four value stories are one undifferentiated
  // block. The prescription is four sections on alternating grounds, each
  // with its own transition and the cleared testimonial that belongs to it —
  // four quotes that sit in `content/pages/dein-ort/*.md` and render
  // nowhere. That is copy work, so it lands with the per-page pass; the
  // German page is 1199 px and only the longer English translation is over.
  "/en/your-place": { "value-stories": 1273 },
  // Brief Part B page 5: the proof stream is seven near-identical cards
  // (G-7 turns it into one feature plus compact rows) and the team block
  // carries two portrait slots with no portrait (G-9).
  "/ueber-uns": { herkunft: 1564, "(unnamed)": 1643 },
  "/en/about": { herkunft: 1564, "(unnamed)": 1643 },
};

/**
 * Two routes the rule does not apply to, and why — stated rather than
 * silently skipped.
 *
 * `/rechtliches` is six legal texts in one `legal-section`, and
 * `/ueber-uns/archiv` is a filtered chronology. Each is one continuous
 * document whose own headings are the orientation; cutting either into
 * 1.5-screen colour fields would invent structure the content does not have.
 * Both are named as "polish" at the end of the brief's own order.
 */
const EXEMPT = new Set(["legal", "archive"]);

const ROUTES = everyRoute()
  .filter(({ route }) => !EXEMPT.has(route))
  .map(({ route, locale }) => ({ path: href(route, locale), name: `${route} (${locale})` }));

for (const route of ROUTES) {
  test(`G-4: no section on ${route.name} exceeds ${BUDGET_PX} px at 390 px`, async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto(route.path);
    await expect(page.locator("#main")).toBeAttached();

    const sections = await page.evaluate(() => {
      const main = document.querySelector("#main");
      if (!main) return [];
      return [...main.querySelectorAll("section, aside")]
        .filter((section) => !section.parentElement?.closest("section, aside"))
        .map((section) => ({
          id:
            section.id ||
            (section as HTMLElement).dataset.block ||
            section.getAttribute("aria-label")?.slice(0, 24) ||
            "(unnamed)",
          height: Math.round(section.getBoundingClientRect().height),
        }));
    });

    expect(sections.length, `${route.path} renders no sections`).toBeGreaterThan(0);

    const allowed = KNOWN_OVER[route.path] ?? {};
    const failures = sections
      .map((section) => {
        const ceiling = allowed[section.id];
        if (ceiling === undefined) {
          return section.height > BUDGET_PX
            ? `${section.id} is ${section.height} px, over the ${BUDGET_PX} px budget`
            : null;
        }
        return section.height > Math.round(ceiling * 1.05)
          ? `${section.id} grew to ${section.height} px, past its recorded ${ceiling} px`
          : null;
      })
      .filter((failure): failure is string => failure !== null);

    expect(failures, `${route.path}: ${failures.join("; ")}`).toEqual([]);
  });
}
