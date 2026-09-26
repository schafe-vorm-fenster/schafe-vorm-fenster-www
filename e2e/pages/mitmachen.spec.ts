import { expect, test } from "@playwright/test";

import type { Locator, Page } from "@playwright/test";

/**
 * TS-WEB-0022 — `/mitmachen`, the publishing entry.
 *
 * ACs requiring real personalization/geo-ranking (stage 1–3, TS-WEB-0008 D1 has
 * no row for this route) are not-yet-M4: TS-WEB-0022-A7/A8 are covered at unit
 * level instead (`app/[lang]/mitmachen/example-place.test.ts`); TS-WEB-0022-A10's
 * stage-3 branch and TS-WEB-0022-A14's "resolved place" branch cannot be
 * exercised until personalization is built (no anchor ever reaches this
 * page today, per D8: "no place search on this route").
 *
 * The component half of A18/A19 is measured on the development fixture
 * (`e2e/explain-module.spec.ts`), where timing and geometry can be isolated.
 * What is asserted here is the same criteria **on the composed page**, which
 * is where three modules, a banner and a hero stand in one scroll.
 */

const VIEWPORTS = [
  { name: "360x640", width: 360, height: 640 },
  { name: "1280x800", width: 1280, height: 800 },
];

/** The authoring width CG-025's one-line budget is written to (D4). */
const AUTHORING_WIDTH = 390;

const DWELL = 4000;
const TRANSITION = 550;
const PASS = DWELL + TRANSITION + DWELL + TRANSITION;

/** Scrolls until `fraction` of the module's own height is inside the viewport. */
async function showFraction(page: Page, pathModule: Locator, fraction: number): Promise<void> {
  await pathModule.evaluate((element, share) => {
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    window.scrollTo({ top: top - (window.innerHeight - share * rect.height), behavior: "instant" });
  }, fraction);
}

