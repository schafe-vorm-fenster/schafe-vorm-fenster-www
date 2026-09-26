---
id: DEC-0142
title: A note says so, and position decides nothing — copy is everything a slot authors, the marker is the only exclusion and may not cover what a page renders, and the coverage gain is written down
status: DRAFT
date: 2026-09-26
decided_by: the engineering team
---

## Context

`DEC-0136` shipped the three copy-lint rows of `TS-WEB-0007 D12` (11 glossary
conformance, 13 copy structure, 14 register) and drew one boundary by position:
*a list or table whose nearest preceding block is a paragraph is part of the
authoring note, not copy.* The rule exists for a real case —
`content/pages/dein-kalender/{de,en}.md` carries *"**Kein „im Amt"** im
Benefit-Band — CG-036"* as a bulleted note, and a gate that fails a slot for
explaining itself teaches authors to stop explaining.

The QA round measured what else that boundary let through. Item 5 of
`ueber-uns-3-proof-stream`, mutated to contain both an avoid-list phrase and the
product name, produced `checkCopy() = []` and `checkProductName() = []` — and
those items are **rendered**, by `app/[lang]/ueber-uns/page.tsx:156`. `DEC-0136
§1` had named a cost ("real copy that a future artifact writes as a bare
paragraph is not linted") that was not hypothetical and not the real one: the
hole was in the tree already, in eight blocks, and the record asserted the
boundary was safe.

The **second** QA round measured the same boundary one step further and found
the other half of it still open: `copyOf()` skipped *every* paragraph
unconditionally, and six of those paragraphs are rendered page copy —
`/dein-kalender` and `/en/your-calendar` read three each by index. The mutation
that proved it: `content/pages/dein-kalender/de.md` lead paragraph rewritten to
*"Die Leute und das Produkt kommen, wie sie reinkommen — und landen trotzdem
alle auf eurer Vereinswebseite."* — three avoid-list terms — passed
`pnpm check:content` with EXIT=0. The same three terms in a list item of the same
tree fail with three errors. Position had stopped deciding for lists and tables
and still decided for paragraphs, and `src/lib/content/README.md` stated as fact
that a paragraph "is the authoring note that says where the copy came from",
which was false for those six.

Two further things arrived with the first of the two rounds. `pnpm check:coverage` joined the
`check` chain on `next-2026` (`DEC-0141`), so a tally that moves must be written
into `specs/verification/coverage-budget.json` in the same commit — including
when it improves. And `next-2026` moved the closing block of `/deine-region`
off-site → in-page (`DEC-0081 §3`), which collides in the same slot with this
task's relabelling of the closing field.

## Decision

### 1. Copy is everything a slot authors; the only exclusion is a marker the slot writes, and it ends at the next field

`copyOf()` (`src/lib/content/validate.ts`) reads a slot's field values, its
**paragraphs**, and the list items and table cells that belong to a field of the
same slot. A field binding carries across any paragraph between the field and the
block — the five proof items under *"Pool: der volle `proof`-Bestand …"* are the
content of `Überschrift`, because that is what the page renders them as — and a
paragraph carries the same label, never the title role: prose under
`**Überschrift:**` is the lead below the heading, so `CG-005`'s question mark row
stops at the field.

Shape decides nothing, and position decides nothing. Two things are still not
copy, and both say so themselves:

- a field **label**, a slot-internal name (`DEC-0136`);
- an **annotation comment** — `<!-- source_note: … -->`, `<!-- clearance: … -->`.
  `parseBlocks` emits no block for one at all, over as many lines as it spans.
  Until this round such a comment became a paragraph, which both fed the lint an
  annotation (`home-1-search-hero`'s `source_note` says the word `Postleitzahl`
  is *gone*, and was reported as using it) and put an unrendered block into the
  paragraph index a page counts.

The exclusion is explicit. A slot that writes `<!-- note -->` — with an optional
reason after the word, in the `<!-- key: value -->` annotation shape the
artifacts already use — opens a note region that runs **to the next
`**Label:**` field, or to the end of the slot**; the paragraphs, lists and tables
inside it are parsed with `note: true` (`src/lib/content/blocks.ts`,
`ContentBlock`) and the lint passes over them. A field is where authored copy
starts again, so the hatch closes by itself: `dein-kalender-4-tiers` carries one
note per tier and marks each of them without reaching the next tier's words. That
is narrower than the first version of this rule, which ran to the end of the
slot.

Why a marker and not a cleverer heuristic: the parser cannot see a render, and
every positional rule is a guess about intent that fails silently in one
direction. A marker is a sentence the author writes, in the file, that a
reviewer can read.

**Measured**, both directions:

- `pnpm check:content` → *Content pipeline is valid (TS-WEB-0007 D12) — rows 11,
  13 and 14 measured: TS-WEB-0007-A13 (glossary conformance), TS-WEB-0006-A8
  (copy structure), TS-WEB-0029-A15 (register).* — EXIT=0.
- round 1's probe: item 5 of `ueber-uns-3-proof-stream` mutated to *"Portalize
  und die Leute im Amt: …"* → **3 errors** (`avoid-list` `die Leute`,
  `avoid-list` `im Amt`, `product-name`), where the same mutation produced none
  before.
