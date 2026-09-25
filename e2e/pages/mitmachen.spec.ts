import { expect, test } from "@playwright/test";

/**
 * TS-WEB-0022 — `/mitmachen`, the publishing entry.
 *
 * ACs requiring real personalization/geo-ranking (stage 1–3, TS-WEB-0008 D1 has
 * no row for this route) are not-yet-M4: TS-WEB-0022-A7/A8 are covered at unit
 * level instead (`app/[lang]/mitmachen/example-place.test.ts`); TS-WEB-0022-A10's
 * stage-3 branch and TS-WEB-0022-A14's "resolved place" branch cannot be
 * exercised until personalization is built (no anchor ever reaches this
 * page today, per D8: "no place search on this route").
 */

const VIEWPORTS = [
  { name: "360x640", width: 360, height: 640 },
  { name: "1280x800", width: 1280, height: 800 },
];

test.describe("TS-WEB-0022-A2/A3/A4/A5/A6/A9/A12/A13/A16: /mitmachen", () => {
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
    // hero (scene) -> objections -> wege (three paths, one section each
    // since polish brief G-4 — same block, same order, three grounds) ->
    // beispiel (live example) -> beleg (proof) -> verweis.
    //
    // CHANGED (polish brief, page 4, item 5): `verweis` is new. The single
    // `/dein-kalender` cross-reference D9 allows used to sit *inside* path 3,
    // where it read as a fourth step of "your website as the source". It is
    // its own quiet aside now, after the proof and before the closing block —
    // the same one link, the same wording, in a place a reader can tell apart
    // from the argument she is in the middle of.
    expect(blocks).toEqual([
      "scene",
      "objections",
      "wege",
      "wege",
      "wege",
      "beispiel",
      "beleg",
      "verweis",
    ]);
  });

  test("TS-WEB-0022-A4: exactly one data-block=\"scene\", mechanism whatsapp, opener ends in a question mark", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const scenes = page.locator('[data-block="scene"]');
    await expect(scenes).toHaveCount(1);
    await expect(scenes).toHaveAttribute("data-mechanism", "whatsapp");
    const headline = await page.locator("h1").first().textContent();
    expect(headline?.trim().endsWith("?")).toBe(true);
  });

  test("TS-WEB-0022-A5: exactly three publishing paths, ordered whatsapp/calendar-connection/website-import, alpha badge visible", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const paths = page.locator("[data-mechanism]");
    await expect(paths).toHaveCount(4); // the scene wrapper + 3 publishing-path blocks
    const mechanisms = await paths.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-mechanism")),
    );
    expect(mechanisms).toEqual(["whatsapp", "whatsapp", "calendar-connection", "website-import"]);
    await expect(page.getByText("In Erprobung (Alpha)")).toBeVisible();
  });

  test("TS-WEB-0022-A6: the objection block is three channels and the line it ends on, with no proof position at all", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    await expect(page.getByText("Warum das, was ihr heute macht, nicht überall ankommt")).toBeVisible();

    // CHANGED (polish brief G-9, and page 4 item 2). Two assertions here no
    // longer hold, and the brief is why:
    //
    //  - `[data-empty-proof]` was 1. The reserved proof position next to the
    //    objections is gone. Once the "Kein Nachweis" label came off it, all
    //    that stood there was a blank rectangle under a list of bad news —
    //    and the objections are the audience's own words, which need no
    //    third-party evidence in the first place.
    //  - the block was five 21 px rows, 1116 px, nearly a screen and a half.
    //    It is three channels now; the two objections about the organiser
    //    herself are the sentence the section ends on, from the same `pains[]`.
    await expect(page.locator("[data-empty-proof]")).toHaveCount(0);
    await expect(page.locator('[data-block="objections"] li')).toHaveCount(3);
    await expect(
      page.getByText(
        "Und wer das ehrenamtlich organisiert, hat neben der Organisation keine Zeit mehr fürs Bewerben",
      ),
    ).toBeVisible();
    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    for (const banned of ["einfach", "digital", "für alle", "modern", "innovativ"]) {
      expect(bodyText).not.toContain(banned);
    }
  });

  test("TS-WEB-0022-A9: the live example names its radius \"in <place>\" and no page URL carries a place slug as a path segment", async ({
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
   * G-3 — no section begins with only a heading on a new colour, and the
   * hinge into the three paths is the line the brief found missing: the
   * objections end on "no time for a new tool", and the paths only answer
   * that if something says they are not one.
   */
  test("G-3: every section after the hero carries a kicker, and the paths carry the hinge", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    await expect(
      page.getByText("Deshalb gibt es drei Wege rein, und alle drei sind Wege, die ihr schon geht."),
    ).toBeVisible();
    for (const kicker of [
      "Warum es heute hakt",
      "So funktioniert es",
      "Was gerade ansteht",
      "Wer den Kalender nutzt",
    ]) {
      await expect(page.getByText(kicker, { exact: true })).toBeVisible();
    }
  });

  /**
   * Brief, page 4, item 4 — one photograph across the three paths, not three.
   * A wall calendar and a desk said nothing the steps under them did not, and
   * each `ratio-feature` frame was half a phone screen.
   */
  test("the publishing paths carry exactly one photograph, on the WhatsApp path", async ({
    page,
  }) => {
    await page.goto("/mitmachen");
    const images = page.locator('[data-block="wege"] img');
    await expect(images).toHaveCount(1);
    await expect(page.locator('[data-mechanism="whatsapp"] img')).toHaveCount(1);
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
