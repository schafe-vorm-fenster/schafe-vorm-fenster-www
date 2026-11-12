import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * DEC-0172 — the three modules of the owner's review of 2026-10-27 that read
 * as the old state (#91, #94, #96), held by their visual rules rather than by
 * their wording. The comparison (#94) was redesigned again by DEC-0203
 * (issue 159) and is held here in that design, on both pages it stands on. Every assertion here is a structure, a token or a position;
 * none of them names a sentence of copy (DEC-0083).
 *
 * The expected colours are read from the page's own tokens at run time — a
 * probe element painted with `var(--token)` — so no colour value is written
 * here (`check:brand`, TS-WEB-0017-A5) and a token change moves the
 * expectation with it.
 */

const INK = "--color-neutral-ink";
const SURFACE = "--color-neutral-surface";
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
    for (const [path, blockId, pairs] of [
      ["/dein-kalender", "contrast", 4],
      ["/mitmachen", "objections", 3],
    ] as const) {
      test(`TS-WEB-0024-A23 / TS-WEB-0022-A6: one block per pair, today on surface, the solution on lime-500 — ${path} ${viewport.width}px`, async ({
        page,
      }) => {
        await open(page, path, viewport);
        const block = page.locator(`[data-block="${blockId}"]`);
        const pairItems = block.locator("li[data-pair]");
        const today = block.locator('[data-half="today"]');
        const withCalendar = block.locator('[data-half="with"]');
        await expect(pairItems).toHaveCount(pairs);
        await expect(today).toHaveCount(pairs);
        await expect(withCalendar).toHaveCount(pairs);

        const ink = await token(page, INK);
        const phone = viewport.width < 768;
        for (let index = 0; index < pairs; index += 1) {
          const old = today.nth(index);
          const fresh = withCalendar.nth(index);
          // DEC-0203: today on `surface`, the solution on `lime-500`.
          expect(await css(old, "background-color")).toBe(await token(page, SURFACE));
          expect(await css(fresh, "background-color")).toBe(await token(page, LIME_500));
          for (const half of [old, fresh]) expect(await css(half, "box-shadow")).toBe("none");

          // Rounded on the outside only, straight on the edge between the halves.
          const outer = phone
            ? [
                [old, "border-top-left-radius"],
                [old, "border-top-right-radius"],
                [fresh, "border-bottom-left-radius"],
                [fresh, "border-bottom-right-radius"],
              ]
            : [
                [old, "border-top-left-radius"],
                [old, "border-bottom-left-radius"],
                [fresh, "border-top-right-radius"],
                [fresh, "border-bottom-right-radius"],
              ];
          const seam = phone
            ? [
                [old, "border-bottom-left-radius"],
                [old, "border-bottom-right-radius"],
                [fresh, "border-top-left-radius"],
                [fresh, "border-top-right-radius"],
              ]
            : [
                [old, "border-top-right-radius"],
                [old, "border-bottom-right-radius"],
                [fresh, "border-top-left-radius"],
                [fresh, "border-bottom-left-radius"],
              ];
          for (const [half, corner] of outer) {
            expect(await css(half as Locator, corner as string)).toBe(phone ? "24px" : "28px");
          }
          for (const [half, corner] of seam) {
            expect(await css(half as Locator, corner as string)).toBe("0px");
          }

          // The label stands above its sentence, not inline in front of it.
          const label = old.locator("p > span").first();
          expect(await css(label, "display")).toBe("block");

          // One topic circle with today, one arrow circle with the solution:
          // `ink` circles, decoration only.
          const icon = old.locator("[data-pair-icon]");
          const arrow = fresh.locator("[data-pair-arrow]");
          await expect(icon).toHaveAttribute("aria-hidden", "true");
          await expect(arrow).toHaveAttribute("aria-hidden", "true");
          expect(await css(icon, "background-color")).toBe(ink);
          expect(await css(arrow, "background-color")).toBe(ink);
          const iconBox = await box(icon);
          const arrowBox = await box(arrow);
          expect(Math.round(iconBox.width)).toBe(52);
          expect(Math.round(arrowBox.width)).toBe(44);

          // One pair is one block: stacked and butting below `lg`, 50/50 and
          // butting from it, the arrow on the edge between the halves.
          const a = await box(old);
          const b = await box(fresh);
          const arrowCentre = { x: arrowBox.x + arrowBox.width / 2, y: arrowBox.y + arrowBox.height / 2 };
          if (phone) {
            expect(Math.abs(a.x - b.x)).toBeLessThanOrEqual(1);
            expect(Math.abs(a.y + a.height - b.y)).toBeLessThanOrEqual(1);
            expect(Math.abs(arrowCentre.y - b.y)).toBeLessThanOrEqual(1);
            // The icon circle stands half over the block's top edge.
            expect(Math.abs(iconBox.y + iconBox.height / 2 - a.y)).toBeLessThanOrEqual(1);
          } else {
            expect(Math.abs(a.y - b.y)).toBeLessThanOrEqual(1);
            expect(Math.abs(a.x + a.width - b.x)).toBeLessThanOrEqual(1);
            expect(Math.abs(a.width - b.width)).toBeLessThanOrEqual(1);
            expect(Math.abs(arrowCentre.x - b.x)).toBeLessThanOrEqual(1);
            // Both texts start at the same height.
            const oldText = await box(old.locator("p"));
            const freshText = await box(fresh.locator("p"));
            expect(Math.abs(oldText.y - freshText.y)).toBeLessThanOrEqual(1);
          }
        }

        // The head is the kicker and the heading, nothing else (issue 159).
        await expect(block.locator("[data-stack] > :not([data-kicker]):not([data-comparison])")).toHaveCount(0);
      });
    }

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
