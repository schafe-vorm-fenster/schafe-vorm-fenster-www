import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ICON_NAMES } from "../icon/icon";

import { EVENT_CATEGORIES, EventRow } from "./event-row";

/**
 * The category's own contract — the polish brief's shared-component pass.
 *
 * The row renders the category in two forms at two widths (bare glyph below
 * `md`, the SRC-014 badge from `md`), which is a CSS fact and belongs to
 * `e2e/event-row.spec.ts`. What belongs here is the part CSS cannot hold:
 * **the markup carries the label in every form**. `categoryDisplay`'s rule is
 * "icon and colour always together; the label is always present", and the
 * failure mode of a compact category display is exactly that someone later
 * drops the text node because it is not drawn on the phone anyway.
 */

function markup(category: (typeof EVENT_CATEGORIES)[number], label: string) {
  return renderToStaticMarkup(
    <EventRow
      category={category}
      categoryLabel={label}
      date="2026-09-22T18:00:00+02:00"
      locale="de"
      meta="Rubkow · 08:00"
      title="Allgemeinarzt Johannes Spank"
    />,
  );
}

describe("event-row: the category is words, never colour alone", () => {
  it("renders the label as text for every one of the six categories", () => {
    for (const category of EVENT_CATEGORIES) {
      const label = `Kategorie ${category}`;
      expect(markup(category, label), category).toContain(label);
    }
  });

  it("renders a glyph beside it, hidden from assistive technology", () => {
    for (const category of EVENT_CATEGORIES) {
      const html = markup(category, "Bildung & Gesundheit");
      const svg = /<svg\b[^>]*>/.exec(html);
      expect(svg, category).not.toBeNull();
      expect(svg?.[0], category).toContain('aria-hidden="true"');
    }
  });

  it("takes every glyph from the one icon set", () => {
    for (const category of EVENT_CATEGORIES) {
      const html = markup(category, "x");
      // `icon` is the only source of an `<svg>` in this row, and its type
      // already restricts the name — this asserts the row did not grow a
      // second path to a glyph (an inline `<svg>`, an `<img>`).
      expect(html.match(/<svg\b/g)?.length ?? 0, category).toBe(1);
      expect(html, category).not.toContain("<img");
    }
    expect(ICON_NAMES.length).toBeGreaterThan(0);
  });

  it("names the tone on the element, so the stylesheet needs no colour prop", () => {
    for (const category of EVENT_CATEGORIES) {
      expect(markup(category, "x"), category).toContain(`data-tone="${category}"`);
    }
  });

  it("keeps the meta its own element, outside the category", () => {
    const html = markup("official", "Bildung und Gesundheit");
    expect(html).toContain("Rubkow · 08:00");
    // The meta must not sit inside the category element: it was the badge's
    // `auto` column that starved it, and nesting would hide a regression.
    expect(/Rubkow · 08:00[^]*Bildung und Gesundheit/.test(html)).toBe(true);
  });
});
