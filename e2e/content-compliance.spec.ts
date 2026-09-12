import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * Content compliance — `plan/gate-2-scope.md` §1.3 and the dummy-content rule.
 *
 * F-2-35: internal ticket, decision and spec identifiers were rendered as
 * visitor copy on 24/24 routes — "Demo-Daten — es wird nichts verschickt,
 * solange **Q-020** offen ist" in the footer of every page, "(kein
 * Textproblem, **TS-007 D12**)" on `/ueber-uns`, "**TS-029 Open Point #1**"
 * and "**DEC-027**" on `/rechtliches`. F-2-31 added the 404's own
 * "[Platzhalter M2 — … DEC-032.]".
 *
 * The grep is the instrument, not the fix: it walks every route in both
 * languages, strips the markup, and fails on the id shapes the repository
 * uses. `pnpm check:*` cannot see this — the identifiers are legal content
 * *in* the artefacts' own prose and only a defect once rendered.
 */

/** The id shapes this repository uses. Word-bounded, so prose is not caught. */
const INTERNAL_IDS = [
  /\bTS-0\d{2}\b/,
  /\bDEC-0\d{2}\b/,
  /\bQ-0\d{2}\b/,
  /\bWEB-[A-Z]-?\d/,
  /\bWEB-Q-\d/,
  /\bSRC-0\d{2}\b/,
  /\[Platzhalter/i,
  /\[Placeholder/i,
  /\bF-\d-\d{1,2}\b/,
  // F-2-73: geo-api's own identifiers are internal ids too. `/en/your-region`
  // rendered "examples from geoname.900001" as a heading — the German twin
  // had been fixed (F-2-63) and the English one had not.
  /\bgeoname\./,
  /state\/open\.md/,
  /plan\/guardrails\.md/,
];

const ROUTES = everyRoute().map(({ route, locale }) => ({
  path: href(route, locale),
  route,
  locale,
}));

/** The rendered text a visitor can actually read. */
const visibleText = `(() => {
  const body = document.body.cloneNode(true);
  for (const drop of body.querySelectorAll("script, style, template, noscript")) drop.remove();
  return body.innerText ?? body.textContent ?? "";
})()`;

for (const { path, route, locale } of ROUTES) {
  test(`content compliance: ${path} (${route}/${locale}) renders no internal identifier`, async ({
    page,
  }) => {
    await page.goto(path);
    const text = (await page.evaluate(visibleText)) as string;

    for (const pattern of INTERNAL_IDS) {
      const hit = pattern.exec(text);
      expect(
        hit,
        hit === null
          ? ""
          : `${path} renders "${hit[0]}": …${text.slice(Math.max(0, hit.index - 90), hit.index + 90)}…`,
      ).toBeNull();
    }
  });
}

/**
 * F-2-31 / TS-004-A4 — "404 renders place search + jobs band with status 404
 * and `noindex`". The routing tests assert the status, the robots value and
 * the heading; neither clause the criterion is actually about was asserted
 * anywhere, which is why a green suite hid a page whose body was a developer
 * note and whose two required modules were a dashed placeholder box.
 */
test("F-2-31 / TS-004-A4: the 404 carries the place search and the jobs band", async ({
  page,
}) => {
  const response = await page.goto("/dies-gibt-es-nicht");
  expect(response?.status()).toBe(404);

  // The place search, as the dominant element and as a plain GET form to the
  // reader's page — the same component and the same target as everywhere.
  const search = page.locator("#place-search form");
  await expect(search).toHaveCount(1);
  await expect(search).toHaveAttribute("action", "/dein-ort");
  await expect(search).toHaveAttribute("method", "get");
  await expect(page.locator('#place-search [data-cta="primary"]')).toHaveCount(1);

  // The jobs band: all four jobs, since a 404 has no focus job to subtract.
  const band = page.locator("#context-band nav");
  await expect(band).toHaveCount(1);
  await expect(band.locator("a")).toHaveCount(4);

  // No placeholder box, and `noindex` still holds.
  await expect(page.locator("[data-placeholder]")).toHaveCount(0);
  // Next.js emits its own `noindex` for a 404 response; the page adds the
  // `follow` half of DEC-032, so both tags stand.
  const robots = await page
    .locator('meta[name="robots"]')
    .evaluateAll((tags) => tags.map((tag) => tag.getAttribute("content") ?? ""));
  expect(robots).toContain("noindex, follow");
});

test("content compliance: the 404 body is copy, not a developer note", async ({ page }) => {
  for (const path of ["/dies-gibt-es-nicht", "/en/does-not-exist"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);

    const text = (await page.evaluate(visibleText)) as string;
    for (const pattern of INTERNAL_IDS) {
      expect(pattern.exec(text), `${path} renders an internal identifier`).toBeNull();
    }
  }
});


/**
 * F-2-33 — the footer contact and newsletter block was German on **every**
 * `/en/…` route, and the English conversion flows presented their primary
 * action in German. F-2-64 — the consent line's own legal link pointed at
 * `#datenschutz` in both languages, and the English legal page has no such
 * id, so it landed at the top of the page instead of at the privacy section.
 */
const ENGLISH_ROUTES = ROUTES.filter((entry) => entry.locale === "en").map((entry) => entry.path);

const GERMAN_UI_STRINGS = [
  "E-Mail-Adresse",
  "Nachricht",
  "Absenden",
  "Anmelden",
  "Neuigkeiten aus dem Projekt",
  "Double-Opt-in",
  "Datenschutzerklärung",
  "Suchen",
  "Heute mit einem anderen Anliegen hier?",
];

for (const path of ENGLISH_ROUTES) {
  test(`F-2-33: ${path} renders its footer block in English`, async ({ page }) => {
    await page.goto(path);
    const footer = await page.getByRole("contentinfo").innerText();
    for (const german of GERMAN_UI_STRINGS) {
      expect(footer, `${path} renders "${german}"`).not.toContain(german);
    }
    expect(footer).toContain("News from the project");
    expect(footer).toContain("Sign up");
  });
}

test("F-2-33: the logo's accessible name follows the page language", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("banner").getByRole("link").first()).toHaveAttribute(
    "aria-label",
    "Schafe vorm Fenster — to the home page",
  );
  await page.goto("/");
  await expect(page.getByRole("banner").getByRole("link").first()).toHaveAttribute(
    "aria-label",
    "Schafe vorm Fenster — zur Startseite",
  );
});

