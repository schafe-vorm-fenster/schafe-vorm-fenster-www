---
id: DEC-0193
title: The embed scene is redesigned around an interactive calendar graphic
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

The owner's redesign of the home page's second scene (`id="scene-2"`, slot
`home-5-scene-embed`, issue #145, 2026-11-12). Until then the scene opened on the
kicker "Ohne eigenes System" and the hand-off line "Die Termine aus dem Ort stehen
auch da …", put the town-hall photograph at 16:9 under it and laid a drawn calendar
with bars instead of titles over it (DEC-0162 §5). The new design explains to
municipalities in one glance what the calendar is for their website: dates from the
whole municipality, entered by the organisers themselves, filtered by the
municipality. The graphic shows that with a filter that walks through the four
categories while the dates below change with it.

## Decision

1. **Layout.** A kicker, a heading, a lead sentence and three ticked points in the
   container (text at most 690 px wide), then the town-hall photograph full-bleed,
   500 px high from `lg` and 240 px on the phone, cropped at `center 30 %`. The
   calendar graphic (460 px) sits on the photograph's lower edge at the container's
   right and reaches 96 px into the ground below; on the phone it stands under the
   photograph, overlapping it by 72 px, 40 px from the left edge. The button
   "Kalender bestellen" stands below on the left. The scene keeps its
   `data-mechanism="embed"`, its `h2` as the block heading and its one
   `data-cta="secondary"`. The transition line is gone.
2. **The graphic is a client island**, and only the graphic is. Prerender and
   no-JavaScript state: "Gemeindeleben" with its three rows. Behaviour: the next
   category every 3.5 s, then from the start; a click on a filter button (or focus
   entering the graphic) shows that category and stops the advance; under
   `prefers-reduced-motion` nothing advances. Filter buttons are real buttons with
   `aria-pressed` and `aria-label`; the row list is `aria-live="polite"`; the focus
   ring is the site's global 3 px violet with 2 px offset.
3. **Copy.** The German wording is the owner's, verbatim, in slot
   `home-5-scene-embed`; the English wording is a faithful translation marked as a
   draft in the slot. The graphic's words and its twelve example dates are a second
   slot, `home-5a-scene-embed-calendar-demo` (`provenance: generated`, `demo: true`,
   `data-demo="true"` in the markup, `state/open.md` row 293).
4. **Photo.** The existing original photograph `home-scene-embed` (Rathaus
   Gützkow) with its credit behind the © control; the © control stands top right on
   this photograph, as the design draws it, because the graphic covers the lower
   edge where it stands on every other photograph. The focal point moves to
   `y: 30`; the photograph's `alt` no longer mentions the drawing, the graphic has
   its own label.
5. **Colours and icons** use existing tokens. The proposal's hex values are
   `status-error` (community life), `status-warning` (education and health),
   `lime-800` (supply, on the bare glyph) and `category-culture-tourism` (culture
   and tourism); no token was added. **Deviation:** the supply coin is `lime-600`
   with an ink glyph, not the proposal's dark green, because a dark-green fill is
   never allowed (DEC-0160, TS-WEB-0017-A30). Icons: Lucide `users`, `heart-pulse`, `shopping-basket`,
   `theater` and the new `funnel`, added to the icon table.

## Deviations from the design export

- **Intro sentence weight 700**, not 600: the font package ships 400, 700 and 800
  only (`state/open.md` row 32).
- **Meta text 15 px**, not 13 px: the label floor of the type scale is 15 px
  (TS-WEB-0002 D3).
- **Filter buttons 44 px**, not 40 px: the site's touch floor is 44 px.
- **Switch point `lg` (768 px)**, not 761 px: the six breakpoint tokens are the
  only values a media query may use (TS-WEB-0017 D2).
- **Inactive filter background** is `surface`, active is `ink` (neutral black since
  DEC-0155), not the design's dark green `#171D0D`.
- **Focus entering the graphic also stops the advance**, so a keyboard user is not
  moved under while tabbing; the design names the click only.
- **The advance runs only while half the graphic is on screen**; the design does not
  say when it starts. A visitor who scrolls to it sees the sequence from
  "Gemeindeleben", and the page's text does not change below the fold.
- **The icon-only filter on the phone hides its labels by clipping, not by
  `display: none`**, and the phone's caption under the buttons is clipped the same
  way from `lg`. The drawing is the design's; the text stays in the tree at every
  width, so TS-WEB-0017 D2(d)'s single tree holds (`e2e/smoke.spec.ts` caught the
  first version, whose 1280 reading had three labels the 360 reading lacked).
- The screen-reader label "Beispiel: Kalender auf der Website einer Gemeinde" is the
  owner's wording and stands although the mock rule keeps "Beispiel" out of rendered
  copy; it describes the graphic truthfully as an example.

## Open (from the issue, not decided here)

1. **Photo.** The export contains a crop of a screenshot of the live page. The
   original photograph and its credit are used; the owner confirms whether it stays.
2. **Address.** The heading says "deine Gemeinde", the text "ihr/eure". "Eure
   Gemeinde" throughout would be consistent. The German text is kept as written.
3. **Example dates** are invented and neutral; the owner decides whether they stay.
4. **Category colours and icons** are a proposal and not yet fixed. The brand
   package's own category tokens (`category-community-life` rose, `education-health`
   teal, `everyday-supply` gold) differ from the proposal and are not used here.

## Consequences

`e2e/pages/home-scene-media.spec.ts` carries A20 (placement) and A24 (prerender,
advance, click, reduced motion); `src/components/web-calendar-overlay/` holds the
island and its markup test. `scene-block` is unchanged: the other two scenes look as
before.
