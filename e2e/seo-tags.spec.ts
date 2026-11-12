import { expect, test } from "@playwright/test";

import { LOCALES } from "../src/lib/i18n/locales";
import { alternateUrls, canonicalUrl, everyRoute, href } from "../src/lib/routes/routes";
import { shareImageUrl } from "../src/lib/seo/share-image";

/**
 * The required head tags of every page, in both languages — TS-WEB-0011 D5/D6/D10,
 * issue 195: TS-WEB-0011-A15 (head tags), A9 (the image), A16 (icons and
 * manifest). The requirements behind them are listed in TS-WEB-0011 D11.
 *
 * `metadata-compliance.spec.ts` checks that title and description carry no
 * internal identifier; this file checks that the whole social and canonical
 * set is present, absolute, and consistent with the route table: title,
 * description (120–160 characters), `og:title/description/url/image/type`,
 * `twitter:card` = `summary_large_image` with its own title/description/image,
 * the self-canonical, and one hreflang per language plus `x-default`.
 * The share image of each page must answer 200 as `image/png`.
 */

/** Next writes the bare origin without its trailing slash; both spellings are the same URL. */
const same = (url: string | null) => (url ?? "").replace(/\/$/, "");

const ROUTES = everyRoute().map(({ route, locale }) => ({
  route,
  locale,
  path: href(route, locale),
}));

for (const { route, locale, path } of ROUTES) {
  test(`TS-WEB-0011-A15: ${path} (${route}/${locale}) carries the required head tags`, async ({
    page,
  }) => {
    await page.goto(path);

    const meta = async (selector: string) =>
      await page.locator(`head ${selector}`).first().getAttribute("content");

    const title = await page.title();
    expect(title.trim(), "<title>").not.toBe("");

    const description = await meta('meta[name="description"]');
    expect(description, "meta description").toBeTruthy();
    expect(description!.length, `description length: "${description}"`).toBeGreaterThanOrEqual(120);
    expect(description!.length, `description length: "${description}"`).toBeLessThanOrEqual(160);

    const canonical = canonicalUrl(route, locale);
    expect(same(await page.locator('head link[rel="canonical"]').getAttribute("href"))).toBe(
      same(canonical),
    );

    for (const [hreflang, url] of Object.entries(alternateUrls(route))) {
      expect(
        same(
          await page
            .locator(`head link[rel="alternate"][hreflang="${hreflang}"]`)
            .getAttribute("href"),
        ),
        `hreflang ${hreflang}`,
      ).toBe(same(url));
    }
    expect(LOCALES.length).toBeGreaterThan(1);

    expect(await meta('meta[property="og:title"]')).toBeTruthy();
    expect(await meta('meta[property="og:description"]')).toBe(description);
    expect(await meta('meta[property="og:type"]')).toBe("website");
    expect(same(await meta('meta[property="og:url"]'))).toBe(same(canonical));
    const image = shareImageUrl(route, locale);
    expect(await meta('meta[property="og:image"]')).toBe(image);
    expect(await meta('meta[property="og:image:width"]')).toBe("1200");
    expect(await meta('meta[property="og:image:height"]')).toBe("630");
    expect(await meta('meta[property="og:image:alt"]')).toBeTruthy();

    expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
    expect(await meta('meta[name="twitter:title"]')).toBeTruthy();
    expect(await meta('meta[name="twitter:description"]')).toBe(description);
    expect(await meta('meta[name="twitter:image"]')).toBe(image);
    expect(await meta('meta[name="twitter:image:alt"]')).toBeTruthy();

  });

  test(`TS-WEB-0011-A9: the share image of ${path} (${route}/${locale}) is a 1200x630 PNG within budget`, async ({
    request,
  }) => {
    // The image is addressed by its production URL; the same path answers here.
    const response = await request.get(new URL(shareImageUrl(route, locale)).pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const bytes = await response.body();
    // PNG IHDR: width and height are the two big-endian words at offset 16.
    expect(bytes.readUInt32BE(16), "width").toBe(1200);
    expect(bytes.readUInt32BE(20), "height").toBe(630);
    expect(bytes.length, "size in bytes").toBeLessThanOrEqual(300 * 1024);
  });
}

test("TS-WEB-0011-A16: favicon, touch icon and manifest are linked and answer", async ({
  page,
  request,
}) => {
  await page.goto("/");
  expect(await page.locator('head link[rel="icon"]').count()).toBeGreaterThan(0);
  const touch = await page.locator('head link[rel="apple-touch-icon"]').getAttribute("href");
  expect(touch).toBeTruthy();
  const manifest = await page.locator('head link[rel="manifest"]').getAttribute("href");
  expect(manifest).toBeTruthy();

  for (const url of [touch!, manifest!, "/api/icon/32", "/api/icon/192", "/api/icon/512"]) {
    const response = await request.get(url);
    expect(response.status(), url).toBe(200);
  }
  const icon = await request.get("/api/icon/192");
  expect(icon.headers()["content-type"]).toContain("image/png");
});
