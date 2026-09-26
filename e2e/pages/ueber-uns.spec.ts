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
 *  - **A3** — the first viewport carries the `h1` and the honorary-mayor claim
 *    with its proof element and **no `data-cta` at all** (DEC-0082 amendment C:
 *    a provenance page's visitor arrived to judge, not to convert).
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

  test("TS-WEB-0027-A2: the D2 block order, exactly one photo section, no counter", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const blocks = await page
      .locator("#main [data-block]")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-block")));
    // D2's beat order — origin, proof stream, archive, team. The story section
    // D2 does not list stands after the stream rather than before it, because
    // A3's second clause fixes the distance to the first proof element
    // (DEC-0132 §8); the case below measures it.
    expect(blocks).toEqual([
      "dorfargument",
      "belegstrom",
      "herkunftsgeschichte",
      "archiv-verweis",
      "team",
    ]);

    // One `h1`, and it is the hero's.
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("#herkunft h1")).toHaveCount(1);

    // Exactly one photo section, so no two can be adjacent — the founder
    // portrait runs full width inside a `paper` section, it is not a second
    // photo surface. A photo section is a `section` carrying `--photo-image`.
    await expect(page.locator("#main section[style*='--photo-image']")).toHaveCount(1);

    // The band and the closing block are two sections now, not the merged
    // three-job offer: the page has a conversion of its own.
    await expect(page.locator("aside#context-band")).toHaveCount(1);
    await expect(page.locator("#closing-cta")).toHaveCount(1);
    await expect(page.locator("aside#context-band #closing-cta")).toHaveCount(0);

    // D4: no counter module, no year figure, no place count, no "seit …" claim.
    // This is also TS-WEB-0018-A12 on this route, in its strongest form: the
    // criterion asks that a counter module be absent when the stats upstream is
    // stubbed empty, and here the module is deleted outright, so there is no
    // upstream state in which one renders.
    await expect(page.locator("[data-block='betrieb']")).toHaveCount(0);
    await expect(page.locator("[data-live-counter], [data-counter]")).toHaveCount(0);
    const main = await page.locator("#main").innerText();
    // D4's "no 'seit …' claim anywhere on the page" is read as a claim about the
    // **service** — a static traction claim, which is what D4's own rationale
    // forbids (`FUN-WEB-0041`, TS-WEB-0008-A10). The founder's bio says
    // "Beruflich mache ich seit 25 Jahren IT", which is a fact about a person and
    // is the owner's own wording (R-ueber-10); widening the pattern to every
    // "seit …" would fail on it, so the assertion holds the year form the
    // deleted counter module would have produced (DEC-0132 §10).
    expect(main).not.toMatch(/\bseit\s+\d{4}/i);
    expect(main).not.toMatch(/\bseit\s+\d+\s+Jahren\s+(in\s+Betrieb|online|am\s+Netz)/i);
  });

  test("TS-WEB-0027-A3: the first viewport carries the h1 and the honorary-mayor proof, and no data-cta", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ueber-uns");
    await expect(page.locator("h1")).toBeInViewport();
    // The claim and its proof element are the origin block's one inline proof.
    const proof = page.locator("[data-block='dorfargument'] article");
    await expect(proof).toHaveCount(1);
    await expect(proof).toBeInViewport();
    // DEC-0082 amendment C: the first viewport carries no CTA at all.
    for (const cta of await page.locator("[data-cta]").all()) {
      await expect(cta).not.toBeInViewport();
    }

    // A3's second clause, measured rather than assumed: "the first proof
    // element of the stream is reached within the second viewport height (≤ 1
    // further screen of scrolling)" — at 1280 × 800 the budget is 1600 px from
    // the top of the document. It was 2087 px while the story section stood
    // between the origin and the stream, and no assertion caught it, so the
    // number is read off the document here and the case fails on the position
    // alone (DEC-0132 §8).
    const firstProofTop = await page
      .locator("[data-block='belegstrom'] article")
      .first()
      .evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
    expect(firstProofTop, "first stream element within 2 × viewport height").toBeLessThanOrEqual(
      2 * 800,
    );
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

  test("TS-WEB-0027-A4: the origin block promises the free calendar, carries one price token, and argues the need", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const block = await page.locator("[data-block='dorfargument']").innerText();
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

  test("TS-WEB-0027-A5 / A6: at most 7 elements, exactly one empty slot, named and never backfilled", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const stream = page.locator("[data-block='belegstrom']");
    // Scoped to the stream container: only `article` is unique to one card each.
    const cards = stream.locator("article");
    const emptySlot = stream.locator("[data-empty-proof]");
    expect(await cards.count()).toBeLessThanOrEqual(6);
    await expect(emptySlot).toHaveCount(1);
    // D5: the reserved place shows its label and its sentence, and is in the
    // accessibility tree rather than `aria-hidden`.
    await expect(emptySlot).not.toHaveAttribute("aria-hidden", "true");
    expect((await emptySlot.innerText()).trim().length).toBeGreaterThan(0);
    await expect(emptySlot.locator("img")).toHaveCount(0);
    // It does not animate and does not change: identical text after 5 s.
    const before = await emptySlot.innerText();
    await page.waitForTimeout(5000);
    expect(await emptySlot.innerText()).toBe(before);
    // No `unverified` element reaches the HTML (A5) — the pending testimonial
    // in the artifact is not rendered.
    const html = await page.content();
    expect(html).not.toContain("Kulturlandbüro Uecker-Randow");
  });

  test("TS-WEB-0027-A8: the archive is its own block with exactly one link", async ({ page }) => {
    await page.goto("/ueber-uns");
    const block = page.locator("[data-block='archiv-verweis']");
    await expect(block).toHaveCount(1);
    await expect(block.getByRole("link")).toHaveCount(1);
    await expect(page.locator('a[href="/ueber-uns/archiv"]')).toHaveCount(1);
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

  test("brief page 10, item 2: the story, the anecdotes and the founder quote as a quote card", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const section = page.locator("[data-block='herkunftsgeschichte']");
    await expect(section).toHaveCount(1);
    const text = await section.innerText();
    expect(text).toContain("Bäckerwagen");
    expect(text).toContain("Schafweide");
    // Several paragraphs, not one (review R-ueber-7).
    expect(await section.locator("p").count()).toBeGreaterThanOrEqual(4);
    // The quote and its source are one designed element with the concrete
    // article as an outbound link (R-ueber-6, CG-028).
    const quote = section.locator("[data-quote-card]");
    await expect(quote).toHaveCount(1);
    await expect(quote.locator("blockquote")).toContainText(
      "Wenn man alles sammelt, ist plötzlich in jedem Dorf jeden Tag irgendwas los.",
    );
    await expect(quote.getByRole("link")).toHaveAttribute(
      "href",
      "https://www.zukunftswege-ost-vorpommern.de/vollblutdigitalisierer-von-schlatkow",
    );
    // The anecdote paragraphs are marked: nobody wrote them (DEC-0132 §4).
    expect(await section.locator('[data-demo="true"]').count()).toBeGreaterThanOrEqual(3);
  });

  test("G-7: no raw proof id, no badge repeating the source label", async ({ page }) => {
    await page.goto("/ueber-uns");
    const main = await page.locator("#main").innerText();
    expect(main).not.toMatch(/founder-former-volunteer-mayor/);
    expect(main).not.toMatch(/\(cleared\)/);
    expect(main).not.toMatch(/^\s*Beleg\s*$/m);

    // One emphasis per stream: the first card is the feature, the rest are
    // compact hairline rows (never seven identical cards).
    const stream = page.locator("[data-block='belegstrom']");
    const emphases = await stream
      .locator("article")
      .evaluateAll((nodes) => nodes.map((node) => node.className));
    expect(emphases.length).toBeGreaterThan(1);
    expect(emphases.filter((name) => /feature/.test(name))).toHaveLength(1);
    expect(emphases.filter((name) => /compact/.test(name))).toHaveLength(emphases.length - 1);
  });

  test("brief page 10, item 1: the hero is the h1 and the photograph, nothing else", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/ueber-uns");
    const hero = page.locator("#herkunft");
    const text = (await hero.innerText()).trim();
    expect(text.split("\n")).toHaveLength(1);
    await expect(hero.locator("[data-cta]")).toHaveCount(0);
    // The village argument stands in the section below it.
    await expect(page.locator("[data-block='dorfargument']")).toContainText("Ehrenamt");
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
    await page.locator('a[href="/ueber-uns/archiv"]').click();
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
    await expect(page.locator("[data-block='team'] h2")).toHaveText("Team");
    await expect(page.locator("[data-block='belegstrom'] h2")).toHaveText("What others say");
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
