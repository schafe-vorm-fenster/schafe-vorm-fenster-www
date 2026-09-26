---
id: DEC-0124
title: The paths slot is one slot on three grounds — the objection block splits too, the proof slot comes back, and the step lines ship as marked placeholders
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

`/mitmachen` is rebuilt against `TS-WEB-0022` as amended on 2026-09-25: the
three publishing paths **are** the `explain-module` component (`D4`, audit A6),
the hero is the page's only scene (`DEC-0110 §3`), the price boundary is a
hint banner at the end of the paths slot (`D11`, `DEC-0107 §3`), and the
objection block is the two-part archive form of `SRC-0014 §Archive block`
(`DEC-0117`). The 2026-09-22 review supplies the wording for most of it and
two design drafts supply the rest.

Eight choices are left open by the determinations, and the page cannot be
composed without taking them. Two of the eight are decided **against** the
composition the backlog's own notes sketch, because a shipped test measures
the opposite; both are named below. Sections 4, 5 and 8 carry what the review
of this work package sent back — a turnaround time in a stage illustration,
path 1 falling back to path 2's sample rows, and the banner stating the reach
of path 3 where `FUN-WEB-0204` asks for a price boundary.

## Decision

### 1. One `wege` slot, three sections — and the objection block is two

`D2` counts **one** slot for the three paths and `A17` puts the banner
"inside the publishing-path slot". The backlog's note sketches that as one
`lime-100` section. It cannot be one section: `e2e/section-budget.spec.ts`
holds every section to 1 270 px at 390 px (polish brief G-4) with an empty
list of exceptions, and its own header names this page's paths as the
violation it was written for — "2035 px in one `surface-2` block … fixed —
one section per path".

Measured on the rebuilt page at 390 px: the three modules are **855 px,
743 px and 990 px**, and the two halves of the objection block together are
**1 627 px**.

So the page renders:

| Block | `data-block` | Ground |
| --- | --- | --- |
| hero (the one scene) | `scene` | photo |
| objection block, upper half | `objections` | `paper` |
| objection block, archive half | `archiv` | `archive` |
| path 1 · WhatsApp, with the slot's kicker, heading and sub-line | `wege` | `paper` |
| path 2 · calendar connection | `wege` | `lime-100` |
| path 3 · website import, with the hint banner | `wege` | `paper` |
| the one `/dein-kalender` cross-reference (`D9`) | `verweis` | `lime-100` |
| live example | `beispiel` | `ink` |
| proof | `beleg` | `lime-100` |

**One slot, three sections**: the kicker, the heading and the sub-line stand
once, on the first, and all three carry `data-block="wege"`, so `A3`, `A5`
and `A17` walk the slot as one thing. The grounds are `paper` and `lime-100`
and never `surface-2`: "grey-green never carries positive content"
(`SRC-0014 §Section grounds`), and solution content takes a fresh ground.
`beleg` takes `lime-100` because `PageFrame` appends `surface` and `paper`
after it and three neutral sections in a row is the rule `A16` checks.

Splitting the objection block needed one line in `objection-list.tsx`: the
component renders its archive half only when it has rows, so the upper half
can stand alone in its own section. `e2e/objection-list.spec.ts` keeps every
assertion it had; two of its base selectors move from
`[data-block="objections"]` to `[data-archive-block="own"]` and
`[data-block="archiv"]`. Both edits are noted in the files.

### 2. The `/dein-kalender` aside goes back into slot 3

`D9` says the aside sits "at the end of slot 3". The polish brief had moved
it out of path 3 and down behind the proof block, because inside the path it
read as a fourth step. Both concerns hold at once: it is its own quiet
`aside` — not a step — and it stands **at the end of the paths slot**, after
the third path's banner and before the live example. The backlog note's
rhythm sketch keeps it after `beleg`; the determination wins (`DEC-0104`).

### 3. The proof slot beside the objection block comes back

`D3` requires one proof slot beside the block, "visibly empty if nothing
clears". Polish brief G-9 struck it because, after the "Kein Nachweis" label
came off, it was a blank rectangle under a list of bad news. The
specification carries the truth (`DEC-0104`, decisions audit G-1…G-4), so the
slot renders again as `empty-proof-slot`, and `A6` walks it. `objection-list`
keeps its `proofSlot` prop; the page no longer passes `false`.

### 4. The step lines are the drafts' wording, and ship marked

`CG-025` budgets a step line at core ≤ 30 and detail ≤ 40 characters, each
exactly one line at 390 px. Nine such pairs exist nowhere the owner wrote
them: six are in the 2026-09-23 drafts (paths 01 and 02), and path 03 has no
draft at all. They ship as the repository's placeholder convention:

- three sibling slots `mitmachen-{3a,4a,5a}-path-*-steps-demo`,
  `provenance: generated; derived_from: []; status: draft; demo: true`, in
  both locales;
