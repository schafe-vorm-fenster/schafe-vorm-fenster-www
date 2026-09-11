# Schafe vorm Fenster Website

This repository is the home of the relaunch of the official Schafe vorm
Fenster website.

The website is being rebuilt from scratch. Everything currently in this
repository predates the relaunch and is archive material, not a
specification and not a starting point.

## The Relaunch Runs in Three Phases

**1 — Concept · done.** The binding concept lives in `go-to-market-os`:
communication principles, relevance model, and information architecture.
See [`concept/README.md`](concept/README.md) for the links. The clickable
prototype for those documents is in [`concept/v1.0/`](concept/v1.0/).

**2 — Specification · current phase.** Specs are derived from the concept
documents, the information architecture, and the wireframes, and are
written to [`specs/`](specs/). This is where the work happens right now.

**3 — Content · after the specs.** Page copy and content are produced once
the specs exist, not before. `go-to-market-os` is the single source of
truth for content
([ADR-001](https://github.com/schafe-vorm-fenster/go-to-market-os/blob/main/handbook/decisions/001-content-source-of-truth.adr.md)).

**4 — Realisierung.** The implementation runs as a one-shot multi-agent
run against the specs. The operating manual lives in
[`plan/README.md`](plan/README.md) (milestones, quality gates, process,
guardrails); roles and playbooks in [`.agents/`](.agents/); run state in
`state/`, protocols in `reports/`. Start with `pnpm preflight`.

The order is deliberate. Writing content before the specification produces
copy with nowhere to live, and a specification bent around copy that
already exists.

## The Application

The website is a Next.js 16 application in the App Router, server-first,
deployed to Vercel. TypeScript throughout, pnpm as the package manager,
plain CSS and CSS Modules over the `@schafe-vorm-fenster/brand-design`
tokens. `specs/decisions/072-the-foundation-stack.md` records why each of
those is what it is.

### Getting Started

```bash
pnpm install            # the @schafe-vorm-fenster scope needs GITHUB_TOKEN
pnpm dev                # http://localhost:3100
```

**Port 3100, not 3000.** Port 3000 is occupied on the build machine, so the
whole run uses 3100 — the `dev` and `start` scripts, the Playwright
`webServer`, and every URL in the documentation.

`pnpm install` resolves `@schafe-vorm-fenster/*` from GitHub Packages via
`.npmrc`, which reads `${GITHUB_TOKEN}`. If your shell does not export one,
`export GITHUB_TOKEN=$(gh auth token)` before installing.

### Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | development server on port 3100 |
| `pnpm build` | production build |
| `pnpm check` | **the single gate** — frontmatter · content · specs · stack · brand · typecheck · lint · unit and integration tests. The pre-commit hook runs it on every commit, so it stays in the seconds (7.7 s measured at M3, `check:content` 0.3 s of it). A new check is added *to* it, never run beside it. |
| `pnpm test` | unit and integration tests (Vitest) |
| `pnpm test:watch` | the same, watching |
| `pnpm e2e` | end-to-end tests (Playwright); starts the dev server itself |
| `pnpm typecheck` | `tsc --noEmit` against the strict root config |
| `pnpm lint` | ESLint |
| `pnpm stop` | kill whatever holds port 3100 |

`pnpm e2e` runs against `http://localhost:3100` by default. Point it at a
deployment instead with `E2E_BASE_URL`, and past Vercel Deployment
Protection with `VERCEL_AUTOMATION_BYPASS_SECRET` — the suite sends it as
`x-vercel-protection-bypass`. Protection is never disabled to run a test.

### Where Things Live

| Path | What |
| --- | --- |
| `app/` | routes, layouts and the app-router tree |
| `app/styles/brand.css` | **the single token-import file** — the only place a brand value enters. No colour literal and no `font-family` literal exists anywhere else, and `pnpm check:brand` fails one that does. |
| `app/styles/base.css` | the mobile-first shell: phone base, `min-width` queries only, the six `breakpoint.*` token values |
| `proxy.ts` | the CSP, the HSTS variance and the `X-Robots-Tag`, on every response |
| `src/lib/security/` | the policy as one typed structure, in one module |
| `src/lib/seo/` | the indexability predicate and the robots surface |
| `src/lib/content/` | **the content pipeline** (TS-007): `loadPage(routeId, locale)` gives a page its typed slots — provenance, `Demo-Daten` marking and all — out of `content/pages/<route>/<locale>.md`. Request time reads the local tree only; the hub-package adapter beside it is build-time. `src/lib/content/README.md` has the call example |
| `content/pages/` | the page artifacts the pipeline reads: one file per page per locale, one section per slot, provenance per slot. Written by the content playbook, validated by `pnpm check:content` |
| `e2e/` | Playwright specs |
| `stack.allow.json` | the register of every runtime dependency with its reason |
| `vercel.json` | install and build command only — **never a `headers` block**, which would silently outrank `next.config.ts` and `proxy.ts` |
| `scripts/check-*.ts` | the static checks `pnpm check` runs |

Unit tests sit beside the code as `*.test.ts`, integration tests as
`*.integration.test.ts`. A test names the spec id it verifies in its
`describe` title — `describe("TS-015-A1: …")` — which is how
`pnpm check:specs` reads coverage off the suite.

### Deploying

Preview only. `vercel deploy` from the repository root deploys the current
working tree to a protected, `noindex` preview. **Production is nobody's
job in this run** — no `--prod`, no promotion, no production environment
variables.

### Continuous Integration

`.github/workflows/` carries the M4 minimal-CI slice of
`specs/tactical/delivery-pipeline.tactical.md` (TS-015) — a prototype
subset of DEC-031's stage 2, not the full merge-gating job graph:

- **`check.yml`** — every push to `next-2026` and every pull request
  targeting it: install (the `@schafe-vorm-fenster` scope resolves from
  `npm.pkg.github.com` using `secrets.GITHUB_TOKEN` with `packages: read`)
  · `pnpm check` · `pnpm build` · `pnpm e2e` against the production build
  (`next start`, not `next dev` — see `playwright.config.ts`), with
  Playwright's Chromium browser cached between runs.
- **`preview-e2e.yml`** — the TS-015 preview smoke. Vercel's Git
  integration deploys every push to `next-2026` automatically (confirmed via
  `vercel ls` / the deployments API: `source: git`, matching commit SHAs);
  this workflow reacts to the resulting `deployment_status` event and runs
  the same Playwright suite against `environment_url`, authenticating past
  Vercel Deployment Protection with the `VERCEL_AUTOMATION_BYPASS_SECRET`
  repository secret (`x-vercel-protection-bypass`, TS-015 D3/D10).

See a run: the repository's **Actions** tab, or `gh run list` /
`gh run watch <id>` (`gh auth switch --user schafevormfenster` first — a
different GitHub account is used for this repository, per
`~/.claude/memory/gh-account-per-directory.md`).

Not shipped in M4, on purpose: the `Quality` job (knip/jscpd/security),
`Preview-Deployment` as its own gate, `Budgets` (Lighthouse/bundle/axe),
`auto-merge*.yml`, branch protection, and the production canary/rollback
pipeline (`deploy.yml`). These are DEC-031 stage-2 work for after the
prototype — TS-015-A3–A5/A9/A10/A12's current status (pass / not-yet, with
the reason) is recorded in this work package's completion report and in
`state/open.md`.

### The MCP Endpoint

The running dev server exposes Next.js devtools over MCP (`.mcp.json`).
Requests to it need both content types in the header, or it answers 406:

```
Accept: application/json, text/event-stream
```

## What Is Archive

`legacy-content/` and `content/` are pre-relaunch material. They
are kept for lookup — a phrase worth reusing, a legal text, a support
article — and nothing more.

They do not define the target state. Do not reconcile new work against
them, and do not treat a difference between them and the concept documents
as a defect to fix.

## Repository Documents

- `AGENTS.md` — repository context and working rules for agents
  (`CLAUDE.md` and `GEMINI.md` are symlinks to it)
- `concept/README.md` — where the binding website concept lives
- `specs/README.md` — how specs are written
- `CONTRIBUTING.md` — contribution workflow

## Legal Import Script

The repository includes a Google Workspace import path for the normalized
legal content in `content/legal/`.

- Install tooling with `pnpm install`.
- Run `pnpm env:pull` to refresh `.env.local` from the linked Vercel project before importing.
- Add `GOOGLEAPI_CLIENT_EMAIL` and `GOOGLEAPI_PRIVATE_KEY` to `.env.local` in the repository root.
- Run `pnpm import:legal-content:dry-run` to validate the manifest and target files without downloading content.
- Run `pnpm import:legal-content` to pull the current legal texts from Google Workspace into `content/legal/` while preserving frontmatter.

The document manifest for that workflow lives in `content/legal/import.yaml`.
