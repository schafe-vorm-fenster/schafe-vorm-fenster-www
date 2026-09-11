---
id: DEC-072
title: The foundation stack follows the sibling repositories — with three deliberate deviations
status: accepted
date: 2026-09-11
decided_by: run-m1-developer
---

## Context

M1 turns a specification-only repository into a Next.js application, and that
means choosing a test runner, a lint setup, an e2e tool, a CSS technique and an
icon package in one sitting. TS-017 D1 forbids a second rendering framework and
demands a reason per runtime dependency; the stack-harmony rule
(`plan/guardrails.md`) demands that the reason look sideways first.

The sideways evidence, read off `package.json` in the five sibling
repositories on 2026-09-11:

| Concern | classification-api | events-api | geo-api | community-calendar | envoy-api |
| --- | --- | --- | --- | --- | --- |
| framework | next 16.1.6 | next 16.1.1 | next 16.1.6 | (workspace) | next latest |
| test runner | vitest 4 | vitest 4 | vitest 3 | vitest | vitest 4 |
| coverage | `@vitest/coverage-v8` | same | same | same | same |
| e2e | `@playwright/test` 1.58 | 1.58 | 1.58 | (turbo e2e) | 1.59 |
| lint | eslint 9 + `eslint-config-next` | same | same | eslint 9 + shared config | eslint 9 + shared config |
| path aliases in tests | `vite-tsconfig-paths` | same | same | — | same |
| dead code / duplication | knip + jscpd | knip | knip | knip | knip + jscpd |
| package manager | pnpm 10 | pnpm 10 | pnpm 10 | pnpm 10 | pnpm 10 |

The family is uniform. Nothing here is a close call.

## Decision

**The website adopts the family stack**: Next.js App Router on pnpm 10,
Vitest 4 with `@vitest/coverage-v8` for unit and integration, Playwright for
e2e, ESLint 9 with `eslint-config-next`, TypeScript 5.9. DEC-002's rule that a
sibling pattern is adopted as *intent* and not as ported code is honoured:
what carries over is the tool choice and the script names, not a line of their
implementation.

Every runtime dependency is registered in `stack.allow.json` with its reason,
and `pnpm check:stack` fails a dependency that is not registered — and a
register entry that is no longer a dependency.

Three deviations, each on purpose:

1. **No `vite-tsconfig-paths`.** Vite now resolves `tsconfig` path aliases
   natively and prints a deprecation notice when the plugin is present. The
   website uses `resolve.tsconfigPaths: true` and carries one dependency
   fewer. The siblings will meet the same notice on their next Vite major.

2. **No Tailwind, no component library — plain CSS and CSS Modules.** TS-017
   leaves the CSS technique [FREE], and the brand package ships both a token
   stylesheet and a Tailwind theme fragment, so either was available. Plain
   CSS wins on the two rules that are *not* free: TS-017-A4 asks that every
   `min-width` in the generated CSS be a `breakpoint.*` token value, and
   TS-017-A5 that no colour or `font-family` literal exist outside one file.
   Both are a grep away when the authored CSS *is* the generated CSS, and both
   become an inference problem through a utility compiler. A design system
   this specific also spends most of a utility framework's value before the
   first component.

3. **TypeScript 5.9.3, not the 6.x the registry offers.** The siblings are on
   5.9, `eslint-config-next` is built against it, and a major TypeScript
   upgrade is not an M1 decision. (The repository's `typescript: latest`
   resolved to 6.0.3 and broke the type-check before it ran once.)

**Versions are pinned exactly.** Nine dependencies carried `latest`, which
makes a lockfile a suggestion and a build unreproducible. Every one is now an
exact version.

**Lucide is the icon set** (TS-017 D7, DEC-056), as `lucide-react`.
`check:stack` asserts that it is the *only* icon dependency, so a second
family cannot enter by habit.

## Supply-chain audit

Run before this decision, per the guardrail. `pnpm audit --prod` over the
runtime tree: **no known vulnerabilities**. No focus package carries an
advisory at its pinned version; none has an abandoned upstream; no dependency
in the tree executes an install-time script that pnpm did not block (only
`esbuild` and `unrs-resolver` declare one, and both are blocked).

Two findings were acted on: `js-yaml` moved 4.1.1 → 4.3.2, which clears three
high advisories on a direct devDependency.

Two are recorded rather than fixed, both dev-only and both outside the shipped
bundle: the `vercel` CLI drags in vulnerable `tar` and `undici`, and
`eslint-config-next`'s import plugin reaches `brace-expansion` through
`minimatch@3`. Neither has a fix available that does not mean downgrading the
tool that needs it. They go on `state/open.md` because TS-014 D12 will gate
`pnpm audit --audit-level=high` in CI and will find them there.

Notes worth keeping: `zod` and `lucide-react` each publish from a single
account, and the `@fontsource` packages are low-volume. None is disqualifying;
all are the ordinary shape of a small npm package.

## Three things the first deploy forced

The preview chain did not come up on the first try, and each failure was a
pre-existing defect rather than a consequence of this decision. Recorded here
because each one changed a file:

1. **The Vercel project still ran `yarn install` and `yarn build`**, left over
   from the legacy website. A `vercel.json` with `installCommand` and
   `buildCommand` overrides it in-repo, where it is reviewable — better than a
   dashboard setting regardless. The file carries **no `headers` block**: TS-014
   D4 forbids one, because it would silently take precedence over both
   `next.config.ts` and `proxy.ts`.

2. **Two hub packages are gone from the registry.**
   `@schafe-vorm-fenster/cli` and `@schafe-vorm-fenster/config-engineering`
   answer 404 at every version. A warm local pnpm store hid it; a clean install
   anywhere fails. Both are removed from `devDependencies` — nothing imports
   them.

3. **`CLAUDE.md` and `GEMINI.md` pointed at an absolute path.** As symlinks to
   `/Users/…/AGENTS.md` they dangle on every machine but one, and Next 16's
   agent-file writer `stat`s `CLAUDE.md` and failed the build with `ENOENT`.
   Both are relative symlinks now — same meaning, resolves everywhere.

## Consequences

- `pnpm check` is the single gate and grew two checks: `check:stack`
  (TS-017-A1, A2, A7, A17) and `check:brand` (TS-017-A4, A5, A6). Both are
  scripts, not conventions, so the rules fail in CI rather than in review.
- The deny-set in `stack.allow.json` is [PROPOSED] — no source enumerates
  forbidden frameworks (TS-017 D1 says so itself). It is changed by a
  decision, not by a commit.
- `knip` and `jscpd` are *not* adopted yet. They belong to the `Quality` job
  of TS-015 D4, which is stage-2 pipeline work; adopting the tools before the
  job that runs them would be scope the plan does not ask for.