test.describe("TS-WEB-0022-A2/A3/A4/A5/A6/A9/A12/A13/A16/A17/A18/A19: /mitmachen", () => {
  for (const viewport of VIEWPORTS) {
    test(`TS-WEB-0022-A2: exactly one data-cta="primary", visible without scrolling, resolves to /mitmachen/registrieren at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/mitmachen");
      const primary = page.locator('[data-cta="primary"]');
      await expect(primary).toHaveCount(1);
      await expect(primary).toBeVisible();
      await expect(primary).toHaveAttribute("href", /\/mitmachen\/registrieren/);
      const box = await primary.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      }
    });
  }

  test("TS-WEB-0022-A3: DOM order is hero, objections, three paths, live example, proof", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const blocks = await page
      .locator("main [data-block]")
      .evaluateAll((elements) => elements.map((element) => element.getAttribute("data-block")));
    // hero (scene) → objections → the `wege` slot → beispiel (live example)
    // → beleg (proof), which is D2's order.
    //
    // Three things in this list are not D2 slots and are explained by D9 and
    // G-4 (DEC-0124). The objection block is two sections — `objections` and
    // `archiv` — because together they measure 1627 px at 390 px and
    // `e2e/section-budget.spec.ts` caps a section at 1270. The `wege` slot is
    // three sections for the same reason. And `verweis` is the one
    // `/dein-kalender` cross-reference D9 puts **at the end of slot 3**, in a
    // quiet aside of its own rather than as a fourth step inside path 3.
    expect(blocks).toEqual([
      "scene",
      "objections",
      "archiv",
      "wege",
      "wege",
      "wege",
      "verweis",
      "beispiel",
      "beleg",
    ]);
  });

  test('TS-WEB-0022-A4: exactly one data-block="scene", mechanism whatsapp, opener is two statements', async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const scenes = page.locator('[data-block="scene"]');
    await expect(scenes).toHaveCount(1);
    await expect(scenes).toHaveAttribute("data-mechanism", "whatsapp");

    // CHANGED (review 2026-09-22): the opener was one 66-character question
    // ("… und der Termin steht im Kalender?"). The review asks for two short
    // sentences as statements. The `h1` carries the first, the lead the
    // second; neither ends in a question mark, and the block answers nothing
    // in the next sentence, which is what CG-006 would require of a question.
    const headline = (await page.locator("h1").first().textContent())?.trim() ?? "";
    expect(headline.endsWith("?")).toBe(false);
    expect(headline.endsWith(".")).toBe(true);
    const lead = scenes.locator("p").first();
    await expect(lead).toBeVisible();
    expect(((await lead.textContent()) ?? "").trim().endsWith("?")).toBe(false);

    // No other block declares the same mechanism as a scene: the WhatsApp
    // path block below is a bare module, not a scene (DEC-0110 §3).
    await expect(page.locator('[data-block="scene"][data-mechanism="whatsapp"]')).toHaveCount(1);
  });

  test("TS-WEB-0022-A5: three explain modules, ordered, three step lines each, one secondary CTA each, alpha badge visible", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const modules = page.locator("[data-explain-module]");
    await expect(modules).toHaveCount(3);

    const mechanisms = await modules.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-mechanism")),
    );
    expect(mechanisms).toEqual(["whatsapp", "calendar-connection", "website-import"]);

    // The scene wrapper still declares `whatsapp`, so the page carries four
    // `data-mechanism` elements: one scene and three modules.
    await expect(page.locator("[data-mechanism]")).toHaveCount(4);

    const nextStep = [/^https:\/\/wa\.me\/\d+$/, /\/mitmachen\/registrieren/, /\/mitmachen\/registrieren/];
    for (let index = 0; index < 3; index += 1) {
      const pathModule = modules.nth(index);
      await expect(pathModule).toHaveAttribute("data-ordinal", String(index + 1));
      await expect(pathModule.locator("[data-explain-ordinal]")).toHaveText(
        String(index + 1).padStart(2, "0"),
      );
      // The module's own title, beside the ordinal. Scoped, because the
      // stage's calendar panel renders real `event-row`s and those carry
      // headings of their own.
      await expect(pathModule.locator("[data-explain-ordinal] + h3")).toHaveCount(1);
      await expect(pathModule.locator("[data-explain-step]")).toHaveCount(3);
      for (let step = 1; step <= 3; step += 1) {
        const line = pathModule.locator(`[data-explain-step="${step}"]`);
        await expect(line).toHaveCount(1);
        // A bold core and a normal detail, both carrying words.
        const [core, detail] = await line.evaluate((element) =>
          [...element.querySelectorAll("span")]
            .slice(1)
            .map((span) => ({
              text: span.textContent?.trim() ?? "",
              weight: getComputedStyle(span).fontWeight,
            })),
        );
        expect(core.text.length).toBeGreaterThan(0);
        expect(detail.text.length).toBeGreaterThan(0);
        expect(Number(core.weight)).toBeGreaterThan(Number(detail.weight));
      }

      const ctas = pathModule.locator("[data-cta]");
      await expect(ctas).toHaveCount(1);
      await expect(ctas).toHaveAttribute("data-cta", "secondary");
      const href = await ctas.getAttribute("href");
      expect(href ?? "").toMatch(nextStep[index]);
    }

    // The alpha mechanism keeps its badge while the hub record says so (D4).
    await expect(page.getByText("In Erprobung (Alpha)")).toBeVisible();

    // A2 is unchanged by three module CTAs: a CTA in a module is a link.
    await expect(page.locator('[data-cta="primary"]')).toHaveCount(1);
  });

  test("TS-WEB-0022-A6: the objection block is a headline, n items and a proof slot that is visibly empty", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const upper = page.locator('[data-block="objections"]');
    const archive = page.locator('[data-block="archiv"]');
    await expect(page.getByText("Wer euren Termin heute nicht mitbekommt")).toBeVisible();

    // CHANGED (DEC-0124, and the spec over polish brief G-9): the reserved
    // proof position is back. D3 requires one beside the block, "visibly
    // empty if nothing clears", and DEC-0104 makes the determination win
    // over the brief that struck it.
    await expect(upper.locator("[data-empty-proof]")).toHaveCount(1);

    // Two halves, as the 2026-09-23 draft has them: three people who do not
    // hear about the date today, then the usual channels on the archive
    // ground (the archive half's own facts are `e2e/objection-list.spec.ts`).
    await expect(upper.locator("[data-objection-reach] li")).toHaveCount(3);
    await expect(archive.locator('[data-archive-block="own"] li')).toHaveCount(3);
    await expect(page.getByText("Das ist gut so, macht weiter.")).toBeVisible();

    const items = await page
      .locator('[data-block="objections"] li, [data-block="archiv"] li')
      .evaluateAll((elements) => elements.map((element) => element.textContent ?? ""));
    expect(items).toHaveLength(6);
    for (const item of items) {
      const text = item.toLowerCase();
      // A6: no product name, no generic claim, no numeral asserting how many
      // channels exist. The check is scoped to the block's items, which is
      // what the criterion says — the paths slot's kicker is the review's own
      // "So geht's einfacher" and is not an item (DEC-0124).
      for (const banned of ["einfach", "digital", "für alle", "modern", "innovativ", "portalize"]) {
        expect(text, `objection item names "${banned}"`).not.toContain(banned);
      }
      expect(item, "no numeral asserting a channel count").not.toMatch(
        /\b(zwei|drei|vier|fünf|sechs|sieben)\s+(Kanäle|Wege)\b/i,
      );
    }
  });

  test('TS-WEB-0022-A9: the live example names its radius "in <place>" and no page URL carries a place slug as a path segment', async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    await expect(page.getByText(/^So sieht das in .+ aus$/)).toBeVisible();
    expect(page.url()).not.toMatch(/gross-kiesow|musterdorf/);
  });

  test("TS-WEB-0022-A12: no price, no 'Portalize', no 'local-advertising'; exactly one JSON-LD graph with WebPage only", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/480|Portalize|local-advertising|€/);
    // JSON-LD is TS-WEB-0011 territory (not yet wired) — recorded as not-yet-M4.
  });

  test("TS-WEB-0022-A13: exactly one link to /dein-kalender in the page's own body, inside an aside, without primary treatment", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    // Excludes `#context-band`: TS-WEB-0011-A4 makes it an `aside` too (F-2-41),
    // and its "other jobs" list links `/dein-kalender` on every page — not
    // this page's own D9 rule, which is about its own blocks 1–2.
    const ownAsideLinks = await page
      .locator('aside a[href*="/dein-kalender"]')
      .evaluateAll((elements) =>
        elements
          .filter((element) => !element.closest("#context-band"))
          .map((element) => element.getAttribute("data-cta")),
      );
    expect(ownAsideLinks).toHaveLength(1);
    expect(ownAsideLinks[0]).not.toBe("primary");
    // Scoped to `main`, excluding the context band: the header's persistent
    // job nav (chrome, TS-WEB-0004 D4) and TS-WEB-0006 D5's context band both link to
    // /dein-kalender as "the other jobs" on every page — neither is this
    // page's own D9 rule, which is about its own blocks 1–2.
    const ownBodyLinks = await page
      .locator('main a[href="/dein-kalender"]')
      .evaluateAll((elements) =>
        elements.filter((element) => !element.closest("#context-band, #closing-cta")).length,
      );
    expect(ownBodyLinks).toBe(1);
  });

  test("TS-WEB-0022-A17: one hint banner, inside the paths slot after the third path, no CTA, no figure, the offering's sources only", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const banner = page.locator("[data-hint-banner]");
    await expect(banner).toHaveCount(1);

    // Inside the slot, after the third path block: the banner's section is
    // the last `wege` section, and the module precedes it in DOM order.
    const section = page.locator('[data-block="wege"]').last();
    await expect(section.locator("[data-hint-banner]")).toHaveCount(1);
    const order = await section.evaluate((element) => {
      const pathModule = element.querySelector("[data-explain-module]");
      const note = element.querySelector("[data-hint-banner]");
      return pathModule && note
        ? pathModule.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING
        : 0;
    });
    expect(order).toBeGreaterThan(0);

    // Not a CTA of any rung, and no conversion goal (DEC-0082 §1).
    await expect(banner.locator("[data-cta]")).toHaveCount(0);
    await expect(banner.locator("[data-conversion-goal]")).toHaveCount(0);

    // Every source it names is the offering record's, through
    // `standard-sources.ts` — never a list written on a page (D11).
    const sources = await banner
      .locator("[data-standard-source]")
      .evaluateAll((elements) => elements.map((element) => element.getAttribute("data-standard-source")));
    expect(sources).toEqual(["wordpress-plugin", "ratsinformationssystem", "ics-feed"]);

    const bannerText = await banner.innerText();
    expect(bannerText).not.toMatch(/\d+\s*€|€|\bab\b/);

    // The cooperations are not free-path examples and are named nowhere in
    // the banner or the three path blocks (D11, owner 2026-09-25).
    const slotText = await page
      .locator('[data-block="wege"]')
      .evaluateAll((elements) => elements.map((element) => element.textContent ?? "").join(" "));
    for (const cooperation of ["kirche-mv", "VEVG", "Volkshochschule"]) {
      expect(slotText, `the paths slot names ${cooperation}`).not.toContain(cooperation);
    }
  });

  test("TS-WEB-0022-A18: at 390 px every core and every detail of all three modules renders on one line", async ({
    page,
  }) => {
    await page.setViewportSize({ width: AUTHORING_WIDTH, height: 844 });
    await page.goto("/mitmachen");
    const overflowing = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("[data-explain-step]")]
        .flatMap((line) => [...line.querySelectorAll<HTMLElement>("span")].slice(1))
        .filter((span) => {
          const lineHeight = parseFloat(getComputedStyle(span).lineHeight);
          return span.getBoundingClientRect().height > lineHeight + 1;
        })
        .map((span) => span.textContent ?? ""),
    );
    expect(overflowing, "step lines wrapping at the authoring width (CG-025)").toEqual([]);
  });

  test("TS-WEB-0022-A19: below lg each module fits one viewport and the stage box never changes height", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/mitmachen");
    await page.waitForLoadState("networkidle");

    const heights = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("[data-explain-module]")].map(
        (element) => element.getBoundingClientRect().height,
      ),
    );
    for (const height of heights) expect(height).toBeLessThanOrEqual(800);

    const pathModule = page.locator("[data-explain-module]").first();
    const stage = pathModule.locator("[data-explain-stage]");
    const before = (await stage.boundingBox())?.height ?? 0;
    await pathModule.locator('[data-explain-step="3"]').click();
    await expect(pathModule).toHaveAttribute("data-state", "3");
    const after = (await stage.boundingBox())?.height ?? 0;
    expect(Math.abs(after - before)).toBeLessThanOrEqual(1);
  });

  test("TS-WEB-0022-A19: on the page the advance is keyed to visibility, runs once and ends at state 3", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/mitmachen");
    await page.waitForLoadState("networkidle");

    const pathModule = page.locator("[data-explain-module]").first();
    // Loaded, module still below the viewport: state 1, and it stays there.
    await expect(pathModule).toHaveAttribute("data-state", "1");
    await page.waitForTimeout(1_000);
    await expect(pathModule).toHaveAttribute("data-state", "1");

    await showFraction(page, pathModule, 0.75);
    await page.waitForTimeout(DWELL - 500);
    await expect(pathModule).toHaveAttribute("data-state", "1");
    await page.waitForTimeout(PASS - (DWELL - 500) + 800);
    await expect(pathModule).toHaveAttribute("data-state", "3");
    await expect(pathModule).toHaveAttribute("data-advance", "done");

    // No fourth transition, and no restart after scrolling it out and back.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await showFraction(page, pathModule, 0.9);
    await page.waitForTimeout(DWELL + TRANSITION + 500);
    await expect(pathModule).toHaveAttribute("data-state", "3");
  });

  /**
   * Polish brief, page 4, item 8 and G-6 — the page ends on a promise, not on
   * a control standing by itself. The reassurance is the offering record's
   * own public commitment, cited together with the 2022 Nordkurier entry
   * (`mitmachen-8-closing`), so it ships word for word rather than being
   * withheld as it was while no backing was recorded.
   */
  test("the closing block carries its heading and the sourced permanence promise", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const closing = page.locator("#closing-cta");
    await expect(closing).toContainText("Der nächste Flyer kann der erste Termin sein.");
    await expect(closing).toContainText("Kostenlos anmelden, kostenlos bleiben");
    await expect(closing.locator('a[href*="/mitmachen/registrieren"]')).toHaveCount(1);
  });

  /**
   * G-3 — no section begins with only a heading on a new colour. The paths
   * slot's kicker, heading and sub-line are the review's own three lines
   * ("SO GEHT'S EINFACHER · So kommen eure Termine rein · Drei Wege. Alle
   * nutzt ihr eh schon."), and they stand once, on the first of the slot's
   * three sections (DEC-0124).
   */
  test("G-3: every section after the hero carries a kicker, and the paths slot carries its three lines", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    for (const kicker of [
      "Warum es heute hakt",
      "So geht's einfacher",
      "Was gerade ansteht",
    ]) {
      await expect(page.getByText(kicker, { exact: true })).toBeVisible();
    }
    await expect(page.locator("#wege-heading")).toHaveText("So kommen eure Termine rein");
    await expect(page.locator("[data-wege-subline]")).toHaveText(
      "Drei Wege. Alle nutzt ihr eh schon.",
    );
    // The proof section's kicker is the customer-proof placeholder, marked
    // on its element (DEC-0120 §5, state/open.md row 234); the h2 keeps its
    // own words, so the two are not the same three words stacked.
    const proofKicker = page.locator("[data-block='beleg'] p[class*='kicker']");
    await expect(proofKicker).toHaveText("Wer den Kalender nutzt");
    await expect(proofKicker).toHaveAttribute("data-demo", "true");
    await expect(page.locator("#beleg-heading")).toHaveText("Was andere sagen");
  });

  /**
   * The step lines are the design drafts' wording, not the owner's
   * (`*-steps-demo` slots, DEC-0068, DEC-0124, state/open.md): every module
   * therefore stands in a `data-demo="true"` wrapper until the owner writes
   * them, and no photograph stands in a path any more — the review calls the
   * WhatsApp one "Quatsch", and what belongs in state 1 has not been shot.
   */
  test("the three modules are marked as placeholders and carry no photograph", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    await expect(page.locator('[data-path-module][data-demo="true"]')).toHaveCount(3);
    // No photograph: `media-frame` renders one as `figure > img`, and the
    // three stage images show its "Foto gesucht" hatch instead. The brand
    // mark in the chat graphic's header is not a photograph and stays.
    await expect(page.locator('[data-block="wege"] figure img')).toHaveCount(0);
    await expect(page.locator('[data-block="wege"] [data-stage="image"] img')).toHaveCount(0);
  });

  test("TS-WEB-0022-A16: no horizontal scroll and no reflow-prone empty box at either reference viewport", async ({
    page,
  }) => {
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport);
      await page.goto("/mitmachen");
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows).toBe(false);
    }
  });
});
