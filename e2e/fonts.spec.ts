import { expect, test } from "@playwright/test";

import { href } from "../src/lib/routes/routes";

/**
 * TS-WEB-0003 D3 "preloaded" — issue 214 (`app/styles/font-preload.tsx`).
 *
 * A font preload only helps when the `@font-face` rule picks it up. If the two
 * URLs ever drift apart (another emitted name, a missing `crossorigin`), the
 * browser downloads the face twice and the preload is pure cost. So, on the
 * pages the preload set was measured on:
 *
 * 1. every preloaded file is a `src` of one of the `@font-face` rules,
 * 2. it is requested exactly once, and
 * 3. the face it carries is in use once the page has settled.
 */

const PAGES = [href("home", "de"), href("place", "de"), href("calendar", "de"), href("takePart", "de"), href("about", "en")];

for (const path of PAGES) {
  test(`${path}: every font preload is the @font-face file, fetched once and used`, async ({ page }) => {
    const fontRequests = new Map<string, number>();
    page.on("request", (request) => {
      if (request.resourceType() === "font" || request.url().endsWith(".woff2")) {
        const url = new URL(request.url()).pathname;
        fontRequests.set(url, (fontRequests.get(url) ?? 0) + 1);
      }
    });
    await page.goto(path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const preloads = await page.$$eval('link[rel="preload"][as="font"]', (links) =>
      links.map((link) => ({
        href: new URL((link as HTMLLinkElement).href).pathname,
        crossOrigin: link.getAttribute("crossorigin"),
        type: link.getAttribute("type"),
      })),
    );
    expect(preloads.length, "font preloads in the head").toBeGreaterThan(0);

    const faceSources = await page.evaluate(() => {
      const sources: { src: string; family: string; weight: string }[] = [];
      for (const sheet of [...document.styleSheets]) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of [...rules]) {
          if (!(rule instanceof CSSFontFaceRule)) continue;
          const match = /url\("?([^")]+)"?\)/.exec(rule.style.getPropertyValue("src"));
          if (match) {
            sources.push({
              src: new URL(match[1]!, sheet.href ?? location.href).pathname,
              family: rule.style.getPropertyValue("font-family").replaceAll('"', ""),
              weight: rule.style.getPropertyValue("font-weight"),
            });
          }
        }
      }
      return sources;
    });

    const loaded = await page.evaluate(() =>
      [...document.fonts].filter((face) => face.status === "loaded").map((face) => `${face.family.replaceAll('"', "")} ${face.weight}`),
    );

    for (const preload of preloads) {
      expect(preload.crossOrigin, `${preload.href} crossorigin`).not.toBeNull();
      expect(preload.type, `${preload.href} type`).toBe("font/woff2");
      const face = faceSources.find((source) => source.src === preload.href);
      expect(face, `${preload.href} is an @font-face src`).toBeDefined();
      expect(fontRequests.get(preload.href), `${preload.href} requests`).toBe(1);
      expect(loaded, `${preload.href} in use`).toContain(`${face!.family} ${face!.weight}`);
    }
  });
}
