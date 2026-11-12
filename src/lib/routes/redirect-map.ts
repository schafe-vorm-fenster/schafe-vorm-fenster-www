/**
 * The redirect map — TS-WEB-0011 D1.
 *
 * **One source, one hop.** Every URL the old site exposed either resolves
 * unchanged or answers a 301 to its successor, and a legacy URL is known in
 * exactly this file. The table is **append-only**: rows are never deleted,
 * because the links pointing at them are not ours to fix.
 *
 * ### State at M4
 *
 * The table now carries the confirmed floor of TS-WEB-0011 D2 — extracted from
 * SRC-0010's route files (`legacy-content/app/`), which is what exists: a
 * route inventory, not an indexed-URL export. Q-0016 (that export) is still
 * open, so D2 stays [PROPOSED] until it lands and this table is the
 * confirmed floor, not the finished inventory (`redirectMapViolations` is
 * what a wider inventory has to keep passing).
 *
 * ### Deviation from TS-WEB-0011 D1, recorded
 *
 * D1 names `proxy.ts` as the single consumer and rules out config-level
 * `redirects()`. This table is still consumed via `next.config.ts`
 * (`next-routing.ts`'s `legacyRedirects()`), not `proxy.ts`: the substance of
 * D1 — *one legacy URL is known in one place only* — is kept (this file is
 * that place), and `next.config.ts` evaluates redirects before every
 * rewrite, so D1's "step 0, before any locale rule" ordering holds. Moving
 * the *consumer* into `proxy.ts` is a mechanical change to `next-routing.ts`/
 * `next.config.ts`, neither of which this work package owns; recorded as
 * open (state/open.md).
 *
 * ### `/start` — row 40's contradiction, resolved
 *
 * TS-WEB-0011 D2 proposed `/start` → `/mitmachen`. TS-WEB-0016 D6 (forms-and-leads)
 * separately makes `/start` a **live route** that joins the TS-WEB-0004 D1
 * inventory itself, redirecting on to the Google Form lead fallback — the
 * same functional job the legacy "Anmelden" page at that exact URL did.
 * One path cannot carry both a redirect-map row and a page route: whichever
 * exists, the other never runs (`next.config.ts` evaluates redirects before
 * any route matches).
 *
 * **Decision:** no redirect-map row for `/start`. The URL stays live,
 * unchanged, as TS-WEB-0016's route — which satisfies FUN-WEB-0070 ("stable URLs or
 * 301") more directly than moving it: nothing about the URL changes, and
 * its audience (visitors wanting to register) lands exactly where the
 * legacy page put them, one hop closer to signup than a stop at
 * `/mitmachen` would be. Recorded in `state/open.md` row 40.
 */

import { legalAnchor } from "./legal-anchors";
import { href } from "./routes";

/**
 * community-site's own origin — **not** `APP_URL`. `APP_URL`
 * (`src/lib/live/app-handover.ts`, DEC-0177) is where every link "to the app"
 * goes while the app has no domain of its own (TS-WEB-0017-A11 keeps that
 * literal to that one file — it is not repeated here). The legacy `/hilfe`
 * redirect is a different job: community-site's own help, which answers 200.
 * community-site is "the app" that CON-WEB-0010 and DEC-0047 mean for help
 * content (DEC-0146) and today it answers on the bare apex — confirmed
 * against the Vercel project's domain list, not assumed. The two origins
 * move on independent timelines; do not merge them.
 */
const COMMUNITY_SITE_ORIGIN =
  process.env.NEXT_PUBLIC_COMMUNITY_SITE_ORIGIN ?? "https://schafe-vorm-fenster.de";

/**
 * community-site's help index — the target of the legacy `/hilfe` row below,
 * and the one value `/llms.txt` links as "Hilfe" (FUN-WEB-0170), so the two
 * cannot point at different places.
 */
export const COMMUNITY_HELP_URL = `${COMMUNITY_SITE_ORIGIN}/hilfe`;

export interface RedirectRow {
  /**
   * The legacy path, lowercase, without trailing slash and without query.
   * With `wildcard`, it matches the path and everything below it.
   */
  readonly from: string;
  /**
   * The successor: a public path of the TS-WEB-0004 D1 inventory, or an absolute
   * URL on an owned host. Nothing else (TS-WEB-0011 D1).
   */
  readonly to: string;
  /** `true` when the row covers `from` and every path below it. */
  readonly wildcard?: boolean;
  /**
   * With `wildcard`, carry the matched tail on to `to` (`${to}/:path*`)
   * instead of collapsing every path under `from` onto `to` verbatim.
   * Only meaningful together with `wildcard`.
   */
  readonly preservePath?: boolean;
  /** Why the row exists — a decision id, a question id, or a sentence. */
  readonly reason: string;
}

/**
 * The table. Status is always 301 (TS-WEB-0011 D1); the query string is preserved
 * verbatim by the redirect mechanism, so `etcc_*` survives every hop.
 */
