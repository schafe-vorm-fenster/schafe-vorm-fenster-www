---
id: DEC-0117
title: The archive ground is its own colour family, the closing search block is the one further ink section, and the objection block's failures are neutral
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

Task T-05 of the 2026-09-25 build (review items R-mitmachen-8, R-mitmachen-9,
R-home-26, R-ueber-6, R-kalender-19, R-kalender-6) builds what
`concept/website-design-system.md` (SRC-0014) determines in §Archive block
(lines 853–866), §Page Rhythm (897–902), §"Section grounds carry rhythm, not
meaning" (917–937) and §Quote card (473–487), against
`specs/contracts/design-system-contract.md` §1 (`archive-block`, `quote-card`,
`icon-well`) and `TS-WEB-0022 D3`. Three things the code did until now
contradicted those determinations:

- `objection-list` marked every failure with `circle-x` in
  `--color-status-error` — the guide says the icon "never" says the failure
  twice, and `circle-x` "never appears in an archive block".
- `section-shell` had no `archive` surface, so problem content had no ground
  to take.
- `checkRhythm` forbade a second `ink` section outright, while the guide's own
  home rhythm ends on a tenth, `ink`, closing search block.

The guide leaves a handful of choices open, and the 2026-09-23 design
(`plan/reviews/2026-09-23/Design - wo es hakt.png`) contradicts the guide in
one place. The owner's defaulted decision for this task reads: *"checkRhythm
allows a second `ink` section only as the last section (the closing search
block on /) and never counts the contact section."* Everything below is the
executor's choice inside that.

## Decision

1. **`archive` is a section surface and its own colour family.**
   `SECTION_SURFACES` gains `archive` (ground `--color-archive-ground`, text
   `ink`, kicker `--color-archive-ink`), and `rhythm.ts` gives it the family
   `archive` — neither `neutral` nor `lime`. A `paper → archive → surface` run
   is three families, which is what the eye sees; the two-in-a-row maximum
   applies to `archive` like to every family.

2. **The archive block's kicker and core line are set in `archive ink`,
   measured here.** SRC-0014 contradicts itself: lines 155–165 keep the kicker
   in `ink` "until that measurement is taken", §Archive block (857) and the
   contract's `archive-block` row say `archive ink`. The measurement is taken
   with this record (WCAG 2.x relative luminance over the installed
   `brand-design@2.8.1` values): `archive ink` `#7A4F00` on `archive ground`
   `#FBF1DC` **6.35:1**; `text-2` **9.52:1**; `ink` **15.37:1**; `lime-800`
   (links) **6.19:1**; `archive line` **1.42:1**, which is the weight `line` has
   on `paper`. The block therefore ships kicker and core in `archive ink`,
   detail in `text-2`, the closing sentence in `ink` at Lead size, hairlines in
   `archive line`, and the bare 24 px glyph in `archive ink`. The row is the
   step-line shape (CG-025): core **body 18/700**, detail body 18/400 —
   not the 21 px card title the old list used — because the closing sentence
   "set larger than the rows" is Lead 20, and 20 is not larger than 21. Lines 155–165 of
   the guide are now stale and are the guide owner's to strike; no spec edit
   was in this task's scope.

3. **`checkRhythm` accepts a second `ink` section only as the page's last
   section, never adjacent to the first, and rejects a third.** The predicate
   cannot see whether a section carries a search field; it holds the two facts
   it can see — last, and not adjacent — and names each in its own rule
   string (`RHYTHM_RULES`). The contact section is exempt by omission **and**
   by name: a page's own list leaves it out, and a DOM walker may pass it as
   the new entry `contact`, which the predicate drops before any rule looks,
   so it neither adds to a run nor breaks one and does not stand between a
   closing ink block and the page's end.

4. **The objection block is one block with two grounds.** The upper part —
   who the date does not reach — sits on the section ground in a `surface`
   box; the lower part is an `archive-block` with `ground="own"`, which paints
   the archive ground itself and runs out to the section's gutter (edge to
   edge at the phone breakpoint, the authored viewport). Composing two
   sections instead was rejected: `TS-WEB-0022 D3` and the task make the
   objection one block with one headline, and the proof slot D3 requires sits
   beside that block. Standing alone inside `section-shell surface="archive"`,
   the block inherits the section's ground (`ground="inherit"`, the default).

5. **Glyphs default by position and never by failure.** Upper rows take
   `house` · `map-pin` · `users` (the design's order); archive rows take
   `megaphone` · `clock` · `users` (the guide's order: the flyer, the paper's
   deadline, the own channels). A row may name its own glyph; a fourth row
   repeats from the start. `circle-x` and `--color-status-error` appear
   nowhere in the block.

6. **The icon well is `lime-100`, not the design's `lime-500`.** SRC-0014
   §Wells: a `lime-500` fill on a light ground means *active state* and
   nothing else. On the `surface` box the well measures 1.03:1 — it is
   decoration, non-text, and the guide's own pairing for that ground; the
   `lime-800` glyph on it measures **5.94:1**. The well's 40 px is the new
   `--height-icon-well` in `app/styles/components.css`, beside the other
   fixed heights, because no `target.*` token carries a non-interactive size.

7. **`quote-card` takes `sourceLabel` and `sourceUrl`, and `role` and
   `organisation` as two required props** rendered as `role, organisation` —
   punctuation, not assembled prose — until the hub proof schema gains quote
   and source fields (spec-impact B). The card is a `figure` with the quote in
   a `blockquote` and the author in a `figcaption`; the source is an
   `outbound-link` (inline variant, 18 px `external-link`, `newTab` off by
   default and announced in the link's own text when on); the hairlines are
   the tokens `--border-hairline` and, on `lime-100`, `--border-hairline-on-lime`.

8. **`proofSlot` stays a prop** (`TS-WEB-0022 D3` still requires the slot; the
   page decides, T-12). Where the page asks for it, the upper rows and the
   proof share the 2fr/1fr grid from `lg`.

## Consequences

- `rhythm.test.ts`'s former "rejects a second dark anchor" case — `ink, paper,
  ink` — is now the legal closing shape and is asserted as such; a second ink
  anywhere but last, two adjacent inks and a third ink each have their own
  case. Every page rhythm test in the repository still passes unchanged.
- `e2e/objection-list.spec.ts` holds the rendered facts on `/mitmachen`
  (ground, ink, hairline, glyphs, the closing sentence larger than the rows)
  with every expected colour resolved from the loaded token, not written.
- The component gallery (`src/components/gallery.tsx`, `gallery.test.tsx`)
  does not yet list `archive-block` and `quote-card`; the gallery is T-10's
  file, and the test pins the inventory list, so the two entries land with
  that task. `SLOT_CONTENT_TYPES` has no `quote-card` content type yet either
  — a content-schema change no task in this wave owns.
- `scripts/check-contrast.ts` (T-04) measures only the placeholder pair on the
  archive ground; the four pairs of decision 2 are measured here by hand and
  are candidates for that list.
- The task cites `TS-WEB-0019-A10` as "closing ink section allowed"; the
  criterion's text is about the context band and the closing CTA's conversion
  goal, not the rhythm. The rhythm exception is asserted in `rhythm.test.ts`
  under the guide's §Page Rhythm; no criterion was amended.
- SRC-0014 lines 155–165 now contradict decision 2 and §Archive block; the
  guide is specification-side (DEC-0104 §3), so this is the guide owner's
  correction, not a `DEM-####`.
