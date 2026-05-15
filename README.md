# Schafe vorm Fenster Website

This repository contains the official website for Schafe vorm Fenster.

The site is currently in a reset phase. The previous implementation was removed from the repository root so the website can be rebuilt from scratch with a new content model and a new tech stack.

## Current State

- The active website implementation has not been recreated yet.
- The previous website was archived instead of deleted.
- The repository root is intentionally light so a new stack can be introduced cleanly.

## Legacy Content

All relevant material from the previous website lives in `legacy-content/`.

That archive includes:

- route and component files that still contain useful copy
- markdown content and imported legal texts
- public images and other media assets
- helper code used to import or render legacy content

See `legacy-content/README.md` for the archive layout.

## Repository Documents

- `AGENTS.md` describes repo context and working rules for coding agents
- `CONTRIBUTING.md` describes the current contribution workflow
- `legacy-content/README.md` explains what was preserved from the old website

## Intended Direction

This repository will become the source for the next official website.

Until the new stack is added, most work will fall into one of these categories:

- content review and migration planning
- information architecture and feature planning
- design and technical foundation work for the rebuild
- selective extraction of useful legacy copy or assets from the archive

## Legal Import Script

The repository now includes a Google Workspace import path for the normalized legal content in `content/legal/`.

- Install tooling with `pnpm install`.
- Run `pnpm env:pull` to refresh `.env.local` from the linked Vercel project before importing.
- Add `GOOGLEAPI_CLIENT_EMAIL` and `GOOGLEAPI_PRIVATE_KEY` to `.env.local` in the repository root.
- Run `pnpm import:legal-content:dry-run` to validate the manifest and target files without downloading content.
- Run `pnpm import:legal-content` to pull the current legal texts from Google Workspace into `content/legal/` while preserving frontmatter.

The document manifest for that workflow lives in `content/legal/import.yaml`.
