---
id: DEC-0196
title: /mitmachen drops its live example, and the closing CTA follows the three paths directly, on ink
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue 154, "NEXT2026 Mitmachen: Live-Beispiel entfernen, Abschluss-CTA direkt
hinter die drei Wege" (owner). The three publishing paths of `/mitmachen` (1
WhatsApp, 2 connect a calendar, 3 a website as the source) explain how dates
get into the calendar. After them the reader is to act. Until this record the
page went on with the live example "So sieht das in {Ort} aus"
(`mitmachen-6-beispiel`, `ink`), then the customer proof, and only then the
closing CTA "Der nächste Flyer kann der erste Termin sein." at the foot of the
page. The owner: the live example "ergibt an dieser Stelle keinen Sinn", and
the action belongs directly behind the paths.

## Decision

1. **The live example leaves `/mitmachen`**, in both languages, without
   replacement. The slots `mitmachen-6-beispiel` and
   `mitmachen-6a-reference-place` are removed from the page's artifacts, and
   the example-place selection (`example-place.ts`, TS-WEB-0022 D5) goes with
   them. Path 1's third stage state keeps its three live rows of the stage-0
   anchor (`liveSlug`, DEC-0115): it is the page's one live module now.
2. **The closing CTA stands directly after the third path**, after the hint
   banner, and **on `ink`**. Its heading, label, target and reassurance are the
   slot's (`mitmachen-8-closing`) and the hero CTA's, unchanged: no new text.
3. **Then the customer proof, then the context band**, then the contact
   section and the footer (chrome). The grounds read `paper` (path 3) → `ink`
   (closing CTA) → `lime-100` (proof) → `surface` (band); the contact section's
   fixed `lime-100` is not a rhythm entry.
4. **`ink` passes from the live example to the closing CTA.** The page keeps
   exactly one dark section (TS-WEB-0022 D10, SRC-0014 §Page Rhythm). The
   ground publishes its own button, link and meta colours (`section-shell`'s
   `.ink`): the button is the dark-ground primary, `lime-500` with `ink` text,
   the reassurance takes `--ground-meta` (`lime-300`).
5. **The frame still places the closing block.** `PageFrame`'s `repeat`
   closing block takes `surface` (`paper` by default, `ink` here) and
   `followedBy`, the page's own blocks that stand between the closing block
   and the band. `/mitmachen` hands over its proof block there; no page
   renders a closing CTA of its own. The `module` variant's `surface: "ink"`,
   which moves the closing search behind the band, is untouched: a `repeat`
   block on `ink` stays before the band.

## Deviations, and what they amend

- **TS-WEB-0022 D2** (slot inventory and order): slot 4 `beispiel` is removed,
  and the layout's closing CTA stands between slot 3 and slot 5. **D5** (the
  live example) is retired. **D1** `liveModules` now names path 1's live stage
  state. **D8**'s stage variance loses "which place the example shows".
  **D10**'s dark anchor is the closing CTA. Acceptance criteria **A3**, **A10**
  and **A16** are amended to the new order and anchor; **A7**, **A8** and
  **A9** are retired with D5.
- **TS-WEB-0006 D2/D6** (block order: the closing block closes the page's own
  blocks and directly precedes the band) and **A7** ("directly precedes the
  context band"): `/mitmachen` is a named exception — its proof block stands
  between the closing block and the band. The band stays the last block in
  `main` (D5, A6) and every other page keeps the order of D2.
- **DEC-0174 §4** is not reversed: the conversion still comes before the
  hand-off. What changes is only which of the page's own blocks precede it.

## Consequences

`app/[lang]/_page-frame.tsx` (`surface`, `followedBy` on the `repeat` closing
block), `app/[lang]/mitmachen/page.tsx`, `page.meta.ts`, `stage-islands.tsx`;
`example-place.ts` and its unit test are deleted. `rhythm.test.ts`,
`e2e/pages/mitmachen.spec.ts` (A3, A16, G-3; A9 removed) and
`e2e/page-order.spec.ts` (A7 exception) follow the new order.
`content/pages/mitmachen/{de,en}.md` lose slots 6 and 6a.

**Coverage budget.** TS-WEB-0022-A7 (example-place selection, unit, verified
by `example-place.test.ts`) and TS-WEB-0022-A9 (the example's radius, e2e)
lose their only instruments together with the module and the file they
asserted; A8 had none. All three are retired with D5, and the `MISSING` budget
of `specs/verification/coverage-budget.json` moves from 147 to 149 (DEC-0141:
a raise needs a record that says which criteria were let go and why). `state/open.md` row
44 (the stage-0 reference place) is closed as obsolete for this page.
