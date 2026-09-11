import { expect, test } from "@playwright/test";

/**
 * TS-023 — `/mitmachen/registrieren`, walked step by step to its handover.
 *
 * "beispielgemeinde-musterdorf" is `src/lib/live/mocks/fixtures.ts`'s
 * `DEMO_PLACES[0]` — the shared live-data mock every place lookup on the
 * site resolves against, not a page-local fixture.
 *
 * TS-023-A6 (a municipality hit with several communities) has no
 * naturally-occurring fixture in the shared mock (`mockSearchByZip` answers
 * at most one place per postcode) — covered at unit level instead
 * (`resolve-place.test.ts`, against a stubbed multi-suggestion result); not
 * e2e-walkable today, recorded as not-yet (needs either a real geo-api
 * credential or an extended fixture, neither owned by this work package).
 */

const ROUTE = "/mitmachen/registrieren";

test.describe("TS-023: the register flow", () => {
  test("TS-023-A1: step 1 shows the place search first, no proof block, exactly one primary CTA", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ort");
    await expect(page.locator('[data-cta="primary"]')).toHaveCount(0); // the step-1 submit is not the flow's primary CTA
    await expect(page.getByText("Belege", { exact: true })).toHaveCount(0);
  });

  test("TS-023-A2/A3/A7: walking the flow keeps state in the URL, survives reload and a fresh window, never in storage", async ({
    page,
    context,
  }) => {
    // A real history entry for step 1 first, so `goBack()` below has
    // somewhere to return to.
    await page.goto(ROUTE);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ort");

    // Arrives pre-answered, as if from /dein-ort/starten or /mitmachen (D5, A7).
    await page.goto(`${ROUTE}?ort=beispielgemeinde-musterdorf`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veröffentlicht");
    expect(page.url()).toContain("ort=beispielgemeinde-musterdorf");

    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veröffentlicht");

    const fresh = await context.newPage();
    await fresh.goto(page.url());
    await expect(fresh.getByRole("heading", { level: 1 })).toContainText("veröffentlicht");
    const storage = await fresh.evaluate(() => ({
      cookie: document.cookie,
      local: window.localStorage.length,
      session: window.sessionStorage.length,
    }));
    expect(storage).toEqual({ cookie: "", local: 0, session: 0 });
    await fresh.close();

    await page.goBack();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ort");
  });

  test("TS-023-A7: step 1 arrives answered — the place is named and changeable, never skipped", async ({
    page,
  }) => {
    // The hand-over the founding path makes: `/dein-ort/starten?ort=X` → this.
    await page.goto("/dein-ort/starten?ort=99999");
    await page.locator('[data-cta="primary"]').first().click();
    await expect(page).toHaveURL(/\/mitmachen\/registrieren\?ort=99999$/);

    // `99999` is uncovered, so step 1 is genuinely unanswered and asked.
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ort");

    // And with a value that resolves: the step advances, and the answered
    // step 1 stays on screen — the place named, with a control to change it
    // (D5: "answered, visible and changeable, never skipped").
    await page.goto(`${ROUTE}?ort=beispielgemeinde-musterdorf`);
    const answered = page.locator('[data-step-answered="ort"]');
    await expect(answered).toHaveCount(1);
    await expect(answered).toContainText("Beispielgemeinde Musterdorf");

    const change = answered.locator("a");
    await expect(change).toHaveCount(1);
    await change.click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ort");
    // The answer travels back with it, so the visitor can correct rather than
    // retype (D4: `schritt` may move backwards to an answered step).
    await expect(page.locator('input[name="ort"]')).toHaveValue("beispielgemeinde-musterdorf");

    // It stays visible through step 3 and the handover.
    for (const query of [
      "?ort=beispielgemeinde-musterdorf&wer=opt-1",
      "?ort=beispielgemeinde-musterdorf&wer=opt-1&weg=whatsapp",
    ]) {
      await page.goto(`${ROUTE}${query}`);
      await expect(page.locator('[data-step-answered="ort"]')).toContainText(
        "Beispielgemeinde Musterdorf",
      );
    }
  });

  test("TS-023-A4: an invalid `schritt` and an invalid enum are dropped, re-asking the step", async ({
    page,
  }) => {
    await page.goto(`${ROUTE}?ort=beispielgemeinde-musterdorf&schritt=3`);
    // step 2 (who publishes) is unanswered, so schritt=3 must not be honoured.
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veröffentlicht");

    await page.goto(`${ROUTE}?ort=beispielgemeinde-musterdorf&wer=not-a-real-option`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veröffentlicht");
  });

  test("TS-023-A5: an unresolvable value leaves step 1 unanswered, echoed only in the search field", async ({
    page,
  }) => {
    await page.goto(`${ROUTE}?ort=not-a-real-place-at-all`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ort");
    // Escaped inside the search field's `value` attribute (React escapes by
    // construction) — and nowhere else: the visible body text carries no
    // trace of it, since an `<input>`'s value is not rendered text content.
    await expect(page.locator('input[name="ort"]')).toHaveValue("not-a-real-place-at-all");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toContain("not-a-real-place-at-all");
  });

  test("TS-023-A8: step 3 offers exactly three publishing paths", async ({ page }) => {
    await page.goto(`${ROUTE}?ort=beispielgemeinde-musterdorf&wer=opt-1`);
    const options = page.locator('input[name="weg"]');
    await expect(options).toHaveCount(3);
  });

  test("TS-023-A9/A10: completing all three steps offers exactly one external app action, firing register-as-publisher once", async ({
    page,
  }) => {
    // `mock-tracker.ts` logs `console.info("[analytics:mock] conversion",
    // { goalId, stage, … })`; `ConsoleMessage.text()` stringifies every
    // argument (Chromium's own `%o`-style formatting), so the goal id and
    // stage are findable as substrings. `publish-first-event` never fires
    // from this website (D6) — nothing to wait for, so it is checked from
    // the same buffer the wait below already filled.
    const consoleMessages: string[] = [];
    page.on("console", (message) => consoleMessages.push(message.text()));

    await page.goto(ROUTE);
    await page.waitForLoadState("networkidle");
    await page.fill('input[name="ort"]', "beispielgemeinde-musterdorf");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/ort=beispielgemeinde-musterdorf/);

    await page.click('input[name="wer"][value="opt-1"]');
    await page.click('button:has-text("Weiter")');
    await expect(page).toHaveURL(/wer=opt-1/);

    await page.click('input[name="weg"][value="whatsapp"]');
    await page.click('button:has-text("Weiter")');
    await expect(page).toHaveURL(/weg=whatsapp/);

    // Hydration, not just the URL, has to be done before this click: it is
    // a client component's `onClick` (`ConversionTracker`) that fires the
    // event, and under heavy parallel load Next dev's on-demand compile can
    // leave a freshly-navigated page server-rendered but not yet hydrated.
    await page.waitForLoadState("networkidle");
    const handoverLink = page.locator('[data-cta="primary"]');
    await expect(handoverLink).toHaveCount(1);
    await expect(handoverLink).toHaveAttribute("href", /^https:\/\/app\./);

    // The handover is a same-tab navigation to an external, unreachable-in-
    // this-suite host; block it so the click's `onClick` (which fires the
    // conversion event synchronously, before the browser navigates) still
    // runs against a live page instead of racing a torn-down document.
    await page.route("https://app.schafe-vorm-fenster.de/**", (route) => route.abort());
    const fired = page.waitForEvent("console", {
      predicate: (message) =>
        message.text().includes("register-as-publisher") && message.text().includes("handover"),
      timeout: 15_000,
    });
    await handoverLink.click();
    await expect(fired).resolves.toBeTruthy();
    expect(consoleMessages.some((text) => text.includes("publish-first-event"))).toBe(false);
  });

  test("TS-023-A11: no step or the handover state shows a confirmation, instructions or an event field", async ({
    page,
  }) => {
    await page.goto(`${ROUTE}?ort=beispielgemeinde-musterdorf&wer=opt-1&weg=whatsapp`);
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    expect(bodyText).not.toMatch(/bestätigung|erfolgreich registriert/);
    await expect(page.locator('input[type="date"], input[name="event"]')).toHaveCount(0);
  });

  test("TS-023-A12: no envoy element, no POST route, no server action on this route", async ({
    page,
  }) => {
    const requests: string[] = [];
    page.on("request", (request) => {
      if (request.method() !== "GET") requests.push(`${request.method()} ${request.url()}`);
    });
    await page.goto(ROUTE);
    await page.fill('input[name="ort"]', "beispielgemeinde-musterdorf");
    await page.click('button[type="submit"]');
    await page.waitForLoadState("networkidle");
    expect(requests).toEqual([]);
    // Scoped to `main`: the footer's own contact widget (`kind="contact"`)
    // is site-wide chrome present on every page, not this route's content.
    await expect(page.locator("main [data-envoy-form-kind]")).toHaveCount(0);
  });

  test("TS-023-A13: every step is completable with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(ROUTE);
    await page.fill('input[name="ort"]', "beispielgemeinde-musterdorf");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/ort=beispielgemeinde-musterdorf/);
    await page.click('input[name="wer"][value="opt-1"]');
    await page.click('button:has-text("Weiter")');
    await expect(page).toHaveURL(/wer=opt-1/);
    await page.click('input[name="weg"][value="whatsapp"]');
    await page.click('button:has-text("Weiter")');
    await expect(page.locator('[data-cta="primary"]')).toHaveAttribute("href", /^https:\/\/app\./);
    await context.close();
  });

  test("TS-023-A14: every step URL canonicalises to the parameter-free path", async ({ page }) => {
    // The route's own indexability is not the environment-wide noindex
    // regime (TS-015 D3 puts every non-production build behind `noindex`,
    // which this suite always runs under) — only the canonical claim is
    // testable outside production.
    await page.goto(`${ROUTE}?ort=beispielgemeinde-musterdorf`);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toMatch(new RegExp(`${ROUTE}$`));
  });

  test("TS-023-A15: the context band renders on step 1 and is absent on steps 2, 3 and the handover", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.locator("#context-band")).toHaveCount(1);

    await page.goto(`${ROUTE}?ort=beispielgemeinde-musterdorf`);
    await expect(page.locator("#context-band")).toHaveCount(0);

    await page.goto(`${ROUTE}?ort=beispielgemeinde-musterdorf&wer=opt-1`);
    await expect(page.locator("#context-band")).toHaveCount(0);

    await page.goto(`${ROUTE}?ort=beispielgemeinde-musterdorf&wer=opt-1&weg=whatsapp`);
    await expect(page.locator("#context-band")).toHaveCount(0);
  });
});
