import { describe, expect, it } from "vitest";

import { pageGraph } from "@/app/[lang]/_structured-data";
import { LOCALES } from "@/src/lib/i18n/locales";
import { pageDescription, pageTitle } from "@/src/lib/routes/metadata";
import {
  breadcrumbListNode,
  calendarServiceNode,
  organizationNode,
  regionServiceNode,
  webPageNode,
  websiteNode,
} from "@/src/lib/seo/structured-data";
import { ROUTE_IDS } from "@/src/lib/routes/routes";

import type { RouteId } from "@/src/lib/routes/routes";

/**
 * TS-WEB-0011-A4 — "the structured-data type of each page type is the one D4's
 * table names", checked **per page against the builders' own output**: the
 * test never restates a node's fields, it compares the graph the page emits
 * with what the builder returns for the same input. A builder change that is
 * wrong is caught by that builder's own test; a *wiring* change that puts a
 * node on the wrong page is caught here.
 */

/** D4's table, as the expectation. `@type` values, in emission order. */
const EXPECTED_TYPES: Readonly<Record<RouteId, readonly string[]>> = {
  home: ["WebPage", "WebSite", "Organization"],
  place: ["WebPage", "Organization"],
  placeStart: ["WebPage", "Organization", "BreadcrumbList"],
  takePart: ["WebPage", "Organization"],
  register: ["WebPage", "Organization", "BreadcrumbList"],
  calendar: ["WebPage", "Organization", "Service"],
  order: ["WebPage", "Organization", "BreadcrumbList"],
  region: ["WebPage", "Organization", "Service"],
  regionQuote: ["WebPage", "Organization", "BreadcrumbList"],
  about: ["WebPage", "Organization"],
  archive: ["WebPage", "Organization", "BreadcrumbList"],
  legal: ["WebPage", "Organization"],
};

function typesOf(graph: { readonly "@graph": readonly unknown[] }): string[] {
  return graph["@graph"].map((node) => (node as { "@type": string })["@type"]);
}

describe("TS-WEB-0011-A4: every page emits exactly the nodes D4's table names", () => {
  for (const route of ROUTE_IDS) {
    for (const locale of LOCALES) {
      it(`${route} (${locale})`, async () => {
        const graph = await pageGraph({ route, locale });
        expect(typesOf(graph)).toEqual([...EXPECTED_TYPES[route]]);
        expect(graph["@context"]).toBe("https://schema.org");
      });
    }
  }

  it("emits the `WebPage` the builder builds, on every page", async () => {
    for (const route of ROUTE_IDS) {
      for (const locale of LOCALES) {
        const graph = await pageGraph({ route, locale });
        expect(graph["@graph"][0]).toEqual(
          webPageNode({
            route,
            locale,
            title: pageTitle(route, locale),
            description: pageDescription(route, locale),
          }),
        );
      }
    }
  });

  it("emits the one full Organization on every page and the WebSite on `/` only", async () => {
    for (const locale of LOCALES) {
      const home = await pageGraph({ route: "home", locale });
      expect(home["@graph"][1]).toEqual(websiteNode(locale));
      expect(home["@graph"][2]).toEqual(await organizationNode());
    }
    const full = await organizationNode();
    for (const route of ROUTE_IDS) {
      const graph = await pageGraph({ route, locale: "de" });
      expect(
        graph["@graph"].filter((node) => (node as { "@type": string })["@type"] === "Organization"),
        `${route} emits exactly one Organization`,
      ).toEqual([full]);
      if (route !== "home") {
        expect(typesOf(graph), `${route} emits a second WebSite`).not.toContain("WebSite");
      }
    }
  });

  it("gives the Organization name, URL and logo (FUN-WEB-0213)", async () => {
    const node = await organizationNode();
    expect(node.name).toBeTruthy();
    expect(node.url).toBe("https://www.schafe-vorm-fenster.de");
    expect(node.logo).toEqual({
      "@type": "ImageObject",
      url: "https://www.schafe-vorm-fenster.de/api/icon/512",
    });
  });

  it("carries the BreadcrumbList on all five second-level pages and nowhere else", async () => {
    const second: RouteId[] = ["placeStart", "register", "order", "regionQuote", "archive"];
    for (const route of ROUTE_IDS) {
      const graph = await pageGraph({ route, locale: "de" });
      const expected = breadcrumbListNode(route, "de", (item) => pageTitle(item, "de"));
      if (second.includes(route)) {
        expect(graph["@graph"]).toContainEqual(expected);
      } else {
        expect(expected).toBeUndefined();
        expect(typesOf(graph)).not.toContain("BreadcrumbList");
      }
    }
  });

  it("prices the calendar service and never the region one (BUS-WEB-0015, FUN-WEB-0202)", async () => {
    const calendar = await pageGraph({ route: "calendar", locale: "de" });
    expect(calendar["@graph"][2]).toEqual(
      calendarServiceNode("de", pageTitle("calendar", "de")),
    );
    expect(JSON.stringify(calendar)).toContain("480");

    const region = await pageGraph({ route: "region", locale: "de" });
    expect(region["@graph"][2]).toEqual(regionServiceNode("de", pageTitle("region", "de")));
    expect(JSON.stringify(region)).not.toContain("priceSpecification");
  });

  it("emits a FAQPage only where the page has a visible Q&A block", async () => {
    const without = await pageGraph({ route: "takePart", locale: "de" });
    expect(typesOf(without)).not.toContain("FAQPage");

    const with_ = await pageGraph({
      route: "takePart",
      locale: "de",
      faq: [{ question: "Was kostet das?", answer: "Für Akteure nichts." }],
    });
    expect(typesOf(with_)).toContain("FAQPage");
  });
});
