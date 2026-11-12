# Contributing

The frontend lives in the repository root: Next.js 16 in the App Router,
TypeScript, pnpm. The previous website stays archived in `legacy-content/`
so its copy, assets and helper code remain available to look up; it is not
built and not linted.

## Before You Start

- `README.md` — repository purpose and current state.
- `AGENTS.md` — project context, specification guardrails, working rules.
- The issue you are working on, and the tactical spec it names under `specs/tactical/`.

## Branches and Pull Requests

`next-2026` is the integration branch: every change reaches it through a
pull request, and CI runs on every PR targeting it. `main` and production
belong to the owner.

1. **One issue, one branch, one worktree.** Branch off a fresh
   `origin/next-2026` as `fix/<issue>-<slug>`, `feat/<issue>-<slug>` or
   `docs/<slug>`, in a worktree of its own
   (`git worktree add ../schafe-vorm-fenster-www-<slug> -b <branch> origin/next-2026`;
   agent worktrees live under `.claude/worktrees/`, which is gitignored). The
   main checkout keeps whatever someone else has open in it.
2. **Spec check first.** Decide whether the issue stays within the spec or
   changes it; a spec change travels in the same PR as the code
   (`AGENTS.md` → Working an Issue).
3. **Green locally first.** `pnpm check` passes (the pre-commit hook runs it),
   and the e2e specs your change touches pass locally before you push.
4. **The PR** targets `next-2026`, carries `Closes #<issue>`, and says in plain
   language what changed and why, which spec artefacts it changed (or
   "within the spec"), whether it touches content, structure, design or
   tooling, what you ran to validate it, and what follow-up stays open.
5. **Merge** by squash, after bringing the branch up to date with `next-2026`
   and seeing CI green; delete the branch and remove its worktree afterwards.
   Several PRs merge in the order of their issues — the change queue in
   `.agents/roles/orchestrator.md` runs exactly this loop.

**Shared files.** Most merge conflicts here come from a short list of files
that many changes touch at once. Two open branches that both touch one of
them are worked one after the other, not side by side:

| File | Why it collides |
| --- | --- |
| `specs/decisions/README.md`, a new `DEC-####` / `Q-####` | index row and number; on rebase, take the next free number |
| `specs/verification/coverage-budget.json` | each PR rewrites the open tally; recompute it on rebase |
| `state/open.md`, `state/coverage.md` | row-numbered tables |
| `src/lib/i18n/dictionary.ts` | every page's strings |
| `content/pages/<page>/{de,en}.md`, the page's `TS-WEB-####` and `e2e/pages/<page>.spec.ts` | one page, many issues |
| `app/styles/*.css` | the token and spacing homes |

## Local Development

```bash
export GITHUB_TOKEN=$(gh auth token)      # .npmrc reads it for the GitHub scope
export LEAFCUTTER_REGISTRY_TOKEN=…        # .npmrc reads it for the STRICT scopes
pnpm install
pnpm dev                                  # http://localhost:3100
```

`.npmrc` maps three scopes: `@schafe-vorm-fenster` to GitHub Packages, and
`@leafcutter-strict` plus `@leafcutter-os` to
`https://packages.leafcutteros.ai/`, which carries the **STRICT**
specification method.

**Both registries are private, and both variables are required** (DEC-0112).
If either is unset, `pnpm` discards the **whole** `.npmrc` with
`Failed to replace env in config` and resolves every scope against
npmjs.org, so what you see is a `404` on a package that was never public.
The registry token lives in the Vercel project's environment and as an
Actions organisation secret, both named `LEAFCUTTER_REGISTRY_TOKEN`; ask
jan-henrik for a local copy rather than reading it out of a deployment.

**Port 3100 everywhere.** Port 3000 is taken on the build machine, so the
`dev` and `start` scripts, the Playwright `webServer` and every documented
URL use 3100. `pnpm stop` frees it.

| Command | What it does |
| --- | --- |
| `pnpm check` | the single gate (see below) |
| `pnpm test` | unit and integration tests (Vitest) |
| `pnpm e2e` | the full Playwright suite, starting the dev server itself |
| `pnpm e2e:technical` · `pnpm e2e:smoke` | the two CI selections (DEC-0180) |
| `pnpm build` | production build |
| `vercel deploy` | a protected, `noindex` preview deployment |

### `pnpm check` Is the Only Gate

Everything a change has to survive runs inside `pnpm check` — its chain is
the `check` script in `package.json` — and the Husky pre-commit hook runs it
on every commit. A new check is added *to* it, so that it actually runs.
Keep it fast: it is paid on every commit.

Four of its checks carry rules you meet while writing:

