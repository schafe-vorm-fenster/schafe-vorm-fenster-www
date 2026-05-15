# Content Source

This folder is the structured source of truth for editorial website content.

Each content document should use markdown with frontmatter so it can later be parsed by generators, import scripts, or static site tooling.

## Conventions

- One markdown file represents one editorial content asset or one editorial content collection.
- Frontmatter captures machine-readable metadata.
- The markdown body holds draft copy, lists, editorial notes, or migration instructions.
- Legacy material stays archived in `legacy-content/` until it is deliberately migrated.
- Page composition belongs later in specifications or implementation, not in this folder.

## Common Frontmatter Fields

- `id`: stable internal identifier
- `content_type`: section, collection, legal, media, messaging, profile, catalog, or configuration
- `status`: draft, needs-review, imported, or ready
- `locale`: current language of the content, starting with `de`
- `sources`: concept or legacy references used to derive the file

## Folder Overview

- `site/` holds global website settings, navigation, and contact channels.
- `features/` holds reusable positioning and explanatory copy blocks.
- `audiences/` holds messaging for target groups.
- `trust/` holds traction, testimonials, partner proof, and similar credibility content.
- `team/` holds founder and team profile content.
- `products/` holds offer and pricing content.
- `support/` holds the support-area content inventory.
- `press/` holds press and media coverage catalogs.
- `news/` holds news channel content and configuration.
- `legal/` holds normalized legal content placeholders and migration targets.
- `media/` holds image and media asset inventories.
- `regions/` holds regional availability content.
