import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

import type { RouteId } from "../src/lib/routes/routes";

/**
 * The end of every page, after the owner's review of 2026-10-27 (DEC-0174).
 *
 * - **TS-WEB-0006-A6 / A7** — the page's own closing block comes first, then
 *   the context band as the **last block in `main`** (issue #93). On `/` the
 *   closing block is the closing search on `ink`, which SRC-0014 §Page Rhythm
 *   keeps last, so the order there is band → search. On the merged pages the
 *   closing anchor sits inside the band, which is last by construction.
 * - **TS-WEB-0006-A20** — the band is the page's only hand-off to another job
 *   (issue #92, SRC-0017 CG-045): no top-level block of the page's own, without
 *   a heading of its own, whose links all point at jobs the band offers. That
 *   is the shape of the one-sentence cross-reference `/mitmachen` carried until
 *   this change; a scene's or a tier's onward link stands in a block with a
 *   heading and is a step of the page's own argument.
 *
 * The two flow routes compose their chrome step by step and carry no band on
 * the steps a direct load lands on past the first (F-2-10,
 * `e2e/routes.spec.ts`); they are not `PageFrame` pages and are left out.
 */

const FLOW_ROUTES: ReadonlySet<RouteId> = new Set<RouteId>(["register", "order"]);
/** The closing search on `ink` stays last (SRC-0014 §Page Rhythm, DEC-0117). */
const SEARCH_CLOSING_LAST: ReadonlySet<RouteId> = new Set<RouteId>(["home"]);
/** `/ueber-uns` has no closing CTA; the band is last in main (DEC-0186). */
const NO_CLOSING_CTA: ReadonlySet<RouteId> = new Set<RouteId>(["about"]);

for (const { route, locale } of everyRoute()) {
  if (FLOW_ROUTES.has(route)) continue;
  const path = href(route, locale);

  test(`TS-WEB-0006-A6/A7: ${path} — ${
    SEARCH_CLOSING_LAST.has(route) ? "band, then the closing search, last" : "closing block, then the band, last in main"
  }`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("#context-band")).toHaveCount(1);
    await expect(page.locator("#closing-cta")).toHaveCount(NO_CLOSING_CTA.has(route) ? 0 : 1);

    const tail = await page.evaluate(() => {
      const main = document.querySelector("main");
      if (!main) return null;
      // Top-level blocks: what renders, not the scripts and hidden boundaries
      // React leaves between them.
      const blocks = [...main.children].filter(
        (element) =>
          !["SCRIPT", "TEMPLATE", "STYLE", "LINK"].includes(element.tagName) &&
          !(element as HTMLElement).hidden &&
          (element.textContent ?? "").trim() !== "",
      );
      return blocks.map((element) => {
        if (element.matches("#context-band") || element.querySelector("#context-band")) return "context-band";
        if (element.matches("#closing-cta") || element.querySelector("#closing-cta")) return "closing-cta";
        return "own";
      });
    });

    expect(tail, `main on ${path}`).not.toBeNull();
    const last = tail!.slice(-2);
    const merged = tail!.at(-1) === "context-band" && (await page.locator("#context-band #closing-cta").count()) === 1;
    if (merged || NO_CLOSING_CTA.has(route)) {
      expect(tail!.at(-1)).toBe("context-band");
    } else if (SEARCH_CLOSING_LAST.has(route)) {
      expect(last, `the end of main on ${path}`).toEqual(["context-band", "closing-cta"]);
    } else {
      expect(last, `the end of main on ${path}`).toEqual(["closing-cta", "context-band"]);
    }
  });

  test(`TS-WEB-0006-A20: ${path} — no hand-off sentence beside the context band`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("#context-band")).toHaveCount(1);

    const handOffs = await page.evaluate(() => {
      const main = document.querySelector("main");
      const band = document.querySelector("#context-band");
      if (!main || !band) return ["no main or no band"];
      const pathOf = (link: Element) => new URL((link as HTMLAnchorElement).href, location.href).pathname;
      const bandTargets = new Set([...band.querySelectorAll("a[href]")].map(pathOf));
      const found: string[] = [];
      for (const block of main.children) {
        if (block.matches("#context-band, #closing-cta") || block.querySelector("#context-band, #closing-cta")) continue;
        if ((block as HTMLElement).hidden) continue;
        if (block.querySelector("h1, h2, h3")) continue;
        const links = [...block.querySelectorAll("a[href]")];
        if (links.length > 0 && links.every((link) => bandTargets.has(pathOf(link)))) {
          found.push(`${block.tagName.toLowerCase()}[data-block=${block.getAttribute("data-block") ?? ""}]: ${(block.textContent ?? "").trim().slice(0, 80)}`);
        }
      }
      return found;
    });
    expect(handOffs, `hand-off blocks on ${path}`).toEqual([]);
  });
}
