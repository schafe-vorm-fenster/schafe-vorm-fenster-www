# Findings — Round 1 (M1 gate)

## F-1-1 — TS-014-A2 e2e smoke test asserts only a subset of the required headers

- Severity: low
- Source: qa
- Where: `e2e/smoke.spec.ts`, test "TS-014-A2: the security headers of TS-014 D4 are on the response"
- Steps: Read the test; compare its assertions against TS-014 D4's full
  header table and D2's CSP. The test checks
  `x-content-type-options`, `referrer-policy`, `x-frame-options`,
  `cross-origin-opener-policy`, and two substrings of the CSP
  (`default-src 'self'`, `frame-ancestors 'none'`). It never asserts
  `Permissions-Policy`, `Cross-Origin-Resource-Policy`,
  `Reporting-Endpoints`, or the CSP in full. Separately, `curl
  localhost:3100/` shows all of these are in fact present today with
  the exact D4/D2 values.
- Expected: TS-014-A2 ("Every production response carries the D2 CSP
  and all D4 headers with exactly the specified values") — a test
  claiming to cover this AC should assert the full set, so a future
  regression in an unasserted header is caught.
- Observed: Only a partial header set is asserted; the rest are
  currently correct but unguarded by any automated check. Also a
  minor level deviation: `verification-strategy.md` puts headers at
  `integration` ("routes are integration, not e2e"); this AC is
  implemented as a Playwright e2e test instead.
- Round decision: fix-now
- Resolved: 26176ff

## F-1-2 — No automated guard for TS-014-A1 (CSP allowlist / no-wildcard rule)

- Severity: medium
- Source: qa
- Where: `src/lib/security/csp.ts` (no corresponding entry in
  `scripts/check-stack.ts`, `scripts/check-brand.ts`, or any other
  script run by `pnpm check`)
- Steps: Run `pnpm check` and read every script it invokes — none of
  them inspects `src/lib/security/csp.ts` for wildcards, bare
  schemes, `'unsafe-inline'`/`'unsafe-eval'` in a production script
  directive, or D1 host-list symmetry. The rule currently holds
  (verified by manual code reading this run), but nothing would fail
  if a future edit reintroduced one of these.
- Expected: TS-014 D7 states explicitly: "A1 asserts this statically,
  so the rule fails in CI rather than in review" — the spec itself
  demands a machine check, not a manual one.
- Observed: The check exists only as this round's manual QA read, not
  as a script `pnpm check` runs.
- Round decision:

## F-1-3 — No automated guard for TS-017-A10 / TS-017-A11

- Severity: low
- Source: qa
- Where: route tree (`app/`) for A10; whole-tree hostname search for
  A11 — neither has a corresponding script
- Steps: Same method as F-1-2, scoped to TS-017. A10 ("every
  website `/api/*` route handler exports GET only") and A11 ("the
  app hostname occurs in exactly one module") both hold today, but
  only because the features that would violate them (BFF routes, the
  handover builder) don't exist yet. No script in `pnpm check`
  enforces either rule.
- Expected: Both ACs are declared `static` level, which per
  `specs/verification/verification-strategy.md` means "ESLint rule or
  a `scripts/check-*.ts`" — an automated, repeatable check.
- Observed: Verified by one-off manual `grep`/directory search this
  round, not by a script. Once M4 adds `app/api/*` routes and the
  DEC-029 handover module, a violation could land without `pnpm check`
  catching it.
- Round decision: fix-now
- Resolved: 26176ff