- round 2's probe (`M7`): the rendered lead paragraph of
  `dein-kalender-3b-embed-config` mutated to *"Die Leute und das Produkt kommen,
  wie sie reinkommen — und landen trotzdem alle auf eurer Vereinswebseite."* →
  **3 errors** (`CG-009` `Die Leute`, `CG-039` `das Produkt`, `CG-040`
  `Vereinswebseite`), each naming `(paragraph)` and the field it belongs to,
  where the same mutation passed with EXIT=0 before.
- the fourteen rendered blocks that position exempted are scanned and clean —
  the four lists and tables of round 1 plus the three `/dein-kalender` paragraphs
  in both locales. They are enumerated in `src/lib/content/README.md` with the
  render site of each, and in `RENDERED_BLOCKS` in code (§6).
- ten authoring notes across six artifacts carry the marker now, because they
  quote a forbidden term or the product name in order to forbid or to record it:
  `home-8-proof-stream`, `mitmachen-2-objections`, `dein-kalender-1-focus`,
  `dein-kalender-2-contrast`, `dein-kalender-3b-embed-config`,
  `dein-kalender-4-tiers` (tier 2) and `ueber-uns-1-origin`, in both locales.

One shape cannot be marked: a note that stands above rendered copy of the same
slot, before that copy's field. `home-8-proof-stream`'s pool sentence is one, and
it is read as copy — it passes, because it quotes nothing forbidden. An unmarked
note being linted is the safe direction; the other direction is what §6 forbids.

`DEC-0136 §1` is corrected rather than quietly superseded: it now says what it
first claimed, what was wrong with the claim, and that this record replaced the
rule. No `state/open.md` row is added for either half of the hole, because both
are closed; the two rows about the lint's *deliberately* unimplemented halves
(`276`) and about `TS-WEB-0018-A7` (`277`) stand.

### 2. Two shared files are touched, minimally, because the marker has to be parsed

`src/lib/content/blocks.ts` gains the marker (one regex, one flag, four lines in
the three flush functions), the annotation-comment skip and the one line that
closes a note region at a field; `src/lib/content/types.ts` gains `note?: boolean`
on the `paragraph`, `list` and `table` variants. Neither file is owned by a task in the backlog.
The alternative — a `**Hinweis:**` field as the marker — needed no parser change
but would have inserted a field into a slot whose page reads fields by index
(`fieldAt`), which is the more dangerous edit of the two.

