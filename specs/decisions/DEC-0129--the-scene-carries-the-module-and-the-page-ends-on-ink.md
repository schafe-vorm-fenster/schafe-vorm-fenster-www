---
id: DEC-0129
title: The scene carries the module, block 2b is the scene, and `/` ends on ink — the twelve choices the home composition had to take
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

Twelve choices are left open by the determinations and the page cannot be
composed without taking them. Two of them go **against** what the review asks
for in as many words, and both say so below: the specification carries the truth
(`AGENTS.md` rule 8, `DEC-0104`), and `SRC-0017` is specification-side.

§1–§10 were taken when the page was composed. **§11 and §12 are the QA round of
2026-09-26**, which measured two defects in what §1 and §6 had left: the module
stood on a ground its own state indicator cannot be seen on, and an uncontained
section dropped the page gutter from its two own lines. §5 gained the spec
amendment it had argued it did not need.

A second review of that round corrected three of its own claims, each marked
where it stands: §5 identified block 2b by a position `D3a` does not give it,
§11 named the context band's ground wrong and left the shipped contrast ratio in
a run report instead of here, and §12 credited the transition's space to a CSS
rule that cannot match.

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

The block keeps its identity, and the identification is the **mechanism and
the ground**, not a position: the `provenance` scene *is* block 2b wherever
`D3a` puts it, and it takes `D3`'s own rhythm value for block 2b — **COLOUR
violet**. In the `direct` order the page ships today it is `#scene-3`, the third
member of block 2a — inside 2a, not between 2a and the proof stream — so `A9`'s
id list in that load reads `… scene-3 · proof-stream …` and the walk asserts
`#scene-3`'s surface, which is what keeps the block from quietly stopping to be
2b. The first wording of this amendment said block 2b is "the **last**" of the
three scenes; that is true only of `direct`, while `D3a` puts the provenance
scene middle for `professional`/`purchase-intent` and first for `press` and `A7`
requires the module's scene to be last in the `professional` load. The positional
claim is therefore withdrawn from `A9` and from this record on the same day it
was written — it would have landed on T-21, which turns the trait ordering on.

**The spec is amended, on the QA round of 2026-09-26.** This record first said
"no spec is amended: the criterion's sequence is unchanged, only which element
carries the anchor". That was too fine a reading — `D3` row 2b named the
content "the who-built-this stamps" and `A9` listed "provenance stamps" as a
DOM position of its own, and neither is true of what ships. Both now say block
2b is the provenance scene and cite this record; nothing is renumbered, no
status is promoted, and the id list, the ground and the position are unchanged.

No `DEM-####` accompanies it and none is owed (`AGENTS.md` rule 8,
`check:specs` E27): a demand records a specification standing **against a
source**, and no source says this. `SRC-0003#home`
(`website-information-architecture.concept.md`) contains the word "stamp"
nowhere — the stamps were the spec's own invention — and the two authorities
behind the removal are the 2026-09-22 owner review and `SRC-0017`, which rule 8
names as specification-side and therefore not a source. What is recorded is the
amendment itself, on the artefact, in the spec's own idiom for the three
amendments it already carries from 2026-09-25.

### 6. The embed photograph runs full-bleed, and its ground changes with it

"Images inside a colour section run full-bleed … either the photo is its own
photo section at full width, or it is not in the section at all" (`SRC-0014`
§"Section grounds carry rhythm, not meaning"); the review says the same
("könnte das Bild auch auf die volle Breite in 16:9 oder 21:9 ziehen"). The
section is rendered `contained={false}` and `scene-block` takes a `bleed` prop
that puts `.container` back around the text, the module slot and the CTA — the
page-container idiom `price-section` already uses, with no viewport arithmetic
and no negative margins. The photograph is `ratio-map` (16 : 9).

The ground moves off `surface-2` in the same breath: this is solution content,
and "grey-green never carries positive content" (same section). It went to
`paper` first and to `lime-100` on the QA round — §11 says why, and states the
rhythm the page ships with.

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

### 11. The scene that carries the module stands on `paper`, and the embed scene moves to `lime-100`

The `whatsapp` scene shipped on `lime-500`, and on that ground the module
cannot be read. Its per-step state indicator is the numbered disc — "the active
step's disc is `lime-500` with `ink`; the others are `surface` with `muted`"
(`website-design-system.md:560`), and the stylesheet says why: *"a fill on a
light ground means active"*. Measured at 390 × 844: the active disc was
`rgb(164, 216, 34)` on a section of `rgb(164, 216, 34)` — **1.00:1**, invisible
— while the two inactive discs were the only ones a reader could see. The state
reading was inverted. The `line` hairline that divides the three step rows goes
the same way: the brand tokens record it at 1.27:1 on lime and publish a
separate `hairlineOnLime` for that case, which this component does not use.

