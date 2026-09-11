# AGENTS

This repository is the home of the official Schafe vorm Fenster website.

## Project Context

This repository is the relaunch of the Schafe vorm Fenster website. The
site is being rebuilt from scratch, in three phases:

1. **Concept — done.** Communication principles, relevance model, and
   information architecture live in `go-to-market-os`; the clickable
   prototype is in `concept/v1.0/`.
2. **Specification — current phase.** Specs are derived from the concept
   documents, the IA, and the wireframes, and written to `specs/`.
3. **Content — after the specs.** Page copy is produced once the specs
   exist, never before.

Everything else in this repository predates the relaunch. `legacy-content/`
and `content/` are archive: material to look something up in, not a
specification and not a starting point. (`docs/` was deleted — it held stale
product-doc copies; see `specs/decisions/DEC-001/008`.)

## Read First

- `concept/README.md` for where the binding website concept lives — it is **not** in this repository
- `README.md` for the repository purpose and current state
- `specs/README.md` for how specifications are written — the current phase
- `CONTRIBUTING.md` for the current development workflow
- `.github/copilot-instructions.md` for mirrored agent bootstrap instructions

## Content and Concept Sources

`go-to-market-os` is the single source of truth for the concept and for all
content
([ADR-001](https://github.com/schafe-vorm-fenster/go-to-market-os/blob/main/handbook/decisions/001-content-source-of-truth.adr.md)).

- **Local path:** `/Users/jan-henrik.hempel/Projects/go-to-market-os` — a sibling of this repository in the workspace
- **Repository:** <https://github.com/schafe-vorm-fenster/go-to-market-os> (private)

It holds the three documents that govern this website — communication
principles, relevance model, information architecture — and also the
audiences, conversion goals, positioning and value propositions, offerings
and pricing, tone of voice, brand, proof, and media echo.
`specs/README.md` maps each of them to its path; `concept/README.md` covers
the three concept documents.

Specs are written against the **STRICT** framework at
`/Users/jan-henrik.hempel/LeafcutterOS/leafcutter-strict`. It is not
reachable from this repository, so the path is named explicitly.

Conversion goal IDs, audience IDs, offering IDs, and proof IDs are defined
in `go-to-market-os`. This repository consumes them; it does not define its
own.

## Working Rules

1. Build forward from the concept documents, not from what is already in this repository.
2. Do not audit new work against `legacy-content/` or `content/`. A difference between them and the concept documents is expected, not a defect. Do not report it as one.
3. Consult the archive only when explicitly looking something up — a phrase, a legal text, a support article.
4. Do not write page copy or content while the specification phase is running. If a spec needs example copy, mark it as a placeholder.
5. Preserve the archive folders as they are; do not move them back into the repository root or reorganise them unless explicitly asked.
6. When adding a new technical foundation, update `README.md` and `CONTRIBUTING.md` in the same change.
7. Never copy content or concept documents from `go-to-market-os` into this repository. Link to them.

## Typical Tasks

- write or refine a specification in `specs/` from a page brief
- resolve an open point in the concept documents (in `go-to-market-os`)
- add baseline repository structure and technical foundations for the rebuild
- document development conventions as the new stack takes shape

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
