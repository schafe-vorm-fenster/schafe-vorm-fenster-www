import { expect, test } from "@playwright/test";

import { ROUTE_IDS, href } from "../src/lib/routes/routes";

/**
 * TS-009-A8 — layout stability between first paint and settle.
 *
 * F-2-68: the chaos hasty-clicker persona measured up to 174px of movement
 * on `/` between `domcontentloaded` and settle (`state/findings/
 * round-2-chaos-hasty-clicker.md` C-H-12) — a visitor who clicks a
 * below-the-fold control in that window hits the wrong element. This file
 * is that measurement made repeatable, at both DEC-067 reference viewports,
 * on every TS-004 D1 route (the twelve German paths; the English mirrors
 * share the same components and styles, so a locale sweep would not catch a
 * different class of defect).
 *
 * Method, unchanged from the chaos run: load with `waitUntil:
 * "domcontentloaded"`, read `getBoundingClientRect()` for a fixed set of
 * anchors (the `h1`, every `[data-cta]`, and every interactive control in
 * the footer region — the same controls C-H-12 named) a short beat later,
 * then read the same elements again after `networkidle` plus a settle
 * pause. Elements are matched across the two reads by tag + trimmed text,
 * which is stable across a font swap or a cache warming (neither changes
 * what a control says, only where it sits).
 *
 * Target: TS-009-A8 asks for CLS < 0.1; the task's own bar is tighter and
 * more directly checkable without a CLS harness — ≤ 8px of cumulative
 * movement (the sum of every matched anchor's own displacement) per route
 * per viewport.
 */

const VIEWPORTS = [
  { name: "360x640", width: 360, height: 640 },
  { name: "1280x800", width: 1280, height: 800 },
] as const;

const CUMULATIVE_SHIFT_BUDGET_PX = 8;

const ANCHOR_SELECTOR = [
  "h1",
  "[data-cta]",
  ".site-footer button",
  ".site-footer a",
  ".site-footer input",
].join(", ");

interface AnchorRect {
  readonly key: string;
  readonly x: number;
  readonly y: number;
}

async function readAnchors(page: import("@playwright/test").Page): Promise<AnchorRect[]> {
  return page.$$eval(ANCHOR_SELECTOR, (elements) =>
    elements.map((element, index) => {
      const rect = element.getBoundingClientRect();
      const text = (element.textContent ?? "").trim().slice(0, 40);
      return {
        // Index breaks a tie between two controls with identical tag+text
        // (e.g. two empty inputs) without needing them to carry an id.
        key: `${element.tagName}:${text}:${index}`,
        x: rect.left,
        y: rect.top,
      };
    }),
  );
}

