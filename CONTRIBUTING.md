# Contributing

This repository is being prepared for a full rebuild of the official Schafe vorm Fenster website.

The frontend stack lives in the repository root: Next.js 16 in the App Router, TypeScript, pnpm. The previous website stays archived in `legacy-content/` so content and assets remain available during the rebuild; it is not built and not linted.

## Before You Start

- Read `README.md` for the repository purpose and current state.
- Read `AGENTS.md` for project context and working rules.
- Use `legacy-content/` as the source of truth for old website copy, assets, and helper code.

## Current Contribution Scope

Useful contributions right now include:

- documenting requirements for the new website
- reviewing, organizing, or extracting legacy content
- proposing information architecture, navigation, or content structure
- building pages and components against the tactical specs
- improving repository documentation and contributor workflow

## Development Basics

- Keep changes focused and easy to review.
- Avoid reintroducing parts of the old application into the repository root unless the change explicitly requires it.
- If you add a new toolchain or runtime, document setup and local development commands in `README.md`.
- If you add new working conventions, record them in this file.

## Working With Legacy Content

- Treat `legacy-content/` as an archive, not as the active app.
- Preserve original files when they still provide useful context.
- If you extract content from the archive into a new structure, make the migration explicit in your change.
- Keep legal texts, imported content, and static assets traceable to their archived source.

## Pull Request Expectations

- Explain the purpose of the change in plain language.
- Call out whether the change affects content, structure, design, or tooling.
- Mention any follow-up work that is still needed.
- Include validation details when commands or checks exist.

## Local Development

```bash
export GITHUB_TOKEN=$(gh auth token)      # .npmrc reads it for the GitHub scope
export LEAFCUTTER_REGISTRY_TOKEN=…        # .npmrc reads it for the STRICT scopes
pnpm install
pnpm dev                                  # http://localhost:3100
```

`.npmrc` maps three scopes: `@schafe-vorm-fenster` to GitHub Packages, and
`@leafcutter-strict` plus `@leafcutter-os` to
`https://packages.leafcutteros.ai/`. The second registry carries the **STRICT**
specification method — a devDependency with a version since DEC-0085, not a
path on one machine.

**Both registries are private, and both variables are required** (DEC-0112).
`pnpm` has no default-value syntax here: if either variable is unset it
discards the **whole** `.npmrc` with `Failed to replace env in config` and
resolves every scope against npmjs.org, so the error you see is a `404` on a
package that was never public. Set both before installing. The registry token
lives in the Vercel project's environment and as an Actions organisation
secret, both named `LEAFCUTTER_REGISTRY_TOKEN`; ask jan-henrik for a local
copy rather than reading it out of a deployment.

**Port 3100 everywhere.** Port 3000 is taken on the build machine, so the
`dev` and `start` scripts, the Playwright `webServer` and every documented
URL use 3100. `pnpm stop` frees it.

| Command | What it does |
| --- | --- |
| `pnpm check` | the single gate: frontmatter · specs · stack · brand · typecheck · lint · tests |
| `pnpm test` | unit and integration tests (Vitest) |
| `pnpm e2e` | end-to-end tests (Playwright), starting the dev server itself |
| `pnpm build` | production build |
| `vercel deploy` | a protected, `noindex` preview deployment |

### `pnpm check` Is the Only Gate

Everything a change has to survive runs inside `pnpm check`, and the Husky
pre-commit hook runs it on every commit. A new check is added *to* it,
never run beside it — a check nobody runs is not a check. Keep it fast: it
is paid on every commit, and today it costs about three seconds.

It currently runs, in order:

1. `check:frontmatter` — content frontmatter against its schema
2. `check:specs` — the STRICT spec guard (E1–E13 fail, W1–W3 report). Five
   of its vocabularies — the `S0–S3` ladder, the requirement and tactical
   status sets, the four tactical `kind` values and the source trust levels
   — are read out of `@leafcutter-strict/library-schemas` at startup rather
   than repeated in the script (DEC-0085 §4)
3. `check:stack` — TS-WEB-0017-A1/A2/A7/A17: every runtime dependency registered
   in `stack.allow.json`, one lockfile, the brand package pinned exact, one
   icon set, and `.npmrc` mapping both the hub scope and the method scope
4. `check:brand` — TS-WEB-0017-A4/A5/A6: no `max-width` media query, every
   `min-width` a breakpoint token, no colour or `font-family` literal
   outside `app/styles/brand.css`, no brand asset committed here
5. `typecheck` · `lint` · `test`

### Writing Tests

The level is chosen by what the thing actually is, per
`specs/verification/verification-strategy.md`:

- **unit** — pure functions. `*.test.ts`, beside the code under `src/`.
- **integration** — routes, handlers, rendering. `*.integration.test.ts`.
  Next.js runs a route handler in-process, so a redirect, a status code, a
  header or a sitemap is a Vitest test, not a browser test.
- **e2e** — what genuinely crosses the browser boundary. `e2e/*.spec.ts`.

A test names the id it verifies in its title:

```ts
describe("TS-WEB-0015-A1: noindex on everything that is not production", () => { … });
```

That single convention is what lets `pnpm check:specs` report which
acceptance criteria still have no test (W3).

E2E viewports sample **360, 428 and 1280** (DEC-0067). Three of the six
breakpoints sit below 640px, so a suite that samples only 360 and 1280
cannot see whether the small range does anything.

