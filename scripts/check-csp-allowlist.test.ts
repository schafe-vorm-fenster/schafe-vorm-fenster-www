import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { ALLOWLIST } from "../src/lib/security/csp";

/**
 * TS-WEB-0013-A4 — "the deployed CSP allowlist equals the D2 host set exactly
 * — no wildcard, no extra host, no missing host."
 *
 * ── Why this reads the specification and not a second list ─────────────────
 *
 * D2 closes with its own rule: *"The CSP allowlist (CON-WEB-0030) and this
 * table are the same set seen from two sides. If they diverge, one of them is
 * wrong."* `scripts/check-csp.ts` already checks the CSP against
 * `ALLOWLIST` — but `ALLOWLIST` *is* the CSP's own table, so that check
 * cannot see a divergence between the code and D2; it compares the policy
 * with itself. A4 is the other comparison, and the only way to make it one is
 * to parse D2 out of `specs/tactical/TS-WEB-0013--privacy.tactical.md`, which
 * is what `d2Hosts()` below does. The spec carries the truth (AGENTS.md rule
 * 8, DEC-0104), so the spec is the input.
 *
 * ── The level ─────────────────────────────────────────────────────────────
 *
 * A4 is `static`: no browser, no request, two files read off disk. It lives in
 * `scripts/` because both of its inputs do — a specification and the security
 * module — and `scripts/vitest.config.mts` is the runner for that tree.
 *
 * ── What is green today, and what is declared ─────────────────────────────
 *
 * Measured on 2026-09-26, the two sides do diverge, by three hosts the CSP
 * carries and D2 has no row for. That is D2's own "one of them is wrong", and
 * it is a spec-owner's decision which one — not a test author's. So the three
 * are declared in `KNOWN_DIVERGENCES` with their reason, and the assertions
 * are written so that the list can only shrink: a fourth extra host fails, a
 * missing host fails, and a declared divergence that has been resolved fails
 * too, asking for its entry to be deleted. The exception is visible instead of
 * absent (DEC-0144 §3, `state/open.md` row 279).
 *
 * ── Why no test title below carries the identifier ────────────────────────
 *
 * The criterion says *equals … exactly*, and the case at the end of this file
 * asserts that the difference is exactly three hosts. That is a measurement of
 * an **unmet** criterion, and a title carrying the id would make
 * `pnpm check:coverage` count it VERIFIED — closed coverage for a sentence the
 * repository does not fulfil. That is the false green `DEC-0142` §9 took back
 * for `TS-WEB-0018-A7` and `src/lib/content/validate.test.ts` documents in the
 * same words; the same rule applies here (DEC-0144 §10). So the id stands in
 * this docblock and in no title: the verdict is NAMED ONLY, which is what the
 * state is, and it turns into VERIFIED the day the spec owner either writes
 * the three D2 rows or has the three hosts taken out of the policy — then
 * `KNOWN_DIVERGENCES` goes empty, the last two cases become the equality A4
 * asks for, and the id moves into the title in the same commit.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SPEC = "specs/tactical/TS-WEB-0013--privacy.tactical.md";

/**
 * A D2 row, as the table writes it: the host cell, and the party cell that
 * says whether the row is our own origin or somebody else's host.
 */
interface D2Row {
  readonly hostCell: string;
  readonly party: string;
}

