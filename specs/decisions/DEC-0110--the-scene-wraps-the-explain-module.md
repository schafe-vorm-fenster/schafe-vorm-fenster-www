---
id: DEC-0110
title: The scene wraps the explain module — the opener stands above it, the concrete instance below it, and `/` keeps three scene blocks
status: accepted
date: 2026-09-25
decided_by: jan-henrik.hempel
---

## Context

`DEC-0109` made the `whatsapp` block of `/`'s block 2a the `explain-module`
component and deliberately left one thing unsettled. `TS-WEB-0006 D7` says every
job introduction on every page is a scene block with three items — an opener that
is a statement, exactly one mechanism, one concrete instance — and on `/` the
module **is** the job introduction, because that page has no WhatsApp hero to be
it instead. The component has a slot for the mechanism and for neither of the
other two. The missing instance is not theoretical: the `whatsapp` block on `/`
is the one that carries a **live event row** as its outcome, which is precisely
D7's *"one concrete instance, live or proof-backed, as close to the visitor as
the data allows"*.

`CONF-0026` recorded the contradiction at `direct_contradiction` / Medium, with
`NEW_VERSION` recommended and the open part being *of what*. `Q-0080` put the two
candidate new versions the evidence allowed: `D7` gains an exception, with the
module's title carrying the opener's job — or the component gains an opener line
and an instance slot beneath the third step, which `/mitmachen` then gains too.

**The owner's answer is neither.** Nothing is excepted and nothing is redesigned:
**the scene wraps the module.**

## Decision

### 1. A scene block may contain the explain module as its mechanism

Where a job introduction's mechanism is a path in steps, the scene block does not
become the module and is not replaced by it. The module stands **inside** the
scene, in the slot D7 item 2 already reserves for the mechanism:

| D7 item | Where it renders |
| --- | --- |
| 1 — the opener, a statement | **above** the module, as on any scene |
| 2 — exactly one mechanism | **is** the module: one `explain-module`, one `mechanism` prop |
| 3 — one concrete instance | **below** the module — on `/` the live event row the `whatsapp` block already carries |

All three of D7's items are therefore present, at their own level, and none of
them moves into the component. The consequences of that are the point of the
answer:

- **`D7` gains no exception.** Every job introduction on every page is still a
  scene block. What `D7` gains is a sentence saying that a scene's mechanism may
  be rendered by a module — which it never forbade and never said.
- **The component is not redesigned.** `explain-module` keeps the ordinal, the
  title, exactly three step lines, the single-line budget at 390 px, the `lg`
  switch, the stage below `lg`, the auto-advance and the one secondary CTA. It
  gains **no** opener line and **no** instance slot, so nothing propagates to
  `/mitmachen`'s three path blocks and `TS-WEB-0022 D4` keeps its shape.
- The scene stays **self-contained** (`D7`, `CG-004`): opener, mechanism and
  instance are in one block, and a reader who arrives by deep link reads it
  whole. Wrapping is what keeps that true — a bare module on `/` would have been
  the first block on the site that referred its reader elsewhere for its own
  outcome.

### 2. `/` keeps three scene blocks, and one of them contains the module

`DEC-0109 §1` said *"the count of scenes on `/` is now two"*. **That framing is
withdrawn.** Block 2a still holds exactly three blocks, one mechanism each, in
the `D3a` order, and all three are scene blocks:

| Mechanism | Block on `/` | Its mechanism renders as |
| --- | --- | --- |
| `whatsapp` | scene block | the `explain-module` of `TS-WEB-0022 D4` / `SRC-0014`, wrapped |
| `embed` | scene block | the scene's own mechanism treatment |
| `provenance` | scene block | the scene's own mechanism treatment |

Which mechanism gets the module, and why it is `whatsapp` and not one of the
other two, is `DEC-0109 §1` and is untouched: the WhatsApp path is a path in
steps, and "who built this" has no three steps.

`DEC-0109`'s own correction of the criteria is corrected in turn. The criteria
that asserted three scenes were right about the count and wrong about nothing;
what they were missing is the module inside one of them. `TS-WEB-0019-A6`, `-A7`,
`-A9` and `-A11` are amended a second time, and this time they count **three**
scenes.

**No acceptance criterion is added or removed by this record**, so the criterion
count and the coverage fraction are untouched. The amendment is inside the
existing four.

### 3. `/mitmachen` — the wrapping does **not** apply there, and this says so rather than leaving it to inference

On `/mitmachen` the hero is the WhatsApp scene and each of the three path blocks
is the module (`TS-WEB-0022 D4`, the *"One appearance"* rule, `A4`, `A5`). The
wrapping does not travel to that page, for the reason that decides every case:

> **A scene wraps a module only where the module is the job introduction.** Where
> another block on the page already introduces the job, the module is a step
> detail and is not wrapped.

