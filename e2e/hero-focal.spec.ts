import { expect, test } from "@playwright/test";

import { HERO_ANCHOR } from "../scripts/lib/focal-crop.mjs";

/**
 * TS-WEB-0006-A22 (D13, DEC-0223, issue 255): **a hero's motif lands on the
 * system-wide anchor, outside the text stack.**
 *
 * DEC-0105 §2 positioned a hero on its own focal point, so the motif sat in
 * the box where it sits in the photograph: `/dein-kalender` (45 / 55) stood
 * behind the headline. The generator now cuts each rendition so the focal
 * point lands on the anchor of that rendition (`HERO_ANCHOR`), and
 * `photo-surface` positions the hero on the same anchor. This file measures
 * what a browser makes of it, per page and width:
 *
 * 1. the hero's computed `background-position` is the anchor of the rendition
 *    that applies (phone below 48rem, wide from it), and that rendition's file
 *    has the matching ratio (8:9 / 21:9) — at ~700 px it is the phone one;
 * 2. the focal point's pixel position, worked out from the real box, the real
 *    file size and the real computed position, lies outside every rect of the
 *    text stack (the line boxes of headline and lead, the CTA and the search).
 *
 * The focal point sits at the anchor inside the cut file by construction
 * (`scripts/generate-images.mjs`, unit-tested in `hero-anchor.test.ts`).
 */

const WIDTHS = [360, 390, 700, 1024, 1280, 1470, 1920] as const;
const HEIGHT_FOR: Record<number, number> = { 1470: 956, 1920: 1080 };
const WIDE_FROM = 768; // 48rem

/** Every route that carries a hero photograph; `en` is the English path. */
const HEROES = [
  { de: "/", en: "/en" },
  { de: "/dein-ort", en: "/en/your-place" },
  { de: "/dein-ort/starten", en: "/en/your-place/start" },
  { de: "/mitmachen", en: "/en/take-part" },
  { de: "/dein-kalender", en: "/en/your-calendar" },
  { de: "/ueber-uns", en: "/en/about" },
  { de: "/deine-region", en: "/en/your-region" },
] as const;

/** The English page is measured at two widths only: its heroes are the same files. */
const EN_WIDTHS = [390, 1470] as const;

interface Measurement {
  readonly position: string;
  readonly natural: { readonly width: number; readonly height: number };
  readonly box: { readonly left: number; readonly top: number; readonly width: number; readonly height: number };
  readonly textRects: ReadonlyArray<{ left: number; top: number; right: number; bottom: number }>;
}

const measureHero = () => {
  const hero = document.querySelector<HTMLElement>('[data-hero="true"]');
  if (!hero) return null;
  const style = getComputedStyle(hero);
  const layers = style.backgroundImage.match(/url\("[^"]+"\)/g) ?? [];
  const url = layers.at(0)?.slice(5, -2) ?? "";
  const position = style.backgroundPosition.split(",").map((layer) => layer.trim());
  const rect = hero.getBoundingClientRect();
  const content = hero.querySelector<HTMLElement>(':scope > [class*="content"]') ?? hero;
  const rects: Array<{ left: number; top: number; right: number; bottom: number }> = [];
  const push = (r: DOMRect) => {
    if (r.width > 0 && r.height > 0) {
      rects.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
    }
  };
  for (const node of content.querySelectorAll<HTMLElement>("h1, h2, p, li, label, a, button, input, select")) {
    if (node instanceof HTMLInputElement || node instanceof HTMLButtonElement || node instanceof HTMLAnchorElement || node instanceof HTMLSelectElement) {
      push(node.getBoundingClientRect());
    } else {
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of Array.from(range.getClientRects())) push(r);
    }
  }
  return { url, position, rect, rects };
};

for (const hero of HEROES) {
  for (const locale of ["de", "en"] as const) {
    const widths = locale === "de" ? WIDTHS : EN_WIDTHS;
    test(`TS-WEB-0006-A22: the hero on ${hero[locale]} puts its focal point on the anchor, outside the text stack`, async ({
      page,
    }) => {
      for (const width of widths) {
        await page.setViewportSize({ width, height: HEIGHT_FOR[width] ?? 900 });
        await page.goto(hero[locale]);
        const surface = page.locator('[data-hero="true"]').first();
        await expect(surface).toBeAttached();
        await page.waitForLoadState("load");

        const raw = await page.evaluate(measureHero);
        expect(raw, `${hero[locale]} @${width}: a hero surface`).not.toBeNull();
        const { url, position, rect, rects } = raw!;
        const natural = await page.evaluate(
          (src) =>
            new Promise<{ width: number; height: number }>((resolve, reject) => {
              const image = new Image();
              image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
              image.onerror = () => reject(new Error(`cannot load ${src}`));
              image.src = src;
            }),
          url,
        );
        const m: Measurement = {
          position: position[0],
          natural,
          box: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
          textRects: rects,
        };
        const wide = width >= WIDE_FROM;
        const anchor = wide ? HERO_ANCHOR.wide : HERO_ANCHOR.phone;
        const label = `${hero[locale]} @${width} (${wide ? "wide" : "phone"})`;

        // One value per layer, all on the anchor.
        for (const layer of position) {
          expect(layer, `${label}: positioned on the anchor`).toBe(`${anchor.x}% ${anchor.y}%`);
        }
        // The rendition that applies has that rendition's ratio.
        expect(
          m.natural.width / m.natural.height,
          `${label}: file ratio (8:9 below 48rem, 21:9 from it) — ${url}`,
        ).toBeCloseTo(wide ? 21 / 9 : 8 / 9, 1);

        // Where the focal point is on the screen: `cover`, then the computed position.
        const scale = Math.max(m.box.width / m.natural.width, m.box.height / m.natural.height);
        const drawn = { width: m.natural.width * scale, height: m.natural.height * scale };
        const [px, py] = m.position.split(" ").map((v) => parseFloat(v) / 100);
        const focal = {
          x: m.box.left + (m.box.width - drawn.width) * px + drawn.width * (anchor.x / 100),
          y: m.box.top + (m.box.height - drawn.height) * py + drawn.height * (anchor.y / 100),
        };

        const hit = m.textRects.find(
          (r) => focal.x >= r.left && focal.x <= r.right && focal.y >= r.top && focal.y <= r.bottom,
        );
        expect(
          hit,
          `${label}: focal point (${Math.round(focal.x)}, ${Math.round(focal.y)}) lies inside the text stack at ${JSON.stringify(hit)}`,
        ).toBeUndefined();
        test.info().annotations.push({
          type: `${hero[locale]} @${width}`,
          description: `box ${Math.round(m.box.width)}x${Math.round(m.box.height)} (${(m.box.width / m.box.height).toFixed(2)}:1), ${wide ? "wide" : "phone"} file ${m.natural.width}x${m.natural.height}, focal at ${Math.round(focal.x)},${Math.round(focal.y - m.box.top)} in the box`,
        });
      }
    });
  }
}
