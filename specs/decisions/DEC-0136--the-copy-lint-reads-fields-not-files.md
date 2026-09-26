---
id: DEC-0136
title: The copy lint reads fields, not files — the field-role map, the scoped avoid list, and the eleven repairs the three new rows found
status: DRAFT
date: 2026-09-26
decided_by: the engineering team
---

## Context

`TS-WEB-0007 D12` rows 11, 13 and 14 — glossary conformance, copy structure,
register — are the lint column of `specs/contracts/copy-contract.md`
(`SRC-0018`), which assigns every one of `SRC-0017`'s forty-one rules to a
mechanism. Three rows carried eight of those rules and none of the three ran:
`check:content` validated schema, provenance, lifecycle, locale completeness
and harmonisation, and read no word of the copy. `TS-WEB-0006-A8`,
`TS-WEB-0007-A13`, `TS-WEB-0029-A15` and `TS-WEB-0018-A7` were unmet, and
`pnpm check:terms` — the whole mechanism behind `CG-037` and
`TS-WEB-0026-A8` — existed but was not in the `check` chain, so it had been
red on `next-2026` without anyone hearing about it.

Writing the rows is not the hard part. Deciding **what a lint may read** is:
the artifacts under `content/pages/` are not prose documents but labelled
values with authoring notes between them, and three of the eight rules carry a
scope in a parenthesis (*"as a title"*, *"about this product"*, *"as the only
addressee"*) that a word pattern cannot decide. A lint that reads everything
fails the copy it exists to protect — the owner's own sentence in `DEC-0084 §2`
contains *"einfach"*, and a note saying *"Kein „im Amt" im Benefit-Band"*
quotes a forbidden term in order to forbid it.

## Decision

### 1. Copy is a field value, a list item and a table cell — never a label, never a paragraph

`copyOf()` yields field values plus the list items and table cells whose
nearest preceding block is a field. Two exclusions carry the weight:

- **The `**Label:**` is not copy.** It is a slot-internal name a component
  addresses by position (`fieldAt`, `blocks.ts`), and the labels are
  translated. This is why a slot may be labelled `Warum es zählt` — which the
  avoid list forbids on the page — without failing the build.
- **A paragraph is not copy.** Below a slot it is the authoring note that says
  where the copy came from, which is a convention of every one of the eleven
  artifacts. A list whose nearest preceding block is a paragraph is part of
  that note, not copy: `content/pages/dein-kalender/de.md` carries
  *"**Kein „im Amt"** im Benefit-Band — CG-036"* as a bulleted note, and a
  gate that fails the slot for explaining itself would teach authors to stop
  explaining.

The cost is named: real copy that a future artifact writes as a bare paragraph
is not linted. The convention, not the lint, is what keeps that from
happening, and `blocks.ts` already depends on the same convention.

### 2. The field-role map: a title word in the label, minus the labels that carry one and are not titles

`CG-005` forbids a question mark in a **section title** and allows one in a
kicker (*"Was hilft euch das?"*), in a form step's question
(*"Für welchen Ort willst du veröffentlichen?"*) and in the hero headline,
which is `CG-020`'s own shape. The role is therefore read off the label, and
the map is a pattern rather than a list of the tree's ninety-odd labels:

- **A section title** is a label carrying `Überschrift`, `heading`, `Titel` or
  `title` as a word — so `Überschrift`, `Überschrift (ohne Landkreis)`,
  `Modul-Überschrift`, `Abschluss-Überschrift`, `Fragen-Überschrift`,
  `Section title` and their English mirrors `Heading`, `Closing heading`,
  `Module heading`, `Settings heading`, and the composed forms
  `Überschrift des Wege-Slots` and `Aussage 1 (Überschrift)`.
- **Not a section title**, although the label carries a title word or reads
  like one: `Headline` and `h1` (the hero, exempt as `CG-020`), `Kicker…`,
  `Frage`/`Question`, `Aha-Frage`, `Zitat — Quelle (Titel)` /
  `Quote — source (title)` (a press article's title), `Link-Label`, `CTA…`,
  `Beschriftung`, `Sucheingabe`.

**The English mirrors are in the map** although `T-17`'s brief names the German
labels and `Section title`. `CG-041` binds the `en` artifact to mirror the `de`
one and `TS-WEB-0006-A8` qualifies no locale, so leaving `Heading` out would
let every English page carry the question the German one may not.

### 3. The avoid list is a table in `validate.ts`, bound to the glossary by a drift test

`CG-040` sources the list from three places: the guide's German table, its
English mirror, and the **avoid** column of `specs/glossary/glossary.md`.
Parsing the glossary at lint time would look like the stronger single source
and is not: the column's terms carry exemptions and scopes in prose
(*"on every **search** surface"*, *"outside the one sentence"*) that no parse
recovers, and the lint would silently drop them. `AVOID_TERMS` is therefore an
explicit table with a `rule`, a `pattern`, the guide's *use instead* column and
a scope, and `validate.test.ts` fails when the glossary grows an italicised
avoid term the table does not match. `Portalize` is on both source lists and
deliberately not in the table — it is a count, not a hit (§6).

### 4. Four scopes, because four rows are qualified in the guide and not by a word

| Scope | Rows | What it means |
| --- | --- | --- |
| `standalone-claim` | `einfach · digital · für alle · modern · innovativ`, `simple · digital · for everyone · modern · innovative` | the term must **be** a whole segment of the field, not a word inside a sentence |
| `section-title` | `Warum es hakt`, `Warum es heute hakt`, `Wo das herkommt` | the guide says *(as a title)* / *(as a heading)*; the same words pass in a kicker, which `CG-005` names as the split it accepts |
| `sole-addressee` | `im Amt`, `at the council` | `CG-036`'s own mechanism: a hit only where none of `Verein`, `Stiftung`, `Kulturgesellschaft`, `Volkshochschule`, `Akteur` stands beside it |
| `product-origin` | `gebaut`, `betrieben` | the guide says *(about this product)*; these are ordinary German words, so a hit only where the same field also names the village (`DEC-0066 §2`) |

The generic-claims scope is the one that changes an outcome. Read as a word,
the row fails four fields the owner wrote, including
*"Ein Dorf braucht einen einfachen Weg …"* — `DEC-0066`'s and `DEC-0084 §2`'s
re-derivation, quoted on `/ueber-uns`. The row's *use instead* column is
**empty**, and `specs/glossary/glossary.md` states what an empty cell means:
*"a gap on the record, not a licence to invent one"*. A build failure with no
replacement forces exactly that invention, against working rule 4. So the
claim as a claim fails, the adverb stays with review (`TS-WEB-0006-A16`), and
the guide's §9 keeps an owner either way.

Two smaller calls in the same table: the postcode row (`GL-0012`, `DEC-0079`)
exempts the route `order`, which is the order flow `DEC-0079 §7` and
`TS-WEB-0025 D3` name and the only place a buyer draws a boundary rather than
naming her village; and `Vereinswebseite` is matched together with
`Vereinswebsite`, the spelling the artifact actually used, because one word
under two spellings is one rule.

### 5. The register row: position decides, and the exemption is one route

A capitalised `Sie`, `Ihnen`, `Ihre*` **mid-sentence** fails, and so does an
imperative `<Verb> Sie`. A form at the start of a sentence, of a clause opened
by a dash, or inside an opening quotation mark **passes**, because German
capitalises a sentence opening and both of the tree's two candidates are the
register this site writes, not the one it forbids:
*"Die Termine oben tippt niemand bei uns ein. **Sie** kommen von den
Vereinen"* is the plural pronoun, *"**Ihr** könnt selbst bestimmen"* is the
informal plural. A lint that flagged those would be deleted within a week.

The exemption is `REGISTER_EXEMPT_ROUTES = ["legal"]` — a route list in one
place, never a field name and never a flag in a content file
(`copy-contract.md` `CG-003`, `TS-WEB-0029-A15`). Two limits are recorded
rather than hidden: `CG-002`'s other half — one field mixing `du` and `ihr` —
is not implemented, because the context band addresses `deinen Verein` and
`eurer eigenen Website` in one block by design and the rule needs the
whole-block judgement the contract assigns to review; and the five imported
legal bodies under `content/legal/` are outside the page-artifact scan
altogether, so their formal register is passed by scope as well as by
exemption.

### 6. `CG-038` counts per locale, and case-sensitively

`copy-contract.md` reads *"`Portalize` occurs in exactly one content field
across all locales"*. Taken literally that fails the `en` mirror `CG-041`
requires, so the count is **one field per locale**, in the
`dein-kalender-4-tiers` slot of `/dein-kalender` (`DEC-0052 §1`,
`FUN-WEB-0132`, `DEC-0131 §3`) — one occurrence per reader, which is what
`DEC-0052 §1` decides. The pattern is case-sensitive: `portalize-calendar` in
a table cell is an offering id in a data column, not the product name in copy.

### 7. The eleven repairs the rows found, and where their words come from

The three rows failed fourteen fields of the shipped tree. No sentence here is
new: each repair is either the guide's own *use instead* column — which
`T-17`'s brief names as its copy source — or the words already in the field,
with the question turned into the statement `CG-005` asks for.

| Where | Was | Is | Source |
| --- | --- | --- | --- |
| `dein-ort/starten` slot 5 `Überschrift` / `Heading` | *Falsch getippt? Nochmal suchen* | *Nochmal suchen* | the field's own statement half |
| `deine-region` slot 2 `Überschrift` / `Heading` | *Was ist in meiner Nähe? Bei Landkreisgröße …* | *Bei Landkreisgröße keine Frage für eine Liste* | the field's own statement half |
| `deine-region` slot 1 `Abschluss-Überschrift` / `Closing heading` | *Sollen wir euch ein Angebot rechnen?* | *Wir rechnen euch ein Angebot* | the same words, as a statement |
| `dein-kalender/bestellen` step 3 | labelled `Überschrift` / `Heading` | labelled `Frage` / `Question` | **no copy change** — step 1 of the same file labels its reader-directed question that way (`CG-006`) |
| `ueber-uns` `Dorfargument 2` | *das die Leute gerne benutzen* | *das die Nachbarn gerne benutzen* | `CG-040` replacement column (`CG-009`) |
| `mitmachen/en` objection 1 | *reach the people who already know you* | *reach whoever already knows you* | the German sibling, *"erreichen die, die euch schon kennen"* (`CG-041`) |
| `dein-kalender` `Quellen` / `Sources` | *Vereinswebsite* · *club website* | *eure eigene Website* · *your own website* | `CG-040` replacement column |
| `dein-kalender` `Produktname` / `Product name` | *Das Produkt hinter diesem Kalender heißt Portalize.* | *Der Kalender unter eurem Namen heißt Portalize.* | `DEC-0052 §1`: *"one sentence saying the calendar under your name is called Portalize"* |

The closing heading of `/deine-region` is authored copy the page reads
(`fieldAt(focus.blocks, 5)`), so its typed fallback in
`app/[lang]/deine-region/page.tsx` and the expectation in
`e2e/pages/deine-region.spec.ts` were moved with it — three lines, so that the
rendered page and the artifact do not disagree. All eight repairs carry a
`state/open.md` row: none of them is a sentence the owner wrote, and a heading
nobody confirmed is a placeholder even when every word in it is his.

### 8. `check:terms` joins the chain, and the gallery stops writing the promise

`TS-WEB-0026-A8` has two clauses and the second one — *"the wording exists in
exactly one module"* — was failing on `next-2026`: the component gallery and a
component test wrote *"Antwort innerhalb von zwei Werktagen"* into their own
files. The gate is not in the `check` chain, so nothing said so. Both call
sites now pass a placeholder string, `pnpm check:terms` runs between
`check:seo-budget` and `check:api-routes`, and `RESPONSE_PROMISE_TEXT` stays
the only place the promise may be written — which is the point of `D5`'s
*"removed, never softened"*.

### 9. The record number

`T-17`'s brief asks for `DEC-0129`. That number was taken by `T-11` on
2026-09-26 (*the scene carries the module …*), and no number is ever reused
(`AGENTS.md`, the identifier rule). This record is `DEC-0136`, the number the
round reserved for this task. The owner defaults this task inherits are the
placeholder convention of default 3 — a string nobody wrote is marked and gets
a `state/open.md` row — and default 14's rule that every engineer records
their own choices in one record with a README index line.

## Consequences

- `pnpm check:content` fails on eight `SRC-0017` rules it ignored yesterday.
  `TS-WEB-0006-A8`, `TS-WEB-0007-A13`, `TS-WEB-0018-A7`, `TS-WEB-0029-A15` and
  `TS-WEB-0026-A8` are met; `validate.test.ts` carries a passing **and** a
  failing fixture per row, and the failing half is as important as the other.
- The next artifact that writes a question into an `Überschrift` field, a
  `Sie` outside `/rechtliches`, or the product name in a second field cannot
  merge. The next one that writes real copy as a bare paragraph is not caught
  — §1 names that cost.
- `specs/glossary/glossary.md` now has a test behind its avoid column: adding
  an italicised term there fails `pnpm test` until `AVOID_TERMS` carries it.
  That is the enforcement `DEC-0080 §4` asks for ("every rule has an owning
  mechanism"), and the guide's §9 is no longer advice.
- Four section titles and four copy fields changed in five page artifacts that
  other tasks of this round own. Every one is on `state/open.md` and in the
  task report, so an owner who disagrees has the list in one place.
