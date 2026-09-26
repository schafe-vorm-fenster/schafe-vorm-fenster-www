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

**The label is the contract, and a label can be wrong — the repair is then the
label, never the words.** An artifact is a text file: `fieldRole()` cannot see
whether the page sets a field as an `h2` or as a paragraph, so a field labelled
`Überschrift` that the page renders as prose is typed here as a section title
and reported. The first repair taken in this task got that backwards.
`dein-ort-starten-5-search` field 0 carries the polish brief's own quiet line
under the closing CTA — *„Falsch getippt? Nochmal suchen"* / *"Mistyped? Search
again"*, `plan/polish-brief.md` page 3 fix 3, rendered as a `<p>` in
`app/[lang]/dein-ort/starten/page.tsx` — and the first repair cut the owner's
question to satisfy the row. The field is now labelled `Frage` / `Question`, the
words are back, and three things keep the mistake from repeating: the finding's
message names the two legal repairs (author a `Kicker`, or relabel the field)
and says in so many words that the words are not to be dropped;
`validate.test.ts` asserts that message; and the **rendered** half of `CG-005`
is checked where the render exists (§10).

The same mistake stood a second time in the same task and was caught by the
second review, not by this record: `deine-region-1-focus`'s closing field was
labelled `Abschluss-Überschrift` / `Closing heading` and the first two passes
rewrote the owner's *„Sollen wir euch ein Angebot rechnen?"* into a statement
nobody wrote. `ClosingCta` renders that field as a `<p>`
(`src/components/closing-cta/closing-cta.tsx:155`), never as an `h2`, so it is
the `dein-ort-starten-5-search` case exactly, and the repair is the same one:
the field is labelled `Abschluss-Frage` / `Closing question` and carries the
brief's question again (§7). The rule therefore has a stronger form than *"a
label can be wrong"*: **where the render is a paragraph, a question in the field
is not a defect at all, and rewriting the sentence is the defect.** Four fields
of this tree are labelled `Abschluss-Überschrift` / `Closing heading` and every
one of them reaches the same `<p>`; the label stays on the three that carry a
statement because no rule is asking anything of them, and the one that carries a
question says why it is labelled a question, in its own note line.

### 3. The avoid list is a table in `validate.ts`, bound to the glossary by a drift test

`CG-040` sources the list from three places: the guide's German table, its
English mirror, and the **avoid** column of `specs/glossary/glossary.md`.
Parsing the glossary at lint time would look like the stronger single source
and is not: the column's terms carry exemptions and scopes in prose
(*"on every **search** surface"*, *"outside the one sentence"*) that no parse
recovers, and the lint would silently drop them. `AVOID_TERMS` is therefore an
explicit table with a `rule`, a `pattern`, the guide's *use instead* column and
a scope, and `validate.test.ts` fails when the glossary grows an italicised
avoid term the table does not match. Since the `T-17` review it fails on all
**three** sources, not one: a second test parses the two tables of the guide's
§9 between the `### CG-040` and `### CG-041` headings, strips each row's own
scope note (*(as a title)*, *(about this product)*) and asserts a pattern for
every term — 39 terms today, all matched. A row added to either table now fails
`pnpm test` instead of passing unnoticed. `Portalize` is on both source lists and
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
| `dein-ort/starten` slot 5 | labelled `Überschrift` / `Heading`, *Falsch getippt? Nochmal suchen* | labelled `Frage` / `Question`, **same words** | **no copy change** — the page renders the field as the quiet line under the closing CTA (`plan/polish-brief.md` page 3 fix 3), so the label was the defect (§2) |
| `deine-region` slot 2 | `Überschrift`: *Was ist in meiner Nähe? Bei Landkreisgröße keine Frage für eine Liste* | `Kicker`: *Was ist in meiner Nähe?* · `Überschrift`: *Bei Landkreisgröße keine Frage für eine Liste* | **no word dropped** — `CG-005`'s own split: the kicker carries the question, the title the statement. `app/[lang]/deine-region/page.tsx` reads the authored kicker (`fieldAt(territory.blocks, 2)`) with the dictionary word as fallback, the way `/`, `/mitmachen` and `/dein-ort/starten` already read theirs |
| `deine-region` slot 1 | labelled `Abschluss-Überschrift` / `Closing heading`, *Sollen wir euch ein Angebot rechnen?* | labelled `Abschluss-Frage` / `Closing question`, **same words** | **no copy change** — `ClosingCta` renders the field as a `<p>` (`src/components/closing-cta/closing-cta.tsx:155`), so the label was the defect (§2); the wording is `plan/polish-brief.md` §8 item 7 |
| `dein-kalender/bestellen` step 3 | labelled `Überschrift` / `Heading` | labelled `Frage` / `Question` | **no copy change** — step 1 of the same file labels its reader-directed question that way (`CG-006`) |
| `ueber-uns` `Dorfargument 2` | *das die Leute gerne benutzen* | *das die Nachbarn gerne benutzen* | `CG-040` replacement column (`CG-009`) |
| `mitmachen/en` objection 1 | *reach the people who already know you* | *reach whoever already knows you* | the German sibling, *"erreichen die, die euch schon kennen"* (`CG-041`) |
| `dein-kalender` `Quellen` / `Sources` | *Vereinswebsite* · *club website* | *eure eigene Website* · *your own website* | `CG-040` replacement column |
| `dein-kalender` `Produktname` / `Product name` | *Das Produkt hinter diesem Kalender heißt Portalize.* | *Der Kalender unter eurem Namen heißt Portalize.* | `DEC-0052 §1`: *"one sentence saying the calendar under your name is called Portalize"* |