/** The rows of the `### D2 —` table, in table order. */
export function d2Rows(markdown: string): D2Row[] {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => /^###\s+D2\s+—/.test(line));
  if (start === -1) throw new Error(`${SPEC}: no "### D2 —" heading`);

  const rows: D2Row[] = [];
  let inTable = false;
  for (const line of lines.slice(start + 1)) {
    if (/^###\s/.test(line)) break;
    const isRow = line.startsWith("|");
    if (!isRow) {
      if (inTable) break; // The table ends at the first line that is not a row.
      continue;
    }
    inTable = true;
    const cells = line.slice(1, line.replace(/\s+$/, "").length - 1).split("|");
    if (cells.length < 5) continue;
    const hostCell = cells[0].trim();
    if (hostCell === "Host" || /^-+$/.test(hostCell.replace(/\s/g, ""))) continue;
    rows.push({ hostCell, party: cells[3].trim() });
  }
  if (rows.length === 0) throw new Error(`${SPEC}: the D2 table has no rows`);
  return rows;
}

/** A backticked token that is a hostname: dots, no slash, no wildcard. */
const HOSTNAME = /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/;

export interface D2HostSet {
  /** Hosts of rows that are not first party — what a CSP has to allowlist. */
  readonly external: string[];
  /** First-party rows — `'self'` in the policy, never an allowlist entry. */
  readonly ownOrigin: string[];
  /** Rows whose host the table does not name yet (the envoy row, Q-0022). */
  readonly unnamed: number;
  /** Rows whose "host" is a same-origin path — no host to allowlist. */
  readonly sameOriginPaths: string[];
}

/** D2 read as three sets plus a count, so every row is accounted for. */
export function d2Hosts(markdown: string): D2HostSet {
  const external: string[] = [];
  const ownOrigin: string[] = [];
  const sameOriginPaths: string[] = [];
  let unnamed = 0;

  for (const row of d2Rows(markdown)) {
    const tokens = [...row.hostCell.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
    if (row.hostCell.includes("UNKNOWN")) {
      unnamed += 1;
      continue;
    }
    const paths = tokens.filter((token) => token.startsWith("/"));
    sameOriginPaths.push(...paths);
    const hosts = tokens.filter((token) => HOSTNAME.test(token));
    if (row.party.toLowerCase().startsWith("first party")) ownOrigin.push(...hosts);
    else external.push(...hosts);
  }

  return { external, ownOrigin, unnamed, sameOriginPaths };
}

/**
 * The hosts the CSP allowlists that D2 has no row for, each with the reason it
 * is still here. Every entry is a `state/open.md` row; resolving one means
 * deleting it here in the same commit, and the last case in this file is what
 * enforces that.
 */
const KNOWN_DIVERGENCES: Readonly<Record<string, string>> = {
  "portalize.schafe-vorm-fenster.de":
    "the Portalize widget's own loader host; D2 names `app.schafe-vorm-fenster.de` for that loader and no second row for this one (DEC-0030)",
  "envoy-api.api.schafe-vorm-fenster.de":
    "D2's envoy row is still UNKNOWN (Q-0022) while the CSP already carries a host for it",
  "assets.api.schafe-vorm-fenster.de":
    "the embedded calendar's event images; D3 lists `assets.api.…` as server-side only, so D2 has no client-request row for it",
};

const hostOf = (origin: string): string => new URL(origin).host;

const specMarkdown = (): string => readFileSync(join(ROOT, SPEC), "utf8");
const cspHosts = (): string[] => Object.values(ALLOWLIST).map(hostOf);

// The id `TS-WEB-0013-A4` is deliberately **not** in this title — see "Why no
// test title below carries the identifier" above. A4 asks for exact equality;
// the last two cases measure a difference of exactly three hosts, so the
// criterion is not met, and a title naming it would make `pnpm check:coverage`
// count closed coverage for it (DEC-0142 §9 took that green back for
// `TS-WEB-0018-A7`; DEC-0144 §10 keeps the rule). What this suite does prove is
// that D2 and the policy diverge by nothing more than the three declared hosts.
describe("D2 against the deployed CSP allowlist: no wildcard, no missing host, three declared extras", () => {
  it("parses D2 into external hosts, own origins, same-origin paths and unnamed rows", () => {
    const d2 = d2Hosts(specMarkdown());
    // The table is read, not assumed: every row lands in exactly one bucket,
    // and a row that stopped parsing would empty one of them.
    expect(d2.external).toContain("code.etracker.com");
    expect(d2.external).toContain("docs.google.com");
    expect(d2.ownOrigin).toContain("schafe-vorm-fenster.de");
    expect(d2.sameOriginPaths).toContain("/_vercel/speed-insights/*");
    expect(d2.unnamed).toBeGreaterThan(0);
  });

  it("no wildcard: every allowlist entry is one absolute origin with a literal host", () => {
    for (const origin of Object.values(ALLOWLIST)) {
      expect(origin).not.toContain("*");
      expect(origin.startsWith("https://")).toBe(true);
      expect(hostOf(origin)).toMatch(HOSTNAME);
    }
  });

  it("no missing host: every external host D2 names is in the CSP allowlist", () => {
    const missing = d2Hosts(specMarkdown()).external.filter((host) => !cspHosts().includes(host));
    expect(missing, `D2 rows with no CSP allowlist entry: ${missing.join(", ")}`).toEqual([]);
  });

  it("no first-party host and no same-origin path leaks into the allowlist — those are `'self'`", () => {
    const d2 = d2Hosts(specMarkdown());
    for (const host of d2.ownOrigin) expect(cspHosts()).not.toContain(host);
  });

  it("no extra host beyond D2, except the three divergences D2's own rule declares wrong", () => {
    const d2 = d2Hosts(specMarkdown());
    const extra = cspHosts().filter((host) => !d2.external.includes(host));
    expect(extra.toSorted()).toEqual(Object.keys(KNOWN_DIVERGENCES).toSorted());
  });

  it("a resolved divergence has to be removed from this file, not left standing", () => {
    const d2 = d2Hosts(specMarkdown());
    const stale = Object.keys(KNOWN_DIVERGENCES).filter(
      (host) => d2.external.includes(host) || !cspHosts().includes(host),
    );
    expect(
      stale,
      `declared divergences that no longer diverge — delete them here: ${stale.join(", ")}`,
    ).toEqual([]);
  });
});
