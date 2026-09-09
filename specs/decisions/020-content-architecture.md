---
id: DEC-020
title: Website content is generated from GTM packages and sourced locally
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

ADR-001 makes go-to-market-os the content source of truth; the website
must not copy it — but it needs concrete, multilingual, format-fitted
texts at build and runtime.

## Decision

1. ContentHub raw material arrives as npm packages from the private
   GitHub registry (`npm.pkg.github.com`), installed as devDependencies.
2. Agent skills/playbooks transform that raw material into website
   contents: per language, format, and length.
3. The results live in this repository's content folder as
   markdown + frontmatter with optional co-located assets, per language —
   the website's build *and* runtime (dynamic loading, geo-based
   selection) read exclusively from these local files.
4. The formats are defined as Zod schemas in this repository: frontmatter
   fields plus `describe()` guidance on lengths and phrasing — the schema
   is the contract the generation agents write against.
5. Every content file carries a machine-readable reference to the GTM
   package(s) and version(s) it derives from; the update workflow keys on
   this reference.

## Consequences

Generation is reproducible and updates are diffable (package version →
content file). → WEB-F-080–089. The existing
`src/domain/content-frontmatter.schema.ts` is the starting point for the
schema work, to be reshaped to the new formats.
