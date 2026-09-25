import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { QuoteCard } from "./quote-card";

const QUOTE = {
  name: "Beispiel Person",
  organisation: "Beispielverein",
  quote: "Endlich sehen alle unsere Termine.",
  role: "Vorsitzende",
  sourceLabel: "Beispielblatt: Der Dorfkalender kommt an",
  sourceUrl: "https://example.org/artikel",
};

describe("SRC-0014 §Quote card / CG-028: the quote verbatim, the author with role and organisation, the concrete article as a link", () => {
  const html = renderToStaticMarkup(<QuoteCard {...QUOTE} />);

  it("is one figure: blockquote first, then the caption with name, role and organisation", () => {
    expect(html).toContain("<figure");
    expect(html).toContain("<blockquote");
    expect(html).toContain("<figcaption");
    expect(html.indexOf("</blockquote>")).toBeLessThan(html.indexOf("<figcaption"));
    expect(html).toContain(QUOTE.quote);
    expect(html.indexOf(QUOTE.name)).toBeLessThan(html.indexOf(QUOTE.role));
    expect(html).toContain(`${QUOTE.role}, ${QUOTE.organisation}`);
  });

  it("renders the quote verbatim — no added quotation marks, no italics", () => {
    expect(html).not.toContain("„");
    expect(html).not.toContain("<em");
    expect(html).not.toContain("<i>");
  });

  it("links the concrete article as an outbound link with the external-link glyph, last", () => {
    expect(html).toContain(`href="${QUOTE.sourceUrl}"`);
    expect(html).toContain(QUOTE.sourceLabel);
    expect(html).toContain("lucide-external-link");
    expect(html).toContain('width="18"');
    expect(html.indexOf(QUOTE.organisation)).toBeLessThan(html.indexOf(`href="${QUOTE.sourceUrl}"`));
  });

  it("opens the article in the same tab unless asked, and then says so in the link's own text", () => {
    expect(html).not.toContain('target="_blank"');
    const newTab = renderToStaticMarkup(<QuoteCard {...QUOTE} locale="en" newTab />);
    expect(newTab).toContain('target="_blank"');
    expect(newTab).toContain('rel="noopener"');
    expect(newTab).toContain("opens new tab");
  });
});
