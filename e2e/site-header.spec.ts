import { expect, test } from "@playwright/test";

/**
 * The header — TS-WEB-0004 D4, and Jan's round-3 points 2 and 3
 * (`state/open.md` rows 35, 200, 201).
 *
 * Three things are under test, in this order:
 *
 *  1. **the inventory survives the disclosure.** The four job labels of D4
 *     and the persistent calendar entry are reachable at 360 and at 1280 —
 *     inline above `md`, behind the burger below it. A menu that hides a
 *     destination is a different navigation model, which D4 does not allow;
 *  2. **the overlay is operable from the keyboard alone.** Open, tab, escape,
 *     focus restored — the walk Jan asked for, run rather than described;
 *  3. **the two grounds.** Transparent over a hero photograph, solid once it
 *     has scrolled past, and solid throughout on a page without one — with no
 *     geometry change between them, which is what keeps CLS at 0.
 */

const PHONE = { width: 360, height: 640 };
const DESKTOP = { width: 1280, height: 800 };

/**
 * The disclosure switch point is `xl`, not the `md` Jan's wording names: the
 * four German labels do not fit an inline row below 1024 px, measured
 * (`state/open.md` row 201). The wordmark's own switch point is still `md`.
 */
const BELOW_XL = { width: 768, height: 900 };

/** The four jobs of TS-WEB-0004 D4, verbatim, in IA order. */
const JOBS = ["Was ist los", "Termine veröffentlichen", "Dein Kalender", "Warum wir"];
const CALENDAR = "Kalender";

/** The header is the document's `banner`; a page may carry other `header`s. */
const header = (page: import("@playwright/test").Page) =>
  page.getByRole("banner").first();

const burger = (page: import("@playwright/test").Page) =>
  header(page).locator('[aria-controls="site-menu"]');

const dialog = (page: import("@playwright/test").Page) =>
  page.locator("dialog#site-menu").first();

/**
 * A colour expression as the browser computes it — a design token, or
 * `transparent`. The assertions below compare against these rather than
 * against literals, because TS-WEB-0017 D3 lets brand values enter the repository
 * through `app/styles/brand.css` and nowhere else (`pnpm check:brand` fails a
 * literal even in a comment), and because a token that changes should move
 * the test with it rather than break it.
 */