test("F-2-64 / TS-004-A9: the consent line's legal link resolves to its own anchor", async ({
  page,
}) => {
  for (const [path, expected, anchorId] of [
    ["/", "/rechtliches#datenschutz", "datenschutz"],
    ["/en", "/en/legal#privacy", "privacy"],
  ] as const) {
    await page.goto(path);
    // Two links carry this target: the footer's own "Datenschutz"/"Privacy"
    // entry and the consent sentence's inline one. Before F-2-64 the second
    // pointed at `#datenschutz` in both languages.
    const consentLink = page.getByRole("contentinfo").locator(`a[href="${expected}"]`);
    expect(await consentLink.count(), `${path} consent link`).toBeGreaterThanOrEqual(2);

    // And the anchor it points at exists on the page it points to.
    await page.goto(expected);
    await expect(page.locator(`#${anchorId}`), `${expected}`).toHaveCount(1);
  }
});

test("F-2-33: the English register flow's own controls are English", async ({ page }) => {
  await page.goto("/en/take-part/register");
  const main = page.getByRole("main");
  await expect(main.locator('button[type="submit"]')).toHaveText("Search");

  await page.goto("/en/take-part/register?ort=beispielwalde");
  await expect(page.getByRole("main").locator('button[type="submit"]')).toHaveText("Continue");
});


