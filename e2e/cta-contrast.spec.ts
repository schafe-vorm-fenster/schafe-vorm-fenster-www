import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * Every CTA's label is legible on the ground it stands on — polish brief
 * G-6, and the one finding that made the site's primary conversion
 * disappear.
 *
 * `#closing-cta`'s button computed the ink token as its label colour on the
 * ink token as its fill — the same value twice, a ratio of 1 — on
 * `/mitmachen`, `/dein-kalender`, `/dein-ort/starten` and `/deine-region` in
 * the deployed preview, while the same four pages looked correct under `next
 * dev`, because the production bundle orders the CSS modules differently.
 * Nothing in the suite could see it:
 *
 *   - the component tests render markup, not a cascade;
 *   - `pnpm check:contrast` measures the **token set**, and every pair in it
 *     was and is fine — the defect was which rule won, not which colours
 *     exist;
 *   - `e2e/a11y.spec.ts` runs axe, whose `color-contrast` rule skips an
 *     element whose background it cannot resolve, which is every control on
 *     a photo surface and, in the failing case, a control it judged to have
 *     no distinguishable text at all.
 *
 * So this file measures what a visitor sees: the computed `color` of every
 * `[data-cta]` against the composited ground behind it, on all 24 (route ×
 * language) pairs, at the phone width the brief reviewed. It fails on the
 * cascade regression itself rather than on the colour choice — a variant
 * that stops winning over `route-link`'s `.bare`, or over a ground rule, or
 * over whatever loads after it in a future bundle, lands here.
 *
 * The floor is 4.5:1 (WCAG 1.4.3, TS-WEB-0002 D1). CTA labels are 18 px at weight
 * 800, which is below the 18.66 px large-text threshold, so none of them may
 * take the 3:1 relaxation.
 */

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  name: `${route} (${locale})`,
}));

/** The phone the brief reviewed — DEC-0067's reference width is narrower still. */
const PHONE = { width: 390, height: 844 };

const FLOOR = 4.5;

interface Measurement {
  readonly label: string;
  readonly cta: string;
  readonly color: string;
  readonly ground: string;
  readonly ratio: number;
}

/**
 * Runs in the page: the composited ground of an element, and the contrast of
 * its text against it.
 *
 * The ground is resolved by walking ancestors and compositing every
 * background layer found on the way, because a CTA may sit on a translucent
 * scrim over a photograph. Where a layer is a gradient, its **last** opaque
 * colour stop is taken — on this site that is the scrim's own 0.96 floor at
 * the bottom of a photo surface, which is the ground a hero CTA actually
 * stands on and the conservative reading everywhere else.
 */
const MEASURE = (floor: number): Measurement[] => {
  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = ([r, g, b]: number[]) =>
    0.2126 * channel(r / 255) + 0.7152 * channel(g / 255) + 0.0722 * channel(b / 255);
  const contrast = (a: number[], b: number[]) => {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (high + 0.05) / (low + 0.05);
  };
  const parse = (value: string) => {
    const parts = String(value).match(/-?[\d.]+/g);
    if (!parts) return null;
    const [r, g, b, a = "1"] = parts;
    return { rgb: [+r, +g, +b], alpha: +a };
  };
  const over = (layer: { rgb: number[]; alpha: number }, ground: number[]) =>
    layer.rgb.map((c, i) => c * layer.alpha + ground[i] * (1 - layer.alpha));

  const groundOf = (element: Element) => {
    const layers: { rgb: number[]; alpha: number }[] = [];
    let node: Element | null = element;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      const image = style.backgroundImage;
      if (image && image !== "none") {
        const stops = [...image.matchAll(/rgba?\([^)]*\)/g)]
          .map((match) => parse(match[0]))
          .filter((stop): stop is { rgb: number[]; alpha: number } => Boolean(stop) && stop!.alpha > 0.5);
        if (stops.length > 0) layers.push(stops[stops.length - 1]);
      }
      const fill = parse(style.backgroundColor);
      if (fill && fill.alpha > 0) {
        layers.push(fill);
        if (fill.alpha >= 0.999) break;
      }
      node = node.parentElement;
    }
    let ground = [255, 255, 255];
    for (const layer of layers.reverse()) ground = over(layer, ground);
    return ground.map(Math.round);
  };

  return [...document.querySelectorAll("[data-cta]")]
    .filter((element) => (element.textContent ?? "").trim().length > 0)
    .map((element) => {
      const style = getComputedStyle(element);
      const text = parse(style.color)!;
      const ground = groundOf(element);
      return {
        label: (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 60),
        cta: element.getAttribute("data-cta") ?? "",
        color: style.color,
        ground: ground.join(", "),
        ratio: Math.round(contrast(over(text, ground), ground) * 100) / 100,
      };
    })
    .filter((measurement) => measurement.ratio < floor || floor === 0);
};

for (const route of ROUTES) {
  test(`G-6: every CTA label on ${route.name} clears ${FLOOR}:1`, async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto(route.path);
    // The number of CTAs is not this file's business: ten of the 24 pairs
    // legitimately carry none (the two mid-flow steps, which suppress the
    // closing block entirely per F-2-10, and the three `primaryConversion:
    // null` pages, whose closing block is the merged three-job offer). Their
    // own specs own that count; this one owns the colour, so it waits for the
    // page and measures whatever CTAs the page renders.
    await expect(page.locator("#main")).toBeAttached();
    // Under `next dev` a route's CSS arrives after its HTML on the first
    // compile, and an unstyled button is paper on paper — a false failure
    // that says nothing about the cascade. Wait until a filled CTA has its
    // fill, or until the page has settled with no CTA at all.
    await page.waitForFunction(() => {
      const ctas = [...document.querySelectorAll("[data-cta]")];
      if (ctas.length === 0) return true;
      return ctas.some((cta) => {
        // Fully transparent, however the engine spells it.
        const alpha = getComputedStyle(cta).backgroundColor.match(/[\d.]+/g)?.[3];
        return alpha === undefined || Number(alpha) > 0;
      });
    });

    const failures = await page.evaluate(MEASURE, FLOOR);

    expect(
      failures,
      `CTA labels below ${FLOOR}:1 on ${route.path}: ` +
        failures.map((f) => `"${f.label}" ${f.ratio}:1 (${f.color} on ${f.ground})`).join("; "),
    ).toEqual([]);
  });
}
