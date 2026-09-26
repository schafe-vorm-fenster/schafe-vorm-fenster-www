import { readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";
import yaml from "js-yaml";

/**
 * DEC-0105 §2 in the browser: **the crop follows the motif's declared focal
 * point.**
 *
 * `e2e/photo-surface.spec.ts` asserts the negative — that the hero is not at
 * `50% 50%`, i.e. not a bare `center`. This file asserts the positive one,
 * and it is a browser fact rather than a stylesheet fact: the value travels
 * from the page artifact's `images:` entry (`focal: {x, y}`) through
 * `pageImage` and `hero-block` into the `--photo-focal` custom property, and
 * only the cascade says whether it arrives. A typo anywhere on that path
 * leaves the surface on its fallback and nothing else notices.
 *
 * The expectation is read out of the inventory rather than written down here,
 * because the focal point is content: the owner may move it, and a test that
 * pins a number would then fail for the wrong reason. What is pinned is the
 * rule the design system does fix — a sky-heavy village motif sits at or
 * above 40 % so the sky crops away and the motif lands above the scrim's
 * opaque band (`concept/website-design-system.md` § Crop and focal point).
 */

const PHONE = { width: 390, height: 844 };

const HEROES = [
  { path: "/", directory: "home", id: "home-hero" },
  { path: "/mitmachen", directory: "mitmachen", id: "mitmachen-hero" },
  { path: "/dein-kalender", directory: "dein-kalender", id: "dein-kalender-hero" },
  { path: "/ueber-uns", directory: "ueber-uns", id: "ueber-uns-hero" },
] as const;

interface InventoryEntry {
  readonly id: string;
  readonly focal?: { readonly x: number; readonly y: number };
}

/** The `focal` pair the page artifact declares for one image. */
function declaredFocal(directory: string, id: string): { x: number; y: number } {
  const file = join(process.cwd(), "content/pages", directory, "de.md");
  const frontmatter = readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) throw new Error(`${file}: no frontmatter`);
  const images = (yaml.load(frontmatter[1]) as { images?: InventoryEntry[] } | null)?.images ?? [];
  const focal = images.find((entry) => entry.id === id)?.focal;
  if (!focal) throw new Error(`${file}: no focal point declared for ${id}`);
  return focal;
}

for (const hero of HEROES) {
  test(`DEC-0105 §2: the hero on ${hero.path} is positioned at its declared focal point`, async ({
    page,
  }) => {
    const focal = declaredFocal(hero.directory, hero.id);
    expect(focal.x, "a percentage of the frame").toBeGreaterThanOrEqual(0);
    expect(focal.x).toBeLessThanOrEqual(100);
    expect(
      focal.y,
      "a sky-heavy village motif sits at or above 40 % (SRC-0014 § Crop and focal point)",
    ).toBeGreaterThanOrEqual(40);

    await page.setViewportSize(PHONE);
    await page.goto(hero.path);

    const surface = page.locator('[data-hero="true"]').first();
    await expect(surface).toBeAttached();
    const position = await surface.evaluate((node) => getComputedStyle(node).backgroundPosition);

    // One value per background layer — the two scrim gradients and the
    // photograph — and the declaration positions all three together.
    const layers = position.split(",").map((layer) => layer.trim());
    expect(layers.length, "the photograph plus the two scrim gradients").toBe(3);
    for (const layer of layers) {
      expect(layer, "the inventory's pair, not the surface's fallback").toBe(
        `${focal.x}% ${focal.y}%`,
      );
    }
  });
}
