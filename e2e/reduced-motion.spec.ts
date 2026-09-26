import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

/**
 * TS-WEB-0002-A9 — "with `prefers-reduced-motion`: no animation beyond
 * opacity."
 *
 * The criterion is a browser fact twice over: the media query is resolved by
 * the browser, and "no animation" is a statement about what the browser is
 * actually running. Neither can be read off a stylesheet — `base.css` collapses
 * every `animation-duration` and `transition-duration` to `0.01ms` under the
 * query, `motion-reveal.module.css` cancels its own keyframes, and
 * `explain-module.tsx` asks `matchMedia` before it advances anything. Whether
 * those three agree is only visible in a page.
 *
 * ── The two routes ────────────────────────────────────────────────────────
 *
 * `/` and `/mitmachen` between them carry every piece of motion the site has:
 * the reveal wrapper on the composed sections (both), the auto-advancing
 * explain module (three of them stand on `/mitmachen`, one inside a scene on
 * `/`), the header's burger overlay and the back-to-top control. A route
 * without motion cannot fail this criterion, so sampling is not a compromise
 * here — it is the whole population of movers.
 *
 * ── What is measured ──────────────────────────────────────────────────────
 *
 * 1. **Every animation the browser is running animates opacity and nothing
 *    else.** Read from `document.getAnimations()` rather than from computed
 *    styles: a `CSSTransition` names its property, a `CSSAnimation` carries its
 *    keyframes, and both are asked after the page has been scrolled end to end
 *    and back — the gesture that arms and fires every reveal on the page.
 *    A transform, a `translate`, a `top`/`left`, a size or a margin in that set
 *    is the violation, whatever its duration.
 * 2. **No transition is long enough to be a movement.** `base.css`'s
 *    `0.01ms !important` is what makes the collapse total, so a sampled control
 *    whose `transition-duration` survived it would mean the cascade did not
 *    reach it.
 * 3. **Nothing is left transparent.** The one way to satisfy "no animation" by
 *    accident is to arm a reveal and never fire it — the F-3-10 blank band
 *    (`e2e/motion-reveal.spec.ts`). Under reduced motion the armed state has to
 *    be *opaque*, not merely still.
 * 4. **The explain module stands at state 1.** The auto-advance is the one
 *    content motion WCAG 2.2.2 applies to (TS-WEB-0002 D7, DEC-0105 §6 rule 6):
 *    with the query on, the module reports `data-advance="static"`, stays at
 *    `data-state="1"` for longer than a full pass would take, and its step
 *    lines still work — a reader who prefers no motion loses the movement, not
 *    the content.
 * 5. **Scrolling is not smoothed.** `scroll-behavior: auto !important` is part
 *    of the same block, and an in-page jump is the site's most common movement.
 *
 * ── The dev-tools exclusion ───────────────────────────────────────────────
 *
 * `pnpm next dev` injects its own overlay into the page, and its button keeps a
 * 250 ms transition of its own — measured, not assumed. It is not the site's
 * markup, it never reaches a deployment, and CI runs this same suite against
 * `pnpm start` where it does not exist at all (`playwright.config.ts`). So
 * everything inside Next's dev chrome is excluded by selector, named once in
 * `DEV_CHROME` below rather than filtered ad hoc per case — a criterion about
 * our motion must not be answerable by our toolchain's.
 */

const ROUTES = ["/", "/mitmachen"] as const;

/** DEC-0067's phone reference viewport — where the explain module advances at all. */
const PHONE = { width: 360, height: 800 } as const;

/** The dwell + transition budget of a whole pass (DEC-0105 §6), plus a beat. */
const FULL_PASS_MS = 4_000 + 550 + 4_000 + 550 + 1_000;

/**
 * Keyframe entries carry bookkeeping keys beside the properties they animate;
 * only the rest is a property the browser is moving. The set is handed into the
 * reader below rather than written a second time inside it, so there is one
 * list and no chance of the two drifting.
 */
const KEYFRAME_BOOKKEEPING = new Set(["offset", "computedOffset", "easing", "composite"]);

/** The one property the criterion allows. */
const ALLOWED = new Set(["opacity"]);

/**
 * Next's development overlay — not the site's markup, absent from every
 * deployment and from the CI run (`pnpm start`).
 */
const DEV_CHROME =
  "nextjs-portal, [data-nextjs-dev-tools-button], [data-nextjs-toast], [data-nextjs-dialog], #nextjs-dev-tools-menu";

/**
 * Every property any running animation touches, on the page as it stands.
 *
 * `getAnimations()` is asked for the whole document, so a transition on a
 * pseudo-element and a keyframe animation on a wrapper are both in the answer.
 * Property names are normalised to their CSS spelling — `getKeyframes()` hands
 * them back camelCased — so `transform` and `marginTop` cannot hide behind a
 * spelling.
 */
