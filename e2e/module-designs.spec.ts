import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * DEC-0172 — the three modules of the owner's review of 2026-10-27 that read
 * as the old state (#91, #94, #96), held by their visual rules rather than by
 * their wording. Every assertion here is a structure, a token or a position;
 * none of them names a sentence of copy (DEC-0083).
 *
 * The expected colours are read from the page's own tokens at run time — a
 * probe element painted with `var(--token)` — so no colour value is written
 * here (`check:brand`, TS-WEB-0017-A5) and a token change moves the
 * expectation with it.
 */

const ARCHIVE_GROUND = "--color-archive-ground";
const LIME_100 = "--color-lime-100";
const LIME_500 = "--color-lime-500";
const PAPER = "--color-neutral-paper";
const VIOLET_500 = "--color-violet-500";
const TRANSPARENT = "transparent";

/** The computed colour of a token, or of `transparent`, as this browser reports it. */
async function token(page: Page, name: string): Promise<string> {
  return page.evaluate((value) => {
    const probe = document.createElement("div");
    probe.style.background = value.startsWith("--") ? `var(${value})` : value;
    document.body.append(probe);
    const colour = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return colour;
  }, name);
}

const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 900 };

async function box(locator: Locator) {
  const value = await locator.boundingBox();
  expect(value).not.toBeNull();
  return value ?? { x: 0, y: 0, width: 0, height: 0 };
}

async function css(locator: Locator, property: string): Promise<string> {
  return locator.evaluate(
    (element, name) => getComputedStyle(element).getPropertyValue(name),
    property,
  );
}

async function open(page: Page, path: string, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.goto(path);
}

