---
id: DEC-074
title: The content pipeline reads the shipped page artifacts — one file per page, typed blocks, no markdown library
status: accepted
date: 2026-09-11
decided_by: run/developer (M3 content-pipeline work package)
---

## Context

TS-007 D4 fixes one generated file per **slot** per locale
(`content/<locale>/<route>/<slot>.<type>.md`) against the 26-type schema of
concept B.3. What Content & Translation actually shipped in M3 Phase 2 is
one file per **page** per locale (`content/pages/<route>/<locale>.md`) with
one Markdown section per slot and the slot's metadata in an inline comment —
22 files, 172 slots. `state/content-map.md` explains the deviation and
`state/open.md` #43 hands the decision to this work package: keep the shape
or migrate it.

Four further questions had no determination and blocked the loader:

1. how a page artifact's body becomes something a component can take as a
   typed prop, and whether that needs a markdown parser in the stack;
2. how a `derived_from` reference resolves against an installed package,
   given that the packages spell record ids three different ways;
3. how much of the D5 schema reshape M3 owes, when Layer C — the
   compositions D12 checks 7 and 9 validate against — does not exist yet;
4. which D12 rows are errors on a prototype tree whose content is
   deliberately part sourced, part demo, part empty by design.

## Decision

**1 — The loader reads the page-per-file shape as shipped. [PROPOSED —
amends TS-007 D4's file layout, not its content model.]**

`content/pages/<route-slug>/<locale>.md`, one `##` section per slot, and per
slot an inline comment carrying what a per-slot file's frontmatter would
carry:

```
<!-- id: home-1-search-hero; content_type: hero; provenance: sourced;
     derived_from: [ia]; status: draft -->
```

Every determination D4 and D6 make about *content* holds unchanged: the id is
locale-free, the `de` and `en` files of one slot share it; provenance is per
slot; `derived_from` is the update key. Only the file boundary moves. The
trade is deliberate — rewriting eleven finished pages into 172 fragments buys
a file layout, costs the run a content re-run, and would still be re-cut once
Layer C says what a composition is. `src/lib/content/slot-meta.ts` is the one
module that knows the comment syntax, so a later migration to one-file-per-
slot changes that module and the loader's file resolution, nothing above it.

**2 — No markdown library. A slot body parses into typed blocks.**

The stack-harmony rule was run first: no sibling repository under
`~/Projects/` (`community-calendar`, `events-api`, `classification-api`,
`geo-api`, `envoy-api`, `portalize`, `community-site`) carries `marked`,
`remark`, `unified`, `markdown-it`, `gray-matter` or MDX. There is no family
practice to match, so the question is what the pipeline actually needs.

It does not need HTML. Components take content as typed props
(`src/components/README.md`), and an HTML string would have to reach the page
through `dangerouslySetInnerHTML`, which is the one thing the security
baseline of TS-013 should never have to accommodate for our own content. The
authored bodies are labelled values, not prose documents — `**Headline:**
…`, `**CTA-Label:** …`, bullet lists, and six tables across the tree. So
`src/lib/content/blocks.ts` reads the four shapes the artifacts use — field,
paragraph, list, table — into a discriminated union, and the page gets
`slot.fields["Headline"]`. No dependency, no HTML, no sanitiser, ~120 lines
under test.

**3 — `js-yaml` becomes a runtime dependency, registered in
`stack.allow.json`.**

Not a new package: it has been in the tree since M1 at the same version, and
`scripts/check-frontmatter.ts` and `scripts/check-specs.ts` already use it.
But `src/lib/content/loader.ts` is imported by rendered pages, and a module a
page imports is a runtime dependency whatever folder `package.json` lists it
in. `pnpm audit --prod`: no known vulnerabilities; single publisher
(`nodeca/js-yaml`), no install scripts, version unchanged at 4.3.2, lockfile
edit limited to the importer section.

**4 — A provenance reference resolves through `index.json`, and a record id
is `id` ?? `key` ?? the file stem. [PROPOSED]**

D1 fixes `index.json` as the consumption interface but not how a record is
named inside it, and the packages disagree: `proof`, `offerings`, `audiences`
and `goals` carry `frontmatter.id`; `brand-identity` carries `key`;
`media-echo` carries neither and is addressed by file stem — which is exactly
the id `proof`'s own `media_echo[]` uses. The adapter therefore tries the
three in that order. Two reference forms beyond D6's canonical
`<package>@<version>#<record-id>` are accepted:

- `ia` — the copy shell with no source record. D6 already names it.
- `<package>@<version>` — a whole-package **pool** reference, used where a
  slot draws from a package and the relevance engine picks the element
  (`home-8-proof-stream`, `archiv-2-rows`). It still resolves and a version
  bump still selects the file for P7, which is what D6 asks of the key.

A version that does not match the installed package fails loudly; an unknown
record id fails loudly; a repository path and a version range do not parse.

**5 — The schema is extended, not reshaped. [PROPOSED — D5's 26-type
rewrite stays open.]**

`src/domain/content-frontmatter.schema.ts` gains what M3 can check today:
`PageFrontmatterSchema` (the `TS-###` spec binding of TS-017-A14, `route`,
`derived_from[]`, `generated_by`, `generated_at`, `provenance`),
`SlotMetaSchema`, `LifecycleStatusSchema` (D11's `draft → in-review →
approved`, plus `imported` for legal), and the B.3 slot vocabulary.

Three additions to B.3's list, each because the artifacts need them:
`section` as a 27th type (42 of 172 slots are a heading plus body copy that
no B.3 type describes); an alias table normalising the spellings the writers
used (`form → form-step`, `tier → offer-tier`, `profile → person-profile`,
`configuration → site-config`); and `provenance` as a five-value enum —
`sourced`, `generated`, `sourced-empty-by-design`, `withheld`, `mixed` —
because the content map's "empty by design" and "withheld" determinations are
not the same thing as "generated" and must not flatten into it.

The pre-relaunch taxonomy stays beside it untouched: `content/features/`,
`content/support/` and `content/legal/` still validate against it, and
rewriting archive content is not this run's job.

**6 — What `check:content` fails on, and what it only reports.**

Errors: a page artifact that does not parse; a `page_id` that is not the spec
the route table gives the route; a slot comment that does not validate; a
duplicate slot id; an unresolvable, malformed or version-mismatched
`derived_from`; an empty `derived_from` on a slot claiming `sourced`; a
missing locale sibling; a locale that ships a different slot set, different
records, or a different provenance than the default locale.

Warnings, because the honest answer is a content question and not a code
defect: a `withheld` or `mixed` slot with no source (TS-024 D10, TS-026 D5
forbid the sentence, so there is nothing to cite); a `generated` slot not
marked `demo` (the stage-0 reference place and the accessibility statement
are editorial choices, not demo data, and both carry a `state/open.md` row).

**Dummy content is exempt from D6's empty-`derived_from` rule. [PROPOSED —
amends D6.]** An invented demo card derives from nothing; declaring
`derived_from: [ia]` there would claim the information architecture as its
source, which is a worse lie than an empty list. Its update path is the
`state/open.md` Dummy-Content row, not a hub record. The exemption is narrow:
`provenance: generated` **and** `demo: true`.

## Consequences

- `loadPage(routeId, locale)` is the whole page-facing surface, and it reads
  `content/` and nothing else — `source-refs.ts`, which opens hub packages,
  is imported only by the checker and the tests (TS-007 D3, A12). There is
  deliberately no barrel file: an `index.ts` re-exporting the validator would
  let a page pull the adapter into the request path by accident.
- A content gap never takes a route down. A missing file, invalid
  frontmatter and an unknown slot id are typed empties with a reason, logged
  once; the build-time gate is what refuses.
- `pnpm check` gains `check:content` (+0.3 s, 19 ms of it the actual check).
  It runs before `check:specs` so a content error is reported before a spec
  one.
- Two routes share one artifact: `/deine-region/angebot` is specified with
  `/deine-region` (TS-026) and its slots live in that page's file.
- D12 rows 2 (length budgets), 4 (clearance re-validation), 6 (hub id
  resolution), 10 (segment independence), 11 (glossary) and 12 (legal
  anchors) are not implemented. Rows 2 and 6 need the per-field schema of the
  full D5 reshape; row 4 needs the clearance facet on the artifacts; rows 9's
  "bound to exactly one composition slot" half needs Layer C. They are listed
  in `src/lib/content/README.md` and on `state/open.md`, not silently absent.
