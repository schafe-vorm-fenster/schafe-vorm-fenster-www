/**
 * The redirect map — TS-011 D1.
 *
 * **One source, one hop.** Every URL the old site exposed either resolves
 * unchanged or answers a 301 to its successor, and a legacy URL is known in
 * exactly this file. The table is **append-only**: rows are never deleted,
 * because the links pointing at them are not ours to fix.
 *
 * ### State at M4
 *
 * The table now carries the confirmed floor of TS-011 D2 — extracted from
 * SRC-010's route files (`legacy-content/app/`), which is what exists: a
 * route inventory, not an indexed-URL export. Q-016 (that export) is still
 * open, so D2 stays [PROPOSED] until it lands and this table is the
 * confirmed floor, not the finished inventory (`redirectMapViolations` is
 * what a wider inventory has to keep passing).
 *
 * ### Deviation from TS-011 D1, recorded
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
 * TS-011 D2 proposed `/start` → `/mitmachen`. TS-016 D6 (forms-and-leads)
 * separately makes `/start` a **live route** that joins the TS-004 D1
 * inventory itself, redirecting on to the Google Form lead fallback — the
 * same functional job the legacy "Anmelden" page at that exact URL did.
 * One path cannot carry both a redirect-map row and a page route: whichever
 * exists, the other never runs (`next.config.ts` evaluates redirects before
 * any route matches).
 *
 * **Decision:** no redirect-map row for `/start`. The URL stays live,
 * unchanged, as TS-016's route — which satisfies WEB-F-070 ("stable URLs or
 * 301") more directly than moving it: nothing about the URL changes, and
 * its audience (visitors wanting to register) lands exactly where the
 * legacy page put them, one hop closer to signup than a stop at
 * `/mitmachen` would be. Recorded in `state/open.md` row 40.
 */

import { legalAnchor } from "./legal-anchors";
import { APP_ORIGIN, href } from "./routes";

export interface RedirectRow {
  /**
   * The legacy path, lowercase, without trailing slash and without query.
   * With `wildcard`, it matches the path and everything below it.
   */
  readonly from: string;
  /**
   * The successor: a public path of the TS-004 D1 inventory, or an absolute
   * URL on an owned host. Nothing else (TS-011 D1).
   */
  readonly to: string;
  /** `true` when the row covers `from` and every path below it. */
  readonly wildcard?: boolean;
  /** Why the row exists — a decision id, a question id, or a sentence. */
  readonly reason: string;
}

/**
 * The table. Status is always 301 (TS-011 D1); the query string is preserved
 * verbatim by the redirect mechanism, so `etcc_*` survives every hop.
 */
export const LEGACY_REDIRECTS: readonly RedirectRow[] = [
  {
    from: "/hilfe",
    to: APP_ORIGIN,
    wildcard: true,
    reason:
      "DEC-047 — support articles moved to the app. Interim target is the app root " +
      "until the app publishes a per-article URL contract (Q-041, state/open.md row 8).",
  },
  {
    from: "/funktionen",
    to: href("calendar", "de"),
    reason:
      "TS-011 D2 — the legacy feature list (10 markdown features under " +
      "legacy-content/app/funktionen/). /dein-kalender is the only page that " +
      "still argues features.",
  },
  {
    from: "/presse",
    to: href("archive", "de"),
    reason:
      "TS-011 D2 — the legacy press page. The proof archive is its successor " +
      "(WEB-F-018).",
  },
  {
    from: "/impressum",
    to: `${href("legal", "de")}#${legalAnchor("imprint", "de")}`,
    reason:
      "TS-011 D2 — the legacy page carried imprint and privacy together " +
      "(one page, footer linked both here); the anchor is TS-004 D8's.",
  },
  // `/hilfe/{slug}` is covered by the `/hilfe` wildcard row above (DEC-047).
  // `/start` is deliberately **not** a row here — see the module doc above
  // ("`/start` — row 40's contradiction, resolved"): it stays a live route
  // under TS-016, not a legacy redirect.
];

/**
 * The static half of TS-011-A1: no chains, no duplicates, targets are either
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
