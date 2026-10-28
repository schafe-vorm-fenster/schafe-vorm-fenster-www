---
id: DEC-0180
title: CI runs the technical tests and a preview smoke; the full Playwright suite runs on demand only
status: accepted
date: 2026-10-28
decided_by: jan-henrik.hempel
---

## Context

On 2026-10-28 the owner asked how the test pipeline looks and whether the
"user tests" could be switched off: technical tests and an e2e smoke are
enough, and the process should get faster.

Measured on the last green runs of next-2026:

| Workflow | Trigger | E2E step | Duration |
| --- | --- | --- | --- |
| `check.yml` | every push and PR | the full suite (62 spec files, ~1,300 tests, 2 retries) against the local production build | 12.4 min |
| `preview-e2e.yml` ("Preview E2E Smoke") | every Vercel deployment of next-2026 | **the same full suite again** against the preview | 20.8 min |

`pnpm check` (static checks, typecheck, lint, 1,744 unit and integration
tests) takes 0.7 min and the build 0.3 min. No simulated-user or tester-role
run is part of CI; the time is the full Playwright suite, twice.

## Decision

The owner chose "technical and smoke only":

1. **Per push and PR** (`check.yml`): `pnpm check`, `pnpm build`, and
   `pnpm e2e:technical` — `smoke`, `csp-hydration`, `routes`,
   `external-links`, `layout-stability`, `a11y`, `privacy`.
2. **Per preview deployment** (`preview-e2e.yml`): `pnpm e2e:smoke` —
   `smoke`, `csp-hydration`, `routes`: every route loads, hydrates and has no
   CSP violation.
3. **The full suite** (`pnpm e2e`, incl. `e2e/pages/*` and the design and
   rule guards) runs **on demand only**: `.github/workflows/full-e2e.yml`
   (`workflow_dispatch`), or locally.

## Consequences

- The criteria whose instrument is a spec outside the two selections keep
  their instrument (the spec exists and `check:coverage` still counts it), but
  CI no longer runs it on every change. A breach of such a rule shows up only
  when the full suite runs. Run it before a release and after larger changes.
- An agent or developer changing a page runs the affected specs locally, as
  CONTRIBUTING says.
- TS-WEB-0003-A7 (CLS measured in CI) stays covered: `layout-stability` is in
  the technical selection.
- The selections are named in `package.json` (`e2e:technical`, `e2e:smoke`);
  changing them is a change to this record.
