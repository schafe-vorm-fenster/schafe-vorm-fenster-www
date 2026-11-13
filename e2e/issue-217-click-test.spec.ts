import { expect, test } from "@playwright/test";

import { href, ROUTE_IDS } from "../src/lib/routes/routes";

/**
 * Issue 217 — the four findings of the pre-launch click test.
 *
 * 1. no German UI string on an English page;
 * 2. the 404 carries the site chrome and a way home, in both languages;
 * 3. a German slug under `/en` redirects (308) to the English slug;
 * 4. the registration iframe is centred in its column.
 */

/** UI strings that are German and must never appear on an `/en` page. */
const GERMAN_UI_STRINGS = [
  "Noch keine Auswahl",
  "Füge oben Orte",
  "ganzer Landkreis",
  "Orte ausgewählt",
  "Demo-Daten",
  "Foto gesucht",
  "Zum Inhalt springen",
  "Seite nicht gefunden",
  "Zurück zur Startseite",
];

test.describe("issue 217 / 1: no German UI string on an English page", () => {
  for (const route of ROUTE_IDS) {
    const path = href(route, "en");
    test(`${path} carries none of the known German UI strings`, async ({ page }) => {
      await page.goto(path);
      const text = await page.locator("body").innerText();
      for (const german of GERMAN_UI_STRINGS) {
        expect(text, `"${german}" on ${path}`).not.toContain(german);
      }
    });
  }

  test("the order page's empty and selected scope states are English", async ({ page }) => {
    await page.goto("/en/your-calendar/order");
    await expect(page.getByText("Nothing selected yet.")).toBeVisible();
    await expect(page.getByText("Add places or a postcode above.")).toBeVisible();

    await page.goto("/en/your-calendar/order?kreis=vorpommern-greifswald");
    const text = await page.locator("body").innerText();
    expect(text).toContain("whole district");
    for (const german of GERMAN_UI_STRINGS) expect(text).not.toContain(german);
  });
});

test.describe("issue 217 / 2: the 404 carries the site chrome", () => {
  const CASES = [
    { path: "/dies-gibt-es-nicht-xyz", lang: "de", home: "/" },
    { path: "/en/does-not-exist", lang: "en", home: "/en" },
  ] as const;

  for (const { path, lang, home } of CASES) {
    test(`${path} has header, footer and a link home (${lang})`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("header")).toHaveCount(1);
      await expect(page.locator("footer")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);
      await expect(page.locator("main#main h1")).toHaveCount(1);
      await expect(page.locator(`header a[href="${home}"]`).first()).toBeVisible();
      await expect(page.locator(`main#main a[href="${home}"]`).first()).toBeVisible();
    });
  }
});

test.describe("issue 217 / 3: German slugs under /en redirect to the English slug", () => {
  const CASES: ReadonlyArray<readonly [string, string]> = [
    ["/en/dein-ort", "/en/your-place"],
    ["/en/dein-ort/starten", "/en/your-place/start"],
    ["/en/mitmachen", "/en/take-part"],
    ["/en/dein-kalender/bestellen", "/en/your-calendar/order"],
    ["/en/ueber-uns/archiv", "/en/about/archive"],
  ];
  for (const [from, to] of CASES) {
    test(`${from} -> ${to}`, async ({ request }) => {
      const response = await request.get(from, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(response.headers()["location"]!.replace(/^https?:\/\/localhost:\d+/, "")).toBe(to);
    });
  }

  test("the English slug and the German page stay live", async ({ request }) => {
    expect((await request.get("/en/your-place", { maxRedirects: 0 })).status()).toBe(200);
    expect((await request.get("/dein-ort", { maxRedirects: 0 })).status()).toBe(200);
  });
});

test("issue 217 / 4: the registration iframe is centred in its column", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/mitmachen/registrieren");
  const frame = page.locator("iframe[data-register-form]");
  await expect(frame).toHaveCount(1);
  const frameBox = (await frame.boundingBox())!;
  const parentBox = (await frame.locator("xpath=..").boundingBox())!;
  const left = frameBox.x - parentBox.x;
  const right = parentBox.x + parentBox.width - (frameBox.x + frameBox.width);
  expect(Math.abs(left - right)).toBeLessThanOrEqual(1);
});
