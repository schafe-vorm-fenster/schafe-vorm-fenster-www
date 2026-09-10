---
artefact: requirements
area: content-pipeline
status: DRAFT
sources: [SRC-006, SRC-009]
---

# Content Pipeline

Foundation: ADR-001 (`go-to-market-os` is the single source of truth for
content, delivered as packages; SRC-009).

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-080 | ContentHub raw material (English, markdown + frontmatter) shall be consumed as npm packages from the private GitHub registry (`npm.pkg.github.com`), installed as devDependencies; until publication by reference to repo paths. Raw content is never copied into this repository. | SRC-009 ADR-001, SRC-006, DEC-020 | S3 |
| WEB-F-081 | Concrete website texts (per language, format, length) shall be generated from the package raw material via agent skills/playbooks, then editorially reworked. | SRC-006, DEC-020 | S3 |
| WEB-F-082 | Generated website contents shall live in this repository's content folder as markdown + frontmatter with optional co-located assets, per target language. Build **and** runtime (dynamic loading, geo-based selection) read exclusively from these local files — never from GTM at request time. | SRC-006, DEC-020 | S3 |
| WEB-F-083 | Every content file shall carry a machine-readable frontmatter reference to the GTM package(s) and version(s) it derives from; the update workflow (WEB-F-084) keys on this reference. | SRC-006, DEC-020 | S3 |
| WEB-F-084 | Update workflow: a content-package update triggers an agent-driven diff; resulting content updates arrive as a pull request against the website. Trigger mechanics: UNKNOWN (Q-018, = open question 1 of ADR-001). | SRC-006, SRC-009 | S2 |
| WEB-F-085 | Conversion goal, audience, offering, and proof IDs shall be referenced from `go-to-market-os` and never redefined locally. | SRC-009 ADR-001 | S3 |
| WEB-F-086 | Feed-like content — `media-echo/verified/` for `/ueber-uns/archiv` and inline proof — shall be fetched at build time rather than versioned as a package. There is no news section (DEC-022; the IA is authoritative). | SRC-009 ADR-001, DEC-022 | S3 |
| WEB-F-087 | Page copy production happens after this specification phase (project rule); specs use placeholders. | DEC-023 | S3 |
| WEB-F-088 | Legal texts (imprint, privacy, terms) arrive via the Google Workspace import pipeline (`content/legal/` + `import.yaml`) in German **and English**, and are rendered as sections of the single legal page (WEB-F-029); further languages/jurisdictions are added in Google Docs, same process. They are the one content type not sourced from the GTM hub. | DEC-012, DEC-027 | S3 |
| WEB-F-089 | Website content formats shall be defined as Zod schemas in this repository: frontmatter fields plus `describe()` guidance on lengths, phrasing, and tone per field — the schema is the binding contract for generation agents. Starting point: `src/domain/content-frontmatter.schema.ts` (reshape to the new formats). | DEC-020 | S3 |
| WEB-F-025 | Non-German pages render everything the content pipeline generates in the page language — including proof context, titles, descriptions. Original artifacts (press clippings, quoted headlines) stay in their source language; nothing is machine-translated at request time. | DEC-026 | S3 |
