import { expect, test, type Page } from "@playwright/test";

import { href } from "../src/lib/routes/routes";

/**
 * TS-WEB-0008-A19 — the nearby list has no empty rows under its answer, and
 * its heading names the window its rows span (owner review 2026-10-27, issue
 * #83, `plan/reviews/2026-10-27/Ist - Weißraum Nähe 1.png`: two rows under
 * "Diese Woche in der Nähe", then three rows of nothing before the calendar
 * link).
 *
 * Two causes, both measured on 2026-10-27 for Lehre: the week held two dates
 * within ~15 km (eight within 14 days, 24 upcoming), and the list kept its
 * five-row skeleton reserve after the answer landed. The BFF now fills the
 * list with the dates after the week (TS-WEB-0008-A18, integration), and the
 * list reserves for its skeleton only. This file pins the browser half with a
 * stubbed `/api/nearby`, so the measurement does not depend on what a village
 * calendar holds this week:
 *
 *  - the space between the last row and the calendar link is the frame's own,
 *    the same for two rows as for five — no reserve stays behind;
 *  - two rows reaching past the week carry the "coming up" heading, five rows
 *    inside it the page's "this week" heading;
 *  - the collapse is below the fold and adds nothing to CLS at 360×800.
 */

const PATH = `${href("place", "de")}?ort=schlatkow`;
const DAY = 86_400_000;

function row(index: number, offsetDays: number) {
  const day = new Date(Date.now() + offsetDays * DAY);
  day.setUTCHours(16, 0, 0, 0);
  return {
    id: `nearby-${index}`,
    title: `Testtermin ${index + 1}`,
    startsAt: day.toISOString(),
    placeName: "Wolgast",
    categoryId: "community-life",
    communityId: "geoname.2814270",
    distanceKm: 9,
  };
}

async function answerNearby(
  page: Page,
  days: readonly number[],
  window: "week" | "upcoming",
  gate: Promise<void> = Promise.resolve(),
): Promise<void> {
  await page.route(/\/api\/nearby/, async (route) => {
    await gate;
    await route.fulfill({
      json: {
        data: { events: days.map((offset, index) => row(index, offset)), radiusKm: 15, truncated: false, window },
        tier: "live",
        fetchedAt: new Date().toISOString(),
        stale: false,
        demo: false,
      },
    });
  });
}

interface Geometry {
  readonly rows: number;
  readonly gap: number;
  readonly heading: string;
}

async function nearbyGeometry(page: Page): Promise<Geometry> {
  const nearby = page.locator("#nearby");
  await expect(nearby.locator("article:has(> time)").first()).toBeVisible();
  await page.waitForLoadState("networkidle");
  return nearby.evaluate((section) => {
    const rows = [...section.querySelectorAll("article")].filter((article) => article.querySelector(":scope > time"));
    const last = rows.at(-1)!.getBoundingClientRect();
    const link = [...section.querySelectorAll("a")].find((anchor) => /Alle Termine/.test(anchor.textContent ?? ""));
    const headings = [...section.querySelectorAll("h3")].map((heading) => heading.textContent?.trim() ?? "");
    return {
      rows: rows.length,
      gap: (link?.getBoundingClientRect().top ?? Number.NaN) - last.bottom,
      heading: headings.join(" | "),
    };
  });
}

test.describe("TS-WEB-0008-A19: the nearby list ends with its rows and names its window", () => {
  test("two rows leave no reserved rows behind, and reaching past the week says so", async ({ page }) => {
    await answerNearby(page, [1, 2, 3, 4, 5], "week");
    await page.goto(PATH);
    const full = await nearbyGeometry(page);
    expect(full.rows).toBe(5);
    expect(full.heading).toContain("Diese Woche in der Nähe");

    await page.unrouteAll();
    await answerNearby(page, [2, 10], "upcoming");
    await page.goto(PATH);
    const thin = await nearbyGeometry(page);
    expect(thin.rows).toBe(2);
    expect(thin.heading).toContain("Demnächst in der Nähe");
    expect(thin.heading).not.toContain("Diese Woche");
    // The frame's own spacing under the last row, whatever the row count —
    // the kept reserve made this three two-line rows taller.
    expect(Math.abs(thin.gap - full.gap), `gap under 2 rows ${thin.gap}px, under 5 rows ${full.gap}px`).toBeLessThanOrEqual(2);
  });

  test("the collapse happens below the fold and adds nothing to CLS at 360×800", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.addInitScript(() => {
      const store = window as unknown as { __cls: number };
      store.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!shift.hadRecentInput) store.__cls += shift.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    // The answer waits until the skeleton was measured where it loads.
    let release = () => {};
    const gate = new Promise<void>((resolve) => (release = resolve));
    await answerNearby(page, [2, 10], "upcoming", gate);
    await page.goto(PATH);
    const skeleton = page.locator('#nearby [data-reserve="loading"]');
    await expect(skeleton).toBeAttached();
    const top = await skeleton.evaluate((list) => list.getBoundingClientRect().top);
    expect(top, "the nearby list stands below the fold while it loads").toBeGreaterThanOrEqual(800);
    release();
    await nearbyGeometry(page);
    await page.waitForTimeout(1200);
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.1);
  });
});