test.describe("DEC-0172: the comparison, the flow, the proof stream and the trust block", () => {
  for (const viewport of [PHONE, DESKTOP]) {
    test(`TS-WEB-0024-A23: today stands on the archive ground, the solution on lime-100, as one pair per row — ${viewport.width}px`, async ({
      page,
    }) => {
      await open(page, "/dein-kalender", viewport);
      const block = page.locator('[data-block="contrast"]');
      const today = block.locator('[data-half="today"]');
      const withCalendar = block.locator('[data-half="with"]');
      await expect(today).toHaveCount(4);
      await expect(withCalendar).toHaveCount(4);

      for (let index = 0; index < 4; index += 1) {
        const old = today.nth(index);
        const fresh = withCalendar.nth(index);
        // SRC-0014 §Archive: the old world on its own ground, and the solution
        // never on it.
        expect(await css(old, "background-color")).toBe(await token(page, ARCHIVE_GROUND));
        expect(await css(fresh, "background-color")).toBe(await token(page, LIME_100));
        // Surfaces are square, and nothing floats: no radius, no shadow.
        for (const half of [old, fresh]) {
          expect(await css(half, "border-top-left-radius")).toBe("0px");
          expect(await css(half, "box-shadow")).toBe("none");
        }
        // The label stands above its sentence (Desktop Raster board), not
        // inline in front of it.
        const label = old.locator("> span").first();
        expect(await css(label, "display")).toBe("block");

        // One pair is one row: stacked and butting below `xl`, 6 + 6 and
        // butting from it.
        const a = await box(old);
        const b = await box(fresh);
        if (viewport.width < 1024) {
          expect(Math.abs(a.x - b.x)).toBeLessThanOrEqual(1);
          expect(Math.abs(a.y + a.height - b.y)).toBeLessThanOrEqual(1);
        } else {
          expect(Math.abs(a.y - b.y)).toBeLessThanOrEqual(1);
          expect(Math.abs(a.x + a.width - b.x)).toBeLessThanOrEqual(1);
        }
      }
    });

    test(`TS-WEB-0024-A24: the benefit band is a flow from the sources to one target, with no pill in it — ${viewport.width}px`, async ({
      page,
    }) => {
      await open(page, "/dein-kalender", viewport);
      const band = page.locator('[data-block="embed-config"] [data-surface="lime-500"]');
      expect(await css(band, "background-color")).toBe(await token(page, LIME_500));

      const flow = band.locator("figure[data-flow]");
      await expect(flow).toHaveCount(1);
      await expect(flow.locator("figcaption")).toHaveCount(1);
      const sources = flow.locator("ul > li[data-flow-source]");
      await expect(sources).toHaveCount(3);
      const target = flow.locator("[data-flow-target]");
      await expect(target).toHaveCount(1);
      // The arrow is decoration; the order of the markup says the direction.
      await expect(flow.locator('[aria-hidden="true"] svg')).not.toHaveCount(0);

      // Nothing in the flow is a control, so nothing in it is drawn as one: a
      // source has no fill and no radius, the target is a flat square field
      // whose fill is not its ground (DEC-0154: a fill never equals its ground).
      await expect(flow.locator("a, button")).toHaveCount(0);
      for (let index = 0; index < 3; index += 1) {
        const source = sources.nth(index);
        expect(await css(source, "background-color")).toBe(await token(page, TRANSPARENT));
        expect(await css(source, "border-top-left-radius")).toBe("0px");
      }
      expect(await css(target, "background-color")).toBe(await token(page, PAPER));
      expect(await css(target, "border-top-left-radius")).toBe("0px");

      // The sources are the actors' ways in; the reader's own website is the
      // target and appears once. No source is addressed to the reader — that
      // was "eure eigene Website" beside "eure Website" (#96).
      const sourceText = (await sources.allInnerTexts()).join(" ").toLowerCase();
      expect(sourceText).not.toMatch(/\beure\b|\byour\b/);

      // Below `xl` the target follows the sources; from `xl` it stands to
      // their right in the same row.
      const last = await box(sources.nth(2));
      const goal = await box(target);
      if (viewport.width < 1024) {
        expect(goal.y).toBeGreaterThan(last.y + last.height);
      } else {
        expect(goal.x).toBeGreaterThan(last.x + last.width);
      }
    });

    for (const [path, blockId] of [
      ["/dein-kalender", "proof"],
      ["/mitmachen", "beleg"],
    ] as const) {
      test(`TS-WEB-0024-A25 / TS-WEB-0022-A23: the customer proof stream is flat items with a byline — ${path} ${viewport.width}px`, async ({
        page,
      }) => {
        await open(page, path, viewport);
        const block = page.locator(`[data-block="${blockId}"]`);
        const items = block.locator("article");
        await expect(items).toHaveCount(3);
        await expect(block.locator('article[data-emphasis="feature"]')).toHaveCount(1);

        for (let index = 0; index < 3; index += 1) {
          const item = items.nth(index);
          // No card on the section's ground: no fill, a hairline above.
          expect(await css(item, "background-color")).toBe(await token(page, TRANSPARENT));
          expect(parseFloat(await css(item, "border-top-width"))).toBeGreaterThanOrEqual(1);
          expect(await css(item, "border-top-color")).toBe(await token(page, LIME_500)); // hairline-on-lime
          // The byline: a decorative initials well — or the voice's logo in
          // its place, at the well's height and its own width (DEC-0183) —
          // the name, the role.
          const well = item.locator("[data-initials], [data-logo]");
          await expect(well).toHaveAttribute("aria-hidden", "true");
          const disc = await box(well);
          if ((await well.getAttribute("data-initials")) !== null) expect(Math.round(disc.width)).toBe(40);
          else expect(disc.width).toBeGreaterThan(0);
          expect(Math.round(disc.height)).toBe(40);
          // The claim comes before the byline.
          const claim = await box(item.locator("p").first());
          expect(claim.y).toBeLessThan(disc.y);
        }

        // From `xl` the two compact items share a row under the feature item.
        const second = await box(items.nth(1));
        const third = await box(items.nth(2));
        if (viewport.width >= 1024) {
          expect(Math.abs(second.y - third.y)).toBeLessThanOrEqual(1);
        } else {
          expect(third.y).toBeGreaterThan(second.y + second.height - 1);
        }
      });
    }

    test(`TS-WEB-0024-A26: the trust block stands on its own provenance ground, never on the proof's — ${viewport.width}px`, async ({
      page,
    }) => {
      await open(page, "/dein-kalender", viewport);
      const trust = page.locator('[data-block="trust"]');
      const proof = page.locator('[data-block="proof"]');
      expect(await css(trust, "background-color")).toBe(await token(page, VIOLET_500));
      expect(await css(trust, "background-color")).not.toBe(await css(proof, "background-color"));

      const subjects = trust.locator("li");
      await expect(subjects).toHaveCount(2);
      const first = await box(subjects.nth(0));
      const second = await box(subjects.nth(1));
      if (viewport.width >= 1024) {
        expect(Math.abs(first.y - second.y)).toBeLessThanOrEqual(1);
      } else {
        expect(second.y).toBeGreaterThan(first.y);
      }
    });
  }
});
