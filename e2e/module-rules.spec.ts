import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * SRC-0014 §Page Rhythm, module rules (DEC-0170) — the owner's review of
 * 2026-10-27, issues #84 and #86, as checks over every page rather than over
 * the one page that showed them.
 *
 * - **No proof quote under a live list.** A quote set as text under a list of
 *   dates reads as a caption of the dates (issue #84: Dr. A. Zschiesche under
 *   `/dein-ort`'s nearby rows).
 * - **No two quotes in a row.** A section that ends on a quote is not followed
 *   by a section that carries a quote — there the story stage opened on
 *   Kurzweg directly after it.
 * - **One module per job.** The homescreen instructions render at most once
 *   on a page (issue #86: "So landet der Kalender …", the band, then "Einmal
 *   antippen …" with the same handover).
 *
 * Measured on the served page after the live rows have loaded, on the
 * visible elements only: the story stage keeps its unpicked stories in the
 * DOM at `visibility: hidden`.
 */

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  name: `${route} (${locale})`,
}));

/** `/dein-ort` again with a place, so state A's module set is walked too. */
const PLACE_PATHS = ["/dein-ort?ort=schlatkow", "/en/your-place?ort=schlatkow"];

const PATHS = [...ROUTES.map((route) => route.path), ...PLACE_PATHS];

interface Finding {
  readonly section: string;
  readonly rule: string;
}

for (const path of PATHS) {
  test(`DEC-0170 / TS-WEB-0020-A23 / TS-WEB-0019-A23 / TS-WEB-0006-A19: no quote under a live list, no two quotes in a row, one homescreen module — ${path}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.locator("#main")).toBeAttached();

    const findings: Finding[] = await page.evaluate(() => {
      const visible = (element: Element) =>
        element.checkVisibility({ visibilityProperty: true, opacityProperty: false });
      const follows = (a: Element, b: Element) =>
        Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
      const main = document.querySelector("#main")!;
      const sections = [...main.querySelectorAll("section, aside")].filter(
        (section) => !section.parentElement?.closest("section, aside"),
      );
      const name = (section: Element) =>
        section.id || (section as HTMLElement).dataset.block || "(unnamed)";

      /** The last element in the section that renders visible text of its own. */
      const lastText = (section: Element): Element | undefined => {
        let last: Element | undefined;
        const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const parent = node.parentElement;
          if (parent && node.textContent?.trim() && visible(parent)) last = parent;
        }
        return last;
      };

      const out: { section: string; rule: string }[] = [];
      sections.forEach((section, index) => {
        const quotes = [...section.querySelectorAll("blockquote")].filter(visible);
        const rows = [...section.querySelectorAll("article[class*='event-row']")].filter(visible);
        const lastRow = rows.at(-1);
        if (lastRow && quotes.some((quote) => follows(lastRow, quote))) {
          out.push({ section: name(section), rule: "a proof quote stands under a live list" });
        }
        const next = sections[index + 1];
        const endsOnQuote = lastText(section)?.closest("blockquote");
        if (next && endsOnQuote && [...next.querySelectorAll("blockquote")].some(visible)) {
          out.push({ section: name(section), rule: `ends on a quote and ${name(next)} carries one` });
        }
      });

      if (main.querySelectorAll('[data-platform="ios"]').length > 1) {
        out.push({ section: "(page)", rule: "the homescreen instructions render more than once" });
      }
      return out;
    });

    expect(findings, JSON.stringify(findings)).toEqual([]);
  });
}
