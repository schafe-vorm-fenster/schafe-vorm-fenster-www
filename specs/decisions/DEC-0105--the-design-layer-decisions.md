---
id: DEC-0105
title: The design layer's five undocumented decisions, recorded — and the scrim's ladder is fixed, not measured
status: accepted
date: 2026-09-25
decided_by: jan-henrik.hempel
---

## Context

Five decisions of 2026-09-23 were written straight into
`concept/website-design-system.md` and cited from
`specs/contracts/design-system-contract.md` as *"decision 5"*, *"decision 6"*,
*"decision 7"* and *"decision 8"*. Those parentheses were the whole record.
A grep of `specs/decisions/` for the scrim, the blur primitive, the category
taxonomy or the motion exception returns one substantive hit — DEC-0077, and
only in passing.

That is the shape DEC-0080's own context named as forbidden: *"a rule with no
decision record, which is exactly what the framework forbids"*. A guide is now
specification-side (DEC-0104 §3), and a guide that states a decision nobody
recorded is a determination with no anchor; `check:specs` E4 would refuse `S3`
on a requirement citing it.

One of the five was also **wrong in a way only the audit caught**. Decision 5
said the scrim's contrast is *"verified by measurement against the actual
photograph, per hero"*. Nothing performs that measurement: `check-contrast.ts`
reads `--name: #hex` declarations and computes WCAG luminance over two solid
colours — it never opens an image, never composites alpha, and has no concept
of a photograph, a gradient or a text box. The guide itself recorded the check
as *"owed"*. A requirement whose meter does not measure what the statement says
is worse than one with no meter, because it reads as covered.

The map date is the exception and is named here for completeness: it **does**
have a record, DEC-0061, and this one does not replace it.

## Decision

**All five are recorded here, and the scrim's per-photograph measurement is
withdrawn in favour of the fixed ladder the draft actually authored.** One
record rather than five, because they are one layer and two of them share a
token: the blur primitive reads `scrim.38` for its tint and `scrim.35 → scrim.0`
for the band that carries the header, so a change to the ladder is a change to
the blur.

### 1. The scrim is a fixed ladder with a 0.72 ceiling

`concept/website-design-system.md` §*Photo surface* is binding, as decision 5
left it, with one reversal:

| What | Determination |
| --- | --- |
| Base | **neutral black.** Not `ink`, not `violet-500`, not a tint of either — a tinted scrim dyes the photograph. The one named exception to "never pure white or black" (§*Colour*), because a scrim is not a surface colour: nothing is set in it and nothing is read against it as a ground |
| Ladder | `0 · .30 · .35 · .38 · .45 · .72`, as `color.scrim.*` tokens. **Fixed, authored, not derived from any image** |
| Ceiling | **0.72.** The retired 0.96 step put the text on a black band, which is the thing the reader was told it was not sitting on |
| Stops | the draft's two gradients — the top band that carries the header, and the reading band under the headline and the CTAs |
| Text shadow | part of the treatment, `0 1px 2px scrim-45, 0 2px 10px scrim-30`; soft by construction, and only on a photo surface |
| Never a literal | `TS-WEB-0017 D3`/`A5` reject an `rgba(…)` at a call site, so the neutral look has to *be* a token |

**The per-photograph measurement is withdrawn.** It was never performed and
there is no practical way to perform it: it would mean compositing two
gradients over every rendition of every hero at its declared `object-position`,
sampling two text boxes and taking the worst pixel, on every build, for a set
of photographs that is not yet chosen. A requirement that names a measurement
nobody will run is a gap dressed as a measure.

**What replaces it is not another number.** No value is invented here — the
ceiling and the six stops are the ones the draft authored, and the 4.5:1 and
3:1 floors are WCAG's, already fixed by DEC-0056. What changes is where the
*photograph's* half of the pair is answered: not in a number, but in the two
rules the guide already carries.

### 2. The crop and the focal point carry the motif

`SRC-0014` §*Photo surface* already says it, and this record makes it the
answer rather than an aside:

- **`object-position` comes from the motif's declared focal point, never
  `center` by default.** Village photographs are sky-heavy and a centred crop
  parks the motif in the bottom third, exactly where the scrim is densest.
- **For a sky-heavy motif the focal point sits at or above 40 %**, so the sky
  crops away and the motif lands above the scrim's opaque band.
- **"A photograph that only works when the scrim covers its subject is the
  wrong photograph."** That sentence is now load-bearing: it is how a motif
  that would fail the floor is excluded, and the remedy is a different crop or
  a different picture — never a darker scrim, because the ceiling is fixed.
