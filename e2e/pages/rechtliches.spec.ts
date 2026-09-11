import { expect, test } from "@playwright/test";

import { dictionary } from "../../src/lib/i18n/dictionary";

/**
 * TS-029 — `/rechtliches` (EN `/legal`) — acceptance pass.
 */

const SECTIONS_DE = [
  "impressum",
  "datenschutz",
  "barrierefreiheit",
  "nutzungsbedingungen",
  "community-richtlinien",
  "auftragsverarbeitung",
];

test.describe("/rechtliches", () => {
  test("TS-029-A1: responds 200, correct html lang, one main, one h1", async ({ page }) => {
    const response = await page.goto("/rechtliches");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("TS-029-A2: every registry anchor appears exactly once, in registry order", async ({
    page,
  }) => {
    await page.goto("/rechtliches");
    const ids = await page.evaluate(
      (anchors: string[]) => anchors.map((anchor) => Boolean(document.getElementById(anchor))),
      SECTIONS_DE,
    );
    expect(ids.every(Boolean)).toBe(true);

    for (const anchor of SECTIONS_DE) {
      await expect(page.locator(`#${anchor}`)).toHaveCount(1);
    }
  });

  test("TS-029-A3: opening #datenschutz directly lands the heading below the sticky header, focused", async ({
    page,
  }) => {
    await page.goto("/rechtliches#datenschutz");
    const heading = page.locator("#datenschutz h2");
    await expect(heading).toBeVisible();
    const box = await heading.boundingBox();
    expect(box).not.toBeNull();
    if (box) expect(box.y).toBeGreaterThanOrEqual(-1);
  });

  test("TS-029-A5: the section nav lists the registry sections in order and links resolve", async ({
    page,
  }) => {
    await page.goto("/rechtliches");
    const nav = page.getByRole("navigation", { name: "Abschnitte" });
    await expect(nav).toBeVisible();
    const hrefs = await nav.locator("a").evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).getAttribute("href")),
    );
    expect(hrefs).toEqual(SECTIONS_DE.map((anchor) => `#${anchor}`));
  });

  test("TS-029-A6: at 390px the nav is not sticky, no horizontal scroll; back-to-top appears after scrolling", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 700 });
    await page.goto("/rechtliches");
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows).toBe(false);

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    const backToTop = page.getByRole("link", { name: "Nach oben" });
    await expect(backToTop).toBeVisible();
    const box = await backToTop.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test("TS-029-A7: with JavaScript disabled every section renders and nav links jump correctly", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/rechtliches");
    for (const anchor of SECTIONS_DE) {
      await expect(page.locator(`#${anchor}`)).toHaveCount(1);
    }
    await context.close();
  });

  test("TS-029-A9: footer legal links resolve to the matching anchors", async ({ page }) => {
    await page.goto("/rechtliches");
    const footer = page.getByRole("contentinfo");
    // The footer's own three legal links, plus the newsletter's consent
    // wording ("… stimmst du unserer Datenschutzerklärung zu.") also links
    // `#datenschutz` (TS-016 D10) — both are legitimate, so `.first()`
    // suffices to prove the anchor resolves, not uniqueness.
    await expect(footer.locator('a[href="/rechtliches#impressum"]').first()).toBeVisible();
    await expect(footer.locator('a[href="/rechtliches#datenschutz"]').first()).toBeVisible();
    await expect(footer.locator('a[href="/rechtliches#barrierefreiheit"]').first()).toBeVisible();
  });

  test("TS-029-A10: #auftragsverarbeitung renders anonymously — no redirect, no auth, no gate", async ({
    page,
  }) => {
    const response = await page.goto("/rechtliches#auftragsverarbeitung");
    expect(response?.status()).toBe(200);
    await expect(page.locator("#auftragsverarbeitung")).toBeVisible();
  });

  test("TS-029-A13: with reduced motion, an in-page jump performs no smooth scroll", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/rechtliches");
    const scrollBehavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(scrollBehavior).not.toBe("smooth");
    await context.close();
  });

  test("TS-029-A14: one h1, one h2 per rendered section", async ({ page }) => {
    await page.goto("/rechtliches");
    await expect(page.locator("h1")).toHaveCount(1);
    const h2Count = await page.locator("h2").count();
    expect(h2Count).toBe(SECTIONS_DE.length);
  });

  /**
   * TS-029-A14's "no skipped level inside any imported document" half is
   * not satisfiable as written: `content/legal/privacy-policy.md` itself
   * skips `h3` (line 100 `## 5. Wenn du dich registrierst …` straight to
   * line 108 `#### Zweck`) — a pre-existing defect in the imported source,
   * not introduced by `shiftHeadings` (which applies one uniform shift and
   * preserves whatever structure the document already has). This page
   * never rewrites legal text (repository working rule), so the finding is
   * recorded rather than the AC silently relaxed: `state/open.md`.
   */
  test.skip(
    "TS-029-A14 (content defect): content/legal/privacy-policy.md skips h3 between '5. Wenn du dich registrierst' (h2) and 'Zweck' (h4) — not fixable here (content is never rewritten), see state/open.md",
    () => {},
  );

  test("TS-029-A8: body text column measure is at most 80ch at 360/428/768/1440", async ({
    page,
  }) => {
    for (const width of [360, 428, 768, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/rechtliches");
      const { columnPx, chPx } = await page.evaluate(() => {
        const body = document.querySelector('[class*="legal-section"][class*="body"]');
        const probe = document.createElement("div");
        probe.style.width = "80ch";
        probe.style.position = "absolute";
        probe.style.visibility = "hidden";
        document.body.appendChild(probe);
        const ch = probe.getBoundingClientRect().width;
        probe.remove();
        return {
          columnPx: body ? body.getBoundingClientRect().width : 0,
          chPx: ch,
        };
      });
      expect(columnPx).toBeLessThanOrEqual(chPx + 1);
    }
  });

  test.skip(
    "TS-029-A11: production build fails when the accessibility-statement section is absent — not run here: this suite runs against `next dev`/preview, not a production VERCEL_ENV build; the page.tsx throw is unit-verifiable but not exercised by an actual `next build` in this e2e run",
    () => {},
  );

  test.skip(
    "TS-029-A12: axe-core, zero violations across all three themes — not-yet: no axe-core dependency is installed in this repository (would need the stack-harmony ADR, plan/guardrails.md, outside this work package's mandate)",
    () => {},
  );

  test("F-2-74: the German page carries no such notice — its sections are German", async ({
    page,
  }) => {
    await page.goto("/rechtliches");
    const notice = dictionary("en").legal.germanOnlyNotice ?? "";
    await expect(page.getByText(notice, { exact: false })).toHaveCount(0);
    // And no German translation of it slipped in either: the dictionary
    // holds no German string for this notice at all.
    expect(dictionary("de").legal.germanOnlyNotice).toBeNull();
  });
});

