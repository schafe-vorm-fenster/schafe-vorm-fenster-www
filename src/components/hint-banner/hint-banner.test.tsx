import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HintBanner } from "./hint-banner";

import { standardSources } from "@/src/lib/pricing/standard-sources";

// DEC-0107's own title — the owner's sentence, not one written here.
const BOUNDARY =
  "A standard source publishes free; an individual integration into a system we do not already support is the paid add-on";

describe("TS-WEB-0022-A17: the hint banner's shape", () => {
  const html = renderToStaticMarkup(
    <HintBanner locale="en" sources={standardSources()}>
      <p>{BOUNDARY}</p>
    </HintBanner>,
  );

  it("is one block that a page can count", () => {
    expect(html.split('data-hint-banner="true"')).toHaveLength(2);
    expect(html).toContain('role="note"');
  });

  it("carries no data-cta of any rung and no control", () => {
    expect(html).not.toContain("data-cta");
    expect(html).not.toContain("<a ");
    expect(html).not.toContain("<button");
  });

  it("names every standard source the package lists, in the page's language", () => {
    for (const source of standardSources()) {
      expect(html).toContain(`data-standard-source="${source.id}"`);
      expect(html).toContain(source.label.en);
    }
  });

  it("renders no figure, currency or range of its own", () => {
    const text = html.replace(/<[^>]+>/g, " ");
    expect(text).not.toMatch(/\d/);
    expect(text).not.toContain("€");
    expect(text).not.toMatch(/\bab\b/);
  });

  it("names no cooperation as a free-path example (D11)", () => {
    for (const name of ["kirche-mv", "VEVG", "Karlsburg", "Volkshochschule"]) {
      expect(html).not.toContain(name);
    }
  });

  it("reads the German labels when the page is German", () => {
    const de = renderToStaticMarkup(<HintBanner sources={standardSources()}>{BOUNDARY}</HintBanner>);
    for (const source of standardSources()) expect(de).toContain(source.label.de);
  });
});