export const LEGACY_REDIRECTS: readonly RedirectRow[] = [
  {
    from: "/hilfe",
    to: COMMUNITY_HELP_URL,
    wildcard: true,
    preservePath: true,
    reason:
      "DEC-0047, DEC-0146 — support articles moved to community-site, which " +
      "publishes /hilfe and /hilfe/{slug} at the identical slugs the legacy " +
      "site used (community-site PR 204). Per-article, not app-root: Q-0041 and " +
      "state/open.md row 8 are resolved.",
  },
  {
    from: "/funktionen",
    to: href("calendar", "de"),
    reason:
      "TS-WEB-0011 D2 — the legacy feature list (10 markdown features under " +
      "legacy-content/app/funktionen/). /dein-kalender is the only page that " +
      "still argues features.",
  },
  {
    from: "/presse",
    to: href("archive", "de"),
    reason:
      "TS-WEB-0011 D2 — the legacy press page. The proof archive is its successor " +
      "(FUN-WEB-0018).",
  },
  {
    from: "/en/press",
    to: href("archive", "en"),
    reason:
      "DEC-0166 — the English twin of /presse: one press address per language " +
      "to hand to journalists, both landing on the press page " +
      "(TS-WEB-0028 D1 as amended).",
  },
  {
    from: "/impressum",
    to: `${href("legal", "de")}#${legalAnchor("imprint", "de")}`,
    reason:
      "TS-WEB-0011 D2 — the legacy page carried imprint and privacy together " +
      "(one page, footer linked both here); the anchor is TS-WEB-0004 D8's.",
  },
  // `/hilfe/{slug}` is covered by the `/hilfe` wildcard row above (DEC-0047).
  // `/start` is deliberately **not** a row here — see the module doc above
  // ("`/start` — row 40's contradiction, resolved"): it stays a live route
  // under TS-WEB-0016, not a legacy redirect.
];

/**
 * The 36 help-article slugs the legacy site listed on `/hilfe` (read off the
 * live legacy page on 2026-11-12; identical to the files in `content/support/`).
 * community-site publishes every one at `/hilfe/{slug}` and answered 200 for
 * each on the same day (issue 193). The `/hilfe` wildcard row above already
 * redirects them; this list is the inventory the tests hold the row against,
 * so an article that community-site drops shows up as a failing check, and a
 * slug the legacy site gains is a deliberate edit here.
 */
export const LEGACY_HELP_SLUGS: readonly string[] = [
  "app-icon",
  "beschreibung",
  "bild",
  "dateifreigabe",
  "dorffoto-aendern",
  "dorffotos",
  "druckansicht",
  "finanzierung",
  "geodaten",
  "google-account",
  "google-alternativen",
  "google-kalender",
  "kalender-anmelden",
  "kalender-veroeffentlichen",
  "kostenlos",
  "nur-kalender",
  "office-365",
  "open-data",
  "ortsangabe",
  "pdf-anhang",
  "pengueen",
  "portalize-einbinden",
  "portalize-konfiguration",
  "portalize-styling",
  "portalize-was-ist-das",
  "qr-code",
  "schutz-vor-missbrauch",
  "start",
  "teilen",
  "terminreihen",
  "umgebung",
  "unterstuetzen",
  "verbreiten",
  "webtracking",
  "woher-kommt-der-name",
  "wordpress",
];

/**
 * Every URL the legacy site exposed (route files in `legacy-content/app/`,
 * header and footer navigation of the live site, and the `/hilfe` listing).
 * `live` marks the paths that keep answering unchanged instead of redirecting:
 * `/` ("Über das Projekt" is the new home) and `/start` (TS-WEB-0016's route).
 * The legacy site had no sitemap.xml and no robots.txt (both 404).
 */
export const LEGACY_URLS: readonly string[] = [
  "/",
  "/funktionen",
  "/start",
  "/presse",
  "/impressum",
  "/hilfe",
  ...LEGACY_HELP_SLUGS.map((slug) => `/hilfe/${slug}`),
];

/** Legacy paths that stay live instead of redirecting. */
export const LEGACY_LIVE_PATHS: readonly string[] = ["/", "/start"];

/**
 * Resolves a legacy path to its destination the way `next-routing.ts` does
 * (exact row, else the longest wildcard row), or `null` when no row matches.
 */
export function resolveLegacyRedirect(
  path: string,
  rows: readonly RedirectRow[] = LEGACY_REDIRECTS,
): string | null {
  const exact = rows.find((row) => row.from === path);
  if (exact) return exact.to;
  const wildcard = rows
    .filter((row) => row.wildcard && path.startsWith(`${row.from}/`))
    .sort((a, b) => b.from.length - a.from.length)[0];
  if (!wildcard) return null;
  return wildcard.preservePath
    ? `${wildcard.to}${path.slice(wildcard.from.length)}`
    : wildcard.to;
}

/**
 * The static half of TS-WEB-0011-A1: no chains, no duplicates, targets are either
 * an absolute URL on an owned host or a path. Returns the violations.
 */
export function redirectMapViolations(
  rows: readonly RedirectRow[] = LEGACY_REDIRECTS,
): string[] {
  const violations: string[] = [];
  const sources = new Set<string>();

  for (const row of rows) {
    if (sources.has(row.from)) violations.push(`duplicate source ${row.from}`);
    sources.add(row.from);
    if (!row.from.startsWith("/")) violations.push(`source is not a path: ${row.from}`);
    if (row.from.length > 1 && row.from.endsWith("/"))
      violations.push(`source carries a trailing slash: ${row.from}`);
    if (row.from !== row.from.toLowerCase())
      violations.push(`source is not lowercase: ${row.from}`);
    if (!row.to.startsWith("/") && !row.to.startsWith("https://"))
      violations.push(`target is neither a path nor an https URL: ${row.to}`);
    if (!row.reason.trim()) violations.push(`row ${row.from} carries no reason`);
  }

  // One hop: no target of a row may itself be the source of another row.
  for (const row of rows) {
    const target = row.to.split("?")[0]?.split("#")[0] ?? "";
    if (sources.has(target))
      violations.push(`chain: ${row.from} → ${target}, which redirects again`);
  }

  return violations;
}
