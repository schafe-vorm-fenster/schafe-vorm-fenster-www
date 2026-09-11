import { describe, expect, it } from "vitest";

import { parseOrganizationIdentity } from "@/src/lib/seo/structured-data/organization-data";

const FIXTURE = `---
id: legal-imprint
---

# Impressum

## Angaben gemäß § 5 DDG

Schafe vorm Fenster UG (haftungsbeschränkt)
Schlatkow 6
17390 Schmatzin OT Schlatkow

Vertreten durch:
Geschäftsführer: Jan-Henrik Hempel

Kontakt:
Telefon: +49 156 78204630
E-Mail: [jan@schafe-vorm-fenster.de](mailto:jan@schafe-vorm-fenster.de)

Registereintrag: Eintragung im Handelsregister.
Registergericht: Amtsgericht Stralsund
Registernummer: HRB 22906 Umsatzsteuer-Identifikationsnummer gemäß § 27 a
Umsatzsteuergesetz: DE323153438
`;

describe("TS-011 D4: Organization identity is read from content/legal/imprint.md", () => {
  it("extracts every field the Organization node needs", () => {
    const identity = parseOrganizationIdentity(FIXTURE);
    expect(identity).toEqual({
      legalName: "Schafe vorm Fenster UG (haftungsbeschränkt)",
      streetAddress: "Schlatkow 6",
      postalCode: "17390",
      addressLocality: "Schmatzin OT Schlatkow",
      email: "jan@schafe-vorm-fenster.de",
      telephone: "+49 156 78204630",
      registerCourt: "Amtsgericht Stralsund",
      registerNumber: "HRB 22906",
      vatId: "DE323153438",
    });
  });

  it("degrades to empty strings rather than throwing on unexpected input", () => {
    expect(() => parseOrganizationIdentity("nothing here")).not.toThrow();
    const identity = parseOrganizationIdentity("nothing here");
    expect(identity.legalName).toBe("");
    expect(identity.vatId).toBe("");
  });
});
