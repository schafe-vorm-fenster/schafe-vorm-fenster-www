import { describe, expect, it } from "vitest";

import { ORGANIZATION_ID } from "@/src/lib/seo/structured-data/organization";
import { WEBSITE_ID, websiteNode } from "@/src/lib/seo/structured-data/website";

describe("TS-011 D4: the WebSite node", () => {
  it("names the site, its language and its publisher by reference", () => {
    const node = websiteNode("de");
    expect(node["@type"]).toBe("WebSite");
    expect(node["@id"]).toBe(WEBSITE_ID);
    expect(node.inLanguage).toBe("de");
    expect(node.publisher).toEqual({ "@id": ORGANIZATION_ID });
  });

  it("carries the page language into inLanguage", () => {
    expect(websiteNode("en").inLanguage).toBe("en");
  });
});
