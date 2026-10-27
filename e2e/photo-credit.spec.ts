import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";
import yaml from "js-yaml";

import { dictionary } from "../src/lib/i18n/dictionary";
import { pageFile } from "../src/lib/content/loader";
import { everyRoute, href } from "../src/lib/routes/routes";

import type { Locale } from "../src/lib/i18n/locales";

/**
 * TS-WEB-0007-A18 — a photograph's credit is a © control, never running text
 * (SRC-0014 §Photo surface, DEC-0168, issues #78 and 101).
 *
 * On every route in both languages:
 *
 *  1. **no credit is visible as text.** No visible element on the page reads
 *     "Foto: …" / "Photo: …" — the credit panels are closed until someone
 *     opens them, so a credit printed on or under a photograph fails here;
 *  2. **every credited image carries the control.** A page whose inventory
 *     holds a placed image with a `credit` shows at least that many
 *     `[data-photo-credit]` controls, each a button named "Bildnachweis" /
 *     "Photo credit" — so a credited image wired without it fails rather
 *     than shipping its credit as a caption, or without one.
 */

const ROUTES = everyRoute().map(({ route, locale }) => ({ path: href(route, locale), locale, route }));

interface InventoryImage {
  readonly credit?: string;
  readonly file?: string;
}

function creditedImages(route: (typeof ROUTES)[number]["route"], locale: Locale): InventoryImage[] {
  const file = join(process.cwd(), pageFile(route, locale));
  if (!existsSync(file)) return [];
  const match = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/);
  if (!match) return [];
  const frontmatter = yaml.load(match[1]!) as { images?: InventoryImage[] };
  return (frontmatter.images ?? []).filter((image) => image.credit && image.file);
}

test.describe("TS-WEB-0007-A18: a photo credit is a © control, never visible running text", () => {
  for (const { path, locale, route } of ROUTES) {
    test(`TS-WEB-0007-A18: ${path} — no visible "Foto:" text, a control on every credited image`, async ({ page }) => {
      const words = dictionary(locale).photoCredit;
      const expected = creditedImages(route, locale);

      await page.goto(path);
      await page.waitForLoadState("load");

      const found = await page.evaluate((lead) => {
        const pattern = new RegExp(`^\\s*${lead}\\s*:`, "u");
        const visibleCredits = [...document.querySelectorAll("body *")]
          .filter((element) => [...element.childNodes].some((node) => node.nodeType === 3 && pattern.test(node.textContent ?? "")))
          .filter((element) => (element as HTMLElement).checkVisibility())
          .map((element) => element.textContent?.trim() ?? "");
        const controls = [...document.querySelectorAll("[data-photo-credit]")].map((control) => ({
          name: control.querySelector("button")?.getAttribute("aria-label") ?? null,
          expanded: control.querySelector("button")?.getAttribute("aria-expanded") ?? null,
        }));
        return { visibleCredits, controls };
      }, words.lead);

      expect(found.visibleCredits, `${path}: credit printed as text`).toEqual([]);
      expect(found.controls.length, `${path}: credited images in the inventory`).toBeGreaterThanOrEqual(expected.length);
      for (const control of found.controls) expect(control).toEqual({ name: words.label, expanded: "false" });
    });
  }

  test("TS-WEB-0007-A18: /ueber-uns — the quote band's photographer is credited behind the ©", async ({ page }) => {
    await page.goto("/ueber-uns");
    const band = page.locator("#zitat");
    await expect(page.locator('[data-hydrated="true"]').first()).toBeAttached();
    const control = band.getByRole("button", { name: "Bildnachweis" });
    await expect(control).toBeVisible();
    await expect(band).not.toContainText("Foto: openTransfer.de", { useInnerText: true });
    await control.click();
    await expect(band.locator('[data-photo-note="credit"]')).toHaveText("Foto: openTransfer.de");
  });
});
