---
artefact: tactical-spec
id: TS-007
profile: system
status: DRAFT
implements: [WEB-F-025, WEB-F-039, WEB-F-080, WEB-F-081, WEB-F-082, WEB-F-083, WEB-F-084, WEB-F-085, WEB-F-086, WEB-F-087, WEB-F-088, WEB-F-089]
sources: [SRC-006, SRC-008, SRC-009]
decisions: [DEC-012, DEC-020, DEC-022, DEC-026, DEC-027, DEC-039, DEC-041]
---

# TS-007 — Content Pipeline

## Purpose

How website content comes into existence and how the running site reads
it: hub packages in, schema-validated markdown per locale out, with a
provenance key that makes updates diffable. The production system is
designed in `concept/website-content-production.concept.md` (layers
A–E). This spec is the website side of that design — the buildable
contract: what is installed, what the schema must carry, what the build
refuses, and what the update workflow keys on. It does not restate the
concept; it binds it.

Boundaries: *which* elements are selected and ordered is TS-005 — this
spec only guarantees the facets TS-005 reads. *Where* content is rendered
is TS-004. Layer C (page compositions) has no tactical spec yet (open
points).

## Determinations

### D1 — Source packages are devDependencies, addressed by name [FIXED: WEB-F-080, DEC-020, ADR-001, concept A.1/A.2]

Raw material is installed from `npm.pkg.github.com` as **devDependencies
with exact pinned versions**, never as runtime dependencies and never
copied into this repository. The address of a record is
`<package>@<version>#<record-id>` — a package name and a version, never a
repository path (concept A.2 rule 1), because the hub's folder layout is
still moving (ADR-002/005/007/008).

Packages verified as published today, with the website content types they
feed (per concept A.1):

| Package | Feeds |
| --- | --- |
| `@schafe-vorm-fenster/proof` | proof-card, quote, value-story, tier reassurance |
| `@schafe-vorm-fenster/media-echo` | proof-card, archive-entry, award mention |
| `@schafe-vorm-fenster/offerings` | offer-tier, comparison, feature-benefit |
| `@schafe-vorm-fenster/audiences` | audience order, relation guidance, tone input |
| `@schafe-vorm-fenster/goals` | conversion goal ids, business goals |
| `@schafe-vorm-fenster/messaging` | positioning, value propositions, content pillars |
| `@schafe-vorm-fenster/people` | person-profile, origin-story |
| `@schafe-vorm-fenster/partners` | partner-mention |
| `@schafe-vorm-fenster/brand-identity` · `/brand-design` | tone of voice, tokens, imagery rules, length budgets |
| `@schafe-vorm-fenster/posts` | anecdote (secondary) |

Concept A.1 names a `strategy` and a `brand` package. Neither exists
under that name: strategy material ships split across `goals` and
`messaging`, brand material across `brand-identity` and `brand-design`.
The mapping above is what the adapter binds to. [PROPOSED — open point]

**The consumption interface is `index.json` + `schema.mjs` and nothing
else** (concept A.2 rule 2). `index.json` carries name, version, and the
frontmatter of every shipped file; it is generated at pack time. No
module in this repository reads a `.md` file out of a package directory
and no module parses hub frontmatter itself.

### D2 — One source adapter, and the missing-field rule [FIXED: concept A.2 rules 3/5]

`src/content/source-adapter/` is the only module that knows package
layout. Its contract: `resolve(sourceRef) → record | fail`, where
`sourceRef` is `<package>@<version>#<record-id>`. A version that does not
match the installed package fails loudly; an unknown record id fails
loudly. Nothing paraphrases around a missing record.

The adapter is **build-time and generation-time only**. It is never
imported by a request-time code path (D3).

**A field the package does not carry is marked missing, never invented,
never blocking** (concept A.2 rule 5): the content file records `UNKNOWN`
with the question, the affected claim is weakened, the proof slot stays
visibly empty, and the gap is registered as a demand against the hub.
This is what discharges WEB-F-039: media-echo entries carry no
`audiences[]`, and they no longer need to — DEC-041 §2 and TS-005 D3 make
job relation an **assessment** rather than a derivation from audience
tags, so the missing field weakens nothing and blocks nothing. Q-019
stays open as a hub demand, not as a website blocker. The one gap that
still bites is `geo` on proof: without it an element falls to TS-005 tier
6.

