import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * The a11y instrument — TS-002-A1 and TS-029-A12 (F-2-6, round 2).
 *
 * Neither AC had a machine check before this file: no axe dependency
 * existed in the tree (`state/findings/round-2.md` F-2-6), and
 * `e2e/pages/rechtliches.spec.ts` recorded TS-029-A12 as a named, skipped
 * test. DEC-076 is the stack-harmony ADR for `@axe-core/playwright`.
 *
 * Scope of this sweep, deliberately bounded to what the round asked for:
 *   - all 24 (route × locale) pairs of the TS-004 D1 inventory
 *     (`everyRoute()`, the same source `e2e/routes.spec.ts` walks)
 *   - two viewports: 360 px (the DEC-067 phone reference) and 1280 px
 *     (a desktop reference)
 *   - WCAG 2.1 A/AA rules only (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`)
 *   - fails the run on a `serious` or `critical` violation; `moderate`/
 *     `minor` are recorded (see `console.log` below and the retest report)
 *     but do not fail the test — `plan/process.md`'s severity ladder puts a
 *     defect without a critical/high AC violation on the findings list, not
 *     on a red gate.
 *
 * TS-002-A1 literally asks for "zero violations … in all three [D4] themes"
 * (light/dark/high-contrast via `prefers-color-scheme`/`prefers-contrast`).
 * This sweep runs the default (light, no-preference) theme only — the
 * three-theme matrix is out of this bounded round and stays a gap against
 * the AC's letter; violations this sweep *does* find are filed as round-2
 * findings per the round's instruction rather than fixed here.
 *
 * Violations found by a run of this sweep are not fixed inline (this file's
 * job is the instrument, not a page-by-page a11y pass) — they are recorded
 * as `state/findings/round-2.md` findings, `F-2-28` onward.
 */

const VIEWPORTS = [
  { name: "360px", width: 360, height: 800 },
  { name: "1280px", width: 1280, height: 900 },
] as const;

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const FAILING_IMPACTS = new Set(["serious", "critical"]);

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  locale,
  route,
}));

// "default", not `fullyParallel` (the project config's default): 48 axe
// injections launched at once against one dev-server process produced
// observed false negatives during this file's own tryout runs — a route's
// genuinely present color-contrast defect (confirmed reproducible 5/5 when
// requested one at a time) came back clean under full worker parallelism,
// consistent with TS-004 D5's per-instance BFF rate limiter (F-2-17) or
// dev-server compile contention degrading a live module to a state without
// the affected element under concurrent load. "default" mode runs this
// file's tests one at a time in declaration order without the "skip the
// rest after one failure" behaviour `mode: "serial"` would add — each test
// here is independent, so a failure must not hide the next route's result.
test.describe.configure({ mode: "default" });

test("TS-002-A1/TS-029-A12: the sweep covers all 24 routes", () => {
  expect(ROUTES).toHaveLength(24);
});

for (const { path, locale, route } of ROUTES) {
  for (const viewport of VIEWPORTS) {
    test(`TS-002-A1/TS-029-A12: ${path} (${route}/${locale}) has no serious/critical WCAG 2.1 AA violation at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto(path);
      expect(response?.status(), `status of ${path}`).toBe(200);
      // Settle hydration and any load-time transition before the sweep —
      // scanning mid-transition produced one observed flake (a transient
      // color-contrast hit on a fade-in element that a rerun did not
      // reproduce) during this file's own tryout runs.
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

      const blocking = results.violations.filter((violation) =>
        FAILING_IMPACTS.has(violation.impact ?? ""),
      );
      const other = results.violations.filter(
        (violation) => !FAILING_IMPACTS.has(violation.impact ?? ""),
      );

      if (other.length > 0) {
        // Recorded, not failed — see the file header. Printed so a run's
        // output is the retest's raw material for filing F-2-28+.
        console.log(
          `a11y (non-blocking) ${path} @ ${viewport.name}: ${other
            .map((v) => `${v.id}(${v.impact})×${v.nodes.length}`)
            .join(", ")}`,
        );
      }

      expect(
        blocking.map((v) => `${v.id}(${v.impact}): ${v.help}`),
        `serious/critical violations at ${path} @ ${viewport.name}`,
      ).toEqual([]);
    });
  }
}
