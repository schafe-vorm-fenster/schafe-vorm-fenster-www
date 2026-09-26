import { expect, test } from "@playwright/test";

import { everyRoute, href } from "../src/lib/routes/routes";

/**
 * Content compliance — `plan/gate-2-scope.md` §1.3 and the dummy-content rule.
 *
 * F-2-35: internal ticket, decision and spec identifiers were rendered as
 * visitor copy on 24/24 routes — "Demo-Daten — es wird nichts verschickt,
 * solange **Q-0020** offen ist" in the footer of every page, "(kein
 * Textproblem, **TS-WEB-0007 D12**)" on `/ueber-uns`, "**TS-WEB-0029 Open Point #1**"
 * and "**DEC-0027**" on `/rechtliches`. F-2-31 added the 404's own
 * "[Platzhalter M2 — … DEC-0032.]".
 *
 * The grep is the instrument, not the fix: it walks every route in both
 * languages, strips the markup, and fails on the id shapes the repository
 * uses. `pnpm check:*` cannot see this — the identifiers are legal content
 * *in* the artefacts' own prose and only a defect once rendered.
 */

/**
 * The id shapes this repository uses. Word-bounded, so prose is not caught.
 * DEC-0086 moved every family to `<TYPE>-<DOMAIN>-<NNNN>`; the pre-DEC-0086
 * shapes stay in the list because copy written before the rename would still
 * be a leak.
 */
