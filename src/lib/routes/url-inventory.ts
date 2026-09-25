/**
 * TS-WEB-0004 D1's public URL inventory, as data — the list the *site* is
 * measured against (F-2-55).
 *
 * `routes.ts` is the page registry: twelve content routes and their
 * localized paths. D1 is larger than that. It also names three machine
 * surfaces (`/sitemap.xml`, `/robots.txt`, `/llms.txt`) and one page the
 * registry does not define — `/start`, the registration surface (TS-WEB-0016
 * D15, `app/start/page.tsx`) — and it says which of them a landing-only
 * domain serves. Until this module existed, the criteria that guard D1
 * (TS-WEB-0004-A1, A3, A5) asserted against `ROUTE_IDS` — i.e. against the
 * registry, which cannot be missing a row it defines. Two D1 rows were
 * absent from the site and every suite was green.
 *
 * So: the inventory lives here, the registry stays the source of the
 * *page* rows, and `url-inventory.test.ts` fails if the two ever disagree.
 * Everything that answers a D1 question — the landing-only rule in
 * `proxy.ts`, the route walk in `routing.integration.test.ts`, the browser
 * walk in `e2e/routes.spec.ts` — reads this.
 */

import { everyRoute, href, ROUTE_IDS } from "./routes";

import type { Locale } from "../i18n/locales";
import type { RouteId } from "./routes";

export type D1Kind =
  /** A rendered page of the D1 table. */
  | "page"
  /** A machine surface: `sitemap.xml`, `robots.txt`, `llms.txt`. */
  | "machine";

export interface D1Row {
  /** The path, exactly as D1 writes it (the TLD-default, unprefixed form). */
  readonly path: string;
  readonly kind: D1Kind;
  /**
   * The registry row this page is. A `page` without one is `/start`: a page
   * of the D1 table, outside the registry and outside `app/[lang]`.
   */
  readonly routeId?: RouteId;
  /**
   * D1, landing-only domains: "serve `/`, the three legal routes, and the
   * machine surfaces; every other path 404s."
   */
  readonly onLandingDomain: boolean;
  /** Which D1 status this path answers with on a full-site domain. */
  readonly status: 200;
}

/**
 * Everything D1 lists that the registry does not define: the machine
 * surfaces and `/start`.
 */
export const D1_NON_REGISTRY_ROWS: readonly D1Row[] = [
  { path: "/sitemap.xml", kind: "machine", onLandingDomain: true, status: 200 },
  { path: "/robots.txt", kind: "machine", onLandingDomain: true, status: 200 },
  { path: "/llms.txt", kind: "machine", onLandingDomain: true, status: 200 },
  // The registration surface (TS-WEB-0016 D15, FUN-WEB-0205, DEC-0108): a
  // page that renders the registration form as a visible embed, `noindex`,
  // absent from the sitemap. "Redirect only, renders nothing" until
  // 2026-09-25. Not part of a landing domain's set: D1 names `/`, the legal
  // routes and the machine surfaces there, and nothing else.
  { path: "/start", kind: "page", onLandingDomain: false, status: 200 },
];

/** The page rows, derived from the registry so the two cannot drift. */
export function d1PageRows(locale: Locale): D1Row[] {
  return ROUTE_IDS.map((routeId) => ({
    path: href(routeId, locale),
    kind: "page" as const,
    routeId,
    // D1: `/` and the legal route. Every other page 404s there.
    onLandingDomain: routeId === "home" || routeId === "legal",
    status: 200 as const,
  }));
}

/** Every row of D1, in every configured language, plus the shared rows. */
export function d1Inventory(): D1Row[] {
  const pages = everyRoute().map(({ route, locale }) => ({
    path: href(route, locale),
    kind: "page" as const,
    routeId: route,
    onLandingDomain: route === "home" || route === "legal",
    status: 200 as const,
  }));
  return [...pages, ...D1_NON_REGISTRY_ROWS];
}

/** Every D1 path, deduplicated — the walk TS-WEB-0004-A1 and A5 are about. */
export function everyD1Path(): string[] {
  return [...new Set(d1Inventory().map((row) => row.path))];
}

/**
 * TS-WEB-0004-A3 / D1's landing-only rule: may this path be served on a
 * landing-only domain? Everything else 404s there.
 *
 * Compares on the normalised path, so `/EN/Legal/` and `/en/legal` are the
 * same row (TS-WEB-0011 D1's normalisation).
 */
export function servedOnLandingDomain(path: string): boolean {
  const normalised = normalise(path);
  return d1Inventory().some(
    (row) => row.onLandingDomain && normalise(row.path) === normalised,
  );
}

function normalise(path: string): string {
  const lowered = path.toLowerCase();
  if (lowered.length > 1 && lowered.endsWith("/")) return lowered.slice(0, -1);
  return lowered;
}
