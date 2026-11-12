/**
 * The `Organization` node — TS-WEB-0011 D4.
 *
 * Emitted as the one full node on every page (FUN-WEB-0213), inside that
 * page's one graph; `organizationReference()` stays for a node that points at
 * it (`provider`, `publisher`) by `@id`.
 */

import { organizationIdentity } from "./organization-data";

import { appIconPath } from "@/src/lib/seo/app-icons";
import { SITE_ORIGIN } from "@/src/lib/routes/routes";

export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;

export interface OrganizationNode {
  readonly "@type": "Organization";
  readonly "@id": string;
  readonly name: string;
  readonly url: string;
  readonly logo: { readonly "@type": "ImageObject"; readonly url: string };
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
    // FUN-WEB-0213, Q-0098: the brand mark as the existing 512 px PNG rendition
    // (`/api/icon/512`); the round rendition follows with issue 199.
    logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}${appIconPath(512)}` },
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
    // (TS-WEB-0011 open points: "which social profiles exist?") — omitted rather
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