- The placeholder badge and the "Foto gesucht" hatch stay as they are: a
  photograph that does not depict what the copy claims is marked, not accepted.

This is a judgement at the editorial gate, and it is declared as one. The
alternative — a per-image number — is what §1 withdrew.

### 3. `NFR-WEB-0058` and `NFR-WEB-0059` carry the composite in their statements

The composite qualification was in a `## Notes` block, where it bound nothing.
It moves into the statement, inside the `<object>` slot of the quality form
(`method-statement-grammar` Q: *"`<scale>` of `<object>` SHALL be `<operator>`
`<value>` `<unit>` measured by `<meter>`"*), which keeps one modal and one
predicate and does not make either requirement a compound:

> Contrast ratio of body text against its ground — on a photo surface the
> composite of the photograph with the **fixed** scrim stop at that position,
> ceiling 0.72 — SHALL be >= 4.5 :1, measured by `scripts/check-contrast.ts`
> (`TS-WEB-0002-A3`).

`NFR-WEB-0059` takes the same qualification at 3:1 for display type and
non-text contrast. `DEC-0096`'s invariant holds: each is still measured by
exactly one criterion, `TS-WEB-0002-A3`, and no criterion was added or split.

**What the meter does and does not reach, stated on both artefacts.** The
fixed ladder makes the scrim half a token pair, which is the layer
`check-contrast.ts` measures. The photograph half is not a token and is carried
by §2 plus `DEM-0027`, which already asks brand/design for measured ratios.
`TS-WEB-0002 D3` gains the photo-surface ground so the determination says what
the requirement says.

**No new acceptance criterion, and the reason is not thrift.** A static
assertion of the ceiling is the obvious candidate and it would **fail today**:
`src/components/photo-surface/photo-surface.module.css` still composes
`color-mix()` at 82 %, 84 % and 96 % from `--color-neutral-ink`, which is the
ink-tinted scrim decision 5 retired and a step above the ceiling. Adding a
check that fails is not a check; the component rewrite is recorded as owed at
the rule it belongs to, and the criterion goes in with it.

### 4. The blur primitive

`backdrop-filter: blur(12px) saturate(120%)`, on the control's own shape, with
`scrim.38` above the blurred area so the glyph has a measured ground rather
than whatever the photograph happens to be. It is the **only** blur in the
system and `overlay-header` is the only component that may declare it.

**The fallback is a declared state, not an absence**: the 44 px `ink` control
well with a `paper` glyph at 16.56:1, selected by capability —

```css
.header-control { background: var(--color-ink); }          /* the floor */
@supports (backdrop-filter: blur(12px)) {
  .header-control { background: var(--color-scrim-38);
                    backdrop-filter: blur(12px) saturate(120%); }
}
```

Three conditions take it, and the third is the one worth recording as a
decision rather than a note: `backdrop-filter` forces a compositor layer that
re-rasterises on scroll, over a sticky element, above the largest image on the
page — the LCP element on four routes of `TS-WEB-0003 D2`. **The treatment is
legal only while the route stays inside `TS-WEB-0003 D1` with it applied.** If
a route falls out on the measured run, that route takes the fallback: the
budget wins. The other two are no `@supports` match and
`prefers-reduced-transparency`.

`TS-WEB-0002 D4` names `prefers-reduced-motion`, `Save-Data` and OS font
scaling and does **not** name `prefers-reduced-transparency`. That gap is real
and is recorded as an open point on `TS-WEB-0002` rather than filled here, and
no criterion asserts the blur or its fallback yet — the same position the
component rewrite is in.

### 5. The category taxonomy is `classification-api`'s, and the guide's six rows were the outlier

The canonical list is `@schafevormfenster/rural-event-types` inside
`classification-api` — **four ids** — plus `unknown` as the value returned for
an unclassified event, which is a fifth *rendering case* and not a fifth
category. `color.category` in `@schafe-vorm-fenster/brand-design` already
carries exactly those five keys.

So decision 7 is **neither** of the two options the guide put up: not the five
token keys as authority and not the six guide rows, but the owning service, to
which both then align. The guide's six rows were the outlier and now follow it;
the package was already right and was not changed for this.

What stays open is provenance, not the list: the package's own
`color.categoryStatus` still reads `PROVISIONAL — the canonical source was not
reachable and has not been read`. It has now been read, PR #464 replaces the
marker, and `DEM-0039` / `Q-0055` stay open until it lands. The token values
are not restated here (DEC-0083 §1: a value is content, and these are the
package's).

### 6. The motion exception, and why it is one exception rather than two rules

The explain module's graphic stage may auto-advance through its three states.
**This is the one exception to "one movement only" in the whole system**, it is
the owner's and not the guide's, and the scope is part of it:

- **Only below `lg` (48 rem)**, because only there is a state hidden. From `lg`
  the three steps stand side by side and there is nothing to advance to — which
  is also why "no second animation" and "a motion exception" stopped being two
  rules pointing opposite ways.
- 550 ms per transition, at least 4 s dwell, **pausing on focus or on any
  interaction** and not resuming.
- **The three step lines are the controls, at every size** — real buttons,
  `Tab`, `Enter`/`Space`, `aria-current` on the active one. A step is never
  reachable only by waiting.
- Under `prefers-reduced-motion` the stage shows **state 1 static**. The
  fallback is a static state, never a faster animation.
- The highlight-only animation from `lg` is not a second exception: it changes
  colour, not position, and a colour change on an active state is what *active*
  has always meant here.

**A tension this record does not paper over.** `TS-WEB-0002-A9` asserts *"with
`prefers-reduced-motion`: no animation beyond opacity"*, and the exception
specifies a slide. The two are compatible only because the exception's own
reduced-motion fallback is a static state — so under that media query there is
no slide to permit. `A9` is left as it stands, and the reconciliation is stated
here rather than by loosening the criterion.

#### Amendment of 2026-09-25 — what starts the advance, and where it ends (Q-0081)

The exception above fixes the duration, the dwell, the pause and the
reduced-motion fallback and says nothing about the **trigger**. That was harmless
while the module was `/mitmachen`'s own content; `DEC-0109` put it on `/`, where
for `professional` and `purchase-intent` it is the **last** block of 2a, so an
advance keyed to page load has finished cycling before the reader arrives and she
meets state 3 with no sign that two came before it. `Q-0081` asked the owner,
because this exception is his. **His answer, amended into this record rather than
decided in a spec:**

1. **It starts on intersection, not on page load, and only when at least
   *three quarters* of the module are in the viewport.** Two reasons, and they
   are different: an advance keyed to load has already finished by the time the
   reader gets there, and a stage half off-screen animates where nobody is
   looking. The fraction is the owner's answer to `Q-0083` of 2026-09-25 and
   replaces the *"whole module"* this rule read until then; what the three
   quarters are measured against is fixed in the **second amendment** below,
   and so is the evidence that the reason above survives the change.
2. **State 1 gets a full dwell before the first advance.** A reader who arrives
   mid-scroll sees step 1, not its end.
3. **One pass, then stop at state 3. There is no loop.** A loop beside text
   competes for attention permanently, and it is what WCAG 2.2.2 (Pause, Stop,
   Hide) is about.
4. **Any interaction stops it for good** — not pause-and-resume. This is the
   sharpened reading of the *"and not resuming"* already above: focus or a step
   activation ends the pass, and nothing restarts it.
5. **No restart when scrolling back.** Once per page view, and "once" is spent by
   a pass that has *started* — not by the module having been on screen.
6. Under `prefers-reduced-motion` there is **no advance at all**: state 1 static,
   step lines operable. That is already what this section says and it is not
   restated.

**The total, measured rather than asserted.** The dwell in §6 above is *"at least
4 s"* and the transition is 550 ms, so one pass is `4 000 + 550 + 4 000 + 550 =
9 100 ms` — **9.1 s** from the trigger to the moment state 3 settles, and longer
wherever the implementation takes the dwell above its floor. The dwell is a
minimum, so 9.1 s is the floor of the pass, not its value.

**Why that makes WCAG 2.2.2 binding, and what satisfies it.** 2.2.2 applies to
moving content that *starts automatically*, runs *longer than five seconds* and is
presented *in parallel with other content*. All three hold: the trigger is
automatic (rule 1), 9.1 s > 5 s, and the module sits inside a scene with an opener
above it and a live event row below it. So a **mechanism to pause, stop or hide**
is required, and the exception already contains one: **the three step lines are
real buttons at every size** (`Tab`, `Enter`/`Space`, `aria-current`), and rule 4
makes activating one a *stop*, not a pause. That is what makes the criterion
satisfiable, and it is why rule 4 is stop-for-good rather than pause-and-resume: a
pause that resumes is not a stop, and a control that only re-orders the same loop
is not a mechanism. `TS-WEB-0002` carries it as a determination and a criterion,
because that spec governs accessibility and a WCAG obligation may not live only in
a design guide.

**Two edges of rule 1, because the rule has to be decidable.**

- **A module scrolled past in one step never triggers, and that is correct.** An
  `IntersectionObserver` reports only a *change* of `isIntersecting`, so a flick
  to the end of the document can carry the module from below the viewport to above
  it with no callback — the same mechanic as finding F-3-10 in
  `e2e/motion-reveal.spec.ts`. No pass starts, and by rule 5 nothing is spent
  either: the first moment three quarters of the module are genuinely in the
  viewport still starts the one pass. Rule 5 bites on a pass that ran, not on a
  module that was skipped.
- **A viewport shorter than the module** could not satisfy "the whole module is
  in the viewport" at all, and the case is reachable: the one-viewport rule is
  authored against 360 × 800 while `TS-WEB-0006 D3`'s fold viewport is 360 × 640
  (`TS-WEB-0022 D4`). Taken literally, the old rule 1 would then never fire and
  the reader would meet a stage that never moves with no indication that it
  could. That was `Q-0083`, and it is **answered**: the owner lowered the
  fraction rather than adding a fallback for the short case, so rule 1 now fires
  at both heights and the `[PROPOSED]` "graphic stage plus the first step line"
  sub-clause this record used to carry is **withdrawn** — see the second
  amendment below. Nothing about the short viewport is special any more.

#### Second amendment of 2026-09-25 — how much of the module (Q-0083)

`Q-0083` put the one sub-clause rule 1 left `[PROPOSED]` to the owner of this
exception. **His answer, amended into this record rather than decided in a
spec: the advance starts when three quarters of the explain module are
visible.** He lowered the fraction instead of granting the short viewport a
fallback of its own, which is why the "graphic stage plus the first step line"
reading is withdrawn above rather than promoted.

**What the three quarters are measured against, because a fraction with no
denominator decides nothing: the module's own height.** Not the viewport's, not
the scene's, and not the section's. So the trigger is an
`IntersectionObserver` on the **module element**, against the viewport as root,
with a **`threshold` of `0.75`** — `intersectionRatio` is the intersection
divided by the *target's* own bounding box, which is exactly what makes the
rule independent of viewport height and of which of the three `TS-WEB-0019 D3a`
slots the module sits in. A module 686 px tall triggers at 515 px of itself on
screen whether the viewport is 640 px or 800 px, and that is the property
`Q-0083` was missing.

**The owner's reason, checked rather than assumed.** His reason for the trigger
is that *"a stage half off-screen animates where nobody is looking"* — the
reader has to see state 1. The component does not exist yet (`src/components/`
holds `publishing-path` and `step-indicator`, and neither is the stage), so the
check was run against the **specified** geometry at 360 px: 16 px gutter per
side, ordinal at `font-size-display-mono` (48 px) and `leading-tight`, title at
`type-card-size`, stage at `ratio-square` = 328 px, three step lines at 18 px
core / 15 px detail over the 44 px `target-min` floor with `space-3` between
them, a 44 px secondary CTA, and `space-4` between the parts. Measured in
Chromium at both viewport heights:

| Module | Height | Fits 360 × 640? | Stage visible at `0.75`, read downward | …read back upward |
| --- | --- | --- | --- | --- |
| one-line title | **629.5 px** | yes, by 10.5 px | **100 %** | 72.8 % |
| two-line title | **686.8 px** | **no** | **100 %** | 85.7 % |

Two things follow, and the second is a finding rather than a reassurance.

- **Q-0083's premise is confirmed and the answer removes it.** The taller of
  the two variants is 686.8 px and cannot be wholly inside a 640 px viewport, so
  the old rule 1 really never fired there; at `0.75` it fires at 515.1 px. And
  on the ordinary read — the reader scrolling **down** into the module — the
  graphic stage is **fully** visible at the moment the pass starts, at 360 × 640
  and at 360 × 800 and at both module heights. The owner's reason is intact on
  the path he was describing.
- **A fraction below 1 does not say *which* three quarters, and read upward the
  missing quarter comes off the top — where the stage is.** Entering the module
  from *above* (the reader scrolls back up, the case edge 1 above keeps alive by
  spending "once" only on a pass that started) `0.75` is reached with the stage
  72.8 % or 85.7 % visible and its top cropped 89.2 px / 46.8 px above the
  viewport. The old "whole module" rule had no such asymmetry, because 100 % is
  direction-free; the asymmetry is the price of any fraction below it, not of
  this fraction in particular. It is **not** smoothed over here and it is not
  decided here either: it is **Q-0084**, addressed to the same owner, because
  adding "and the stage in full" to a fraction he chose is his call and not an
  executor's. Until he takes it, rule 1 is the fraction as written and the
  criteria assert it as written.

### 7. The map date is DEC-0061's, and stays there

`/deine-region` names the enterprise map view as a dated, forthcoming feature —
**January 2027** — and never as an existing one. That is DEC-0061, recorded
2026-09-11, and this record does not restate or supersede it; it is listed
because the audit's A7 grouped it with the other four and a reader needs to
know which of the five already had a record.

Two amendments belong to it rather than to a new record, and are made here:

- **"Auf Anfrage" carries no size qualifier.** "nach Größe" is dropped until a
  real tier exists in the hub. The tier is differentiated by features — the map
  view and the white-label registration — not by territory (`DEC-0060`,
  `TS-WEB-0026 D3a`).
- The January 2027 date is **asserted by DEC-0061 and unconfirmed upstream**:
  `TS-WEB-0026`'s own open point records that the offering's ship date was never
  confirmed, and `TS-WEB-0026-A17` blocks the claim until it is. That stands.

## Consequences

- `NFR-WEB-0058` and `NFR-WEB-0059` carry the composite in their statements and
  say in `## Notes` what the meter reaches. Both keep `form: Q1`, `S3`,
  `TS-WEB-0002-A3` as the single criterion, and their numbers.
- `concept/website-design-system.md` says **fixed** where it said *measured per
  photograph*: §*Photo surface*'s contrast subsection is rewritten, the
  open-decisions row for decision 5 is corrected, and the two stale
  `NFR-WEB-0011` citations become `NFR-WEB-0058`/`NFR-WEB-0059` (the id was
  retired by DEC-0092).
- `specs/contracts/design-system-contract.md` §*Consequence for the specs* no
  longer owes a per-photograph hero row. What it owes is the component rewrite
  and the criterion that goes in with it.
- `TS-WEB-0002 D3` gains the photo-surface ground; `TS-WEB-0002` gains an open
  point for `prefers-reduced-transparency`.
- `TS-WEB-0027 D2`'s "ink gradient" is corrected: the ink and violet variants
  are retired and there is one neutral treatment for every hero.
- No acceptance criterion was added, renamed or removed; the count is
  unchanged. No token value, ratio or opacity was invented — every figure here
  is the draft's, WCAG's, or the package's.
- **The §6 amendment of 2026-09-25 adds one criterion and no figure.**
  `TS-WEB-0002` gains `D7` and `TS-WEB-0002-A13` for WCAG 2.2.2;
  `TS-WEB-0022-A19` and `TS-WEB-0019 D3a` are amended; the guide's motion
  exception and `specs/contracts/design-system-contract.md`'s `auto-advance` row
  carry the trigger. The 9.1 s total is computed from the dwell and the transition
  this record already fixed — nothing new was chosen. `Q-0081` closes, `Q-0083`
  opens for the one sub-clause the owner's answer did not cover.
- **The second §6 amendment of the same day adds no criterion and one figure,
  and the figure is the owner's.** `0.75` of the module's own height replaces
  *"the whole module"* in rule 1, the `[PROPOSED]` short-viewport fallback is
  withdrawn, and the same six places carry the change: the guide's §*Explain
  module* and §*Motion*, the design-system contract's `auto-advance` row,
  `TS-WEB-0022 D4` and `-A19`, `TS-WEB-0019 D3a`, and `TS-WEB-0002 D7` /
  `-A13`. No acceptance criterion was added, renamed or removed. `Q-0083`
  closes; the direction the fraction does not fix is `Q-0084`.
- `DEM-0027` (measured ratios for colour world 3c) and `DEM-0039` / `Q-0055`
  (the category token provenance) stay open. Nothing moved off `DRAFT`.

### What this record does not do

It does not write the `photo-surface` component. The shipped component is three
generations behind the rule — `--photo-scrim: var(--color-neutral-ink)` with a
`violet-500` tone variant, composed to 82 %, 84 % and 96 % — and `check:brand`
cannot see it, because the guard catches colour literals and not a token used
against its own rule. The position is three things at once, and the guide
already says so: **the ladder is the rule**, the package carries it once PR #464
lands, and the component does not implement it yet.
