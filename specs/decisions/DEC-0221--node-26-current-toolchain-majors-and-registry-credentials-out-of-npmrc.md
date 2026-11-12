---
id: DEC-0221
title: Node 26 everywhere, the toolchain on current majors, and the registry credentials out of the committed .npmrc
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel (Node 26) · run/developer (#203 tooling)
---

## Context

Issue #203 (owner, 12 Nov 2026) asks for every dependency on its current
release, Next.js and Tailwind first, and for Node 26 if Vercel and the
toolchain carry it.

The starting point, read on 12 Nov 2026:

- **Node was split three ways.** The Vercel project built on 22.x (dashboard
  setting, `state/open.md` row 174), `.nvmrc` and CI said 24, and
  `package.json` had no `engines`.
- **`pnpm audit`**: 5 critical, 58 high. Three criticals sat in `next` 16.3.4
  itself (GHSA-vcvr-r3jv-pc5j, GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr); the
  rest in dev tooling, most of it inside the `vercel` CLI.
- **`pnpm outdated`**: 31 packages, eight of them a major behind.
- **Tailwind is not a dependency.** DEC-0072 deviation 2 chose plain CSS and
  CSS Modules; there is nothing to update.

DEC-0072 pinned the test, lint and type tooling to what the sibling
repositories ran in September (Vitest 4, ESLint 9, TypeScript 5.9). The
siblings still do. This record moves the website ahead of them and says why.

## Decision

### 1. Node 26, one major everywhere

Vercel offers 26.x and makes it the default for new projects
(vercel.com/docs/functions/runtimes/node-js/node-js-versions). Next 16.4
(`>=20.9.0`), Vitest 5 (`^22.12.0 || ^24.0.0 || >=26.0.0`), Playwright 1.65
(`>=20`) and ESLint 10 (`v24+`) all accept it. The owner chose 26.

- `package.json` `engines.node` is `26.x`. Vercel reads it ahead of the
  project setting, so the build and the functions run 26 from the first
  deployment of this change, whatever the dashboard says.
- `.nvmrc` is `26`; all three workflows read it (`node-version-file`), and a
  working copy reads it through fnm or nvm.
- `@types/node` follows to 26.

On Node 26 Vercel Functions negotiate HTTP/2 in the built-in `fetch`, where
`response.statusText` is empty. The only `statusText` read in the repository is
an error message in `scripts/fetch-openapi.mjs`, a local script; no runtime
code depends on it, so `VERCEL_FETCH_DISABLE_H2` is not set.

### 2. Registry credentials leave the committed `.npmrc`

pnpm 10.34.2 closed GHSA-3qhv-2rgh-x77r: it no longer expands `${VAR}` in a
repository-controlled `.npmrc`, because a hostile repository could send the
variable to a registry of its choosing. The two token lines DEC-0112 §1 put
there are ignored from that version on, and a cold install then fails on both
private scopes.

The repository moves to pnpm 10.34.9 and the token lines move to the
**user-level** config, which pnpm still expands:

- `.npmrc` keeps the three scope-to-registry lines and no credential.
- `scripts/registry-auth.sh` writes
  `//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}` and
  `//packages.leafcutteros.ai/:_authToken=${LEAFCUTTER_REGISTRY_TOKEN}` into
  the user config with `pnpm config set --location=user`, **as
  placeholders**: no token value is written to disk or to a log.
- It fails when either variable is unset, naming the variable. That keeps
  DEC-0112 §2's "fails loudly" and replaces its symptom (a misleading `404`
  from npmjs.org) with a direct message.
- CI runs the script before `pnpm install`; `vercel.json`'s `installCommand`
  runs it before `pnpm install --frozen-lockfile`.

DEC-0112 §2 rejected "writing the token into `~/.npmrc` from an install
command" because it would put a credential within a build log's reach and hide
the dependency. Neither applies to a placeholder written by a script in the
repository: the value never leaves the environment, and the dependency is
declared in a file named for it. DEC-0112 §1 and §2 are amended by this
section.

pnpm 11 and 12 are not taken: TS-WEB-0015 D11 fixes pnpm 10.x for CI, and the
family (DEC-0072) is on 10.

### 3. Every update taken, majors one by one

