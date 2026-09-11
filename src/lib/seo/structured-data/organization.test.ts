import { afterEach, describe, expect, it } from "vitest";

import {
  organizationIdentity,
  resetOrganizationIdentityCache,
} from "@/src/lib/seo/structured-data/organization-data";
import {
  ORGANIZATION_ID,
  organizationNode,
  organizationReference,
} from "@/src/lib/seo/structured-data/organization";

afterEach(() => {
  resetOrganizationIdentityCache();
});

describe("TS-011 D4: the Organization node", () => {
  it("reads the real content/legal/imprint.md without throwing", async () => {
    const identity = await organizationIdentity();
    expect(identity.legalName).toContain("Schafe vorm Fenster");
    expect(identity.vatId).toMatch(/^DE\d{9}$/);
  });

  it("builds a full node with a PostalAddress and a VAT identifier", async () => {
    const node = await organizationNode();
    expect(node["@type"]).toBe("Organization");
    expect(node["@id"]).toBe(ORGANIZATION_ID);
    expect(node.address["@type"]).toBe("PostalAddress");
    expect(node.address.addressCountry).toBe("DE");
    expect(node.identifier?.propertyID).toBe("VAT");
  });

  it("never emits sameAs — no social profile is confirmed yet", async () => {
    const node = await organizationNode();
    expect(node).not.toHaveProperty("sameAs");
  });

  it("D4 /ueber-uns: a reference is a bare @id, not a second full node", () => {
    expect(organizationReference()).toEqual({ "@id": ORGANIZATION_ID });
  });
});
