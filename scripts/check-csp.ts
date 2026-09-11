/**
 * CSP no-wildcard / allowlist / no-unsafe-inline guard — TS-014-A1, D7
 * (F-1-2, round 1 carry-over, fixed round 2).
 *
 * TS-014-A1 (`specs/tactical/security.tactical.md`): "`lib/security/csp.ts`
 * contains no `*`, no bare scheme in `script-src`/`connect-src`, no
 * `'unsafe-inline'`/`'unsafe-eval'` in a production script directive; every
 * host in it has a row in D1 and vice versa." D7 makes `csp.ts` the single
 * source of the policy, so this check builds the policy the same way
 * `proxy.ts` does — through `policyDirectives()` — rather than
 * pattern-matching the module's source text, which is what `check-brand.ts`
 * and `check-api-routes.ts` do for their own, differently-shaped rules.
 *
 * What is checked, for both `production` and `preview` (the two
 * environments a real deployment ever serves — `development` carries its
 * own documented `'unsafe-eval'`/`'unsafe-inline'` concessions in `csp.ts`
 * and is out of this guard's scope, same as A1's text: "a *production*
 * script directive"):
 *
 *  - **no wildcard** anywhere in any directive's value list;
 *  - **no bare scheme** (`https:`, `http:`) in `script-src` or `connect-src`;
 *  - **every external host is in the D1 allowlist** (`ALLOWLIST` from
 *    `csp.ts` — the same table D1 names, TS-014 D7's "one typed structure");
 *  - **`'unsafe-inline'`/`'unsafe-eval'` never appear in `script-src` for
 *    `production`**, with or without a build hash set;
 *  - **the preview-only `'unsafe-inline'` fence (F-2-27, DEC-045)** holds
 *    exactly: present in `preview`'s `script-src` when no hash set exists,
 *    absent the moment one does, and never present for `production` either
 *    way — the branch `state/findings/round-2.md` F-1-2 exists to fence.
 *
 * `checkPolicyDirectives` takes a plain directive record so a test can feed
 * it a fixture policy directly — real *and* deliberately-broken ones —
 * without needing a real build's hash set. `checkCsp()` wires that pure
 * function to the actual `policyDirectives()` export for the four cases
 * that matter (`production`/`preview` × without/with hashes).
 *
 * Exit code of `main()`: number of errors (0 = green).
 */

import { fileURLToPath } from "node:url";

import { policyDirectives, ALLOWLIST, type Environment, type PolicyInput } from "../src/lib/security/csp";

const D1_HOSTS = new Set<string>(["'self'", ...Object.values(ALLOWLIST)]);

const WILDCARD = /\*/;
const BARE_SCHEME = /^https?:$/;
const URL_TOKEN = /^https?:\/\//;
const UNSAFE_INLINE = "'unsafe-inline'";
const UNSAFE_EVAL = "'unsafe-eval'";

export interface PolicyCheckCase {
  readonly environment: Environment;
  readonly hasHashes: boolean;
}

/**
 * The pure check: given one environment's label (for messages only — the
 * rule that actually varies by environment is "production never carries
 * unsafe-inline/unsafe-eval, preview may when hashless") and a directive
 * record, returns every TS-014-A1 violation found. No filesystem, no
 * `policyDirectives()` call — a test can hand this a fixture directly.
 */
