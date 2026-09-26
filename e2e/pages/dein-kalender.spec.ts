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
  test("TS-WEB-0024-A2: data-block order is focus, contrast, embed-demo, embed-config, tiers, proof, trust", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const blocks = await page.locator("[data-block]").evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-block")),
    );
    // `embed-config` is the seventh block TS-WEB-0024 D2 lists since
    // DEC-0131 §1. The embed section measured 1772 px at 390 px — a screen
    // and a half over G-4's budget — because the real calendar, a nine-line
    // paragraph and a six-row settings list shared one violet ground, and
    // the settings read as fine print under the picture rather than as the
    // answer to "can we decide what is in it?". The calendar keeps the
    // violet section to itself; the settings stand one section lower.
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
    // In-page, not outbound: the consult half resolves to this page's own
    // contact section (TS-WEB-0024 D3, DEC-0081 §3).
    await expect(equalWeight).toHaveAttribute("href", /\/dein-kalender#kontakt$/);
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
    const block = page.locator('[data-block="contrast"]');
    // The block has a heading of its own, and it names no product. Its
    // wording is copy (DEC-0083, DEC-0106 §2), so the assertion is the
    // absence, never the sentence.
    await expect(block.locator("h2")).toHaveCount(1);
    const rows = block.locator("li");
    await expect(rows).toHaveCount(4);
    // `innerText` reflects the rendered (CSS-uppercased) text, so compare
    // case-insensitively rather than assuming sentence case survives.
    const first = (await rows.first().innerText()).toLowerCase();
    expect(first).toContain("heute:");
    expect(first).toContain("mit eurem kalender:");
    // TS-WEB-0024-A5 / TS-WEB-0018-A7 — neither column label nor any cell
    // carries a product name or the avoid list's words for one (CG-039).
    const blockText = (await block.innerText()).toLowerCase();
    for (const forbidden of ["mit dem produkt", "das produkt", "portalize"]) {
      expect(blockText, forbidden).not.toContain(forbidden);
    }
    // No checkmark/cross column: every row is two cells and nothing else.
    await expect(block.locator("li p")).toHaveCount(8);
  });

  test("TS-WEB-0024-A5: no row names a postcode — a place name is where you are from", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const blockText = (await page.locator('[data-block="contrast"]').innerText()).toLowerCase();
    for (const forbidden of ["postleitzahl", "plz"]) {
      expect(blockText, forbidden).not.toContain(forbidden);
    }
  });

  test("TS-WEB-0024-A8: the tiers block has one section heading and exactly three tiers, in order", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const block = page.locator('[data-block="tiers"]');
    // One heading names the section — the `lime-500` band's `h2`
    // (`price-band`). Each tier's own title is an `h3` inside its row, which
    // is the module shape D6 leaves free and T-06 built (DEC-0131 §2).
    await expect(block.locator("h2")).toHaveCount(1);
    const tiers = block.locator("[data-offering]");
    await expect(tiers).toHaveCount(3);
    const order = await tiers.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-offering")),
    );
    expect(order).toEqual(["community-calendar", "portalize-calendar", "portalize-enterprise"]);
    await expect(block.locator("h3")).toHaveCount(3);
    // Not an audience selector (TS-WEB-0018 D7): one question answered three
    // times, nowhere on the page a control to classify yourself.
    await expect(page.locator('select, [role="tab"], input[type="radio"]')).toHaveCount(0);
  });

  test("TS-WEB-0024-A8 / TS-WEB-0006-A18: each tier carries exactly one CTA, on the secondary rung, with the tier's weight", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const expected = [
      { offering: "community-calendar", href: "/mitmachen", variant: "quiet" },
      { offering: "portalize-calendar", href: "/dein-kalender/bestellen", variant: "primary-light" },
      { offering: "portalize-enterprise", href: "/deine-region", variant: "quiet" },
    ] as const;

    for (const tier of expected) {
      const row = page.locator(`[data-block="tiers"] [data-offering="${tier.offering}"]`);
      const ctas = row.locator("a[data-cta], button[data-cta]");
      await expect(ctas, `${tier.offering}: exactly one CTA`).toHaveCount(1);
      await expect(ctas).toHaveAttribute("href", new RegExp(`${tier.href}(\\?|$)`));
      // The rung is secondary on every tier; none of them is the page's
      // primary marker (DEC-0082 §1).
      await expect(ctas).toHaveAttribute("data-cta", "secondary");
      // The weight is derived from the offering id, never chosen per call
      // site — `price-tier-row` publishes it on the row.
      await expect(row).toHaveAttribute("data-cta-variant", tier.variant);
    }

    // Pulse occurs once, in `focus`, and never on a tier (A3).
    await expect(page.locator('[data-block="tiers"] [data-cta="primary"]')).toHaveCount(0);
  });

  test("TS-WEB-0024-A9: 'Portalize' occurs exactly once, inside the tiers block at the 480 € tier, never in a heading or the title", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const bodyText = await page.locator("body").innerText();
    const hits = bodyText.match(/Portalize/gi) ?? [];
    expect(hits).toHaveLength(1);
    // `price-tier-row` has no body-copy slot, so D7's one sentence stands
    // directly under the row it belongs to, inside the tiers block
    // (DEC-0131 §3).
    const tiersText = await page.locator('[data-block="tiers"]').innerText();
    expect(tiersText).toContain("Portalize");
    // "at the 480 € tier" is asserted structurally: the sentence is the
    // paragraph immediately following the `portalize-calendar` row, so it
    // cannot drift to the community or the region tier.
    await expect(page.locator('[data-offering="portalize-calendar"] + p')).toContainText(
      "Portalize",
    );
    expect(await page.title()).not.toContain("Portalize");
    await expect(
      page.locator('h1:has-text("Portalize"), h2:has-text("Portalize"), h3:has-text("Portalize")'),
    ).toHaveCount(0);
  });

  test("TS-WEB-0024 D2 / DEC-0131: the configuration block carries the benefit band, six settings and no radius", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const block = page.locator('[data-block="embed-config"]');
    await expect(block).toHaveCount(1);
    await expect(block.locator('[data-surface="lime-500"]')).toHaveCount(1);
    // Six settings, each an `h3` inside its row.
    await expect(block.locator("li h3")).toHaveCount(6);
    // One setting is still unconfirmed upstream and says so as a badge, not
    // as a softened sentence (DEC-0118).
    await expect(block.getByText("wird geprüft")).toBeVisible();
    // One struck chip per filter setting — the design system's one
    // strikethrough, "this is what your calendar leaves out".
    expect(await block.locator("[data-excluded]").count()).toBeGreaterThan(0);

    const text = (await block.innerText()).toLowerCase();
    // "Umkreis" is in no offering record (spec-impact.md:315) and "im Amt"
    // is the copy guide's avoid list (CG-036).
    for (const forbidden of ["umkreis", "im amt"]) {
      expect(text, forbidden).not.toContain(forbidden);
    }
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
      "Bleibt die Frage, wem ihr da eigentlich eure Daten gebt.",
    ]) {
      await expect(page.getByText(line)).toBeVisible();
    }
    // The price section's framing line is the band's, not a transition above
    // it — one sentence, in one place (DEC-0118, DEC-0131 §2).
    await expect(
      page.locator('[data-block="tiers"]').getByText("wo der Kalender stehen soll"),
    ).toBeVisible();
    for (const kicker of [
      "Warum es heute hakt",
      "So funktioniert es",
      "Was hilft euch das?",
      "Was es kostet",
      "Wer den Kalender nutzt",
      "Wie wir arbeiten",
    ]) {
      await expect(page.getByText(kicker, { exact: true })).toBeVisible();
    }
  });

  /**
   * G-6 / brief page 6, item 8 — the page ended on a button with no sentence
   * above it. The quiet second way under it is gone with DEC-0081 §3: it was
   * a second carrier of the appointment URL.
   */
  test("the closing block carries its heading and repeats the primary without Pulse", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const closing = page.locator("#closing-cta");
    await expect(closing).toContainText("Euer Kalender läuft, sobald der Code auf eurer Seite steht.");
    await expect(closing.locator('a[href*="/dein-kalender/bestellen"]')).toHaveCount(1);
    // Still exactly one primary treatment on this screenful: the repeat is
    // `data-cta="repeat"`.
    await expect(closing.locator('[data-cta="primary"]')).toHaveCount(0);
    // TS-WEB-0024-A15 — the appointment URL occurs once on the page, and
    // that occurrence is the contact section's first action row.
    await expect(closing.locator('a[href*="calendar.app.google"]')).toHaveCount(0);

    // TS-WEB-0024-A17 — same goal, same target, same label as the primary.
    const primaryLabel = (await page.locator('[data-cta="primary"]').innerText()).trim();
    const repeatLabel = (
      await closing.locator('a[href*="/dein-kalender/bestellen"]').innerText()
    ).trim();
    expect(repeatLabel).toBe(primaryLabel);
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

  test("TS-WEB-0024-A15: the equal-weight CTA moves to the contact section and emits nothing; the appointment URL occurs once", async ({
    page,
  }) => {
    const consoleMessages: string[] = [];
    page.on("console", (message) => consoleMessages.push(message.text()));
    await page.goto(ROUTE);
    await page.waitForLoadState("networkidle");

    // The one element carrying the appointment URL is the section's first
    // action row — not the hero, not a tier, not the closing block
    // (DEC-0081 §3, TS-WEB-0016 D7).
    const appointment = page.locator('a[href*="calendar.app.google"]');
    await expect(appointment).toHaveCount(1);
    await expect(
      page.locator("section#kontakt a[data-channel='appointment']"),
    ).toHaveAttribute("href", /calendar\.app\.google/);

    // A click inside a document is navigation, and counting it would count
    // one intent twice (DEC-0081 §4).
    const before = consoleMessages.length;
    await page.locator('[data-cta="equal-weight"]').click();
    await expect(page).toHaveURL(/#kontakt$/);
    await page.waitForTimeout(300);
    const fired = consoleMessages.slice(before);
    expect(fired.some((text) => text.includes("[analytics:mock] conversion"))).toBe(false);

    // The section itself is in view after the jump.
    await expect(page.locator("section#kontakt")).toBeInViewport();

    // No Google script, iframe or font is loaded by the page (DEC-0013).
    await expect(page.locator('script[src*="google"], iframe[src*="google"]')).toHaveCount(0);
  });

  /**
   * The section half of TS-WEB-0024-A15. `e2e/contact-section.spec.ts` walks
   * every route for the four rows' events; this asserts the two goals of row
   * 1 on *this* route, because the route is what distinguishes one booking
   * intent from another (DEC-0081 §4, TS-WEB-0016 D12).
   */
  test("TS-WEB-0024-A15: the section's first action row emits request-product-briefing and make-contact, both on this route", async ({
    page,
  }) => {
    const conversions: string[] = [];
    page.on("console", (message) => {
      if (message.text().includes("[analytics:mock] conversion")) conversions.push(message.text());
    });
    await page.goto(ROUTE);
    const origin = new URL(page.url()).origin;
    await page.route(
      (url) => url.origin !== origin,
      (route) => route.fulfill({ status: 204, body: "" }),
    );
    const row = page.locator("section#kontakt a[data-channel='appointment']");
    await expect(row.locator("xpath=ancestor::*[@data-conversion-tracker][1]")).toHaveAttribute(
      "data-hydrated",
      "true",
    );
    await row.click({ noWaitAfter: true });
    await expect.poll(() => conversions.length).toBeGreaterThanOrEqual(2);
    await page.waitForTimeout(150);
    expect(conversions.filter((text) => text.includes("request-product-briefing"))).toHaveLength(1);
    expect(conversions.filter((text) => text.includes("make-contact"))).toHaveLength(1);
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
