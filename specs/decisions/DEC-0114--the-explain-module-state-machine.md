---
id: DEC-0114
title: The explain module's pass is a pure state machine — four ticks, a settled state and a heading state, "once" held in the component instance, and a click or a focus is an interaction while a touch-scroll is not
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

`TS-WEB-0022 D4`, `DEC-0105 §6` (as amended twice on 2026-09-25), `TS-WEB-0002
D7`, `DEC-0109` and `DEC-0110` fix what the `explain-module` component is: one
ordinal and title, a graphic stage below `lg`, exactly three step lines that are
real buttons, one CTA at secondary treatment, and an auto-advance that starts on
the first intersection at `threshold: 0.75` on the module element, dwells 4 s on
state 1, moves in 550 ms, runs one pass to state 3 in 9.1 s, never loops, never
restarts, and stops for good on any interaction. The specification says nothing
about *how* the pass is implemented, how "once per page view" is remembered,
what exactly counts as an interaction, what happens to a move that is under way
when the interaction lands, or what the stage's geometry is inside "one box at
`ratio-square`". Those are the choices this record takes, for task `T-02` of
the 2026-09-25 build. `Q-0084` (which quarter is the missing one) is **not**
decided here: the observer is on the module element at `0.75`, direction-blind,
exactly as written.

The owner's defaults for this build (`owner_decisions_defaulted`) touch the
component in one place: the step core/detail pairs the pages show are taken
from the design drafts into sibling demo slots (`provenance: generated; demo:
true`) by `T-11`/`T-12`, not invented here. The component therefore takes an
`ExplainStep {core, detail}` fragment and carries no wording of its own; the
only step strings this task wrote are test fixtures and the development
fixture's, and the latter are the owner's own words from the design draft
(`plan/reviews/2026-09-23/Design - 3-Schritte-erklären … 11.20.03.png`).

## Decision

1. **The pass is a pure reducer, and the browser feeds it.**
   `src/components/explain-module/explain-advance.ts` holds the whole logic —
   five events (`intersect`, `tick`, `interact`, `select`, `disable`), five
   phases (`armed` · `running` · `done` · `stopped` · `static`) — and
   `explain-advance.test.ts` holds every rule of `DEC-0105 §6` against it
   without a browser. The component does three things around it: one
   `IntersectionObserver` at `threshold: 0.75` on the module element, dropped
   after the first qualifying entry; one `setTimeout` at a time, owned by the
   state it belongs to (`scheduledDelay()`), so leaving a state clears its
   timer and an interaction *cancels* the next advance rather than ignoring
   it; and the rendering. Timers never fire early, so every bound the
   criteria set is a floor the implementation meets by construction.

2. **Four ticks, not two: a settled state and a heading state.**
   `TS-WEB-0022-A19` and `TS-WEB-0002-A13` read "reaches state 3 no earlier
   than 9.1 s" — the moment the transition *settles*. So the machine models
   the 550 ms move as its own step: a tick on a settled state begins the move
   (`heading` runs one ahead of `active`, and the slide is keyed to
   `data-target`), the next tick after `TRANSITION_MS` settles it
   (`data-state` and `aria-current` follow `active`). State 2 settles at
   4 550 ms, state 3 at 9 100 ms after the trigger, and the settle of state 3
   *is* `done` — there is no tick to loop from.

3. **"Once per page view" is the component instance.** The phase lives in
   React state on the mounted module; nothing is written to a cookie,
   `localStorage` or `sessionStorage` (TS-WEB-0013), and nothing is read back.
   The observer is disconnected after the first qualifying intersection, and
   the reducer ignores `intersect` in every phase but `armed`, so scrolling
   away and back cannot restart a pass whether or not the observer is still
   attached. With Cache Components the App Router keeps a visited page mounted
   in a hidden `<Activity>`, so "once" outlives a client navigation away and
   back — which is at least as strict as the rule asks.

4. **What an interaction is.** Focus entering the module (`onFocusCapture`)
   and a click anywhere in it (`onClickCapture` — a step line, the stage, the
   CTA) stop the pass for good. `pointerdown` and `touchstart` are
   deliberately **not** interactions: a reader on a phone scrolls the module
   into view with a finger *on* it, and counting that touch would end the pass
   before it started for most of the audience the exception exists for. A tap
   that does not scroll arrives as a `click` and counts.

5. **A move under way finishes; the next one never starts.** An interaction
   during a transition sets `active` to `heading` and stops there, so the
   stage is never left half-cropped. "From that moment" in the criteria is
   read as "no further advance", and the state shown after the interaction is
   the one the stage was already heading for.

