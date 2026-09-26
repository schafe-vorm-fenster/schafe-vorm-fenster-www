---
id: DEC-0129
title: The scene carries the module, block 2b is the scene, and `/` ends on ink — the ten choices the home composition had to take
status: DRAFT
date: 2026-09-26
decided_by: the engineering team
---

## Context

`/` is recomposed against `TS-WEB-0019` as amended twice on 2026-09-25: block
2a is **three** scene blocks (`D3a`, `DEC-0110 §2`), the `whatsapp` one holds
the `explain-module` between its opener and its instance (`DEC-0110 §1`), each
of the three carries exactly one `data-cta="secondary"` at the page that owns
its job (`D3a`, `DEC-0082 §4`), and the closing search block stands on the one
further `ink` section a page may carry (`SRC-0014 §Page Rhythm`, `DEC-0117`).
The 2026-09-22 review supplies the wording for most of the page's copy and
rejects a good deal of what shipped.

Ten choices are left open by the determinations and the page cannot be composed
without taking them. Two of them go **against** what the review asks for in as
many words, and both say so below: the specification carries the truth
(`AGENTS.md` rule 8, `DEC-0104`), and `SRC-0017` is specification-side.

## Decision

### 1. The scene gains a `module` slot; the component is not forked

`scene-block` takes a `module` prop, rendered between the opener and the
instance. That is `D7` item 2 — "exactly one mechanism" — with a component in
it, which is exactly the shape `DEC-0110 §1` fixes. Nothing else moves: the
module keeps its ordinal, its three step lines, its `lg` switch and its one
CTA, and `explain-module` is the same file `/mitmachen` renders.

**The `whatsapp` block's one CTA is the module's own** and the scene adds none
("wrapping does not double the CTA", `DEC-0110 §1`). `scene-block` enforces
nothing here — it renders whatever the page puts in either slot — so the count
is asserted where it is a fact: `e2e/pages/home.spec.ts`, one
`[data-cta="secondary"]` per `[data-block="scene"]` and none carrying
`primary`.

`data-block="scene"` sits on the three `section-shell`s, not on the scene
element, because on `/` each scene **is** a section. `[data-mechanism]` is no
longer the scene count — the module declares one too — and the walk counts
`[data-block="scene"]` instead.

### 2. The step lines are `/mitmachen`'s placeholder set, read through `/mitmachen`'s readers

The nine words of path 01 (three step lines, the chat reply, the chat time and
three fallback rows) are the **same** path on both pages and the same
2026-09-23 draft. They ship in a sibling slot
`home-4a-scene-whatsapp-steps-demo` with `provenance: generated`, `demo: true`,
rendered inside a `data-demo="true"` wrapper — the owner default recorded for
this run, and the convention of `DEC-0068` and `validate.ts:112-133`. One
`state/open.md` row per placeholder.

`app/[lang]/page.tsx` **imports** `threeSteps`, `threeSampleRows`, `listAt` and
`LiveStageCalendar` from `app/[lang]/mitmachen/` rather than copying them. The
alternative was eighty duplicated lines and two pictures of one path that can
drift apart; the cost is a read-only import across two route folders, which no
lint rule and no contract forbids. Nothing in `/mitmachen` is edited.

### 3. Scene CTA labels: the target page's own primary label, or the slot's own

| Scene | Target | Label | Where it comes from |
| --- | --- | --- | --- |
| `whatsapp` | `/mitmachen` | "Jetzt kostenlos anmelden" | that page's own primary label (owner default for this run) |
| `embed` | `/dein-kalender` | "Kalender bestellen" | the same rule, named in the default itself |
| `provenance` | `/ueber-uns` | "Mehr über uns" | slot `home-7-provenance-stamps`'s own **Link** field — a label already exists, so the default does not apply |

