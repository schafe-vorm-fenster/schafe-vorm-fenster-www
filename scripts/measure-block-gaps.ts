/**
 * Measure the vertical gap between adjacent blocks inside every section of
 * every route, at 390 and 1280 px — the audit behind DEC-0171 and
 * `plan/architecture/2026-10-27-frontend-layout-review.md`.
 *
 *   E2E_BASE_URL=http://localhost:3242 pnpm tsx scripts/measure-block-gaps.ts \
 *     [--scope sections|stacks] [--out file.json] [--shots dir]
 *
 * "Block" and "gap" are defined once, in `e2e/support/block-gaps.ts`, and the
 * acceptance test (`e2e/block-gaps.spec.ts`, TS-WEB-0017-A31) reads the same
 * function, so the audit and the guard cannot measure two different things.
 * The script prints every pair below the block gap and a histogram of all
 * gaps; `--shots` also writes a full-page screenshot per route and width.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { chromium } from "@playwright/test";

import { readBlockGaps, type BlockGap, type BlockGapScope } from "../e2e/support/block-gaps";
import { everyRoute, href } from "../src/lib/routes/routes";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3100";
const WIDTHS = [390, 800, 1280];
/**
 * `--block-gap` and `--block-gap-bound` per tier (DEC-0178): 16/8 below xl,
 * 24/12 from xl (64rem = 1024 px). A kicker binds to the block it names.
 */
const gapsAt = (width: number) => (width >= 1024 ? { gap: 24, bound: 12 } : { gap: 16, bound: 8 });

const argument = (name: string) => {
  const index = process.argv.indexOf(name);
  return index > -1 ? process.argv[index + 1] : undefined;
};

async function main() {
  const out = argument("--out");
  // `sections` (default): every container of every section, the audit's view,
  // which also sees sections no shell renders. `stacks`: what the guard walks.
  const scope = (argument("--scope") ?? "sections") as BlockGapScope;
  const shots = argument("--shots");
  if (shots) mkdirSync(shots, { recursive: true });

  const browser = await chromium.launch();
  const results: { path: string; width: number; gaps: BlockGap[] }[] = [];
  for (const { route, locale } of everyRoute()) {
    const path = href(route, locale);
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      // tsx compiles with esbuild's keepNames, which wraps named functions in
      // a `__name` helper the page does not have.
      await page.addInitScript({ content: "globalThis.__name = (f) => f;" });
      await page.goto(`${BASE}${path}`);
      await page.waitForLoadState("networkidle");
      // Motion reveals start offset; let them settle before measuring.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForTimeout(300);
      const { gaps } = await page.evaluate(readBlockGaps, scope);
      results.push({ path, width, gaps });
      if (shots) {
        const name = `${path.replace(/\//g, "_") || "_"}-${width}.png`;
        await page.screenshot({ fullPage: true, path: join(shots, name) });
      }
      await page.close();
    }
  }
  await browser.close();

  const under = results.flatMap(({ path, width, gaps }) =>
    gaps
      .filter((gap) => gap.gap < (gap.afterKicker ? gapsAt(width).bound : gapsAt(width).gap) - 0.5)
      .map((gap) => ({ path, width, ...gap })),
  );
  const histogram = new Map<number, number>();
  for (const { gaps } of results)
    for (const { gap } of gaps) histogram.set(Math.round(gap), (histogram.get(Math.round(gap)) ?? 0) + 1);

  for (const row of under)
    console.log(`${row.path} @${row.width}  ${row.section}  ${row.gap}px  ${row.from}  →  ${row.to}`);
  console.log(`\n${under.length} pairs under their tier's block gap across ${results.length} route × width runs`);
  console.log(
    "gap histogram (px: count):",
    [...histogram.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([gap, count]) => `${gap}:${count}`)
      .join(" "),
  );
  if (out) writeFileSync(out, JSON.stringify({ base: BASE, results, under }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