const computed = (page: import("@playwright/test").Page, value: string) =>
  page.evaluate((expression) => {
    const probe = document.createElement("div");
    probe.style.color = expression;
    document.body.append(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    return resolved;
  }, value);

const INK = "var(--color-neutral-ink)";
const PAPER = "var(--color-neutral-paper)";
const LABEL_INK = "var(--color-neutral-text2)";
const NOTHING = "transparent";

/** `toHaveCSS` with a token on the expected side. */
async function expectColor(
  page: import("@playwright/test").Page,
  locator: import("@playwright/test").Locator,
  property: "color" | "background-color",
  token: string,
) {
  await expect(locator).toHaveCSS(property, await computed(page, token));
}

test.describe("TS-WEB-0004-A8: the header inventory at both widths", () => {
  test("above `xl` the four job labels and the calendar entry are inline", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    const nav = header(page).getByRole("navigation", { name: "Startseite" });
    await expect(nav.getByRole("link")).toHaveText(JOBS);
    await expect(header(page).getByRole("link", { exact: true, name: CALENDAR })).toBeVisible();
    await expect(burger(page)).toBeHidden();
  });

  test("below `xl` the same five destinations are reachable behind the burger", async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");

    // The calendar entry never leaves the bar — TS-WEB-0004 D4's persistent entry,
    // and TS-WEB-0017-A12's "on every page" (state/open.md row 30).
    await expect(header(page).getByRole("link", { exact: true, name: CALENDAR })).toBeVisible();
    await expect(burger(page)).toBeVisible();

    await burger(page).click();
    const menu = dialog(page);
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("navigation", { name: "Menü" }).getByRole("link")).toHaveText(
      JOBS,
    );
    await expect(menu.getByRole("link", { exact: true, name: CALENDAR })).toBeVisible();
    await expect(menu.getByRole("navigation", { name: "Sprache" })).toBeVisible();
  });

  test("the header row never scrolls sideways, at any width", async ({ page }) => {
    // Row 35's anti-pattern, under test: the bar must fit, not scroll.
    for (const width of [320, 360, 428, 640, 768, 900, 1024, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await header(page)
        .locator(".container")
        .first()
        .evaluate((node) => node.scrollWidth - node.clientWidth);
      expect(overflow, `header row overflow at ${width}px`).toBeLessThanOrEqual(0);
    }
  });

  test("at 768 px the labels are still disclosed, not squeezed", async ({ page }) => {
    await page.setViewportSize(BELOW_XL);
    await page.goto("/");
    await expect(burger(page)).toBeVisible();
    await expect(header(page).getByRole("navigation", { name: "Startseite" })).toBeHidden();
  });

  test("the burger clears the 44 px touch target", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");
    const box = await burger(page).boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("TS-WEB-0002-A4: the phone menu, from the keyboard alone", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");
  });

  test("opens from the keyboard, announces itself, and lands on the first item", async ({
    page,
  }) => {
    await expect(burger(page)).toHaveAttribute("aria-expanded", "false");
    await burger(page).focus();
    await page.keyboard.press("Enter");

    await expect(dialog(page)).toBeVisible();
    await expect(burger(page)).toHaveAttribute("aria-expanded", "true");
    // Jan's round-3 point 3: first focus on the first item.
    await expect(page.locator(":focus")).toHaveText(JOBS[0]!);
  });

  test("keeps focus inside the overlay while tabbing", async ({ page }) => {
    await burger(page).click();
    await expect(dialog(page)).toBeVisible();

    for (let step = 0; step < 12; step += 1) {
      await page.keyboard.press("Tab");
    }
    const trapped = await page.evaluate(() => {
      const element = document.querySelector("dialog#site-menu");
      const active = document.activeElement;
      // The native modal returns focus to the document between wraps; what
      // must never happen is focus landing on a control *behind* the overlay.
      return active === document.body || Boolean(element?.contains(active));
    });
    expect(trapped).toBe(true);
  });

  test("the page behind the overlay cannot scroll", async ({ page }) => {
    await burger(page).click();
    await expect(dialog(page)).toBeVisible();
    // `showModal()` makes everything outside the top layer inert — the tab
    // walk above is the assertion for that. What the browser does *not* do
    // reliably is stop the page behind from scrolling, so the shell locks it
    // (Jan's round-3 point 3), and it must give the lock back on close.
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
  });

  test("Escape closes it and returns focus to the burger", async ({ page }) => {
    await burger(page).focus();
    await page.keyboard.press("Enter");
    await expect(dialog(page)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect(burger(page)).toHaveAttribute("aria-expanded", "false");
    await expect(burger(page)).toBeFocused();
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  });

  test("widening past `xl` closes it rather than trapping focus in a gone control", async ({
    page,
  }) => {
    await burger(page).click();
    await expect(dialog(page)).toBeVisible();
    await page.setViewportSize(DESKTOP);
    await expect(dialog(page)).toBeHidden();
  });
});

test.describe("TS-WEB-0009-A8: the header's two grounds, without a layout shift", () => {
  test("lies transparent on the hero photograph and turns solid past it", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const bar = header(page);

    await expect(bar).toHaveAttribute("data-over-hero", "true");
    await expect(bar).toHaveAttribute("data-solid", "false");
    const before = await bar.boundingBox();

    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(bar).toHaveAttribute("data-solid", "true");
    const after = await bar.boundingBox();

    // Only colours change: same box, same position, so nothing shifts.
    expect(after?.height).toBe(before?.height);
    expect(after?.y).toBe(before?.y);
  });

  test("the hero it observes is marked, on every page that claims one", async ({
    page,
  }) => {
    for (const path of ["/", "/dein-ort", "/mitmachen", "/ueber-uns"]) {
      await page.goto(path);
      const overHero = await header(page).getAttribute("data-over-hero");
      const heroes = await page.locator('main [data-hero="true"]').count();
      // The pairing the header's scroll measure depends on: a page that says
      // it opens on a photograph must actually render one.
      expect(overHero === "true" ? heroes > 0 : true).toBe(true);
    }
  });

  test("a page without a hero photograph keeps the solid header", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/rechtliches");
    await expect(header(page)).toHaveAttribute("data-solid", "true");
  });
});

/**
 * Jan's round-4 change request (`state/open.md` row 200): over the hero the
 * header paints **nothing** — no scrim, no hairline — and the contrast comes
 * from a 44 px control well per item instead. These are the assertions that
 * would go red if a ground ever crept back in, and the ones that keep the
 * wells opaque, which is the whole of what makes the measured ratios hold.
 */