6. **From `lg` the machine is `static` too.** At mount the component reads
   `(prefers-reduced-motion: reduce)` and `(min-width: 48rem)`; either one
   dispatches `disable`, which moves `armed` to `static` — no observer, no
   timer, buttons operable — and is not re-evaluated on resize. A viewport
   that crosses `lg` mid-pass keeps its pass; from `lg` the transform rules
   do not apply, so what continues is the colour highlight and nothing moves.

7. **The stage's geometry.** Below `lg` the stage is one box at
   `--ratio-square`, full content width, `overflow: hidden`; inside it a
   flex track of three panes, each `82 %` of the box wide and `100 %` tall
   with an `--space-2` gap, shifted by whole panes with the site's one
   `--motion-reveal-duration`/`--motion-reveal-easing`. The next state crops
   in at the trailing edge at states 1 and 2; at state 3 the trailing 18 % is
   empty, which is the stage saying the sequence has ended. From `lg` the
   stage and track wrappers are `display: contents`, so the three panes become
   grid items of the module in one row above their own step lines and **no
   stage box exists** — the wrapper's computed `display` is `contents` and its
   `getBoundingClientRect()` is empty, which is what `e2e/explain-module.spec.ts`
   asserts. A `toHaveCount(0)` on the wrapper would not hold, and neither
   would Playwright's `toBeHidden()` (it looks through `display: contents` to
   the children), because the content tree is one tree at every width
   (TS-WEB-0022 D4 "The one breakpoint").

8. **The CTA is secondary by construction, and at the secondary variant.**
   The `cta` prop is a value object, not a node: the component renders the
   `button` component itself with `data-cta="secondary"` hard-wired, and the
   type's `rank?: "secondary"` makes a `primary` value a compile error
   (`explain-module.test.tsx` holds the `@ts-expect-error`). The visual
   variant is the design system's **Secondary** (`paper`/`ink`), because both
   `TS-WEB-0022 D4` and SRC-0014 §"Explain module" say "at secondary
   treatment". The 2026-09-23 design drafts show an ink-filled pill; the
   specification wins (DEC-0104), and moving the weight is a one-line change
   if the owner wants the draft's look.

9. **Two more draft-versus-guide readings, both the guide's.** The ordinal is
   `ink` (SRC-0014: "mono 48 px / 800 `ink`"), not the drafts' green; the
   title is at card-title size, not the drafts' larger one. The active step
   line's core turns `ink` and the others stay `text-2`, the disc `lime-500`/
   `ink` against `surface`/`muted` — colour only, which is what *active*
   means here (`active-step` row of the contract).

10. **The markup.** `aria-current="step"` (the ARIA token for a step in a
    process) on the active button; the three lines in an `<ol>`; the disc's
    digit `aria-hidden` because the list already numbers it; the heading
    level is the page's (`headingLevel` 2 | 3, default 3, under a scene opener
    or a section heading); `steps` and `stage` are three-tuples so a fourth
    step is a type error. Test hooks: `data-state`, `data-target`,
    `data-advance`, `data-mechanism`, `data-explain-stage`,
    `data-explain-pane`, `data-explain-step`, `data-explain-ordinal`,
    `data-explain-cta`.

11. **Where the browser facts are held.** The criteria are timing and
    geometry, and the modules stand on no page until `T-11`/`T-12`. Rather
    than claim them, `app/dev/explain-module` (a development route with the
    same standing as `/dev/components`: 404 on production, `noindex`, linked
    from nowhere) renders one module below a spacer, and
    `e2e/explain-module.spec.ts` measures the pass at 360 × 640 and 360 × 800,
    the stop on focus and on activation, reduced motion, the constant stage
    height, the single lines at 390 px and the `lg` row. The gallery entry the
    backlog lists as optional is **not** added: `gallery.tsx` is `T-10`'s and
    lands first, and the gallery's inventory test pins the exact list of 61
    names — adding the entry is a two-file follow-up once `T-10` is in.

## Consequences

- `pnpm test` covers the whole rule set of the exception in 31 unit cases
  that need no browser; `pnpm e2e e2e/explain-module.spec.ts` covers the
  browser halves on the fixture route. `e2e/motion-reveal.spec.ts` keeps its
  `TS-WEB-0002-A13` `fixme` until `T-12` puts the module on `/mitmachen`.
- `src/components/content-fragments.ts` gains `ExplainStep {core, detail}`
  beside `Step`; `publishing-path` is untouched and `T-12` retires it.
- Nothing in this record moves a status, amends a determination or answers
  `Q-0084`. If the owner's answer to `Q-0084` adds a condition, it lands as a
  second observer or a direction check in the component's one effect and as
  one more event in the reducer.
