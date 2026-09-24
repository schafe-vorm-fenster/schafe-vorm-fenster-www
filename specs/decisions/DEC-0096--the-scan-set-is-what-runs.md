---
id: DEC-0096
title: The test-reference scan is what actually runs — read off the runners, not listed by hand
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

`check:specs` E10 reads the test corpus to find out which acceptance
criteria something verifies. W3 counts the criteria nothing references, and
since DEC-0095 W7 counts the requirements with no referenced criterion — the
same gap from the other end.

Both numbers are only as honest as the scan set, and the scan set was three
pairs written by hand:

```ts
const testGlobs = [
  ["src", /\.(test|integration\.test)\.tsx?$/],
  ["e2e", /\.spec\.tsx?$/],
  ["specs/verification/journeys", /\.feature$/],
] as const;
```

DEC-0095 §4 already named one hole — `scripts/`, where
`check-contrast.ts`, `check-csp.ts` and `check-seo-budget.ts` are real
meters that run on every commit — and deliberately left it, so that widening
the scan would not move W3 in the same run that moved the requirement count.

Looking for that hole found two more. The test corpus is not three globs; it
is four runners, and every one of them is invoked by `.husky/pre-commit`,
which runs `pnpm check`:

| Runner | `include` / `testDir` | Scanned before |
| --- | --- | --- |
| Vitest, root config | `src/**/*.test.ts(x)`, **`app/**/*.test.ts`**, **`proxy.test.ts`** | `src/` only |
| Vitest, `scripts/vitest.config.mts` (`check:static-tests`) | **`scripts/**/*.test.ts`** | no |
| Playwright | `e2e/` | yes |
| Journey features | `specs/verification/journeys/**/*.feature` | yes |

**20 test files under `app/`** and **`proxy.test.ts`** were invisible to E10
although `pnpm test` has run them all along — a bigger omission than the one
DEC-0095 named, and the same kind: a scan set that repeats what a runner
already knows drifts away from it silently.

## Decision

### 1. The globs are read out of the runners

`vitestInclude()` reads `test.include` out of each Vitest config file, so the
scan follows the runner instead of paralleling it. Playwright's `testDir` is
`e2e` and the journey features are this repository's own convention; both
stay spelled, because neither is a list that can drift.

This is the move DEC-0085 §4 made for the five controlled vocabularies,
applied to the one list `check:specs` still kept a private copy of: narrowing
a runner narrows this check, rather than the two silently disagreeing.

### 2. A meter counts where `pnpm check` runs it

The `scripts/*.ts` entry points are read out of the `check` chain in
`package.json` — the chain `.husky/pre-commit` runs before every commit. A
criterion whose only meter is `scripts/check-contrast.ts` is checked on every
commit, and W3 said nothing checked it.

`check:terms` is the one `scripts/check-*.ts` that is **not** in the chain. It
is not scanned, and `TS-WEB-0026-A7` and `TS-WEB-0026-A8` — the criteria it
names — stay in W3 until something in the chain runs it. A script that exists
is not a script that runs; that distinction is the whole value of the field.
Its *test*, `scripts/check-terms.test.ts`, is scanned, because
`check:static-tests` does run it.

### 3. The 20 fit criteria that follow

`fit_criterion` is a recorded field, not a computed one, so widening the scan
does not move W7 by itself. The 20 requirements whose measure changed were
re-derived by DEC-0095's own two rules, unchanged:

- **7 move from `UNKNOWN` to a measure** — `CON-WEB-0025`, `CON-WEB-0031`,
  `FUN-WEB-0180`, `FUN-WEB-0181`, `FUN-WEB-0182`, `NFR-WEB-0058`,
  `NFR-WEB-0059`. Each is measured by exactly one criterion, and that
  criterion is run by `check-contrast.ts` (`TS-WEB-0002-A3`),
  `check-csp.ts` (`TS-WEB-0014-A1`) or an `app/` test (`TS-WEB-0007-A11`).
- **13 keep their measure and gain a referenced criterion** — the `n of m`
  in their meter moves up by one.

The re-derivation reproduced the other **253** rows byte for byte, including
all eight quality requirements whose statement is its own measure. That is
the check that this is wave 4's rule re-run on a wider input, and not a new
rule.

## Consequences

- **W3: 181 → 168.** 13 acceptance criteria are referenced by something that
  was not being read: 6 by `app/` tests, 4 by `scripts/` test suites, 3 by the
  meters themselves.
- **W7: 173/273 → 180/273.** 93 requirements carry `UNKNOWN`, down from 100.
- Neither number moved because a test was written. They moved because the
  check stopped under-reporting, which is why this is its own slice: nothing
  else in wave 5 touches either figure.
- The counts, the pyramid and `migrate-identifiers.mjs --verify` are
  unchanged. No artefact was added, removed or renumbered.