async function animatedProperties(page: Page): Promise<string[]> {
  return page.evaluate(([devChrome, bookkeepingKeys]: [string, string[]]) => {
    const bookkeeping = new Set(bookkeepingKeys);
    const dash = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    const out = new Set<string>();
    for (const animation of document.getAnimations()) {
      const effect = animation.effect;
      if (!(effect instanceof KeyframeEffect)) continue;
      const target = effect.target;
      if (target instanceof Element && target.closest(devChrome)) continue;
      const transitionProperty = (animation as { transitionProperty?: string }).transitionProperty;
      if (transitionProperty) {
        out.add(dash(transitionProperty));
        continue;
      }
      for (const frame of effect.getKeyframes()) {
        for (const key of Object.keys(frame)) {
          if (!bookkeeping.has(key)) out.add(dash(key));
        }
      }
    }
    return [...out];
  }, [DEV_CHROME, [...KEYFRAME_BOOKKEEPING]] as [string, string[]]);
}

/** The gesture that arms and fires every reveal wrapper: to the end, and back. */
async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, Math.round(document.documentElement.scrollHeight / 2)));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

for (const route of ROUTES) {
  test.describe(`TS-WEB-0002-A9: reduced motion on ${route}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ ...PHONE });
    });

    test(`TS-WEB-0002-A9: nothing but opacity is animated on ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const onLoad = await animatedProperties(page);
      await scrollThrough(page);
      const afterScroll = await animatedProperties(page);

      const offending = [...new Set([...onLoad, ...afterScroll])].filter(
        (property) => !ALLOWED.has(property),
      );
      expect(
        offending,
        `${route} animates more than opacity under prefers-reduced-motion: ${offending.join(", ")}`,
      ).toEqual([]);
    });

    test(`TS-WEB-0002-A9: no transition on ${route} is long enough to be a movement`, async ({
      page,
    }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      // The controls that carry a transition when motion is allowed: every
      // link, button and reveal wrapper the page composes.
      const durations = await page.$$eval(
        'a, button, summary, [class*="motion-reveal"]',
        (elements, devChrome) =>
          elements
            .filter((element) => element.closest(devChrome) === null)
            .map((element) => {
              const style = getComputedStyle(element);
              const longest = (value: string) =>
                Math.max(
                  0,
                  ...value.split(",").map((part) => {
                    const raw = part.trim();
                    const seconds = raw.endsWith("ms")
                      ? Number.parseFloat(raw) / 1000
                      : Number.parseFloat(raw);
                    return Number.isFinite(seconds) ? seconds : 0;
                  }),
                );
              return {
                tag: element.tagName,
                transition: longest(style.transitionDuration),
                animation: longest(style.animationDuration),
              };
            }),
        DEV_CHROME,
      );

      expect(durations.length).toBeGreaterThan(0);
      const moving = durations.filter((entry) => entry.transition > 0.001 || entry.animation > 0.001);
      expect(
        moving,
        `${route} keeps a durable transition or animation under prefers-reduced-motion`,
      ).toEqual([]);
    });

    test(`TS-WEB-0002-A9: no section on ${route} is left transparent instead of still`, async ({
      page,
    }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      await scrollThrough(page);

      const transparent = await page.$$eval('[class*="motion-reveal"]', (elements) =>
        elements
          .filter((element) => Number(getComputedStyle(element).opacity) < 1)
          .map((element) => element.firstElementChild?.id || element.id || element.tagName),
      );
      expect(
        transparent,
        `${route} leaves a reveal wrapper transparent under prefers-reduced-motion`,
      ).toEqual([]);
    });

    test(`TS-WEB-0002-A9: scrolling on ${route} is not smoothed`, async ({ page }) => {
      await page.goto(route);
      const behaviour = await page.evaluate(() => [
        getComputedStyle(document.documentElement).scrollBehavior,
        getComputedStyle(document.body).scrollBehavior,
      ]);
      expect(behaviour).toEqual(["auto", "auto"]);
    });
  });
}

test("TS-WEB-0002-A9: under reduced motion the explain module stands at state 1, and its steps still work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ ...PHONE });
  await page.goto("/mitmachen");
  await page.waitForLoadState("networkidle");

  const explainModule = page.locator("[data-explain-module]").first();
  await expect(explainModule).toHaveAttribute("data-state", "1");
  await expect(explainModule).toHaveAttribute("data-advance", "static");

  // Three quarters of the module inside the viewport is the trigger the
  // auto-advance waits for (DEC-0105 §6). With the query on, it is not a
  // trigger: the module is still at state 1 after longer than a whole pass.
  await explainModule.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    window.scrollTo({ top: top - (window.innerHeight - 0.75 * rect.height), behavior: "instant" });
  });
  await page.waitForTimeout(FULL_PASS_MS);
  await expect(explainModule).toHaveAttribute("data-state", "1");
  await expect(explainModule).toHaveAttribute("data-advance", "static");

  // The content is reachable — the reader loses the movement, not the steps.
  const steps = explainModule.locator("[data-explain-step]");
  await expect(steps).toHaveCount(3);
  await steps.nth(2).click();
  await expect(explainModule).toHaveAttribute("data-state", "3");
  await expect(steps.nth(2)).toHaveAttribute("aria-current", "step");
});
