import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";
import { readBlockGaps } from "./support/block-gaps";

/**
 * TS-WEB-0017-A31 — one owner per level of vertical space (DEC-0171,
 * SRC-0014 §Shape and Space "Who owns which space").
 *
 * The section owns its padding, the content stack (`[data-stack]`) owns the
 * space between its blocks, and a block owns nothing outside its own box.
 * "Block" and "gap" are defined once, in `e2e/support/block-gaps.ts`; the
 * audit script `scripts/measure-block-gaps.ts` reads the same function.
 *
 * On every route, in both languages, at 390 and 1280 px, for every stack:
 *
 *  1. two adjacent blocks stand at least `--block-gap` (16 px) apart, or
 *     `--block-gap-bound` (8 px) where the first is the section's kicker;
 *  2. the space comes from the stack — the second block's computed
 *     `margin-top` is exactly that value and the first block's
 *     `margin-bottom` is 0, so no component brings an outer margin of its own
 *     and no component's `margin: 0` takes the stack's away (#90, issue 108);
 *  3. the first block has no `margin-top` and the last no `margin-bottom`, so
 *     the section's padding is the only space at its edges.
 */

const WIDTHS = [390, 1280];
const BLOCK_GAP = 16;
const BLOCK_GAP_BOUND = 8;

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  name: `${route} (${locale})`,
}));

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`TS-WEB-0017-A31: every block in a section stack keeps the block gap on ${route.name} at ${width} px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route.path);
      await page.waitForLoadState("networkidle");

      const { gaps, edges } = await page.evaluate(readBlockGaps, "stacks" as const);
      expect(gaps.length + edges.length, `${route.path}: no content stack measured`).toBeGreaterThan(0);

      const failures: string[] = [];
      for (const gap of gaps) {
        const expected = gap.afterKicker ? BLOCK_GAP_BOUND : BLOCK_GAP;
        const where = `${gap.section}: ${gap.from} → ${gap.to}`;
        if (gap.gap < expected - 0.5) failures.push(`${where} stands ${gap.gap}px apart, under ${expected}px`);
        if (Math.abs(gap.marginTop - expected) > 0.5)
          failures.push(`${where}: margin-top ${gap.marginTop}px, not the stack's ${expected}px`);
        if (gap.marginBottom > 0.5) failures.push(`${where}: the first block brings margin-bottom ${gap.marginBottom}px`);
      }
      for (const edge of edges) {
        if (edge.firstMarginTop > 0.5)
          failures.push(`${edge.section}: first block ${edge.first} has margin-top ${edge.firstMarginTop}px`);
        if (edge.lastMarginBottom > 0.5)
          failures.push(`${edge.section}: last block ${edge.last} has margin-bottom ${edge.lastMarginBottom}px`);
      }

      expect(failures, `${route.path} @${width}:\n${failures.join("\n")}`).toEqual([]);
    });
  }
}
