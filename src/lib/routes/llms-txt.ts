/**
 * `/llms.txt` — TS-WEB-0004 D1's third machine surface, "per domain"
 * (FUN-WEB-0169, FUN-WEB-0170, TS-WEB-0004-A5, TS-WEB-0004-A13).
 *
 * The body follows llmstxt.org:
 *
 *  1. `# Schafe vorm Fenster` — the dictionary's site name;
 *  2. one `>` summary line;
 *  3. the core facts as a list, before any heading (`llms-facts.ts`);
 *  4. `## Seiten` — every page of the primary language as
 *     `- [title](url): description`;
 *  5. `## Pages in English` — the same for the second language, on a domain
 *     that serves it as a full site;
 *  6. `## Optional` — press, legal, help and the other machine surfaces, the
 *     section the format lets a reader skip when its context is short.
 *
 * **Derived, not authored.** The title and the description of a page line are
 * the page's own `<title>` and meta description (`pageTitle`,
 * `pageDescription`, the page's `seo` frontmatter, TS-WEB-0011 D5), so this
 * surface cannot describe a page differently from the page. The facts read
 * the modules the pages read (`llms-facts.ts`). A route that exists is listed
 * and a route that does not cannot be, the property the sitemap has.
 *
 * Per domain, in two senses (D1):
 *
 *  - the **origin** is the requesting domain, so `.at` does not advertise
 *    `.de` URLs;
 *  - a **landing-only** domain lists only what it serves — `/`, the legal
 *    route and the machine surfaces — in one page section, and no help link,
 *    because that one lives on the `.de` apex. It keeps the summary but has
 *    no facts block (owner decision 2026-11-12: the side domains do not go
 *    online for now and are considered separately later).
 *
 * Kept beside the inventory rather than inside the route for the reason
 * `robots.ts` gives: the route is the wiring, this is the decision, and a
 * pure function is what a test can hold still.
 */

import { dictionary } from "../i18n/dictionary";
import { LOCALES } from "../i18n/locales";
import { domainConfigFor } from "./host-matrix";
import { llmsFacts, llmsSummary } from "./llms-facts";
import { pageDescription, pageTitle } from "./metadata";
import { COMMUNITY_HELP_URL } from "./redirect-map";
import { href, ROUTE_IDS } from "./routes";
import { D1_NON_REGISTRY_ROWS } from "./url-inventory";

import type { Locale } from "../i18n/locales";
import type { DomainConfig } from "./host-matrix";
import type { RouteId } from "./routes";

/** The page section of the primary language, and of the second one. */
const PAGES_HEADING: Readonly<Record<Locale, { primary: string; secondary: string }>> = {
  de: { primary: "Seiten", secondary: "Seiten auf Deutsch" },
  en: { primary: "Pages", secondary: "Pages in English" },
};

/** Routes a reader with a short context may skip (llmstxt.org "Optional"). */
const OPTIONAL_ROUTES: readonly RouteId[] = ["archive", "legal"];

/**
 * community-site's help, which has no meta description of its own here.
 * Scope: the article set `LEGACY_HELP_SLUGS` redirects to (publishing dates,
 * recurring dates, sharing, embedding). The articles are German.
 */
const HELP_LINK: Readonly<Record<Locale, { title: string; description: string }>> = {
  de: {
    title: "Hilfe zum Dorfkalender",
    description:
      "Anleitungen: Termine und Terminreihen veröffentlichen, den Kalender teilen, ihn auf einer Website einbinden.",
  },
  en: {
    title: "Help with the village calendar (German)",
    description:
      "How-to articles in German: publishing dates and recurring dates, sharing the calendar, embedding it on a website.",
  },
};

/** The two other machine surfaces; `/llms.txt` does not list itself. */
const MACHINE_DESCRIPTION: Readonly<Record<Locale, Readonly<Record<string, string>>>> = {
  de: {
    "/sitemap.xml": "alle Seiten dieser Domain mit ihren Sprachfassungen",
    "/robots.txt": "Regeln für Crawler auf dieser Domain",
  },
  en: {
    "/sitemap.xml": "every page of this domain with its language versions",
    "/robots.txt": "crawler rules for this domain",
  },
};

/** Which routes a domain lists — D1's landing-only rule. */
function listedRoutes(domain: DomainConfig): readonly RouteId[] {
  if (domain.kind === "full-site") return ROUTE_IDS;
  return ROUTE_IDS.filter((route) => route === "home" || route === "legal");
}

/** `- [title](url): description`, the description left off where a page has none. */
function pageLine(route: RouteId, locale: Locale, origin: string): string {
  const description = pageDescription(route, locale);
  const link = `- [${pageTitle(route, locale)}](${origin}${href(route, locale)})`;
  return description ? `${link}: ${description}` : link;
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
  const languages: readonly Locale[] = [primary, ...LOCALES.filter((locale) => locale !== primary)];
  const isFullSite = domain.kind === "full-site";

  const lines: string[] = [`# ${dictionary(primary).siteName}`, "", `> ${llmsSummary(primary)}`, ""];
  // The side domains carry no facts block (owner, 2026-11-12): they stay as lean as before the facts block.
  if (isFullSite) {
    for (const fact of llmsFacts(primary)) lines.push(`- ${fact}`);
    lines.push("");
  }

  const mainRoutes = routes.filter((route) => !OPTIONAL_ROUTES.includes(route));
  if (isFullSite) {
    for (const [index, locale] of languages.entries()) {
      const heading = PAGES_HEADING[locale][index === 0 ? "primary" : "secondary"];
      lines.push(`## ${heading}`, "");
      for (const route of mainRoutes) lines.push(pageLine(route, locale, origin));
      lines.push("");
    }
  } else {
    // One section: a landing domain serves two lines per language, not two sites.
    lines.push(`## ${PAGES_HEADING[primary].primary}`, "");
    for (const locale of languages) {
      for (const route of mainRoutes) lines.push(pageLine(route, locale, origin));
    }
    lines.push("");
  }

  lines.push("## Optional", "");
  for (const [index, locale] of languages.entries()) {
    for (const route of routes.filter((candidate) => OPTIONAL_ROUTES.includes(candidate))) {
      lines.push(pageLine(route, locale, origin));
    }
    if (isFullSite && index === 0) {
      const help = HELP_LINK[locale];
      lines.push(`- [${help.title}](${COMMUNITY_HELP_URL}): ${help.description}`);
    }
  }
  for (const row of D1_NON_REGISTRY_ROWS) {
    const description = MACHINE_DESCRIPTION[primary][row.path];
    if (row.kind !== "machine" || description === undefined) continue;
    lines.push(`- [${row.path.slice(1)}](${origin}${row.path}): ${description}`);
  }
  lines.push("");

  return lines.join("\n");
}
