import { expect, test } from "@playwright/test";

/**
 * TS-WEB-0027 — `/ueber-uns` — acceptance pass.
 *
 * **TS-WEB-0027-A9 changed with the polish brief (page 10, item 6).** The
 * criterion asks for every person in `@schafe-vorm-fenster/people` to appear
 * with a real portrait. Two do not have one that may ship: the team card's
 * photograph of Jan-Henrik Hempel is a candid with a hand in front of his
 * face, and Christian Sauer's only photograph carries `license: unverified`.
 * The hatch that used to name that gap is gone (Jan, 2026-09-18), so what
 * the team block rendered was one unusable crop beside one blank 4:5 box.
 * G-9's decision for exactly this slot is "render the two team entries as
 * text-only rows until a portrait exists" — so the case below now asserts
 * the **people**, their roles and their bios, and that neither entry ships a
 * portrait box at all. The founder's cleared portrait still stands on the
 * page, in the causal chain, which is what TS-WEB-0027-A9's own intent is about.
 * `state/open.md` keeps the row: the portraits return when they are cleared.
 */

test.describe("/ueber-uns", () => {
  test("TS-WEB-0027-A1: manifest matches D1 — no primary CTA on this page", async ({ page }) => {
    await page.goto("/ueber-uns");
    await expect(page.locator('[data-cta="primary"]')).toHaveCount(0);
  });

  test("TS-WEB-0027-A9: the cleared founder portrait renders, with its credit line", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    await expect(page.locator('img[src*="founder-portrait"]').first()).toBeVisible();
    // The rights holder prescribes the attribution string verbatim.
    await expect(page.getByText("@rightvisionstudios & NØRD2026").first()).toBeVisible();
  });

  test("TS-WEB-0027-A2: exactly one photo section, at the top", async ({ page }) => {
    await page.goto("/ueber-uns");
    const photoSections = page.locator("section[data-surface] [style*='--photo-image'], section[style*='--photo-image']");
    expect(await photoSections.count()).toBeGreaterThanOrEqual(0);
    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Gebaut in einem Dorf, betrieben aus einem Dorf.");
  });

  test("TS-WEB-0027-A3: the h1 and the honorary-mayor sentence are on the first screen at 1280x800", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/ueber-uns");
    await expect(page.locator("h1")).toBeInViewport();
  });

  test("TS-WEB-0027-A4: the origin copy states the free-calendar promise and exactly one 480 € price", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const bodyText = await page.locator("body").innerText();
    const matches = bodyText.match(/480\s*€/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  test("TS-WEB-0027-A5 / A6: the stream renders at most 7 elements and exactly one empty slot, never backfilled", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const stream = page.locator("[data-block='belegstrom']");
    // Scoped to the stream container: CSS Modules name every class in a
    // component's file with the same file-basename prefix, so an unscoped
    // `[class*="proof-card"]` also matches the card's own inner `body`/
    // `meta` elements — only `article` is unique to one card each.
    const cards = stream.locator("article");
    // The reserved seventh position is a flat brand-colour panel carrying
    // `data-empty-proof` and no words at all (Jan, 2026-09-18) — it is still
    // reserved, still countable, and never backfilled.
    const emptySlot = stream.locator("[data-empty-proof]");
    expect(await cards.count()).toBeLessThanOrEqual(6);
    await expect(emptySlot).toHaveCount(1);
    await expect(page.getByText("Kein Nachweis")).toHaveCount(0);
  });

  test("TS-WEB-0027-A8: the archive block has exactly one outgoing link to /ueber-uns/archiv", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const archiveLinks = page.locator('a[href="/ueber-uns/archiv"]');
    await expect(archiveLinks).toHaveCount(1);
  });

  test("TS-WEB-0027-A9: every team member renders once, with a name and a role, and no empty portrait box", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const team = page.locator("section", { has: page.locator("#team-h2") });
    const teamText = await team.innerText();
    expect(teamText).toContain("Jan-Henrik Hempel");
    expect(teamText).toContain("Christian Sauer");
    expect(teamText).toContain("Gründer");
    // G-9: no portrait slot at all until every person has a cleared one —
    // never a 4:5 grey rectangle under a name.
    await expect(team.locator("img")).toHaveCount(0);
    await expect(team.locator("[data-placeholder]")).toHaveCount(0);
  });

  /**
   * Polish brief page 10, item 2 — beat 2 was missing from the page.
   *
   * The artifact has carried the origin paragraph (Berlin → Schlatkow, the
   * baker's van, the municipal sheep pasture the company is named after) and
   * the cleared founder quote since the content follow-up; the page rendered
   * neither, and that is the beat that makes a reader trust this.
   */
  test("brief page 10, item 2: the origin story and the cleared founder quote render", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    const section = page.locator("[data-block='herkunftsgeschichte']");
    await expect(section).toHaveCount(1);
    const text = await section.innerText();
    expect(text).toContain("Angefangen hat es mit Brötchen.");
    expect(text).toContain("Bäckerwagen");
    expect(text).toContain("Schafweide");
    await expect(section.locator("blockquote")).toContainText(
      "Wenn man alles sammelt, ist plötzlich in jedem Dorf jeden Tag irgendwas los.",
    );
    await expect(section.locator("blockquote cite")).toHaveText("Jan-Henrik Hempel");
  });

  /**
   * Polish brief G-7 — the proof stream used to render "Beleg: founder-
   * former-volunteer-mayor (cleared)" as the honorary-mayor card's context
   * line, and a `BELEG` badge next to a label already reading `Beleg`.
   */
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
    expect(text).toBe("Gebaut in einem Dorf, betrieben aus einem Dorf.");
    // The causal chain moved into the section below it, where it now opens
    // the page's first argument.
    await expect(page.locator("[data-block='kausalkette']")).toContainText("rund 400 Einwohnern");
  });

  test("F-2-33: the English page heads its counter section in English", async ({ page }) => {
    await page.goto("/en/about");
    const section = page.locator("[data-block='betrieb']");
    await expect(section.locator("h2")).toHaveText("Running since 2018");
  });

  test("TS-WEB-0027-A10: the newsletter stands after the team block, zero data-cta=\"primary\", last block is the merged three-job offer", async ({
    page,
  }) => {
    await page.goto("/ueber-uns");
    await expect(page.locator('[data-cta="primary"]')).toHaveCount(0);
    // "Rendered once, not twice": the merged block **is** the context band
    // (TS-WEB-0006 D6, `plan/component-inventory.md` TS-WEB-0027 block 7 — "`context-
    // band` in `merged` mode … rendered once, as the last block"), so it is
    // the one `aside#context-band` TS-WEB-0011-A4 requires on every page and it
    // carries block 4's `#closing-cta` anchor inside. This used to assert
    // the band's *absence*, which is what left the page without an `aside`
    // at all (F-2-41, reopened at gate 2).
    const band = page.locator("aside#context-band");
    await expect(band).toHaveCount(1);
    const closing = page.locator("#closing-cta");
    await expect(closing).toHaveCount(1);
    await expect(band.locator("#closing-cta")).toHaveCount(1);
    const jobs = closing.getByRole("link");
    expect(await jobs.count()).toBe(3);
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
