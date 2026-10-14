import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";
import yaml from "js-yaml";
import sharp from "sharp";

import { dictionary } from "../src/lib/i18n/dictionary";
import { pageFile } from "../src/lib/content/loader";
import { everyRoute, href } from "../src/lib/routes/routes";

import type { Locale } from "../src/lib/i18n/locales";

/**
 * TS-WEB-0007-A17 — every photograph edited with an AI tool carries a visible,
 * labelled mark, and no other image does (DEC-0165, SRC-0014 §Photo surface).
 *
 * Read off the rendered pages, at both ends of the pipeline:
 *
 *  1. **present and labelled where it belongs, absent everywhere else.** On
 *     every route in both languages, each `[data-provenance="ai-edited"]`
 *     carries exactly one `[data-ai-edited-mark]`, named by the dictionary's
 *     `aiEditedMark`, and no mark exists outside one. A page whose inventory
 *     holds a placed `ai-edited` image shows at least that many marks — so a
 *     future AI-edited image wired without the flag fails here, not silently;
 *  2. **the alt text carries the note** — in the inventory (the hero is a CSS
 *     background and renders no `alt` of its own) and on any `<img>` inside a
 *     marked frame;
 *  3. **the mark collides with nothing and clears 3 : 1.** At 390 and 1280 px
 *     its box intersects neither the header nor any text or control on the
 *     surface, and the `paper` glyph over the `scrim-45` well clears the 3 : 1
 *     non-text floor against **every pixel** of the photograph under it —
 *     measured with the mark hidden, then composited at the well's computed
 *     alpha (`scrim-45`) with the glyph's computed `paper`.
 */

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  locale,
  route,
}));

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
] as const;

const channel = (value: number) => {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: readonly number[]) =>
  0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!);
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

interface InventoryImage {
  readonly provenance?: string;
  readonly alt?: string;
  readonly file?: string;
}

