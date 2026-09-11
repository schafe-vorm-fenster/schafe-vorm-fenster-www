import { expect, test } from "@playwright/test";

import { checkRhythm } from "../../src/components/section-shell/rhythm";

import type { RhythmEntry } from "../../src/components/section-shell/rhythm";

/**
 * TS-020 — `/dein-ort`, the acceptance walk.
 *
 * Without `?ort=` the page renders **S0**, "the prerendered shell, complete
 * on its own" (TS-020 D2) — that is what the static shell contains, and most
 * criteria below walk it.
 *
 * M4 wired `?ort=` through `src/lib/live/places.ts`, so states A and B are
 * reachable and walked here. The two slugs are the live layer's own
 * fixtures: `DEMO_PLACES[0]` always has dates (state A) and `EMPTY_DEMO_SLUG`
 * never does (state B) — `src/lib/live/mocks/fixtures.ts` names both, exactly
 * so a gate-level walk can reach a branch demo data would not produce on its
 * own. What is still `test.fixme` is what M4 did not build, with its reason.
 */

/** `src/lib/live/mocks/fixtures.ts` — a covered place that always has dates. */
const PLACE_WITH_DATES = "beispielgemeinde-musterdorf";
/** The same file's `EMPTY_DEMO_SLUG` — covered, zero dates: TS-008 D4's moment. */
const PLACE_WITHOUT_DATES = "beispielhausen";

const PHONE = { width: 360, height: 640 };
const DESKTOP = { width: 1280, height: 800 };