Nothing renders the marker or an annotation comment: neither is a block. The
paragraph sequence a page reads (`configParagraphs`,
`app/[lang]/dein-kalender/page.tsx:197`) is unchanged for every shipped artifact
— measured on the served HTML, not argued: `curl -s
http://localhost:3250/dein-kalender` still carries *"Die Termine kommen, wie sie
reinkommen"* and *"Auch Termine von Vereinen …"*, and `/en/your-calendar` their
English siblings.

### 3. The coverage gain is recorded, and it is a gain in the instrument, not in the truth

`specs/verification/coverage-budget.json` goes to `MISSING: 146` (from 149) and
`NAMED ONLY: 31` (from 32). Both numbers *fell*, and `DEC-0141`'s ratchet fails
an unrecorded improvement exactly as it fails a regression. What moved:

| Criterion | Before | After | Why |
| --- | --- | --- | --- |
| `TS-WEB-0006-A8` | MISSING | VERIFIED | test titles in `src/lib/content/validate.test.ts` |
| `TS-WEB-0029-A15` | MISSING | VERIFIED | test titles, same file |
| `TS-WEB-0018-A7` | MISSING | VERIFIED | test titles (`validate.test.ts`, `e2e/copy-structure.spec.ts`) — **and the criterion is still not met**, see §4 |
| `TS-WEB-0007-A13` | NAMED ONLY | METERED | it declares level `tool`, and `scripts/check-content.ts` — the chain meter that *is* that tool for glossary conformance — now names it in its output |

No budget number was raised. `scripts/check-coverage.ts` says a `tool`
criterion is metered by "a chain meter that drives the external tool", and for
row 11 the chain meter is the tool: there is no external service to call, the
avoid list and the product-name count are decided by `pnpm check:content`. The
id sits in the finding line (`[avoid-list, TS-WEB-0007-A13]`) rather than in a
comment, because a meter has no test title to carry it.

### 4. `TS-WEB-0018-A7` is closed by its instrument and open in fact, and the register carries that

A7 reads *"`/dein-kalender` is the only route whose body may contain one, at
most once"*. Measured over all 24 route/locale pairs: 1 on `/dein-kalender` and
`/en/your-calendar`, **7 on `/rechtliches` and `/en/legal`**, 0 elsewhere
(`content/legal/`: `privacy-policy.md` 3, `dpa.md` 2, `terms-of-use.md` 2). The
rendered check exempts the route `legal` and says why; the exemption keeps the
test honest about what it measures and does not make the criterion true.

`CONF-0027` (`direct_contradiction`, OPEN, `involved: [TS-WEB-0018, DEC-0012]`,
`decision_record: DEC-0136`) is where the contradiction lives, because the
conflict register is this repository's channel for two statements that cannot
both hold — not a section of a decision record and not a row of `state/open.md`
alone. **This task reports A7 as not met**, whatever the coverage table counts,
and `state/open.md` row 277 is the owner's view of the same fact.

### 5. The `/deine-region` closing field keeps both sides of the merge

`next-2026` removed the hero's outbound note from `deine-region` slot 1 with the
in-page booking CTA (`DEC-0081 §3`), which moved the closing field from field 5
to field 4. This branch had relabelled that field `Abschluss-Frage` /
`Closing question` to keep the owner's question — *"Sollen wir euch ein Angebot
rechnen?"* / *"Shall we put a quote together for you?"*
(`plan/polish-brief.md` §8 item 7) — under a label that matches the render
(`ClosingCta` sets it as a `<p>`, `src/components/closing-cta/closing-cta.tsx:155`).
The merge keeps both: the field is `Abschluss-Frage`, it is read at index 4, and
the note line in each artifact names the render site. `DEC-0136 §2` and §7 and
`state/open.md` row 273 already describe the relabel; nothing there changed.

### 6. The marker may not cover a block a page renders, and code holds the list

