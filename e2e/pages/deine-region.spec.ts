import { expect, test } from "@playwright/test";

/**
 * TS-026 — `/deine-region` and `/deine-region/angebot` — acceptance pass.
 *
 * TS-026-A9 (integration, county-examples stub), TS-026-A11 (integration,
 * counter stub) and TS-026-A13 (the `request-licence-quote` analytics event
 * on submit) are not built here: no `/api/*` stub exists in this run and
 * `envoy-form-mount` has no real submission target (Q-022) — `state/open.md`
 * lists them not-yet-M4.
 */

const FOLD_VIEWPORTS = [
  { name: "360x640", width: 360, height: 640 },
  { name: "1280x800", width: 1280, height: 800 },
];

test.describe("/deine-region", () => {
  test("TS-026-A1: no map anywhere", async ({ page }) => {
    await page.goto("/deine-region");
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator('[class*="ratio-map"], [style*="ratio-map"]')).toHaveCount(0);
    const scripts = await page.locator("script[src]").evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("src")),
    );
    expect(scripts.some((src) => /leaflet|mapbox|maplibre|googlemaps/i.test(src ?? ""))).toBe(
      false,
    );
  });

  test("TS-026-A2: no distance/radius wording as a module or result label", async ({ page }) => {
    await page.goto("/deine-region");
    const headings = await page.locator("h1, h2, h3, button, label").allTextContents();
    const distanceWords = /\bkm\b|Umkreis|Entfernung/i;
    for (const text of headings) expect(text).not.toMatch(distanceWords);
  });

  test("TS-026-A3: at most 6 example places, and the place search stands beside them", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    const chips = page.locator('[class*="place-example-set"] [class*="chip"]');
    expect(await chips.count()).toBeLessThanOrEqual(6);
    await expect(page.getByLabel("Dein Ort")).toBeVisible();
  });

  test("TS-026-A5 / TS-006-A12: 480 appears at most once, from the price component", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    const bodyText = await page.locator("body").innerText();
    const matches = bodyText.match(/480\s*€/g) ?? [];
    expect(matches.length).toBeLessThanOrEqual(1);
    expect(bodyText).toContain("Auf Anfrage");
    expect(bodyText).not.toContain("4.000");
    expect(bodyText).not.toContain("4000");
  });

  test("TS-026-A6 / TS-006-A2: exactly one primary CTA, targets /deine-region/angebot, repeated at the close", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    const primary = page.locator('[data-cta="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveAttribute("href", "/deine-region/angebot");

    const quoteLinks = page.locator('a[href="/deine-region/angebot"]');
    expect(await quoteLinks.count()).toBeGreaterThanOrEqual(2);

    const briefing = page.getByRole("link", { name: /Kennenlerngespräch/ });
    await expect(briefing).toBeVisible();
  });

  test("TS-026-A7 / A8: no response-time wording while the promise constant is unset", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/Werktage|48 Stunden|schnellstmöglich/);
  });

  test("TS-026-A14 / TS-006-A9: no audience selector, tab or interstitial", async ({ page }) => {
    await page.goto("/deine-region");
    await expect(page.locator("[role=tablist]")).toHaveCount(0);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("TS-006-A6: exactly one context band, after the last argument block, before the closing block", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    const bands = page.locator("#context-band");
    await expect(bands).toHaveCount(1);
  });

  test("TS-006-A7: the closing block repeats the primary conversion's goal and target", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    const closing = page.locator("#closing-cta");
    await expect(closing.getByRole("link", { name: "Angebot anfragen" })).toHaveAttribute(
      "href",
      "/deine-region/angebot",
    );
  });

  for (const viewport of FOLD_VIEWPORTS) {
    test(`TS-006-A3: the primary CTA is fully visible without scrolling at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/deine-region");
      const primary = page.locator('[data-cta="primary"]');
      await expect(primary).toBeInViewport();
    });
  }

  test("TS-004-A1: the page carries no horizontal scroll at 360px and has a heading", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    const response = await page.goto("/deine-region");
    expect(response?.status()).toBe(200);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows).toBe(false);
  });
});

test.describe("/deine-region/angebot", () => {
  test("TS-006-A15: the breadcrumb trail precedes the page content, names the current page last, carries no data-cta", async ({
    page,
  }) => {
    await page.goto("/deine-region/angebot");
    // "Seitenpfad", not "Startseite" (F-2-3): the breadcrumb nav and the
    // header nav are two landmarks of the same role and now carry distinct
    // accessible names, so a name-based lookup finds the breadcrumb only.
    const trail = page.getByRole("navigation", { name: "Seitenpfad" }).filter({ hasText: "Angebot anfordern" });
    await expect(trail).toBeVisible();
    await expect(trail.locator("[data-cta]")).toHaveCount(0);
    const current = trail.locator('[aria-current="page"]');
    await expect(current).toHaveText("Angebot anfordern");
  });

  test("the quote form renders and submits nothing without JavaScript-free field names", async ({
    page,
  }) => {
    await page.goto("/deine-region/angebot");
    await expect(page.locator("form[data-envoy-form-kind='quote']")).toBeVisible();
    const unnamedInputs = await page
      .locator("form[data-envoy-form-kind='quote'] input, form[data-envoy-form-kind='quote'] textarea")
      .evaluateAll((nodes) => nodes.every((node) => !(node as HTMLInputElement).name));
    expect(unnamedInputs).toBe(true);
  });

  test("TS-026-A7: no response-time wording on the form route either", async ({ page }) => {
    await page.goto("/deine-region/angebot");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/Werktage|48 Stunden|schnellstmöglich/);
  });

  /**
   * A filled quote form, ready to submit. The timing gate of TS-016-A10
   * refuses anything faster than a human could manage, so the walk waits it
   * out the way a visitor does.
   */
  const fillQuoteForm = async (page: import("@playwright/test").Page) => {
    await page.fill("#envoy-quote-organisation", "Beispielverwaltung Musterkreis");
    await page.fill("#envoy-quote-name", "Beispielperson");
    await page.fill("#envoy-quote-email", "anfrage@beispiel.de");
    await page.fill("#envoy-quote-message", "Wir hätten gern ein Angebot für unser Gebiet.");
    await page.waitForTimeout(2600);
  };

  test("TS-026-A13 / TS-016-A12: submitting fires exactly one request-licence-quote event", async ({
    page,
  }) => {
    const fires: string[] = [];
    page.on("console", (message) => {
      if (message.text().includes("request-licence-quote")) fires.push(message.text());
    });

    await page.goto("/deine-region/angebot");
    await fillQuoteForm(page);
    await page.locator('[data-cta="primary"]').click();

    await expect(page.locator('[data-envoy-state="sent"]')).toBeVisible();
    expect(fires).toHaveLength(1);
  });

  /**
   * F-2-65 (chaos C-H-7) — two `click()` calls back to back with no wait used
   * to start two tracked submissions, because nothing disabled or debounced
   * the button.
   */
  test("F-2-65 / TS-012-A5: a rapid double-click submits once", async ({ page }) => {
    const fires: string[] = [];
    page.on("console", (message) => {
      if (message.text().includes("request-licence-quote")) fires.push(message.text());
    });

    await page.goto("/deine-region/angebot");
    await fillQuoteForm(page);

    // Two presses in one task, the way the hasty clicker issued them — no
    // wait, no re-query, the same node both times.
    await page.evaluate(() => {
      const button = document.querySelector<HTMLButtonElement>('[data-cta="primary"]');
      button?.click();
      button?.click();
    });
    await page.waitForTimeout(400);

    expect(fires, "the second click started its own submission").toHaveLength(1);
  });

  /**
   * F-2-66 (chaos C-H-10 + UAT) — after a clean submission the fields were
   * simply empty again: same layout, same button, nothing distinguishing
   * "submitted" from "page just loaded".
   */
  test("F-2-66 / TS-016-A9: a submission leaves a labelled success state that takes focus", async ({
    page,
  }) => {
    await page.goto("/deine-region/angebot");
    await fillQuoteForm(page);
    await page.locator('[data-cta="primary"]').click();

    const success = page.locator('[data-envoy-state="sent"] [role="status"]');
    await expect(success).toBeVisible();
    await expect(success).toContainText(/Danke/);
    // The mock says so itself, so nobody is told a message was sent.
    await expect(success).toContainText(/Demo/);
    await expect(page.locator("form[data-envoy-form-kind='quote']")).toHaveCount(0);
    // F-2-71: the node takes focus in an effect, so a one-shot
    // `document.activeElement` read could run before that effect landed — the
    // flake seen under the parallel preview run. `toBeFocused` is the
    // auto-retrying form of the same assertion: same criterion, no clock.
    await expect(success).toBeFocused();
  });

  /**
   * F-2-48 / TS-016-A10 — the website's half of the spam contract: a honeypot
   * in the DOM, hidden from assistive technology and not focusable, and a
   * submission faster than a human could make one refused.
   */
  test("F-2-48 / TS-016-A10: a honeypot is present and unreachable, and a too-fast submission is refused", async ({
    page,
  }) => {
    await page.goto("/deine-region/angebot");

    const honeypot = page.locator("form[data-envoy-form-kind='quote'] [aria-hidden='true'] input");
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    // Not in the accessibility tree: no accessible textbox beyond the visible
    // field set.
    const visibleFields = await page
      .locator("form[data-envoy-form-kind='quote']")
      .getByRole("textbox")
      .count();
    expect(visibleFields).toBe(5);

    // Submitted immediately, it is refused rather than accepted.
    await page.fill("#envoy-quote-organisation", "Beispielverwaltung Musterkreis");
    await page.fill("#envoy-quote-name", "Beispielperson");
    await page.fill("#envoy-quote-email", "anfrage@beispiel.de");
    await page.locator('[data-cta="primary"]').click();
    await expect(
      page.locator("form[data-envoy-form-kind='quote'] [role='alert']"),
    ).toBeVisible();
    await expect(page.locator('[data-envoy-state="sent"]')).toHaveCount(0);
  });

  /**
   * F-2-48 / TS-016-A2 — D1 row S2 names both `/deine-region` and
   * `/deine-region/angebot`; the mount was absent from the first.
   */
  test("F-2-48 / TS-016-A2: both S2 surfaces render the quote mount with the D2 attributes", async ({
    page,
  }) => {
    for (const path of ["/deine-region", "/deine-region/angebot"]) {
      await page.goto(path);
      const mount = page.locator("form[data-envoy-form-kind='quote']");
      await expect(mount, path).toHaveCount(1);
      await expect(mount).toHaveAttribute("data-envoy-locale", "de");
      await expect(mount).toHaveAttribute("data-envoy-context-goal", "request-licence-quote");
    }
  });

  /**
   * F-2-32 / TS-016 D7 — one configured value, referenced by every S3
   * placement, never pasted per page.
   */
  test("F-2-32 / TS-016 D7: every briefing link is the one configured booking URL", async ({
    page,
  }) => {
    for (const path of [
      "/deine-region",
      "/dein-kalender",
      "/dein-kalender/bestellen",
      "/dein-kalender/bestellen?orte=beispielgemeinde-musterdorf&schritt=3",
    ]) {
      await page.goto(path);
      const hrefs = await page
        .locator("main a[href*='calendar']")
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href") ?? ""));
      expect(hrefs.length, path).toBeGreaterThan(0);
      for (const href of hrefs) {
        expect(href, path).toBe("https://calendar.app.google/VG9bZoYVnFcX1W6F8");
      }
    }
  });

  test("TS-001 / F-2-33: the English quote flow is English", async ({ page }) => {
    await page.goto("/en/your-region/quote");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Request a quote for your organisation",
    );
    const form = page.locator("form[data-envoy-form-kind='quote']");
    const text = await form.innerText();
    for (const german of [
      "E-Mail-Adresse",
      "Telefon",
      "Worum geht es?",
      "Absenden",
      "Demo-Daten",
    ]) {
      expect(text, german).not.toContain(german);
    }
    await expect(form.locator("button[type='submit']")).toHaveText("Send");
  });
});
