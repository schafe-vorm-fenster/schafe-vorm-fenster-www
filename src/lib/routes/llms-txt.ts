/**
 * `/llms.txt` — TS-004 D1's third machine surface, "per domain"
 * (WEB-F-079, TS-004-A5), missing until F-2-55.
 *
 * The body is the D1 inventory written for a machine reader, in the
 * llmstxt.org shape: an `# H1` naming the site, a `>` summary line, then one
 * section per language listing that language's pages as markdown links. It is
 * therefore derived, not authored — a route that exists is listed and a route
 * that does not cannot be, which is the same property the sitemap has.
 *
 * Per domain, in two senses (D1):
 *
 *  - the **origin** is the requesting domain, so `.at` does not advertise
 *    `.de` URLs;
 *  - a **landing-only** domain lists only what it serves — `/`, the legal
 *    route and the machine surfaces — because every other path 404s there.
 *
 * No copy is authored here: the page titles are the dictionary's, the same
 * source `<title>` uses, so this surface cannot make a claim a page does not.
 * TS-011-A11 holds by construction — nothing outside the route table and the
 * dictionary reaches the output.
 *
 * Kept beside the inventory rather than inside `app/llms.txt/route.ts` for
 * the reason `robots.ts` gives: the route is the wiring, this is the
 * decision, and a pure function is what a test can hold still.
 */

import { dictionary } from "../i18n/dictionary";
import { LOCALES } from "../i18n/locales";
import { domainConfigFor } from "./host-matrix";
import { href, ROUTE_IDS } from "./routes";
import { D1_NON_PAGE_ROWS } from "./url-inventory";

import type { Locale } from "../i18n/locales";
import type { DomainConfig } from "./host-matrix";

/** The language heading of each section, in that language. */
const SECTION_HEADING: Readonly<Record<Locale, string>> = {
  de: "Seiten",
  en: "Pages",
};

const SUMMARY: Readonly<Record<Locale, string>> = {
  de: "Regionale Veranstaltungskalender für Dörfer und Kleinstädte: Was in deiner Gemeinde los ist, wer es veröffentlicht und wie du mitmachst.",
  en: "Regional event calendars for villages and small towns: what is on in your municipality, who publishes it, and how to take part.",
};

/** Which routes a domain lists — D1's landing-only rule. */
function listedRoutes(domain: DomainConfig): readonly (typeof ROUTE_IDS)[number][] {
  if (domain.kind === "full-site") return ROUTE_IDS;
  return ROUTE_IDS.filter((route) => route === "home" || route === "legal");
}

/**
 * The `llms.txt` body for one request host. `origin` is the absolute base
 * every link is written against — the requesting domain, never a constant.
 */
export function llmsTxtFor(host: string | null | undefined): string {
  const domain = domainConfigFor(host);
  const origin = `https://${domain.host}`;
  const routes = listedRoutes(domain);
  const primary: Locale = domain.tldDefault === "en" ? "en" : "de";

  const lines: string[] = [
    `# ${dictionary(primary).siteName}`,
    "",
    `> ${SUMMARY[primary]}`,
    "",
  ];

  for (const locale of LOCALES) {
    lines.push(`## ${SECTION_HEADING[locale]} (${locale})`, "");
    for (const route of routes) {
      const path = href(route, locale);
      lines.push(`- [${dictionary(locale).pages[route]}](${origin}${path})`);
    }
    lines.push("");
  }

  lines.push("## Machine surfaces", "");
  for (const row of D1_NON_PAGE_ROWS) {
    if (row.kind !== "machine") continue;
    lines.push(`- ${origin}${row.path}`);
  }
  lines.push("");

  return lines.join("\n");
}