### D3 — Build-time in, local-only out [FIXED: WEB-F-082, WEB-F-086, DEC-020]

| Phase | May read | Must not read |
| --- | --- | --- |
| generation (P3/P7) | hub packages via D2, local content files | — |
| build | installed hub packages (clearance re-check, D12; archive materialisation), local content files | — |
| request time | `content/` local files, app APIs via TS-004 D5 | any hub package, any GTM artefact, `npm.pkg.github.com` |

Runtime — including dynamic loading and geo-based selection — reads
exclusively from the local content tree. This is the hard line DEC-020 §3
draws and TS-005 depends on (the engine reads the website's schema only).

**Media echo and WEB-F-086.** The requirement's premise ("fetched at
build time rather than versioned as a package") is superseded by the
hub's package delivery: `media-echo/verified/` ships as
`@schafe-vorm-fenster/media-echo`. The requirement's *intent* holds and is
realised as follows: `/ueber-uns/archiv` is not hand-maintained. Archive
rows are `archive-entry` content files generated by P3/P7 from the
installed package — they need localized context lines (D8) and therefore
cannot be a raw feed render — and the page is fully static at build
(TS-004 D6). There is no news section (DEC-022). [PROPOSED — amends the
requirement's premise, not its intent]

### D4 — Content tree, file names, ids [FIXED: concept Conventions]

```text
content/
├── de/<route>/<slot>.<type>.md      ← generated, then edited
├── en/<route>/<slot>.<type>.md
├── <locale>/…                        ← further locales, same shape
└── legal/<locale>/<doc>.md           ← imported, not generated (D10)
```

- Content id: `<route-segment>-<slot>-<type>`, kebab-case and
  **locale-free** — the `de` and `en` files of one slot share one id.
- Assets co-locate with the file that uses them.
- `content/features/`, `content/support/` are pre-relaunch archive
  (CLAUDE.md) and are not part of this tree. They are not migrated; the
  pipeline neither reads nor validates them. [PROPOSED]

### D5 — The Zod schema hierarchy [FIXED: WEB-F-089, DEC-020, concept B.1–B.3; field lists PROPOSED]

Website content formats are Zod schemas in **`src/domain/content/`**,
three tiers per concept B.1 (`ContentBase`), B.2 (fragments) and B.3
(the 26 content types). The schema — not this spec, not the concept — is
the binding output contract a generation agent writes against.

Binding schema rules:

| Rule | Realisation |
| --- | --- |
| authoring guidance is machine-readable | every field carries `describe()`: what belongs in it, phrasing, tone |
| length budget is machine-readable | every field with a visual limit carries `max()`; the number comes from the component and the design kit |
| types are closed | discriminated union over `type`; an unknown `type` fails to parse |
| source entities are constrained per type | each type declares its allowed source entities; a `proof-card` claiming to derive from `offerings` fails validation |
| selectable types are complete or invalid | types 3, 10, 12, 14, 16 must carry full `RelevanceFacets` (D7); the engine has no fallback |
| copy shells are locale-scoped, never place-scoped | types 19–25 are generated once per locale with named interpolation slots, never per place |

**Reshaping `src/domain/content-frontmatter.schema.ts`.** The existing
file is built for the pre-relaunch taxonomy (`catalog`, `collection`,
`configuration`, `legal`, `media`, `messaging`, `profile`, `section`,
plus standalone press/support). It is the starting point, not the target:

| Existing | Fate |
| --- | --- |
| `BaseFrontmatterSchema` (id, status, locale, sources) | becomes `ContentBase`, extended with placement, provenance, editorial and proof groups (concept B.1) |
| `ContentTypeSchema` (8 values) | replaced by the 26 types of concept B.3 |
| `ContentStatusSchema` (`draft`/`imported`/`needs-review`/`ready`) | replaced by D11's lifecycle; `imported` survives for legal only |
| `ContentLocaleSchema` (`de`/`en` enum) | becomes a locale **set** derived from configuration, never a hard-coded pair (DEC-006, D8) |
| `sources: string[]` | replaced by typed `derived_from[]` (D6) |
| `Press*`, `Support*`, `Product*` | not carried forward; the pre-relaunch content they described is archive (D4) |

### D6 — Provenance is the update key [FIXED: WEB-F-083, DEC-020 §5, concept B.1]

Every generated content file carries, in frontmatter:

| Field | Shape | Rule |
| --- | --- | --- |
| `derived_from[]` | `<package>@<version>#<record-id>` | one entry per record actually used; **the exact installed version**, never a range, never a path |
| `generated_by` | `<playbook>@<version>` | the playbook and its version, so a prompt change is traceable |
| `generated_at` | ISO date | when the draft was emitted |

A generated file with an empty `derived_from` fails validation — content
that derives from nothing has no update path and no provenance. Copy
shells (types 19–25) that legitimately have no source record declare
`derived_from: [ia]` against the IA rather than an empty list.
[PROPOSED]

`derived_from` is the only key P7 (D13) runs on. Everything else in the
update workflow follows from it.

### D7 — The relevance facets the pipeline owes TS-005 [FIXED: TS-005, DEC-041, concept B.5]

TS-005 reads this schema and nothing else. Selectable types therefore
carry a complete `RelevanceFacets` fragment at the moment generation
ends. Five obligations, each an acceptance criterion:

| Facet | Obligation on this pipeline |
| --- | --- |
| `geo` | one field, five levels `country > state > county > municipality > community`, unknown levels `null`, mapped from the hub record per concept B.5 §1. **Coverage, not venue** — the level is what the element is about; the venue stays in the copy. No `geo_reach` beside it. |
| `job_relation` | a profile over all four jobs, **assessed with a stated reason** (`job_relation_reason`), never a lookup. An unassessed job takes the lowest step and is marked unassessed so the gap stays countable. |
| `editorial_weight` | default `1.0`; a non-default value without `editorial_weight_reason` **fails validation**. |
| `clearance` | denormalised from `usage_rights` at generation time; re-validated on every build (D12). |
| `place_bound` | plus the place reference, so TS-005 D5 can ask events-api before showing "in <place>" (WEB-F-024). |

**Sticky rule.** `job_relation` and `editorial_weight` hold standing
judgements, not derived facts. P3 and P7 carry an existing value *and its
reason* forward unchanged; regeneration from a newer package version must
never reset them. No script writes these fields in bulk. (Drift is a real
cost — open points.)

**Segment independence.** Content must stay independent of the visitor
(concept B.5 §6): no visitor-specific text, no pre-resolved place name,
no request-time value baked into a generated string. Place names reach
the page only through the named interpolation slots of `PlaceholderText`
(`{place}`, `{county}`). A content file that varies per visitor breaks
the TS-005 D8 cache key and with it the TS-003 performance budget.

### D8 — Localization: siblings, not translations [FIXED: DEC-026, DEC-006, WEB-F-025, concept B.4]

1. One file per locale (D4). The pipeline takes a locale **set**, never a
   hard-coded `de`/`en` pair; phase 1 is `de` + `en`.
2. **Everything the pipeline generates renders in the page language** —
   headlines, leads, proof context lines, titles, descriptions,
   empty-state copy, meta.
3. **Original artifacts stay original** (DEC-026): a clipping headline, a
   quoted sentence, an award's own name. `Quote` and `ImageRef` carry
   `source_language` and are exempt from translation.
4. **Nothing is machine-translated at request time.** There is no
   translation call in any request path.
5. The `en` file is generated from the same source record with the same
   playbook, not translated from the `de` file.
6. **Harmonisation before review.** Parallel generation buys idiom and
   costs consistency. The must-match / may-differ contract is concept
   B.4; it is enforced as a validation check (D12) and is a defect when
   the left column diverges. A genuine argument conflict between markets
   is **escalated to the editorial decision point** (D11), never resolved
   silently by the harmonisation step.

### D9 — Hub IDs are referenced, never redefined [FIXED: WEB-F-085, ADR-001]

Audience ids, conversion goal ids, offering ids and proof ids come from
the installed packages. This repository defines none of them and keeps no
local copy of the lists. Every such id used in frontmatter or in a page
composition is resolved through D2 and checked in D12. Consequences that
are already written down elsewhere and now become checkable: the eight
compliance points of concept C.3, and the offering → surface map of
TS-004 D7.

Terminology is the same problem one layer down: the word used in copy for
a bound term is governed by `specs/glossary/glossary.md`, which is a
production input, not documentation (concept A.3). A term in copy that
the glossary does not carry is a finding. The register currently lacks
the two columns generation needs — use-this-word and avoid-this-word per
locale (open points).

### D10 — Legal texts: imported, validated, never generated [FIXED: WEB-F-088, DEC-012, DEC-027, DEC-039]

Legal content is the one family not sourced from the hub. It arrives
through the existing Google Workspace import (`content/legal/` +
`import.yaml`) in German **and** English; further
languages/jurisdictions are added as Google Docs, same process.

| Aspect | Determination |
| --- | --- |
| pipeline position | outside generation entirely: P3 and P7 never touch these files; P5 validates them |
| schema | content type 26 `legal-section`; a minimal subset of `ContentBase` — `id`, `type`, `locale`, `anchor`, `status: imported`, `source` (the Google Doc) — and **no** `derived_from`, no `RelevanceFacets` |
| layout | `content/legal/<locale>/<doc>.md`; `import.yaml` gains a `locale` and an `anchor` per document (it carries neither today, while the imported files already carry `locale: de`) [PROPOSED] |
| anchors | from the permanent registry in TS-004 D8; the importer never invents one, and a document whose anchor is not in the registry fails validation |
| rendering | sections of the single legal page (WEB-F-029, TS-004 D1/D8), in registry order |

### D11 — Status lifecycle and the editorial gate [FIXED: WEB-F-081, WEB-F-087, DEC-023, concept B.1/E.1 P4]

`draft → in-review → approved`. What an agent emits is **`draft`**;
`approved` is set only at the editorial decision point by a person
(`reviewed_by`, `reviewed_at`).

| Build | Includes |
| --- | --- |
| production | `status: approved` only |
| preview | `draft`, `in-review`, `approved` — so review happens on the rendered page |

A missing `approved` file for a required slot is a build failure in
production, not a silently empty section. During the specification phase
no page copy is produced at all (WEB-F-087); specs and fixtures use
marked placeholders, and a placeholder never carries `approved`.

### D12 — `pnpm check:content` — the validation gate [FIXED: WEB-F-089, concept C.3/E.1 P5]

One command, run on every commit in CI and as a build step. Compliance
stops being a review ritual (concept C.3). Every row fails the run —
non-zero exit, named file, named record. Nothing on this list warns.

| # | Check | Fails when |
| --- | --- | --- |
| 1 | schema parse | any content file does not parse against its type (D5) |
| 2 | length budgets | a field exceeds its `max()` |
| 3 | provenance | `derived_from` empty, malformed, or unresolvable against the installed packages (D6) |
| 4 | **clearance re-validation** | a file's `clearance` facet disagrees with the installed package version (D7) |
| 5 | facet completeness | a selectable type lacks a facet; a non-default `editorial_weight` lacks its reason |
| 6 | id resolution | an audience / conversion goal / offering / proof id does not resolve (D9) |
| 7 | locale completeness | a static slot lacks a file in any configured locale (D8) |
| 8 | harmonisation | left-column divergence between locale variants of one id (D8.6) |
| 9 | slot binding | a content file bound to no composition slot, or to more than one; a required slot with no file (concept C.3) |
| 10 | segment independence | a resolved place name in a generated string instead of a named slot (D7) |
| 11 | glossary conformance | a banned term in a field where it is banned — `Portalize` in a navigation label or route-facing field (D9, WEB-F-002) |
| 12 | legal | a legal file with an anchor outside the TS-004 D8 registry, or carrying generation-only fields (D10) |

Check 4 is the one with a timing problem rather than a logic problem:
clearance is denormalised at generation time and can be revoked
afterwards. The build catches it only when a build runs (open points).

### D13 — P7, the update workflow [FIXED: WEB-F-084 shape, concept E.1/E.3; trigger UNKNOWN — Q-018]

A version change in an installed content package runs the diff:

1. Diff the installed `index.json` against the new one — record ids
   added, changed, removed.
2. Select affected content files by `derived_from` (D6). Nothing else
   selects them.
3. Regenerate through the generation playbook, carrying the sticky facets
   and their reasons forward unchanged (D7).
4. Emit a **pull request** with `status` reset to `draft`, so the
   editorial gate (D11) is re-entered.

**Exception — clearance revocation is not a pull request.** A record
whose `usage_rights` leaves `cleared` removes the affected content
immediately; it does not wait for a review round. Combined with check 4
of D12, that is the two-sided mitigation the concept requires (B.5 §4).

**Trigger mechanics are UNKNOWN (Q-018).** Options on the table: a
release webhook from the hub (repository dispatch on publish), a
scheduled dependency check, or manual bump. The steps above hold under
any of them; the trigger is what decides the latency between a hub change
and the site.

### D14 — Where the pipeline artefacts live [FIXED: concept E.3]

Playbooks, skills and the adapter documentation live in `.agents/` in
**this** repository, in the `playbook-*` / `skill-*` / `adapter-*`
convention — they write into this repository and depend on its Zod
schemas. Foundations (tone of voice, culture/values) stay shared and are
synced from the hub. Their frontmatter carries the leafcutter schema plus
two repository-local fields, so the pipeline is readable from the
artefacts themselves:

```yaml
processes: [P3, P7]                    # which of the seven processes it carries
contracts: [proof-card, archive-entry] # which content schemas it reads or writes
```

`.agents/skills/` is currently owned by the skills installer
(`skills-lock.json`). Hand-authored artefacts must survive a re-sync —
either because the installer manages only locked names, or by keeping
them in a sibling folder such as `.agents/playbooks/`. Verify before the
first playbook is written. [PROPOSED]

## Free for the generator

- [FREE] Internal module split of `src/domain/content/` (one file per
  type, or grouped by tier), provided the three-tier boundary of D5 holds
  and every type is reachable from one exported union.
- [FREE] Implementation of `check:content` — language, runner, output
  format — provided every row of D12 runs and exits non-zero.
- [FREE] Fixture organisation and naming for the schema tests.
- [FREE] Markdown body conventions below the frontmatter where no schema
  field governs the text.
- [FREE] Internal structure of the source adapter behind the
  `resolve(sourceRef)` contract of D2.

## Acceptance criteria

| ID | Level | Check |
| --- | --- | --- |
| TS-007-A1 | unit | Every content type parses a valid fixture; an unknown `type` fails; a field over its `max()` fails; a type declaring a source entity it may not derive from fails. |
| TS-007-A2 | tool | `check:content` resolves every `derived_from` entry against the installed packages; an unresolvable ref, a malformed ref, and an empty list each fail with the file named. |
| TS-007-A3 | tool | Clearance re-validation: a fixture whose installed package revoked `usage_rights` makes the run exit non-zero and name file plus record. |
| TS-007-A4 | integration | The same revocation **fails the build** — no deploy artefact is produced. It is not logged as a warning. |
| TS-007-A5 | tool | Locale completeness and slot binding: a missing `en` sibling fails; an orphan content file fails; a required slot with no file fails. |
| TS-007-A6 | unit | Selectable types: a missing facet fails; an unassessed job parses as the lowest step and is marked unassessed; a non-default `editorial_weight` without its reason fails; an absent geo level is `null`, never inferred. |
| TS-007-A7 | unit | The source adapter resolves `<package>@<version>#<record-id>`, and fails loudly on a version mismatch with the installed package and on an unknown record id. |
| TS-007-A8 | static | No content file and no source reference contains a repository path; every `@schafe-vorm-fenster/*` content package is a devDependency and is imported from no request-time module. |
| TS-007-A9 | unit | Harmonisation: locale variants of one id agree on records, claims, proof bindings, CTA target and conversion goal, filled slots, numbers and `UNKNOWN` markers — divergence there fails; differing phrasing, sentence count and length within budget pass. |
| TS-007-A10 | tool | Every audience, conversion goal, offering and proof id used resolves in an installed package; no such id is defined locally. |
| TS-007-A11 | integration | `content/legal/<locale>/` renders as the anchored sections of the one legal page in registry order; anchors match TS-004 D8; a legal file carrying generation-only fields fails validation. |
| TS-007-A12 | integration | No request-time code path reads a hub package or contacts `npm.pkg.github.com`; runtime content reads resolve inside `content/` only. |
| TS-007-A13 | tool | Glossary conformance: a banned term in a field where it is banned is reported with file, field and term. |
| TS-007-A14 | integration | A production build contains only `status: approved` content; a `draft` file renders in preview and reaches no production page. |
| TS-007-A15 | manual | P7 dry run on one bumped package version: the PR touches exactly the files whose `derived_from` names a changed record, resets them to `draft`, and carries `job_relation` and `editorial_weight` plus their reasons forward unchanged. |
| TS-007-A16 | tool | Segment independence: no generated string contains a resolved place name; place references occur only as named interpolation slots. |

## Coverage

| Requirement | Discharged by |
| --- | --- |
| WEB-F-025 (localize everything but artifacts) | D8 · A9, A12 |
| WEB-F-039 (`audiences[]` gap on media echo) | D2, D7 · A6, A7 |
| WEB-F-080 (packages as devDependencies, never copied) | D1, D2 · A7, A8 |
| WEB-F-081 (agent generation, then editorial rework) | D5, D11, D14 · A1, A14, A15 |
| WEB-F-082 (local content folder, build and runtime read it only) | D3, D4 · A5, A12 |
| WEB-F-083 (machine-readable provenance reference) | D6 · A2, A15 |
| WEB-F-084 (update workflow → pull request) | D13 · A2, A15 |
| WEB-F-085 (hub IDs referenced, never redefined) | D9 · A10 |
| WEB-F-086 (media echo at build time, no news section) | D1, D3 · A2, A12 |
| WEB-F-087 (copy after the spec phase; placeholders) | D11 · A14 |
| WEB-F-088 (legal import, DE + EN, one page) | D10 · A11 |
| WEB-F-089 (Zod schemas are the generation contract) | D5, D6, D7, D12 · A1, A6 |

## Open points

- **Clearance staleness has no trigger.** D12 check 4 and D13's immediate
  removal both react to a build or a diff run. A revocation between two
  builds leaves a quote published. Question: does a clearance change fire
  a deploy on its own, and through which mechanism — the same unresolved
  channel as Q-018, or a separate, faster one? Until answered, the
  guarantee is "fails at the next build", not "removed on revocation".
- **Assessment drift (Q-031).** `job_relation` and `editorial_weight` are
  set once and carried forward by D7's sticky rule. Over a year of
  regenerations nobody re-reads them and the site orders itself by
  judgements no one still holds. Question: what triggers a re-read —
  element age, a package major version, a periodic sweep — and does an
  unreviewed assessment decay towards its default or merely get flagged?
- **Q-018, update trigger mechanics.** D13's steps hold under any
  trigger; the latency does not. Release webhook, scheduled check, or
  manual — undecided.
- **Package naming.** D1 binds `goals` + `messaging` where concept A.1
  says `strategy`, and `brand-identity` + `brand-design` where it says
  `brand`. Question: does a `strategy` package ship at all, and which
  package is authoritative for positioning and value propositions once it
  does?
- **Layer C has no tactical spec.** Page compositions are the artefact
  D12 checks 7 and 9 validate against, and they exist nowhere yet.
  Question: who owns the composition spec, and is the format TypeScript
  (typed, references the Zod schemas) or YAML?
- **Length budgets are provisional.** D5 requires `max()` from the
  component; the components do not exist. Interim: take them from the
  wireframes at 390 px and mark them provisional in `describe()`.
  Question: what re-flags content when a component later changes its
  budget?
- **Glossary columns.** D9 leans on `specs/glossary/glossary.md` as a
  production input, but the `GL-###` register carries meanings, not copy
  words. Question: who fills the use-this-word / avoid-this-word columns
  per locale, and does the register stay in `specs/` once it is a
  production input?
- **Legal import owns no locale dimension yet.** `import.yaml` lists five
  documents with single targets while DEC-027 requires DE and EN.
  Question: do the English Google Docs exist, and who changes the import
  script for the `<locale>` path and the `anchor` field?
- **`.agents/skills/` is installer-owned.** D14's caveat is unverified
  against `skills-lock.json`. Question: does the installer preserve
  hand-authored entries, or do playbooks need a sibling folder?
- **Source registration.** `concept/website-content-production.concept.md`
  is the central input of this spec and carries no `SRC-###` id in
  `specs/sources/source-inventory.md`. It needs one.
- **WEB-F-086's premise is superseded** (D3): media echo ships as a
  package. The requirement text should be amended to match its intent.