/**
 * F-2-33, gate-2 retest — the badge half of the finding. Measured over all
 * twelve `/en` routes: `Demo-Daten` on the register step, `/en/your-calendar`
 * and `/en/about/archive`; `Foto gesucht` on `/en/take-part`,
 * `/en/your-calendar`, `/en/your-region/quote` and `/en/about`; `Nicht
 * motivgenau · Platzhalter` on `/en/your-place`, `/en/your-place/start`,
 * `/en/your-region` and `/en/about`.
 *
 * The badges themselves were never the defect — they read the dictionary and
 * default to German, which is right. The defect was every component and page
 * around them that rendered a badge without handing it the page's language.
 * `src/components/badge-locale.test.tsx` holds the component half; this walk
 * is the page half, and it is the one that catches a *new* caller forgetting
 * the prop.
 *
 * One caller is still open: the page-level badge on `/en/about/archive`
 * (`app/[lang]/ueber-uns/archiv/page.tsx`, `rows.length > 0 ? <DemoDataBadge
 * /> : null`). The fix is `locale={locale}` on that line, exactly like every
 * other one — the file belongs to another work package this round, so the
 * walk records the leak rather than hiding it.
 */
const GERMAN_BADGES = ["Demo-Daten", "Foto gesucht", "Nicht motivgenau"];

/** Every `/en` route, plus the one step that only appears with a parameter. */
const ENGLISH_BADGE_PATHS = [
  ...ENGLISH_ROUTES,
  "/en/take-part/register?ort=beispielwalde",
];

for (const path of ENGLISH_BADGE_PATHS) {
  test(`F-2-33: ${path} badges nothing in German`, async ({ page }) => {
    await page.goto(path);
    const text = (await page.evaluate(visibleText)) as string;

    for (const german of GERMAN_BADGES) {
      const at = text.indexOf(german);
      expect(
        at,
        at === -1
          ? ""
          : `${path} renders "${german}": …${text.slice(Math.max(0, at - 90), at + 90)}…`,
      ).toBe(-1);
    }
  });
}

/**
 * F-2-73 / TS-026-A10, TS-026 D4 — block 3 of `/deine-region` names a region
 * a visitor can read, in **both** languages. F-2-63 fixed the German heading
 * ("Beispiele aus dem Landkreis deiner Region") and left the English one
 * filling its own `{county}` slot with the stage-0 anchor's geo-api id, so
 * `/en/your-region` read "examples from geoname.900001". The identifier
 * check above now covers every route; this names the heading the criterion
 * is actually about.
 */
for (const [path, phrase] of [
  ["/deine-region", "Landkreis deiner Region"],
  ["/en/your-region", "examples from your region"],
] as const) {
  test(`F-2-73 / TS-026-A10: ${path} asserts no county and no identifier in block 3`, async ({
    page,
  }) => {
    await page.goto(path);
    const text = (await page.evaluate(visibleText)) as string;

    // The written-out region, and it is a heading rather than body prose.
    expect(text, `${path} block 3 heading`).toContain(phrase);
    expect(
      await page.getByRole("heading", { name: new RegExp(phrase, "i") }).count(),
      `${path} names the region in a heading`,
    ).toBeGreaterThan(0);

    expect(text, `${path} renders a geo-api identifier`).not.toMatch(/geoname\./);
  });
}

/**
 * F-3-5 — the German residue F-2-33 could not reach.
 *
 * Everything visible on the `/en` pages was translated in round 3. The
 * founder portrait's `alt` was not: `alt="Jan-Henrik Hempel, Gründer"` stood
 * on `/en/about` and `/en/about/archive`, the one German job noun on two
 * otherwise fully English pages. An `alt` is not visible text, so no sweep of
 * the rendered body could ever have found it — which is why this assertion
 * reads the attribute rather than the page.
 */
test("F-3-5: text alternatives follow the page language", async ({ page }) => {
  await page.goto("/en/about");
  const englishAlts = await page.evaluate(() =>
    [...document.querySelectorAll("img")].map((img) => img.getAttribute("alt") ?? ""),
  );
  expect(englishAlts.join(" | ")).not.toContain("Gründer");
  expect(englishAlts).toContain("Jan-Henrik Hempel, founder");

  await page.goto("/ueber-uns");
  const germanAlts = await page.evaluate(() =>
    [...document.querySelectorAll("img")].map((img) => img.getAttribute("alt") ?? ""),
  );
  expect(germanAlts).toContain("Jan-Henrik Hempel, Gründer");
});
