import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * The browser facts of `explain-module` — measured on the development fixture
 * `/dev/explain-module`, because the component's contract is timing and
 * geometry (DEC-0105 §6 as amended twice on 2026-09-25, TS-WEB-0022 D4,
 * TS-WEB-0002 D7) and no render test can hold either.
 *
 * The page walks (`e2e/pages/mitmachen.spec.ts`, `e2e/pages/home.spec.ts`,
 * `e2e/motion-reveal.spec.ts`) assert the same criteria on the real pages
 * once the modules stand there; this file is the component half of
 * TS-WEB-0002-A13, TS-WEB-0022-A18 and TS-WEB-0022-A19.
 *
 * Timing reads the settled state: `data-state` flips when a transition ends,
 * so state 2 settles at 4 550 ms and state 3 at 9 100 ms after the trigger.
 * Timers never fire early; the upper bounds below are tolerance for a busy
 * runner, not part of the specification.
 */

const FIXTURE = "/dev/explain-module";
const PHONE_VIEWPORTS = [
  { name: "360 × 640", width: 360, height: 640 },
  { name: "360 × 800", width: 360, height: 800 },
] as const;

const DWELL = 4000;
const TRANSITION = 550;
const PASS = DWELL + TRANSITION + DWELL + TRANSITION;

async function open(page: Page, viewport: { width: number; height: number }): Promise<Locator> {
  await page.setViewportSize(viewport);
  await page.goto(FIXTURE);
  await page.waitForLoadState("networkidle");
  const explainModule = page.locator("#fixture-module");
  await expect(explainModule).toHaveAttribute("data-explain-module", "");
  return explainModule;
}

/**
 * Scrolls so that exactly `fraction` of the module's own height is inside the
 * viewport, entered from below: the module's top sits at
 * `viewportHeight - fraction × moduleHeight`.
 */
async function showFraction(page: Page, explainModule: Locator, fraction: number): Promise<void> {
  await explainModule.evaluate((element, share) => {
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    window.scrollTo({ top: top - (window.innerHeight - share * rect.height), behavior: "instant" });
  }, fraction);
}

async function visibleFraction(explainModule: Locator): Promise<number> {
  return explainModule.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    return Math.max(0, visible) / rect.height;
  });
}

const state = (explainModule: Locator) => explainModule.getAttribute("data-state");
const advance = (explainModule: Locator) => explainModule.getAttribute("data-advance");

for (const viewport of PHONE_VIEWPORTS) {
  test(`TS-WEB-0002-A13 / TS-WEB-0022-A19: at ${viewport.name} the pass starts at three quarters, dwells, ends at state 3 after 9.1 s and never restarts`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const explainModule = await open(page, viewport);

    // Loaded with the module below the viewport: state 1, armed, and it stays so.
    expect(await visibleFraction(explainModule)).toBe(0);
    await page.waitForTimeout(1500);
    expect(await state(explainModule)).toBe("1");
    expect(await advance(explainModule)).toBe("armed");

    // Just under three quarters: still nothing — an early start fails the criterion.
    await showFraction(page, explainModule, 0.7);
    expect(await visibleFraction(explainModule)).toBeLessThan(0.75);
    await page.waitForTimeout(1500);
    expect(await advance(explainModule)).toBe("armed");

    // Three quarters, and no further: the trigger.
    await showFraction(page, explainModule, 0.76);
    const shown = await visibleFraction(explainModule);
    expect(shown).toBeGreaterThanOrEqual(0.75);
    expect(shown).toBeLessThan(0.8);
    const triggered = Date.now();
    await expect(explainModule).toHaveAttribute("data-advance", "running", { timeout: 1000 });

    // State 1 gets its full dwell.
    await page.waitForTimeout(DWELL - 500);
    expect(await state(explainModule)).toBe("1");

    // State 2 settles no earlier than 4.55 s, state 3 no earlier than 9.1 s.
    await expect(explainModule).toHaveAttribute("data-state", "2", { timeout: 3000 });
    const settledTwo = Date.now() - triggered;
    expect(settledTwo).toBeGreaterThanOrEqual(DWELL + TRANSITION - 50);
    await expect(explainModule).toHaveAttribute("data-state", "3", { timeout: 8000 });
    const settledThree = Date.now() - triggered;
    expect(settledThree).toBeGreaterThanOrEqual(PASS - 50);
    expect(await advance(explainModule)).toBe("done");
    await expect(explainModule.locator('[data-explain-step="3"]')).toHaveAttribute("aria-current", "step");

    // Then it stops: no fourth transition, no return to state 1.
    await page.waitForTimeout(6000);
    expect(await state(explainModule)).toBe("3");
    expect(await advance(explainModule)).toBe("done");

    // Scrolling it out of view and back does not restart it.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(300);
    expect(await visibleFraction(explainModule)).toBe(0);
    await showFraction(page, explainModule, 1);
    await page.waitForTimeout(DWELL + 1000);
    expect(await state(explainModule)).toBe("3");
    expect(await advance(explainModule)).toBe("done");
  });
}

