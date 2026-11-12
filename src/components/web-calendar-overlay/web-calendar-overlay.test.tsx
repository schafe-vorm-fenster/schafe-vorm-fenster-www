import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { parseBlocks } from "@/src/lib/content/blocks";
import { embedCalendarFrom } from "@/src/lib/content/embed-calendar";
import { loadPage, slot } from "@/src/lib/content/loader";

import { WebCalendarOverlay } from "./web-calendar-overlay";

/**
 * The markup contract of the embed scene's calendar graphic (issue #145,
 * DEC-0193) and of the slot it reads. What it does over time — the 3.5 s
 * advance, the click that stops it, `prefers-reduced-motion` — needs a browser
 * and is measured in `e2e/pages/home-scene-media.spec.ts`. The words below are
 * fixtures, not copy.
 */

const CATEGORY_NAMES = ["Alpha", "Beta", "Gamma", "Delta"];

const SLOT = [
  "**Label A:** addr.example/termine",
  "**Label T:** Termine",
  "**Label F:** Filter",
  "**Label G:** Grafik",
  ...CATEGORY_NAMES.map((name) => `**Label ${name}:** ${name}`),
  ...CATEGORY_NAMES.flatMap((name) =>
    [1, 2, 3].map((n) => `**Termin ${name} ${n}:** 0${n} | Mo | ${name}-Titel ${n} | Ort · 1${n}:00`),
  ),
].join("\n\n");

const copy = embedCalendarFrom(parseBlocks(SLOT), "fixture");

describe("embedCalendarFrom", () => {
  it("reads four categories with three events each, in filter order", () => {
    expect(copy.categories.map((c) => c.id)).toEqual([
      "community-life",
      "education-health",
      "everyday-supply",
      "culture-tourism",
    ]);
    expect(copy.categories.every((c) => c.events.length === 3)).toBe(true);
    expect(copy.categories[0].events[0]).toEqual({
      day: "01",
      weekday: "Mo",
      title: "Alpha-Titel 1",
      meta: "Ort · 11:00",
    });
    expect(copy.categories[3].events[2].title).toBe("Delta-Titel 3");
  });

  it("throws where an event is not four parts", () => {
    expect(() => embedCalendarFrom(parseBlocks(SLOT.replace("01 | Mo | ", "01 | ")), "fixture")).toThrow(/event reads/);
  });

  it("reads the shipped slot in both locales: twelve events, four names", async () => {
    for (const locale of ["de", "en"] as const) {
      const page = await loadPage("home", locale);
      const shipped = embedCalendarFrom(slot(page, "home-5a-scene-embed-calendar-demo").blocks);
      expect(shipped.categories, locale).toHaveLength(4);
      expect(shipped.categories.flatMap((c) => c.events), locale).toHaveLength(12);
    }
  });
});

describe("web-calendar-overlay", () => {
  const html = renderToStaticMarkup(createElement(WebCalendarOverlay, { copy }));

  it("prerenders the first category with its three rows, and only those", () => {
    expect(html).toContain("Alpha-Titel 1");
    expect(html).toContain("Alpha-Titel 3");
    expect(html).not.toContain("Beta-Titel 1");
    expect(html.match(/<li /g)).toHaveLength(3);
  });

  it("is marked as stand-in data and names its parts", () => {
    expect(html).toContain('data-demo="true"');
    expect(html).toContain('aria-label="Grafik"');
    expect(html).toContain('aria-label="Filter"');
    expect(html).toContain('aria-live="polite"');
  });

  it("carries four real buttons with a name, exactly one pressed", () => {
    expect(html.match(/<button[^>]*type="button"/g)).toHaveLength(4);
    expect(html.match(/<button[^>]*aria-label="(Alpha|Beta|Gamma|Delta)"/g)).toHaveLength(4);
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(3);
  });
});
