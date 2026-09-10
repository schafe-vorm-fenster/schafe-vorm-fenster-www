---
artefact: verification-strategy
status: DRAFT
date: 2026-09-10
decisions: [DEC-040]
---

# Verification Strategy

## Levels

Every acceptance criterion declares exactly one level. The distribution
across levels *is* the test pyramid — it is read off the specs, not
decided separately.

| Level | Where it runs | Convention |
| --- | --- | --- |
| `static` | build/lint, no runtime — e.g. token set contrast, route tree shape | ESLint rule or a `scripts/check-*.ts` |
| `unit` | pure functions — scoring, locale mapping, route translation | Vitest, `*.test.ts`, co-located |
| `integration` | Next.js routes, handlers, rendering in-process | Vitest, `*.integration.test.ts` |
| `e2e` | what genuinely crosses the browser boundary | Playwright, `e2e/*.spec.ts` |
| `tool` | an external tool is the verdict — Lighthouse CI, axe, bundle guard | CI job |
| `manual` | documented human check, per release | release checklist |

**Routes are integration, not e2e.** Next.js can render and invoke route
handlers in-process, so redirects, status codes, `<html lang>`, headers
and sitemaps are Vitest concerns. E2E stays thin and covers journeys,
real browser behaviour, and cross-domain handovers.

## Linking tests to specs

A test names the ID it verifies. That is the entire mechanism.

```ts
// Vitest — a determination contract
describe("TS-001 D3: locale detection", () => { … });
// Vitest — a requirement
describe("WEB-F-032: relevance scoring", () => { … });
// Vitest — an acceptance criterion
describe("TS-004-A2: redundant prefix redirects", () => { … });
// Playwright
test("TS-001-A7: language switch keeps the equivalent page", async () => { … });
```

Gherkin scenarios carry the same IDs as tags (`@WEB-F-044 @TS-004-A4`).

## What tests what

- **Acceptance criteria** verify *outcomes* — usually `integration`,
  `e2e`, or `tool`.
- **Determinations** are *contracts* — this is where the numerous `unit`
  tests hang: the scoring formula (relevance model §Scoring), the
  detection algorithm (TS-001 D3), the route translation map (TS-004
  D3a), the three-tier fallback (DEC-019).

Specs already carry usable fixtures. The relevance model's worked
example — "visitor from Lehre, Lower Saxony, stage 1" with seven
expected positions — is a ready-made unit test table for WEB-F-031 and
WEB-F-034.

## Closure

`pnpm check:specs` builds the matrix and reports:

- ACs with an unknown or missing level (error)
- Coverage entries pointing at non-existent ACs (error)
- Tests naming unknown IDs (error)
- Requirements covered by a tactical spec but discharged by no AC (W2)
- ACs no test references (W3)

W2 and W3 are the burn-down. Until the first test exists they report
everything as open, which is the honest starting position.
