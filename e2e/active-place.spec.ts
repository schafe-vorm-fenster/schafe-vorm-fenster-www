import { readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page, type Route } from "@playwright/test";

/**
 * DEC-0168 (issue #80) — one active place: the stage photograph, the headline,
 * the module rows and the calendar link always name the same place, whatever
 * order the network answers in.
 *
 * Every latency here is set by hand: the photo route and the image are
 * fulfilled by the test (fictitious author, the repository's own bytes), the
 * resolver and the nearest lookup are the real routes held back for a given
 * time. Each case reproduces one race the review of 2026-10-27 ran into
 * ("Je nachdem wann ich wie lade oder Geolokalisiere, haben wir ein falsches
 * Ortsbild"); each was red against the store-less islands.
 */

const IMAGE_BYTES = readFileSync(join(process.cwd(), "public/images/real/dein-ort-story-kultur.webp"));
const imageUrl = (slug: string) => `https://assets.api.schafe-vorm-fenster.de/api/image?wikimediaCommonsId=E2E%20${slug}.jpg`;

const PLACES = {
  schlatkow: { name: "Schlatkow", id: "2838887" },
  anklam: { name: "Anklam", id: "2956018" },
  quilow: { name: "Quilow", id: "2851333" },
} as const;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** The photo route answers every slug with that slug's own photograph, after `delays[slug]` ms. */
async function mockPhotos(page: Page, delays: Partial<Record<string, number>> = {}): Promise<string[]> {
  const asked: string[] = [];
  await page.route("**/api/places/*/photo", async (route: Route) => {
    const slug = new URL(route.request().url()).pathname.split("/")[3]!;
    asked.push(slug);
    await wait(delays[slug] ?? 0);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          src: imageUrl(slug),
          fileName: `E2E ${slug}.jpg`,
          sourceUrl: `https://commons.wikimedia.org/wiki/File:E2E_${slug}.jpg`,
          licence: "CC BY-SA 4.0",
          author: "Erika Musterfrau",
        },
        tier: "live",
        fetchedAt: "2026-10-27T12:00:00.000Z",
        stale: false,
        demo: false,
      }),
    });
  });
  await page.route("https://assets.api.schafe-vorm-fenster.de/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/webp", body: IMAGE_BYTES }),
  );
  return asked;
}

/**
 * Records, on every DOM change, which place the stage photograph shows, what
 * the label says, and which place the page's headline and module name — so a
 * frame in which they disagree is caught even if it lasts a few milliseconds.
 */
async function recordStage(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const frames: { photo: string | null; note: string | null; h1: string; module: string }[] = [];
    (window as unknown as { __stage: typeof frames }).__stage = frames;
    const sample = () => {
      const stage = document.querySelector("#focus-block");
      if (!stage) return;
      frames.push({
        photo: stage.querySelector("[data-place-photo]")?.getAttribute("data-place-photo") ?? null,
        note: stage.querySelector("[data-photo-note]:not([data-photo-credit] *)")?.getAttribute("data-photo-note") ?? null,
        h1: document.querySelector("h1")?.textContent ?? "",
        module: document.querySelector("#place-dates h2, #place-dates h3")?.textContent ?? "",
      });
    };
    new MutationObserver(sample).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
  });
}

type Frame = { photo: string | null; note: string | null; h1: string; module: string };
const frames = (page: Page) => page.evaluate(() => (window as unknown as { __stage: Frame[] }).__stage);

/** A frame whose headline names a place while the stage shows another place's photograph, unlabelled. */
function disagreements(all: readonly Frame[], placeName: string, slug: string): Frame[] {
  return all.filter((frame) => frame.h1.includes(placeName) && frame.photo !== slug && frame.note === null);
}

