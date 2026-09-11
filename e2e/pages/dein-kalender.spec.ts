import { expect, test } from "@playwright/test";

/**
 * TS-024 — `/dein-kalender`, the 480 € page.
 *
 * Not-yet-M4: TS-024-A6/A7 (embed loader block/allow behaviour — the real
 * Portalize loader is not wired, `embed-frame` is a mock per the mock rule)
 * and TS-024-A12 (relevance-engine job-fit weighting — no relevance engine
 * runs against this page's proof pool yet). JSON-LD (`Offer`, TS-024-A11's
 * structured-data half) is TS-011 territory, not yet wired on any page.
 */

const VIEWPORTS = [
  { name: "360x640", width: 360, height: 640 },
  { name: "1280x800", width: 1280, height: 800 },
];

const ROUTE = "/dein-kalender";

test.describe("TS-024: /dein-kalender", () => {
  test("TS-024-A2: data-block order is focus, contrast, embed-demo, tiers, proof, trust", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const blocks = await page.locator("[data-block]").evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-block")),
    );
    expect(blocks).toEqual(["focus", "contrast", "embed-demo", "tiers", "proof", "trust"]);
  });

  test("TS-024-A3: exactly one Pulse primary CTA to /dein-kalender/bestellen, one equal-weight CTA inside focus", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const primary = page.locator('[data-cta="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveAttribute("href", /\/dein-kalender\/bestellen/);

    const equalWeight = page.locator('[data-cta="equal-weight"]');
    await expect(equalWeight).toHaveCount(1);
    const insideFocus = await page
      .locator('[data-block="focus"] [data-cta="equal-weight"]')
      .count();
    expect(insideFocus).toBe(1);
  });

  for (const viewport of VIEWPORTS) {
    test(`TS-024-A4: both CTAs fully visible without scrolling at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(ROUTE);
      for (const selector of ['[data-cta="primary"]', '[data-cta="equal-weight"]']) {
        const box = await page.locator(selector).boundingBox();
        expect(box).not.toBeNull();
        if (box) expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      }
    });
  }

  test("TS-024-A5: the contrast block has exactly four rows, each with a today and a with-product cell", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const rows = page.locator('[data-block="contrast"] li');
    await expect(rows).toHaveCount(4);
    // `innerText` reflects the rendered (CSS-uppercased) text, so compare
    // case-insensitively rather than assuming sentence case survives.
    const first = (await rows.first().innerText()).toLowerCase();
    expect(first).toContain("heute:");
    expect(first).toContain("mit dem produkt:");
  });

  test("TS-024-A8: the tiers block has one heading and exactly three tiers, in order, tier 3 links to /deine-region", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const tiers = page.locator('[data-block="tiers"] [data-offering]');
    await expect(tiers).toHaveCount(3);
    const order = await tiers.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-offering")),
    );
    expect(order).toEqual(["community-calendar", "portalize-calendar", "portalize-enterprise"]);
    await expect(page.locator('select, [role="tab"], input[type="radio"]')).toHaveCount(0);
    await expect(
      page.locator('[data-offering="portalize-enterprise"] a[href*="/deine-region"]'),
    ).toHaveCount(1);
  });

  test("TS-024-A9: 'Portalize' occurs exactly once, inside the tiers block's portalize-calendar tier, never in a heading or the title", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const bodyText = await page.locator("body").innerText();
    const hits = bodyText.match(/Portalize/gi) ?? [];
    expect(hits).toHaveLength(1);
    const tierText = await page.locator('[data-offering="portalize-calendar"]').innerText();
    expect(tierText).toContain("Portalize");
    expect(await page.title()).not.toContain("Portalize");
    await expect(page.locator('h1:has-text("Portalize"), h2:has-text("Portalize")')).toHaveCount(0);
  });

  test("TS-024-A10/A11: exactly one price, 480, with currency, year, net, read from the offerings package", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toMatch(/480\s*€.*Jahr.*USt/s);
    expect(bodyText).not.toContain("4.000");
    expect(bodyText).not.toContain("4000");
    expect(bodyText).not.toMatch(/\bab\s+\d/);
  });

  test("TS-024-A13: the proof block renders three cards, each with a cleared image or the placeholder badge", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const cards = page.locator('[data-block="proof"] article');
    await expect(cards).toHaveCount(3);
    await expect(page.locator('[data-block="proof"]').getByText("Foto gesucht")).toHaveCount(3);
  });

  test("TS-024-A14: the trust block occurs exactly once, states the data-protection claim, links both legal anchors", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.locator('[data-block="trust"]')).toHaveCount(1);
    const bodyText = await page.locator('[data-block="trust"]').innerText();
    expect(bodyText).toContain("Tracking-Cookies");
    await expect(page.locator('[data-block="trust"] a[href*="#datenschutz"]')).toHaveCount(1);
    await expect(page.locator('[data-block="trust"] a[href*="#auftragsverarbeitung"]')).toHaveCount(1);
  });

  test("TS-024-A15: the equal-weight CTA navigates to the configured briefing URL and fires request-product-briefing once, no Google script/iframe", async ({
    page,
    context,
  }) => {
    const consoleMessages: string[] = [];
    page.on("console", (message) => consoleMessages.push(message.text()));
    await page.goto(ROUTE);
    await page.waitForLoadState("networkidle");
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      page.locator('[data-cta="equal-weight"]').click(),
    ]);
    await popup.waitForLoadState("domcontentloaded").catch(() => undefined);
    expect(popup.url()).toContain("calendar.google.com");
    await popup.close();
    await page.waitForTimeout(500);
    expect(
      consoleMessages.some(
        (text) => text.includes("request-product-briefing") && text.includes("handover"),
      ),
    ).toBe(true);
    await expect(page.locator('script[src*="google"], iframe[src*="google"]')).toHaveCount(0);
  });

  test("TS-024-A16: the primary CTA lands on /dein-kalender/bestellen and fires no conversion event from this page", async ({
    page,
  }) => {
    const consoleMessages: string[] = [];
    page.on("console", (message) => consoleMessages.push(message.text()));
    await page.goto(ROUTE);
    await page.locator('[data-cta="primary"]').click();
    await expect(page).toHaveURL(/\/dein-kalender\/bestellen/);
    expect(consoleMessages.some((text) => text.includes("buy-calendar-licence"))).toBe(false);
  });

  test("TS-024-A18: no local-advertising mention or ad CTA anywhere on the page", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.toLowerCase()).not.toContain("local-advertising");
    expect(bodyText.toLowerCase()).not.toContain("werbefläche");
  });
});
