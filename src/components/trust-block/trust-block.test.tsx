import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TrustBlock } from "./trust-block";

describe("TS-024 D10: a subject without a hub record does not ship", () => {
  it("renders only the subject that carries a body", () => {
    const html = renderToStaticMarkup(
      <TrustBlock
        headline="Vertrauen"
        subjects={[
          { body: "Deine Daten bleiben in Deutschland.", id: "data-protection", label: "Datenschutz" },
          { id: "operations", label: "Betrieb" },
          { id: "ai", label: "KI" },
        ]}
      />,
    );
    expect(html).toContain("Deine Daten bleiben in Deutschland.");
    expect(html).not.toContain("Betrieb");
    expect(html).not.toContain(">KI<");
  });

  it("always names both legal targets in the link text", () => {
    const html = renderToStaticMarkup(
      <TrustBlock
        headline="Vertrauen"
        subjects={[{ body: "—", id: "data-protection", label: "Datenschutz" }]}
      />,
    );
    expect(html).toContain("Datenschutzerklärung");
    expect(html).toContain("Auftragsverarbeitung");
    expect(html).toContain("#datenschutz");
    expect(html).toContain("#auftragsverarbeitung");
  });
});