test.describe("TS-WEB-0004-A8: completely transparent over the hero, wells instead of a scrim", () => {
  test("paints no ground and no border while it lies on the photograph", async ({
    page,
  }) => {
    for (const width of [360, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      const bar = header(page);
      await expect(bar).toHaveAttribute("data-solid", "false");
      await expect(bar).toHaveCSS("background-image", "none");
      await expectColor(page, bar, "background-color", NOTHING);
      await expect(bar).toHaveCSS("border-bottom-width", "0px");
      // The round-3 tail scrim below the bar is gone with it.
      const tail = await bar.evaluate(
        (node) => getComputedStyle(node, "::after").content,
      );
      expect(tail).toBe("none");
    }
  });

  test("the solid ground carries no border either — surface contrast divides", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/rechtliches");
    await expect(header(page)).toHaveCSS("border-bottom-width", "0px");
  });

  test("the burger sits in an opaque 44 px well over the hero, and in none on paper", async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);

    await page.goto("/");
    const well = await burger(page).evaluate((node) => {
      const style = getComputedStyle(node);
      const box = node.getBoundingClientRect();
      return {
        fill: style.backgroundColor,
        radius: style.borderTopLeftRadius,
        size: Math.min(box.width, box.height),
      };
    });
    // `ink`, opaque: the stripes' 16.56:1 is a token pair, not a photograph.
    expect(well.fill).toBe(await computed(page, INK));
    expect(Number.parseFloat(well.radius)).toBeGreaterThanOrEqual(22);
    expect(well.size).toBeGreaterThanOrEqual(44);

    await page.goto("/rechtliches");
    await expectColor(page, burger(page), "background-color", NOTHING);
  });

  test("the four desktop labels share one opaque well, and `aria-current` stays a fill", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dein-ort");

    const list = header(page).getByRole("navigation", { name: "Startseite" }).locator("ul");
    await expectColor(page, list, "background-color", INK);

    const current = header(page)
      .getByRole("navigation", { name: "Startseite" })
      .locator('a[data-current="true"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute("aria-current", "page");
    // A fill, not colour alone — paper chip, ink label, inside the ink well.
    await expectColor(page, current, "background-color", PAPER);
    await expectColor(page, current, "color", INK);
  });

  test("over the hero the logo stands as the mark alone, without moving anything", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    // `.first()` is the bar's own logo: the overlay carries a second one,
    // and it keeps its wordmark on the ink dialog by design.
    const wordmark = header(page).locator("[data-wordmark]").first();
    // Hidden, not removed: the box stays, so turning solid shifts nothing.
    await expect(wordmark).toHaveCSS("visibility", "hidden");
    const box = await wordmark.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(0);

    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(header(page)).toHaveAttribute("data-solid", "true");
    await expect(wordmark).toBeVisible();
    const after = await wordmark.boundingBox();
    expect(after?.x).toBe(box?.x);
    expect(after?.width).toBe(box?.width);
  });
});

/**
 * Without JavaScript nothing can observe the hero leaving, so the header
 * stays solid and in the flow — and, since round 4, so does everything in
 * it. Round 3 reset only the bar's own ground here and left the four job
 * labels paper-on-paper (measured 1:1, four invisible links on every hero
 * page); this is the test that keeps them readable.
 */
test.describe("TS-WEB-0004-A8: without JavaScript the header is solid, items included", () => {
  test.use({ javaScriptEnabled: false });

  test("solid ground, solid items", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const bar = header(page);

    await expectColor(page, bar, "background-color", PAPER);
    await expect(bar).toHaveCSS("position", "sticky");
    await expect(bar).toHaveCSS("background-image", "none");

    const job = bar.getByRole("navigation", { name: "Startseite" }).getByRole("link").first();
    await expectColor(page, job, "color", LABEL_INK);
    await expectColor(
      page,
      bar.getByRole("navigation", { name: "Startseite" }).locator("ul"),
      "background-color",
      NOTHING,
    );
    await expect(bar.locator("[data-wordmark]").first()).toBeVisible();

    // The calendar entry goes back to the "primary on light" pair as well.
    const cta = bar.getByRole("link", { exact: true, name: CALENDAR });
    await expectColor(page, cta, "background-color", INK);
    await expectColor(page, cta, "color", PAPER);
  });
});
