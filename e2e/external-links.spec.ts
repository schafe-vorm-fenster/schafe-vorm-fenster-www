import { expect, test, type Page } from "@playwright/test";

import { everyRoute, href, SITE_ORIGIN } from "../src/lib/routes/routes";

/**
 * TS-WEB-0016-A24 — every link to another origin opens a new tab, on every
 * route, and says so (DEC-0169, owner review 2026-10-27, issue #82: "Externe
 * Links, bspw. zum Dorfkalender, müssen immer in target=_blank geöffnet
 * werden! Aktuell verschwindet sonst die Webseite.").
 *
 * The rendered page is what the visitor clicks, so this reads the DOM after
 * the live modules landed — the village-calendar handovers, the nearby
 * module's calendar link and the place photograph's credit are all rendered
 * in the browser (DEC-0163) and no static scan sees them. The static half
 * (`scripts/external-links.test.ts`, TS-WEB-0016-A25) keeps the policy in one
 * component; this half proves the component is what reached the page.
 *
 * Per anchor whose resolved origin is neither this page's nor the canonical
 * site's: `target="_blank"`, `rel` carrying `noopener` and `noreferrer`, and
 * an `aria-describedby` that resolves to text naming the new tab. A `tel:` or
 * `mailto:` link is not a navigation and is not asked for a target.
 *
 * And the new tab is never **visible** text (owner, 2026-10-27, issue 100:
 * "öffnet neuen Tab" stood next to "Original ansehen" on the press page and
 * next to the quote link on `/ueber-uns`; the `external-link` glyph already
 * says it). Every text node naming it must sit in a visually hidden box.
 */

const SAMPLES = [
  ...everyRoute().map(({ route, locale }) => href(route, locale)),
  // A chosen place: its own calendar handover, its photograph's credit and
  // the nearby module's calendar link only exist once a place is known.
  `${href("place", "de")}?ort=schlatkow`,
  `${href("place", "en")}?ort=schlatkow`,
];

interface Offender {
  readonly href: string;
  readonly target: string | null;
  readonly rel: string | null;
  readonly description: string;
}

/** Text that names the new tab and a sighted visitor can see. */
async function visibleNewTabText(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const found: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!/neue[nm]? Tab|new tab/i.test(node.textContent ?? "")) continue;
      const element = node.parentElement;
      if (element === null || !element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
      const box = element.getBoundingClientRect();
      const clipped = getComputedStyle(element).clipPath !== "none";
      if (box.width > 1 && box.height > 1 && !clipped) found.push((node.textContent ?? "").trim());
    }
    return found;
  });
}

async function externalAnchors(page: Page): Promise<{ count: number; offenders: Offender[] }> {
  return page.evaluate((siteOrigin) => {
    const external = [...document.querySelectorAll<HTMLAnchorElement>("a[href]")].filter((anchor) => {
      const url = new URL(anchor.href, location.href);
      if (url.protocol !== "http:" && url.protocol !== "https:") return false;
      return url.origin !== location.origin && url.origin !== siteOrigin;
    });
    const offenders = external.flatMap((anchor) => {
      const rel = (anchor.getAttribute("rel") ?? "").split(/\s+/);
      const description = (anchor.getAttribute("aria-describedby") ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => document.getElementById(id)?.textContent ?? "")
        .join(" ");
      const ok =
        anchor.getAttribute("target") === "_blank" &&
        rel.includes("noopener") &&
        rel.includes("noreferrer") &&
        /neue[nm]? Tab|new tab/i.test(description);
      return ok
        ? []
        : [{ href: anchor.href, target: anchor.getAttribute("target"), rel: anchor.getAttribute("rel"), description }];
    });
    return { count: external.length, offenders };
  }, SITE_ORIGIN);
}

test.describe("TS-WEB-0016-A24: every link to another origin opens a new tab and says so", () => {
  for (const path of SAMPLES) {
    test(`${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      // The live modules render their links after their answer (DEC-0163).
      await page.waitForTimeout(500);
      const { offenders } = await externalAnchors(page);
      expect(offenders, `links to another origin that do not open a new tab on ${path}`).toEqual([]);
      expect(await visibleNewTabText(page), `visible new-tab text on ${path} (issue 100)`).toEqual([]);
    });
  }

  test("the sweep sees the links it is about — the village calendar among them", async ({ page }) => {
    await page.goto(`${href("place", "de")}?ort=schlatkow`);
    await page.waitForLoadState("networkidle");
    const { count } = await externalAnchors(page);
    expect(count, "a chosen place carries at least its calendar handover").toBeGreaterThan(0);
    const calendar = page.locator('a[data-new-tab][href*="schlatkow"]').first();
    await expect(calendar).toHaveAttribute("target", "_blank");
  });

  test("a phone number and an e-mail address stay in the tab", async ({ page }) => {
    await page.goto(href("home", "de"));
    for (const scheme of ["tel:", "mailto:"]) {
      const links = page.locator(`a[href^="${scheme}"]`);
      expect(await links.count(), `${scheme} links on /`).toBeGreaterThan(0);
      for (const link of await links.all()) await expect(link).not.toHaveAttribute("target", /.+/);
    }
  });
});
