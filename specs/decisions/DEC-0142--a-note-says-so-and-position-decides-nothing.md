---
id: DEC-0142
title: A note says so, and position decides nothing — the copy lint binds a list to its field, the marker is the only exclusion, and the coverage gain is written down
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

Two further things arrived with the same round. `pnpm check:coverage` joined the
`check` chain on `next-2026` (`DEC-0141`), so a tally that moves must be written
into `specs/verification/coverage-budget.json` in the same commit — including
when it improves. And `next-2026` moved the closing block of `/deine-region`
off-site → in-page (`DEC-0081 §3`), which collides in the same slot with this
task's relabelling of the closing field.

## Decision

### 1. A list or table binds to the last field of its slot; the exclusion is a marker the slot writes

`copyOf()` (`src/lib/content/validate.ts`) now carries a field binding across
any paragraph between the field and the block: the five proof items under
*"Pool: der volle `proof`-Bestand …"* are the content of `Überschrift`, because
that is what the page renders them as. A paragraph is still never copy; it is
simply no longer a boundary.

The exclusion is explicit. A slot that writes `<!-- note -->` — with an optional
reason after the word, in the `<!-- key: value -->` annotation shape the
artifacts already use for `source_note:` and `clearance:` — opens a note region
running to the end of that slot; the lists and tables below it are parsed with
`note: true` (`src/lib/content/blocks.ts`, `ContentBlock`) and the lint passes
over them. The four deviation lists of `dein-kalender-3b-embed-config` in both
locales carry that marker now, so the note that quotes `im Amt` in order to
forbid it still passes — by saying it is a note, not by standing in the right
place.

Why a marker and not a cleverer heuristic: the parser cannot see a render, and
every positional rule is a guess about intent that fails silently in one
direction. A marker is a sentence the author writes, in the file, that a
reviewer can read. It costs two lines in the tree today.

**Measured**, both directions:

- `pnpm check:content` → *Content pipeline is valid (TS-WEB-0007 D12) — rows 11,
  13 and 14 measured: TS-WEB-0007-A13 (glossary conformance), TS-WEB-0006-A8
  (copy structure), TS-WEB-0029-A15 (register).*
- the reviewer's probe, re-run: item 5 of `ueber-uns-3-proof-stream` mutated to
  *"Portalize und die Leute im Amt: …"* → **3 errors** (`avoid-list` `die Leute`,
  `avoid-list` `im Amt`, `product-name`), where the same mutation produced none
  before.
- the eight rendered blocks that position exempted, now scanned and clean:
  `ueber-uns-3-proof-stream`, `deine-region-6-proof-demo`,
  `dein-kalender-5-proof-demo` and `archiv-2-rows-demo`, in both locales. They
  are enumerated in `src/lib/content/README.md` with the render site of each.

`DEC-0136 §1` is corrected rather than quietly superseded: it now says what it
first claimed, what was wrong with the claim, and that this record replaced the
rule. No `state/open.md` row is added for the hole, because the hole is closed;
the two rows about the lint's *deliberately* unimplemented halves (`276`) and
about `TS-WEB-0018-A7` (`277`) stand.

### 2. Two shared files are touched, minimally, because the marker has to be parsed

`src/lib/content/blocks.ts` gains the marker (one regex, one flag, four lines in
the two flush functions) and `src/lib/content/types.ts` gains `note?: boolean` on
the `list` and `table` variants. Neither file is owned by a task in the backlog.
The alternative — a `**Hinweis:**` field as the marker — needed no parser change
but would have inserted a field into a slot whose page reads fields by index
(`fieldAt`), which is the more dangerous edit of the two.

Nothing renders the marker: it is not a block, so the paragraph sequence a page
reads (`configParagraphs`, `app/[lang]/dein-kalender/page.tsx:197`) is unchanged.

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

## Consequences

- One convention is added to the content tree: `<!-- note -->` above authoring
  prose whose lists or tables must not be linted. Two slots use it today. An
  author who forgets it gets a finding on a note; an author who abuses it
  silences a real row — which is why the marker is a visible line in the file
  rather than a facet in the frontmatter.
- `ContentBlock` carries an optional field that only the lint reads. A renderer
  may later use it to keep note lists off the page; nothing does today.
- The copy lint now reads 8 rendered blocks it did not read before, among them a
  192-cell table. `pnpm check:content` stays under a second.
- `state/open.md` rows 266–270 of this branch became **273–277** at the merge
  (T-15 took 266, T-20 267–270, the coverage gate 271–272).

## Open

- `TS-WEB-0018-A7`: not met on the render, `CONF-0027`, owner row 277.
- The lint's two deliberately unimplemented halves stay as they were: `CG-002`'s
  second half (one field mixing `du` and `ihr`) and the imported legal bodies
  under `content/legal/`, which no page scan reaches (row 276).
- `check:specs` W3 and `check:coverage` still measure the same thing with
  different strictness (`DEC-0141 §7`, row 271). Untouched here.
