# Content Source

Archive of the pre-relaunch website content. This folder is **not** the
source of truth. `go-to-market-os` is
([ADR-001](https://github.com/schafe-vorm-fenster/go-to-market-os/blob/main/handbook/decisions/001-content-source-of-truth.adr.md)).

What remains here is what `go-to-market-os` does not carry: the support
articles, the legal copy imported from Google Workspace, and the images of
the legacy feature articles.

## Conventions

- One markdown file represents one editorial content asset or one editorial content collection.
- Frontmatter captures machine-readable metadata; `scripts/check-frontmatter.ts` validates it.
- The markdown body holds draft copy, lists, editorial notes, or migration instructions.
- Legacy application code stays in `legacy-content/`.

## Common Frontmatter Fields

- `id`: stable internal identifier
- `content_type`: section, collection, legal, media, messaging, profile, catalog, or configuration
- `status`: draft, needs-review, imported, or ready
- `locale`: current language of the content, starting with `de`
- `sources`: concept or legacy references used to derive the file

## Folder Overview

- `support/` holds the support-area content inventory — 37 articles plus screenshots. Source of truth open: product documentation on a product cadence, not an editorial one.
- `legal/` holds legal copy imported from Google Workspace via `pnpm import:legal-content`. The document manifest is `legal/import.yaml`; Google Docs is upstream.
- `features/img/` holds the images for the ten feature articles in `legacy-content/app/funktionen/content/`. The only copies.

## Migrated and Removed

Deleted on 2026-09-09 after a file-by-file check against `go-to-market-os`:

| Was here | Now in `go-to-market-os` |
| --- | --- |
| `audiences/` | `audiences/*.audience.md`, `concept/audience-model.concept.md` |
| `press/*.md` | `media-echo/verified/` |
| `products/` | `offerings/` |
| `trust/` | `proof/` |
| `team/*.md` | `people/` |
| `features/*.md` | `strategy/positioning/`, `concept/website-information-architecture.concept.md` |
| `news/` | `publishing/surfaces/` |
| `regions/` | `proof/regional-footprint.proof.md` |
| `site/`, `media/`, `team/img/` | nothing — dropped as superseded, see below |
| `press/img/` | `media-echo/verified/` — five had better counterparts there; the Ostseezeitung print page and the Kulturlandbüro press photo were migrated across on 2026-09-09 |

`site/`, `media/`, and `team/img/` were dropped rather than migrated:

- `site/navigation.md` and `site/settings.md` are superseded by the
  information architecture and the brand profile in `go-to-market-os`;
  `site/contact-channels.md` duplicated `legal/imprint.md`.
- `media/` inventoried binaries at paths that no longer exist, and
  `go-to-market-os` describes assets one `.asset.md` per file instead.
- `team/img/jan.jpg` was a 500 px legacy portrait; `people/jan-henrik-hempel/assets/`
  holds ten described, rights-cleared photographs.

Recoverable from git history on branch `next-2026` if needed.
