import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProofCard } from "@/src/components/proof-card/proof-card";
import { partnerLogo } from "@/src/lib/content/partner-logos";

/**
 * DEC-0183 — a voice's logo takes the initials well's place in the proof
 * stream. The lookup is by the name a card shows, in either language, and a
 * name nothing matches keeps the well.
 */
describe("partnerLogo", () => {
  it("finds a partner by its name, ignoring case and spacing", () => {
    const logo = partnerLogo("  stiftung   Lebendiges LEHRE ");
    expect(logo?.src).toMatch(/stiftung-lebendiges-lehre\.logo/);
    expect(logo?.height).toBe(40);
    // A wide wordmark keeps its own ratio: never squared, never cropped.
    expect(logo?.width).toBeGreaterThan(40);
  });

  it("finds a partner by an alias — the name an English card cites it by", () => {
    expect(partnerLogo("Adult education centres in Vorpommern-Greifswald")).toEqual(
      partnerLogo("Volkshochschulen in Vorpommern-Greifswald"),
    );
  });

  it("has a logo for each of the four voices of the home stream", () => {
    for (const name of [
      "Stiftung Lebendiges Lehre",
      "NØRD digital convention",
      "Volkshochschulen in Vorpommern-Greifswald",
      "Kulturlandbüro Uecker-Randow",
    ]) {
      expect(partnerLogo(name), name).toBeDefined();
    }
  });

  it("answers undefined for a name no partner carries", () => {
    expect(partnerLogo("Beleg aus der Region")).toBeUndefined();
  });
});

describe("proof-card byline", () => {
  const card = (logo?: ReturnType<typeof partnerLogo>) =>
    renderToStaticMarkup(
      <ProofCard
        attribution="Schloss Bröllin"
        claim="A claim."
        contextLine="Kulturlandbüro Uecker-Randow"
        emphasis="compact"
        logo={logo}
      />,
    );

  it("shows the logo in the well's place, decorative, with the name still as text", () => {
    const html = card(partnerLogo("Kulturlandbüro Uecker-Randow"));
    expect(html).toMatch(/aria-hidden="true"[^>]*data-logo/);
    expect(html).toContain('alt=""');
    expect(html).not.toContain("data-initials");
    expect(html).toContain("Kulturlandbüro Uecker-Randow");
  });

  it("keeps the initials well without a logo", () => {
    const html = card();
    expect(html).toContain("data-initials");
    expect(html).not.toContain("data-logo");
  });
});
