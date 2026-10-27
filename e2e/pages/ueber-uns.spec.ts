import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

import { formatPriceParts } from "../../src/components/price-tag/format";
import { publishedFigure } from "../../src/lib/pricing/offerings";

/**
 * TS-WEB-0027 — `/ueber-uns` — acceptance pass, against the amended criteria.
 *
 * Four of them read differently since 2026-09-25 and this file follows them
 * rather than the shipped page:
 *
 *  - **A1/A10** — the page has a conversion of its own (DEC-0081 §6) and
 *    exactly **one** `data-cta="primary"`, the closing CTA, resolving to this
 *    page's contact section. It used to assert zero.
 *  - **A3** — the first viewport carries the `h1` and chapter 01 and **no
 *    `data-cta` at all** (DEC-0082 amendment C: a provenance page's visitor
 *    arrived to judge, not to convert); chapter 02 tells the mayoralty in its
 *    own text, with no second proof line (DEC-0175 §2).
 *  - **A2/A4** — no counter, no year figure, no place count and no "seit …"
 *    claim anywhere (D4); the origin block derives the price from neither
 *    affordability nor a missing salesperson (DEC-0084 §2).
 *  - **A9** — the team block renders the people the artifact names, each once,
 *    in a 4:5 media box. The G-9 text-only shape is gone: the team portrait is
 *    own work with unrestricted use, so there is a cleared portrait to show,
 *    and Christian Sauer is off the block (review R-ueber-10).
 *
 * The wording of no assertion here is the criterion (DEC-0083): the h1, the
 * headings and the bio are copy, and the checks read structure, position,
 * attributes and the one price token.
 */

/** One conversion the mock tracker logged, as `mock-tracker.ts` passes it. */
interface LoggedConversion {
  readonly goalId: string;
  readonly stage: string;
  readonly attributes?: Readonly<Record<string, string | number | boolean>>;
}

interface ConversionWindow {
  __conversions?: LoggedConversion[];
}

/**
 * Capture the mock tracker's conversions in the page, before its scripts run —
 * the same init-script shape `e2e/contact-section.spec.ts` uses, and for the
 * same reason: Chromium's console formatting drops the nested `attributes`
 * object, so reading the line from Playwright's side cannot see a route or a
 * channel.
 */
async function captureConversions(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const captured: LoggedConversion[] = [];
    (window as ConversionWindow).__conversions = captured;
    const info = console.info.bind(console);
    console.info = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].startsWith("[analytics:mock] conversion")) {
        try {
          captured.push(JSON.parse(JSON.stringify(args[1])) as LoggedConversion);
        } catch {
          // Not serialisable — it would show up as a missing event, never a pass.
        }
      }
      info(...args);
    };
  });
}

async function conversions(page: Page): Promise<LoggedConversion[]> {
  return page.evaluate(() => (window as ConversionWindow).__conversions ?? []);
}

