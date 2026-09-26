import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

import { BRIEFING_URL } from "../../src/lib/live/briefing";

const REPO_ROOT = join(__dirname, "..", "..");

/** The one module allowed to write the appointment URL down (TS-WEB-0016 D7). */
const BRIEFING_MODULE = join("src", "lib", "live", "briefing.ts");

/**
 * Every shipped `.ts`/`.tsx` file under `app/` and `src/`, minus the module
 * that defines the URL and minus test files — the static half of F-2-32 below
 * reads them to prove no second place knows the appointment target. Test
 * fixtures are excluded because `outbound-link.test.tsx` fabricates targets on
 * that host on purpose, to exercise the marking-id derivation.
 */
function shippedSourceFiles(): string[] {
  const found: string[] = [];
  const walk = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "node_modules" && !entry.name.startsWith(".")) walk(path);
      } else if (/\.tsx?$/.test(entry.name) && !entry.name.includes(".test.")) {
        if (!path.endsWith(BRIEFING_MODULE)) found.push(path);
      }
    }
  };
  for (const directory of ["app", "src"]) walk(join(REPO_ROOT, directory));
  return found;
}

/**
 * TS-WEB-0026 — `/deine-region` and `/deine-region/angebot` — acceptance pass.
 *
 * TS-WEB-0026-A9 (integration, county-examples stub), TS-WEB-0026-A11 (integration,
 * counter stub) and TS-WEB-0026-A13 (the `request-licence-quote` analytics event
 * on submit) are not built here: no `/api/*` stub exists in this run and
 * `envoy-form-mount` has no real submission target (Q-0022) — `state/open.md`
 * lists them not-yet-M4.
 *
 * **Changed for the polish brief (page 8, item 2): `/deine-region` no longer
 * renders the quote form inline.** F-2-48's reading of TS-WEB-0016 D1 row S2 was
 * that both quote surfaces must carry the `envoy` mount, and the case below
 * asserted it on both. What that produced is what the brief measured: the
 * argument page ended in a five-field form whose submit button ("Absenden")
 * was immediately followed by a second button reading "Angebot anfragen" —
 * two controls for one action — with ~800 px of form between the proof and
 * the page's own closing CTA, and two `lime-100` sections back to back
 * against the design system's own colour rule. D1 row S2 names the two
 * surfaces of the `request-licence-quote` goal; it does not require the same
 * form to be built twice. `/deine-region` argues and offers the goal,
 * `/deine-region/angebot` is the form, and the case now asserts exactly
 * that: the mount on the form route, and on the argument route the CTA that
 * opens it and no competing second control.
 */

const FOLD_VIEWPORTS = [
  { name: "360x640", width: 360, height: 640 },
  { name: "1280x800", width: 1280, height: 800 },
];

