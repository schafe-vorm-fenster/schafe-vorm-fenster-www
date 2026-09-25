---
id: DEC-0115
title: The stage graphics carry no sample of their own — the page passes real rows or a marked sample, the status sits on the event row, and a picture of a control is hidden from assistive technology
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

`explain-module` (`specs/contracts/design-system-contract.md`, SRC-0014
§Explain module, TS-WEB-0022 D4) shows a graphic stage below `lg` — one
`ratio-square` box holding three states — and one graphic per step from `lg`.
The owner's drafts of 2026-09-23 (`plan/reviews/2026-09-23/Design -
3-Schritte-erklären …`) draw four such graphics: a chat with a flyer, a
calendar panel with an event-status badge, a registration card, and a photo.
T-03 builds them as `src/components/explain-stage/` plus the new
`event-status-badge`. Five things the drafts and the specification leave open
had to be decided to build them; this record holds all five.

1. The drafts show sample rows for **Flechtorf** and **Krenzow** — neither is
   a place the calendar covers. DEC-0068 rule 3 forbids an invented place, and
   rule 1 wants every placeholder marked in the DOM.
2. The design system says a status badge stands *beside* the category badge,
   never instead of it, and that an event list on the website renders in
   **app parity** — day numeral and month, category as icon, colour and
   written label. The drafts drop month and category; the guide says the
   drafts follow the rule, not the other way round. Where the status badge
   lives in the markup — on `event-row` or composed next to it — was not said.
3. The `verschoben` badge is `paper` on `paper`; the design system gives it a
   1 px `line` hairline "on a paper ground". The brand token sheet ships a
   `--color-status-event-verschoben-border` of `border` (`#6F7467`) instead.
4. The registration graphic draws a label, an address pill and an "Anmelden"
   pill. TS-WEB-0006-A17 forbids a form element outside two routes, and a
   picture of a control that a screen reader announces as a control is a trap.
5. The words inside the graphics — "FLYER.JPG", "Kalender-Adresse",
   "Anmelden", and the three status words — exist in German in the drafts and
   the design system. Nobody has written the English ones.

## Decision

1. **No sample data lives in the components.** `StageCalendar` takes `place`
   and exactly three rows from the page, plus `provenance: "live" | "sample"`.
   `live` is a covered place's real rows (T-11/T-12 pass them); `sample` marks
   the panel `data-placeholder="sample-events"` and renders every row through
   `event-row`'s `mocked` state, so each carries `data-demo="true"`. `StageChat`
   takes its reply and timestamp, `StageRegistration` its address. The
   components hold no place name, no date and no sentence.
2. **The status is a prop of `event-row`, not a sibling.** `EventRow` gains
   `status?: EventStatus` and `statusLabel?`, renders `event-status-badge` on
   the title's line, right-aligned, and keeps the category on the meta's line
   — so a status can never be rendered without its category, which is the
   rule. A row without a status is byte-for-byte the row it was: the title
   spans both content columns as before, and gives the status column up only
   on `.row[data-status]`. `StageCalendar` therefore composes `event-row`
   unchanged on its dark tone, and parity is inherited rather than re-drawn.
3. **The hairline is `line`, drawn inside the box.** SRC-0014 is
   specification-side (DEC-0104 §3) and the token sheet is a source, so the
   guide's `line` wins over the token's `border`; `event-status-badge` takes a
   `ground` prop (`paper` · `ink`) and paints `inset 0 0 0 1px line` only on
   `paper`, keeping the badge exactly as tall as its siblings. `event-row`
   derives the ground from its `tone`.
4. **A picture of a control is `aria-hidden`.** `StageChat` and
   `StageRegistration` are drawn with `span`s and `div`s — no `form`, `input`
   or `button` — and the whole graphic is hidden from assistive technology;
   the step lines beside the stage carry the meaning. `StageCalendar` stays in
   the tree, because its rows are real dates in app parity and a status is a
   word that must be read. `StageImage` is `media-frame` at `ratio-square` —
   including its missing-photo surface, which the frame owns, so this
   component draws nothing of its own.
5. **German words are the drafts', English ones are marked generated.** The
   dictionary gains `eventStatus` and `explainStage`, each with a
   `generated` flag: `false` in German (the drafts and the design-system
   table are the source), `true` in English, where `event-status-badge` and
   `StageRegistration` render `data-demo="true"` until the owner replaces the
   words (state/open.md rows 219–220). The two asset gaps the drafts hatch —
   the flyer photo and the calendar-settings screenshot — carry
   `data-placeholder` until the page passes a real `flyerSrc` /
   `screenshotSrc` (rows 221–222).

## Consequences

- A page that shows the stage must supply the rows. A sample without
  `provenance="sample"` is not possible by accident — `live` is the default,
  and a page that passes the drafts' Flechtorf rows as live has invented a
  place, which the content review catches, not this component.
- Every `event-row` on the site can now carry a status; the live modules do
  not pass one yet, because the events-api mapping (`src/lib/live/`) has no
  status field. That is T-07's ground, and this record does not touch it.
- The `event-row` grid gained a named `status` area. `e2e/event-row.spec.ts`
  measures rows without a status, whose geometry is unchanged; a row *with*
  one has no e2e measurement until a page renders it (T-02/T-12).
- The four graphics are not in `gallery.tsx` (T-10's file); their contract is
  held by `src/components/explain-stage/explain-stage.test.tsx` and
  `src/components/event-status-badge/event-status-badge.test.tsx` until the
  gallery lists them.
- `pnpm check:brand` reads the two new stylesheets like any other: every
  colour is a token, and the one hairline is `--color-neutral-line`.