### Rules That Are Checked, Not Trusted

- **Mobile first is a direction, not a feeling.** Base styles are the
  phone. Every media query is `min-width`; a `max-width` query fails the
  build. Every switch point is one of the six `breakpoint.*` token values
  of `brand-design` — never a literal at a call site.
- **One component tree.** A breakpoint may change spacing, type step, image
  aspect and column count. It may never change the order of blocks, the
  presence of a block, or its wording.
- **Brand values enter through one file.** `app/styles/brand.css` imports
  the token sheet and the font faces; everything else consumes CSS custom
  properties. No logo and no font file is committed here — they are package
  subpaths.
- **The browser talks to this origin only.** Every ecosystem service is
  reached server-side through a route handler in `app/api/`, which is
  GET-only (`pnpm check:api-routes`), and the handler calls an interface
  module in `src/lib/live/`. A component never imports a service client, a
  host or read token is read only inside `src/clients/`, and the app's
  hostname exists in exactly one file — the handover module. All four are
  asserted by tests, not by review.
- **A live module never shows a spinner or an error.** It shows its data,
  its skeleton, its own empty state, or the last good answer with a
  "Stand: …" label. Mocked data is complete, obviously fictitious, carries
  `demo: true` out of the BFF, and has a `Mock aktiv` row in
  `state/open.md`. `src/lib/live/README.md` says which state each shell
  gets in which tier; `LIVE_DATA=mock` runs the whole layer offline.
- **Three sources, in order, and two of them need no credential.** Every
  data operation of geo-api and events-api is token-scoped, so a module
  takes the first source that can answer it: the token-scoped API, then the
  **public village calendar** (`src/clients/community-site/`, read
  server-side) plus the committed community index, then the mock. That is
  what makes an untokened preview show real dates.
  `GEOAPI_READ_TOKEN` and `EVENTSAPI_READ_TOKEN` move each module up to the
  authoritative source with no code change.
- **A request value is read outside every cache boundary.** Cache Components
  is on (`cacheComponents: true`), so a page is a prerendered shell plus
  cached islands: `use cache` with a `cacheLife` from
  `src/lib/live/cache-profiles.ts` and a `cacheTag`, and `?ort=`, `cookies()`
  or `headers()` read in the page — never inside a cached scope — and handed
  down as a plain string prop, which is also what makes the prop the cache
  key. `dynamic`, `dynamicParams`, `revalidate` and `fetchCache` are build
  errors; so is a bare `new Date()` or `Math.random()` in a prerendered path.
  A route that cannot be split says so with `export const instant = false`
  and a reason, and gets a `state/open.md` row. `next build
  --debug-prerender` is the check that catches what a normal build tolerates.
- **A `<Suspense>` fallback may not suspend.** It is the static shell's
  content, so it has to be synchronous — a skeleton, or nothing. An async
  component in a fallback leaves *both* trees in the DOM (measured), and a
  skeleton a JS-less visitor never gets past is what TS-WEB-0020-A10 forbids by
  name. Where a page must be complete without JavaScript, read the request
  value in the page and let the route block.
- **A new dependency needs an ADR.** Look sideways at the sibling repos
  first (`../classification-api`, `../events-api`, `../geo-api`,
  `../community-calendar`, `../envoy-api`), decide, write the decision into
  `specs/decisions/`, register the runtime dependency in `stack.allow.json`
  with its reason. Pin the version exactly. A devDependency gets the
  decision and the exact pin but no register entry — the register is the
  runtime list, and `check:stack` reads `dependencies` only.

### Deployments

Preview only. `vercel deploy` produces a protected, `noindex` preview.
Production — `--prod`, promotion, production environment variables,
production domains — is out of scope for everyone working in this
repository right now.

### Continuous Integration

`.github/workflows/check.yml` runs `pnpm check` · `pnpm build` · `pnpm e2e`
(against the production build) on every push to `next-2026` and every pull
request targeting it. `.github/workflows/preview-e2e.yml` runs the same
e2e suite again against the Vercel preview that Vercel's Git integration
deploys for that push, once GitHub's `deployment_status` event reports it
ready, past Vercel Deployment Protection via the
`VERCEL_AUTOMATION_BYPASS_SECRET` repository secret. Both are the M4
prototype subset of TS-WEB-0015 (`specs/tactical/TS-WEB-0015--delivery-pipeline.tactical.md`)
— see `README.md`'s Continuous Integration section for what is and is not
in this slice, and each workflow file's header comment for the detail.

Watch a run in the **Actions** tab, or `gh run list` / `gh run watch <id>`.

## Content Tooling

The legal-content import from Google Workspace is unchanged:

- `pnpm env:pull` syncs `.env.local` from the linked Vercel project.
- Put `GOOGLEAPI_CLIENT_EMAIL` and `GOOGLEAPI_PRIVATE_KEY` into `.env.local`.
- `pnpm import:legal-content:dry-run` validates `content/legal/import.yaml`
  and the current targets before a real import.
- `pnpm import:legal-content` refreshes the normalized legal files in
  `content/legal/`.

`pnpm build:place-index` rebuilds `src/generated/snapshots/communities.json`
— the covered-community index the place search's name lookup and the ~15 km
proximity cut read. It needs no credential (the public village calendar
publishes the list) and the result is committed, the same way the tier-3
snapshots are.
