import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArchiveFilter } from "./archive-filter";

const TYPES = [
  { id: "Presse", label: "Presse" },
  { id: "Auszeichnung", label: "Auszeichnung" },
] as const;

function serverHtml() {
  return renderToStaticMarkup(
    <ArchiveFilter types={TYPES}>
      <article data-archive-type="Presse">Ein Zeitungsartikel</article>
    </ArchiveFilter>,
  );
}

describe("TS-028 D4/D5: without JavaScript the chip row is not visible, never dead", () => {
  it("renders the archive rows but no filter control before hydration", () => {
    const html = serverHtml();
    expect(html).toContain("Ein Zeitungsartikel");
    expect(html).not.toContain("Presse</button>");
    expect(html).not.toContain('role="group"');
    // TS-028-A9 reads the group by role, so nothing in the pre-hydration
    // render may answer to it — the reserved row is spans, not buttons.
    expect(html).not.toContain("<button");
  });
});

describe("F-2-69: the chip row occupies its final height before hydration", () => {
  /**
   * The regression this locks down: the chip group used to be absent from the
   * server render, so hydration inserted it and pushed the row list 262 px
   * down — CLS 0.2197 against TS-028-A13 / TS-009-A8 (< 0.1). The seam a unit
   * test can hold is the server markup: the box has to be *there*, carry the
   * same chips, and be hidden by `visibility` rather than removed from flow.
   */
  it("reserves the row with the same chip labels the mounted row will show", () => {
    const html = serverHtml();
    // Every label the hydrated row renders, so the reserved row wraps to the
    // same number of lines at every width rather than to a guessed height.
    expect(html).toContain("Alle");
    for (const type of TYPES) expect(html).toContain(type.label);
  });

  it("hides the reserved row and the reserved count line without collapsing them", () => {
    const html = serverHtml();
    // The CSS-module class names are hashed, so the assertion matches the
    // local name inside the hash. `reserved` is `archive-filter.module.css`'s
    // `visibility: hidden` rule — the one that keeps the box while hiding it.
    // A `hidden` attribute or `display: none` would reintroduce the shift.
    expect(html).toMatch(/class="_chips_\w+ _reserved_\w+"/);
    expect(html).toMatch(/class="_count_\w+ _reserved_\w+"/);
    expect(html).not.toContain("display:none");
    expect(html).not.toMatch(/<(div|p)[^>]*\shidden(=|\s|>)/);
  });

  it("keeps the reserved row out of the accessibility tree", () => {
    expect(serverHtml()).toMatch(/aria-hidden="true" class="_chips_\w+ _reserved_\w+"/);
  });
});

describe("F-2-71: the component publishes a hydration signal", () => {
  /**
   * `chips.count()` is a non-retrying read, and the chip group only appears
   * 279–370 ms after `page.goto` resolves — so the e2e assertion has to wait
   * for something. This attribute is that something: `false` on the server,
   * `true` in the render that swaps the reserved row for the real one.
   */
  it("marks the wrapper unhydrated in the server render", () => {
    const html = serverHtml();
    expect(html).toContain("data-archive-filter");
    expect(html).toContain('data-hydrated="false"');
  });
});
