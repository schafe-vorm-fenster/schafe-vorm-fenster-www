---
id: DEC-040
title: Verification architecture — levels on acceptance criteria, IDs everywhere, Gherkin for journeys
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Context

STRICT's chain ends in verification, but the specs stopped at acceptance
criteria. The pyramid will hold far more unit and integration tests than
end-to-end ones — the question was how traceability survives that shape.

## Decision

1. **Every acceptance criterion is globally addressable and declares its
   level.** `TS-###-A#`, with one of six levels:
   `static · unit · integration · e2e · tool · manual`. The pyramid then
   *emerges* from the specs instead of being imposed on them, and a
   suspiciously empty level is visible.
2. **Traceability rides on IDs, not on a uniform format.** A test names
   the ID it verifies — `describe("WEB-F-032: …")`, `test("TS-001-A2: …")`.
   No framework, no ceremony.
3. **Gherkin only at journey level**, as the human-readable specification
   of the four jobs, tagged with the requirement and AC IDs it covers.
   **Playwright executes it; Cucumber is not introduced** — a second test
   runner would diversify the stack against DEC-002's rule.
4. **Routes are integration-tested, not end-to-end-tested**, wherever
   Next.js can render or invoke them in-process (Vitest). E2E stays thin
   and is reserved for what genuinely crosses the browser boundary.
5. **Determinations are unit-test contracts.** An AC verifies an outcome;
   a determination (`TS-001 D3`, the scoring formula) pins a contract.
   Both are addressable, and the numerous lower-level tests hang off
   determinations rather than ACs.
6. **The linter proves closure.** `check:specs` builds the
   requirement → AC → test matrix and reports every gap.

Test frameworks and file naming follow the ecosystem convention already
documented in `portalize/docs/testing-file-naming-convention.md`:
Vitest `*.test.ts` / `*.integration.test.ts`, Playwright `e2e/*.spec.ts`.

## Consequences

- All four tactical specs gained AC IDs and levels.
- `specs/verification/` holds the strategy and the journey features.
- Until tests exist the matrix reports everything as open — that is the
  burn-down, and it is honest.