Two of these were repaired twice. The first pass read the row as *"remove the
question"* and deleted owner wording on `/dein-ort/starten` and `/deine-region`;
the review caught both, and the repairs above are the second pass — a label on
one, `CG-005`'s kicker split on the other. `/deine-region` slot 2 also keeps its
English mirror whole (*"At county scale, **that's** not a question for a list"*),
because with the question restored above it the deictic has its referent back:
the truncated title read *"not a question"* with nothing to point at, while the
sentence under it still answered a question the page no longer asked.

The closing question of `/deine-region` is authored copy the page reads
(`fieldAt(focus.blocks, 5)`), so its typed fallback in
`app/[lang]/deine-region/page.tsx` and the expectation in
`e2e/pages/deine-region.spec.ts` move with it — three lines, so that the
rendered page and the artifact do not disagree.

That field took three passes, and the first two are the lesson. The first pass
cut the question; the second pass (this record's earlier version) kept the cut,
called the result *"the same words as a statement"*, and left the open question
open on the grounds that the slot has no kicker to move the question into. Both
are wrong for one reason: **the slot needs no kicker, because the field is not
rendered as a title.** The second review measured it — `#closing-cta` on
`/deine-region` renders `<p class="…closing-cta-module…heading">`, and the
route's four `h2`s are elsewhere — and the relabel passes the lint exactly as it
does on `/dein-ort/starten`. So **no statement in this table is one nobody
wrote**: every repair is either the guide's *use instead* column, a `CG-005`
split, or a label. No slot of this task carries `provenance: generated` +
`demo: true`, because no sentence was written.

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
(`AGENTS.md`, the identifier rule). This record is `DEC-0136`, the number this round's task
assignment reserves for `T-17` (the number is handed to the task with its
worktree and its e2e port, the same way `T-14` was handed `DEC-0132`).
The numbers between the last merged record and this one belong to the other
tasks of this wave and are left untouched; `backlog.json` carries no allocation
table, so the reservation lives in the task assignment and nowhere else, and the
number is confirmed against the wave before the merge rather than claimed here. The owner defaults this task inherits are the
placeholder convention of default 3 — a string nobody wrote is marked and gets
a `state/open.md` row — and default 14's rule that every engineer records
their own choices in one record with a README index line.

### 10. The rendered halves live in `e2e/copy-structure.spec.ts`

Two of the five criteria have a half no artifact can answer, and both are now
checked against the rendered page — a new spec file, so that no other task's
spec had to be edited for it:

- **`CG-005` / `TS-WEB-0006-A8`** — no `h2` a visitor reads is a question, on
  every `TS-WEB-0004` D1 route in `de` and `en`. This is the half the static
  row cannot see, and it is the half that decides: a form step's question to
  the reader is that step's `h1` (`/dein-kalender/bestellen`, `CG-006`) and the
  hero headline is exempt (`CG-020`), so a question in an `h2` is the defect and
  a question in a paragraph is not. Measured on the tree: 24 routes green.
- **`TS-WEB-0018-A7`** — header, footer and context band of every D1 route
  render without the product name in both locales, and only `/dein-kalender`
  carries it in its body, at most once. `checkProductName` counts artifact
  fields; the chrome is not in an artifact.

`/rechtliches` is exempt from the body count, and that is a conflict, not a
fix: `content/legal/{privacy-policy,terms-of-use,dpa}.md` name „Portalize"
seven times as the contractual product (privacy-policy.md:91,
terms-of-use.md:99, dpa.md:54). Those bodies are imported verbatim
(`DEC-0012`, `DEC-0027`) — which is why the same route is the register row's
one exemption (`TS-WEB-0029 D6a/A15`) — and `TS-WEB-0018-A7`'s wording carries
no such exemption. The spec is not amended here and no legal text is edited.

**The channel for that is the conflict register, not this section.** A
contradiction between two statements is a `CONF-####` record
(`specs/conflicts/README.md`: *"a conflict is a contradiction between two
statements"*), and `CONF-0018` is the near-identical precedent — a criterion
demanding a question heading against `CG-005`. The contradiction is therefore
raised as **`CONF-0027`** (`direct_contradiction`, `OPEN`, impact Medium,
`involved: [TS-WEB-0018, DEC-0012]`, `decision_record: DEC-0136`), with the
exemption and its reason in `e2e/copy-structure.spec.ts` and the owner row in
`state/open.md` (row 270).

**`TS-WEB-0018-A7` is therefore not met on the render, and this task does not
report it as met.** Its content half holds (`checkProductName`, four unit
tests) and its chrome half holds on all 24 route/locale pairs; its body clause
is contradicted by two shipped routes, and closing it needs either an amended
criterion or a legal text nobody here may edit. The test's exemption keeps the
other twenty-two pairs under guard in the meantime; it does not make the
criterion true.

## Consequences

- `pnpm check:content` fails on eight `SRC-0017` rules it ignored yesterday.
  `TS-WEB-0006-A8`, `TS-WEB-0007-A13`, `TS-WEB-0029-A15` and `TS-WEB-0026-A8`
  are met; `validate.test.ts` carries a passing **and** a failing fixture per
  row, and the failing half is as important as the other. `TS-WEB-0018-A7` is
  **not** met: both halves are now under test, and the body clause fails on
  `/rechtliches` and `/en/legal` for a reason no engineer may remove
  (`CONF-0027`, §10).
- The next artifact that writes a question into an `Überschrift` field, a
  `Sie` outside `/rechtliches`, or the product name in a second field cannot
  merge. The next one that writes real copy as a bare paragraph is not caught
  — §1 names that cost.
- `specs/glossary/glossary.md` now has a test behind its avoid column: adding
  an italicised term there fails `pnpm test` until `AVOID_TERMS` carries it.
  That is the enforcement `DEC-0080 §4` asks for ("every rule has an owning
  mechanism"), and the guide's §9 is no longer advice.
- One section title and four copy fields changed in five page artifacts that
  other tasks of this round own; two further slots changed only their **label**
  or gained a `Kicker` field, with no word removed. Every one is on
  `state/open.md` and in the task report, so an owner who disagrees has the
  list in one place. `content/pages/deine-region/**` and
  `app/[lang]/deine-region/page.tsx` are owned by `T-18` and `T-15` of the same
  round: `T-17` merges after `T-12`, `T-15` and `T-16`, and the `/deine-region`
  hunks are coordinated with `T-18` before it.
- A copy lint that reads labels can misread one, and the cost of misreading is
  paid in the owner's words. The message now prescribes the two repairs, the
  test pins the message, and `e2e/copy-structure.spec.ts` judges the render.
