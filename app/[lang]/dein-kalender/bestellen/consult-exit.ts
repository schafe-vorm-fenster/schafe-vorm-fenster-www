import { CONTACT_SECTION_ID } from "@/src/components/contact-section/contact-section";
import { linkHref } from "@/src/components/route-link/href";

import type { OrderStep } from "./steps";
import type { Locale } from "@/src/lib/i18n/locales";

/**
 * TS-WEB-0025 D5/D8 and DEC-0133 §2 — the order flow's one in-page consult
 * target, built in one place.
 *
 * The flow's exit and the degraded lead fallback on step 3 both point at this
 * route's own contact section, and both have to carry the flow's **scope and
 * step** in the query: the section stands on the same document, so a link that
 * dropped them would leave the visitor on a different screen of the flow she
 * is in (D8, "the scope is in the URL").
 *
 * It lives beside the page rather than inside it because the page is an async
 * server component: a pure builder is the part a test can hold, and the review
 * round found the page's half of A14 of TS-WEB-0016 / A14 of TS-WEB-0025
 * asserted nowhere while the component's half was.
 */
export interface ConsultExitScope {
  /** `orte` exactly as it stands in the URL — comma-separated slugs, or absent. */
  readonly orte: string | undefined;
  /** The county id where the flow carries one, otherwise `undefined`. */
  readonly kreis: string | undefined;
  readonly step: OrderStep;
}

/** The query the exit carries. Empty and `undefined` values drop out in `linkHref`. */
export function consultExitQuery({
  orte,
  kreis,
  step,
}: ConsultExitScope): Readonly<Record<string, string | number | undefined>> {
  return { orte, kreis, schritt: step };
}

/** `<order route>?<scope>&schritt=<n>#kontakt`, through the route facade. */
export function consultExitHref(locale: Locale, scope: ConsultExitScope): string {
  return linkHref("order", {
    locale,
    query: consultExitQuery(scope),
    hash: CONTACT_SECTION_ID,
  });
}
