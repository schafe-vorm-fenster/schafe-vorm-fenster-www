import { expect, test } from "@playwright/test";

import { checkRhythm } from "../../src/components/section-shell/rhythm";

import type { RhythmEntry } from "../../src/components/section-shell/rhythm";
import type { APIRequestContext, Page } from "@playwright/test";

/**
 * TS-WEB-0019 — `/`, the acceptance walk.
 *
 * One test per acceptance criterion, named by its id, at the two reference
 * viewports of TS-WEB-0006 D3 (360 × 640 and 1280 × 800). Criteria that need M4
 * behaviour — live BFF routes (TS-WEB-0008 D2), entry-trait stages (TS-WEB-0010), the
 * JSON-LD graph (TS-WEB-0011 D4) and the analytics collector (TS-WEB-0012) — are
 * marked `test.fixme` with the milestone, so they are *listed and red-flagged*
 * rather than quietly missing. Nothing here is reworded from the spec.
 */

const PHONE = { width: 360, height: 640 };
const DESKTOP = { width: 1280, height: 800 };

/**
 * Block 1 arrives behind a `<Suspense>` boundary whose fallback **is** S1
 * (TS-WEB-0019 D2: "S2 and S3 arrive by island"), so a cold cache serves the
 * fallback first and the resolved block a beat later. Between the two the
 * document briefly holds both — React reveals a boundary by inserting the
 * streamed content and removing the fallback, in that order. Every assertion
 * about block 1's controls waits for that to be over.
 */
async function blockOneSettled(page: Page): Promise<void> {
  await expect(page.locator('[data-cta="primary"]')).toHaveCount(1);
  await expect(page.locator('input[type="search"]')).toHaveCount(2);
}

/**
 * A covered community whose window is empty — TS-WEB-0019 D2's S3, and the only
 * state in which the widening module still renders (polish brief, page 1,
 * fix 2). `EMPTY_DEMO_SLUG` no longer reaches it: the dates capability needs
 * no credential, so the public village calendar answers for Lassan in every
 * environment and Lassan has dates. The walk therefore asks the BFF which of
 * a handful of covered communities is empty right now.
 */
/*
 * `lassan` is back on the list — **last**, and for the other backend.
 *
 * The note above is about `LIVE_DATA=auto`, where Lassan has real dates and
 * so is not empty. Under `LIVE_DATA=mock` the four candidates above are not
 * covered at all (`/api/places/<slug>/events` answers "place not covered"),
 * and `lassan` is the mock's own `EMPTY_DEMO_SLUG` — the covered community
 * F-2-61 gave a neighbour (`zuessow`) precisely so the empty state has
 * something to widen to. With no candidate left, `emptyPlace()` returned
 * `undefined` and three state-B walks skipped themselves silently on every
 * mock run (TS-WEB-0020-A3, TS-WEB-0020-A8's second half, TS-WEB-0019-A4).
 *
 * Appending it costs the `auto` backend nothing: the helper asks the BFF
 * whether a candidate is *actually* empty before returning it, so on `auto`
 * Lassan is passed over exactly as the note above intends, and the earlier
 * candidates answer first anyway.
 */
const EMPTY_PLACE_CANDIDATES = ["achimswalde", "altenhof", "kattenberg", "zwiedorf", "lassan"];

async function emptyPlace(request: APIRequestContext): Promise<string | undefined> {
  for (const slug of EMPTY_PLACE_CANDIDATES) {
    const response = await request.get(`/api/places/${slug}/events?window=upcoming`);
    if (!response.ok()) continue;
    const body = (await response.json()) as {
      data?: { events?: unknown[]; place?: { lat: number; lng: number } };
    };
    if ((body.data?.events ?? []).length > 0) continue;

    // S3's answer *is* the widened radius, so the walk needs a community
    // that has something within it — an empty place in an empty region
    // renders no module at all (TS-WEB-0008 D1: absent, never empty).
    const place = body.data?.place;
    if (place === undefined) continue;
    const near = await request.get(`/api/nearby?lat=${place.lat}&lng=${place.lng}&radius=15`);
    if (!near.ok()) continue;
    const nearBody = (await near.json()) as { data?: { events?: unknown[] } };
    if ((nearBody.data?.events ?? []).length > 0) return slug;
  }
  return undefined;
}

