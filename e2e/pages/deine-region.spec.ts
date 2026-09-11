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

  test.skip(
    "TS-026-A13: submitting the form fires exactly one request-licence-quote event — not-yet-M4, no analytics wiring or real widget submission target exists in this run (state/open.md)",
    () => {},
  );
});
