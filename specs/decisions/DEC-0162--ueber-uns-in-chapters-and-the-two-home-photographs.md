---
id: DEC-0162
title: The about page is told in three chapters with expandable stories after the owner's design, the town-hall photograph carries a drawing of the web calendar, and the provenance photograph runs to the edge
status: accepted
date: 2026-10-13
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-12 (DEC-0154) sent a new design for `/ueber-uns`
(issue #55, `plan/reviews/2026-10-12/Design - Über uns Vorschau - Desktop.jpg` and
`… - Mobile.jpg`) and two points on `/`: the "Über uns" photograph is not full
width on the phone (#35), and the town-hall photograph does not say "calendar on
a website" (#32). `TS-WEB-0027` listed the rebuild as owed. The design is the
owner's; the guide (`SRC-0014`) and the copy guide (`SRC-0017`) still bind where
the image differs from them, and so does the truth rule: nothing renders that no
source carries.

## Decisions

1. **The page follows the design's order** (`TS-WEB-0027` D2 as amended): stage
   with kicker and `h1` · chapter 01 "Angefangen hat es mit Brötchen." · a quote
   band (the founder's cleared quote on his cleared portrait, a second photo
   section) · chapter 02 with the honorary-mayor proof · chapter 03 with the
   stories · "Wer dahintersteckt" · "Was wir daraus mitgenommen haben." · the
   award block · newsletter (still withheld) · context band · closing CTA. D2's
   old rationale ("narrative order is rejected") is overruled by the owner's own
   design: the reader is told a story first, the evidence follows in chapter 02
   and 03. `TS-WEB-0027-A3` keeps the `h1` and the CTA-free first screen and
   names chapter 01's heading in it; the "first proof element within the second
   viewport" clause is withdrawn.
   - Two photo sections, never adjacent (`checkRhythm` passes; A2 asserts the
     adjacency on the served DOM). The quote band reserves its upper part as a
     spacer so the face stays above the reading band; from `xl` the band's window
     sits at the face (`48 % 15 %`), because the inventory's `focal` belongs to the
     4:5 box. No new rendition was cut.
   - The stage photograph is now the page's LCP element (`TS-WEB-0003` D2 as
     amended), preloaded through `photo-surface`; no `img` on the page is eager.
   - "Wer dahintersteckt" is the team block (D7) with the person's name as its
     `h2` and the portrait running to the viewport edge; from `xl` portrait left,
     text right.
2. **Chapter 03 is the proof stream, told as expandable stories.** The relevance
   engine still selects and orders (`TS-WEB-0005`, count 7, D5's one reserved
   place). The pool is the four cleared records the design's stories can be backed
   by: `impftermine-landkreis`, `ukraine-integration-dorfleben`,
   `google-baecker-schlatkow` and, new, `homeoffice-mobile-anbieter`. The NØRD
   award moves to its own block, the mayor claim to chapter 02. Each title is the
   record's verbatim `claim:`; each story text (`ueber-uns-3b-stories`) retells the
   record's body and adds no fact. The disclosure is the new component
   `story-disclosure`: native `<details>` sharing one `name`, so at most one is
   open, the first open in the server HTML, operable without JavaScript, the title
   an `h3` outside the toggle. Open: full row, `violet-500`, `paper` type; closed:
   `lime-100`, `ink` type. Flat, radius 0 (the cards are not links, so `Q-0087`
   does not reach them). The design's `himbeere` tile is not built: `himbeere`
   is the pulse. Chapter 03 is over the 1270 px section budget at 390 px (1670 px
   de, 1537 px en) and is recorded in `e2e/section-budget.spec.ts`'s ratchet: the
   claims are verbatim records and the stream is one module.
3. **What the design shows without a source does not ship.** Taken over verbatim,
   as the review sentences were before (slot `ueber-uns-1a-chapters`): the stage
   kicker, the chapter headings and place lines, the toggle words, the principles
   heading and the three principle titles, the award heading and the button label.
   Not taken over, and the existing text kept instead: the stage lead, the second
   paragraph of chapter 01, the continuation of chapter 02, the introduction of
   chapter 03, the three principle texts (the three sentences of the village
   argument render under the owner's titles, so `A4`'s one price token stays where
   it was read from the offering package), the person's tags, "280 Einwohner"
   (`CG-034`), "Seit 2018" (`TS-WEB-0027` D4), "480 € im Jahr" as typed text, and
   the story tiles "Line Dancer" and "Bienenfotogalerie" (no record documents
   either; `google-baecker-schlatkow` says so for the line-dance story). The demo
   anecdotes (`ueber-uns-2a-anecdotes-demo`) are deleted; `state/open.md` rows 258
   and 259 are closed. No placeholder mark is in the HTML. The design's search band
   "Kommt dir bekannt vor?" is not built: a search field on `lime-500` breaks "No
   search field on a light ground", and a question as a section title breaks
   `CG-005`; the page keeps the context band and the closing block.
4. **Where the image and the guide differ, the guide stands.** The ordinals are
   `lime-800`, not `lime-500` (1.62:1 on a light ground fails even the display
   floor). The quote card on a photograph (`quote-card` tone `photo`) takes the
   story stage's quote treatment and drops the hairlines. The award "seal" is the
   badge kicker with `trophy` on `violet-600`, not a round sticker. The award button
   is the `secondary` variant the provenance scene on `/` uses; its fill on a dark
   ground is #28's (`Q-0091`).
5. **The town-hall photograph carries a drawing of the web calendar** (#32), the
   new component `web-calendar-overlay`: a flat `paper` block with a browser
   strip, the calendar head and three rows of a day numeral, a category coin from
   the platform taxonomy and title bars. It names no event, no month and no place,
   so it claims no date; it is decorative, and the photograph's `alt` says what it
   shows. Below `xl` it hangs over the photograph's lower edge, right-aligned on
   the gutter; from `xl` it lies in the lower right on the container's edge. It
   leaves the focal point clear (`TS-WEB-0019-A20`). The photograph is a
   `media-frame` with no scrim, so the reading band is untouched.
6. **The provenance photograph on `/` runs to the edge at every width** (#35), as
   the embed scene's already does, at 16:9. The issue's "from `xl` in columns
   9–12" is not built: the guide says a photograph is never boxed into the
   container (*Layout Grid*, *Section grounds*). `TS-WEB-0019-A21` asserts it at
   360, 390, 640 and 1280 px.

## Consequences

- `TS-WEB-0027` D2, D3, D6 and A2, A3, A8 are amended and A17 is new; the owed
  list loses #35 and #55. `TS-WEB-0019` gains A20 and A21. `TS-WEB-0003` D2 names
  the stage photograph for `/ueber-uns`.
- `SRC-0014` gains *Story disclosure* and *Web-calendar overlay*; the contract
  lists both components and the quote card's `photo` tone.
- Open: the empty proof place (D5) still renders in chapter 03 although the design
  shows none — it is the page's honest gap, and removing it is the owner's call.
  The press page (#56, `Q-0093`) is not decided here; the award button points at
  the archive.
