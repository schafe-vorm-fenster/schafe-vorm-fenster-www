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