- each module inside a `data-demo="true"` wrapper (`data-path-module`), and a
  row per slot in `state/open.md`.

The marking sits on a **wrapper around the module** rather than on its `ol`,
because `explain-module` exposes no hook for it and the component is another
work package's file. That over-reaches by two strings — the module title and
the CTA label are the review's own words — and is the honest direction to
over-reach in: a reviewer enumerating `[data-demo]` finds the module that
holds the placeholder.

The same slots carry the words the stage graphics show — the chat reply and
its timestamp, the calendar address, the website address — for the same
reason and with the same marking. None of them states a response time
(`CG-031`) — and "none" is a property of the words, not of the marking: a
`data-demo` slot says who wrote a sentence, never what the sentence may
assert. The first shipped version of the chat reply read *"Danke! Der Termin
steht **ab morgen** im Kalender."*, which is a turnaround time no cleared
source gives, and `CG-033` ("nothing literally untrue") makes that a truth
problem rather than a tone problem. The review of this work package found it
while three records claimed the opposite in the same breath. The reply now
reads *"Danke! Der Termin steht im Kalender."* / *"Thanks! The date is in the
calendar."*, which is the state the panel beside it shows, and the check that
would have caught it is widened: the `A12` guard in
`app/[lang]/mitmachen/paths.test.ts` walks every **field** of the path slots,
not only the step lines, and `e2e/pages/mitmachen.spec.ts`'s `A12` case
carries the criterion's own `ab` clause (`/\bab\b/`) instead of leaving it
unasserted.

### 5. The stage's third state: real rows where there are any, a marked sample otherwise

`DEC-0115` gives the page the choice between "a real covered place's real
rows" and "a `data-placeholder` marked sample". Path 1 ends in *"the date is
in the calendar"*, and the calendar it means is the live example two sections
further down, so it reads the **same** interface module through the **same**
cache profile (`placeEvents`, `cacheTags.dates`), in a `use cache` island of
its own (`stage-islands.tsx`, `TS-WEB-0009 D2`). Paths 2 and 3 end in *"new,
moved, cancelled"* and *"new dates land in the calendar"*, which no live
window reliably shows at a given minute; they take the artifact's three
authored rows, marked `data-placeholder="sample-events"` with `data-demo` on
every row.

**Path 1 has three authored rows of its own**, in slot `3a`. It took path 2's
rows as its fallback in the first shipped version, which meant that an
upstream answering fewer than three rows put *"Chorprobe · verschoben"* and
*"Seniorencafé · abgesagt"* under the words *"Der Termin steht im Kalender"* —
rows written to illustrate path 2's promise, saying something this path does
not. Its own three are ordinary upcoming dates with no status badge, because
that is what "the date is in the calendar" looks like. Nine sample rows, three
per path, all marked the same way.

A sample panel is titled with the **configured reference community**, never
an invented village (`DEC-0068` rule 3) — the drafts' "KRENZOW" is not
transcribed. A sample row's **date** is derived in the cached island (+3, +5,
+8 days) rather than written into the artifact, because a written date ages
into a picture of last year. A live panel that resolves fewer than three rows
falls back to the marked sample, so the square box is always full and never
changes height (`A19`).

### 6. No photograph stands in a path any more

The three credited photographs stay declared in the artifact's `images:`
block and the credits page still cites them, but no path renders one. The
review is explicit about the WhatsApp one ("Das Foto ist Quatsch"); what
belongs in state 1 is a hand holding a phone over a flyer, which nobody has
shot. The stage shows `media-frame`'s "Foto gesucht" hatch instead of a bus
shelter (`DEC-0068` rule 2).

### 7. The paths kicker is the page's own, and it carries a word from the avoid list

`dictionary.kickers` is the site's closed set of section roles, and a page
"picks one, it does not write one". The review and the draft give this
section a kicker of its own — **"So geht's einfacher"** — which is not one of
the site's roles and is not a role at all: it is this slot's promise. It is
therefore held in the page's own content slot, beside the slot's heading and
sub-line, and no key is added to the dictionary.

It contains "einfacher", and `CG-017`'s avoid list rejects "einfach" as a
generic claim. The line is the owner's, written in the review and drawn in
the draft, so it stands; what changed is the **scope of the check**.
`TS-WEB-0022-A6` says "no *item* contains a term from the generic-claims lint
list", and the shipped e2e asserted it over the whole `body`. It now asserts
what the criterion says, over the objection block's items. The tension is
recorded in `state/open.md` for the owner rather than resolved here.

### 8. The banner carries two sentences: the reach the owner wrote, and the boundary `D11` asks for