The hatch needed a guard: nothing in the markup says whether a page renders a
block, so a marker placed above rendered copy would silence rows 11, 13 and 14
over sentences a visitor reads — exactly what the positional rule did.
`RENDERED_BLOCKS` in `validate.ts` carries the render sites
`src/lib/content/README.md` names (slot, block kind, index counted the way the
pages count it, and the render site), and `checkNoteMarker()` fails a marked
block that matches one.

**Measured**: round 2's probe (`M6`), a `<!-- note: escape hatch probe -->`
inserted above the rendered archive table of `archiv-2-rows-demo` → *"the
`<!-- note -->` marker covers table 0 of this slot, and
`app/[lang]/ueber-uns/archiv/page.tsx:95` renders it"*, EXIT=1, where the same
insertion passed with EXIT=0 before. `validate.test.ts` runs the probe over all
seven entries of `RENDERED_BLOCKS` and over the shipped placement.

The guard is a list, and a list can fall behind the pages. It is checked where a
render site is checkable — every entry names a file and a line — and a slot no
page reads by index is outside it by construction.

### 7. The product name is counted as occurrences, not as carrier fields

`checkProductName()` counted distinct carrier fields, so `Portalize bleibt
Portalize` inside the one allowed field passed the static half while the rendered
half (`e2e/copy-structure.spec.ts`, body count ≤ 1) failed it. A lint that passes
what the browser fails is worse than no lint, so the row counts matches per
field value and sums them per carrier.

**Measured**: round 2's probe (`M8`), `**Produktname:** … heißt Portalize, und
Portalize bleibt Portalize.` → *"`Portalize` stands 3 times in one field of the
`de` locale"*, EXIT=1, where it passed with EXIT=0 before. Two shipped notes that
quote the name in order to record its one place carry the `<!-- note -->` marker
as a consequence (`dein-kalender-4-tiers`, both locales) — they are notes, and
they now say so.

### 8. The territory question is asserted, not assumed

`/deine-region`'s `gebietsfrage` section reads the owner's question from field 2
of `deine-region-2-territory` with the dictionary kicker as a silent fallback
(`app/[lang]/deine-region/page.tsx`), and the field index in that very file moved
once during the merge (§5). `e2e/pages/deine-region.spec.ts` now asserts, in both
locales, that the kicker is *"Was ist in meiner Nähe?"* / *"What's near me?"* and
the `h2` the statement above which it stands — so a field-order change fails
loudly instead of falling back.

**Measured**: `PORT=3250 pnpm e2e e2e/pages/deine-region.spec.ts
e2e/copy-structure.spec.ts` — see the task report for the run.

## Consequences

- One convention is added to the content tree: `<!-- note -->` above authoring
  prose that must not be linted. Ten notes in six artifacts use it today. An
  author who forgets it gets a finding on a note; an author who abuses it over
  rendered copy gets a `note-marker` finding (§6) — which is why the marker is a
  visible line in the file rather than a facet in the frontmatter.
- `ContentBlock` carries an optional field that only the lint reads. A renderer
  may later use it to keep note prose off the page; nothing does today.
- The copy lint now reads 14 rendered blocks it did not read before, among them a
  192-cell table, and every paragraph of every artifact. `pnpm check:content`
  stays under a second (31 ms measured).
- Writing an authoring note is no longer free: a note that quotes a forbidden
  term needs the marker, or the term goes. That is the point of the rule, and it
  is the cost of it.
- `state/open.md` rows 266–270 of this branch became **273–277** at the merge
  (T-15 took 266, T-20 267–270, the coverage gate 271–272).

## Open

- `TS-WEB-0018-A7`: not met on the render, `CONF-0027`, owner row 277.
- The lint's two deliberately unimplemented halves stay as they were: `CG-002`'s
  second half (one field mixing `du` and `ihr`) and the imported legal bodies
  under `content/legal/`, which no page scan reaches (row 276).
- `check:specs` W3 and `check:coverage` still measure the same thing with
  different strictness (`DEC-0141 §7`, row 271). Untouched here.