export function checkPolicyDirectives(
  environment: Environment,
  directives: Record<string, readonly string[]>,
): string[] {
  const errors: string[] = [];

  for (const [directive, values] of Object.entries(directives)) {
    for (const value of values) {
      if (WILDCARD.test(value)) {
        errors.push(`A1 ${environment}/${directive}: wildcard source "${value}"`);
      }
      if ((directive === "script-src" || directive === "connect-src") && BARE_SCHEME.test(value)) {
        errors.push(`A1 ${environment}/${directive}: bare scheme "${value}"`);
      }
      if (URL_TOKEN.test(value) && !D1_HOSTS.has(value)) {
        errors.push(`A1 ${environment}/${directive}: host "${value}" has no row in D1 (ALLOWLIST)`);
      }
    }
  }

  const scriptSrc = directives["script-src"] ?? [];
  if (environment === "production") {
    if (scriptSrc.includes(UNSAFE_INLINE))
      errors.push(`A1 production/script-src: 'unsafe-inline' in a production script directive`);
    if (scriptSrc.includes(UNSAFE_EVAL))
      errors.push(`A1 production/script-src: 'unsafe-eval' in a production script directive`);
  }

  return errors;
}

/**
 * The preview-only `'unsafe-inline'` fence (F-2-27, DEC-045): present iff
 * `preview` and no hash set, absent the moment a hash set exists, and never
 * present for `production` regardless. Checked against a directive
 * builder — the real `policyDirectives()` by default, or a fixture builder
 * a test hands in — because this is the one assertion that needs to
 * compare *two or more* built policies against each other rather than
 * judge one in isolation, so it lives beside `checkPolicyDirectives` rather
 * than inside it.
 */
export function checkPreviewUnsafeInlineFence(
  buildDirectives: (input: PolicyInput) => Record<string, readonly string[]> = policyDirectives,
): string[] {
  const errors: string[] = [];

  const previewNoHashes = buildDirectives({ environment: "preview", scriptHashes: [] })["script-src"] ?? [];
  const previewWithHashes =
    buildDirectives({ environment: "preview", scriptHashes: ["sha256-Zm9vYmFy=="] })["script-src"] ?? [];
  const productionNoHashes = buildDirectives({ environment: "production", scriptHashes: [] })["script-src"] ?? [];
  const productionWithHashes =
    buildDirectives({ environment: "production", scriptHashes: ["sha256-Zm9vYmFy=="] })["script-src"] ?? [];

  if (!previewNoHashes.includes(UNSAFE_INLINE))
    errors.push(
      "F-2-27 preview/script-src (no hashes): expected the documented 'unsafe-inline' fallback, found none",
    );
  if (previewWithHashes.includes(UNSAFE_INLINE))
    errors.push(
      "F-2-27 preview/script-src (with hashes): 'unsafe-inline' must disappear once a hash set exists",
    );
  if (productionNoHashes.includes(UNSAFE_INLINE))
    errors.push("F-2-27 production/script-src (no hashes): 'unsafe-inline' must never appear in production");
  if (productionWithHashes.includes(UNSAFE_INLINE))
    errors.push(
      "F-2-27 production/script-src (with hashes): 'unsafe-inline' must never appear in production",
    );

  return errors;
}

/** The four (environment × hash-presence) cases a real deployment can serve. */
const CASES: readonly PolicyCheckCase[] = [
  { environment: "production", hasHashes: false },
  { environment: "production", hasHashes: true },
  { environment: "preview", hasHashes: false },
  { environment: "preview", hasHashes: true },
];

export interface CspCheckResult {
  readonly errors: string[];
  readonly casesChecked: number;
}

export function checkCsp(): CspCheckResult {
  const errors: string[] = [];

  for (const { environment, hasHashes } of CASES) {
    const scriptHashes = hasHashes ? ["sha256-Zm9vYmFy=="] : [];
    const directives = policyDirectives({ environment, scriptHashes });
    errors.push(...checkPolicyDirectives(environment, directives));
  }

  errors.push(...checkPreviewUnsafeInlineFence());

  return { errors, casesChecked: CASES.length };
}

function main() {
  const { errors, casesChecked } = checkCsp();
  console.log(`csp check: ${casesChecked} environment/hash case(s) built and checked`);
  for (const message of errors) console.error(`  ERROR TS-014-${message}`);
  console.log(errors.length ? `${errors.length} error(s)` : "no errors");
  process.exit(errors.length);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();