So the scene takes a light ground, and the light ground is **`paper`** — the one
`/mitmachen` renders the same component on, the one the 2026-09-23 design draft
shows, and the one `TS-WEB-0019 D3a` already assumed in as many words: "the
active step is `lime-500` on a light ground". Not `lime-100`: the active disc is
1.45:1 against it and the inactive ones 1.03:1, so the module's whole state
vocabulary would fade at once.

**The embed scene moves from `paper` to `lime-100` because of it.** Two `paper`
scenes in a row are legal on their own, but in `D2`'s S3 the widening block
(`surface-2`) stands above them, and three neutral grounds in a row is the one
thing `checkRhythm`'s family rule forbids. The rhythm the page ships with is
therefore PHOTO · ink · [surface-2, S3 only] · paper · lime-100 · violet-500 ·
lime-100 · surface · ink — the eighth entry is the context band, which `/`
renders through `PageFrame`'s unmerged branch on `surface`, not on `paper` — and
`checkRhythm` accepts it in **both** states, not only in the one the e2e walk
loads. Because that walk loads one state and reads the DOM, the two sequences are
also listed by hand in `app/[lang]/page-rhythm.test.ts`, the way four other
routes pin theirs; the S3 sequence has no test that renders it.

**What ships is still short of `NFR-WEB-0059`.** On `paper` the active disc
measures **1.62:1** and the inactive ones **1.09:1** (recomputed from the sampled
`rgb(164, 216, 34)` and `rgb(238, 242, 233)` against `rgb(249, 251, 247)`),
against the >= 3:1 that requirement sets for non-text contrast. It is the visible
state again, and byte-identical to the `/mitmachen` instance — but the pair is
`SRC-0014`'s own (`website-design-system.md:560`), `pnpm check:contrast` judges
the token set and never a composed pair, and no page work package may fork a
design-system colour pair. `state/open.md` row 251 carries the shortfall against
`SRC-0014`, for both instances.

### 12. `section-shell` keeps its own two lines in the container, even uncontained

`contained={false}` existed for an instance that runs edge to edge — a
photograph, a full band. It also stripped the page container from the shell's
**own** `kicker` and `transition`, because both are rendered in the same
fragment as `children`. On `/` that put the embed scene's kicker and its
hand-off line flush against the viewport edge (measured: left = 0 at 390 px and
at 1280 px, against 16 px and 72 px on every other section), which
`SRC-0014` §Shape and Space forbids outright: "16 px inside the viewport, on
every section".

The fix is in the shared component and not in the page, because the defect is
the component's: an uncontained shell now wraps kicker and transition in their
own `.container` and hands `children` out bare. The other caller,
`price-section`, passes no kicker to the shell and containerises its own band,
so nothing changes there. **That wrapper is the whole mechanism**: the lede
container is not the section's last child, so `.section > :last-child` — the one
rule that does any flattening — never touches it, and the transition keeps its
space by construction rather than by a margin rule.

The QA round first wrote that rule as the mechanism (`.section >
.container:last-child > :last-child`) and that was wrong twice over. The
selector is inside a CSS Module and `.container` is a **global** class from
`app/styles/base.css`, so the compiled form
(`…__container:last-child > :last-child`) matches no element on any page and
never did — the branch was dead before this round and editing it changed
nothing. It is removed rather than repaired: making it real (`:global(.container)
> :last-child`) would flatten the last paragraph's margin inside *every*
contained section on every page, which is a measured change to the shared
vertical rhythm and `SRC-0014`'s call, not a page work package's. `state/open.md`
row 252 records it.

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
- `src/components/section-shell/**` is edited for §12 — a shared component, and
  the smallest edit that closes the defect: the uncontained branch gains one
  wrapper and the prop gains its documentation. No prop is added or removed and
  no caller changes. The stylesheet **loses** one selector: the dead
  `.container` branch of the margin-flattening rule, which CSS Modules localised
  and which therefore never matched (§12, row 252).
- **No acceptance criterion is added, removed or reworded.** Two determinations
  are amended in prose and both name this record: `TS-WEB-0019 D3` row 2b and
  `A9`, which said block 2b is a stamp element (§5). No id is renumbered, no
  status is promoted, and `DEC-0129` joins that spec's `decisions:` list.
- `e2e/pages/home.spec.ts` gains the substance of `TS-WEB-0002-A13` on the home
  instance — three-quarter trigger, one 9.1 s pass, 30 s of no further change,
  scroll-out-and-back — and one gutter test that would have caught §12.
- `app/[lang]/page-rhythm.test.ts` is new: the two `D2` section sequences by
  hand, as `dein-kalender`, `ueber-uns` and two more routes already carry
  theirs. The e2e walk reads one state's DOM; this pins the state no walk loads.
- Three `state/open.md` rows join the seven: the state indicator's 1.62:1 (251),
  the dead container rule the shared stylesheet lost (252) and `/`'s one
  cross-route import, `./mitmachen/paths` (253) — argued in §2 and outside this
  work package's `files_shared`.
- `app/[lang]/_pages.module.css` loses `.stamp`, which nothing renders now that
  the stamp element is gone (§5). No other route ever used it.
