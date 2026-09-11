import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LegalSection } from "./legal-section";

describe("TS-029 D1–D6: a registry entry without a document reserves its anchor and stays silent", () => {
  it("renders no heading and no placeholder when the body is absent", () => {
    const html = renderToStaticMarkup(<LegalSection section="terms" title="Nutzungsbedingungen" />);
    expect(html).not.toContain("<h2");
    expect(html).toContain('id="nutzungsbedingungen"');
  });

  it("renders the heading and the imported body when present", () => {
    const html = renderToStaticMarkup(
      <LegalSection body={<p>Inhalt</p>} section="privacy" title="Datenschutz" />,
    );
    expect(html).toMatch(/<h2[^>]*>Datenschutz<\/h2>/);
    expect(html).toContain("Inhalt");
    expect(html).toContain('id="datenschutz"');
  });

  it("keeps a retired section's anchor and renders a one-line pointer instead of its body", () => {
    const html = renderToStaticMarkup(
      <LegalSection
        retired
        section="communityGuidelines"
        successor="terms"
        successorLabel="Zu den Nutzungsbedingungen"
        title="Community-Richtlinien"
      />,
    );
    expect(html).toContain('id="community-richtlinien"');
    expect(html).toContain("Zu den Nutzungsbedingungen");
    expect(html).toContain("#nutzungsbedingungen");
  });

  it("gives the heading a negative tabindex as the in-page-jump focus target", () => {
    const html = renderToStaticMarkup(
      <LegalSection body={<p>—</p>} section="privacy" title="Datenschutz" />,
    );
    expect(html).toMatch(/<h2[^>]*tabindex="-1"/);
  });
});
