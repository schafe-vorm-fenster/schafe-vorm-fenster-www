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
 * TS-WEB-0002-A13 and TS-WEB-0022-A19, and the whole of the truncation and
 * swipe criteria A20 and A21 (issues #47 and #27, DEC-0161).
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
  // As tall as its panes, and at least as tall as a pane is wide: the floor is
  // the pane's square, not the stage's, so no band is left under the graphics
  // (DEC-0182). Every graphic fills its pane.
  const panes = await stage.locator("[data-explain-pane]").evaluateAll((elements) =>
    elements.map((pane) => {
      const box = pane.getBoundingClientRect();
      const graphic = (pane.firstElementChild as HTMLElement).getBoundingClientRect();
      return { width: box.width, height: box.height, graphicHeight: graphic.height };
    }),
  );
  for (const pane of panes) {
    expect(Math.abs((stageBox?.height ?? 0) - pane.height)).toBeLessThan(1);
    expect(pane.height).toBeGreaterThanOrEqual(pane.width - 0.5);
    expect(Math.abs(pane.graphicHeight - pane.height)).toBeLessThan(1);
  }

  const heights = [stageBox?.height];
  for (const step of [2, 3]) {
    await explainModule.locator(`[data-explain-step="${step}"]`).click();
    await page.waitForTimeout(TRANSITION + 100);
    heights.push((await stage.boundingBox())?.height);
    expect((await explainModule.boundingBox())?.height).toBe(moduleBox?.height);
  }
  expect(new Set(heights).size).toBe(1);
});

/**
 * The truncation instrument (issue #47, DEC-0154, DEC-0161). The old A18 test
 * measured "one line" as "as tall as one line-height" — which an
 * `ellipsis` clamp satisfies by construction, so the instrument passed on
 * exactly the defect the owner's review found. This one fails it: a step
 * line may wrap, it may never be cut.
 */
async function truncatedStepText(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("[data-explain-step]")]
      .flatMap((line) => [...line.querySelectorAll<HTMLElement>("span:not([aria-hidden])")])
      .filter((span) => {
        const style = getComputedStyle(span);
        const clamp = style.getPropertyValue("-webkit-line-clamp");
        return (
          style.textOverflow === "ellipsis" ||
          (clamp !== "" && clamp !== "none") ||
          span.scrollHeight > span.clientHeight ||
          span.scrollWidth > span.clientWidth
        );
      })
      .map((span) => span.textContent ?? ""),
  );
}

for (const width of [390, 1280]) {
  test(`TS-WEB-0022-A20 (supersedes TS-WEB-0022-A18): at ${width} px no step line is truncated on the fixture, on / and on /mitmachen`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const path of [FIXTURE, "/", "/mitmachen"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const lines = await page.locator("[data-explain-step]").count();
      expect(lines, `${path} renders step lines`).toBeGreaterThanOrEqual(3);
      expect(await truncatedStepText(page), `${path}: truncated step text`).toEqual([]);
    }
  });
}

test("TS-WEB-0022-A21: below lg the stage swipes and its two arrows step through the states", async ({
  page,
}) => {
  const explainModule = await open(page, { width: 390, height: 844 });
  await showFraction(page, explainModule, 1);
  const stage = explainModule.locator("[data-explain-stage]");
  const previous = explainModule.locator('[data-explain-arrow="previous"]');
  const next = explainModule.locator('[data-explain-arrow="next"]');
  const moduleHeight = (await explainModule.boundingBox())?.height;

  // Real buttons with a name, inside the stage, at the 44 px floor.
  for (const arrow of [previous, next]) {
    await expect(arrow).toBeVisible();
    expect(await arrow.evaluate((element) => element.tagName)).toBe("BUTTON");
    expect((await arrow.getAttribute("aria-label"))?.length ?? 0).toBeGreaterThan(0);
    const box = await arrow.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
  await expect(previous).toHaveAttribute("aria-disabled", "true");

  // An arrow is handwork: it selects the neighbour and stops the pass.
  await next.click();
  await expect(explainModule).toHaveAttribute("data-state", "2");
  expect(await advance(explainModule)).toBe("stopped");
  await expect(explainModule.locator('[data-explain-step="2"]')).toHaveAttribute("aria-current", "step");
  await expect
    .poll(() =>
      stage.evaluate((element) => {
        const pane = element.querySelector<HTMLElement>('[data-explain-pane="2"]');
        return Math.abs(element.scrollLeft - (pane?.offsetLeft ?? -999)) < 2;
      }),
    )
    .toBe(true);

  // The keyboard reaches it: Enter on the focused arrow.
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(explainModule).toHaveAttribute("data-state", "3");
  await expect(next).toHaveAttribute("aria-disabled", "true");

  // A swipe that settles on a pane selects that step — the step lines follow.
  await stage.evaluate((element) => element.scrollTo({ left: 0, behavior: "instant" }));
  await expect(explainModule).toHaveAttribute("data-state", "1");
  await expect(explainModule.locator('[data-explain-step="1"]')).toHaveAttribute("aria-current", "step");

  // Nothing moved around the stage, and the page never scrolls sideways.
  expect((await explainModule.boundingBox())?.height).toBe(moduleHeight);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
});

test("TS-WEB-0022-A21: under reduced motion an arrow changes the pane without a slide", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const explainModule = await open(page, { width: 390, height: 844 });
  await showFraction(page, explainModule, 1);
  expect(await advance(explainModule)).toBe("static");
  const stage = explainModule.locator("[data-explain-stage]");

  await explainModule.locator('[data-explain-arrow="next"]').click();
  // Instant: the very next frame already shows pane 2, no smooth scroll in between.
  const settled = await stage.evaluate(
    (element) =>
      new Promise<boolean>((resolve) =>
        requestAnimationFrame(() => {
          const pane = element.querySelector<HTMLElement>('[data-explain-pane="2"]');
          resolve(Math.abs(element.scrollLeft - (pane?.offsetLeft ?? -999)) < 2);
        }),
      ),
  );
  expect(settled).toBe(true);
  await expect(explainModule).toHaveAttribute("data-state", "2");
});

test("TS-WEB-0022-A21: from lg there are no arrows — everything is visible at once", async ({ page }) => {
  const explainModule = await open(page, { width: 1024, height: 800 });
  for (const which of ["previous", "next"]) {
    await expect(explainModule.locator(`[data-explain-arrow="${which}"]`)).toBeHidden();
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
