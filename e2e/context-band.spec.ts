import { expect, test } from "@playwright/test";

/**
 * The context band as link cards with a blurb — TS-WEB-0006 D5 with CG-030 as
 * DEC-0120 determines it and DEC-0156 draws it (the owner's design of
 * 2026-10-12), and the "Über uns" label of TS-WEB-0004 D4 as
 * amended (TS-WEB-0004-A8: labels match D4 exactly on every page).
 *
 * Browser facts, measured on `/` (a `PageFrame` page with its own band slot)
 * and on `/ueber-uns` (the merged shape, TS-WEB-0006 D6), in both languages.
 */

const PHONE = { width: 390, height: 844 };

const CASES = [
  { path: "/", label: "Über uns", targets: ["/mitmachen", "/dein-kalender", "/ueber-uns"] },
  { path: "/en", label: "About us", targets: ["/en/take-part", "/en/your-calendar", "/en/about"] },
  { path: "/ueber-uns", label: "Dein Kalender", targets: ["/dein-ort", "/mitmachen", "/dein-kalender"] },
] as const;

for (const { path, label, targets } of CASES) {
  test(`${path}: three link cards of ≥ 44 px, each icon well + label + blurb + arrow disc, in registry order`, async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);
    await page.goto(path);

    const cards = page.locator("#context-band a");
    await expect(cards).toHaveCount(3);
    expect(await cards.evaluateAll((links) => links.map((a) => a.getAttribute("href")))).toEqual(
      targets,
    );

    for (const card of await cards.all()) {
      const box = await card.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      // Label and blurb are two lines inside the one link, beside the well and the disc.
      await expect(card.locator("[data-band-label]")).not.toBeEmpty();
      const blurb = card.locator("[data-band-blurb]");
      await expect(blurb).not.toBeEmpty();
      expect((await blurb.textContent())?.length ?? 0).toBeLessThanOrEqual(80);
      await expect(card.locator("svg")).toHaveCount(2);
    }

    // The fourth job's label reads as TS-WEB-0004 D4 says since DEC-0120.
    await expect(page.locator("#context-band, header").getByRole("link", { name: label, exact: false }).first()).toBeVisible();
  });
}

test("every blurb is a CG-030 statement now (DEC-0156): no card is demo-marked, the publish line is the owner's", async ({
  page,
}) => {
  for (const path of ["/", "/en"]) {
    await page.goto(path);
    const band = page.locator("#context-band");
    await expect(band.locator("a")).toHaveCount(3);
    await expect(band.locator('a[data-demo="true"]')).toHaveCount(0);
    await expect(band.locator("a").first()).toContainText("WhatsApp");
    for (const blurb of await band.locator("[data-band-blurb]").allTextContents()) {
      expect(blurb, "a blurb is a statement, never a question (CG-005)").not.toContain("?");
    }
  }
});

/**
 * TS-WEB-0017-A35 — the band as the owner drew it on 2026-10-12 (issue #39,
 * DEC-0156): a heading with the mono kicker, three pill cards with a 40 px
 * icon well and a 44 px neutral-black arrow disc, one card per row on the
 * phone, two on the tablet, three in a row on the desktop; the card fill is
 * never the band's ground, and no line is cut off.
 */
const FRAMES = [
  { width: 390, height: 844, perRow: 1, kickerBeside: false },
  { width: 820, height: 1180, perRow: 2, kickerBeside: true },
  { width: 1440, height: 900, perRow: 3, kickerBeside: true },
] as const;

for (const frame of FRAMES) {
  for (const path of ["/", "/en", "/ueber-uns"]) {
    test(`TS-WEB-0017-A35: ${path} at ${frame.width} px — pill cards, ${frame.perRow} per row, well and disc, nothing cut off`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: frame.width, height: frame.height });
      await page.goto(path);
      const band = page.locator("#context-band");
      await band.scrollIntoViewIfNeeded();

      const facts = await band.evaluate((root) => {
        // A computed colour as its channels; alpha 0 means "no fill here".
        const channels = (colour: string): number[] => {
          const parts = (colour.match(/[\d.]+/g) ?? []).map(Number);
          return parts.length === 3 ? [...parts, 1] : parts;
        };
        const groundOf = (el: Element | null): number[] => {
          for (let node = el; node; node = node.parentElement) {
            const bg = channels(getComputedStyle(node).backgroundColor);
            if (bg.length === 4 && bg[3]! > 0) return bg;
          }
          return [];
        };
        const cards = [...root.querySelectorAll<HTMLElement>("[data-band-card]")];
        return {
          cards: cards.map((card) => {
            const rect = card.getBoundingClientRect();
            const style = getComputedStyle(card);
            const well = card.querySelector<HTMLElement>("[data-band-well]")!.getBoundingClientRect();
            const disc = card.querySelector<HTMLElement>("[data-band-disc]")!;
            const discRect = disc.getBoundingClientRect();
            const clipped = [...card.querySelectorAll<HTMLElement>("[data-band-label], [data-band-blurb]")].some(
              (el) =>
                el.scrollWidth > el.clientWidth + 1 ||
                getComputedStyle(el).textOverflow === "ellipsis" ||
                el.textContent!.includes("…"),
            );
            return {
              top: Math.round(rect.top),
              height: rect.height,
              radius: parseFloat(style.borderTopLeftRadius),
              fill: channels(style.backgroundColor),
              ground: groundOf(card.parentElement),
              well: [Math.round(well.width), Math.round(well.height)],
              disc: [Math.round(discRect.width), Math.round(discRect.height)],
              discFill: channels(getComputedStyle(disc).backgroundColor),
              clipped,
            };
          }),
          kicker: (() => {
            const heading = root.querySelector("h2, p")!.getBoundingClientRect();
            const kicker = [...root.querySelectorAll("p")].find(
              (p) => getComputedStyle(p).textTransform === "uppercase",
            );
            if (!kicker) return null;
            const k = kicker.getBoundingClientRect();
            return { beside: k.top < heading.bottom && k.left > heading.left, mono: getComputedStyle(kicker).fontFamily };
          })(),
        };
      });

      expect(facts.cards).toHaveLength(3);
      // One row per `perRow` cards: count the distinct tops of the first row.
      const firstTop = facts.cards[0]!.top;
      expect(facts.cards.filter((card) => Math.abs(card.top - firstTop) <= 1)).toHaveLength(frame.perRow);

      for (const card of facts.cards) {
        expect(card.height).toBeGreaterThanOrEqual(44);
        // A pill: the radius reaches half the card's height (Q-0087 → DEC-0156).
        expect(card.radius * 2).toBeGreaterThanOrEqual(card.height - 1);
        expect(card.fill, "the card's fill is never its ground").not.toEqual(card.ground);
        expect(card.well).toEqual([40, 40]);
        expect(card.disc).toEqual([44, 44]);
        expect(card.discFill, "the disc is neutral-black ink, never dark green").toEqual([0, 0, 0, 1]);
        expect(card.clipped, "no label or blurb is cut off").toBe(false);
      }

      // The kicker: present wherever the band is `context-band` itself (not the merged block).
      if (path !== "/ueber-uns") {
        expect(facts.kicker).not.toBeNull();
        expect(facts.kicker!.beside).toBe(frame.kickerBeside);
      }
    });
  }
}

test("TS-WEB-0004-A8: the header's fourth label is »Über uns« and never »Warum wir«", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/mitmachen");
  const header = page.getByRole("banner").first();
  await expect(header.getByRole("link", { name: "Über uns", exact: true })).toBeVisible();
  await expect(header).not.toContainText("Warum wir");
});