test("TS-WEB-0002-A13: Tab into the module stops the pass for good; every step stays reachable by keyboard", async ({
  page,
}) => {
  const explainModule = await open(page, PHONE_VIEWPORTS[1]);
  await showFraction(page, explainModule, 0.9);
  await expect(explainModule).toHaveAttribute("data-advance", "running", { timeout: 1000 });

  // Focus during the first dwell.
  await page.waitForTimeout(1000);
  await explainModule.locator('[data-explain-step="1"]').focus();
  await expect(explainModule).toHaveAttribute("data-advance", "stopped");
  expect(await state(explainModule)).toBe("1");

  // It never resumes: well past the pass, nothing has moved.
  await page.waitForTimeout(PASS + 1000);
  expect(await state(explainModule)).toBe("1");
  expect(await advance(explainModule)).toBe("stopped");

  // Keyboard: Tab to the next line, Enter shows its state; Space on the third.
  await page.keyboard.press("Tab");
  await expect(explainModule.locator('[data-explain-step="2"]')).toBeFocused();
  await page.keyboard.press("Enter");
  expect(await state(explainModule)).toBe("2");
  await expect(explainModule.locator('[data-explain-step="2"]')).toHaveAttribute("aria-current", "step");
  await expect(explainModule.locator('[data-explain-step="1"]')).not.toHaveAttribute("aria-current", "step");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  expect(await state(explainModule)).toBe("3");
  await expect(explainModule.locator('[data-explain-step="3"]')).toHaveAttribute("aria-current", "step");
  expect(await explainModule.locator("button[aria-current]").count()).toBe(1);
});

test("TS-WEB-0002-A13: activating a step line during the pass shows that state and stops the advance", async ({
  page,
}) => {
  const explainModule = await open(page, PHONE_VIEWPORTS[0]);
  await showFraction(page, explainModule, 0.9);
  await expect(explainModule).toHaveAttribute("data-advance", "running", { timeout: 1000 });
  await page.waitForTimeout(1000);

  await explainModule.locator('[data-explain-step="3"]').click();
  await expect(explainModule).toHaveAttribute("data-state", "3");
  await expect(explainModule).toHaveAttribute("data-advance", "stopped");
  await expect(explainModule.locator('[data-explain-step="3"]')).toHaveAttribute("aria-current", "step");

  await page.waitForTimeout(DWELL + 1000);
  expect(await state(explainModule)).toBe("3");
  await explainModule.locator('[data-explain-step="1"]').click();
  expect(await state(explainModule)).toBe("1");
  expect(await advance(explainModule)).toBe("stopped");
});

test("DEC-0105 §6 rule 6: under prefers-reduced-motion nothing advances — state 1 static, buttons operable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const explainModule = await open(page, PHONE_VIEWPORTS[1]);
  await showFraction(page, explainModule, 1);
  await page.waitForTimeout(DWELL + TRANSITION + 500);
  expect(await state(explainModule)).toBe("1");
  expect(await advance(explainModule)).toBe("static");

  await explainModule.locator('[data-explain-step="2"]').click();
  expect(await state(explainModule)).toBe("2");
  await expect(explainModule.locator('[data-explain-step="2"]')).toHaveAttribute("aria-current", "step");
});

