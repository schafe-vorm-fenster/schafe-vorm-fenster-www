---
artefact: requirements
area: content-pipeline
status: DRAFT
sources: [SRC-0006, SRC-0009]
---

# Content Pipeline

Foundation: ADR-001 (`go-to-market-os` is the single source of truth for
content, delivered as packages; SRC-0009).

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| FUN-WEB-0080 | ContentHub raw material (English, markdown + frontmatter) shall be consumed as npm packages from the private GitHub registry (`npm.pkg.github.com`), installed as devDependencies; until publication by reference to repo paths. Raw content is never copied into this repository. | SRC-0009 ADR-001, SRC-0006, DEC-0020 | S3 |
| FUN-WEB-0081 | Concrete website texts (per language, format, length) shall be generated from the package raw material via agent skills/playbooks, then editorially reworked. | SRC-0006, DEC-0020 | S3 |
| FUN-WEB-0082 | Generated website contents shall live in this repository's content folder as markdown + frontmatter with optional co-located assets, per target language. Build **and** runtime (dynamic loading, geo-based selection) read exclusively from these local files — never from GTM at request time. | SRC-0006, DEC-0020 | S3 |
| FUN-WEB-0083 | Every content file shall carry a machine-readable frontmatter reference to the GTM package(s) and version(s) it derives from; the update workflow (FUN-WEB-0084) keys on this reference. | SRC-0006, DEC-0020 | S3 |
| FUN-WEB-0084 | Update workflow: a content-package update triggers an agent-driven diff; resulting content updates arrive as a pull request against the website. The hub's package publish fires a `repository_dispatch` (DEC-0050), closing ADR-001's open question 1. | SRC-0006, SRC-0009 | S2 |
| FUN-WEB-0085 | Conversion goal, audience, offering, and proof IDs shall be referenced from `go-to-market-os` and never redefined locally. | SRC-0009 ADR-001 | S3 |
| FUN-WEB-0086 | Feed-like content — `media-echo/verified/` for `/ueber-uns/archiv` and inline proof — shall be fetched at build time rather than versioned as a package. There is no news section (DEC-0022; the IA is authoritative). | SRC-0009 ADR-001, DEC-0022 | S3 |
| FUN-WEB-0087 | Page copy production happens after this specification phase (project rule); specs use placeholders. | DEC-0023 | S3 |
| FUN-WEB-0088 | Legal texts (imprint, privacy, terms) arrive via the Google Workspace import pipeline (`content/legal/` + `import.yaml`) in German **and English**, and are rendered as sections of the single legal page (FUN-WEB-0029); further languages/jurisdictions are added in Google Docs, same process. They are the one content type not sourced from the GTM hub. | DEC-0012, DEC-0027 | S3 |
| FUN-WEB-0089 | Website content formats shall be defined as Zod schemas in this repository: frontmatter fields plus `describe()` guidance on lengths, phrasing, and tone per field — the schema is the binding contract for generation agents. Starting point: `src/domain/content-frontmatter.schema.ts` (reshape to the new formats). | DEC-0020 | S3 |
| FUN-WEB-0025 | Non-German pages render everything the content pipeline generates in the page language — including proof context, titles, descriptions. Original artifacts (press clippings, quoted headlines) stay in their source language; nothing is machine-translated at request time. | DEC-0026 | S3 |
