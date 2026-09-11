import { describe, expect, it } from "vitest";

import { canonicalUrl } from "@/src/lib/routes/routes";
import { BREADCRUMB_ROUTES, breadcrumbListNode } from "@/src/lib/seo/structured-data/breadcrumb";

const titleFor = (route: string) => `Title:${route}`;

describe("TS-011-A14 / DEC-071: exactly the five second-level pages emit a BreadcrumbList", () => {
  it("names exactly the five routes D4 assigns", () => {
    expect([...BREADCRUMB_ROUTES].sort()).toEqual(
      ["archive", "order", "placeStart", "register", "regionQuote"].sort(),
    );
  });

  it("emits nothing for a route outside the five", () => {
    expect(breadcrumbListNode("home", "de", titleFor)).toBeUndefined();
    expect(breadcrumbListNode("calendar", "de", titleFor)).toBeUndefined();
  });

  it("positions match the visible trail item for item, last item is the page itself", () => {
    const node = breadcrumbListNode("order", "de", titleFor);
    expect(node?.itemListElement.map((item) => item.position)).toEqual([1, 2]);
    expect(node?.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Title:calendar",
      item: canonicalUrl("calendar", "de"),
    });
    expect(node?.itemListElement.at(-1)).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Title:order",
      item: canonicalUrl("order", "de"),
    });
  });
});