/** The rhythm entry of every section of the page, in DOM order. */
async function sectionRhythm(page: Page): Promise<RhythmEntry[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll("main section[data-surface], main section[data-placeholder]")].map(
      (section) =>
        (section.getAttribute("data-surface") ?? "photo") as
          | "photo"
          | "paper"
          | "surface"
          | "surface-2"
          | "lime-100"
          | "lime-500"
          | "ink"
          | "violet-500",
    ),
  );
}

test.describe("TS-WEB-0019 — home", () => {
  test("TS-WEB-0019-A2: stage 0 shows a search, and the one primary CTA is its submit", async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");

    await blockOneSettled(page);
    // The typeahead sets `role="combobox"` on the same input once it mounts
    // (the ARIA pattern for a field with a suggestion list), so the element
    // is located by what it *is* rather than by the role it reports.
    await expect(page.locator('input[type="search"]').first()).toBeVisible();
    // Every input has its own id — the module renders twice on this page.
    const ids = await page.evaluate(() =>
      [...document.querySelectorAll('input[type="search"]')].map((input) => input.id),
    );
    expect(new Set(ids).size).toBe(ids.length);

    const primary = page.locator('[data-cta="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveAttribute("type", "submit");
    // The submit belongs to the search form, not to some other block.
    await expect(page.locator('form[role="search"] [data-cta="primary"]')).toHaveCount(1);

    // "No element in the first screen links to another page to see what is
    // on": inside the content. The header's four job labels are the *switch*
    // between jobs and stay as they are (TS-WEB-0006 D4).
    const linksAboveTheFold = await page.evaluate((foldHeight) => {
      const main = document.querySelector("main");
      if (!main) return -1;
      return [...main.querySelectorAll("a[href]")].filter(
        (link) => link.getBoundingClientRect().top < foldHeight,
      ).length;
    }, PHONE.height);
    expect(linksAboveTheFold).toBe(0);
  });

  for (const viewport of [PHONE, DESKTOP]) {
    test(`TS-WEB-0006-A3 / TS-WEB-0019-A2: the primary CTA is above the fold at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await blockOneSettled(page);
      const box = await page.locator('[data-cta="primary"]').boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    });

    test(`TS-WEB-0017-A9: no horizontal scroll at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows).toBe(false);
    });
  }

  test("TS-WEB-0019-A3: `?ort=<covered place with dates>` shows the place and 3 rows", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    // `quilow` is a covered demo place with dates — the search takes a name, not
    // a postcode (DEC-0079 §1), so the parameter carries the slug.
    await page.goto("/?ort=quilow");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Das ist los in Quilow",
    );
    // The module slot streams over its S1 fallback: for a few hundred ms the
    // resolved section sits in React's hidden streaming container next to the
    // visible Schlatkow fallback, and a strict locator sees two `#place-dates`.
    // Measured (3 workers, `next dev`): both present at 0 ms, one at 500 ms.
    const dates = page.locator("#place-dates").filter({ visible: true });
    await expect(dates).toContainText("Quilow");
    await expect(dates.locator("article")).toHaveCount(3);

    const primary = page.locator('[data-cta="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveAttribute(
      "href",
      "https://app.schafe-vorm-fenster.de/quilow",
    );
  });

  test("TS-WEB-0019-A4: `?ort=<covered place without dates>` shows the nearby module and the publish CTA", async ({
    page,
    request,
  }) => {
    const slug = await emptyPlace(request);
    test.skip(slug === undefined, "no covered community is empty right now");
    await page.setViewportSize(DESKTOP);
    await page.goto(`/?ort=${slug}`);

    // Position 2 renders under a heading that names its radius, not the place.
    const nearby = page.locator("#nearby");
    await expect(nearby.locator("article").first()).toBeVisible();
    const nearbyHeading = (await nearby.locator("h2").first().innerText()).trim();
    expect(nearbyHeading.toLowerCase()).not.toContain(slug!);

    // A publish-the-first-date CTA targeting the registration route.
    const primary = page.locator('[data-cta="primary"]');
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveAttribute("href", `/mitmachen/registrieren?ort=${slug}`);

    // No text claims dates in that place.
    const dates = (await page.locator("#place-dates").innerText()).trim();
    expect(dates).not.toMatch(/^Das ist los in/m);
  });

  test("TS-WEB-0019-A5: an uncovered place typed into the search navigates to /dein-ort/starten?ort=", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    const field = page.locator('input[type="search"]').first();
    await field.fill("99999"); // the fixture's own uncovered postcode
    await field.press("Enter");

    await expect(page).toHaveURL(/\/dein-ort\/starten\?ort=99999$/);

    // `/` itself renders no uncovered place as data.
    await page.goto("/?ort=99999");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Was wann wo in deinem Ort los ist.",
    );
    const main = await page.locator("main").innerText();
    expect(main).not.toContain("99999");
  });

  test("TS-WEB-0019-A6: three scene blocks, one mechanism and one secondary CTA each, every opener a statement", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    // `[data-mechanism]` is no longer the scene count: the explain module
    // inside the `whatsapp` scene declares one too (DEC-0110 §1). A6 counts
    // the blocks, and all three of them declare `data-block="scene"`.
    const scenes = page.locator('main [data-block="scene"]');
    await expect(scenes).toHaveCount(3);
    expect(
      await scenes.evaluateAll((nodes) =>
        nodes.map((node) => node.querySelector("[data-mechanism]")?.getAttribute("data-mechanism")),
      ),
    ).toEqual(["whatsapp", "embed", "provenance"]);

    /*
     * "Every scene opener, this one included, is a statement: it carries no
     * question mark unless the same block renders the answering sentence
     * directly beneath it" (A6, TS-WEB-0006 D7, SRC-0017 CG-005/CG-006). The
     * three on `/` are statements, so the check is the simple half — the
     * walk asserted the opposite until the 2026-09-22 review.
     */
    const openers = await scenes.evaluateAll((nodes) =>
      nodes.map((node) => node.querySelector("h2")?.textContent?.trim() ?? ""),
    );
    expect(openers).toHaveLength(3);
    for (const opener of openers) expect(opener).not.toContain("?");

    // Exactly one CTA per block, secondary, at the page that owns its job —
    // and no `primary` anywhere inside block 2a (D3a, DEC-0082 §4).
    const ctas = await scenes.evaluateAll((nodes) =>
      nodes.map((node) =>
        [...node.querySelectorAll('[data-cta="secondary"]')].map((cta) =>
          cta.getAttribute("href"),
        ),
      ),
    );
    expect(ctas).toEqual([["/mitmachen"], ["/dein-kalender"], ["/ueber-uns"]]);
    await expect(scenes.locator('[data-cta="primary"]')).toHaveCount(0);

    // Exactly one of the three contains the module, and it is the WhatsApp
    // one; the other two render no step line and no module.
    await expect(page.locator('main [data-block="scene"] [data-explain-module]')).toHaveCount(1);
    const whatsapp = scenes.filter({ has: page.locator('[data-mechanism="whatsapp"]') });
    const explainModule = whatsapp.locator("[data-explain-module]");
    await expect(explainModule).toHaveCount(1);
    await expect(explainModule.locator("[data-explain-ordinal]")).toHaveCount(1);
    const steps = explainModule.locator("[data-explain-step]");
    await expect(steps).toHaveCount(3);
    for (let index = 0; index < 3; index += 1) {
      await expect(steps.nth(index)).toHaveJSProperty("tagName", "BUTTON");
    }
    await expect(explainModule.locator('[data-explain-step][aria-current="step"]')).toHaveCount(1);

    // DOM order inside the scene: opener · module · the block's one concrete
    // instance, a live event row (DEC-0110 §1's render order).
    const order = await whatsapp.evaluate((node) =>
      [...node.querySelectorAll("h2, [data-explain-module], article")].map((element) =>
        element.tagName === "H2"
          ? "opener"
          : element.hasAttribute("data-explain-module")
            ? "module"
            : "instance",
      ),
    );
    expect(order[0]).toBe("opener");
    expect(order.indexOf("module")).toBeLessThan(order.lastIndexOf("instance"));

    // The other two scenes carry neither.
    await expect(
      scenes.filter({ hasNot: page.locator('[data-mechanism="whatsapp"]') }).locator("[data-explain-step]"),
    ).toHaveCount(0);
  });

  test("TS-WEB-0019-A6: the module and its three step lines fit one viewport at 360 × 800", async ({
    page,
  }) => {
    // "the wrapping scene is not held to that budget" (A6, DEC-0110 §1) — so
    // the measurement is the module element, opener and instance excluded.
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");
    const box = await page.locator("[data-explain-module]").first().boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeLessThanOrEqual(800);
  });

  test("TS-WEB-0002-A13: the home instance of the module advances once and its step lines stop it", async ({
    page,
  }) => {
    // The component's own walk runs on `/mitmachen` (`e2e/motion-reveal.spec.ts`);
    // this is the criterion's home instance — the module inside a scene, in
    // the position TS-WEB-0019 D3a's `direct` order gives it (first of 2a).
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const explainModule = page.locator("[data-explain-module]").first();
    await expect(explainModule).toHaveAttribute("data-state", "1");

    // Block 2a begins below the fold in every state of D2, so page load
    // starts nothing (D3a's trigger table, row "first").
    await page.waitForTimeout(5_000);
    await expect(explainModule).toHaveAttribute("data-state", "1");

    const steps = explainModule.locator("[data-explain-step]");
    await expect(steps).toHaveCount(3);
    await steps.nth(2).focus();
    await page.keyboard.press("Enter");
    await expect(explainModule).toHaveAttribute("data-state", "3");
    await expect(explainModule).toHaveAttribute("data-advance", "stopped");
  });

  test.fixme(
    "TS-WEB-0019-A7: the entry trait reorders the scenes and changes nothing else [M4 — TS-WEB-0010 stages]",
    () => {},
  );

  test("TS-WEB-0019-A8: the proof stream renders exactly 5 elements", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    await expect(page.locator("#proof-stream article")).toHaveCount(5);
  });

  test("TS-WEB-0019-A9: DOM order is block 1 · scenes · provenance · proof · band · closing", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    const ids = await page.evaluate(() =>
      [...document.querySelectorAll("main [id]")]
        .map((element) => element.id)
        .filter((id) =>
          [
            "focus-block",
            "place-dates",
            "nearby",
            "scene-1",
            "scene-2",
            "scene-3",
            "live-counters",
            "proof-stream",
            "context-band",
            "closing-cta",
          ].includes(id),
        ),
    );

    /**
     * **Changed by the polish pass** (brief, page 1, fixes 2 and 5) and again
     * by the 2026-09-22 review (DEC-0129).
     *
     * `nearby` is gone from this list because it is gone from every state
     * but S3: the page opened on two five-row lists with the same three
     * titles in both, which is 1.6 phone screens of rows before the first
     * argument. `live-counters` moved *into* `place-dates`, directly under
     * the rows it counts, and the violet band that used to carry it
     * disappeared with the block.
     *
     * `provenance-stamps` is gone too. Block 2b's content has been the
     * provenance **scene** since the polish pass; the one element that still
     * stood apart carried the sentence "Gebaut von jemandem … Seit 2018 in
     * Betrieb.", and "gebaut"/"betrieben" about this product are on the copy
     * guide's avoid list (CG-033, CG-040). The block is still in this
     * position — it is `scene-3` — and the walk below asserts the surface
     * that D3 gives it.
     */
    expect(ids).toEqual([
      "focus-block",
      "place-dates",
      "live-counters",
      "scene-1",
      "scene-2",
      "scene-3",
      "proof-stream",
      "context-band",
      "closing-cta",
    ]);

    // Block 2b, where D3 puts it and on the ground D3 gives it.
    await expect(page.locator("#scene-3")).toHaveAttribute("data-surface", "violet-500");

    // Nothing after the closing CTA inside `main`; the contact section and
    // the footer follow it as chrome (TS-WEB-0006 D2 as amended by DEC-0081
    // §2, TS-WEB-0006-A17).
    const afterClosing = await page.evaluate(() => {
      const closing = document.querySelector("#closing-cta");
      const nodes: string[] = [];
      let cursor = closing?.closest("main > *")?.nextElementSibling ?? null;
      while (cursor) {
        nodes.push(cursor.tagName);
        cursor = cursor.nextElementSibling;
      }
      return nodes;
    });
    expect(afterClosing).toEqual([]);

    const afterMain = await page.evaluate(
      () => document.querySelector("main")?.nextElementSibling?.id ?? "",
    );
    expect(afterMain).toBe("kontakt");
  });

  test("TS-WEB-0019-A10 / TS-WEB-0006-A6: the context band names the three non-focus jobs, the closing block repeats block 1", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    // Block 1 reveals one of its two variants after hydration; until it has,
    // two `data-cta="primary"` submits stand in the document and the hero
    // lookup below is ambiguous (F-2-71, same race as F-2-30's).
    await blockOneSettled(page);

    const band = page.locator("#context-band nav");
    await expect(band).toHaveCount(1);
    const targets = await band.locator("a").evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    );
    expect(targets).toEqual(["/mitmachen", "/dein-kalender", "/ueber-uns"]);
    expect(targets).not.toContain("/dein-ort");

    // The closing block repeats block 1's primary: same module, same submit
    // label, same target — and not the `data-cta="primary"` marker.
    const closing = page.locator('#closing-cta form[role="search"]');
    await expect(closing).toHaveCount(1);
    await expect(closing).toHaveAttribute("action", "/dein-ort");
    await expect(page.locator('#closing-cta [data-cta="primary"]')).toHaveCount(0);

    const heroSubmit = await page
      .locator('form[role="search"] [data-cta="primary"]')
      .textContent();
    const closingSubmit = await closing.locator('button[type="submit"]').textContent();
    expect(closingSubmit).toBe(heroSubmit);
  });

  test("TS-WEB-0019-A11: with JavaScript disabled the page is complete", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    // The **visible** controls. Without JavaScript the `<Suspense>` fallback
    // that block 1 streams over stays in the document — hidden, but present
    // — so counting nodes counts the shell twice; what A11 is about is what
    // the visitor can use, which is block 1's field and the closing one.
    const visibleSearchFields = await page.evaluate(
      () =>
        [...document.querySelectorAll('input[type="search"]')].filter(
          (input) => input.getBoundingClientRect().height > 0,
        ).length,
    );
    expect(visibleSearchFields).toBe(2); // block 1 and the closing block
    await expect(page.locator('main [data-block="scene"]')).toHaveCount(3);
    // The `whatsapp` scene's module is server-rendered at state 1 with all
    // three step lines, so a JavaScript-less load is complete (A11,
    // DEC-0105 §6's reduced-motion fallback already requires that state).
    const explainModule = page.locator("[data-explain-module]");
    await expect(explainModule).toHaveCount(1);
    await expect(explainModule).toHaveAttribute("data-state", "1");
    await expect(explainModule.locator("[data-explain-step]")).toHaveCount(3);
    await expect(page.locator("#proof-stream article")).toHaveCount(5);
    await expect(page.locator("#context-band nav")).toHaveCount(1);
    await expect(page.locator("#closing-cta")).toHaveCount(1);
    // No skeleton and no empty box remains.
    await expect(page.locator('[aria-hidden="true"][class*="skeleton"]')).toHaveCount(0);

    await context.close();
  });

  test("TS-WEB-0005-A13: the selection is the engine's, and reproducible across reloads", async ({
    page,
  }) => {
    // DEC-0048's count for this surface is 5, and it holds while the pool is
    // smaller than the surface: "an unfilled position weakens the claim, it
    // does not shorten the stream" (SRC-0001 §4).
    //
    // The `/ueber-uns` half of this walk moved to that page's own spec. A
    // home-page acceptance test asserting another page's card count was a
    // coupling defect: `/ueber-uns` composes its stream differently since the
    // polish pass (one feature card plus compact rows, G-7) and its count is
    // that page's decision, not this one's.
    const positionsOf = async (path: string, selector: string) => {
      await page.goto(path);
      return page.locator(selector).evaluateAll((nodes) =>
        nodes.map((node) => node.textContent?.trim().slice(0, 60) ?? ""),
      );
    };

    const selector = "#proof-stream article, #proof-stream [data-empty-proof]";
    const home = await positionsOf("/", selector);
    expect(home).toHaveLength(5);

    // TS-WEB-0005-A4: same trait, same place, same result. The page is stage 0
    // here and the ISO-week seed is the only variety input, so a reload
    // inside the same week reproduces the order exactly.
    expect(await positionsOf("/", selector)).toEqual(home);
  });

  test("TS-WEB-0019-A12: the JSON-LD graph is one WebSite and one Organization, no Event", async ({
    page,
  }) => {
    await page.goto("/");

    const scripts = page.locator('script[type="application/ld+json"]');
    // TS-WEB-0011 D4: one graph per page, not one script per node.
    await expect(scripts).toHaveCount(1);

    const graph = JSON.parse((await scripts.textContent()) ?? "{}");
    expect(graph["@context"]).toBe("https://schema.org");

    const types = (graph["@graph"] as { "@type": string }[]).map((node) => node["@type"]);
    expect(types).toEqual(["WebPage", "WebSite", "Organization"]);
    expect(types.filter((type) => type === "WebSite")).toHaveLength(1);
    expect(types.filter((type) => type === "Organization")).toHaveLength(1);
    // D4's "deliberately not emitted" table: event markup belongs to the app.
    expect(JSON.stringify(graph)).not.toContain('"Event"');
  });

  test("TS-WEB-0019-A13: the calendar handover emits save-calendar-to-homescreen once", async ({
    page,
  }) => {
    // The tracker is the mock (TS-WEB-0012, plan/guardrails.md): it logs and
    // records nothing, so the console line *is* the event, and its absence
    // from the network is half of what A13 asserts.
    const events: string[] = [];
    page.on("console", (message) => {
      if (message.text().includes("[analytics:mock] conversion")) events.push(message.text());
    });
    const requests: string[] = [];
    page.on("request", (request) => {
      if (new URL(request.url()).origin !== new URL(page.url() || "http://x").origin) {
        requests.push(request.url());
      }
    });

    await page.goto("/");
    const handover = page.locator('#place-dates a[rel~="external"], #place-dates a[target="_blank"], #place-dates a[href^="https://app."]').first();
    await expect(handover).toBeVisible();
    // The listener lives in a client component, so the click has to land
    // after hydration or nothing is logged. Wait for the tracker's own
    // signal rather than for a timeout (F-2-71).
    await expect(
      page.locator('[data-conversion-tracker="save-calendar-to-homescreen"]').first(),
    ).toHaveAttribute("data-hydrated", "true");

    // The click navigates off-site; the event must fire without the link
    // being delayed (TS-WEB-0012 D9), so the listener is enough — no
    // `preventDefault`, and the assertion is on what was logged.
    await handover.click({ modifiers: ["Shift"] }).catch(() => undefined);
    await expect
      .poll(() => events.filter((line) => line.includes("save-calendar-to-homescreen")).length)
      .toBe(1);

    const saves = events.filter((line) => line.includes("save-calendar-to-homescreen"));
    expect(saves).toHaveLength(1);
  });

  test("TS-WEB-0019-A14: the counter block renders the dates figure and nothing else", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    const counters = page.locator("#live-counters");
    await expect(counters).toHaveCount(1);
    const text = (await counters.textContent()) ?? "";
    expect(text).not.toMatch(/\bOrte\b|\bplaces\b/i);
    expect(text).not.toMatch(/Aktualisierungen|updates today/i);
    // Exactly one figure badge inside the counter module.
    // One badge: the figure. Its `Demo-Daten` twin went with Jan's decision
    // of 2026-09-18 — the module declares itself in `data-demo` instead, and
    // `e2e/content-compliance.spec.ts` asserts that half.
    await expect(counters.locator("span[data-tone]")).toHaveCount(1);
  });

  test("SRC-0014 §Page Rhythm: photo/colour alternation holds on /", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const sections = await sectionRhythm(page);
    expect(sections.length).toBeGreaterThan(5);
    expect(checkRhythm(sections, 0)).toEqual([]);
  });

  test("TS-WEB-0006-A5: all four jobs are one click away", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")].map((link) => link.getAttribute("href")),
    );
    for (const job of ["/dein-ort", "/mitmachen", "/dein-kalender", "/ueber-uns"]) {
      expect(hrefs).toContain(job);
    }
  });

  test("TS-WEB-0006-A15: `/` renders no breadcrumb trail", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Startseite" })).toHaveCount(1); // the header nav only
    await expect(page.locator("nav ol")).toHaveCount(0);
  });

  test("TS-WEB-0001: the English variant renders the English artifact", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "What's on where you live, and when.",
    );
    await expect(page.locator("#proof-stream article")).toHaveCount(5);
    await expect(page.locator('form[role="search"] [data-cta="primary"]')).toHaveCount(1);
  });
});
