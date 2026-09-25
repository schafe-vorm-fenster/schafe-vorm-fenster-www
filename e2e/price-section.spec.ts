import { expect, test, type Page } from "@playwright/test";

/**
 * The price-section set (T-06, DEC-0118), measured in a browser on the
 * component gallery — `/dev/components`, the same tree `gallery.test.tsx`
 * renders. The criteria these facts serve are page-level
 * (TS-WEB-0024-A8, TS-WEB-0006-A18, TS-WEB-0022-A17); the page specs assert
 * them on the pages once T-12/T-13 compose the components. Here the facts
 * that are the component's own are held: the weights, the hairline, the
 * struck tag, the banner's shape.
 */

const ROUTE = "/dev/components";

/** The computed colour a token resolves to, read off a probe element. */
async function tokenColour(page: Page, token: string): Promise<string> {
  return page.evaluate((name) => {
    const probe = document.createElement("span");
    probe.style.backgroundColor = `var(${name})`;
    document.body.append(probe);
    const colour = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return colour;
  }, token);
}

test.describe("price-section on the gallery", () => {
  test("three rows in order, exactly one CTA each, none primary, tier 2 strong and never Pulse", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const section = page.locator('[data-component="price-section"] section');
    await expect(section).toHaveCount(1);
    await expect(section).toHaveAttribute("data-surface", "paper");
    await expect(section.locator('[data-surface="lime-500"]')).toHaveCount(1);

    const rows = section.locator("[data-offering]");
    await expect(rows).toHaveCount(3);
    expect(await rows.evaluateAll((els) => els.map((el) => el.getAttribute("data-offering")))).toEqual([
      "community-calendar",
      "portalize-calendar",
      "portalize-enterprise",
    ]);

    for (const id of ["community-calendar", "portalize-calendar", "portalize-enterprise"]) {
      const row = section.locator(`[data-offering="${id}"]`);
      await expect(row.locator("a, button")).toHaveCount(1);
      await expect(row.locator("[data-cta]")).toHaveCount(1);
      await expect(row.locator('[data-cta="primary"]')).toHaveCount(0);
    }
    await expect(section.locator('[data-offering="community-calendar"]')).toHaveAttribute(
      "data-cta-variant",
      "quiet",
    );
    await expect(section.locator('[data-offering="portalize-calendar"]')).toHaveAttribute(
      "data-cta-variant",
      "primary-light",
    );
    await expect(section.locator('[data-offering="portalize-enterprise"]')).toHaveAttribute(
      "data-cta-variant",
      "quiet",
    );

    // The strong button is ink, and no tier CTA is the paid conversion's fill.
    const ink = await tokenColour(page, "--color-neutral-ink");
    const pulse = await tokenColour(page, "--color-himbeere-600");
    const fills = await rows.locator("a").evaluateAll((els) => els.map((el) => getComputedStyle(el).backgroundColor));
    expect(fills[1]).toBe(ink);
    for (const fill of fills) expect(fill).not.toBe(pulse);

    // Tier 1 → /mitmachen, tier 2 → /dein-kalender/bestellen, tier 3 → /deine-region.
    await expect(section.locator('[data-offering="community-calendar"] a')).toHaveAttribute("href", "/mitmachen");
    await expect(section.locator('[data-offering="portalize-calendar"] a')).toHaveAttribute(
      "href",
      "/dein-kalender/bestellen",
    );
    await expect(section.locator('[data-offering="portalize-enterprise"] a')).toHaveAttribute("href", "/deine-region");
  });

  test("rows are divided by a 1 px `line` hairline, never a 2 px lime rule", async ({ page }) => {
    await page.goto(ROUTE);
    const line = await tokenColour(page, "--color-neutral-line");
    const rows = page.locator('[data-component="price-section"] [data-offering]');
    const borders = await rows.evaluateAll((els) =>
      els.map((el) => {
        const style = getComputedStyle(el);
        return { width: style.borderTopWidth, colour: style.borderTopColor };
      }),
    );
    expect(borders[0]?.width).toBe("0px");
    for (const border of borders.slice(1)) {
      expect(border.width).toBe("1px");
      expect(border.colour).toBe(line);
    }
  });

  test("the free tier shows no figure; the paid tier shows the figure with its qualifier in one paragraph", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const free = await page.locator('[data-component="price-section"] [data-offering="community-calendar"]').innerText();
    expect(free).not.toMatch(/\d\s*€/);
    // One paragraph carries figure and qualifier; `innerText` breaks flex
    // items onto lines, so the check reads the paragraph's text content.
    const paid = await page
      .locator('[data-component="price-section"] [data-offering="portalize-calendar"] p', { hasText: "480" })
      .evaluate((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim());
    expect(paid).toBe("480 € / Jahr, zzgl. USt.");
  });
});

test.describe("tag, setting-row and hint-banner on the gallery", () => {
  test("the excluded tag has no fill, a 1 px border and a struck label", async ({ page }) => {
    await page.goto(ROUTE);
    const excluded = page.locator('[data-component="tag"] [data-excluded="true"]');
    await expect(excluded).toHaveCount(1);
    const border = await tokenColour(page, "--color-neutral-border");
    const style = await excluded.evaluate((el) => {
      const s = getComputedStyle(el);
      return { fill: s.backgroundColor, borderWidth: s.borderTopWidth, borderColour: s.borderTopColor };
    });
    // "No fill": the same computed value a transparent probe reports.
    const transparent = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.style.backgroundColor = "transparent";
      document.body.append(probe);
      const colour = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return colour;
    });
    expect(style.fill).toBe(transparent);
    expect(style.borderWidth).toBe("1px");
    expect(style.borderColour).toBe(border);
    await expect(excluded.locator("s")).toHaveCount(1);
    expect(await excluded.locator("s").evaluate((el) => getComputedStyle(el).textDecorationLine)).toBe(
      "line-through",
    );
  });

  test("the setting rows stand in a list, and the marker is text in the accessibility tree", async ({ page }) => {
    await page.goto(ROUTE);
    // The rows themselves — not the tag list items nested inside them.
    const rows = page.locator('[data-component="setting-row"] li:not(li li)');
    await expect(rows).toHaveCount(3);
    await expect(page.locator('[data-component="setting-row"] h3')).toHaveCount(3);
    await expect(page.locator('[data-component="setting-row"] h3', { hasText: "wird geprüft" })).toHaveCount(1);
    await expect(page.locator('[data-component="setting-row"] a, [data-component="setting-row"] button')).toHaveCount(0);
  });

  test("the hint banner is one note with no CTA, no figure and the package's three sources", async ({ page }) => {
    await page.goto(ROUTE);
    const banner = page.locator("[data-hint-banner]");
    await expect(banner).toHaveCount(1);
    await expect(banner).toHaveAttribute("role", "note");
    await expect(banner.locator("[data-cta], a, button")).toHaveCount(0);
    await expect(banner.locator("[data-standard-source]")).toHaveCount(3);
    const text = await banner.innerText();
    expect(text).not.toMatch(/\d/);
    expect(text).not.toContain("€");
    expect(text).not.toMatch(/\bab\b/);
  });
});
