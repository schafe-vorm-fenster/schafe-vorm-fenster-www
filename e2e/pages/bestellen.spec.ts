import { expect, test } from "@playwright/test";

import { BRIEFING_URL } from "../../src/lib/live/briefing";

/**
 * TS-WEB-0025 — `/dein-kalender/bestellen`, walked through all four steps.
 *
 * Not-yet-M4: TS-WEB-0025-A5's full network-trace assertion (no ecosystem host
 * reachable) needs the real Portalize/envoy hosts wired to assert their
 * absence meaningfully; here it is checked as "no cross-origin request
 * fires on this flow" instead, which is the same claim against what exists
 * today. The live preview (D4) is deferred by DEC-0069 and is not tested
 * because it is not built.
 */

const ROUTE = "/dein-kalender/bestellen";

test.describe("TS-WEB-0025: the order flow", () => {
  /**
   * TS-WEB-0025-A2 / D5 — and since T-15 the exit is what D5 always said it
   * was: **"an in-page target, not an outbound link"**. It points at this
   * route's contact section, which the chrome renders once below the flow, and
   * the one outbound occurrence on the route is that section's first action
   * row (DEC-0081 §3, TS-WEB-0016-A5).
   *
   * The scope and the step ride along in the exit's query, because the section
   * is on this same document and a link that dropped them would take the
   * visitor out of the flow she is in (D8).
   */
  test("TS-WEB-0025-A2: the consult exit is visible on every step, resolves in-page, and never loads a Google script", async ({
    page,
  }) => {
    for (const query of [
      "",
      "?orte=schlatkow",
      "?orte=schlatkow&schritt=3",
      "?orte=schlatkow&schritt=4",
    ]) {
      await page.goto(`${ROUTE}${query}`);
      const exit = page.getByRole("link", { name: "Beratungstermin buchen" });
      await expect(exit, query).toBeVisible();
      const href = await exit.getAttribute("href");
      expect(href, query).toMatch(/^\/dein-kalender\/bestellen(\?[^#]*)?#kontakt$/);
      // It carries no outbound marking, because nothing outbound happens.
      await expect(exit, query).not.toContainText(/Google|neuen Tab/);
      // D5's "an exit, never a button": the quiet control stands at the 44 px
      // `--height-control`, not at the step's advance height. `Button`'s size
      // defaults to the primary's 56 px, which is what made the way out look
      // like the way on once (review round, T-15).
      const exitBox = await exit.boundingBox();
      expect(exitBox?.height, query).toBeLessThanOrEqual(48);

      // The section's first action row is the only element with the booking URL.
      await expect(page.locator(`a[href="${BRIEFING_URL}"]`), query).toHaveCount(1);
      await expect(
        page.locator(
          `section#kontakt[data-contact-section] a[data-channel="appointment"][href="${BRIEFING_URL}"]`,
        ),
        query,
      ).toHaveCount(1);

      // A2's "no step loads a Google script, iframe or font": asked of **every**
      // step, inside the loop. It stood after the loop closed once, which only
      // ever measured the last query (review round, T-15).
      await expect(
        page.locator('script[src*="google"], iframe[src*="google"], link[href*="fonts.g"]'),
        query,
      ).toHaveCount(0);
    }
  });

  test("TS-WEB-0025-A3: ticking places updates the visible chip list and its count each time", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    // CHANGED (polish brief, page 7, item 3/4): the count used to read "0
    // Orte ausgewählt" under the picker, two lines below the picker's own
    // "Noch keine Auswahl." — the brief counted three statements
    // contradicting each other inside 120 px. The count lives in the summary
    // strip now and says nothing at zero, where the picker's empty state is
    // the one statement; and "1 Orte" is not German, so it counts properly.
    await expect(page.getByText(/Orte ausgewählt/)).toHaveCount(0);
    await expect(page.getByText("Noch keine Auswahl.")).toBeVisible();
    await page.fill('input[name="ort"]', "17495");
    await page.click('button[type="submit"]');
    await page.getByText(/^\+ /).first().click();
    await expect(page.getByText("1 Ort ausgewählt")).toBeVisible();
  });

  /**
   * Polish brief, page 7, items 1–3 — the step had no way on at all until a
   * scope existed, no sense of how long the flow is, and no price anywhere,
   * so someone arriving from the 480 € tier card lost the number that made
   * her click.
   */
  test("every step carries the progress row, the price strip and a visible Weiter", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.getByRole("group", { name: "Schritt 1 von 4" })).toBeVisible();
    await expect(page.getByText("480 € / Jahr, zzgl. USt.")).toBeVisible();
    await expect(page.getByText("Der Preis ändert sich mit der Auswahl nicht.")).toBeVisible();

    // Present and disabled, with the reason beside it — not absent.
    const advance = page.getByRole("button", { name: "Weiter" });
    await expect(advance).toBeDisabled();
    await expect(
      page.getByText("Wähl mindestens einen Ort oder den ganzen Landkreis, dann geht es weiter."),
    ).toBeVisible();

    await page.goto(`${ROUTE}?orte=schlatkow`);
    await expect(page.getByRole("link", { name: /Weiter/ })).toBeEnabled();
  });

  test("TS-WEB-0025-A4: with no place selected, step 3 is unreachable — neither by CTA nor by editing schritt=3", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.getByText("Noch keine Auswahl.")).toBeVisible();
    // The advance is on the screen but disabled, so it carries no conversion
    // marker and cannot be followed (brief, page 7, item 1).
    await expect(page.locator('[data-cta="primary"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Weiter" })).toBeDisabled();

    await page.goto(`${ROUTE}?schritt=3`);
    await expect(page.getByText("Noch keine Auswahl.")).toBeVisible();

    await page.goto(`${ROUTE}?kreis=vorpommern-greifswald`);
    await expect(
      page.getByText("Vorpommern-Greifswald (ganzer Landkreis)").first(),
    ).toBeVisible();
    await expect(page.getByText("Noch keine Auswahl.")).toHaveCount(0);
  });

  test("TS-WEB-0025-A6: no payment field anywhere in the flow; step 4 is reached with no payment interaction", async ({
    page,
  }) => {
    for (const query of [
      "?orte=schlatkow",
      "?orte=schlatkow&schritt=3",
      "?orte=schlatkow&schritt=4",
    ]) {
      await page.goto(`${ROUTE}${query}`);
      await expect(page.locator('input[type="text"][name*="card" i], input[name*="iban" i]')).toHaveCount(0);
    }
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Einbindungscode");
  });

  test("TS-WEB-0025-A7: step 4 shows the embed code as selectable text with a copy control, no pending-payment state", async ({
    page,
  }) => {
    await page.goto(`${ROUTE}?orte=schlatkow&schritt=4`);
    await expect(page.locator("pre code")).toContainText("portalize.schafe-vorm-fenster.de");
    await expect(page.getByRole("button", { name: /kopieren/i })).toBeVisible();
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    expect(bodyText).not.toMatch(/pending payment|zahlung ausstehend/);
  });

  test("TS-WEB-0025-A8: reload on step 2 restores scope from the URL; reload on step 3 keeps scope, empties invoice fields, no storage used", async ({
    page,
  }) => {
    await page.goto(`${ROUTE}?orte=schlatkow`);
    await page.reload();
    await expect(page.getByText("1 Ort ausgewählt")).toBeVisible();

    await page.goto(`${ROUTE}?orte=schlatkow&schritt=3`);
    await page.fill('input[id*="authority"]', "Testverwaltung");
    await page.reload();
    await expect(page.locator('input[id*="authority"]')).toHaveValue("");
    await expect(page.getByText("Deine Auswahl an Orten ist erhalten geblieben.")).toBeVisible();

    const storage = await page.evaluate(() => ({
      cookie: document.cookie,
      local: window.localStorage.length,
      session: window.sessionStorage.length,
    }));
    expect(storage).toEqual({ cookie: "", local: 0, session: 0 });
  });

  test("TS-WEB-0025-A10: every step URL is noindex, follow", async ({ page }) => {
    for (const query of ["", "?orte=schlatkow&schritt=3", "?orte=schlatkow&schritt=4"]) {
      const response = await page.goto(`${ROUTE}${query}`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      // The X-Robots-Tag response header is proxy.ts's job (see page.tsx
      // docblock) — not asserted here; open point for the security/proxy
      // owner to add this route to its noindex path list.
      void response;
    }
  });

  test("TS-WEB-0025-A11: buy-calendar-licence fires exactly once, only when step 4 shows a code", async ({
    page,
  }) => {
    const consoleMessages: string[] = [];
    page.on("console", (message) => consoleMessages.push(message.text()));

    await page.goto(`${ROUTE}?orte=schlatkow&schritt=3`);
    await page.waitForTimeout(500);
    expect(consoleMessages.some((text) => text.includes("buy-calendar-licence"))).toBe(false);

    await page.goto(`${ROUTE}?orte=schlatkow&schritt=4`);
    await page.waitForTimeout(500);
    const fires = consoleMessages.filter(
      (text) => text.includes("buy-calendar-licence") && text.includes("completed"),
    );
    expect(fires).toHaveLength(1);
  });

  /**
   * F-2-60 / TS-WEB-0012-A5 — "client-side navigation back and forth does not
   * replay it". The step-4 completion used to fire again on the forward
   * navigation, because `FireConversionOnMount` re-mounted and its `useRef`
   * guard went with the unmount.
   */
  test("F-2-60 / TS-WEB-0012-A5: Back and Forward through step 4 does not replay the completion", async ({
    page,
  }) => {
    const fires: string[] = [];
    page.on("console", (message) => {
      if (message.text().includes("buy-calendar-licence") && message.text().includes("completed")) {
        fires.push(message.text());
      }
    });

    await page.goto(`${ROUTE}?orte=schlatkow&schritt=3`);
    await invoiceReady(page);
    await fillInvoice(page);
    await page.locator('[data-cta="primary"]').click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Einbindungscode");
    await page.waitForTimeout(400);
    expect(fires).toHaveLength(1);

    await page.goBack();
    await page.waitForTimeout(300);
    await page.goForward();
    await page.waitForTimeout(600);
    await expect(page.locator("pre code")).not.toBeEmpty();
    expect(fires, "the forward navigation replayed the completion").toHaveLength(1);
  });

  test("TS-WEB-0025-A14: with the envoy script blocked, step 3 renders the static fallback, never a spinner", async ({
    page,
  }) => {
    /*
     * Half of A14, and the half says which. The mocked `envoy-form-mount`
     * loads no external script at all, so there is nothing for this test to
     * block, and the `empty`/`degraded` branch that renders the fallback is
     * not reachable from the page: `state` is hard-coded `mocked` until the
     * envoy widget is delivered (Q-0022, `state/open.md` rows 7 and 266), and
     * no toggle exists. Row 266 is the gap's home: it says which half of each
     * A14 is discharged and what the browser half waits for. What is asserted here is the shipped branch — the full
     * form, no spinner, no empty slot — which is what the mock rule requires
     * meanwhile.
     *
     * The fallback's own markup, including the consult exit into this route's
     * contact section that this spec's A14 and A14 of TS-WEB-0016 name (spelled
     * out, because `check:specs` scans test files for bare ids and a comment
     * would otherwise discharge a criterion no test asserts), is asserted in
     * `src/components/lead-fallback/lead-fallback.test.tsx`; the page passes
     * it `briefingHref`/`briefingLabel` at `page.tsx`'s step-3 mount. The
     * browser walk of the degraded state arrives with the widget.
     */
    await page.goto(`${ROUTE}?orte=schlatkow&schritt=3`);
    await expect(page.locator('[data-envoy-form-kind="order-invoice"]')).toBeVisible();
    await expect(page.locator(".skeleton, [aria-busy='true']")).toHaveCount(0);
  });

  /**
   * The invoice step's own messages and its pending word belong to the
   * hydrated form; a press before hydration is the browser's own submission,
   * which is correct but says its own things. Every assertion about the
   * enhanced behaviour waits for the fact rather than for a proxy of it
   * (F-2-71).
   */
  async function invoiceReady(page: import("@playwright/test").Page) {
    await expect(page.locator('[data-envoy-form-kind="order-invoice"]')).toHaveAttribute(
      "data-envoy-hydrated",
      "true",
    );
  }

  /** The four required invoice fields of TS-WEB-0025 D6, as a real order fills them. */
  async function fillInvoice(page: import("@playwright/test").Page) {
    await page.fill('input[id$="authority"]', "Gemeinde Schlatkow");
    await page.fill('textarea[id$="address"]', "Dorfstraße 1, 17390 Schlatkow");
    await page.fill('input[id$="contact"]', "A. Beispielperson");
    await page.fill('input[id$="email"]', "amt@schlatkow.example");
  }

  test("walks the full flow end to end to its confirmation", async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Bereich");

    await page.fill('input[name="ort"]', "17495");
    await page.click('button[type="submit"]');
    await page.getByText(/^\+ /).first().click();
    await expect(page.getByText("1 Ort ausgewählt")).toBeVisible();

    await page.locator('[data-cta="primary"]').click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Rechnung");
    await invoiceReady(page);

    // CHANGED (the brief's own "validation that helps"): the step used to
    // advance on an empty invoice, because its "Weiter" was a link standing
    // beside the form rather than the form's own submit. It is the submit
    // now, and the four required fields have to be answered first.
    await fillInvoice(page);
    await page.locator('[data-cta="primary"]').click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Einbindungscode");
    await expect(page.getByText("Die Bestellung ist aufgenommen.")).toBeVisible();
    await expect(page.locator("pre code")).not.toBeEmpty();
  });

  /**
   * The defect the brief and the task both name: "the quote/order forms
   * currently accept an empty invoice". A public authority could reach the
   * embed code without naming itself, its address, a contact or an email.
   */
  test("an empty invoice does not advance, and each open field says so", async ({ page }) => {
    await page.goto(`${ROUTE}?orte=schlatkow&schritt=3`);
    await invoiceReady(page);
    await page.locator('[data-cta="primary"]').click();

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Rechnung");
    await expect(page.getByText("4 Felder fehlen noch. Sie sind unten markiert.")).toBeVisible();
    await expect(page.getByText("Dieses Feld brauchen wir noch.")).toHaveCount(4);
    await expect(page.locator('[aria-invalid="true"]')).toHaveCount(4);

    // A message stops being shown the moment it stops being true.
    await page.fill('input[id$="authority"]', "Gemeinde Schlatkow");
    await expect(page.getByText("Dieses Feld brauchen wir noch.")).toHaveCount(3);

    // And an address that cannot be an address is named as such.
    await page.fill('input[id$="email"]', "amt-at-schlatkow");
    await page.locator('[data-cta="primary"]').click();
    await expect(
      page.getByText("Diese Adresse sieht unvollständig aus — sie braucht ein @ und eine Domain."),
    ).toBeVisible();
  });

  /**
   * F-2-51 — until round 3 this step rendered the mount's inert "Absenden"
   * beside a `data-cta="primary"` "Weiter" link, and the button a visitor
   * filling in invoice details reaches for was the one that did nothing.
   */
  test("F-2-51 / TS-WEB-0006 D3: step 3 offers exactly one call to action, and it advances", async ({
    page,
  }) => {
    await page.goto(`${ROUTE}?orte=schlatkow&schritt=3`);
    await invoiceReady(page);

    // Exactly one control that reads as an action: the step's own advance.
    const primary = page.locator('[data-cta="primary"]');
    await expect(primary).toHaveCount(1);

    // CHANGED: that one control is now the **form's own** submit rather than
    // a link beside it. F-2-51's finding was "two calls to action, and the
    // one a visitor reaches for does nothing"; the answer then was to drop
    // the form's submit, which left the link advancing past an unfilled
    // invoice. One control, inside the form, is the answer to both.
    await expect(page.locator('[data-envoy-form-kind="order-invoice"] button')).toHaveCount(1);
    await expect(primary).toHaveAttribute("type", "submit");

    await fillInvoice(page);
    await primary.click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Einbindungscode");
  });

  /**
   * The step's one control is a form submit, so the step still works with no
   * JavaScript at all: the form posts itself to the next step as a plain GET
   * carrying the flow's parameters — and only the flow's parameters, because
   * no visible field has a `name`. The browser's own `required` handling is
   * what refuses an empty invoice there.
   */
  test("step 3 advances, and refuses an empty invoice, with JavaScript disabled", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${ROUTE}?orte=schlatkow&schritt=3`);

    // Empty: the browser refuses, so the step does not change.
    await page.locator('[data-cta="primary"]').click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Rechnung");

    await fillInvoice(page);
    await page.locator('[data-cta="primary"]').click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Einbindungscode");
    // The scope travelled; nothing a visitor typed did.
    expect(page.url()).toContain("orte=schlatkow");
    expect(page.url()).not.toContain("Schlatkow");
    expect(page.url()).not.toMatch(/Beispielperson|example/i);
    await context.close();
  });

  /**
   * F-2-67 — a hasty reload straight after the advance used to land back on
   * step 3 with the click silently swallowed: the in-flight client-side
   * history push was discarded before the URL updated. The step's advance is
   * a real form navigation now, so there is no in-flight transition to lose.
   */
  test("F-2-67: a swallowed advance is visible, not silent", async ({ page }) => {
    // The route is dynamic and un-prefetched, so the transition has a real
    // pending window — the one the hasty clicker reloads inside. The control
    // the visitor pressed says so while it lasts.
    await page.route(/schritt=4/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await route.continue();
    });
    await page.goto(`${ROUTE}?orte=schlatkow&schritt=3`);

    await invoiceReady(page);
    await fillInvoice(page);
    const primary = page.locator('[data-cta="primary"]');
    await primary.click();
    await expect(primary.locator('[role="status"]')).toBeAttached();

    // And the advance itself still completes when nothing interrupts it.
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Einbindungscode");
  });
});