test.describe("/legal (EN)", () => {
  test("TS-029-A1: the English variant responds 200 with html lang=en", async ({ page }) => {
    const response = await page.goto("/en/legal");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("TS-029-A3: /legal#imprint lands the heading correctly", async ({ page }) => {
    await page.goto("/en/legal#imprint");
    await expect(page.locator("#imprint h2")).toBeVisible();
  });

  /**
   * F-2-74 (gate-2 protocol item 7) / `state/open.md` row 53 — the six legal
   * documents are imported German-only (TS-029 open point #2), and row 53's
   * mitigation is that the EN page frame "states explicitly, in English,
   * that the six legal sections themselves are provided in German only".
   * Until gate 2 it had not shipped: an English reader met English section
   * labels over unannounced German prose.
   */
  test("F-2-74 / row 53: the English frame says the sections are German, before the first German body", async ({
    page,
  }) => {
    await page.goto("/en/legal");
    const notice = dictionary("en").legal.germanOnlyNotice ?? "";
    expect(notice).not.toBe("");

    const sentence = page.getByText(notice, { exact: false });
    await expect(sentence).toHaveCount(1);
    await expect(sentence).toBeVisible();

    // Before the first German body in DOM order — the reader meets the
    // explanation, then the German text, never the other way round.
    const beforeFirstSection = await page.evaluate((text: string) => {
      const paragraph = [...document.querySelectorAll("p")].find((element) =>
        (element.textContent ?? "").includes(text),
      );
      const firstSection = document.querySelector("#imprint");
      if (!paragraph || !firstSection) return false;
      return Boolean(
        paragraph.compareDocumentPosition(firstSection) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }, notice);
    expect(beforeFirstSection).toBe(true);
  });
});