const INTERNAL_IDS = [
  /\bTS-WEB-\d{4}\b/,
  /\bDEC-\d{4}\b/,
  /\bQ-\d{4}\b/,
  /\bGL-\d{4}\b/,
  /\b(?:FUN|NFR|CON|BUS)-[A-Z]{2,5}-\d/,
  /\bSRC-\d{4}\b/,
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
 * F-2-31 / TS-WEB-0004-A4 — "404 renders place search + jobs band with status 404
 * and `noindex`". The routing tests assert the status, the robots value and
 * the heading; neither clause the criterion is actually about was asserted
 * anywhere, which is why a green suite hid a page whose body was a developer
 * note and whose two required modules were a dashed placeholder box.
 */
test("F-2-31 / TS-WEB-0004-A4: the 404 carries the place search and the jobs band", async ({
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
  // `follow` half of DEC-0032, so both tags stand.
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
 *
 * Both surfaces the two findings were measured on have since left the footer:
 * the contact form was replaced by the contact section (DEC-0081) and the
 * newsletter block is withheld while no sending system accepts a subscription
 * (TS-WEB-0016-A21, DEC-0122). So the German-string sweep below is now a sweep
 * over what the footer still says — the legal labels and the language switch —
 * and the strings of the two departed blocks stay on the list, because they
 * must not come back in German when the block does. The positive
 * "New features and current offers" / "Sign up" assertions went with the block;
 * `e2e/newsletter.spec.ts` asserts it renders nowhere at all, and its four
 * F-3-11 cases come back with it.
 */
const ENGLISH_ROUTES = ROUTES.filter((entry) => entry.locale === "en").map((entry) => entry.path);

const GERMAN_UI_STRINGS = [
  "E-Mail-Adresse",
  "Nachricht",
  "Absenden",
  "Anmelden",
  "Neue Funktionen und aktuelle Angebote",
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
    // What the footer still carries, in English: the three legal labels and
    // the switch back to German (TS-WEB-0004-A9, TS-WEB-0001-A7).
    expect(footer).toContain("Privacy");
    expect(footer).toContain("Accessibility");
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

test("F-2-64 / TS-WEB-0004-A9: the consent line's legal link resolves to its own anchor", async ({
  page,
}) => {
  for (const [path, expected, anchorId] of [
    ["/", "/rechtliches#datenschutz", "datenschutz"],
    ["/en", "/en/legal#privacy", "privacy"],
  ] as const) {
    await page.goto(path);
    // Two links carried this target while the newsletter stood here: the
    // footer's own "Datenschutz"/"Privacy" entry and the consent sentence's
    // inline one, which pointed at `#datenschutz` in both languages before
    // F-2-64. The consent sentence went with the withheld block
    // (TS-WEB-0016-A21), so one link is left — and the per-locale anchor is
    // what this asserts, which is unchanged.
    const privacyLink = page.getByRole("contentinfo").locator(`a[href="${expected}"]`);
    expect(await privacyLink.count(), `${path} privacy link`).toBeGreaterThanOrEqual(1);

    // And the anchor it points at exists on the page it points to.
    await page.goto(expected);
    await expect(page.locator(`#${anchorId}`), `${expected}`).toHaveCount(1);
  }
});

test("F-2-33: the English register flow's own controls are English", async ({ page }) => {
  // CHANGED (polish brief, page 5): step 1's submit read "Search" / "Suchen".
  // It is the flow's advance — a resolved place moves the flow on by itself —
  // and the brief's reviewer did not recognise it as the way through, so it
  // carries the same label as every other step. The assertion this file is
  // about is unchanged: whatever the control says, it says it in the page's
  // language.
  await page.goto("/en/take-part/register");
  const main = page.getByRole("main");
  await expect(main.locator('button[type="submit"]')).toContainText("Continue");

  await page.goto("/en/take-part/register?ort=quilow");
  await expect(page.getByRole("main").locator('button[type="submit"]')).toContainText("Continue");
});


/**
 * Jan's decision of 2026-09-18 — **the site must read as finished.**
 *
 * This replaces the "badges nothing in German" walk that stood here. The
 * earlier finding (F-2-33) was that the demo and placeholder badges rendered
 * their German defaults on `/en`; the badges themselves were considered
 * right. They are not any more. No page, in either language, may carry a
 * visible or screen-reader-audible hint that something on it is a stand-in:
 * no "Beispiel", "Demo", "Dummy", "Platzhalter", "nicht motivgenau", "Foto
 * gesucht", "KI-generiert", "nicht freigegeben", "Kein Nachweis".
 *
 * Provenance did not disappear — it moved to the content frontmatter, to
 * `data-*` attributes and to `state/open.md`. The second test below asserts
 * that it is still there, so this sweep cannot be satisfied by deleting the
 * marking outright.
 *
 * Two surfaces are swept, because a badge is not the only way a page can say
 * "this is fake":
 *
 *  - the **rendered text** a visitor reads;
 *  - the **accessible tree** a screen reader speaks — every `alt`,
 *    `aria-label`, `aria-description`, `title` and input `placeholder` on
 *    the page, which no sweep of `innerText` can see (the lesson of F-3-5).
 */
const FORBIDDEN_MARKINGS = [
  // German
  /\bbeispiel/i,
  /\bdemo-daten\b/i,
  /\bdemodaten\b/i,
  /\bdummy/i,
  /\bplatzhalter/i,
  /\bmotivgenau\b/i,
  /\bfoto gesucht\b/i,
  /\bkein nachweis\b/i,
  /\bliegt uns noch kein\b/i,
  /\bki-generiert\b/i,
  /\bnicht freigegeben\b/i,
  // English
  /\bdemo data\b/i,
  /\bdemo version\b/i,
  /\bphoto wanted\b/i,
  /\bno evidence\b/i,
  /\bnot an exact match\b/i,
  /\bplaceholder/i,
  /\bsample (data|content|text)\b/i,
  /\bexample (date|place|municipality|village|town|district|feedback|text|data|sentence)\b/i,
  /\bfor example —/i,
];

/**
 * The exception, and the only one: `/rechtliches` and `/en/legal` carry the
 * community guidelines verbatim (`state/open.md` row 151), and their own
 * prose uses "Beispiele sind Sonderangebote …" to introduce a list of event
 * types. That is genuine legal copy explaining a rule — it labels nothing on
 * the site as fake — so the legal bodies are swept for everything except the
 * bare word "Beispiel".
 */
const LEGAL_PATHS = new Set(["/rechtliches", "/en/legal"]);

/** Every `alt`, `aria-label`, `title` and `placeholder` on the page. */
const accessibleStrings = `(() => {
  const out = [];
  for (const el of document.querySelectorAll("[alt],[aria-label],[aria-description],[title],[placeholder]")) {
    for (const attr of ["alt", "aria-label", "aria-description", "title", "placeholder"]) {
      const value = el.getAttribute(attr);
      if (value) out.push(value);
    }
  }
  return out;
})()`;

/** Every route in both languages, plus the one step that needs a parameter. */
const VOCABULARY_PATHS = [
  ...ROUTES.map((entry) => entry.path),
  "/en/take-part/register?ort=quilow",
  "/mitmachen/registrieren?ort=quilow",
  "/dein-kalender/bestellen?schritt=4",
  "/en/your-calendar/order?schritt=4",
];

for (const path of VOCABULARY_PATHS) {
  test(`no visible marking of stand-in content: ${path}`, async ({ page }) => {
    await page.goto(path);
    const text = (await page.evaluate(visibleText)) as string;
    const spoken = ((await page.evaluate(accessibleStrings)) as string[]).join("\n");
    const isLegal = LEGAL_PATHS.has(path);

    for (const pattern of FORBIDDEN_MARKINGS) {
      if (isLegal && pattern.source === "\\bbeispiel") continue;

      const inText = pattern.exec(text);
      expect(
        inText,
        inText === null
          ? ""
          : `${path} renders "${inText[0]}": …${text.slice(Math.max(0, inText.index - 90), inText.index + 90)}…`,
      ).toBeNull();

      const inTree = pattern.exec(spoken);
      expect(
        inTree,
        inTree === null ? "" : `${path} speaks "${inTree[0]}" in the accessible tree: ${inTree.input.slice(Math.max(0, inTree.index - 60), inTree.index + 60)}`,
      ).toBeNull();
    }
  });
}

/**
 * The other half of the same decision: the marking moved, it was not
 * deleted. A page whose live modules are mocked still says so — to Jan, in
 * the markup — and a photo slot still waiting for its photograph still
 * declares itself.
 */
test("provenance survives in `data-*`, on the pages that carry a mock", async ({ page }) => {
  for (const path of ["/", "/en", "/dein-ort", "/en/your-place"]) {
    await page.goto(path);
    const marked = await page.locator('[data-demo="true"], [data-mock="true"]').count();
    expect(marked, `${path} marks its mocked modules in data-*`).toBeGreaterThan(0);
  }
});

/**
 * The standing surface that took the footer form's place carries the same
 * marking regime: the contact section's head, its lead, row 1's sub-label and
 * the D16 sentence are strings nobody has written yet, so the section declares
 * itself `data-demo="true"` (DEC-0113). The footer's newsletter mock is the
 * other half of the swap — it renders nowhere while no sending system accepts a
 * subscription (TS-WEB-0016-A21, DEC-0122 §3), so there is no mock left to
 * declare.
 */
test("the contact section declares its placeholder copy, and no newsletter mock renders", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('section#kontakt[data-demo="true"]')).toHaveCount(1);
  await expect(page.locator("[data-newsletter]")).toHaveCount(0);
});

/**
 * F-2-73 / TS-WEB-0026-A10, TS-WEB-0026 D4 — block 3 of `/deine-region`, in **both**
 * languages. F-2-63 fixed the German heading and left the English one
 * filling its own `{county}` slot with the stage-0 anchor's geo-api id, so
 * `/en/your-region` read "examples from geoname.900001".
 *
 * **Changed for the polish brief (page 8, item 3).** This case used to
 * require the heading to contain "Landkreis deiner Region" — the generic
 * stand-in F-2-63 put in the `{landkreis}` slot. The brief's finding is that
 * this *is* the defect: "'Beispiele aus dem Landkreis deiner Region' is the
 * fallback string showing through. When no district is known the heading
 * must not name one." So the criterion TS-WEB-0026-A10 is actually about — no
 * county asserted without an anchor, and no identifier rendered as copy — is
 * asserted directly, and the stand-in phrase is asserted **absent**.
 */
for (const [path, standIn] of [
  ["/deine-region", /Landkreis deiner Region/i],
  ["/en/your-region", /county of your region|in your region/i],
] as const) {
  test(`F-2-73 / TS-WEB-0026-A10: ${path} asserts no county and no identifier in block 3`, async ({
    page,
  }) => {
    await page.goto(path);
    const text = (await page.evaluate(visibleText)) as string;

    // Block 3 has a heading of its own, and it names no county at all.
    const heading = page.locator("[data-block='bestand']").getByRole("heading").first();
    expect(await heading.count(), `${path} block 3 has a heading`).toBeGreaterThan(0);
    expect(
      (await heading.innerText()).trim().length,
      `${path} block 3 heading is not empty`,
    ).toBeGreaterThan(0);

    expect(text, `${path} renders the county stand-in as copy`).not.toMatch(standIn);
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
 *
 * Since the imagery workstream the `alt` is content, not a constant in the
 * page: it comes from the locale file's own `images:` entry, so the two
 * locales carry two different sentences and the component's `FOUNDER_ALT`
 * pair is only the fallback for a portrait the inventory does not describe.
 * The assertion therefore checks what F-3-5 is actually about — that the
 * text alternative is in the page's language and is not the other locale's —
 * rather than one exact string that content may legitimately rewrite.
 */
test("F-3-5: text alternatives follow the page language", async ({ page }) => {
  const altOfPortrait = () =>
    page.evaluate(
      () =>
        document.querySelector<HTMLImageElement>('img[src*="founder-portrait"]')?.alt ?? "",
    );

  await page.goto("/en/about");
  const englishAlts = await page.evaluate(() =>
    [...document.querySelectorAll("img")].map((img) => img.getAttribute("alt") ?? ""),
  );
  expect(englishAlts.join(" | ")).not.toContain("Gründer");
  // German markers that would betray an untranslated alt on an English page.
  expect(englishAlts.join(" | ")).not.toMatch(/\b(der|die|das|und|mit|vor|dahinter)\b/i);
  const englishPortrait = await altOfPortrait();
  expect(englishPortrait).not.toBe("");

  await page.goto("/ueber-uns");
  const germanAlts = await page.evaluate(() =>
    [...document.querySelectorAll("img")].map((img) => img.getAttribute("alt") ?? ""),
  );
  const germanPortrait = await altOfPortrait();
  expect(germanPortrait).not.toBe("");
  expect(germanPortrait).not.toBe(englishPortrait);
  expect(germanAlts.join(" | ")).toMatch(/Jan-Henrik Hempel/);
});
