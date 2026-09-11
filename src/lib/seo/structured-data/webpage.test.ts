import { describe, expect, it } from "vitest";

import { canonicalUrl } from "@/src/lib/routes/routes";
import { WEBSITE_ID } from "@/src/lib/seo/structured-data/website";
import { webPageNode } from "@/src/lib/seo/structured-data/webpage";

describe("TS-011 D4: the WebPage node, emitted on every page", () => {
  it("derives url/id/inLanguage from the route table and takes title/description as given", () => {
    const node = webPageNode({
      route: "calendar",
      locale: "de",
      title: "Dein Kalender",
      description: "Ein Kalender für deinen Ort.",
    });
    expect(node["@type"]).toBe("WebPage");
    expect(node.url).toBe(canonicalUrl("calendar", "de"));
    expect(node["@id"]).toBe(`${canonicalUrl("calendar", "de")}#webpage`);
    expect(node.inLanguage).toBe("de");
    expect(node.isPartOf).toEqual({ "@id": WEBSITE_ID });
    expect(node.name).toBe("Dein Kalender");
    expect(node.description).toBe("Ein Kalender für deinen Ort.");
  });

  it("omits primaryImageOfPage when no image is given, includes it when one is", () => {
    const withoutImage = webPageNode({
      route: "home",
      locale: "de",
      title: "t",
      description: "d",
    });
    expect(withoutImage).not.toHaveProperty("primaryImageOfPage");

    const withImage = webPageNode({
      route: "home",
      locale: "de",
      title: "t",
      description: "d",
      imageUrl: "https://www.schafe-vorm-fenster.de/og/home-de.png",
    });
    expect(withImage.primaryImageOfPage).toEqual({
      "@type": "ImageObject",
      url: "https://www.schafe-vorm-fenster.de/og/home-de.png",
    });
  });
});