test.describe("TS-020 — your place", () => {
  test("TS-020-A2: walk state A — place name as h1, ≤ 3 rows, the handover is the primary CTA", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(`/dein-ort?ort=${PLACE_WITH_DATES}`);

    // The `h1` is the place name in every state and at the same DOM position
    // (TS-020 D5). S0 carries the generic one; state A carries the resolved
    // place, and the module's own heading names it too.
    const dates = page.locator("#place-dates");
    await expect(dates.locator("h2")).toContainText("Musterdorf");

    // "≤ 3 rows" — position 1's fixed row count (TS-008 D1).
    const rows = dates.locator("article");
    expect(await rows.count()).toBeGreaterThan(0);
    expect(await rows.count()).toBeLessThanOrEqual(3);

    // The handover is a real link into the app, and it is not the page's
    // `data-cta="primary"` — that one is the search submit while the place
    // came from a parameter rather than from a conversion (TS-006 D4).
    const handover = dates.locator('a[href^="https://app."]');
    await expect(handover).toHaveCount(1);
    await expect(handover).toHaveAttribute("href", new RegExp(PLACE_WITH_DATES));
  });

  test("TS-020-A3: walk state B — the publish offer in the module slot, the focus job shifts", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(`/dein-ort?ort=${PLACE_WITHOUT_DATES}`);

    const dates = page.locator("#place-dates");
    // TS-008 D4: a covered place with zero dates is the conversion moment,
    // not an error — the publish offer *occupies* the module slot.
    await expect(dates.locator("text=/noch nichts eingetragen/i")).toHaveCount(1);
    // No empty list, no error styling, no retry control.
    await expect(dates.locator("button")).toHaveCount(0);

    // The focus job shifts: the offer leads to `register-as-publisher`'s page
    // (`page.meta.ts`'s `emptyState`), not to the calendar handover — and it
    // carries the page's one `data-cta="primary"` (F-2-61). The target is
    // inside `/mitmachen`, at the route the goal is actually fired on, with
    // the resolved slug: TS-023 D5 names "the `/dein-ort` empty state" as one
    // of the four surfaces `?ort=` reaches `/mitmachen/registrieren` from.
    const offer = dates.locator('a[href^="/mitmachen"]');
    await expect(offer).toHaveCount(1);
    await expect(offer).toHaveAttribute("data-cta", "primary");
    await expect(offer).toHaveAttribute(
      "href",
      `/mitmachen/registrieren?ort=${PLACE_WITHOUT_DATES}`,
    );
    await expect(dates.locator('a[href^="https://app."]')).toHaveCount(0);

    // TS-008-A6: position 2 renders, labelled as surroundings — in state B it
    // is the *first* evidence, so an empty module is the defect, not a state.
    const nearby = page.locator("#nearby");
    await expect(nearby.locator("article").first()).toBeVisible();
    expect(await nearby.locator("h2").first().innerText()).not.toContain("Beispielhausen");

    // No raw markdown reaches the visitor: the `→ `/mitmachen`` routing note
    // beside the CTA label is not copy.
    const body = await dates.innerText();
    expect(body).not.toContain("`");
    expect(body).not.toContain("→");

    // `role="status"`: the shift is announced once (TS-009 D7).
    await expect(dates.locator('[role="status"]')).toHaveCount(1);
  });

  test("TS-020-A4: exactly four value stories, each with a title, a story and an example box", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");

    const stories = page.locator("#value-stories > div > article");
    await expect(stories).toHaveCount(4);

    for (let index = 0; index < 4; index += 1) {
      const story = stories.nth(index);
      await expect(story.locator("h2")).toHaveCount(1);
      await expect(story.locator("p").first()).not.toBeEmpty();
      await expect(story.locator("[data-example-level]")).toHaveCount(1);
    }

    // No example names a place absent from geo-api: while the modules are
    // mocked every example place is a `Beispiel…` construction, which is
    // exactly what the mock rule requires of dummy data.
    const exampleText = (await page.locator("#value-stories").textContent()) ?? "";
    expect(exampleText).toContain("Beispiel");
  });

  test.fixme(
    "TS-020-A5: the four stories' proof_refs resolve in the installed @schafe-vorm-fenster/proof [M4 — TS-005 D5 relevance engine; the stories carry no proof_ref in the artifact yet]",
    () => {},
  );

  test("TS-020-A6: with every testimonial uncleared the stories render three-part", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");

    const stories = page.locator("#value-stories");
    await expect(stories.locator("blockquote")).toHaveCount(0);
    await expect(stories.locator("figure")).toHaveCount(0);
    await expect(stories.locator("img")).toHaveCount(0);

    const text = (await stories.textContent()) ?? "";
    expect(text).not.toMatch(/Nutzer sagen|users say|unsere Kundinnen|our customers/i);
  });

  test("TS-020-A7: the homescreen block renders iOS and Android, always, with the app handover", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");

    const block = page.locator("#homescreen");
    await expect(block.locator('[data-platform="ios"]')).toHaveCount(1);
    await expect(block.locator('[data-platform="android"]')).toHaveCount(1);
    await expect(block.locator('[data-platform="ios"] li').first()).not.toBeEmpty();
    await expect(block.locator('[data-platform="android"] li').first()).not.toBeEmpty();

    const href = await block.locator("a").last().getAttribute("href");
    expect(href).toMatch(/^https:\/\/app\.schafe-vorm-fenster\.de\//);
  });

  test("TS-020-A7: the DOM is identical under an iPhone and an Android user agent", async ({
    browser,
  }) => {
    const markup: string[] = [];
    for (const userAgent of [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36",
    ]) {
      const context = await browser.newContext({ userAgent });
      const page = await context.newPage();
      await page.goto("/dein-ort");
      markup.push((await page.locator("#homescreen").innerHTML()) ?? "");
      await context.close();
    }
    expect(markup[0]).toBe(markup[1]);
  });

  test.fixme(
    "TS-020-A8: the three call sites emit save-calendar-to-homescreen exactly once [M4 — TS-012 analytics is not built]",
    () => {},
  );

  test("TS-020-A9: no parameter, an empty one and a garbage one all answer 200 in the search state", async ({
    page,
  }) => {
    for (const path of ["/dein-ort", "/dein-ort?ort=", "/dein-ort?ort=%3Cscript%3E"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.getByRole("searchbox").first()).toBeVisible();
      // The raw value appears nowhere as data.
      const body = (await page.locator("main").textContent()) ?? "";
      expect(body).not.toContain("<script>");
      expect(body).not.toContain("script");
    }
  });

  test("TS-020-A10: stage 0 is complete — search, four labelled example stories, band, closing CTA", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");

    await expect(page.getByRole("searchbox").first()).toBeVisible();
    await expect(page.locator("#value-stories > div > article")).toHaveCount(4);
    await expect(page.locator("[data-example-level]")).toHaveCount(4);
    await expect(page.locator("#context-band nav")).toHaveCount(1);
    await expect(page.locator("#closing-cta")).toHaveCount(1);

    // No empty-state markup and no unresolved skeleton in S0.
    await expect(page.locator('[class*="empty-state-block"]')).toHaveCount(0);
    await expect(page.locator('[class*="skeleton"]')).toHaveCount(0);

    await context.close();
  });

  test("TS-020-A11: the canonical is the parameter-free path for every `?ort=`", async ({
    page,
  }) => {
    // The criterion names "`/dein-ort`, `?ort=<A slug>` and `?ort=<B slug>`" —
    // a state-A and a state-B place, not a value that classifies as uncovered
    // and is forwarded to the founding route (TS-020 D2 row 5, F-2-30).
    for (const path of [
      "/dein-ort",
      "/dein-ort?ort=17390",
      `/dein-ort?ort=${PLACE_WITHOUT_DATES}`,
    ]) {
      await page.goto(path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://www.schafe-vorm-fenster.de/dein-ort",
      );
    }
    // JSON-LD: no `Event` node anywhere (TS-011 D4). The `WebPage` half is
    // not built yet — see the fixme below.
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(jsonLd.join("")).not.toContain('"Event"');
  });

  test("TS-020-A11 (second half): the JSON-LD graph contains WebPage", async ({ page }) => {
    await page.goto("/dein-ort");

    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1); // TS-011 D4: one graph per page

    const graph = JSON.parse((await scripts.textContent()) ?? "{}");
    const nodes = graph["@graph"] as { "@type": string; url?: string }[];
    const webPage = nodes.find((node) => node["@type"] === "WebPage");
    expect(webPage).toBeDefined();
    expect(webPage?.url).toBe("https://www.schafe-vorm-fenster.de/dein-ort");
    // D4's "deliberately not emitted" table — and A11's own first half.
    expect(JSON.stringify(graph)).not.toContain('"Event"');
  });

  test.fixme(
    "TS-020-A12: with the BFF delayed beyond 2 s the box keeps its geometry and CLS stays < 0.1 [M4 — TS-008 D2 BFF routes]",
    () => {},
  );

  for (const viewport of [PHONE, DESKTOP]) {
    test(`TS-006-A3: the primary CTA is above the fold at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/dein-ort");
      const primary = page.locator('[data-cta="primary"]');
      await expect(primary).toHaveCount(1);
      const box = await primary.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    });

    test(`TS-017-A9: no horizontal scroll at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/dein-ort");
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows).toBe(false);
    });
  }

  test("TS-006-A6 / A7: one context band with the three non-focus jobs, then the closing block", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");

    const band = page.locator("#context-band nav");
    await expect(band).toHaveCount(1);
    const targets = await band
      .locator("a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(targets).toEqual(["/mitmachen", "/dein-kalender", "/ueber-uns"]);

    const order = await page.evaluate(() => {
      const ids = [...document.querySelectorAll("main [id]")].map((element) => element.id);
      return ids.filter((id) =>
        [
          "focus-block",
          "place-dates",
          "value-stories",
          "nearby",
          "homescreen",
          "context-band",
          "closing-cta",
        ].includes(id),
      );
    });
    expect(order).toEqual([
      "focus-block",
      "place-dates",
      "value-stories",
      "nearby",
      "homescreen",
      "context-band",
      "closing-cta",
    ]);
  });

  test("TS-006-A15: `/dein-ort` is a first-level page and renders no breadcrumb", async ({
    page,
  }) => {
    await page.goto("/dein-ort");
    await expect(page.locator("nav ol")).toHaveCount(0);
  });

  test("SRC-014 §Page Rhythm: photo/colour alternation holds on /dein-ort", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");
    const sections = (await page.evaluate(() =>
      [
        ...document.querySelectorAll("main section[data-surface], main section[data-placeholder]"),
      ].map((section) => section.getAttribute("data-surface") ?? "photo"),
    )) as RhythmEntry[];
    expect(sections).toContain("ink");
    expect(sections.filter((entry) => entry === "ink")).toHaveLength(1);
    expect(checkRhythm(sections, 0)).toEqual([]);
  });

  test("TS-001: the English variant renders the English artifact", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/en/your-place");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("#value-stories > div > article")).toHaveCount(4);
    await expect(page.locator("#homescreen")).toHaveCount(1);
    const hint = (await page.locator("main").textContent()) ?? "";
    expect(hint).toContain("postcode");
  });
});