The review supplies one sentence for the hint banner — *"Bitte nachfragen,
geht bisher nur für einige Webseiten."* — and it is about **reach**: for how
many websites path 3 works today. `FUN-WEB-0204` and `D11` ask the banner for
something else: the price boundary of `BUS-WEB-0017` — *"a source the platform
already supports publishes free; an individual integration into a system it
does not already support is the `custom-data-integration` add-on"*
(`TS-WEB-0022:205`). `D11:210` then forbids the shortcut of treating path 3's
alpha badge as that statement: *"D4's `status_badge` says path 03's mechanism
is alpha; this says what a connection costs. Two different facts, two
elements."*

The first shipped version of this page rendered the owner's sentence alone, so
`FUN-WEB-0204` stayed undischarged while `A17` passed — the criterion counts
placement, CTA, figure and source list, not the statement. The review of this
work package found that gap.

The boundary now ships as the banner's **second** paragraph, from its own slot
`mitmachen-5b-path-website-banner-demo` (`provenance: generated`,
`derived_from: []`, `demo: true`), rendered with `data-demo="true"` on the
paragraph — the task's copy source authorises exactly this ("Banner sentence …
beyond the review's words: demo slots too"). The **facts** are the offering
record's, at `community-calendar.offering.md` lines 112–123; only the German
and English wording is the engineer's, which is what the marking says. No
amount, no currency symbol, no "ab": the add-on is `price_status: on-request`
and `/mitmachen` renders no price at all (`D1`, `A12`).

What is asserted is the structure, not the wording, because the wording is a
placeholder the owner replaces: two paragraphs in the banner, exactly one of
them marked `data-demo`, no "Alpha" in it, and the slot's field non-empty and
figure-free in both locales (`e2e/pages/mitmachen.spec.ts` `A17`,
`app/[lang]/mitmachen/paths.test.ts`).

## Consequences

- `A3`'s block list gains `archiv` and `verweis`; `A6` gains the restored
  proof slot and loses the page-wide generic-claims scan; `A17` and the two
  timing criteria `A18`/`A19` are asserted on the composed page for the first
  time. `e2e/motion-reveal.spec.ts`'s `TS-WEB-0002-A13` is un-`fixme`d — it
  was blocked on `explain-module` not existing (`Q-0044`), which it now does.
- `src/components/publishing-path/**` is **not** deleted. The backlog's
  instruction is conditional — "delete once unused" — and it is still used by
  `src/components/gallery.tsx` (entry 25 of the component inventory) and by
  `src/components/badge-locale.test.tsx`. Removing it is a design-system
  decision plus three edits in files this work package does not own; it is
  listed as open work rather than taken here.
- Four content slots keep their ids (`mitmachen-{3,4,5}-path-*`) although the
  page now renders one slot: the artifact's `images:` block binds image
  entries to those slot ids, and that block is not this work package's.
- The proof section's `h2` reads `dictionary.kickers.othersSay` instead of a
  page-local constant holding the same two strings. The kicker above it stays
  `kickers.customers`, the marked placeholder — two different strings, and the
  `T-12` half of `state/open.md` row 234 is closed by the change.
- The hero opener is two short statements — the `h1` carries the first, the
  lead the second — where it was one 66-character question. That is the
  review's own instruction, and it restores the lead the fold constraint had
  removed without pushing the primary CTA below 640 px; `A2` is measured at
  both reference viewports.

## Alternatives considered

- **One `wege` section, and a line added to `section-budget.spec.ts`'s
  `KNOWN_OVER`.** Rejected: that list is a ratchet whose own header says a
  fixed page deletes a line rather than adding one, and it is empty today.
- **Marking the step lines by wording.** Rejected: the placeholder convention
  is a marking in the markup and a row in `state/open.md`, never a word on
  the page (`DEC-0068` rule 1, `validate.ts:112-133`).
- **Live rows in all three stage panels.** Rejected: paths 2 and 3 illustrate
  a *change* — moved, cancelled, newly imported — and a live window does not
  reliably contain one. A panel that silently shows three ordinary rows under
  the words "new, moved, cancelled" claims something the data does not.
- **Recording the undischarged half of `FUN-WEB-0204` instead of stating the
  boundary** (an `state/open.md` row saying the banner carries only the reach
  sentence). Rejected: `D11` is a determination and the requirement is a
  `SHALL`; a row in the open list does not publish a price boundary to a
  visitor. Recording it would have been right only if the boundary could not
  be stated without inventing a *fact*, and it can — the facts are the
  offering record's, and only their wording is new, which is what the
  placeholder convention exists for.
- **Folding the boundary into the owner's sentence as one paragraph.**
  Rejected: `D11:210` wants the two facts in two elements, and a marked
  placeholder must be separable from the owner's own words — one paragraph
  would have put a `data-demo` marking on the review's sentence too.
- **Adding `kickers.simplerWay` to the dictionary.** Rejected: the dictionary
  holds the site's *roles*, and "So geht's einfacher" is this slot's promise.
  An English twin nobody wrote would also have to be minted there, where the
  placeholder convention has no slot-level home.
