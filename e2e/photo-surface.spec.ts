import { expect, test } from "@playwright/test";

/**
 * The photo surface as the browser composes it — DEC-0105 §1, §2 and §4,
 * measured on rendered pages rather than asserted from the stylesheet:
 *
 *  1. **the scrim is the fixed ladder.** Two neutral-black gradients, no stop
 *     above the `0.72` ceiling, and the crop follows a focal point rather than
 *     `center` (`pnpm check:contrast` reads the same rule off the stylesheet;
 *     this file reads it off the cascade, which is where a variant or a later
 *     rule could still override it);
 *  2. **type on the photograph carries the soft shadow, type on a flat ground
 *     carries none** — `shadow.textOnPhoto` is part of the treatment, and it
 *     exists only there;
 *  3. **the header's wells blur over the photograph** and do nothing on paper
 *     (the blur primitive, DEC-0105 §4; the solid `ink` fallback is what
 *     `e2e/site-header.spec.ts` sees in a browser without `backdrop-filter`);
 *  4. **the hero's CTA slot stacks two conversions with a gap** on the page
 *     that has two (TS-WEB-0024 D3).
 */

const PHONE = { width: 390, height: 844 };
const FOLD = { width: 360, height: 640 };
const DESKTOP = { width: 1280, height: 800 };

/** A colour as the browser computes it — a token, never a literal here. */
const computed = (page: import("@playwright/test").Page, value: string) =>
  page.evaluate((expression) => {
    const probe = document.createElement("div");
    probe.style.color = expression;
    document.body.append(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    return resolved;
  }, value);

const hero = (page: import("@playwright/test").Page) =>
  page.locator('[data-hero="true"]').first();

const burger = (page: import("@playwright/test").Page) =>
  page.getByRole("banner").first().locator('[aria-controls="site-menu"]');

test.describe("DEC-0105 §1/§2: the scrim ladder and the focal crop, as composed", () => {
  test("the hero composes two neutral-black gradients, ceiling 0.72, cropped to a focal point", async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");
    await expect(hero(page)).toBeAttached();

    const surface = await hero(page).evaluate((node) => {
      const style = getComputedStyle(node);
      const image = style.backgroundImage;
      const gradients = image.match(/linear-gradient\((?:[^()]|\([^()]*\))*\)/g) ?? [];
      const stops = gradients.flatMap((gradient) =>
        [...gradient.matchAll(/rgba?\(([^)]*)\)/g)].map((match) => {
          const [r = 0, g = 0, b = 0, a = 1] = match[1]!.split(",").map((part) => Number(part.trim()));
          return { r, g, b, a };
        }),
      );
      return { gradients: gradients.length, stops, position: style.backgroundPosition };
    });

    expect(surface.gradients, "the two gradients of the design system").toBe(2);
    expect(surface.stops.length).toBeGreaterThanOrEqual(5);
    for (const stop of surface.stops) {
      expect([stop.r, stop.g, stop.b], "neutral black, never a tint").toEqual([0, 0, 0]);
      expect(stop.a, "no stop above the 0.72 ceiling").toBeLessThanOrEqual(0.72);
    }
    expect(Math.max(...surface.stops.map((stop) => stop.a))).toBeCloseTo(0.72, 2);
    // Never `center` by default: the stylesheet's own focal point, or the
    // inventory's — either way not the 50 % 50 % a bare `center` computes to.
    expect(surface.position).not.toBe("50% 50%");
  });
});

test.describe("SRC-0014 §The scrim: the soft text shadow exists only on a photo surface", () => {
  test("headline and CTA on the hero carry it; type on a flat ground carries none", async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");
    await expect(hero(page)).toBeAttached();

    const shadowOf = (locator: import("@playwright/test").Locator) =>
      locator.evaluate((node) => getComputedStyle(node).textShadow);

    const headline = await shadowOf(hero(page).locator("h1").first());
    expect(headline, "display type on the photograph").not.toBe("none");
    expect(headline).toContain("px");

    // The search's submit is a `button` — the form control the user-agent
    // sheet resets — and the design system names the button label explicitly.
    const control = hero(page).locator("[data-cta]").first();
    await expect(control).toBeAttached();
    expect(await shadowOf(control), "a button label on the photograph").not.toBe("none");

    // The first heading after the hero stands on a flat section ground.
    const flat = page.locator("#main h2").first();
    await expect(flat).toBeAttached();
    expect(await shadowOf(flat), "type on a flat ground").toBe("none");
    expect(await shadowOf(page.locator("footer").first()), "the footer").toBe("none");
  });
});

test.describe("DEC-0105 §4: the header's wells blur over the photograph and not on paper", () => {
  test("the burger well is the tinted blur over the hero and nothing on `/rechtliches`", async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");
    await expect(hero(page)).toBeAttached();

    const supported = await page.evaluate(() => CSS.supports("backdrop-filter", "blur(12px)"));
    test.skip(!supported, "no `@supports` match — the solid ink well is the declared fallback");

    const over = await burger(page).evaluate((node) => {
      const style = getComputedStyle(node);
      return { filter: style.backdropFilter, fill: style.backgroundColor };
    });
    expect(over.filter).toContain("blur(12px)");
    expect(over.filter).toContain("saturate(1.2)");
    expect(over.fill).toBe(await computed(page, "var(--color-scrim-38)"));

    // The 40 px mark reads the same two properties.
    const mark = await page
      .getByRole("banner")
      .first()
      .locator("img")
      .first()
      .evaluate((node) => getComputedStyle(node).backdropFilter);
    expect(mark).toContain("blur(12px)");

    await page.goto("/rechtliches");
    const solid = await burger(page).evaluate((node) => getComputedStyle(node).backdropFilter);
    expect(solid, "no blur on the paper ground").toBe("none");
  });
});

test.describe("TS-WEB-0024 D3: two conversions in one hero, stacked with a gap", () => {
  for (const viewport of [FOLD, DESKTOP]) {
    test(`at ${viewport.width}×${viewport.height} the equal-weight CTA sits under the primary, apart from it`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/dein-kalender");
      await expect(hero(page)).toBeAttached();

      const primary = hero(page).locator('[data-cta="primary"]').first();
      const secondary = hero(page).locator('[data-cta="equal-weight"]').first();
      await expect(primary).toBeVisible();
      await expect(secondary).toBeVisible();

      const [top, bottom] = await Promise.all([primary.boundingBox(), secondary.boundingBox()]);
      expect(top && bottom).toBeTruthy();
      expect(bottom!.y, "stacked, not side by side").toBeGreaterThan(top!.y + top!.height);
      expect(bottom!.y - (top!.y + top!.height), "a gap between the two").toBeGreaterThanOrEqual(8);
      expect(bottom!.x, "both start at the stack's edge").toBeCloseTo(top!.x, 0);
    });
  }
});
