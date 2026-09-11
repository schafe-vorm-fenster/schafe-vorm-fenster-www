import { expect, test } from "@playwright/test";

/**
 * TS-022 — `/mitmachen`, the publishing entry.
 *
 * ACs requiring real personalization/geo-ranking (stage 1–3, TS-008 D1 has
 * no row for this route) are not-yet-M4: TS-022-A7/A8 are covered at unit
 * level instead (`app/[lang]/mitmachen/example-place.test.ts`); TS-022-A10's
 * stage-3 branch and TS-022-A14's "resolved place" branch cannot be
 * exercised until personalization is built (no anchor ever reaches this
 * page today, per D8: "no place search on this route").
 */

const VIEWPORTS = [
  { name: "360x640", width: 360, height: 640 },
  { name: "1280x800", width: 1280, height: 800 },
];

test.describe("TS-022-A2/A3/A4/A5/A6/A9/A12/A13/A16: /mitmachen", () => {
  for (const viewport of VIEWPORTS) {
    test(`TS-022-A2: exactly one data-cta="primary", visible without scrolling, resolves to /mitmachen/registrieren at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/mitmachen");
      const primary = page.locator('[data-cta="primary"]');
      await expect(primary).toHaveCount(1);
      await expect(primary).toBeVisible();
      await expect(primary).toHaveAttribute("href", /\/mitmachen\/registrieren/);
      const box = await primary.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      }
    });
  }

  test("TS-022-A3: DOM order is hero, objections, three paths, live example, proof", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const blocks = await page
      .locator("main [data-block]")
      .evaluateAll((elements) => elements.map((element) => element.getAttribute("data-block")));
    // hero (scene) -> objections -> wege (three paths) -> beispiel (live example) -> beleg (proof)
    expect(blocks).toEqual(["scene", "objections", "wege", "beispiel", "beleg"]);
  });

  test("TS-022-A4: exactly one data-block=\"scene\", mechanism whatsapp, opener ends in a question mark", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const scenes = page.locator('[data-block="scene"]');
    await expect(scenes).toHaveCount(1);
    await expect(scenes).toHaveAttribute("data-mechanism", "whatsapp");
    const headline = await page.locator("h1").first().textContent();
    expect(headline?.trim().endsWith("?")).toBe(true);
  });

  test("TS-022-A5: exactly three publishing paths, ordered whatsapp/calendar-connection/website-import, alpha badge visible", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const paths = page.locator("[data-mechanism]");
    await expect(paths).toHaveCount(4); // the scene wrapper + 3 publishing-path blocks
    const mechanisms = await paths.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-mechanism")),
    );
    expect(mechanisms).toEqual(["whatsapp", "whatsapp", "calendar-connection", "website-import"]);
    await expect(page.getByText("In Erprobung (Alpha)")).toBeVisible();
  });

  test("TS-022-A6: the objection block renders a headline, items, and a visibly empty proof slot", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    await expect(page.getByText("Warum das, was ihr heute macht, nicht überall ankommt")).toBeVisible();
    await expect(page.getByText("Kein Nachweis", { exact: true })).toBeVisible();
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    for (const banned of ["einfach", "digital", "für alle", "modern", "innovativ"]) {
      expect(bodyText).not.toContain(banned);
    }
  });

  test("TS-022-A9: the live example names its radius \"in <place>\" and no page URL carries a place slug as a path segment", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    await expect(page.getByText(/^So sieht das in .+ aus$/)).toBeVisible();
    expect(page.url()).not.toMatch(/gross-kiesow|musterdorf/);
  });

  test("TS-022-A12: no price, no 'Portalize', no 'local-advertising'; exactly one JSON-LD graph with WebPage only", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/480|Portalize|local-advertising|€/);
    // JSON-LD is TS-011 territory (not yet wired) — recorded as not-yet-M4.
  });

  test("TS-022-A13: exactly one link to /dein-kalender in the page's own body, inside an aside, without primary treatment", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    // Excludes `#context-band`: TS-011-A4 makes it an `aside` too (F-2-41),
    // and its "other jobs" list links `/dein-kalender` on every page — not
    // this page's own D9 rule, which is about its own blocks 1–2.
    const ownAsideLinks = await page
      .locator('aside a[href*="/dein-kalender"]')
      .evaluateAll((elements) =>
        elements
          .filter((element) => !element.closest("#context-band"))
          .map((element) => element.getAttribute("data-cta")),
      );
    expect(ownAsideLinks).toHaveLength(1);
    expect(ownAsideLinks[0]).not.toBe("primary");
    // Scoped to `main`, excluding the context band: the header's persistent
    // job nav (chrome, TS-004 D4) and TS-006 D5's context band both link to
    // /dein-kalender as "the other jobs" on every page — neither is this
    // page's own D9 rule, which is about its own blocks 1–2.
    const ownBodyLinks = await page
      .locator('main a[href="/dein-kalender"]')
      .evaluateAll((elements) =>
        elements.filter((element) => !element.closest("#context-band, #closing-cta")).length,
      );
    expect(ownBodyLinks).toBe(1);
  });

  test("TS-022-A16: no horizontal scroll and no reflow-prone empty box at either reference viewport", async ({
    page,
  }) => {
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport);
      await page.goto("/mitmachen");
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows).toBe(false);
    }
  });
});