/** The placed `ai-edited` images of a route's inventory, read from its content file. */
function aiEditedImages(route: (typeof ROUTES)[number]["route"], locale: Locale): InventoryImage[] {
  const file = join(process.cwd(), pageFile(route, locale));
  if (!existsSync(file)) return [];
  const raw = readFileSync(file, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return [];
  const frontmatter = yaml.load(match[1]!) as { images?: InventoryImage[] };
  return (frontmatter.images ?? []).filter((image) => image.provenance === "ai-edited" && image.file);
}

test.describe("TS-WEB-0007-A17: an AI-edited photograph carries the sparkles mark, and only it does", () => {
  for (const { path, locale, route } of ROUTES) {
    test(`TS-WEB-0007-A17: ${path} — mark present and labelled on every ai-edited image, absent on all others`, async ({
      page,
    }) => {
      const label = dictionary(locale).aiEditedMark;
      const expected = aiEditedImages(route, locale);

      for (const image of expected) {
        expect(image.alt?.trimEnd().endsWith(`${label}.`), `${path}: inventory alt "${image.alt}"`).toBe(true);
      }

      await page.goto(path);
      await page.waitForLoadState("load");

      const found = await page.evaluate(() => {
        const marks = [...document.querySelectorAll("[data-ai-edited-mark]")];
        const frames = [...document.querySelectorAll('[data-provenance="ai-edited"]')];
        return {
          marks: marks.map((mark) => ({
            role: mark.getAttribute("role"),
            name: mark.getAttribute("aria-label"),
            title: mark.getAttribute("title"),
            focusable: (mark as HTMLElement).tabIndex >= 0,
            insideFrame: Boolean(mark.parentElement?.closest('[data-provenance="ai-edited"]')),
            visible: (mark as HTMLElement).checkVisibility(),
          })),
          frames: frames.map((frame) => ({
            marks: frame.querySelectorAll("[data-ai-edited-mark]").length,
            alts: [...frame.querySelectorAll("img")].map((img) => img.getAttribute("alt") ?? ""),
          })),
        };
      });

      expect(found.marks.length, `${path}: marks vs. frames`).toBe(found.frames.length);
      expect(found.frames.length, `${path}: placed ai-edited images in the inventory`).toBeGreaterThanOrEqual(
        expected.length,
      );
      for (const frame of found.frames) {
        expect(frame.marks).toBe(1);
        for (const alt of frame.alts) expect(alt.trimEnd().endsWith(`${label}.`), `${path}: alt "${alt}"`).toBe(true);
      }
      for (const mark of found.marks) {
        expect(mark).toEqual({ role: "img", name: label, title: label, focusable: false, insideFrame: true, visible: true });
      }
    });
  }
});

test.describe("TS-WEB-0007-A17: the mark's corner and contrast, measured", () => {
  const pages = ROUTES.filter(({ route, locale }) => aiEditedImages(route, locale).length > 0);

  test("TS-WEB-0007-A17: at least one route renders an ai-edited image to measure", () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  for (const { path } of pages) {
    for (const viewport of VIEWPORTS) {
      test(`TS-WEB-0007-A17: ${path} at ${viewport.width} — no collision, glyph ≥ 3:1 against the photograph under it`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        await page.waitForLoadState("load");
        const mark = page.locator("[data-ai-edited-mark]").first();
        await expect(mark).toBeVisible();

        const geometry = await mark.evaluate((node) => {
          const box = node.getBoundingClientRect();
          const surface = node.closest('[data-provenance="ai-edited"]')!;
          const header = document.querySelector('[role="banner"], header')!.getBoundingClientRect();
          const hits = (other: DOMRect) =>
            box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top;
          const texts = [...surface.querySelectorAll("h1, h2, h3, p, a, button, input, li")]
            .map((element) => element.getBoundingClientRect())
            .filter((rect) => rect.width > 0 && rect.height > 0);
          return {
            width: box.width,
            height: box.height,
            headerHit: hits(header),
            textHits: texts.filter(hits).length,
          };
        });
        expect(geometry.width).toBe(40);
        expect(geometry.height).toBe(40);
        expect(geometry.headerHit).toBe(false);
        expect(geometry.textHits).toBe(0);

        // The glyph colour and the well's alpha as the cascade resolves the tokens.
        const tokens = await mark.evaluate((node) => {
          const style = getComputedStyle(node);
          const numbers = (value: string) => (value.match(/[\d.]+/g) ?? []).map(Number);
          return { glyph: numbers(style.color).slice(0, 3), well: numbers(style.backgroundColor) };
        });
        const wellAlpha = tokens.well[3] ?? 1;
        expect(tokens.well.slice(0, 3)).toEqual([0, 0, 0]);
        expect(wellAlpha).toBeGreaterThan(0);
        expect(wellAlpha).toBeLessThan(1);

        // The photograph (with the surface's own scrim) under the mark, mark hidden.
        const clip = (await mark.boundingBox())!;
        await mark.evaluate((node) => ((node as HTMLElement).style.visibility = "hidden"));
        const shot = await page.screenshot({ clip });
        await mark.evaluate((node) => ((node as HTMLElement).style.visibility = ""));

        const { data, info } = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
        const paper = luminance(tokens.glyph);
        let worst = Infinity;
        for (let offset = 0; offset < data.length; offset += info.channels) {
          const under = [data[offset]!, data[offset + 1]!, data[offset + 2]!].map(
            (value) => value * (1 - wellAlpha),
          );
          worst = Math.min(worst, ratio(paper, luminance(under)));
        }
        console.log(`contrast ${path} @${viewport.width}: ${worst.toFixed(2)}:1`);
        test.info().annotations.push({ type: "contrast", description: `${path} @${viewport.width}: ${worst.toFixed(2)}:1` });
        expect(worst).toBeGreaterThanOrEqual(3);
      });
    }
  }
});
