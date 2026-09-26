import { expect, test } from "@playwright/test";

/**
 * TS-WEB-0023 — `/mitmachen/registrieren`, walked step by step to its handover.
 *
 * "schlatkow" is `src/lib/live/mocks/fixtures.ts`'s
 * `DEMO_PLACES[0]` — the shared live-data mock every place lookup on the
 * site resolves against, not a page-local fixture.
 *
 * Step 1 searches by **name** since T-16 (DEC-0079 §1, DEC-0128): the `isZip`
 * gate that dropped every typed name is gone, so "Groß Polzin" — a
 * municipality of the committed community index with five covered villages
 * behind it and no community of its own slug — finally gives TS-WEB-0023-A6 a
 * real fixture. It was unit-only against a stub until now.
 */

const ROUTE = "/mitmachen/registrieren";

test.describe("TS-WEB-0023: the register flow", () => {
  test("TS-WEB-0023-A1: step 1 shows the place search first, no proof block, exactly one primary CTA", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ort");
    // A1: "exactly one `data-cta=\"primary\"`" — and on step 1 that is the
    // search submit, because searching *is* the advance here: a resolved
    // place moves the flow to step 2 by itself (DEC-0128).
    const primary = page.locator('[data-cta="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveAttribute("type", "submit");
    await expect(page.getByText("Belege", { exact: true })).toHaveCount(0);
  });

  /**
   * Polish brief, page 5 — the brief's reviewer called step 1 a dead end.
   * The screen was a breadcrumb, a badge, a question, a field and a helper
   * line, and the only control on it said "Suchen", which reads as something
   * a page does rather than as the way through a flow.
   *
   * CHANGED: the step-1 submit label. It was "Suchen" / "Search" and is
   * "Weiter" / "Continue" now, with the arrow every other step's advance
   * carries. Searching *is* the advance on this step — a resolved place moves
   * the flow to step 2 by itself — so one label for one action beats two
   * words for the same press.
   */
  test("step 1 has an unmistakable way forward, a progress row and its reassurance", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const submit = page.locator('main button[type="submit"]');
    await expect(submit).toHaveCount(1);
    await expect(submit).toContainText("Weiter");

    await expect(page.getByRole("group", { name: "Schritt 1 von 3" })).toBeVisible();
    await expect(
      page.getByText("Drei Fragen, dann bist du drin. Keine E-Mail-Adresse nötig, solange du hier bist."),
    ).toBeVisible();

    // The band moved below the step and went tight: on step 1 it was the
    // largest thing on the screen after the question, offering three ways
    // out at the moment the visitor was about to start.
    const stepBottom = await page.locator("main section").first().evaluate((element) =>
      element.getBoundingClientRect().bottom,
    );
    const bandTop = await page.locator("#context-band").evaluate((element) =>
      element.getBoundingClientRect().top,
    );
    expect(bandTop).toBeGreaterThanOrEqual(stepBottom - 1);
  });

  /**
   * One action per step, and a step cannot be answered by pressing past it:
   * the radio group insists, in the browser, with no JavaScript.
   */
  test("steps 2 and 3 refuse an unanswered advance", async ({ page }) => {
    for (const [query, name] of [
      ["?ort=schlatkow", "wer"],
      ["?ort=schlatkow&wer=opt-1", "weg"],
    ] as const) {
      await page.goto(`${ROUTE}${query}`);
      const options = page.locator(`input[name="${name}"]`);
      expect(await options.count()).toBeGreaterThan(0);
      await expect(options.first()).toHaveAttribute("required", "");
      await expect(page.getByRole("button", { name: /Weiter/ })).toHaveCount(1);
    }
  });

  /**
   * The last screen reads finished — the website's part is over — without
   * claiming a registration it cannot confirm (D6, and TS-WEB-0023-A11 below).
   */
  test("the handover reads as the end of the flow, with every step marked done", async ({
    page,
  }) => {
    await page.goto(`${ROUTE}?ort=schlatkow&wer=opt-1&weg=whatsapp`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Geschafft");
    await expect(page.getByRole("group", { name: "Schritt 3 von 3" })).toBeVisible();
  });

  test("TS-WEB-0023-A2/A3/A7: walking the flow keeps state in the URL, survives reload and a fresh window, never in storage", async ({
    page,
    context,
  }) => {
    // A real history entry for step 1 first, so `goBack()` below has
    // somewhere to return to.
    await page.goto(ROUTE);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ort");

    // Arrives pre-answered, as if from /dein-ort/starten or /mitmachen (D5, A7).
    await page.goto(`${ROUTE}?ort=schlatkow`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veröffentlicht");
    expect(page.url()).toContain("ort=schlatkow");

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

  test("TS-WEB-0023-A2: a typed place name advances the flow, and the slug is what travels on", async ({
    page,
  }) => {
    // The plain GET form submits what was typed — the slug is a lookup away
    // (DEC-0128). What the criterion is about is that a *name* is answered at
    // all: before T-16 this field only accepted five digits.
    await page.goto(ROUTE);
    await page.fill('input[name="ort"]', "Wolfradshof");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/ort=Wolfradshof/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veröffentlicht");
    await expect(page.locator('[data-step-answered="ort"]')).toContainText("Wolfradshof");

    // And from here the URL carries the community slug, not the typed string:
    // step 2's own form is built from the resolved place (D3, D4).
    await page.click('input[name="wer"][value="opt-1"]');
    await page.click('button:has-text("Weiter")');
    await expect(page).toHaveURL(/ort=wolfradshof/);
    await expect(page).not.toHaveURL(/ort=Wolfradshof/);
  });

  test("TS-WEB-0023-A6: a municipality with several communities does not advance until one is chosen", async ({
    page,
  }) => {
    // `Groß Polzin` is a municipality of the committed index, not a community
    // slug, with several covered villages behind it (D3's "municipality hit").
    await page.goto(`${ROUTE}?ort=${encodeURIComponent("Groß Polzin")}`);

    // Still step 1: the flow may not pick a village on the visitor's behalf.
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ort");
    await expect(page.locator('[data-step-answered="ort"]')).toHaveCount(0);

    // Each candidate is a tappable row reading `Ort (Gemeinde)` (D3, D8).
    const candidates = page.getByRole("link", { name: /\(Groß Polzin\)$/u });
    await expect(candidates.first()).toBeVisible();
    expect(await candidates.count()).toBeGreaterThan(1);
    const chosen = candidates.first();

    // And the value taken from it is the community slug, which advances.
    await chosen.click();
    await expect(page).toHaveURL(/[?&]ort=[a-z0-9-]+(&|$)/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veröffentlicht");
  });

  test("TS-WEB-0023-A7: step 1 arrives answered — the place is named and changeable, never skipped", async ({
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
    await page.goto(`${ROUTE}?ort=schlatkow`);
    const answered = page.locator('[data-step-answered="ort"]');
    await expect(answered).toHaveCount(1);
    await expect(answered).toContainText("Schlatkow");

    const change = answered.locator("a");
    await expect(change).toHaveCount(1);
    await change.click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ort");
    // The answer travels back with it, so the visitor can correct rather than
    // retype (D4: `schritt` may move backwards to an answered step).
    await expect(page.locator('input[name="ort"]')).toHaveValue("schlatkow");

    // It stays visible through step 3 and the handover.
    for (const query of [
      "?ort=schlatkow&wer=opt-1",
      "?ort=schlatkow&wer=opt-1&weg=whatsapp",
    ]) {
      await page.goto(`${ROUTE}${query}`);
      await expect(page.locator('[data-step-answered="ort"]')).toContainText(
        "Schlatkow",
      );
    }
  });

  test("TS-WEB-0023-A4: an invalid `schritt` and an invalid enum are dropped, re-asking the step", async ({
    page,
  }) => {
    await page.goto(`${ROUTE}?ort=schlatkow&schritt=3`);
    // step 2 (who publishes) is unanswered, so schritt=3 must not be honoured.
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veröffentlicht");

    await page.goto(`${ROUTE}?ort=schlatkow&wer=not-a-real-option`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veröffentlicht");
  });

  test("TS-WEB-0023-A5: an unresolvable value leaves step 1 unanswered, echoed only in the search field", async ({
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

  test("TS-WEB-0023-A8: step 3 offers exactly three publishing paths", async ({ page }) => {
    await page.goto(`${ROUTE}?ort=schlatkow&wer=opt-1`);
    const options = page.locator('input[name="weg"]');
    await expect(options).toHaveCount(3);
  });

  test("TS-WEB-0023-A9/A10: completing all three steps offers exactly one external app action, firing register-as-publisher once", async ({
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
    await page.fill('input[name="ort"]', "schlatkow");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/ort=schlatkow/);

    await page.click('input[name="wer"][value="opt-1"]');
    await page.click('button:has-text("Weiter")');
    await expect(page).toHaveURL(/wer=opt-1/);

    await page.click('input[name="weg"][value="whatsapp"]');
    await page.click('button:has-text("Weiter")');
    await expect(page).toHaveURL(/weg=whatsapp/);

    // Hydration, not just the URL, has to be done before this click: it is
    // a client component's `onClick` (`ConversionTracker`) that fires the
    // event. Wait for the tracker's own signal, not for the network
    // (F-2-71): `networkidle` never settles on a streamed production route,
    // and a timeout would only move the race.
    await expect(
      page.locator('[data-conversion-tracker="register-as-publisher"]'),
    ).toHaveAttribute("data-hydrated", "true");
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

  test("TS-WEB-0023-A11: no step or the handover state shows a confirmation, instructions or an event field", async ({
    page,
  }) => {
    await page.goto(`${ROUTE}?ort=schlatkow&wer=opt-1&weg=whatsapp`);
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    expect(bodyText).not.toMatch(/bestätigung|erfolgreich registriert/);
    await expect(page.locator('input[type="date"], input[name="event"]')).toHaveCount(0);
  });

  test("TS-WEB-0023-A12: no envoy element, no POST route, no server action on this route", async ({
    page,
  }) => {
    const requests: string[] = [];
    page.on("request", (request) => {
      if (request.method() !== "GET") requests.push(`${request.method()} ${request.url()}`);
    });
    await page.goto(ROUTE);
    await page.fill('input[name="ort"]', "schlatkow");
    await page.click('button[type="submit"]');
    // The step advanced — that is the whole settle this assertion needs
    // (F-2-71: `networkidle` never settles on a streamed production route).
    await expect(page).toHaveURL(/ort=schlatkow/);
    await expect(page.locator("main")).toBeVisible();
    expect(requests).toEqual([]);
    // Scoped to `main`: the footer's own contact widget (`kind="contact"`)
    // is site-wide chrome present on every page, not this route's content.
    await expect(page.locator("main [data-envoy-form-kind]")).toHaveCount(0);
  });

  test("TS-WEB-0023-A13: every step is completable with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(ROUTE);
    // A typed **name**, not a slug and not a postcode: without JavaScript the
    // typeahead does not exist, so this is the only way through step 1 — and
    // it has to work (D8 "No-JS", DEC-0128).
    await page.fill('input[name="ort"]', "Wolfradshof");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/ort=Wolfradshof/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("veröffentlicht");
    await page.click('input[name="wer"][value="opt-1"]');
    await page.click('button:has-text("Weiter")');
    await expect(page).toHaveURL(/wer=opt-1/);
    await expect(page).toHaveURL(/ort=wolfradshof/);
    await page.click('input[name="weg"][value="whatsapp"]');
    await page.click('button:has-text("Weiter")');
    await expect(page.locator('[data-cta="primary"]')).toHaveAttribute("href", /^https:\/\/app\./);
    await context.close();
  });

  test("TS-WEB-0023-A14: every step URL canonicalises to the parameter-free path", async ({ page }) => {
    // The route's own indexability is not the environment-wide noindex
    // regime (TS-WEB-0015 D3 puts every non-production build behind `noindex`,
    // which this suite always runs under) — only the canonical claim is
    // testable outside production.
    await page.goto(`${ROUTE}?ort=schlatkow`);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toMatch(new RegExp(`${ROUTE}$`));
  });

  test("TS-WEB-0023-A15: the context band renders on step 1 and is absent on steps 2, 3 and the handover", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.locator("#context-band")).toHaveCount(1);

    await page.goto(`${ROUTE}?ort=schlatkow`);
    await expect(page.locator("#context-band")).toHaveCount(0);

    await page.goto(`${ROUTE}?ort=schlatkow&wer=opt-1`);
    await expect(page.locator("#context-band")).toHaveCount(0);

    await page.goto(`${ROUTE}?ort=schlatkow&wer=opt-1&weg=whatsapp`);
    await expect(page.locator("#context-band")).toHaveCount(0);
  });
});
