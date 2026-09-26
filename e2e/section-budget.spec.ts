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
 * (brief Part B) — `/ueber-uns` and `/en/about` have had theirs and their
 * two lines are gone. Until then this file holds the rest at their
 * **measured** height: a section named below may shrink, and may not grow; a section not
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
  // `/dein-kalender`'s embed demo is off this list: the real embedded
  // calendar keeps the violet section to itself and its six-row settings
  // list stands one section lower, on its own ground. 1772 px became 946 +
  // 902, both inside the budget (brief, page 6, item 2).
  // `/dein-ort`'s four value stories are off this list: they were one
  // undifferentiated block and are four sections now, each on its own
  // ground, each under the budget in both languages (brief, page 2, fix 3).
  //
  // The two `/dein-kalender` sections below are the one case where the
  // budget loses to a rule that outranks it (T-13, DEC-0131, state/open.md
  // row 257), so they are recorded here rather than cut:
  //
  //  - `tiers` — SRC-0014 §Page Rhythm: "The three price tiers are rows
  //    inside one section, divided by a 1 px `line` hairline — never a 2 px
  //    lime rule, never three sections." DEC-0118 built exactly that. Three
  //    tiers with a kicker, a title, a price, three checks and a CTA each
  //    cannot fit 1270 px, and splitting them is the thing the design
  //    system forbids by name.
  //  - `embed-config` — six settings, each with a core sentence, an example
  //    and its chips, under one benefit band. The review and both drafts
  //    give it as one section with one kicker, and G-3's kicker vocabulary
  //    is closed, so the second half has no role name to open with.
  "/dein-kalender": { "embed-config": 1786, tiers: 1632 },
  "/en/your-calendar": { "embed-config": 1713, tiers: 1632 },
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