The `provenance` one is a `Button` at `secondary` weight rather than the quiet
link it was: the review asks for a button ("Warum ein Link? … kann das auch ein
Button sein").

### 4. The WhatsApp scene loses its body paragraph

The module's three step lines say what the paragraph said. "A line that only
confirms the previous line is deleted" (`CG-016`), "a sentence that repeats the
previous one is cut, not softened" (`CG-007`), and the review names this very
substitution ("Besser als so ein Text wäre eine Animation, die das abspielt").
It is also what brings the section back under the 1 270 px budget of polish
brief G-4 — `e2e/section-budget.spec.ts` measured `scene-1` at 1 310 px with
the paragraph (1 278 px on `/en`) and passes without it.

### 5. Block 2b is the provenance scene; the separate stamp element is gone

`TS-WEB-0019 D3` lists block 2b as "the who-built-this stamps" and `A9` lists
"provenance stamps" as a DOM position. Since the polish pass that content has
been **inside** the provenance scene, and the only thing still standing apart
was one sentence: *"Gebaut von jemandem, der das Amt kennt … Seit 2018 in
Betrieb."* `CG-033`/`CG-040` put "gebaut" and "betrieben" about this product on
the avoid list and the review strikes the stamp, so the sentence goes and with
it the `#provenance-stamps` element.

The block keeps its position and its identity: the scene is `#scene-3`, it
stands between block 2a and the proof stream, and it takes `D3`'s own rhythm
value for block 2b — **COLOUR violet**. `A9`'s id list in the walk therefore
reads `… scene-3 · proof-stream …`, and the walk asserts `#scene-3`'s surface so
the block cannot quietly stop being 2b. No spec is amended: the criterion's
sequence is unchanged, only which element carries the anchor.

### 6. The embed photograph runs full-bleed, and its ground changes with it

"Images inside a colour section run full-bleed … either the photo is its own
photo section at full width, or it is not in the section at all" (`SRC-0014`
§"Section grounds carry rhythm, not meaning"); the review says the same
("könnte das Bild auch auf die volle Breite in 16:9 oder 21:9 ziehen"). The
section is rendered `contained={false}` and `scene-block` takes a `bleed` prop
that puts `.container` back around the text, the module slot and the CTA — the
page-container idiom `price-section` already uses, with no viewport arithmetic
and no negative margins. The photograph is `ratio-map` (16 : 9).

The ground moves from `surface-2` to `paper` in the same breath: this is
solution content, and "grey-green never carries positive content" (same
section). The resulting rhythm is PHOTO · ink · lime-500 · paper · violet-500 ·
lime-100 · surface · ink, which `checkRhythm` accepts.

### 7. The closing search block is `ink`, and both search fields take the dark treatment

`SRC-0014 §Search field` has two variants and no third: on-photo and on-ink. The
closing block shipped white on white, which is the defect that rule was
rewritten for. `PageFrame`'s `module` closing variant already carries
`surface`, so the page passes `"ink"` and `PlaceSearch` takes `tone="dark"` in
**both** places rather than only in the hero.

### 8. The proof pool: one card out, one card in, and one context line replaced

The review drops the Nordkurier nomination ("der Proof-Wert hier zu gering"),
corrects three attributions and forbids the internal meta line "Presse- und
Auftrittshistorie 2018 bis 2026" (`CG-035`). `DEC-0048` keeps the count at
five and an empty position weakens the claim rather than shortening the stream,
so the fifth place is filled from the records the review itself names:
`kulturlandbuero-broellin` ("Erfolg mit Partnern"). The meta line is not
replaced by another label — the element is written without an attribution
context, so `parseDemoProofElement` falls back to slot 12's authored
"Beleg aus der Region".

**What is not there:** the review's fourth kind, "Erfolg für Kunden (Wolgaster
Kulturgesellschaft)". No hub record exists for it, and a page may not mint one
(`DEC-0068` rule 3, working rule 7). `state/open.md` carries the row.

### 9. The provenance scene carries no kicker

"Wo das herkommt" is on the avoid list as a heading and `SRC-0017` names **no**
replacement (`copy-guide.md:515, 593`). The section therefore renders its
heading without a kicker above it, which deviates from polish brief G-3
("every section after the hero carries one") exactly as `DEC-0120 §5` did for
`/ueber-uns`. Writing a kicker nobody wrote is the alternative, and working
rule 4 forbids it.

### 10. The hero claim keeps the review's sentence and drops two of its words

The review's direction is *"Deine digitale Terminliste. Erfahre was wann wo in
deinem Ort los ist. Einfach per Smartphone."* Two of those words — `digital`
and `einfach` — are on `CG-040`'s avoid list as generic claims, and
`TS-WEB-0006-A8` makes a hit an error rather than a finding. The middle clause
is the one that survives both, so the claim reads **"Was wann wo in deinem Ort
los ist."** (34 characters, inside `CG-020`'s 42), and the English mirror is
"What's on where you live, and when." This is the second place where the
specification wins over the review's literal wording; the first is §5.

## Consequences

- `scene-block` gains two props (`module`, `bleed`) and its documented opener
  changes from "the visitor's own question" to a statement. Both are additive:
  `/mitmachen`'s hero passes neither.
- `content/pages/home/{de,en}.md` gain one slot (`home-4a-…`), lose two fields
  (the WhatsApp body, the provenance kicker) and lose the stamp sentence.
  Field positions shift inside slots 2, 4, 5, 6 and 7, and `page.tsx`'s
  `fieldAt()` reads move with them.
- `app/[lang]/page.module.css` is new: one class, the live block's hand-off
  line. Everything the pages share stays in `_pages.module.css`.
- Seven `state/open.md` rows: the step lines and stage words (de and en), the
  fallback rows, the missing state-1 photograph, the missing customer proof,
  and the scene CTA labels that are another page's label rather than this
  page's own sentence.
- No acceptance criterion is added, removed or reworded, and no spec file is
  edited by this record.
