import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArchiveFilter } from "./archive-filter";

describe("TS-028 D4/D5: without JavaScript the chip row is not displayed, never dead", () => {
  it("renders the archive rows but no filter chip before hydration", () => {
    const html = renderToStaticMarkup(
      <ArchiveFilter types={[{ id: "presse", label: "Presse" }]}>
        <article data-archive-type="presse">Ein Zeitungsartikel</article>
      </ArchiveFilter>,
    );
    expect(html).toContain("Ein Zeitungsartikel");
    expect(html).not.toContain("Presse</button>");
    expect(html).not.toContain('role="group"');
  });
});
