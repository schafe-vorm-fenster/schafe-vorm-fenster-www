---
id: DEC-0197
title: The nearby section is one heading and one sentence over the list, composed once for / and /dein-ort
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue 152, "Optimierung der Section Demnächst in der Nähe", with the owner's
design "Nähe Section", variant C (desktop 1280 px, phone 390 px). Over the list
of nearby dates stood five text layers: a kicker ("Einen Ort weiter"), the
hand-off line, a bold line, a paragraph and the heading. That is too much
before the first date. The section stands on `/` (state S3, `#nearby`) and on
`/dein-ort` (story 4 of DEC-0153, position 2 of TS-WEB-0008).

## Decision

1. **Head**: one `h2` — the module's own title ("Diese Woche in der Nähe",
   "Coming up nearby" once the list reaches past the week) — and one sentence,
   `dictionary.live.nearbyLead`: "Was zwei Dörfer weiter läuft, gehört genauso
   in deinen Kalender." / "What's on two villages over belongs in your calendar
   just as much." No kicker, no hand-off line, no bold line, no paragraph. The
   dictionary key `kickers.widerRadius` goes.
2. **One composition**: `app/[lang]/_nearby-section.tsx` (`NearbySection`,
   `nearbyHead`) is the only place the section is composed; both pages use it.
   The ground is `surface` (`#EEF2E9`), full width, content in the container.
3. **Story 4 is no longer a value story** on `/dein-ort`: the section replaces
   the `value-story` block (`data-block="value-story"`, the example frame
   `data-example-level="surrounding"`). The content slot
   `dein-ort-6-story-radius` keeps its example description and its proof
   paragraph; its title, "why it matters" and transition fields are deleted,
   because the dictionary sentence replaces them. TS-WEB-0020-A4 reads "story 4
   as its own section with the nearby module as evidence" and still holds in
   substance; the block marker it is tested by changes.
4. **Measures** (mobile first, the switch at 48 rem): desktop padding 64 / 72 px
   (top / bottom), head max 690 px, 28 px to the list, heading 44 px / 800 /
   1.02 / -0.035em, sentence 20 px / 600 / 1.4 with 14 px to the heading; phone
   padding 32 / 40 px, 20 px to the list, heading 32 px, sentence 18 px with
   12 px to the heading. The side padding is the container's.
5. **Row on a narrow list**: below a row width of 30 rem the category pill
   stands on a line of its own under "place · distance · time", indented 58 px
   to the title (date column 44 px, gap 14 px, 6 px between lines); the title
   block takes the whole remaining width. From 30 rem the row is the one it
   was. `EventRow`/`EventList` take `categoryPlacement="side" | "below"`, the
   nearby list sets `below`; every other list keeps `side`.

## Deviation from the design

The design names the heading colour `#171D0D`. The brand tokens hold no such
value, and `check:brand` refuses colour literals outside `brand.css`; the
heading takes the ink token (`--color-neutral-ink`). The sentence colour
`#39412C` is `--color-neutral-text2` exactly.

## Consequences

- TS-WEB-0019 (home) and TS-WEB-0020 (dein-ort) name the section's head and
  the shared composition; their criteria stay, the e2e probe for the radius
  section is `#nearby` with one `h2`, one `[data-lead]` and no `[data-kicker]`.
- The `ValueStory` component keeps its other consumers; it stands no longer
  under the nearby list.
