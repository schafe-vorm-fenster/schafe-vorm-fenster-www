---
name: content-production
description: Produce a website's page copy and translations from governed content sources — cited, compliance-checked, schema-valid, never invented.
layer: project
tags:
  - content
  - translation
  - localization
interfaces:
  - id: content-sources
    description: The governed packages and documents every fact and claim must trace to.
    required: true
  - id: communication-principles
    description: The principles document including the compliance check each page must pass.
    required: true
  - id: tone-of-voice
    description: The voice definition all copy follows in both locales.
    required: true
  - id: page-specs
    description: The page specs naming which content each page needs where.
    required: true
  - id: content-schema
    description: The frontmatter schema and locale set the artifacts must validate against.
    required: true
  - id: pipeline-spec
    description: The tactical spec fixing how source content becomes per-locale artifacts with provenance.
    required: true
  - id: state-files
    description: The run's status document and open-points list.
    required: true
---

# Content Production

Write every page's copy in the primary locale, translate it into the
secondary locale, and keep each claim traceable to a governed source
— gaps become designed empty states, not prose.

## Prerequisites

- `content-sources` are reachable and consumed by id, never copied
  wholesale.
- `communication-principles` and `tone-of-voice` are loaded before
  the first sentence.
- `page-specs` say what content lands where; `pipeline-spec` says in
  what shape.
- `content-schema` validates every artifact; failures block handoff.
- Missing facts go to `state-files`, the page gets its empty state.

## Guidelines

- Mandatory skills (Skill-Matrix, plan/prozess.md): `copywriting`
  for page copy (+ `cro` on conversion pages), `ux-writing` for
  microcopy; every German draft passes `humanizer` together with
  `humanize-de`, every English translation passes `humanizer` and
  `copy-editing` — Phase 2/3 are not done without these passes.
- Primary locale first, translation second; a translation carries
  the same source ids as its original.
- Numbers, names, quotes, and claims come from `content-sources`
  verbatim or not at all.
- Voice over variety: the same term for the same thing on every
  page, per `tone-of-voice`.
- Legal texts flow through their own import path; this playbook
  never rewrites them.

## Workflow

### Phase 1 — Source mapping

- Per page, map every content slot from `page-specs` to its source
  artifact in `content-sources`; unresolvable slots are recorded in
  `state-files` and marked for empty states.

Quality gate: every slot has a source id or an open-point entry.

### Phase 2 — Primary copy

- Write the primary-locale copy per slot, voice per
  `tone-of-voice`, claims cited inline in the artifact metadata.

Quality gate: the page passes the compliance check from
`communication-principles`, result recorded.

### Phase 3 — Translation

- Produce the secondary locale from the primary, preserving source
  ids, terminology, and register.

Quality gate: both locales exist for every slot, no untranslated
remainder.

### Phase 4 — Validation and handoff

- Shape artifacts per `pipeline-spec`, validate against
  `content-schema`, hand off to the page implementation.

Quality gate: schema validation green for every artifact; handoff
lists any slot that ships as an empty state and why.
