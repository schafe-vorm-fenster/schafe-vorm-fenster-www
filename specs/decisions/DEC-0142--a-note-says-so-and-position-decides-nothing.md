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
and `state/open.md` row 278 is the owner's view of the same fact.

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
`state/open.md` row 274 already describe the relabel; nothing there changed.

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

The guard is a list, and a list can fall behind the pages. **It had.** QA round 4
measured seven rows against twelve slots `app/**` reads, two of the five missing
ones already carrying a marker — §10 is the answer, and it removes the sentence
that used to stand here (*"checked where a render site is checkable"*): the list
is measured against the pages now, not read against them by hand.

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

### 9. The false green goes, and the budget number that moves says which criterion was let go

Round 3 left `TS-WEB-0018-A7` counted **VERIFIED** by `pnpm check:coverage`
because a unit-test title named it, and reported in the same breath that the
criterion is not met on the render. QA round 4 named that for what it is: a false
green inside the repository's own verification instrument, in the one place a
reader goes to ask what is covered. A note in `coverage-budget.json` does not
undo a green line in the table.

So the title goes. `src/lib/content/validate.test.ts` now reads *"D12 row 11: the
product name appears once in the artifacts (CG-038)"* — `CG-038` over the content
artifacts is what that suite proves, and a comment above it says why the
criterion's id is deliberately absent. Nothing about A7 changed in fact: it is
the spec owner's through `CONF-0027` (`direct_contradiction`, OPEN,
`recommended_action: NEW_VERSION`) and `state/open.md` row 278, and `§4` stands.

**Measured**: `pnpm check:coverage` → *430 criteria · 251 verified · 1 metered ·
0 attested · 32 NAMED ONLY · 146 missing*, and the run **failed** first: *"ERROR
NAMED ONLY rose from 31 to 32. The backlog may only shrink … or say in a decision
record why the budget moves."* The number moved with this record, which is the
governance `DEC-0141` asks for, and the criterion let go is named here and in
`specs/verification/coverage-budget.json`: `TS-WEB-0018-A7`. A7 does not fall to
MISSING — `e2e/copy-structure.spec.ts` names it in comments, which is NAMED ONLY,
*"the id is in a runner file but in no test title — not coverage"*. That is an
honest verdict: the e2e case does assert a body count, with `/rechtliches`
exempted, and an exemption the criterion does not grant may not be titled with
the criterion's id.

### 10. The render-site registry is measured against `app/**`, not kept by hand

`RENDERED_BLOCKS` (§6) is the list the `<!-- note -->` marker may not cover, and
§6 admitted it could fall behind the pages. It had: seven rows, while `app/**`
reads twelve slots off their blocks — and two of the five missing slots,
`home-8-proof-stream`'s candidate list and `mitmachen-2-objections`' two
columns, **already carry a marker**, so the escape hatch could still do what the
positional rule did.

Three things change:

1. The registry carries every read site: 26 rows over twelve slots, each naming
   the `file:line` that reads the block (`app/[lang]/page.tsx:186`,
   `…/mitmachen/page.tsx:228`, `…/dein-kalender/content.ts:58`, …). What the page
   does with the block afterwards goes in a parenthesis.
2. `index: "all"` is a row for a page that reads *every* block of a kind
   (`listItems(slot.blocks)` on the two proof slots and the two `registrieren`
   option lists) — there no single index is safe.
3. **The incompleteness fails.** Three drift tests in `validate.test.ts` read
   `app/**` themselves: a slot a page reads by index or through one of the
   declared helpers (`listAt`, `listsOf`, `listItems`, `settingRows`,
   `tierChecks`, `comparisonLabels`, `titlesFromRegistryTable`, `firstTable`)
   with no row fails; a row whose `file:line` no longer reads blocks fails, so a
   stale row cannot sit in the registry unnoticed; and a
   `block.kind === "list" | "table" | "paragraph"` read that neither a row nor a
   declared helper accounts for fails. A `field` read is not one of them: a field
   ends a note region, so no marker ever reaches it.

**Measured**: QA's probe `M4` — the marker of `content/pages/home/de.md` moved
above the candidate list and rendered item 5 poisoned with `die Leute` +
`Postleitzahl` — now gives *"1 error(s) … [note-marker] the `<!-- note -->`
marker covers list 0 of this slot, and `app/[lang]/page.tsx:186` renders it"*,
where QA measured *0 error(s), EXIT=0* before. The shipped tree is unchanged:
`pnpm check:content` → *0 error(s), 28 warning(s)*, every one of the fourteen
markers standing below the blocks its page reads.

### 11. The pre-slot preamble is authoring prose, and the lint says so in writing

A page artifact opens with a header note between its frontmatter and its first
`<!-- id: … -->` slot, and that note quotes forbidden terms in order to forbid
them — `content/pages/dein-kalender/de.md:3` says „Portalize" falls on that page
*exactly once*, `content/pages/mitmachen/de.md:3` says the name belongs nowhere on
that one. QA round 4 found it unlinted and undocumented.

It stays unlinted, and it is now documented as a region rather than an oversight.
Scanning it as copy would fail the build over the two sentences that forbid the
words they quote — the marker's own case, above the first slot, where no marker
can be written. It is safe because it is unreachable: `parsePage` binds copy to
slots and carries no text outside them, so no page can render the preamble.
`src/lib/content/README.md` names it beside the field label and the annotation
comment, and `validate.test.ts` carries the fixture: a preamble with `die Leute`,
`Postleitzahl` and `Portalize` in it yields no finding and no `copyOf` entry,
while the same words one line below the slot marker yield two `avoid-list`
errors.

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
- The coverage table loses a green line: 252 verified → **251**, NAMED ONLY 31 →
  **32**, and `specs/verification/coverage-budget.json` carries the raise with
  the criterion it let go (§9). The tally is worse and the record is truer.
- A page that starts reading a new slot's blocks by index now has to add a row to
  `RENDERED_BLOCKS`, and the test says which line made it necessary (§10). That
  is a cost on every future page, and it is the only thing that keeps the marker
  from silencing rendered copy.
- `package.json`'s `dev` script honours `PORT` again (`next dev --port
  ${PORT:-3100}`): it hard-coded `PORT=3100`, so `PORT=3250 pnpm dev` bound the
  one port a reviewer must not take. The default is unchanged.

## Open

- `TS-WEB-0018-A7`: not met on the render, `CONF-0027`, owner row 278. The
  instrument no longer claims otherwise (§9); the criterion is still open, and
  T-17 is *lint delivered, A7 with the spec owner*.
- The lint's two deliberately unimplemented halves stay as they were: `CG-002`'s
  second half (one field mixing `du` and `ihr`) and the imported legal bodies
  under `content/legal/`, which no page scan reaches (row 277).
- `check:specs` W3 and `check:coverage` still measure the same thing with
  different strictness (`DEC-0141 §7`, row 271). Untouched here.