- **`check:specs`** — the STRICT spec guard; errors fail, warnings report.
  Its vocabularies come out of `@leafcutter-strict/library-schemas` at
  startup (DEC-0085 §4); the codes are listed at the top of
  `scripts/check-specs.ts`.
- **`check:coverage`** — every acceptance criterion against the instrument
  its own level names (TS-WEB-0017-A20/A21). VERIFIED needs the id in a
  `describe` or `test` **title**; a mention in a comment is `NAMED ONLY`.
  `tool` criteria are closed by a CI job, `manual` ones by an unexpired row
  in `specs/verification/manual-checks.md`. A criterion new in the commit
  arrives with its instrument, and the open tally in
  `specs/verification/coverage-budget.json` may only fall — a fall is
  written there in the same commit (DEC-0141).
- **`check:reviews`** — every point of a review dated from 2026-10-12 on ends
  with `Issue: #n` or `Kein Task: <why>` (DEC-0155).
- **`check:stack`** · **`check:brand`** — the stack register and the brand
  rules below.

### Writing Tests

The level is chosen by what the thing actually is, per
`specs/verification/verification-strategy.md`:

- **unit** — pure functions. `*.test.ts`, beside the code under `src/`.
- **integration** — routes, handlers, rendering. `*.integration.test.ts`.
  Next.js runs a route handler in-process, so a redirect, a status code, a
  header or a sitemap is a Vitest test, not a browser test.
- **e2e** — what genuinely crosses the browser boundary. `e2e/*.spec.ts`.

A test names the id it verifies in its title — that is what lets
`check:specs` (W3) and `check:coverage` see it:

```ts
describe("TS-WEB-0015-A1: noindex on everything that is not production", () => { … });
```

E2E viewports sample **360, 428 and 1280** (DEC-0067). Three of the six
breakpoints sit below 640px, so a suite that samples only 360 and 1280
cannot see whether the small range does anything.

### Rules That Are Checked, Not Trusted

- **Mobile first is a direction, not a feeling.** Base styles are the
  phone. Every media query is `min-width`; a `max-width` query fails the
  build. Every switch point is one of the six `breakpoint.*` token values
  of `brand-design`, read from the token at the call site.
- **One component tree.** A breakpoint may change spacing, type step, image
  aspect and column count. The order of blocks, the presence of a block and
  its wording stay the same at every width.
- **One owner per level of vertical space** (DEC-0171). A section owns its
  padding; its content stack (`[data-stack]`, `app/styles/base.css`) owns
  the gap between its blocks (`--block-gap`, `--block-gap-bound` after a
  kicker); a block brings no outer margin — neither in its own stylesheet nor
  through a `className` handed to a component. A wrapper that groups blocks
  is a stack. Every level's value per tier (16/8 px below `xl`, 24/12 px from
  `xl`, DEC-0178) is set in `app/styles/components.css` alone.
  `e2e/block-gaps.spec.ts` measures it on every route per tier;
  `check:brand` reads the `className` half (A32) and the one home of the
  tokens (A34).
- **Brand values enter through one file.** `app/styles/brand.css` imports
  the token sheet and the font faces; everything else consumes CSS custom
  properties. Logos and fonts are package subpaths, never committed files.
  `check:brand` also refuses colour and `font-family` literals outside that
  file and `ink`- or `violet`-tinted gradients — the scrim is neutral black.
- **The browser talks to this origin only.** Every ecosystem service is
  reached server-side through a route handler in `app/api/`, which is
  GET-only (`check:api-routes`), and the handler calls an interface module
  in `src/lib/live/`. A component imports no service client, a host or read
  token is read only inside `src/clients/`, and the app's hostname exists in
  exactly one file — the handover module. Tests assert all four.
- **A live module shows its data, its skeleton, its own empty state, or the
  last good answer** with a "Stand: …" label — never a spinner or an error.
  Mocked data is complete, obviously fictitious, carries `demo: true` out of
  the BFF, and has a `Mock aktiv` row in `state/open.md`.
  `src/lib/live/README.md` says which state each shell gets in which tier;
  `LIVE_DATA=mock` runs the whole layer offline.
- **Three sources, in order.** Every data operation of geo-api and
  events-api is token-scoped, so a module takes the first source that can
  answer: the token-scoped API, then the **public village calendar**
  (`src/clients/community-site/`, server-side) plus the committed community
  index, then the mock. That is why an untokened preview shows real dates;
  `GEOAPI_READ_TOKEN` and `EVENTSAPI_READ_TOKEN` move each module up to the
  authoritative source with no code change.
- **A test organizer's dates are never shown** (DEC-0173 §3). Set
  `MATEO_TEST_USER_IDS` (comma-separated organizer ids) to the value the
  village calendar (`community-site`) uses; both adapters drop those
  organizers' events (`src/lib/live/test-organizers.ts`), and unset means no
  filter. The ids live in the environment only. The Portalize widget filters
  in its own backend with the same variable.
