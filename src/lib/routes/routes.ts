/**
 * The route translation map — TS-004 D3a, the **single source** for every
 * path on this website.
 *
 * TS-004 D3a fixes the contract: `routeId → { de: path, en: path, … }`, and
 * three consumers know a path — nobody else.
 *
 *   1. the URL mapping (`next.config.ts`, built from `next-routing.ts`)
 *      translates inbound public paths to internal routes;
 *   2. the link facade (`href()`, TS-001 D5) renders outbound links in the
 *      current language — components never type a path;
 *   3. canonical and hreflang (TS-001 D6) derive from the same table, which
 *      is *how* the language variants know they belong together.
 *
 * The candidate `next-intl` of D3a was not taken: no sibling repository in
 * the family uses it (the only i18n in the family is Paraglide, in an Astro
 * app), the contract above is fifty lines of typed data, and the
 * stack-harmony rule prefers not adding a dependency to a problem the
 * platform already solves. See ADR-073.
 *
 * ### The internal path
 *
 * The App Router tree (TS-004 D2) is `app/[lang]/…` and its directory names
 * are the **German** segments. So the internal path of a route is
 * `/{lang}{path.de}` for every language, and the public path is what the
 * table says. `/en/your-place` is served by `app/[lang]/dein-ort`.
 */

import { DEFAULT_LOCALE, LOCALES } from "../i18n/locales";

import type { Locale } from "../i18n/locales";

/**
 * The canonical origin of the full site (TS-001 D1/D2, DEC-035). `www.` is
 * canonical on every domain. Absolute metadata URLs are built on it: the
 * pages are statically rendered, so they cannot read a request host, and
 * every non-canonical host is `noindex` anyway (TS-011 D9).
 */
export const SITE_ORIGIN = "https://www.schafe-vorm-fenster.de";

/**
 * Where the village calendars live after the move off the apex (DEC-035).
 * Used by the interim `/hilfe/*` redirect (DEC-047) and, later, by the app
 * handovers. One constant, so the swap is one line — `state/open.md` row 8.
 */
export const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN ?? "https://app.schafe-vorm-fenster.de";

/** Every page of the TS-004 D1 inventory, in inventory order. */
export const ROUTE_IDS = [
  "home",
  "place",
  "placeStart",
  "takePart",
  "register",
  "calendar",
  "order",
  "region",
  "regionQuote",
  "about",
  "archive",
  "legal",
] as const;

export type RouteId = (typeof ROUTE_IDS)[number];

export interface RouteDefinition {
  /** Localized paths, without the language prefix. `/` for the home page. */
  readonly path: Readonly<Record<Locale, string>>;
  /** The tactical spec that owns the page — TS-019 … TS-029. */
  readonly spec: string;
  /** The parent route, for the breadcrumb trail of TS-006 D2 / DEC-071. */
  readonly parent?: RouteId;
}

/**
 * The table. German segments are fixed by DEC-036; the English segments are
 * TS-004 D3a's proposal, adopted verbatim.
 */
export const ROUTES: Readonly<Record<RouteId, RouteDefinition>> = {
  home: { path: { de: "/", en: "/" }, spec: "TS-019" },
  place: { path: { de: "/dein-ort", en: "/your-place" }, spec: "TS-020" },
  placeStart: {
    path: { de: "/dein-ort/starten", en: "/your-place/start" },
    spec: "TS-021",
    parent: "place",
  },
  takePart: { path: { de: "/mitmachen", en: "/take-part" }, spec: "TS-022" },
  register: {
    path: { de: "/mitmachen/registrieren", en: "/take-part/register" },
    spec: "TS-023",
    parent: "takePart",
  },
  calendar: {
    path: { de: "/dein-kalender", en: "/your-calendar" },
    spec: "TS-024",
  },
  order: {
    path: { de: "/dein-kalender/bestellen", en: "/your-calendar/order" },
    spec: "TS-025",
    parent: "calendar",
  },
  region: { path: { de: "/deine-region", en: "/your-region" }, spec: "TS-026" },
  regionQuote: {
    path: { de: "/deine-region/angebot", en: "/your-region/quote" },
    spec: "TS-026",
    parent: "region",
  },
  about: { path: { de: "/ueber-uns", en: "/about" }, spec: "TS-027" },
  archive: {
    path: { de: "/ueber-uns/archiv", en: "/about/archive" },
    spec: "TS-028",
    parent: "about",
  },
  legal: { path: { de: "/rechtliches", en: "/legal" }, spec: "TS-029" },
};

/**
 * The public path of a route in a language — the link facade of TS-001 D5.
 * The prefix appears iff the language is not the TLD default (TS-001 D4).
 *
 * This is the only function a component may use to build an internal href.
 */
export function href(route: RouteId, locale: Locale): string {
  const path = ROUTES[route].path[locale];
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * The path inside the App Router tree — `/{lang}{germanPath}` (TS-004 D2).
 * This is the destination of the URL mapping, never a link target.
 */
export function internalPath(route: RouteId, locale: Locale): string {
  const path = ROUTES[route].path[DEFAULT_LOCALE];
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** The absolute canonical URL of a route in a language (TS-001 D6). */
export function canonicalUrl(route: RouteId, locale: Locale): string {
  const path = href(route, locale);
  return path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

/**
 * The hreflang set of a route: every language the page exists in, plus
 * `x-default` on the TLD default (TS-001 D6). Symmetric by construction —
 * both variants of a page derive their set from the same row.
 */
export function alternateUrls(route: RouteId): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of LOCALES) alternates[locale] = canonicalUrl(route, locale);
  alternates["x-default"] = canonicalUrl(route, DEFAULT_LOCALE);
  return alternates;
}

/** The breadcrumb trail of a route, root first, the route itself last. */
export function trail(route: RouteId): RouteId[] {
  const parent = ROUTES[route].parent;
  return parent ? [...trail(parent), route] : [route];
}

/** Resolves a public path (no language prefix) back to its route id. */
export function routeIdForPath(
  path: string,
  locale: Locale,
): RouteId | undefined {
  const normalised = normalisePath(path);
  return ROUTE_IDS.find((id) => ROUTES[id].path[locale] === normalised);
}

/** Lowercases and strips a trailing slash — TS-011 D1's normalisation rule. */
export function normalisePath(path: string): string {
  const lowered = path.toLowerCase();
  if (lowered.length > 1 && lowered.endsWith("/")) return lowered.slice(0, -1);
  return lowered;
}

/** Every (route, language) pair — the full public surface of the website. */
export function everyRoute(): { route: RouteId; locale: Locale }[] {
  return ROUTE_IDS.flatMap((route) =>
    LOCALES.map((locale) => ({ route, locale })),
  );
}
