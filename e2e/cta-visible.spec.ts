import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * Every CTA is a visible control — the owner's review of 2026-10-12, issue #28
 * ("weiß auf weiß … das darf nicht durchrutschen").
 *
 * `e2e/cta-contrast.spec.ts` asks whether a CTA's **label** is legible on the
 * CTA's **own fill**: its ground walk starts at the button itself and stops at
 * the first opaque layer, which is the button's own background. A `secondary`
 * button (`paper` fill, `ink` label) on a `paper` section passes that test at
 * 16:1 and is invisible, because the question it never asks is whether the
 * **fill stands out from what is around it**. Two buttons shipped that way
 * ("Jetzt kostenlos anmelden" on `/`, "Flyer per WhatsApp schicken" on
 * `/mitmachen`), and the guide's "a button's fill is never its ground" had no
 * instrument.
 *
 * This file measures it. For every `[data-cta]` with an opaque fill: the fill
 * against the composited ground **behind** it (the parent's ground, same
 * compositing as the sibling spec), at least 3:1 (WCAG 1.4.11, non-text
 * contrast), unless the control has its own border or outline. A transparent
 * fill is a text link and is not this file's business.
 *
 * Six controls fail today (`KNOWN`, with their issues). They are named, so CI
 * stays green while they are open, and **any other control that disappears
 * fails the route** — a new button cannot slip in the way these did.
 *
 * Photo grounds are skipped: a photograph has no single colour, and the scrim
 * plus the text shadow carry legibility there (`pnpm check:contrast`, hero row).
 */

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  name: `${route} (${locale})`,
}));

/**
 * Open defects, by the label of the control and the issue that owns it. A control
 * listed here is not failed on; every other control is. When one is fixed, delete
 * its entry — and a control that is *not* listed and disappears into its ground
 * fails the route, which is the point.
 *
 * - #28: `secondary` (`paper` fill) on a `paper` ground, and on `lime-100`.
 * - #41: the contact section's two actions on `lime-100`.
 */
const KNOWN: ReadonlyArray<{ readonly label: RegExp; readonly issue: string }> = [
  { label: /Jetzt kostenlos anmelden|Sign up for free now/, issue: "#28" },
  { label: /Flyer per WhatsApp schicken|Send a flyer by WhatsApp/, issue: "#28" },
  { label: /Jetzt Kalender anmelden|Register your calendar/, issue: "#28" },
  { label: /Jetzt meine Webseite anmelden|Register my website/, issue: "#28" },
  { label: /Kalender bestellen|Order the calendar/, issue: "#28" },
  { label: /Per WhatsApp schreiben|Write on WhatsApp/, issue: "#41" },
];

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
] as const;

const FLOOR = 3;

interface Finding {
  readonly label: string;
  readonly cta: string;
  readonly fill: string;
  readonly ground: string;
  readonly ratio: number;
}

const MEASURE = (floor: number): Finding[] => {
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

  /** The composited ground of `start` and everything above it, as the sibling spec reads it. */
  const groundFrom = (start: Element | null) => {
    const layers: { rgb: number[]; alpha: number }[] = [];
    let photo = false;
    let node: Element | null = start;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      const image = style.backgroundImage;
      if (image && image.includes("url(")) photo = true;
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
    return { rgb: ground.map(Math.round), photo };
  };

  const hasEdge = (style: CSSStyleDeclaration) =>
    (parseFloat(style.borderTopWidth) > 0 && style.borderTopStyle !== "none") ||
    (parseFloat(style.outlineWidth) > 0 && style.outlineStyle !== "none") ||
    (style.boxShadow !== "none" && style.boxShadow !== "");

  return [...document.querySelectorAll("[data-cta]")]
    .filter((element) => (element.textContent ?? "").trim().length > 0)
    .flatMap((element) => {
      const style = getComputedStyle(element);
      const own = parse(style.backgroundColor);
      if (!own || own.alpha < 0.999) return []; // a text link, not a filled control
      if (hasEdge(style)) return [];
      const { rgb: ground, photo } = groundFrom(element.parentElement);
      // A photograph under the control has no single colour; the scrim and the
      // text shadow carry it (`check:contrast`'s hero row), not this file.
      if (photo) return [];
      const ratio = Math.round(contrast(own.rgb, ground) * 100) / 100;
      return ratio >= floor
        ? []
        : [
            {
              label: (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 60),
              cta: element.getAttribute("data-cta") ?? "",
              fill: style.backgroundColor,
              ground: ground.join(", "),
              ratio,
            },
          ];
    });
};

for (const route of ROUTES) {
  for (const viewport of VIEWPORTS) {
    test(`TS-WEB-0017-A29: a CTA's fill stands out from its ground on ${route.name} at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(route.path);
      await expect(page.locator("#main")).toBeAttached();
      // As in the sibling spec: under `next dev` a route's CSS can arrive after its
      // HTML, and an unstyled button is a false failure. Wait for a filled CTA.
      await page.waitForFunction(() => {
        const ctas = [...document.querySelectorAll("[data-cta]")];
        if (ctas.length === 0) return true;
        return ctas.some((cta) => {
          const alpha = getComputedStyle(cta).backgroundColor.match(/[\d.]+/g)?.[3];
          return alpha === undefined || Number(alpha) > 0;
        });
      });

      const findings = (await page.evaluate(MEASURE, FLOOR)).filter(
        (finding) => !KNOWN.some((known) => known.label.test(finding.label)),
      );
      expect(
        findings,
        `controls that disappear into their ground on ${route.path}: ` +
          findings.map((f) => `"${f.label}" [${f.cta}] fill ${f.fill} on ${f.ground} = ${f.ratio}:1`).join("; "),
      ).toEqual([]);
    });
  }
}
