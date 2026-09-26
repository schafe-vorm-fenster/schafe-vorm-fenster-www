import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ComparisonTable } from "./comparison-table";

import type { FourComparisonRows } from "../content-fragments";

const ROWS: FourComparisonRows = [
  { today: "Sechs Kanäle, halbes Dorf hört nichts", withProduct: "Ein Kalender, alle sehen es" },
  { today: "Termine per Zuruf", withProduct: "Termine per Klick" },
  { today: "Kein Überblick", withProduct: "Voller Überblick" },
  { today: "Papierzettel am Brett", withProduct: "Digital und dauerhaft" },
];

/**
 * The labels the caller passes. Both are required props — the component holds
 * no default, so nothing here is the component's own wording. These two are the
 * owner's (plan/reviews/2026-09-23/decisions.md:18, "Heute" vs "Mit eurem
 * Kalender").
 */
const TODAY_LABEL = "Heute";
const WITH_CALENDAR_LABEL = "Mit eurem Kalender";

function render(labels?: { today: string; withProduct: string }) {
  return renderToStaticMarkup(
    <ComparisonTable
      rows={ROWS}
      todayLabel={labels?.today ?? TODAY_LABEL}
      withProductLabel={labels?.withProduct ?? WITH_CALENDAR_LABEL}
    />,
  );
}

describe("TS-WEB-0024 D4: exactly four rows, machine-countable, no checkmark column", () => {
  it("renders exactly four list items", () => {
    const items = render().match(/<li\b/g) ?? [];
    expect(items).toHaveLength(4);
  });

  it("labels both cells of every row with the labels the caller passed", () => {
    const html = render();
    expect(html.match(new RegExp(`${TODAY_LABEL}:`, "g"))).toHaveLength(4);
    expect(html.match(new RegExp(`${WITH_CALENDAR_LABEL}:`, "g"))).toHaveLength(4);
  });

  it("carries no label of its own — a second caller's wording is the one that renders", () => {
    const html = render({ today: "HEUTE", withProduct: "MIT EUREM KALENDER" });
    expect(html.match(/HEUTE:/g)).toHaveLength(4);
    expect(html.match(/MIT EUREM KALENDER:/g)).toHaveLength(4);
    // TS-WEB-0024 D4 / SRC-0017 CG-039: no fallback label leaks a product name.
    expect(html).not.toContain("Portalize");
    expect(html).not.toContain("Produkt");
  });

  it("draws no checkmark or cross glyph", () => {
    const html = render();
    expect(html).not.toContain("circle-check");
    expect(html).not.toContain("circle-x");
  });
});