| Package | Before | After | Migration |
| --- | --- | --- | --- |
| `next`, `eslint-config-next` | 16.3.4 | 16.4.6 | minor; clears the three critical Next advisories. The 16.x upgrade guide in `node_modules/next/dist/docs` lists no removed flag this config sets |
| `react`, `react-dom` | 19.2.8 | 19.3.1 | minor |
| `zod` | 4.4.3 | 4.6.7 | minor; clears the `zod <4.6.6` advisory |
| `@playwright/test` · `@axe-core/playwright` | 1.63.0 · 4.13.0 | 1.65.0 · 4.14.0 | minor |
| `lucide-react` · `@vercel/functions` · `ai` · `tsx` · `sharp` | | 1.72.0 · 3.11.2 · 7.0.170 · 4.23.15 · 0.35.5 | minor/patch; `tsx` 4.23 also drops the `module.register()` deprecation Node 26 prints |
| `vercel` | 53.4.0 | 65.15.0 | major, dev CLI; the flags the repository uses are unchanged |
| `js-yaml` | 4.3.2 | 5.5.0 | major: no default export (namespace imports), `quotingType` → `quoteStyle`, own types (`@types/js-yaml` removed), `load` defaults to CORE_SCHEMA. All 831 frontmatter blocks and YAML files parsed identically except that date-only scalars load as strings, and all of those sit in `specs/` and `concept/` frontmatter that no code reads as a `Date` |
| `dotenv` · `googleapis` | 17.4.2 · 171.4.0 | 18.0.10 · 189.0.0 | majors, script-only; `config()` unchanged, the legacy import script type-checks and its dry run passes |
| `vitest`, `@vitest/coverage-v8` | 4.1.11 | 5.1.0 | major: Vite becomes a peer (declared, `vite` 8.3.8); `clearMocks` defaults to true, and no suite depended on cross-test call history |
| `eslint` | 9.39.5 | 10.14.0 | major: flat config already, one root config, no `eslint-env` comments; `eslint-config-next` ≥ 16.4.0 supports 10. Lint output is identical |
| `typescript` | 5.9.3 | 6.0.3 | major: no deprecated option is set, and the changed defaults are all stated explicitly in `tsconfig.json`; type-check passes unchanged |
| `@types/node` | 25.9.6 | 26.6.6 | follows Node |

The GitHub Actions move with them: `checkout` v7, `pnpm/action-setup` v6,
`setup-node` v7, `cache` v6, `upload-artifact` v7 — all on the Node 24 action
runtime, none with an input this repository uses changed.

### 4. What stays behind, and why

- **TypeScript 7.0.2.** It ships no JavaScript compiler API. Next 16.4 could
  build with it (`useTypeScriptCli`), but typescript-eslint 8.70, which
  `eslint-config-next` brings, declares `typescript >=4.8.4 <6.1.0`. 6.0 is
  the bridge release and the last one lint can parse.
- **`@leafcutter-strict/library-schemas` 0.4.1 (latest 8.0.0).** It is the
  contract `check:specs` reads, and DEC-0085, DEC-0086, DEC-0090 and DEC-0100
  cite it at 0.4.1. Eight majors are a method migration with its own record.
- **The eight `@schafe-vorm-fenster` content packages.** Page provenance cites
  their exact versions; `check:content` fails 192 references on a bump. A bump
  is a content round, not a tooling one (`state/open.md` row 296).
- **pnpm 11 and 12** (§2).

### 5. The remaining audit findings get same-major overrides

`pnpm.overrides` lifts each vulnerable range to the first patched release
**within the same major**, so no consumer sees an API change: `tar` 7,
`undici` 6 and 7, `brace-expansion` 1 and 5, `js-yaml` 4, `minimatch` 10,
`path-to-regexp` 8, `smol-toml` 1, `source-map-js` 1, `zod` 4.

After: **0 critical, 12 high**, all inside `vercel@65.15.0` (`undici` 5,
`@fastify/busboy` 2, `zod` 3), each patched only in the next major of its
package. `pnpm audit --prod` is clean.

`eslint-plugin-import`, `-jsx-a11y` and `-react` still declare `eslint <=9` as
a peer. All three load and report under ESLint 10, so
`pnpm.peerDependencyRules.allowedVersions` accepts 10 for exactly those three.

## Consequences

- Owner task, after the merge: the Vercel dashboard gets Node.js Version
  **26.x**, and Install and Build Command are cleared to the framework
  default (or set to the `vercel.json` values). `engines` already wins, so the
  dashboard change only removes a misleading display (`state/open.md`
  row 174).
- A working copy runs `sh scripts/registry-auth.sh` once, with both variables
  exported (`CONTRIBUTING.md`).
- DEC-0072's version line (Vitest 4, ESLint 9, TypeScript 5.9) is superseded
  by §3; its tool choices stand. DEC-0112 §1 and §2 are amended by §2.
- `TS-WEB-0017`'s method-registry row names the script instead of the
  `.npmrc` line. `TS-WEB-0015` D11 (Node from `.nvmrc`, pnpm 10.x) holds as
  written.
- No requirement, acceptance criterion or coverage figure changes.
- `DEC-0221` was reserved for this issue by the orchestrator.
