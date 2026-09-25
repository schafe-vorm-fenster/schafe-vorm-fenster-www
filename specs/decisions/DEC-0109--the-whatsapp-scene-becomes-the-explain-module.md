---
id: DEC-0109
title: On `/` only the WhatsApp scene becomes the explain module — the embed and provenance blocks stay scenes, and the module has to work in any of the three trait positions
status: accepted
date: 2026-09-25
decided_by: jan-henrik.hempel
---

## Context

`SRC-0014` §*Explain module* said the three-step component is *"reused unchanged
on `/`"*. `TS-WEB-0019` never mentioned it, and `D3a` fixes three **scene**
blocks — three different jobs with one `mechanism` each, which is not three steps
of one path — so a scene could not simply *be* an explain module. Two
specification-side artefacts therefore said different things about the same page,
which since `DEC-0104 §3` is a defect and not a difference of opinion.

`Q-0079` put the three readings the evidence allowed: the module replaces all
three scene blocks, it coexists as a fourth block, or the guide's sentence is
withdrawn. The 2026-09-22 review was permissive rather than deciding — *"dieselbe
Komponente auf der Startseite verwenden — das schadet nicht"* — and the audit of
2026-09-25 (A6) settled the module on `/mitmachen` only, which left `/`
unanswered. Nothing in the record picked one, so nothing was picked.

The question was put to the owner. **His answer is a fourth reading, and it is
the one none of the three options contained: one of the three blocks becomes the
module and the other two stay scenes.** The reasoning he was given and accepted:

- the WhatsApp path **really is a path in steps** — photograph the flyer, send
  it, it appears — where `embed` and `provenance` are not;
- it lets an organiser see how simple publishing is **without leaving the
  page**, which is the one thing a scene's CTA to `/mitmachen` cannot do;
- **"who built this" has no three steps.** Forcing the component onto the
  provenance block would produce three invented steps, which is what
  `SRC-0001 §4` and `DEC-0083` both forbid from opposite directions.

## Decision

### 1. One of the three blocks of 2a is the explain module; the other two are scenes

On `/`, block 2a still holds **exactly three blocks**, one per mechanism, in the
`D3a` order. What changes is what one of them renders:

| Mechanism | Block on `/` | Component |
| --- | --- | --- |
| `whatsapp` | **explain module** | the `explain-module` of `TS-WEB-0022 D4` / `SRC-0014`, unchanged as a component |
| `embed` | scene | `scene-block`, `TS-WEB-0006 D7` |
| `provenance` | scene | `scene-block`, `TS-WEB-0006 D7` |

The component is not forked and not configured differently for `/`: the ordinal,
the three step lines, the single-line budget at 390 px, the `lg` switch, the
stage below `lg`, the auto-advance and the secondary CTA are the ones
`TS-WEB-0022 D4` and the design-system contract already fix. What `/` supplies is
the slot it stands in.

**The count of scenes on `/` is now two, and every criterion that asserted three
is corrected** rather than left to be discovered: `TS-WEB-0019-A6`, `-A7`, `-A9`
and `-A11`. No criterion was added and none was removed, so the criterion count
and the test-reference count are unchanged — A6 is the block-2a criterion and it
is the one that had to be rewritten anyway.

### 2. It must work in **any** of the three positions, including last

`D3a` reorders block 2a by entry trait, and the module travels with its
mechanism:

| Trait | Order | The module is |
| --- | --- | --- |
| `direct`, `social`, `print-qr`, `reader-search`, `activated` | whatsapp · embed · provenance | **first** |
| `professional`, `purchase-intent` | embed · provenance · whatsapp | **last** |
| `press` | provenance · whatsapp · embed | **middle** |

Ordering only — no trait adds, removes or rewrites a block, and no trait changes
which mechanism is the module. That is the invariant of `TS-WEB-0010 D7` applied
to this decision: a trait may reorder, it may not redefine.

**What that costs the section rhythm — checked, and nothing is impossible.**

- The module declares **no ground of its own**. `SRC-0014` §*Section grounds
  carry rhythm, not meaning* has exactly one exception and it is the contact
  section; the explain module is not it. So the generator picks the module
  block's ground the way it picks a scene's, and the alternation rules are
  satisfiable in all three positions.
- The module is **never a PHOTO section**. Its graphic stage is a graphic at
  `ratio-square`, not a photograph, so *"never two photo sections in a row"* is
  not tightened by any position it takes — and in the middle position it is
  loosened, because it separates the two image-led scenes. The rule was already
  the generator's constraint with three scenes and it is no harder now.
- **`himbeere` is untouched.** The module's active step is `lime-500` on a light
  ground, so *"exactly one himbeere element per screen"* neither gains nor loses
  a candidate.
- The **ink** rule is unaffected: block 1's live-dates section and the closing
  search block are the page's two `ink` sections and block 2a lies between them
  whatever its internal order.

