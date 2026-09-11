import { expect, test } from "@playwright/test";

import { checkRhythm } from "../../src/components/section-shell/rhythm";

import type { RhythmEntry } from "../../src/components/section-shell/rhythm";
import type { Page } from "@playwright/test";

/**
 * TS-019 — `/`, the acceptance walk.
 *
 * One test per acceptance criterion, named by its id, at the two reference
 * viewports of TS-006 D3 (360 × 640 and 1280 × 800). Criteria that need M4
 * behaviour — live BFF routes (TS-008 D2), entry-trait stages (TS-010), the
 * JSON-LD graph (TS-011 D4) and the analytics collector (TS-012) — are
 * marked `test.fixme` with the milestone, so they are *listed and red-flagged*
 * rather than quietly missing. Nothing here is reworded from the spec.
 */

const PHONE = { width: 360, height: 640 };
const DESKTOP = { width: 1280, height: 800 };

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

test.describe("TS-019 — home", () => {
  test("TS-019-A2: stage 0 shows a search, and the one primary CTA is its submit", async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");

    await expect(page.getByRole("searchbox").first()).toBeVisible();
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
    // between jobs and stay as they are (TS-006 D4).
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
    test(`TS-006-A3 / TS-019-A2: the primary CTA is above the fold at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const box = await page.locator('[data-cta="primary"]').boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    });

    test(`TS-017-A9: no horizontal scroll at ${viewport.width}×${viewport.height}`, async ({
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

  test.fixme(
    "TS-019-A3: `?ort=<covered place with dates>` shows the place and 3 rows [M4 — TS-008 D2 BFF routes]",
    () => {},
  );

  test.fixme(
    "TS-019-A4: `?ort=<covered place without dates>` shows the nearby module and the publish CTA [M4 — TS-008 D2/D4]",
    () => {},
  );

  test.fixme(
    "TS-019-A5: an uncovered place typed into the search navigates to /dein-ort/starten?ort= [M4 — TS-008 D7 classification]",
    () => {},
  );

  test("TS-019-A6: exactly three scenes, one mechanism each, every opener a question", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    const scenes = page.locator("[data-mechanism]");
    await expect(scenes).toHaveCount(3);
    expect(await scenes.evaluateAll((nodes) => nodes.map((n) => n.getAttribute("data-mechanism"))))
      .toEqual(["whatsapp", "embed", "provenance"]);

    const openers = await scenes.evaluateAll((nodes) =>
      nodes.map((node) => node.querySelector("h2")?.textContent?.trim() ?? ""),
    );
    expect(openers).toHaveLength(3);
    for (const opener of openers) expect(opener.endsWith("?")).toBe(true);
  });

  test.fixme(
    "TS-019-A7: the entry trait reorders the scenes and changes nothing else [M4 — TS-010 stages]",
    () => {},
  );

  test("TS-019-A8: the proof stream renders exactly 5 elements", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    await expect(page.locator("#proof-stream article")).toHaveCount(5);
  });

  test("TS-019-A9: DOM order is block 1 · scenes · provenance · proof · band · closing", async ({
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
            "provenance-stamps",
            "live-counters",
            "proof-stream",
            "context-band",
            "closing-cta",
          ].includes(id),
        ),
    );

    expect(ids).toEqual([
      "focus-block",
      "place-dates",
      "nearby",
      "scene-1",
      "scene-2",
      "scene-3",
      "provenance-stamps",
      "live-counters",
      "proof-stream",
      "context-band",
      "closing-cta",
    ]);

    // Nothing after the closing CTA but the global footer (TS-006 D2).
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
  });

  test("TS-019-A10 / TS-006-A6: the context band names the three non-focus jobs, the closing block repeats block 1", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

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

  test("TS-019-A11: with JavaScript disabled the page is complete", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    await expect(page.getByRole("searchbox")).toHaveCount(2); // block 1 and the closing block
    await expect(page.locator("[data-mechanism]")).toHaveCount(3);
    await expect(page.locator("#proof-stream article")).toHaveCount(5);
    await expect(page.locator("#context-band nav")).toHaveCount(1);
    await expect(page.locator("#closing-cta")).toHaveCount(1);
    // No skeleton and no empty box remains.
    await expect(page.locator('[aria-hidden="true"][class*="skeleton"]')).toHaveCount(0);

    await context.close();
  });

  test("TS-005-A13: the selection is the engine's, and the same on two pages across reloads", async ({
    page,
  }) => {
    // DEC-048's counts, per surface: 5 on home, 7 in the `/ueber-uns` stream,
    // 3 inline. A count that holds while the pool is smaller than the surface
    // is what "an unfilled position weakens the claim, it does not shorten
    // the stream" means in the DOM (SRC-001 §4).
    const positionsOf = async (path: string, selector: string) => {
      await page.goto(path);
      return page.locator(selector).evaluateAll((nodes) =>
        nodes.map((node) => node.textContent?.trim().slice(0, 60) ?? ""),
      );
    };

    const home = await positionsOf("/", "#proof-stream article, #proof-stream [data-empty-proof]");
    expect(home).toHaveLength(5);

    const about = await positionsOf(
      "/ueber-uns",
      '[aria-labelledby="belegstrom"] article, [aria-labelledby="belegstrom"] [data-empty-proof]',
    );
    expect(about).toHaveLength(7);

    // TS-005-A4: same trait, same place, same result. Both pages are stage 0
    // here, and the ISO-week seed is the only variety input, so a reload
    // inside the same week reproduces the order exactly.
    expect(
      await positionsOf("/", "#proof-stream article, #proof-stream [data-empty-proof]"),
    ).toEqual(home);
    expect(
      await positionsOf("/ueber-uns", '[aria-labelledby="belegstrom"] article, [aria-labelledby="belegstrom"] [data-empty-proof]'),
    ).toEqual(about);
  });

  test("TS-019-A12: the JSON-LD graph is one WebSite and one Organization, no Event", async ({
    page,
  }) => {
    await page.goto("/");

    const scripts = page.locator('script[type="application/ld+json"]');
    // TS-011 D4: one graph per page, not one script per node.
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

  test("TS-019-A13: the calendar handover emits save-calendar-to-homescreen once", async ({
    page,
  }) => {
    // The tracker is the mock (TS-012, plan/guardrails.md): it logs and
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

    // The click navigates off-site; the event must fire without the link
    // being delayed (TS-012 D9), so the listener is enough — no
    // `preventDefault`, and the assertion is on what was logged.
    await handover.click({ modifiers: ["Shift"] }).catch(() => undefined);
    await page.waitForTimeout(250);

    const saves = events.filter((line) => line.includes("save-calendar-to-homescreen"));
    expect(saves).toHaveLength(1);
  });

  test("TS-019-A14: the counter block renders the dates figure and nothing else", async ({
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
    await expect(counters.locator("span[data-tone]")).toHaveCount(2); // the figure + its Demo-Daten badge
  });

  test("SRC-014 §Page Rhythm: photo/colour alternation holds on /", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const sections = await sectionRhythm(page);
    expect(sections.length).toBeGreaterThan(5);
    expect(checkRhythm(sections, 0)).toEqual([]);
  });

  test("TS-006-A5: all four jobs are one click away", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")].map((link) => link.getAttribute("href")),
    );
    for (const job of ["/dein-ort", "/mitmachen", "/dein-kalender", "/ueber-uns"]) {
      expect(hrefs).toContain(job);
    }
  });

  test("TS-006-A15: `/` renders no breadcrumb trail", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Startseite" })).toHaveCount(1); // the header nav only
    await expect(page.locator("nav ol")).toHaveCount(0);
  });

  test("TS-001: the English variant renders the English artifact", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("What's on where you live?");
    await expect(page.locator("#proof-stream article")).toHaveCount(5);
    await expect(page.locator('form[role="search"] [data-cta="primary"]')).toHaveCount(1);
  });
});
