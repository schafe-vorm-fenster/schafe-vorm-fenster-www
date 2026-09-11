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
 * TS-011-A4 — "the structured-data type of each page type is the one D4's
 * table names", checked **per page against the builders' own output**: the
 * test never restates a node's fields, it compares the graph the page emits
 * with what the builder returns for the same input. A builder change that is
 * wrong is caught by that builder's own test; a *wiring* change that puts a
 * node on the wrong page is caught here.
 */

/** D4's table, as the expectation. `@type` values, in emission order. */
const EXPECTED_TYPES: Readonly<Record<RouteId, readonly string[]>> = {
  home: ["WebPage", "WebSite", "Organization"],
  place: ["WebPage"],
  placeStart: ["WebPage", "BreadcrumbList"],
  takePart: ["WebPage"],
  register: ["WebPage", "BreadcrumbList"],
  calendar: ["WebPage", "Service"],
  order: ["WebPage", "BreadcrumbList"],
  region: ["WebPage", "Service"],
  regionQuote: ["WebPage", "BreadcrumbList"],
  about: ["WebPage", "Organization"],
  archive: ["WebPage", "BreadcrumbList"],
  legal: ["WebPage"],
};

function typesOf(graph: { readonly "@graph": readonly unknown[] }): string[] {
  return graph["@graph"].map((node) => (node as { "@type": string })["@type"]);
}

describe("TS-011-A4: every page emits exactly the nodes D4's table names", () => {
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

  it("emits the one full Organization and the WebSite on `/` only", async () => {
    for (const locale of LOCALES) {
      const home = await pageGraph({ route: "home", locale });
      expect(home["@graph"][1]).toEqual(websiteNode(locale));
      expect(home["@graph"][2]).toEqual(await organizationNode());
    }
    const full = await organizationNode();
    for (const route of ROUTE_IDS) {
      if (route === "home") continue;
      const graph = await pageGraph({ route, locale: "de" });
      expect(graph["@graph"], `${route} emits a second full Organization`).not.toContainEqual(
        full,
      );
      expect(typesOf(graph), `${route} emits a second WebSite`).not.toContain("WebSite");
    }
  });

  it("references the Organization on `/ueber-uns` instead of repeating it", async () => {
    const graph = await pageGraph({ route: "about", locale: "de" });
    // D4: a reference by `@id`, not a second full node — so the node carries
    // its type and its id, and nothing else (no name, no address, no contact).
    expect(graph["@graph"][1]).toEqual({
      "@type": "Organization",
      "@id": "https://www.schafe-vorm-fenster.de/#organization",
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

  it("prices the calendar service and never the region one (WEB-F-020)", async () => {
    const calendar = await pageGraph({ route: "calendar", locale: "de" });
    expect(calendar["@graph"][1]).toEqual(
      calendarServiceNode("de", pageTitle("calendar", "de")),
    );
    expect(JSON.stringify(calendar)).toContain("480");

    const region = await pageGraph({ route: "region", locale: "de" });
    expect(region["@graph"][1]).toEqual(regionServiceNode("de", pageTitle("region", "de")));
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
