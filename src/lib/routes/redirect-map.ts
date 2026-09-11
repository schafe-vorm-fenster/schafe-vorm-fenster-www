/**
 * The redirect map — TS-011 D1.
 *
 * **One source, one hop.** Every URL the old site exposed either resolves
 * unchanged or answers a 301 to its successor, and a legacy URL is known in
 * exactly this file. The table is **append-only**: rows are never deleted,
 * because the links pointing at them are not ours to fix.
 *
 * ### State at M2
 *
 * This is the mechanism plus the one row DEC-047 fixes. The legacy inventory
 * itself is blocked on Q-016 (no export of indexed URLs exists) and lands in
 * M4 — the table below is deliberately almost empty, not forgotten.
 *
 * ### Deviation from TS-011 D1, recorded
 *
 * D1 names `proxy.ts` as the single consumer and rules out config-level
 * `redirects()`. M2 consumes the table in `next.config.ts` instead: the
 * substance of D1 — *one legacy URL is known in one place only* — is kept
 * (this file is that place), and `next.config.ts` evaluates redirects before
 * every rewrite, so D1's "step 0, before any locale rule" ordering holds.
 * Moving the consumer into `proxy.ts` when M4 adds the host-dependent rules
 * changes the consumer, not this table. See `state/open.md`.
 */

import { APP_ORIGIN } from "./routes";

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
