/**
 * The footer's copyright line — SRC-0014 §Site footer, DEC-0158 §3.
 *
 * The holder is the legal name the imprint states, read from
 * `content/legal/imprint.md` through the same parse the `Organization`
 * structured data uses (TS-WEB-0011 D4: identity data is never written into
 * code). The year is the year the page was rendered.
 *
 * Read here rather than in the footer because the footer renders inside the
 * client chrome, which has no filesystem; the layout resolves it once and
 * hands it through. `"use cache"` because `cacheComponents` refuses a bare
 * `new Date()` in a prerender, and both facts change at most with a deploy.
 */

import { cacheLife } from "next/cache";

import { organizationIdentity } from "@/src/lib/seo/structured-data/organization-data";

export interface Copyright {
  readonly year: number;
  readonly holder: string;
}

export async function footerCopyright(): Promise<Copyright> {
  "use cache";
  cacheLife("max");

  const { legalName } = await organizationIdentity();
  return { year: new Date().getFullYear(), holder: legalName };
}