test("TS-WEB-0022-A19: below lg the stage box keeps one height across all three states and the module fits one viewport at 360 × 800", async ({
  page,
}) => {
  const explainModule = await open(page, PHONE_VIEWPORTS[1]);
  const stage = explainModule.locator("[data-explain-stage]");
  await showFraction(page, explainModule, 1);

  const moduleBox = await explainModule.boundingBox();
  expect(moduleBox?.height ?? Infinity).toBeLessThanOrEqual(800);

  const stageBox = await stage.boundingBox();
  expect(stageBox).not.toBeNull();
  // ratio-square: as tall as it is wide.
  expect(Math.abs((stageBox?.height ?? 0) - (stageBox?.width ?? 1))).toBeLessThan(1);

  const heights = [stageBox?.height];
  for (const step of [2, 3]) {
    await explainModule.locator(`[data-explain-step="${step}"]`).click();
    await page.waitForTimeout(TRANSITION + 100);
    heights.push((await stage.boundingBox())?.height);
    expect((await explainModule.boundingBox())?.height).toBe(moduleBox?.height);
  }
  expect(new Set(heights).size).toBe(1);
});

test("TS-WEB-0022-A18: at 390 px every core and every detail renders on exactly one line", async ({ page }) => {
  const explainModule = await open(page, { width: 390, height: 800 });
  for (const step of [1, 2, 3]) {
    const line = explainModule.locator(`[data-explain-step="${step}"]`);
    for (const part of ["core", "detail"]) {
      const element = line.locator(`span:not([aria-hidden])`).nth(part === "core" ? 0 : 1);
      const { height, lineHeight } = await element.evaluate((node) => ({
        height: node.getBoundingClientRect().height,
        lineHeight: parseFloat(getComputedStyle(node).lineHeight),
      }));
      expect(Math.abs(height - lineHeight), `step ${step} ${part}`).toBeLessThan(1);
    }
  }
});

test("TS-WEB-0022 D4 from lg: three steps side by side, no stage box, and nothing moves over 5 s", async ({
  page,
}) => {
  const explainModule = await open(page, { width: 1024, height: 800 });
  await showFraction(page, explainModule, 1);

  // The stage wrapper contributes no box from lg: `display: contents`, an
  // empty rectangle — there is no element to crop or to slide.
  const stageBox = await explainModule.locator("[data-explain-stage]").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { display: getComputedStyle(element).display, height: rect.height, width: rect.width };
  });
  expect(stageBox).toEqual({ display: "contents", height: 0, width: 0 });

  const boxes = await Promise.all(
    [1, 2, 3].map((step) => explainModule.locator(`[data-explain-step="${step}"]`).boundingBox()),
  );
  const panes = await Promise.all(
    [1, 2, 3].map((step) => explainModule.locator(`[data-explain-pane="${step}"]`).boundingBox()),
  );
  // One row of step lines, one row of graphics above them, column n over step n.
  expect(new Set(boxes.map((box) => Math.round(box?.y ?? -1))).size).toBe(1);
  expect(new Set(panes.map((box) => Math.round(box?.y ?? -1))).size).toBe(1);
  for (let index = 0; index < 3; index += 1) {
    expect(Math.abs((panes[index]?.x ?? 0) - (boxes[index]?.x ?? 1))).toBeLessThan(1);
    expect((panes[index]?.y ?? 0) + (panes[index]?.height ?? 0)).toBeLessThanOrEqual(boxes[index]?.y ?? 0);
    if (index > 0) expect(boxes[index]?.x ?? 0).toBeGreaterThan(boxes[index - 1]?.x ?? 0);
  }

  // No advance: the machine is static, the active step stays 1, and nothing moves.
  expect(await advance(explainModule)).toBe("static");
  await page.waitForTimeout(5000);
  expect(await state(explainModule)).toBe("1");
  const after = await Promise.all(
    [1, 2, 3].map((step) => explainModule.locator(`[data-explain-pane="${step}"]`).boundingBox()),
  );
  expect(after).toEqual(panes);
});

test("the CTA is data-cta=secondary, the only data-cta in the module, and every step line is a button", async ({
  page,
}) => {
  const explainModule = await open(page, PHONE_VIEWPORTS[1]);
  await expect(explainModule.locator("[data-cta]")).toHaveCount(1);
  await expect(explainModule.locator('[data-cta="secondary"]')).toHaveCount(1);
  await expect(explainModule.locator('button[data-explain-step][type="button"]')).toHaveCount(3);
  await expect(explainModule.locator("[data-explain-ordinal]")).toHaveText("01");
});