test.describe("DEC-0168: one active place", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("TS-WEB-0020-A27: /dein-ort without a place shows the example's photograph — the place its module names", async ({
    page,
  }) => {
    const asked = await mockPhotos(page, { schlatkow: 800 });
    await recordStage(page);
    await page.goto("/dein-ort");

    // While the example's photograph loads, the stage's own picture says it is an example.
    await expect(page.locator('#focus-block [data-photo-note="pending"]')).toBeVisible();
    // Then the stage shows the place the module speaks about.
    await expect(page.locator('#focus-block [data-place-photo="schlatkow"]')).toBeVisible();
    await expect(page.locator("#place-dates")).toContainText("Schlatkow");
    await expect(page.locator('#focus-block [data-photo-note="pending"]')).toHaveCount(0);
    expect(asked).toEqual(["schlatkow"]);

    // The calendar link the example offers is the example's own calendar.
    await expect(page.locator(`#homescreen a[href="https://schafe-vorm-fenster.de/schlatkow.${PLACES.schlatkow.id}"]`)).toHaveCount(1);
  });

  test("TS-WEB-0020-A27: while ?ort= resolves, the example is neither fetched nor shown", async ({ page }) => {
    await mockPhotos(page, { anklam: 1200 });
    const requested: string[] = [];
    page.on("request", (request) => {
      const { pathname } = new URL(request.url());
      if (pathname.startsWith("/api/")) requested.push(pathname);
    });
    await page.route((url) => url.pathname === "/api/places/resolve", async (route) => {
      await wait(1000);
      await route.continue();
    });
    await recordStage(page);
    await page.goto("/dein-ort?ort=anklam");

    await expect(page.locator("h1")).toContainText("Anklam");
    await expect(page.locator('#focus-block [data-place-photo="anklam"]')).toBeVisible();

    // Nothing about Schlatkow was asked: no rows, no nearby list, no photograph.
    expect(requested.filter((path) => path.includes("/schlatkow/"))).toEqual([]);
    // And no frame showed Anklam's headline over an unlabelled other picture —
    // while its photograph loaded, the stage said "Beispielfoto".
    expect(disagreements(await frames(page), "Anklam", "anklam")).toEqual([]);
    await expect(page.locator(`#place-dates a[href="https://schafe-vorm-fenster.de/anklam.${PLACES.anklam.id}"]`)).toHaveCount(1);
  });

  test("TS-WEB-0019-A22: / with a place never stands its headline over another place's unlabelled photograph", async ({
    page,
  }) => {
    await mockPhotos(page, { quilow: 1500 });
    await recordStage(page);
    await page.goto("/?ort=quilow");

    await expect(page.locator("h1")).toContainText("Quilow");
    await expect(page.locator('#focus-block [data-place-photo="quilow"]')).toBeVisible();
    // `/`'s own photograph is the Melkerschule in Schlatkow; for 1.5 s it stood
    // under "Das ist los in Quilow" with no word that it is not Quilow.
    expect(disagreements(await frames(page), "Quilow", "quilow")).toEqual([]);
  });

  test("TS-WEB-0019-A22: / without a place keeps its own photograph — it depicts the example — and asks nothing", async ({
    page,
  }) => {
    const asked = await mockPhotos(page);
    await page.goto("/");
    await expect(page.locator("#place-dates")).toContainText("Schlatkow");
    await page.waitForLoadState("networkidle");
    expect(asked).toEqual([]);
    await expect(page.locator("#focus-block [data-place-photo], #focus-block [data-photo-note]")).toHaveCount(0);
  });

  test("TS-WEB-0020-A27: a place switch inside the document drops the earlier place's late photograph", async ({
    page,
  }) => {
    await mockPhotos(page, { quilow: 2000, anklam: 0 });
    await recordStage(page);
    await page.goto("/dein-ort?ort=quilow");
    await expect(page.locator("h1")).toContainText("Quilow");

    // A client-side navigation (the router the query store follows), while
    // Quilow's photograph is still on its way.
    await page.evaluate(() =>
      (window as unknown as { next: { router: { push: (href: string) => void } } }).next.router.push("/dein-ort?ort=anklam"),
    );
    await expect(page.locator("h1")).toContainText("Anklam");
    await expect(page.locator('#focus-block [data-place-photo="anklam"]')).toBeVisible();
    await page.waitForTimeout(2500); // Quilow's answer lands now — and must change nothing
    await expect(page.locator("#focus-block [data-place-photo]")).toHaveAttribute("data-place-photo", "anklam");
    expect(disagreements(await frames(page), "Anklam", "anklam")).toEqual([]);
  });

  test("TS-WEB-0020-A27: a position that resolves late never overrides the place picked meanwhile", async ({
    page,
    context,
  }) => {
    await mockPhotos(page);
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 53.92153, longitude: 13.58116 }); // Schlatkow
    await page.route((url) => url.pathname === "/api/places/nearest", async (route) => {
      await wait(1500);
      await route.continue();
    });
    // The visitor's own pick takes a while to load.
    await page.route((url) => url.pathname === "/dein-ort" && url.searchParams.get("ort") === "anklam", async (route) => {
      if (route.request().resourceType() === "document") await wait(3000);
      await route.continue();
    });

    await page.goto("/dein-ort?ort=quilow");
    await expect(page.locator("h1")).toContainText("Quilow");
    await expect(page.locator("[data-locate-control]").first()).toBeEnabled();
    await page.locator("[data-locate-control]").first().click();

    // …and, before the position is back, picks Anklam in the search.
    const field = page.locator("#focus-block input[name='ort']").first();
    await field.fill("Anklam");
    const option = page.locator("[data-typeahead-option]").filter({ hasText: /^Anklam/u }).first();
    await expect(option).toBeVisible();
    await option.click({ noWaitAfter: true });

    await page.waitForURL(/ort=/u, { timeout: 10_000 });
    await expect(page.locator("h1")).toContainText(/Anklam|Schlatkow/u, { timeout: 10_000 });
    expect(new URL(page.url()).searchParams.get("ort")).toBe("anklam");
    await expect(page.locator("h1")).toContainText("Anklam");
  });
});
