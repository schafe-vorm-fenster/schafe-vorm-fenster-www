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
