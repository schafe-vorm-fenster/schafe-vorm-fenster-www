import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ValueStory } from "./value-story";

describe("TS-WEB-0020 D3: the testimonial is absent, not empty, when uncleared", () => {
  it("renders no blockquote at all when no testimonial is given", () => {
    const html = renderToStaticMarkup(
      <ValueStory
        aspect="Termine"
        example={<p>Sommerfest, 12. September</p>}
        exampleLevel="place"
        whyItMatters="Du siehst sofort, was los ist."
      />,
    );
    expect(html).not.toContain("<blockquote");
  });

  it("renders the quote and its attribution as one readable block when cleared", () => {
    const html = renderToStaticMarkup(
      <ValueStory
        aspect="Termine"
        example={<p>Sommerfest, 12. September</p>}
        exampleLevel="place"
        testimonial={{ attribution: "Vereinsvorsitzende", role: "Beispieldorf", text: "Endlich sehen alle unsere Termine." }}
        whyItMatters="Du siehst sofort, was los ist."
      />,
    );
    expect(html).toContain("<blockquote");
    expect(html).toContain("Endlich sehen alle unsere Termine.");
    expect(html).toContain("Vereinsvorsitzende");
  });

  it("TS-WEB-0020-A23: renders no testimonial under a live-module example (DEC-0170, issue #84)", () => {
    const html = renderToStaticMarkup(
      <ValueStory
        aspect="Was in fünfzehn Minuten Entfernung passiert"
        example={<ol><li>Sommerfest, 12. September</li></ol>}
        exampleLevel="surrounding"
        exampleVariant="module"
        testimonial={{ attribution: "Vereinsvorsitzende", text: "Endlich sehen alle unsere Termine." }}
        whyItMatters="Was zwei Dörfer weiter läuft, gehört genauso in deinen Kalender."
      />,
    );
    expect(html).toContain("Sommerfest");
    expect(html).not.toContain("<blockquote");
    expect(html).not.toContain("Endlich sehen alle unsere Termine.");
  });

  it("labels the example with the place or county name from the ladder", () => {
    const html = renderToStaticMarkup(
      <ValueStory
        aspect="Termine"
        example={<p>Marktplatz, Nachbardorf</p>}
        exampleLabel="Nachbardorf"
        exampleLevel="surrounding"
        whyItMatters="Auch in der Nähe ist etwas los."
      />,
    );
    expect(html).toContain("Nachbardorf");
    expect(html).toContain('data-example-level="surrounding"');
  });

  it("carries one heading per story, at the level the page composes it at", () => {
    const html = renderToStaticMarkup(
      <ValueStory
        aspect="Termine"
        example={<p>—</p>}
        exampleLevel="place"
        headingLevel="h3"
        whyItMatters="—"
      />,
    );
    expect(html).toMatch(/<h3[^>]*>Termine<\/h3>/);
  });
});
