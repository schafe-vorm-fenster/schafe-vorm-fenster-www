import { expect, test } from "@playwright/test";

/**
 * TS-WEB-0024 — `/dein-kalender`, the 480 € page.
 *
 * Not-yet-M4: TS-WEB-0024-A6/A7 (embed loader block/allow behaviour — the real
 * Portalize loader is not wired, `embed-frame` is a mock per the mock rule)
 * and TS-WEB-0024-A12 (relevance-engine job-fit weighting — no relevance engine
 * runs against this page's proof pool yet). JSON-LD (`Offer`, TS-WEB-0024-A11's
 * structured-data half) is TS-WEB-0011 territory, not yet wired on any page.
 */

const VIEWPORTS = [
  { name: "360x640", width: 360, height: 640 },
  { name: "1280x800", width: 1280, height: 800 },
];

const ROUTE = "/dein-kalender";

test.describe("TS-WEB-0024: /dein-kalender", () => {
  test("TS-WEB-0024-A2: data-block order is focus, contrast, embed-demo, tiers, proof, trust", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const blocks = await page.locator("[data-block]").evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-block")),
    );
    // CHANGED (polish brief G-4 and page 6, item 2): `embed-config` is new.
    // The embed section measured 1772 px at 390 px — a screen and a half over
    // the budget — because the real calendar, a nine-line paragraph and a
    // six-row settings list shared one violet ground, and the settings read
    // as fine print under the picture rather than as the answer to "can we
    // decide what is in it?". The calendar keeps the violet section to
    // itself; the settings stand one section lower, on their own ground.
    expect(blocks).toEqual([
      "focus",
      "contrast",
      "embed-demo",
      "embed-config",
      "tiers",
      "proof",
      "trust",
    ]);
  });

  test("TS-WEB-0024-A3: exactly one Pulse primary CTA to /dein-kalender/bestellen, one equal-weight CTA inside focus", async ({
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
    test(`TS-WEB-0024-A4: both CTAs fully visible without scrolling at ${viewport.name}`, async ({
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

  test("TS-WEB-0024-A5: the contrast block has exactly four rows, each with a today and a with-product cell", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    // The heading read "Heute gegen mit dem Produkt" — not a sentence in any
    // language, in 38 px, on the page that asks for 480 € (brief, finding 5).
    await expect(
      page.getByRole("heading", { name: "Heute — und mit dem Produkt" }),
    ).toBeVisible();
    const rows = page.locator('[data-block="contrast"] li');
    await expect(rows).toHaveCount(4);
    // `innerText` reflects the rendered (CSS-uppercased) text, so compare
    // case-insensitively rather than assuming sentence case survives.
    const first = (await rows.first().innerText()).toLowerCase();
    expect(first).toContain("heute:");
    expect(first).toContain("mit dem produkt:");
  });

  test("TS-WEB-0024-A8: the tiers block has one heading and exactly three tiers, in order, tier 3 links to /deine-region", async ({
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

  test("TS-WEB-0024-A9: 'Portalize' occurs exactly once, inside the tiers block's portalize-calendar tier, never in a heading or the title", async ({
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

  test("TS-WEB-0024-A10/A11: exactly one price, 480, with currency, year, net, read from the offerings package", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toMatch(/480\s*€.*Jahr.*USt/s);
    expect(bodyText).not.toContain("4.000");
    expect(bodyText).not.toContain("4000");
    expect(bodyText).not.toMatch(/\bab\s+\d/);
  });

  test("TS-WEB-0024-A13: the proof block renders three cards, one featured and two compact, and no image slot at all", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const block = page.locator('[data-block="proof"]');
    await expect(block.locator("article")).toHaveCount(3);

    // Jan, 2026-09-18: a card whose image right is not cleared shows a flat
    // brand-colour surface and says nothing about itself. The old assertion
    // counted three "Foto gesucht" badges; the contract is now the opposite.
    for (const marking of ["Foto gesucht", "Photo wanted", "Platzhalter", "Nicht motivgenau"]) {
      await expect(block.getByText(marking), marking).toHaveCount(0);
    }

    // CHANGED (polish brief G-9 + G-7). The flat surface was three identical
    // 143 px bands in a row — which also broke the design system's own "no
    // two photo surfaces adjacent" rule — and the copy behind it invited a
    // photo from the reader's village for what are portrait slots of named
    // mayors. The slot is gone. What is left is one feature card over two
    // hairline rows, each naming its own source, with no `Beleg` badge
    // repeating the word the source line already carries.
    await expect(block.locator("img, [data-placeholder]")).toHaveCount(0);
    await expect(block.locator('article[data-emphasis="feature"]')).toHaveCount(1);
    await expect(block.locator('article[data-emphasis="compact"]')).toHaveCount(2);
    await expect(block.getByText("Beleg", { exact: true })).toHaveCount(0);
  });

  /**
   * G-3 / brief page 6, item 7 — the page was four arguments standing next to
   * each other with nothing between them. Each of the three joints now
   * carries the sentence that names it, and every section after the hero
   * opens with its role.
   */
  test("G-3: the three transitions and the section kickers are on the page", async ({ page }) => {
    await page.goto(ROUTE);
    for (const line of [
      "So sieht das aus, wenn es bei euch steht:",
      "Was das kostet, hängt nur davon ab, wo der Kalender stehen soll.",
      "Bleibt die Frage, wem ihr da eigentlich eure Daten gebt.",
    ]) {
      await expect(page.getByText(line)).toBeVisible();
    }
    for (const kicker of [
      "Warum es heute hakt",
      "So funktioniert es",
      "Was es kostet",
      "Wer das schon macht",
      "Wie wir arbeiten",
    ]) {
      await expect(page.getByText(kicker, { exact: true })).toBeVisible();
    }
  });

  /**
   * G-5 — the outbound disclosure leaves the control's label. "(öffnet neuen
   * Tab) · Daten gehen an Google" inside the pill made the hero's secondary a
   * three-line white block that outweighed the page's own primary, and made
   * tier 2's briefing a two-line link. The new-tab half is one written
   * sentence under the control; the data half belongs to the privacy
   * statement the trust block links.
   */
  test("G-5: no briefing control carries its disclosure inside its own label", async ({ page }) => {
    await page.goto(ROUTE);
    const labels = await page
      .locator('a[href*="calendar.app.google"]')
      .evaluateAll((elements) => elements.map((element) => element.textContent ?? ""));
    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels) {
      expect(label).not.toContain("Daten gehen an");
    }
    await expect(page.getByText("Öffnet Google Kalender in einem neuen Tab.").first()).toBeVisible();
  });

  /**
   * G-6 / brief page 6, item 8 — the page ended on a button with no sentence
   * above it, and the equal-weight briefing was nowhere near it.
   */
  test("the closing block carries its heading and the briefing as a quiet second way", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const closing = page.locator("#closing-cta");
    await expect(closing).toContainText("Euer Kalender läuft, sobald der Code auf eurer Seite steht.");
    await expect(closing.locator('a[href*="/dein-kalender/bestellen"]')).toHaveCount(1);
    await expect(closing.getByText("Lieber erst sprechen?")).toBeVisible();
    // Still exactly one primary treatment on this screenful: the repeat is
    // `data-cta="repeat"`, and the briefing is a link.
    await expect(closing.locator('[data-cta="primary"]')).toHaveCount(0);
  });

  test("TS-WEB-0024-A14: the trust block occurs exactly once, states the data-protection claim, links both legal anchors", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.locator('[data-block="trust"]')).toHaveCount(1);
    const bodyText = await page.locator('[data-block="trust"]').innerText();
    expect(bodyText).toContain("Tracking-Cookies");
    await expect(page.locator('[data-block="trust"] a[href*="#datenschutz"]')).toHaveCount(1);
    await expect(page.locator('[data-block="trust"] a[href*="#auftragsverarbeitung"]')).toHaveCount(1);
  });

  test("TS-WEB-0024-A15: the equal-weight CTA navigates to the configured briefing URL and fires request-product-briefing once, no Google script/iframe", async ({
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

  test("TS-WEB-0024-A16: the primary CTA lands on /dein-kalender/bestellen and fires no conversion event from this page", async ({
    page,
  }) => {
    const consoleMessages: string[] = [];
    page.on("console", (message) => consoleMessages.push(message.text()));
    await page.goto(ROUTE);
    await page.locator('[data-cta="primary"]').click();
    await expect(page).toHaveURL(/\/dein-kalender\/bestellen/);
    expect(consoleMessages.some((text) => text.includes("buy-calendar-licence"))).toBe(false);
  });

  test("TS-WEB-0024-A18: no local-advertising mention or ad CTA anywhere on the page", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.toLowerCase()).not.toContain("local-advertising");
    expect(bodyText.toLowerCase()).not.toContain("werbefläche");
  });
});
