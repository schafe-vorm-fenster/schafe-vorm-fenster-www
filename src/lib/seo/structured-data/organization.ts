/**
 * The `Organization` node — TS-011 D4.
 *
 * Emitted as a full node only on `/` (inside the `WebSite`+`Organization`
 * graph); every other page that needs it references it **by `@id`**
 * (`organizationReference()`), per D4's one-entity rule: "second full node"
 * is exactly what `/ueber-uns` must not emit.
 */

import { organizationIdentity } from "./organization-data";

import { SITE_ORIGIN } from "@/src/lib/routes/routes";

export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;

export interface OrganizationNode {
  readonly "@type": "Organization";
  readonly "@id": string;
  readonly name: string;
  readonly url: string;
  readonly email?: string;
  readonly telephone?: string;
  readonly address: {
    readonly "@type": "PostalAddress";
    readonly streetAddress: string;
    readonly postalCode: string;
    readonly addressLocality: string;
    readonly addressCountry: "DE";
  };
  readonly identifier?: {
    readonly "@type": "PropertyValue";
    readonly propertyID: "VAT";
    readonly value: string;
  };
}

export async function organizationNode(): Promise<OrganizationNode> {
  const identity = await organizationIdentity();
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: identity.legalName,
    url: SITE_ORIGIN,
    ...(identity.email ? { email: identity.email } : {}),
    ...(identity.telephone ? { telephone: identity.telephone } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: identity.streetAddress,
      postalCode: identity.postalCode,
      addressLocality: identity.addressLocality,
      addressCountry: "DE",
    },
    // D4: "`sameAs` lists only profiles that exist." None are confirmed yet
    // (TS-011 open points: "which social profiles exist?") — omitted rather
    // than guessed.
    ...(identity.vatId
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "VAT",
            value: identity.vatId,
          },
        }
      : {}),
  };
}

/** D4 `/ueber-uns`: reference by `@id`, never a second full node. */
export function organizationReference(): { readonly "@id": string } {
  return { "@id": ORGANIZATION_ID };
}