- **Every page is static, and a request value is read in the browser**
  (DEC-0163). The CSP carries build-time hashes of each page's inline scripts
  (`scripts/csp-adapter.mjs`), so a page's HTML is fixed at build: no page
  reads `searchParams`, `cookies()` or `headers()`, and the only `cacheLife`
  is the never-revalidating `max`. Live data loads after hydration from
  `/api/*` through `src/lib/live/browser.ts`; `?ort=` and flow steps come
  from `src/lib/pages/query-store.tsx`. `dynamic`, `dynamicParams`,
  `revalidate`, `fetchCache`, a revalidating page, and a bare `new Date()` or
  `Math.random()` in a prerendered path are build errors.
- **A live frame reserves its final geometry.** Its prerendered skeleton
  holds the rows it may print at the two-line row height
  (`--height-event-row-tall`), the "Stand: …" line and the counter pills, so
  nothing below it moves when the answer lands
  (`e2e/layout-stability.spec.ts`). Without JavaScript a page is its stage-0
  state with those skeletons in place (DEC-0163). The nearby list, below the
  fold, reserves for its skeleton only (`reserve="loading"`,
  `TS-WEB-0008-A19`, issue #83).
- **One component decides whether a link opens a new tab** (DEC-0169).
  `src/components/anchor/` reads the target off the href: another origin
  gets `target="_blank"`, `rel="noopener noreferrer"` and a hidden "öffnet
  neuen Tab" joined by `aria-describedby`; `tel:`, `mailto:` and site links
  stay. A raw `<a>` carries only a target that provably stays on the site,
  and only that component writes `target` or `rel`
  (`scripts/external-links.test.ts`, TS-WEB-0016-A25);
  `e2e/external-links.spec.ts` sweeps every route (A24).
- **A new dependency needs an ADR.** Look sideways at the sibling repos
  first (`../classification-api`, `../events-api`, `../geo-api`,
  `../community-calendar`, `../envoy-api`), run `supply-chain-risk-auditor`,
  decide, and write the decision into `specs/decisions/`. Pin the version
  exactly. A runtime dependency is also registered in `stack.allow.json` with
  its reason; a devDependency gets the decision and the pin only, since
  `check:stack` reads `dependencies`.

## Deployments

Preview only. `vercel deploy` produces a protected, `noindex` preview, and
Vercel's Git integration deploys one for every push. Production — `--prod`,
promotion, production environment variables, production domains — is the
owner's.

## Continuous Integration

- `.github/workflows/check.yml` — `pnpm check` · `pnpm build` ·
  `pnpm e2e:technical` (smoke, CSP and hydration, routes, external links,
  layout stability, axe, third-party requests, against the production build)
  on every push to `next-2026` and every PR targeting it.
- `.github/workflows/preview-e2e.yml` — `pnpm e2e:smoke` against the Vercel
  preview once GitHub's `deployment_status` reports it ready, past
  Deployment Protection via the `VERCEL_AUTOMATION_BYPASS_SECRET` repository
  secret.
- `.github/workflows/full-e2e.yml` — the **full suite** (`pnpm e2e`, incl.
  `e2e/pages/*` and the design and rule guards), on demand only:
  `gh workflow run "Full E2E" --ref next-2026` (DEC-0180).

This is the M4 prototype subset of TS-WEB-0015
(`specs/tactical/TS-WEB-0015--delivery-pipeline.tactical.md`); `README.md`'s
Continuous Integration section and each workflow's header comment say what is
in it. Follow a PR's checks with `gh pr checks <n> --watch`, a run with
`gh run watch <id>`.

## Content Tooling

- `pnpm env:pull` syncs `.env.local` from the linked Vercel project; put
  `GOOGLEAPI_CLIENT_EMAIL` and `GOOGLEAPI_PRIVATE_KEY` into it for the
  legal-content import.
- `pnpm import:legal-content:dry-run` validates `content/legal/import.yaml`
  and the current targets; `pnpm import:legal-content` refreshes the
  normalized legal files in `content/legal/`.
- `pnpm build:place-index` rebuilds `src/generated/snapshots/communities.json`
  — the covered-community index behind the place search's name lookup and
  the ~15 km proximity cut. It needs no credential (the public village
  calendar publishes the list), and the result is committed like the tier-3
  snapshots.

## Working With Legacy Content

- `legacy-content/` is an archive, not the active app; its files stay as they are.
- Content extracted from it into a new structure says so in the change, and
  legal texts, imported content and static assets stay traceable to their
  archived source.
- New toolchains, runtimes and working conventions are documented here and in
  `README.md` in the same change.