for (const routeId of ROUTE_IDS) {
  const path = href(routeId, "de");

  test.describe(`TS-009-A8: layout stability — ${path}`, () => {
    for (const viewport of VIEWPORTS) {
      test(`≤ ${CUMULATIVE_SHIFT_BUDGET_PX}px cumulative shift at ${viewport.name}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(path, { waitUntil: "domcontentloaded" });
        // The chaos run's own "early" read point — a hasty click lands here.
        await page.waitForTimeout(50);
        const early = await readAnchors(page);

        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(1000);
        const settled = await readAnchors(page);

        const settledByKey = new Map(settled.map((anchor) => [anchor.key, anchor]));
        let cumulative = 0;
        const perAnchor: string[] = [];
        for (const anchor of early) {
          const after = settledByKey.get(anchor.key);
          if (after === undefined) continue; // Removed between reads — not a shift to measure.
          const dx = Math.abs(after.x - anchor.x);
          const dy = Math.abs(after.y - anchor.y);
          const shift = dx + dy;
          if (shift > 0.5) perAnchor.push(`${anchor.key}: Δx=${dx.toFixed(1)} Δy=${dy.toFixed(1)}`);
          cumulative += shift;
        }

        expect(
          cumulative,
          `anchors that moved:\n${perAnchor.join("\n") || "(none)"}`,
        ).toBeLessThanOrEqual(CUMULATIVE_SHIFT_BUDGET_PX);
      });
    }
  });
}

/**
 * F-2-69 — the real thing: Cumulative Layout Shift, not a proxy for it.
 *
 * The per-anchor budget above is 24/24 green and still missed CLS 0.2197 on
 * `/ueber-uns/archiv`: it matches anchors by tag + text and the archive's
 * anchors (the `h1`, the footer controls) did not move — what moved was the
 * row list, 262 px, when the client-only filter chip row was inserted after
 * hydration. A shape of check that watches a fixed anchor set cannot see a
 * shift of everything *between* those anchors, so this block measures the
 * metric the criteria actually name:
 *
 *   TS-009-A8  — "CLS < 0.1 on every content page … with all islands streaming"
 *   TS-028-A13 — "CLS measured over load plus three filter interactions stays < 0.1"
 *
 * Method, the same one the finding used so the numbers are comparable: a
 * `layout-shift` `PerformanceObserver` installed with `buffered: true` in an
 * init script (so shifts before the observer attaches still count), then
 * `goto` → `networkidle` → a settle pause → read the accumulated value.
 *
 * Deliberately stricter than the browser's own CLS: shifts carrying
 * `hadRecentInput` are counted too, rather than discounted, because
 * TS-028-A13 asks explicitly for the three filter interactions to be inside
 * the measured window. (In the finding's measurement they contributed 0.0008
 * of the 0.2197, so this costs the budget nothing and closes a hiding place.)
 *
 * The primary viewport is 360×800 — the finding's own, and the mobile-first
 * base case (TS-017 D2). The archive is measured at all three reference
 * widths on top, because its fix is a *reserved* block whose height has to
 * match the chip row after wrapping at each of them, not only at 360.
 */

const CLS_BUDGET = 0.1;
const CLS_VIEWPORT = { width: 360, height: 800 } as const;
/** DEC-067's reference widths — the chip row wraps to a different line count at each. */
const ARCHIVE_WIDTHS = [360, 768, 1024] as const;

interface ClsWindow {
  __cls: number;
}

/** Must run before the first navigation, or the load shifts are already lost. */
async function installClsObserver(page: import("@playwright/test").Page): Promise<void> {
  await page.addInitScript(() => {
    const store = window as unknown as ClsWindow;
    store.__cls = 0;
    if (!PerformanceObserver.supportedEntryTypes?.includes("layout-shift")) return;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        store.__cls += (entry as PerformanceEntry & { value: number }).value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
}

async function settleAndReadCls(page: import("@playwright/test").Page): Promise<number> {
  await page.waitForLoadState("networkidle");
  // Not a wait for a state — a measurement window. The finding's own settle
  // pause: the archive's shift landed 279–370 ms after load, and late fonts,
  // late images and a late island all fall inside 1.2 s.
  await page.waitForTimeout(1200);
  return page.evaluate(() => (window as unknown as ClsWindow).__cls);
}

for (const routeId of ROUTE_IDS) {
  const path = href(routeId, "de");

  test(`TS-009-A8: CLS < ${CLS_BUDGET} — ${path} at 360×800`, async ({ page }) => {
    await page.setViewportSize({ ...CLS_VIEWPORT });
    await installClsObserver(page);
    await page.goto(path);
    const cls = await settleAndReadCls(page);
    expect(cls, `${path} accumulated CLS ${cls.toFixed(4)}`).toBeLessThan(CLS_BUDGET);
  });
}

for (const width of ARCHIVE_WIDTHS) {
  test(`TS-028-A13: CLS < ${CLS_BUDGET} over load plus three filter interactions at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await installClsObserver(page);
    await page.goto(href("archive", "de"));

    // The chip row is client-only (TS-028 D8) and replaces a reserved block of
    // its own size at hydration (F-2-69) — waiting for the component's own
    // ready state is what makes the three interactions below deterministic.
    await expect(page.locator("[data-archive-filter]")).toHaveAttribute("data-hydrated", "true");

    const chips = page.getByRole("group").getByRole("button");
    await chips.nth(1).click(); // one type
    await chips.nth(2).click(); // a second type, OR-combined
    await chips.nth(0).click(); // "Alle" — back to the full list

    const cls = await settleAndReadCls(page);
    expect(cls, `archive at ${width}px accumulated CLS ${cls.toFixed(4)}`).toBeLessThan(CLS_BUDGET);
  });
}