**What that costs the one-viewport rule — nothing, and the reason matters.** The
rule is *"the module plus its three step lines fit one viewport height at the
phone breakpoint"* (`TS-WEB-0022 D4`, `SRC-0017 CG-025`). It is a property of the
**block**, not of the block's position, so it holds in position 1, 2 and 3
identically. It is also what makes an auto-advancing stage legible at all: a
stage that is half off-screen animates where nobody is looking, and the
one-viewport rule is why that cannot happen here. The module does not grow to
fill a slot and does not shrink in the last one.

**The fold is not in play.** `/`'s one primary CTA is block 1's
(`TS-WEB-0019 D2`, `TS-WEB-0006-A3`), block 2a begins below the fold in every
state, and the module's CTA is `secondary` by definition — the contract fixes it
as a value, not a default.

### 3. Two things this decision does not settle, and they are raised rather than filled

Both fall out of §1 and neither is an executor's to decide
(`POL-GRADED-BY-IMPACT`: nothing here reaches the low impact level).

- **`TS-WEB-0006 D7` says every job introduction on every page is a scene
  block.** On `/mitmachen` the module is not an introduction — `TS-WEB-0022 D4`'s
  *"One appearance"* rule makes the hero the WhatsApp scene and the path block
  its step detail. On `/` there is no WhatsApp hero, so the module **is** the
  introduction, and the component has no slot for two of D7's three items: an
  opener that is a statement, and one concrete instance. The second is not
  theoretical — the WhatsApp block on `/` is the one that carries a **live event
  row** as its outcome. Either D7 gains the exception or the module gains the two
  slots. **`CONF-0026`** records the contradiction and **`Q-0080`** asks the
  owners of `TS-WEB-0006` and the guide. This decision does not pick, and it does
  not pretend the module already satisfies D7.
- **Nothing says what starts the auto-advance.** `DEC-0105 §6` and `SRC-0014` fix
  its duration, its dwell, its pause and its reduced-motion fallback, and say
  nothing about its trigger. That was harmless while the module was `/mitmachen`'s
  content; with the module able to sit **last** in block 2a, an advance keyed to
  page load has finished cycling before the visitor arrives, and she meets state
  3 with no idea there were two before it. **`Q-0081`** asks the owner of the
  motion exception, which `DEC-0105 §6` says is his and not the guide's.

### 4. The guide's sentence is narrowed, on the specification side

`SRC-0014` §*Explain module* no longer says *"reused unchanged on `/`"*. It says
what is true: on `/` the component renders **one** of the three paths, in
whichever of the three positions the entry trait gives it, and the other two
blocks are scenes. This is an edit to a **specification-side** document
(`DEC-0104 §3`) — the guide is bound by `specs/contracts/design-system-contract.md`
and a spec contradicting it is a defect in the spec, which is why the guide could
not simply be left standing while `TS-WEB-0019` said otherwise.

The contract needs no change: its `explain-module` row describes the component,
and the component did not change.

## Consequences

- `TS-WEB-0019` `D3` (the block table), `D3a` (the trait matrix and the block
  types) and the `Q-0079` open point are rewritten; two new open points carry
  `Q-0080` and `Q-0081`.
- `TS-WEB-0019-A6`, `-A7`, `-A9` and `-A11` are amended. **425 acceptance
  criteria, unchanged; 173 untested, unchanged** — no criterion was added, so
  coverage did not fall to pay for this.
- `concept/website-design-system.md` §*Explain module* carries the narrowed
  sentence.
- `TS-WEB-0022 D4` gains the cross-reference: the component is `/mitmachen`'s
  three path blocks **and** one block on `/`.
- `CONF-0026` is `OPEN` against `Q-0080`; `Q-0079` closes; `Q-0080` and `Q-0081`
  open.
- No requirement changed. `FUN-WEB-0010` maps the route, the focus job and the
  primary conversion, and this decision touches none of the three.
- No identifier was renumbered or reused; `DEC-0109`, `CONF-0026`, `Q-0080` and
  `Q-0081` are each the next free number above their family's highest.
- Nothing moved off `DRAFT`. No copy, no step wording and no graphic was
  specified — the three step lines' content is the offering record's and the
  content phase's (`DEC-0083`, working rule 4).

### What this record does not do

It does not build the module on `/`, and it could not: the `explain-module`
component **does not exist yet in any form** — `src/components/publishing-path`
is `/mitmachen`'s shell without the stage, the auto-advance or the step-line
buttons, and `Q-0044` carries it as owed. `app/[lang]/page.tsx` renders three
`scene-block`s today, and `e2e/pages/home.spec.ts`'s A6 walk asserts the count
this record changes. Both are owed with the component, at the rule they belong
to, in the position `DEC-0105`'s closing section describes: the rule is the rule,
and the implementation is three generations behind it. Rewriting the walk to
assert a component nobody has written would add a check that fails, which is not
a check.
