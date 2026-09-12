import { expect, test } from "@playwright/test";

/**
 * F-3-10 — no section may stay invisible while still reserving its height.
 *
 * `motion-reveal` arms an off-screen section to `opacity: 0` and reveals it
 * when an `IntersectionObserver` reports it entering the viewport. An
 * `IntersectionObserver` only notifies when `isIntersecting` *changes*: a
 * section that goes from "below the viewport" to "above the viewport" inside
 * a single scroll step never changes it (0 → 0), so no callback runs and the
 * section stays armed — transparent, at full height. That is the
 * screen-height blank band the M5 UAT walk reported on every place-result
 * page (`state/findings/round-3.md` F-3-10): the content is in the DOM and in
 * the accessibility tree, and no pixel of it is ever painted.
 *
 * The gesture that produces it is ordinary — a flick to the bottom, an
 * in-page anchor jump, `End`, or a full-page screenshot — so the assertion
 * is exactly that: jump to the end of the document in one step, and require
 * every revealable wrapper to be visible.
 *
 * Both DEC-067 reference viewports, and the three routes the finding names
 * plus `/` (the same wrapper on the most-visited page).
 */

const VIEWPORTS = [
  { name: "360x640", width: 360, height: 640 },
  { name: "1280x800", width: 1280, height: 800 },
] as const;

const PATHS = [
  "/dein-ort?ort=07743",
  "/dein-ort?ort=10115",
  "/dein-ort/starten?ort=99999",
  "/en/your-place?ort=07743",
  "/",
] as const;

for (const path of PATHS) {
  for (const viewport of VIEWPORTS) {
    test(`F-3-10: ${path} paints every revealable section after a jump to the end at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // One step to the end of the document — the gesture the finding
      // describes, and the one an IntersectionObserver cannot report as a
      // change.
      await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
      });
      await page.waitForTimeout(1_000);

      const invisible = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('[class*="motion-reveal"]')]
          .filter((element) => Number(getComputedStyle(element).opacity) < 1)
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return `${element.firstElementChild?.id || element.id || element.tagName} (${Math.round(
              rect.height,
            )}px tall, opacity ${getComputedStyle(element).opacity})`;
          }),
      );

      expect(
        invisible,
        `sections left transparent while reserving their height on ${path} @ ${viewport.name}`,
      ).toEqual([]);
    });
  }
}