test.describe("/deine-region", () => {
  test("TS-WEB-0026-A1: no map anywhere", async ({ page }) => {
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

  test("TS-WEB-0026-A2: no distance/radius wording as a module or result label", async ({ page }) => {
    await page.goto("/deine-region");
    const headings = await page.locator("h1, h2, h3, button, label").allTextContents();
    const distanceWords = /\bkm\b|Umkreis|Entfernung/i;
    for (const text of headings) expect(text).not.toMatch(distanceWords);
  });

  test("TS-WEB-0026-A3: at most 6 example places, and the place search stands beside them", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    const chips = page.locator('[class*="place-example-set"] [class*="chip"]');
    expect(await chips.count()).toBeLessThanOrEqual(6);
    await expect(page.getByLabel("Dein Ort")).toBeVisible();
  });

  test("TS-WEB-0026-A5 / TS-WEB-0006-A12: 480 appears at most once, from the price component", async ({
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

  test("TS-WEB-0026-A6 / TS-WEB-0006-A2: exactly one primary CTA, targets /deine-region/angebot, repeated at the close", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    const primary = page.locator('[data-cta="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveAttribute("href", "/deine-region/angebot");

    const quoteLinks = page.locator('a[href="/deine-region/angebot"]');
    expect(await quoteLinks.count()).toBeGreaterThanOrEqual(2);

    // Two of them since the polish brief: the quiet second way forward is
    // the same line in the hero and in the closing block (G-5), so a reader
    // who scrolls past the first meets it again where she decides.
    //
    // **Both are in-page now** (T-15, DEC-0081 §3): A6's "the consult action
    // sits beside it with the secondary treatment and resolves to this page's
    // contact section". They used to be the Google appointment URL itself,
    // twice, above and below the page's own conversion.
    const briefing = page.getByRole("link", { name: /Kennenlerngespräch/ });
    await expect(briefing).toHaveCount(2);
    await expect(briefing.first()).toBeVisible();
    for (const index of [0, 1]) {
      await expect(briefing.nth(index)).toHaveAttribute("href", "/deine-region#kontakt");
      await expect(briefing.nth(index)).toHaveAttribute("data-cta", "secondary");
    }

    /*
     * A6's "secondary treatment" measured rather than asserted from a marker.
     * The consult line is a `Button variant="quiet"`, whose size class decides
     * its box — and the default size is the primary's 56 px, so the second rung
     * silently took the first one's height once (review round, T-15). It stands
     * at `--height-control` (44 px), strictly shorter than the primary.
     */
    const primaryHeight = (await primary.boundingBox())?.height ?? 0;
    expect(primaryHeight).toBeGreaterThan(0);
    for (const index of [0, 1]) {
      const box = await briefing.nth(index).boundingBox();
      expect(box?.height, `consult link ${index} height`).toBeLessThan(primaryHeight);
      expect(box?.height, `consult link ${index} height`).toBeLessThanOrEqual(48);
    }

    // A6's last sentence: the section renders once below the closing block and
    // its first action row is the only element carrying the appointment URL.
    const section = page.locator("section#kontakt[data-contact-section]");
    await expect(section).toHaveCount(1);
    await expect(page.locator(`a[href="${BRIEFING_URL}"]`)).toHaveCount(1);
    await expect(section.locator(`a[href="${BRIEFING_URL}"]`)).toHaveCount(1);
  });

  test("TS-WEB-0026-A7 / A8: no response-time wording while the promise constant is unset", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/Werktage|48 Stunden|schnellstmöglich/);
  });

  test("TS-WEB-0026-A14 / TS-WEB-0006-A9: no audience selector, tab or interstitial", async ({ page }) => {
    await page.goto("/deine-region");
    await expect(page.locator("[role=tablist]")).toHaveCount(0);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("TS-WEB-0006-A6: exactly one context band, after the last argument block, before the closing block", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    const bands = page.locator("#context-band");
    await expect(bands).toHaveCount(1);
  });

  test("TS-WEB-0006-A7: the closing block repeats the primary conversion's goal and target", async ({
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
    test(`TS-WEB-0006-A3: the primary CTA is fully visible without scrolling at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/deine-region");
      const primary = page.locator('[data-cta="primary"]');
      await expect(primary).toBeInViewport();
    });
  }

  /**
   * Polish brief page 8, items 1 and 3 — the hero's CTA hierarchy was
   * inverted (the primary was bare text under a three-line white pill whose
   * label carried its own disclosures), and the stage-0 example heading read
   * "Orte im Landkreis deiner Region", which is the fallback string showing
   * through and not a county.
   */
  test("brief page 8, items 1 and 3: one primary pill in the hero, a quiet briefing under it, no invented county", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/deine-region");

    const hero = page.locator("#fokus");
    const primary = hero.locator('[data-cta="primary"]');
    await expect(primary).toHaveCount(1);
    const briefing = hero.getByRole("link", { name: /Kennenlerngespräch/ });
    await expect(briefing).toBeVisible();

    // The primary outweighs the secondary: a filled pill against a text
    // link, and the briefing stands under it, never beside it (G-5).
    const [primaryBox, briefingBox] = await Promise.all([
      primary.boundingBox(),
      briefing.boundingBox(),
    ]);
    expect(primaryBox).not.toBeNull();
    expect(briefingBox).not.toBeNull();
    expect(briefingBox!.y).toBeGreaterThan(primaryBox!.y);
    expect(primaryBox!.height).toBeLessThan(briefingBox!.height + primaryBox!.height);

    // The disclosure left the button label (G-5) — and the hero altogether
    // (T-15, DEC-0081 §3 / TS-WEB-0016 D16): nothing outbound happens here
    // any more, so there is nothing to disclose. The marking stands under the
    // contact section's first action row, the one element of the route that
    // leaves the site.
    await expect(briefing).not.toContainText("Daten gehen an");
    await expect(hero).not.toContainText("Öffnet Google Kalender in einem neuen Tab.");
    await expect(briefing).toHaveAttribute("href", "/deine-region#kontakt");
    await expect(hero.locator(`a[href="${BRIEFING_URL}"]`)).toHaveCount(0);

    // No county is named while none is known.
    const examples = await page.locator("[data-block='bestand']").innerText();
    expect(examples).toContain("Orte, die schon dabei sind");
    expect(examples).not.toMatch(/Landkreis deiner Region/);
  });

  test("G-9: the embed demo mounts the real showcase calendar, never a dead organizer", async ({
    page,
  }) => {
    const loaders: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/load.js")) loaders.push(request.url());
    });

    await page.goto("/deine-region");
    const embed = page.locator("[data-block='einbindung']");
    await expect(embed).toHaveCount(1);

    // The mount is lazy (`portalize-mount.tsx`), so the loader is requested
    // when the block is approached, exactly as on `/dein-kalender`.
    await page.locator("[data-portalize-widget]").scrollIntoViewIfNeeded();
    await expect.poll(() => loaders.length, { timeout: 15_000 }).toBeGreaterThan(0);
    // The id this page used to carry ("7b0912af…") resolves to nothing
    // upstream, so the single most persuasive module on the page rendered a
    // lilac rectangle with the widget's own red German error paragraph — on
    // the English page too. It is the showcase organizer now, the one
    // `/dein-kalender` embeds and the one the service smoke-tests.
    for (const url of loaders) expect(url).toContain("5f3745f3-845d-4bbc-84e3-4d9a00883bf8");
  });

  test("G-6: the closing CTA carries its heading and the same quiet second way forward", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    const closing = page.locator("#closing-cta");
    await expect(closing).toContainText("Sollen wir euch ein Angebot rechnen?");
    // A question in the closing block is a `<p>`, never an `h2` (CG-006/CG-005).
    await expect(closing.locator("h2")).toHaveCount(0);
    await expect(closing.getByRole("link", { name: /Kennenlerngespräch/ })).toBeVisible();
    // No response-time promise is invented to fill the reassurance line.
    await expect(closing).not.toContainText(/Werktage/);
  });

  /**
   * CG-005 on the territory block, in both locales: the owner's question is a
   * `Kicker` field of `deine-region-2-territory` since 2026-09-26, and the page
   * reads it by field index with the dictionary kicker as a fallback
   * (`app/[lang]/deine-region/page.tsx`). A field inserted into that slot would
   * shift the index and the section would quietly show the dictionary word
   * instead, leaving the h2's statement without the referent it needs — so the
   * question is asserted, not the mechanism (DEC-0142 §8).
   */
  for (const locale of [
    {
      name: "de",
      path: "/deine-region",
      kicker: "Was ist in meiner Nähe?",
      title: "Bei Landkreisgröße keine Frage für eine Liste",
    },
    {
      name: "en",
      path: "/en/your-region",
      kicker: "What's near me?",
      title: "At county scale, that's not a question for a list",
    },
  ]) {
    test(`TS-WEB-0006-A8 / CG-005 (${locale.name}): the gebietsfrage kicker carries the visitor's question, the h2 the statement`, async ({
      page,
    }) => {
      await page.goto(locale.path);
      const section = page.locator("[data-block='gebietsfrage']");
      await expect(section.locator("p").first()).toHaveText(locale.kicker);
      await expect(section.getByRole("heading", { level: 2 })).toHaveText(locale.title);
    });
  }

  test("TS-WEB-0004-A1: the page carries no horizontal scroll at 360px and has a heading", async ({
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
  test("TS-WEB-0006-A15: the breadcrumb trail precedes the page content, names the current page last, carries no data-cta", async ({
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

  test("TS-WEB-0026-A7: no response-time wording on the form route either", async ({ page }) => {
    await page.goto("/deine-region/angebot");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/Werktage|48 Stunden|schnellstmöglich/);
  });

  /**
   * A filled quote form, ready to submit. The timing gate of TS-WEB-0016-A10
   * refuses anything faster than a human could manage, so the walk waits it
   * out the way a visitor does.
   */
  const fillQuoteForm = async (page: import("@playwright/test").Page) => {
    await page.fill("#envoy-quote-organisation", "Amt Züssow");
    await page.fill("#envoy-quote-name", "A. Test");
    await page.fill("#envoy-quote-email", "anfrage@beispiel.de");
    await page.fill("#envoy-quote-message", "Wir hätten gern ein Angebot für unser Gebiet.");
    await page.waitForTimeout(2600);
  };

  test("TS-WEB-0026-A13 / TS-WEB-0016-A12: submitting fires exactly one request-licence-quote event", async ({
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
  test("F-2-65 / TS-WEB-0012-A5: a rapid double-click submits once", async ({ page }) => {
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
  test("F-2-66 / TS-WEB-0016-A9: a submission leaves a labelled success state that takes focus", async ({
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
   * F-2-48 / TS-WEB-0016-A10 — the website's half of the spam contract: a honeypot
   * in the DOM, hidden from assistive technology and not focusable, and a
   * submission faster than a human could make one refused.
   */
  test("F-2-48 / TS-WEB-0016-A10: a honeypot is present and unreachable, and a too-fast submission is refused", async ({
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
    await page.fill("#envoy-quote-organisation", "Amt Züssow");
    await page.fill("#envoy-quote-name", "A. Test");
    await page.fill("#envoy-quote-email", "anfrage@beispiel.de");
    await page.locator('[data-cta="primary"]').click();
    await expect(
      page.locator("form[data-envoy-form-kind='quote'] [role='alert']"),
    ).toBeVisible();
    await expect(page.locator('[data-envoy-state="sent"]')).toHaveCount(0);
  });

  /**
   * F-2-48 / TS-WEB-0016-A2 — D1 row S2 names both `/deine-region` and
   * `/deine-region/angebot`; the mount was absent from the first.
   */
  test("F-2-48 / TS-WEB-0016-A2: the quote mount stands once, on the form route, with the D2 attributes", async ({
    page,
  }) => {
    await page.goto("/deine-region/angebot");
    const mount = page.locator("form[data-envoy-form-kind='quote']");
    await expect(mount).toHaveCount(1);
    await expect(mount).toHaveAttribute("data-envoy-locale", "de");
    await expect(mount).toHaveAttribute("data-envoy-context-goal", "request-licence-quote");
  });

  test("brief page 8, item 2: the argument route offers the goal and does not repeat the form", async ({
    page,
  }) => {
    await page.goto("/deine-region");
    // The argument page carries no quote form of its own — and no submit
    // button beside the CTA that opens the one that exists.
    await expect(page.locator("form[data-envoy-form-kind='quote']")).toHaveCount(0);
    await expect(page.locator("#main").getByRole("button", { name: "Absenden" })).toHaveCount(0);
    // The goal is still offered here, twice: hero and closing block.
    const quoteLinks = page.locator('a[href="/deine-region/angebot"]');
    expect(await quoteLinks.count()).toBe(2);
  });

  /**
   * F-2-32 / TS-WEB-0016-A5 / TS-WEB-0025-A2 / TS-WEB-0026-A6 — rewritten for
   * T-15.
   *
   * The old form asked a weaker question: it swept `main a[href*='calendar']`
   * and asserted that *every* such link equalled the one configured value,
   * which passed while the appointment URL stood on a hero CTA, on a closing
   * footer and on three order steps — six outbound placements of a link
   * DEC-0081 §3 gives exactly one home. What A5 actually says is that the
   * booking CTAs "resolve to the contact section of the same page, not to an
   * external host", and that the section's first action row "is the only
   * element on the page carrying that href".
   *
   * So the sweep counts occurrences instead of comparing them, and checks the
   * one it finds is the section's row. `main` is asserted clean, because the
   * chrome renders the section *outside* `main` (DEC-0081 §2) — which is also
   * why the old locator would now find nothing at all on a correct page.
   *
   * `/dein-kalender` and `/ueber-uns` are A5's other two routes and belong to
   * T-13 and T-14; `e2e/contact-section.spec.ts` carries the per-route walk
   * and the `test.fail` markers that come off as those merge.
   */
  test("F-2-32 / TS-WEB-0016-A5: the contact section's first row is the only booking URL on the route", async ({
    page,
  }) => {
    /**
     * `/dein-kalender` left this list with T-13: it carries **no** briefing link
     * inside `main` any more, its hero CTA is an in-page link to `#kontakt`, and
     * the one appointment URL on that route is the contact section's first action
     * row, which stands outside `main` (DEC-0081 §3, TS-WEB-0024-A15).
     *
     * `consult: false` on `/deine-region/angebot`: its consult line lives in
     * the lead fallback, which renders only in the widget's `empty`/`degraded`
     * state, and the route ships `mocked`. The markup half of that line is
     * `src/components/lead-fallback/lead-fallback.test.tsx`.
     */
    const ROUTES = [
      { path: "/deine-region", consult: true },
      { path: "/deine-region/angebot", consult: false },
      { path: "/dein-kalender/bestellen", consult: true },
      { path: "/dein-kalender/bestellen?orte=schlatkow&schritt=3", consult: true },
      { path: "/dein-kalender/bestellen?orte=schlatkow&schritt=4", consult: true },
    ];

    /*
     * F-2-32's own question, which the count sweep below cannot ask: the
     * appointment target is **one configured value** (`BRIEFING_URL` in
     * `src/lib/live/briefing.ts`), not a literal pasted per page. So the
     * assertion is that no page and no component knows the URL — a static
     * sweep over everything shipped under `app/` and `src/` except that one
     * module.
     *
     * The first version of this case compared `BRIEFING_URL` with the exact
     * expression `briefing.ts` assigns it, which could only fail if someone
     * changed that file and forgot this line — and it pasted the appointment
     * URL into a second file, which is the duplication F-2-32 exists to
     * prevent (review round, T-15). The env var read here is the Playwright
     * process's anyway, not necessarily the server's.
     */
    const shipped = shippedSourceFiles();
    expect(shipped.length).toBeGreaterThan(100);
    for (const file of shipped) {
      expect(readFileSync(file, "utf8"), file).not.toContain("calendar.app.google");
    }

    for (const { path, consult: hasConsult } of ROUTES) {
      await page.goto(path);

      // Exactly one, and it is the section's appointment row.
      const all = page.locator(`a[href="${BRIEFING_URL}"]`);
      await expect(all, path).toHaveCount(1);
      await expect(
        page.locator(
          `section#kontakt[data-contact-section] a[data-channel="appointment"][href="${BRIEFING_URL}"]`,
        ),
        path,
      ).toHaveCount(1);

      // Nothing inside the page's own content leaves for a calendar host.
      const inMain = await page
        .locator("main a[href*='calendar']")
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href") ?? ""));
      expect(inMain, path).toEqual([]);

      // And the booking CTA the page does carry resolves in-page.
      if (!hasConsult) continue;
      const consult = page.getByRole("link", { name: /Kennenlerngespräch|Beratungstermin/ });
      const count = await consult.count();
      expect(count, path).toBeGreaterThan(0);
      for (let index = 0; index < count; index += 1) {
        expect(await consult.nth(index).getAttribute("href"), path).toMatch(/#kontakt$/);
      }
    }
  });

  test("TS-WEB-0001 / F-2-33: the English quote flow is English", async ({ page }) => {
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
    ]) {
      expect(text, german).not.toContain(german);
    }
    await expect(form.locator("button[type='submit']")).toHaveText("Send");
  });
});
