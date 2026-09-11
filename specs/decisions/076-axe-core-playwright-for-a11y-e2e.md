---
id: DEC-076
title: "@axe-core/playwright is the a11y sweep instrument for TS-002-A1 and TS-029-A12"
status: accepted
date: 2026-09-11
decided_by: run/developer (round-2 fix, F-2-6)
---

## Context

F-2-6 (round 2) finds that the gate's whole a11y acceptance-criteria group has
no automated instrument: no axe dependency exists in the tree, and
`e2e/pages/rechtliches.spec.ts` records TS-029-A12 as a named, skipped test.
TS-002-A1 and TS-029-A12 are declared at tool level in
`specs/tactical/…` and `plan/project-plan.md` puts axe into the test pyramid
from M2 on. `plan/guardrails.md`'s stack-harmony rule applies: look sideways
first, decide, record the decision, register a runtime dependency only if it
is one.

## Sideways look

Read off `package.json` (and, for the one hit, its e2e sub-package) in the
sibling repositories under `~/Projects/` on 2026-09-11:

| Repository | axe present | Package |
| --- | --- | --- |
| `community-calendar` (`packages/e2e`) | yes | `@axe-core/playwright@^4.11.1` |
| `classification-api` | no | — |
| `geo-api` | no | — |
| `events-api` | no | — |
| `envoy-api` | no | — |
| `community-site` | no | — |
| `portalize`, `translation-api`, `entre`, `calendar-api`, `eventification-api` | no | — |

`community-calendar/packages/e2e/tests/accessibility.spec.ts` uses it exactly
the way this fix needs: a shared `AxeBuilder` factory tagged
`["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]`, one sweep per route,
asserting `results.violations` (there, all violations; here, per
`plan/process.md`'s severity ladder, serious/critical only — see Decision).
One family repository already carries the dependency and the pattern; no
sibling carries a competing a11y tool.

## Decision

**`@axe-core/playwright@4.13.0` (latest; the sibling pins `^4.11.1`) enters
`devDependencies`.** Chosen over `axe-playwright` (a second, less-maintained
wrapper around the same `axe-core` engine — not used anywhere in the family)
and over a Lighthouse-only check (Lighthouse is not wired into this repo's
pipeline at all today, and its a11y category is coarser than a rule-level axe
sweep). The supply-chain audit (`supply-chain-risk-auditor`) found the
package clean: no advisories (npm registry and OSV both empty for
`@axe-core/playwright@4.13.0` and its `axe-core@~4.13.0` dependency), not
deprecated or archived, publishes with provenance, no install script, pushed
9 days before this decision, 7.49M downloads/week. Maintained by Deque Labs
(the authors of `axe-core` itself).

`e2e/a11y.spec.ts` sweeps all 24 routes of the route table at 360 px and
1280 px (the two TS-002 reference viewports) with the WCAG 2.1 A/AA rule
tags, and fails the run on any `serious` or `critical` violation —
`moderate`/`minor` violations are recorded but do not fail the test, matching
`plan/process.md`'s severity ladder (a `low`/`medium`-shaped defect goes to
`state/findings/`, not to a red gate). Findings the sweep turns up are filed
as `state/findings/round-2.md` findings (`F-2-28` onward, `Source: qa-tool`)
rather than fixed inline, per this round's instruction — this work package is
the instrument, not a page-by-page a11y fix pass.

**Not registered in `stack.allow.json`.** It is a `devDependencies` entry
only — a test tool, never imported by application code that ships to a
visitor — so TS-017 D1's runtime register does not apply (`stack.allow.json`'s
own `$comment`: "the register of every runtime dependency"; `scripts/check-stack.ts`
only walks `dependencies`, not `devDependencies`).

## Consequences

- One new dev dependency, one transitive (`axe-core`), no install scripts.
- `pnpm check` is unaffected (axe runs under Playwright, not Vitest); `pnpm e2e`
  gains one more spec file executed against the dev server (or the preview
  URL, via `E2E_BASE_URL`).
- The 360/1280 px matrix doubles the sweep's run count against a 24-route
  table but stays inside one spec file; a future gate can extend the tag list
  or viewport matrix here without touching another test.
