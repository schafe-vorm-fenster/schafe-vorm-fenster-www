import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ComparisonTable, type ComparisonPair } from "./comparison-table";

const FOUR: readonly ComparisonPair[] = [
  { icon: "monitor", today: "Ein Terminmodul endet leer.", withProduct: "Eure Ansicht zeigt Termine." },
  { icon: "users", today: "Niemand hält es aktuell.", withProduct: "Die Akteure pflegen selbst." },
  { icon: "smartphone", today: "Ein zweites Login.", withProduct: "Wie sie es schon tun." },
  { icon: "map-pin", today: "Es endet an der Grenze.", withProduct: "Die Grenze zieht ihr." },
];

const THREE: readonly ComparisonPair[] = FOUR.slice(0, 3);

/**
 * The labels the caller passes. Both are required props — the component holds
 * no default, so nothing here is the component's own wording. These two are the
 * owner's (plan/reviews/2026-09-23/decisions.md:18, issue 159).
 */
const TODAY_LABEL = "Heute";
const WITH_CALENDAR_LABEL = "Mit eurem Kalender";

function render(
  rows: readonly ComparisonPair[] = FOUR,
  labels?: { today: string; withProduct: string },
) {
  return renderToStaticMarkup(
    <ComparisonTable
      headingId="vergleich-heading"
      headline="Warum es heute hakt"
      rows={rows}
      todayLabel={labels?.today ?? TODAY_LABEL}
      withProductLabel={labels?.withProduct ?? WITH_CALENDAR_LABEL}
    />,
  );
}

describe("DEC-0203: one module, the count is the caller's", () => {
  it("renders one list item per pair — four for /dein-kalender, three for /mitmachen", () => {
    expect(render(FOUR).match(/<li\b/g)).toHaveLength(4);
    expect(render(THREE).match(/<li\b/g)).toHaveLength(3);
  });

  it("carries its own h2 with the id the section names itself by", () => {
    expect(render()).toMatch(/<h2[^>]*id="vergleich-heading"[^>]*>Warum es heute hakt<\/h2>/);
  });

  it("labels both halves of every pair with the labels the caller passed", () => {
    const html = render();
    expect(html.match(new RegExp(`>${TODAY_LABEL}<`, "g"))).toHaveLength(4);
    expect(html.match(new RegExp(`>${WITH_CALENDAR_LABEL}<`, "g"))).toHaveLength(4);
  });

  it("carries no label of its own — a second caller's wording is the one that renders", () => {
    const html = render(FOUR, { today: "TODAY", withProduct: "WITH YOUR CALENDAR" });
    expect(html.match(/>TODAY</g)).toHaveLength(4);
    expect(html.match(/>WITH YOUR CALENDAR</g)).toHaveLength(4);
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

describe("issue 159: today, then the solution, one block per pair", () => {
  it("marks each half of every pair, today first", () => {
    const html = render();
    expect(html.match(/data-half="today"/g)).toHaveLength(4);
    expect(html.match(/data-half="with"/g)).toHaveLength(4);
    expect(html.indexOf('data-half="today"')).toBeLessThan(html.indexOf('data-half="with"'));
  });

  it("puts the topic glyph with today, and only there; the arrow with the solution", () => {
    const html = render();
    for (const pair of FOUR) {
      expect(html).toContain(`data-pair-icon="${pair.icon}"`);
      expect(html).toContain(`lucide-${pair.icon}`);
    }
    expect(html.match(/data-pair-icon=/g)).toHaveLength(4);
    expect(html.match(/data-pair-arrow=""/g)).toHaveLength(4);
    expect(html.match(/lucide-arrow-right/g)).toHaveLength(4);
  });

  it("hides both circles from assistive technology — the labels carry the meaning", () => {
    const html = render();
    expect(html.match(/<span aria-hidden="true"[^>]*data-pair-icon=/g)).toHaveLength(4);
    expect(html.match(/<span aria-hidden="true"[^>]*data-pair-arrow=""/g)).toHaveLength(4);
  });

  it("keeps the pairing readable aloud: label, a hidden colon, then the sentence", () => {
    expect(render()).toMatch(/>Heute<span[^>]*>: <\/span><\/span>Ein Terminmodul endet leer\./);
  });
});
