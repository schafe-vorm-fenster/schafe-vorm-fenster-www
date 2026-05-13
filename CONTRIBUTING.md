# Contributing

This repository is being prepared for a full rebuild of the official Schafe vorm Fenster website.

At the moment there is no active frontend stack in the repository root. The previous website was archived in `legacy-content/` so content and assets remain available during the rebuild.

## Before You Start

- Read `README.md` for the repository purpose and current state.
- Read `AGENTS.md` for project context and working rules.
- Use `legacy-content/` as the source of truth for old website copy, assets, and helper code.

## Current Contribution Scope

Useful contributions right now include:

- documenting requirements for the new website
- reviewing, organizing, or extracting legacy content
- proposing information architecture, navigation, or content structure
- introducing the new technical foundation for the rebuild
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

There is currently no standard local development command because the new website stack has not been set up yet.

When that changes, this file should be updated with at least:

- install steps
- local run commands
- test and lint commands
- build or preview instructions