On `/mitmachen` the hero is that other block. It carries the opener and the
instance for the page's one job, so `D7` is satisfied **once**, by the hero, and
wrapping each of the three path blocks would mint three openers and three
instances — which is exactly what the *"One appearance"* rule forbids ("repeats
neither opener nor instance") and what `A4`'s *"exactly one block declares
`data-block="scene"`"* would fail on. The page keeps one scene and three bare
modules.

Two things follow that are worth stating because a reader would otherwise check
for them:

- Paths 2 and 3 (`calendar-connection`, `website-import`) have no scene of their
  own and need none. They are not job introductions: `/mitmachen` has **one** job
  — publish our dates — and three mechanisms of it. `D7` counts introductions,
  not mechanisms.
- The rule is a property of the page, not of the component, which is why it can
  differ between `/` and `/mitmachen` without the component being forked. `/`
  supplies a wrapper; `/mitmachen` supplies a hero. The component is the same
  file in both.

### 4. One of `DEC-0109 §2`'s rhythm claims is withdrawn, and nothing gets harder

`DEC-0109 §2` read the section-rhythm rules off the **module**, because there the
module *was* the block. Under wrapping the block is a scene and the module is its
middle, so two of those readings need restating and one of them was a claim that
is no longer true:

- **Withdrawn:** *"in the middle position it separates the two image-led scenes,
  which loosens the rule"*. The module is still never a PHOTO section — its stage
  is a graphic at `ratio-square` — but the scene wrapping it is an ordinary scene
  and may be one, so it separates nothing by construction.
- **Restated and now trivial:** *"the module declares no ground of its own"*. It
  does not, and it no longer needs the sentence: the block is a scene, and a
  scene's ground is picked the way every scene's is.
- **Net effect: block 2a's rhythm constraint is exactly the pre-`DEC-0109` one** —
  three ordinary rhythm sections, alternating per `SRC-0014`, satisfiable in every
  `D3a` order. `himbeere` and the two `ink` sections are untouched, for the reasons
  `DEC-0109 §2` gives and which wrapping does not touch.
- **The one-viewport rule is unaffected and stays the module's.** It is the module
  plus its three step lines that fit one viewport height; the opener above and the
  instance below are outside that budget, because the rule is a property of the
  component and the component did not change.

### 5. `CONF-0026` resolves as `NEW_VERSION`, and the new version is `TS-WEB-0006 D7`

The recommendation held; the open part is closed. `D7` takes the new version — a
sentence on containment — and the component takes none. `REJECT_NEW` would have
withdrawn the module from `/` and reopened `Q-0079`; `ISOLATE` would have exempted
one block on one page from a site-wide rule without the rule saying so, which is
the silent override `DEC-0104 §2` exists to end. Neither was needed, because the
collision was between `D7` and a reading of `D3a` in which the module *replaces*
the scene, and that reading is the one the owner did not take.

## Consequences

- `TS-WEB-0006 D7` gains the containment sentence and the page test that decides
  when it applies. `D7` stays `[FIXED]`; nothing in its three items changed.
- `TS-WEB-0019 D3` (block 2a's row) and `D3a` (the block-type table and its
  prose) say three scene blocks, one of which contains the module.
  `TS-WEB-0019-A6`, `-A7`, `-A9` and `-A11` follow.
- `TS-WEB-0022 D4` records that the wrapping is `/`'s and not this page's, and
  why. No property of the component changed there.
- `concept/website-design-system.md` §*Explain module* carries the placement: on
  `/` the component stands inside a scene block, opener above, instance below.
  This is a **specification-side** edit (`DEC-0104 §3`).
- `specs/contracts/design-system-contract.md` needs no change. Its
  `explain-module` row describes the component, and the component did not change.
- `CONF-0026` is `RESOLVED` with outcome `NEW_VERSION` and `decision_record:
  DEC-0110`. `Q-0080` closes.
- **425 acceptance criteria, unchanged; 173 untested, unchanged.** No criterion
  was added, so no coverage was spent on this.
- No requirement changed. `FUN-WEB-0010` maps `/`'s route, focus job and primary
  conversion and this record touches none of the three; `FUN-WEB-0012` does the
  same for `/mitmachen`.
- No identifier was renumbered or reused. `DEC-0110` is the next free number
  above `DEC-0109`.
- Nothing moved off `DRAFT`, and no copy was written: the opener and the instance
  are slots here, and what they say is the content phase's (`DEC-0083`, working
  rule 4).

### What this record does not do

It does not build anything. `src/components/publishing-path` is still
`/mitmachen`'s shell without the stage, the auto-advance or the step-line
buttons (`Q-0044`), `app/[lang]/page.tsx` still renders three plain
`scene-block`s, and `e2e/pages/home.spec.ts`'s A6 walk still asserts three
scenes with no module in any of them. That walk is now **closer** to right than
it was after `DEC-0109` — the count of three is correct again — and it is still
incomplete, because it does not look for a module inside the first scene. The
completion is owed with the component, at the rule it belongs to, and not before
it: a walk asserting a component nobody has written is a failing check, not a
check.
