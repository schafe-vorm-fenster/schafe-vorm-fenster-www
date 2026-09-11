import { expect, test } from "@playwright/test";

import { checkRhythm } from "../../src/components/section-shell/rhythm";

import type { RhythmEntry } from "../../src/components/section-shell/rhythm";

/**
 * TS-021 — `/dein-ort/starten`, the acceptance walk.
 *
 * This page is a pure function of URL and language (D4), so most of its
 * criteria are testable today: the parameter contract, the no-fake-coverage
 * rule, the handover, the tone boundary against `/dein-ort` state B. What
 * needs M4 is the classification that *leads* here (TS-008 D7), the
 * re-resolution redirect of D5, and the analytics negative of A12 — each is
 * `test.fixme` with its milestone. Nothing is reworded.
 */

const PHONE = { width: 360, height: 640 };
const DESKTOP = { width: 1280, height: 800 };

const PLACE = "Testdorf";

test.describe("TS-021 — start the calendar in your place", () => {
  for (const viewport of [PHONE, DESKTOP]) {
    test(`TS-021-A2: with JavaScript disabled the page renders and the CTA is above the fold at ${viewport.width}×${viewport.height}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.setViewportSize(viewport);
      await page.goto(`/dein-ort/starten?ort=${PLACE}`);

      await expect(page.getByRole("heading", { level: 1 })).toContainText(PLACE);

      const primary = page.locator('[data-cta="primary"]');
      await expect(primary).toHaveCount(1);
      const box = await primary.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);

      await context.close();
    });

    test(`TS-017-A9: no horizontal scroll at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/dein-ort/starten?ort=${PLACE}`);
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows).toBe(false);
    });
  }

  test("TS-021-A3: no parameter, an empty one and a 200-character one all render the placeless variant", async ({
    page,
  }) => {
    const long = "a".repeat(200);
    for (const path of [
      "/dein-ort/starten",
      "/dein-ort/starten?ort=",
      `/dein-ort/starten?ort=${long}`,
    ]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);

      // The same blocks, in the same order.
      for (const id of [
        "focus-block",
        "what-it-takes",
        "live-example",
        "who-starts-it",
        "search-again",
        "context-band",
        "closing-cta",
      ]) {
        await expect(page.locator(`#${id}`), `${id} on ${path}`).toHaveCount(1);
      }

      // No visible `undefined`, `null` or `{place}` token.
      const text = (await page.locator("body").innerText()) ?? "";
      expect(text, path).not.toMatch(/undefined|\bnull\b|\{ort\}|\{place\}/i);

      // The CTA is present, without a prefill value.
      const href = await page.locator('[data-cta="primary"]').getAttribute("href");
      expect(href, path).toBe("/mitmachen/registrieren");
    }
  });

  test("TS-021-A4: the searched place appears only where D6 allows it", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(`/dein-ort/starten?ort=${PLACE}`);

    // Not in the live-example module's heading, and not in any of its rows.
    const headings = await page.locator("#live-example h3").allInnerTexts();
    expect(headings.length).toBeGreaterThan(0);
    for (const heading of headings) expect(heading).not.toContain(PLACE);
    const rows = await page.locator("#live-example article").allInnerTexts();
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) expect(row).not.toContain(PLACE);

    // Not in the indexed surface.
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe("https://www.schafe-vorm-fenster.de/dein-ort/starten");
    const title = await page.title();
    expect(title).not.toContain(PLACE);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description ?? "").not.toContain(PLACE);
    const og = await page
      .locator('meta[property^="og:"]')
      .evaluateAll((tags) => tags.map((tag) => tag.getAttribute("content") ?? "").join(" "));
    expect(og).not.toContain(PLACE);
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(jsonLd.join("")).not.toContain(PLACE);

    // And no `app.*` href exists on this page at all (D8).
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")].map((link) => link.getAttribute("href") ?? ""),
    );
    expect(hrefs.some((href) => href.includes("app.schafe-vorm-fenster.de"))).toBe(false);
  });

  test("TS-021-A5: an injection payload executes nothing and is never echoed", async ({
    page,
  }) => {
    let dialogs = 0;
    page.on("dialog", async (dialog) => {
      dialogs += 1;
      await dialog.dismiss();
    });

    for (const payload of ["<script>alert(1)</script>", '"><img src=x onerror=alert(1)>']) {
      const response = await page.goto(
        `/dein-ort/starten?ort=${encodeURIComponent(payload)}`,
      );
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const text = (await page.locator("body").innerText()) ?? "";
      expect(text).not.toContain("alert(1)");
      // The parameter is dropped, so the registration link carries no value.
      const href = await page.locator('[data-cta="primary"]').getAttribute("href");
      expect(href).toBe("/mitmachen/registrieren");
    }
    expect(dialogs).toBe(0);
  });

  test("TS-021-A6: this page and `/dein-ort` share no copy string", async ({ page }) => {
    /**
     * The page's *own* sentences: `main` without the two blocks the layout
     * renders on every page (context band, closing CTA) and without the
     * mocked live rows, which are data from one shared fixture rather than
     * copy. What is left is what each artifact wrote.
     */
    const ownCopy = () =>
      page.evaluate(() => {
        const main = document.querySelector("main");
        if (!main) return [];
        const clone = main.cloneNode(true) as HTMLElement;
        for (const drop of clone.querySelectorAll(
          "#context-band, #closing-cta, [data-demo], article[class*='event-row']",
        )) {
          drop.remove();
        }
        return (clone.innerText ?? clone.textContent ?? "")
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 30);
      });

    await page.goto(`/dein-ort/starten?ort=${PLACE}`);
    const start = await ownCopy();

    await page.goto("/dein-ort");
    const place = new Set(await ownCopy());

    // The interim ZIP-only hint is the one string the search module carries
    // wherever it stands (TS-008 D7, one component everywhere).
    const shared = start.filter(
      (line) => place.has(line) && !line.startsWith("Suche nach Ortsnamen"),
    );
    expect(shared).toEqual([]);

    // And the sentence SRC-002 reserves for `/dein-ort` state B is not here.
    await page.goto(`/dein-ort/starten?ort=${PLACE}`);
    const text = (await page.locator("main").innerText()) ?? "";
    expect(text).not.toContain("du könntest die Erste sein");
  });

  test.fixme(
    "TS-021-A6 (first half): searching an uncovered place from `/` or `/dein-ort` lands here [M4 — TS-008 D7 classification]",
    () => {},
  );

  test.fixme(
    "TS-021-A7: a value that now resolves produces exactly one 302 to /dein-ort?ort=<slug> [M4 — TS-008 D7 / DEC-070 re-resolution]",
    () => {},
  );

  test.fixme(
    "TS-021-A8: with the place-search upstream down the page renders as uncovered [M4 — TS-008 D5]",
    () => {},
  );

  test("TS-021-A9: the primary CTA is a plain link to the registration route, JavaScript or not", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/dein-ort/starten?ort=${PLACE}`);

    const primary = page.locator('[data-cta="primary"]');
    await expect(primary).toHaveCount(1);
    expect(await primary.evaluate((node) => node.tagName)).toBe("A");
    await expect(primary).toHaveAttribute("href", `/mitmachen/registrieren?ort=${PLACE}`);

    await primary.click();
    await expect(page).toHaveURL(new RegExp(`/mitmachen/registrieren\\?ort=${PLACE}$`));

    await context.close();
  });

  test("TS-021-A9: a value that needs encoding travels encoded and unchanged", async ({
    page,
  }) => {
    await page.goto("/dein-ort/starten?ort=Gro%C3%9F%20Kiesow");
    const href = await page.locator('[data-cta="primary"]').getAttribute("href");
    expect(href).toBe("/mitmachen/registrieren?ort=Gro%C3%9F+Kiesow");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Groß Kiesow");
  });

  test("TS-021-A10: exactly one primary CTA, a context band of three jobs, a closing block that repeats block 1", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(`/dein-ort/starten?ort=${PLACE}`);

    await expect(page.locator('[data-cta="primary"]')).toHaveCount(1);

    const band = page.locator("#context-band nav");
    await expect(band).toHaveCount(1);
    const targets = await band
      .locator("a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(targets).toEqual(["/dein-ort", "/dein-kalender", "/ueber-uns"]);

    const primaryHref = await page.locator('[data-cta="primary"]').getAttribute("href");
    const primaryLabel = (await page.locator('[data-cta="primary"]').innerText()).trim();
    const closing = page.locator("#closing-cta a");
    await expect(closing).toHaveAttribute("href", primaryHref!);
    expect((await closing.innerText()).trim()).toBe(primaryLabel);
    await expect(page.locator('#closing-cta [data-cta="primary"]')).toHaveCount(0);
  });

  test.fixme(
    "TS-021-A12: no tracker request carries a conversion-goal name [M4 — TS-012 analytics is not built]",
    () => {},
  );

  test("TS-021-A13: the place name reserves its box before paint, and nothing shifts", async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);

    for (const path of [
      "/dein-ort/starten",
      `/dein-ort/starten?ort=${PLACE}`,
      "/dein-ort/starten?ort=Sankt%20Peter-Ording%20an%20der%20Nordsee",
    ]) {
      await page.goto(path);

      // The box is reserved before the content arrives: `hero-block` sets a
      // `min-height` of two display line boxes on the headline.
      const reserved = await page.locator("h1").evaluate((node) => {
        const styles = getComputedStyle(node);
        return {
          minHeight: Number.parseFloat(styles.minHeight),
          lineHeight: Number.parseFloat(styles.lineHeight),
        };
      });
      expect(reserved.minHeight).toBeGreaterThanOrEqual(reserved.lineHeight * 2 - 1);

      // And nothing shifts after paint — the value is server-rendered, and
      // the example module declares its geometry before its rows arrive.
      const shift = await page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let total = 0;
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                const layoutShift = entry as PerformanceEntry & {
                  value: number;
                  hadRecentInput: boolean;
                };
                if (!layoutShift.hadRecentInput) total += layoutShift.value;
              }
            });
            observer.observe({ type: "layout-shift", buffered: true });
            setTimeout(() => {
              observer.disconnect();
              resolve(total);
            }, 2500);
          }),
      );
      expect(shift, path).toBeLessThan(0.1);
    }
  });

  test.fixme(
    "TS-021-A14: walk `/` → search an uncovered place → this page → CTA → registration [M4 — TS-008 D7 classification]",
    () => {},
  );

  test("TS-006-A15: the breadcrumb trail stands before the h1, and its last item is not a link", async ({
    page,
  }) => {
    await page.goto(`/dein-ort/starten?ort=${PLACE}`);

    const trail = page.locator("nav ol");
    await expect(trail).toHaveCount(1);
    await expect(trail.locator("li")).toHaveCount(2);
    await expect(trail.locator("a")).toHaveCount(1);
    await expect(trail.locator('[aria-current="page"]')).toHaveCount(1);
    // The current item is not a link.
    expect(
      await trail.locator('[aria-current="page"]').evaluate((node) => node.tagName),
    ).not.toBe("A");
    // No CTA treatment inside the trail (TS-006 D2).
    await expect(trail.locator("[data-cta]")).toHaveCount(0);

    // Before the h1 in DOM order.
    const trailBeforeHeading = await page.evaluate(() => {
      const nav = document.querySelector("nav ol");
      const heading = document.querySelector("h1");
      if (!nav || !heading) return false;
      return Boolean(
        nav.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
    expect(trailBeforeHeading).toBe(true);
  });

  test("SRC-014 §Page Rhythm: photo/colour alternation holds on /dein-ort/starten", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(`/dein-ort/starten?ort=${PLACE}`);
    const sections = (await page.evaluate(() =>
      [
        ...document.querySelectorAll("main section[data-surface], main section[data-placeholder]"),
      ].map((section) => section.getAttribute("data-surface") ?? "photo"),
    )) as RhythmEntry[];
    expect(sections.filter((entry) => entry === "ink")).toHaveLength(1);
    expect(checkRhythm(sections, 0)).toEqual([]);
  });

  test("TS-001: the English variant renders the English artifact and keeps the parameter", async ({
    page,
  }) => {
    await page.goto(`/en/your-place/start?ort=${PLACE}`);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(PLACE);
    await expect(page.locator('[data-cta="primary"]')).toHaveAttribute(
      "href",
      `/en/take-part/register?ort=${PLACE}`,
    );
  });
});
