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

describe("TS-024 D4: exactly four rows, machine-countable, no checkmark column", () => {
  it("renders exactly four list items", () => {
    const html = renderToStaticMarkup(<ComparisonTable rows={ROWS} />);
    const items = html.match(/<li\b/g) ?? [];
    expect(items).toHaveLength(4);
  });

  it("labels both cells of every row with their column", () => {
    const html = renderToStaticMarkup(<ComparisonTable rows={ROWS} />);
    expect(html.match(/Heute:/g)).toHaveLength(4);
    expect(html.match(/Mit Portalize:/g)).toHaveLength(4);
  });

  it("draws no checkmark or cross glyph", () => {
    const html = renderToStaticMarkup(<ComparisonTable rows={ROWS} />);
    expect(html).not.toContain("circle-check");
    expect(html).not.toContain("circle-x");
  });
});
