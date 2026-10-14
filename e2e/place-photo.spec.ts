import { readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";

/**
 * DEC-0167 (issue #18) — the stage shows the chosen place's own photograph.
 *
 * Deterministic by construction: the photo route (`/api/places/{slug}/photo`)
 * and the image it names are both fulfilled here, so the walk depends on no
 * upstream and no token. The place itself resolves through the real
 * `/api/places/resolve`, which reads the committed index and needs neither.
 * The photograph's author and file are fictitious; the bytes are one of the
 * repository's own images.
 *
 * CSP: the image URL is on the assets host, the one ecosystem origin
 * `img-src` allows, and every case below listens for violations the way
 * `csp-hydration.spec.ts` does. It is meaningful against a production build.
 */

const PLACE = { slug: "schlatkow", name: "Schlatkow" };
const IMAGE_URL = "https://assets.api.schafe-vorm-fenster.de/api/image?wikimediaCommonsId=E2E%20Testdorf%20Kirche.jpg";
const IMAGE_BYTES = readFileSync(join(process.cwd(), "public/images/real/dein-ort-story-kultur.webp"));

const PHOTO = {
  data: {
    src: IMAGE_URL,
    fileName: "E2E Testdorf Kirche.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:E2E_Testdorf_Kirche.jpg",
    licence: "CC BY-SA 4.0",
    author: "Erika Musterfrau",
    year: "2019",
    width: 1000,
    height: 600,
  },
  tier: "live",
  fetchedAt: "2026-10-14T12:00:00.000Z",
  stale: false,
  demo: false,
};

async function collectViolations(page: Page): Promise<string[]> {
  const violations: string[] = [];
  await page.exposeFunction("__reportPhotoCsp", (line: string) => violations.push(line));
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      if (event.blockedURI.startsWith("https://vercel.live/")) return;
      (window as unknown as { __reportPhotoCsp: (line: string) => void }).__reportPhotoCsp(
        `${event.effectiveDirective} ${event.blockedURI || "inline"}`,
      );
    });
  });
  page.on("console", (message) => {
    const text = message.text();
    if (text.includes("Content Security Policy") && !text.includes("https://vercel.live/")) violations.push(text);
  });
  return violations;
}

/** The photo route answers `answer` after `delayMs`; the image is served from the repository. */
async function mockPhoto(page: Page, answer: "photo" | "none", delayMs = 0): Promise<{ calls: () => number }> {
  let calls = 0;
  await page.route("**/api/places/*/photo", async (route) => {
    calls += 1;
    if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
    await (answer === "photo"
      ? route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(PHOTO) })
      : route.fulfill({ status: 204, headers: { "cache-control": "no-store" } }));
  });
  await page.route("https://assets.api.schafe-vorm-fenster.de/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/webp", body: IMAGE_BYTES }),
  );
  return { calls: () => calls };
}

const VIEWPORTS = [
  { width: 360, height: 640 },
  { width: 1280, height: 800 },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`at ${viewport.width}px`, () => {
    test.use({ viewport });

    test(`TS-WEB-0020-A20: /dein-ort with a place that has a photograph shows it, with its credit`, async ({ page }) => {
      const violations = await collectViolations(page);
      await mockPhoto(page, "photo");
      await page.goto(`/dein-ort?ort=${PLACE.slug}`);

      const stage = page.locator("#focus-block");
      const layer = stage.locator(`[data-place-photo="${PLACE.slug}"]`);
      await expect(layer).toBeVisible();
      expect(await layer.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain(IMAGE_URL);

      const credit = stage.locator('[data-photo-note="credit"]');
      await expect(credit).toBeVisible();
      await expect(credit).toContainText("Erika Musterfrau");
      await expect(credit).toContainText("CC BY-SA 4.0");
      await expect(credit.locator("a")).toHaveAttribute("href", PHOTO.data.sourceUrl);
      // The credit sits inside the stage, clear of the page's one h1.
      const [creditBox, headingBox] = await Promise.all([credit.boundingBox(), page.locator("h1").boundingBox()]);
      expect(creditBox!.y + creditBox!.height).toBeLessThanOrEqual(headingBox!.y);

      await page.waitForLoadState("networkidle");
      expect(violations).toEqual([]);
    });

    test(`TS-WEB-0020-A21: /dein-ort with a place without a photograph keeps the page's own and says so`, async ({ page }) => {
      const violations = await collectViolations(page);
      await mockPhoto(page, "none");
      await page.goto(`/dein-ort?ort=${PLACE.slug}`);

      const stage = page.locator("#focus-block");
      const label = stage.locator('[data-photo-note="fallback"]');
      await expect(label).toBeVisible();
      await expect(label).toContainText(PLACE.name);
      // Never another place's photograph presented as this one: no layer, and
      // the stage keeps the photograph it was built with.
      await expect(stage.locator("[data-place-photo]")).toHaveCount(0);
      await expect(stage).toHaveAttribute("data-hero", "true");

      await page.waitForLoadState("networkidle");
      expect(violations).toEqual([]);
    });

    test(`TS-WEB-0020-A22: the swap moves nothing, and without a place nothing is asked`, async ({ page }) => {
      const { calls } = await mockPhoto(page, "photo", 600);

      // No place: the prerendered stage stands, its photograph stays the LCP
      // candidate, and the photo route is never called.
      await page.goto("/dein-ort");
      await page.waitForLoadState("networkidle");
      expect(calls()).toBe(0);
      await expect(page.locator("[data-place-photo], [data-photo-note]")).toHaveCount(0);

      await page.addInitScript(() => {
        const store = window as unknown as { __shift: number };
        store.__shift = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
            if (!shift.hadRecentInput) store.__shift += shift.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(`/dein-ort?ort=${PLACE.slug}`);
      const heading = page.locator("h1");
      await expect(heading).toContainText(PLACE.name);
      const before = await page.locator("#focus-block").boundingBox();
      const headingBefore = await heading.boundingBox();

      await expect(page.locator(`[data-place-photo="${PLACE.slug}"]`)).toBeVisible();
      await page.waitForTimeout(500); // the fade's own window
      const after = await page.locator("#focus-block").boundingBox();
      const headingAfter = await heading.boundingBox();

      expect(after).toEqual(before);
      expect(headingAfter).toEqual(headingBefore);
      const shift = await page.evaluate(() => (window as unknown as { __shift: number }).__shift);
      expect(shift).toBeLessThan(0.1);
    });

    test(`TS-WEB-0019-A22: / with a place shows that place's photograph, with its credit`, async ({ page }) => {
      const violations = await collectViolations(page);
      await mockPhoto(page, "photo");
      await page.goto(`/?ort=${PLACE.slug}`);

      const stage = page.locator("#focus-block");
      await expect(stage.locator(`[data-place-photo="${PLACE.slug}"]`)).toBeVisible();
      await expect(stage.locator('[data-photo-note="credit"]')).toContainText("Erika Musterfrau");

      await page.waitForLoadState("networkidle");
      expect(violations).toEqual([]);
    });
  });
}
