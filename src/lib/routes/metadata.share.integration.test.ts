import { describe, expect, it } from "vitest";

import { pageDescription, pageMetadata, pageTitle } from "@/src/lib/routes/metadata";
import { everyRoute } from "@/src/lib/routes/routes";
import { shareImageUrl } from "@/src/lib/seo/share-image";

describe("TS-WEB-0011-A8: the share set of every page (D6, issue 195)", () => {
  it.each(everyRoute())(
    "$route/$locale names its own 1200x630 image, absolute, with alt text",
    ({ route, locale }) => {
      const { openGraph, twitter } = pageMetadata(route, locale);
      const [image] = [openGraph?.images ?? []].flat() as {
        url: string;
        width: number;
        height: number;
        type: string;
        alt: string;
      }[];
      expect(image).toMatchObject({
        url: shareImageUrl(route, locale),
        width: 1200,
        height: 630,
        type: "image/png",
      });
      expect(image?.url).toMatch(/^https:\/\//);
      expect(image?.alt.length).toBeGreaterThan(0);
      expect(twitter).toMatchObject({
        card: "summary_large_image",
        title: pageTitle(route, locale),
        description: pageDescription(route, locale),
      });
    },
  );

  it.each(everyRoute())(
    "$route/$locale writes a description of 120 to 160 characters",
    ({ route, locale }) => {
      const length = pageDescription(route, locale).length;
      expect(length, `${route}/${locale}`).toBeGreaterThanOrEqual(120);
      expect(length, `${route}/${locale}`).toBeLessThanOrEqual(160);
    },
  );

  it("gives every page a distinct image address", () => {
    const urls = everyRoute().map(({ route, locale }) => shareImageUrl(route, locale));
    expect(new Set(urls).size).toBe(urls.length);
  });
});