test.describe("/ueber-uns", () => {
  test("TS-WEB-0027-A1 / A10: exactly one data-cta=\"primary\", and it is the closing CTA into #kontakt", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const primaries = page.locator('[data-cta="primary"]');
    await expect(primaries).toHaveCount(1);
    // It stands inside the closing block and resolves to this page's own
    // contact section through the route facade.
    await expect(page.locator('#closing-cta [data-cta="primary"]')).toHaveCount(1);
    await expect(primaries).toHaveAttribute("href", "/ueber-uns#kontakt");
    // No repeat rung below it (DEC-0082 amendment C) — the primary is last.
    await expect(page.locator('[data-cta="repeat"]')).toHaveCount(0);
    // The section it points at follows the closing block (TS-WEB-0006-A17).
    await expect(page.locator("section#kontakt")).toHaveCount(1);
    await expect(page.locator('section#kontakt [data-cta="primary"]')).toHaveCount(0);
  });

  test("TS-WEB-0027-A2: the D2 chapter order, two photo sections never adjacent, no counter", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const blocks = await page
      .locator("#main [data-block]")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-block")));
    // D2 as amended by DEC-0162: the owner's design of 2026-10-12, top to
    // bottom — chapter 01, the quote band, chapter 02, chapter 03 (the
    // stream as stories), the person, the principles, the award.
    expect(blocks).toEqual([
      "kapitel-1",
      "zitat",
      "kapitel-2",
      "kapitel-3",
      "team",
      "grundsaetze",
      "auszeichnung",
    ]);

    // And the order ends there: the contact section stands after the last block
    // and before the footer (TS-WEB-0006-A17, DEC-0081 §2).
    const closing = await page.evaluate(() => {
      const blocks = [...document.querySelectorAll("#main [data-block]")];
      const last = blocks.at(-1);
      const contact = document.querySelector("section#kontakt");
      const footer = document.querySelector("body > footer, footer[role='contentinfo']");
      if (!last || !contact || !footer) return { found: false, afterLast: false, beforeFooter: false };
      return {
        found: true,
        afterLast: last.compareDocumentPosition(contact) === Node.DOCUMENT_POSITION_FOLLOWING,
        beforeFooter: contact.compareDocumentPosition(footer) === Node.DOCUMENT_POSITION_FOLLOWING,
      };
    });
    expect(closing).toEqual({ found: true, afterLast: true, beforeFooter: true });

    // One `h1`, and it is the stage's.
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("#herkunft h1")).toHaveCount(1);

    // Two photo sections — the stage and the quote band — and never two in a
    // row: the direct sibling after each one is not a photo section.
    const photos = page.locator("#main section[style*='--photo-image']");
    await expect(photos).toHaveCount(2);
    const adjacent = await photos.evaluateAll((nodes) =>
      nodes.some((node) => {
        const next = node.nextElementSibling;
        return next instanceof HTMLElement && (next.getAttribute("style") ?? "").includes("--photo-image");
      }),
    );
    expect(adjacent).toBe(false);

    await expect(page.locator("aside#context-band")).toHaveCount(1);
    await expect(page.locator("#closing-cta")).toHaveCount(1);
    await expect(page.locator("aside#context-band #closing-cta")).toHaveCount(0);

    // D4: no counter module, no year figure, no place count, no "seit …" claim
    // about the service (DEC-0132 §10).
    await expect(page.locator("[data-block='betrieb']")).toHaveCount(0);
    await expect(page.locator("[data-live-counter], [data-counter]")).toHaveCount(0);
    const main = await page.locator("#main").innerText();
    expect(main).not.toMatch(/\bseit\s+\d{4}/i);
    expect(main).not.toMatch(/\bseit\s+\d+\s+Jahren\s+(in\s+Betrieb|online|am\s+Netz)/i);
    // No figure for the village's size (CG-034, DEC-0162 §3).
    expect(main).not.toMatch(/\d+\s+Einwohner/);
  });

  test("TS-WEB-0027-A3: the first viewport carries the h1 and chapter 01, and no data-cta", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ueber-uns");
    await expect(page.locator("h1")).toBeInViewport();
    // The story starts on the first screen: chapter 01's heading is in it
    // (DEC-0162 §1 — the narrative order of the owner's design).
    await expect(page.locator("#kapitel-1-h2")).toBeInViewport();
    // DEC-0082 amendment C: the first viewport carries no CTA at all.
    for (const cta of await page.locator("[data-cta]").all()) {
      await expect(cta).not.toBeInViewport();
    }
    // Chapter 02 is its heading and one text: the mayoralty is said there
    // once, with no second proof element repeating it and no source line that
    // names no article (D3 as amended, DEC-0175 §2, CG-046, CG-047).
    const chapter2 = page.locator("[data-block='kapitel-2']");
    await expect(chapter2.locator("[data-inline-proof]")).toHaveCount(0);
    await expect(chapter2.locator("h2")).toHaveCount(1);
    await expect(chapter2.locator("[class*='chapterBody'] > p")).toHaveCount(1);
  });

  test("TS-WEB-0006-A3: the other fold viewport carries no data-cta either", async ({ page }) => {
    // A3 names both reference viewports and exempts this route from the fold
    // clause at both: "the first viewport carries no `data-cta` at all".
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/ueber-uns");
    await expect(page.locator("h1")).toBeInViewport();
    for (const cta of await page.locator("[data-cta]").all()) {
      await expect(cta).not.toBeInViewport();
    }
  });

  test("TS-WEB-0027-A4: the principles promise the free calendar, carry one price token, and argue the need", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const block = await page.locator("[data-block='grundsaetze']").innerText();
    // Exactly one price token on the whole page, and it is the licence's — and
    // the token is built from the offering package rather than typed here, so a
    // figure that drifts from `portalize-calendar` fails this case instead of
    // shipping. The sentence in the content artefact carries the figure (the
    // slot's `price-tag` is `withheld` so the block shows it once); the chain to
    // the package is `src/lib/pricing/offerings.ts`, which
    // `src/lib/pricing/offerings.test.ts` holds against
    // `node_modules/@schafe-vorm-fenster/offerings/*.offering.md` (A4's
    // "value, currency and interval equal @schafe-vorm-fenster/offerings",
    // TS-WEB-0006 D10, DEC-0132 §9).
    const licence = publishedFigure("portalize-calendar", "de");
    const parts = formatPriceParts(licence, "de");
    const currencySymbol = parts.amount.replace(/[\d\s., ]/g, "");
    expect(currencySymbol, "the package's currency has a symbol").not.toBe("");
    const priceToken = new RegExp(`${licence.amount}\\s*${currencySymbol}`, "g");
    const body = await page.locator("body").innerText();
    expect(body.match(priceToken) ?? []).toHaveLength(1);
    expect(block).toMatch(priceToken);
    // The interval word the package's `interval` resolves to, in this page's
    // language — a figure without its interval is a different price.
    expect(parts.interval, "the package's figure names an interval").toBeTruthy();
    expect(block).toMatch(new RegExp(`\\b${parts.interval}\\b`));
    expect(block).toMatch(/kostenlos/i);
    // DEC-0084 §2: no clause about a salesperson, and none about affording it.
    expect(block).not.toMatch(/Vertrieb|Verkäufer|leisten/i);
    // No figure for the village's size is hard-coded in page or component
    // source — the number lives in the content artifact only.
    expect(block).not.toMatch(/rund 400/);
  });

  test("TS-WEB-0027-A5 / A6: at most 7 elements, no empty slot and no placeholder, never backfilled", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const stream = page.locator("[data-block='kapitel-3']");
    const stories = stream.locator("[data-story]");
    expect(await stories.count()).toBeGreaterThan(0);
    expect(await stories.count()).toBeLessThanOrEqual(7);
    // A6 as amended (DEC-0175 §3): the uncleared testimonial position renders
    // nothing — no hatched card, no "Beleg fehlt", no sentence about a gap.
    await expect(page.locator("[data-empty-proof]")).toHaveCount(0);
    const text = await stream.innerText();
    expect(text).not.toMatch(/Beleg fehlt|Freigabe/);
    // Every item is a story: nothing else sits in the list.
    await expect(stream.locator("ul > li")).toHaveCount(await stories.count());
    const html = await page.content();
    expect(html).not.toContain("Kulturlandbüro Uecker-Randow");
  });

  test("TS-WEB-0027-A17: every story opens and closes in place by mouse and keyboard, and no sibling moves sideways", async ({
    page,
  }) => {
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/ueber-uns");
      const stories = page.locator("[data-block='kapitel-3'] [data-story]");
      const count = await stories.count();
      expect(count).toBeGreaterThan(1);
      // Measure the resting layout: the section's one-shot reveal rise (22 px)
      // has to be over before a box is read, or the rise is mistaken for a
      // jump. Scroll it in, wait for the reveal, then for every animation.
      await stories.first().scrollIntoViewIfNeeded();
      await expect(
        page.locator("[data-block='kapitel-3'] [data-armed='true']:not([data-revealed='true'])"),
      ).toHaveCount(0);
      await page.evaluate(async () => {
        // Two frames, so a reveal that has just been flagged has its animation.
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        await Promise.all(document.getAnimations().map((animation) => animation.finished));
      });
      // One column at every width: every item starts at the same x and has
      // the same width (DEC-0175 §1 — an accordion, not a reflowing grid).
      const boxes = () =>
        stories.evaluateAll((nodes) =>
          nodes.map((node) => {
            const rect = node.getBoundingClientRect();
            return { x: rect.x, y: rect.y + window.scrollY, width: rect.width };
          }),
        );
      const before = await boxes();
      expect(new Set(before.map((box) => Math.round(box.x))).size, `${width}px: one column`).toBe(1);
      expect(new Set(before.map((box) => Math.round(box.width))).size, `${width}px: one width`).toBe(1);

      // Open the second story: no item moves horizontally or changes its
      // width, nothing above it moves at all, and only items below it move
      // down.
      await stories.nth(1).locator("summary").click();
      const after = await boxes();
      for (let index = 0; index < count; index += 1) {
        expect(after[index]!.x, `${width}px item ${index} x`).toBeCloseTo(before[index]!.x, 0);
        expect(after[index]!.width, `${width}px item ${index} width`).toBeCloseTo(before[index]!.width, 0);
        if (index <= 1) expect(after[index]!.y, `${width}px item ${index} y`).toBeCloseTo(before[index]!.y, 0);
        else expect(after[index]!.y, `${width}px item ${index} y`).toBeGreaterThanOrEqual(before[index]!.y);
      }
    }

    await page.goto("/ueber-uns");
    const stories = page.locator("[data-block='kapitel-3'] [data-story]");
    const count = await stories.count();
    const details = stories.locator("details");
    const openStates = () => details.evaluateAll((nodes) => nodes.map((node) => (node as HTMLDetailsElement).open));

    // Server HTML: the first story is open, the rest are closed.
    expect(await openStates()).toEqual([true, ...Array(count - 1).fill(false)]);
    // Every story carries its text and its title as a heading.
    for (let index = 0; index < count; index += 1) {
      await expect(stories.nth(index).locator("h3")).toHaveCount(1);
      expect((await stories.nth(index).locator("details p").textContent())?.trim().length).toBeGreaterThan(40);
    }

    // Mouse: opening the second leaves the first open — the items are
    // independent, so opening one never closes (and moves) another.
    await stories.nth(1).locator("summary").click();
    expect(await openStates()).toEqual([true, true, ...Array(count - 2).fill(false)]);
    await expect(stories.nth(1).locator("details p")).toBeVisible();
    await expect(stories.nth(0).locator("details p")).toBeVisible();
    // …and a second click closes it in place.
    await stories.nth(1).locator("summary").click();
    expect((await openStates())[1]).toBe(false);

    // Keyboard: focus the third toggle and press Enter, then Space closes it.
    const third = stories.nth(2).locator("summary");
    await third.focus();
    await page.keyboard.press("Enter");
    expect((await openStates())[2]).toBe(true);
    await page.keyboard.press("Space");
    expect((await openStates())[2]).toBe(false);

    // The toggle is a 44 px target.
    const box = await third.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  });

  test("TS-WEB-0027-A17: without JavaScript every story is reachable", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/ueber-uns");
    const stories = page.locator("[data-block='kapitel-3'] [data-story]");
    const count = await stories.count();
    expect(count).toBeGreaterThan(1);
    // Native `<details>`: a click opens a closed story with no script at all.
    await stories.nth(count - 1).locator("summary").click();
    await expect(stories.nth(count - 1).locator("details p")).toBeVisible();
    // No placeholder mark ships (#55): no demo-marked story and no draft label.
    await expect(page.locator("[data-block='kapitel-3'] [data-story][data-demo]")).toHaveCount(0);
    const text = await page.locator("#main").innerText();
    expect(text).not.toMatch(/PLATZHALTER|ENTWURF/);
    await context.close();
  });

  test("TS-WEB-0027-A8: the award block carries exactly one link, to the archive", async ({ page }) => {
    await page.goto("/ueber-uns");
    const block = page.locator("[data-block='auszeichnung']");
    await expect(block).toHaveCount(1);
    await expect(block.getByRole("link")).toHaveCount(1);
    // In the page itself — the footer links there as well since DEC-0166.
    await expect(page.locator('main a[href="/ueber-uns/archiv"]')).toHaveCount(1);
    // No teasers, no counts, no thumbnails (D6).
    await expect(block.locator("img, li")).toHaveCount(0);
  });

  test("TS-WEB-0027-A9: every person the artifact names renders once, in a 4:5 media box", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const team = page.locator("[data-block='team']");
    const profiles = team.locator("article");
    await expect(profiles).toHaveCount(1);
    const teamText = await team.innerText();
    expect(teamText).toContain("Jan-Henrik Hempel");
    // Christian Sauer is off the block (review R-ueber-10); his record is
    // `status: draft`, `press_clearance: unverified`.
    expect(teamText).not.toContain("Christian Sauer");
    // A cleared portrait, in the 4:5 box the criterion asks for — never a
    // blank box, never omitted.
    const portrait = profiles.locator("img");
    await expect(portrait).toHaveCount(1);
    const box = await portrait.first().boundingBox();
    expect(box).not.toBeNull();
    // `ratio-portrait` is 4 / 5 (`app/styles/components.css`).
    expect(box!.width / box!.height).toBeCloseTo(0.8, 1);
  });

  test("DEC-0162 §1: the chapters carry the sourced story, and the founder quote is a quote card on the photo band", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    await expect(page.locator("[data-block='kapitel-1']")).toContainText("Bäckerwagen");
    await expect(page.locator("[data-block='kapitel-2']")).toContainText("Schafweide");
    const band = page.locator("[data-block='zitat']");
    const quote = band.locator("[data-quote-card]");
    await expect(quote).toHaveCount(1);
    await expect(quote.locator("blockquote")).toContainText(
      "Wenn man alles sammelt, ist plötzlich in jedem Dorf jeden Tag irgendwas los.",
    );
    await expect(quote.getByRole("link")).toHaveAttribute(
      "href",
      "https://www.zukunftswege-ost-vorpommern.de/vollblutdigitalisierer-von-schlatkow",
    );
    // The rights holder's credit is printed on the band.
    await expect(band).toContainText("openTransfer.de");
    // The placeholder anecdotes are gone (#55), and so is the reserved proof
    // place's stand-in (issue 105, DEC-0175 §3): nothing in the page's own blocks
    // is demo-marked.
    await expect(page.locator('#main [data-block] [data-demo="true"]')).toHaveCount(0);
  });

  test("G-7: no raw proof id, no badge repeating the source label", async ({ page }) => {
    await page.goto("/ueber-uns");
    const main = await page.locator("#main").innerText();
    expect(main).not.toMatch(/founder-former-volunteer-mayor/);
    expect(main).not.toMatch(/\(cleared\)/);
    expect(main).not.toMatch(/^\s*Beleg\s*$/m);

  });

  test("DEC-0162 §1: the stage is the kicker, the h1 and the photograph, nothing else", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ueber-uns");
    const hero = page.locator("#herkunft");
    const text = (await hero.innerText()).trim();
    expect(text.split("\n").filter(Boolean)).toHaveLength(2);
    await expect(hero.locator("[data-cta]")).toHaveCount(0);
    // The village argument stands in the principles.
    await expect(page.locator("[data-block='grundsaetze']")).toContainText("Ehrenamt");
  });

  test("TS-WEB-0027-A13: the page's own controls emit no conversion event", async ({ page }) => {
    await captureConversions(page);
    await page.goto("/ueber-uns");
    // Loading the page emits nothing.
    expect(await conversions(page)).toEqual([]);

    // The closing CTA is in-page navigation into the contact section: counting
    // it would count one intent twice (D9).
    await page.locator('#closing-cta [data-cta="primary"]').click();
    await expect(page).toHaveURL(/#kontakt$/);
    expect(await conversions(page)).toEqual([]);

    // The archive link is a page change, so the capture is read before it.
    await page.goto("/ueber-uns");
    await page.locator('main a[href="/ueber-uns/archiv"]').click();
    await expect(page).toHaveURL(/\/ueber-uns\/archiv$/);
    expect(await conversions(page)).toEqual([]);
  });

  test("TS-WEB-0027-A16: no sending system, so the newsletter block does not render at all", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    await expect(page.locator("[data-block='newsletter']")).toHaveCount(0);
    await expect(page.locator("[data-newsletter]")).toHaveCount(0);
    await expect(page.locator("#newsletter-email")).toHaveCount(0);
    // And no form on the page that would take data (TS-WEB-0006-A17).
    await expect(page.locator("form:not([method='get' i])")).toHaveCount(0);
  });

  test("F-2-33: the English page renders its own language", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.locator("[data-block='team'] h2")).toHaveText("Jan-Henrik Hempel");
    await expect(page.locator("[data-block='kapitel-3'] h2")).toHaveText(
      "Then it became more than bread rolls.",
    );
    await expect(page.locator('[data-cta="primary"]')).toHaveAttribute(
      "href",
      "/en/about#kontakt",
    );
  });

  test("TS-WEB-0027-A12: exactly one Organization JSON-LD node, no Person nodes", async ({ page }) => {
    await page.goto("/ueber-uns");
    // One `<script>` per page (TS-WEB-0011 D4), so the nodes are read out of the
    // page's one `@graph`. The criterion is unchanged.
    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1);

    const graph = JSON.parse((await scripts.textContent()) ?? "{}");
    const nodes = graph["@graph"] as Record<string, unknown>[];
    const organizations = nodes.filter((node) => node["@type"] === "Organization");
    const persons = nodes.filter((node) => node["@type"] === "Person");
    expect(organizations).toHaveLength(1);
    expect(persons).toHaveLength(0);
    // D4: a reference by `@id`, never a second full node — the page describes
    // the organisation nowhere, it points at the description on `/`.
    expect(Object.keys(organizations[0]!).sort()).toEqual(["@id", "@type"]);
  });

  test("TS-WEB-0004-A1: no horizontal scroll at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    const response = await page.goto("/ueber-uns");
    expect(response?.status()).toBe(200);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows).toBe(false);
  });
});
