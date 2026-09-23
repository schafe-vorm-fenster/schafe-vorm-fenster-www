---
title: "Website Design System — www.schafe-vorm-fenster.de"
created_at: 2026-09-10
updated_at: 2026-09-23
status: draft
source: workshop
intent: inform
brand: schafe-vorm-fenster
tags: ["website", "design-system", "ui", "style-guide"]
related:
  - ./website-communication-principles.concept.md
  - ./website-relevance-model.concept.md
  - ./website-information-architecture.concept.md
---

## Purpose

This is the binding visual specification for `www.schafe-vorm-fenster.de`.
It names one direction — **Editorial with photo surfaces** — and defines the
tokens, components, and composition rules that produce it. Everything here
derives from the Brand & UI Kit; no colour, typeface, or radius outside this
document is permitted.

The companion file `Style Guide.dc.html` shows every rule rendered.

## The Direction in One Sentence

Flat colour fields and photographs run edge to edge and alternate down the
page; typography and place names carry the emotion; the only soft shape in
the whole system is the thing you can touch.

Three rules make it coherent:

1. **Surfaces are square.** Sections have no border, no shadow, no radius.
   They butt directly against each other, so spacing never doubles.
2. **Controls are round.** Buttons, badges, chips, search fields, category
   pills and the logo use radius 999. Nothing sits between 0 and 999.
3. **Photos and colour alternate.** A photo section is always followed by a
   colour section. Two photo sections never touch.

## Colour

All values come from the Brand & UI Kit scales. No other hex is allowed.

Every ratio in this document is computed from the sRGB token values against
the ground the element actually sits on — never against pure white or black.
That is the same basis the token package declares (`color.contrastBasis`).

### Neutrals

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#171D0D` | Primary text, dark sections, primary button fill, control wells |
| `text-2` | `#39412C` | Body copy on light surfaces |
| `muted` | `#606657` | Labels, meta, placeholder text |
| `border` | `#6F7467` | Input outlines where an outline is unavoidable |
| `line` | `#D1D6CB` | Hairline dividers inside a surface |
| `surface-2` | `#E2E7DB` | Secondary flat section, placeholder hatching |
| `surface` | `#EEF2E9` | Standard flat section |
| `paper` | `#F9FBF7` | Page ground, text on dark |

Body copy on a light ground is `text-2` (10.26:1 on paper). `muted` is the
floor for labels and meta (5.70:1 on paper, 5.24:1 on surface) and is never
the colour of a paragraph. `border` carries no type at any size.

### Lime — the surface colour

| Token | Hex | Use |
| --- | --- | --- |
| `lime-100` | `#E5F2D1` | Section ground for the actors' argument; the fixed contact ground; icon wells |
| `lime-200` | `#D5ECB4` | Chat bubbles, subtle fills |
| `lime-300` | `#C6E593` | Secondary text on ink or violet |
| `lime-400` | `#B6DE6D` | Icons and links on ink; hairline on a lime ground |
| `lime-500` | `#A4D822` | Primary action, active state, headline accent, highlight band |
| `lime-600` | `#83AF09` | Category: merchants (always with `ink` text — paper on it is 2.49:1) |
| `lime-800` | `#486202` | Links and CTA text on light, category: official |
| `lime-900` | `#2D3F01` | Text on a lime-500 surface, chips on lime |

### Violet — the voice colour

| Token | Hex | Use |
| --- | --- | --- |
| `violet-50` | `#F5F6FE` | Info panels on light |
| `violet-100` | `#CFD1FC` | Secondary text on violet |
| `violet-500` | `#531BDE` | Provenance section, embed frame, category: culture, focus ring |
| `violet-600` | `#4617BF` | Badges inside a violet section |

### Himbeere — the pulse

Used sparingly and never twice on one screen: the empty-place state, the
"photo wanted" badge, the paid conversion (`buy-calendar-licence`,
`request-licence-quote`).

| Token | Hex | Use |
| --- | --- | --- |
| `himbeere-100` | `#FDD1D9` | Secondary text on himbeere |
| `himbeere-500` | `#E0286E` | Large display fills only (32 px and above — 4.29:1 on paper, which clears the 3:1 large-text floor and nothing else) |
| `himbeere-600` | `#BC1C5A` | Pulse fill for buttons, badges, pills; pressed state (`paper` on it is 5.84:1) |

### Status

`#B02A1C` for the failure narrative ("six channels, half the village hears
nothing"), `#9A6300` for placeholders and unresolved clearance.

### Archive — the old world

One ground and one ink, for content that says *what does not work today*.
Nothing positive is ever set in it.

| Role | Value | Use |
| --- | --- | --- |
| `archive ground` | `#FBF1DC` today | The section ground of an archive block |
| `archive ink` | **hex pending in brand-design** | Kicker, heading and the bold core line inside an archive block |
| `archive line` | a tan derived from the ground, hex pending | Hairlines between archive rows — `line` disappears on this ground (1.32:1) |

`#9A6300` is **not** `archive ink`. It measures exactly 4.50:1 on
`#FBF1DC` — at the threshold, with no margin — so it stays what it is: a
status colour for short placeholder labels. The token must clear 4.5:1 with
margin before it carries a heading; until it ships, an archive block sets
its headline in `ink` (15.37:1) and its body in `text-2` (9.52:1), and only
the kicker waits.

### Category colours

Every event carries one, each with the text colour that clears 4.5:1 at
badge size (12 px / 700):

| Category | Fill | Text | Ratio |
| --- | --- | --- | --- |
| Fest | `himbeere-600` `#BC1C5A` | `paper` | 5.84:1 |
| Merchants | `lime-600` `#83AF09` | `ink` | 6.65:1 |
| Culture | `violet-500` `#531BDE` | `paper` | 7.82:1 |
| Official | `lime-800` `#486202` | `paper` | 6.67:1 |
| Social | `#B02A1C` | `paper` | 6.31:1 |
| Neighbouring place | `#9A6300` | `paper` | 4.85:1 |

Never assume paper text on a category fill — `lime-600` and `lime-500` both
require `ink`.

"Neighbouring place" clears the floor with little margin. It is good for a
badge and for nothing longer; for a run of text on a light ground, use
`archive ink` once it lands, or `lime-800` (6.67:1).

### Pairs that do not clear

| Pair | Ratio | Rule |
| --- | --- | --- |
| `#9A6300` on `archive ground` `#FBF1DC` | 4.50:1 | At the floor, not above it. Placeholder badges only, never body, never a heading. The darker alternative is `archive ink`. |
| `paper` on `lime-600` | 2.49:1 | Forbidden. `lime-600` takes `ink`. |
| `paper` on `lime-500` | 1.62:1 | Forbidden. `lime-500` takes `ink` or `lime-900`. |
| `himbeere-500` on `paper` | 4.29:1 | Display fills at 32 px and above only. `himbeere-600` (5.84:1) for anything smaller or anything carrying text. |
| `line` on `lime-100` | 1.27:1 | Invisible. On a lime ground the hairline is `lime-400` (1.31:1 — the weight `line` has on paper, 1.42:1). A dedicated token is a change request to brand-design. |

## Typography

Atkinson Hyperlegible Next for everything readable, Atkinson Hyperlegible
Mono for labels, dates, numbers, prices, and the wordmark. Two weights only:
400 and 700, plus 800 for display sizes.

| Role | Size / line-height / tracking | Weight |
| --- | --- | --- |
| Display (hero) | 54 px / 0.90 / −0.045em | 800 |
| Place name | 50 px / 0.90 / −0.045em | 800 |
| Section head | 38 px / 1.00 / −0.035em | 800 |
| Sub head | 32 px / 1.02 / −0.030em | 800 |
| Ordinal (mono) | 48 px / 1.00 / −0.02em | 800 |
| Card title | 21 px / 1.15 / −0.012em | 700 |
| Lead | 20 px / 1.35 | 600 |
| Body | 18 px / 1.50 | 400 |
| Meta | 15 px / 1.35 | 400 |
| Kicker (mono) | 15 px / uppercase / 0.08em | 700 |
| Label (mono) | 12 px / uppercase / 0.08em | 700 |

Nothing below 15 px **outside a badge**. 12 px is reserved for text set
inside a badge or chip, where the pill is the reading aid; a label standing
on its own ground never goes below 15 px. Display sizes always break by hand
where the line reads better — the place name may split across two lines
(`SCHLAT / KOW`).

**Letter-spacing on mono labels is `0.08em`**, for both kicker roles and the
badge label. One value, everywhere. The token package carries `0.06em`
(`font.letterSpacing.label`) and `0.875rem` (`font.size.label`); both must
follow this guide — the tracking to `0.08em`, the size to `0.9375rem` for
the bare kicker. Until they do, the website overrides them and records the
override.

## Shape and Space

- **Radius:** `999px` for controls and the logo, `0` everywhere else.
  There is no third value.
- **Horizontal padding:** 16 px inside the viewport, on every section.
- **Vertical padding:** 26–30 px for standard sections, 20–24 px for tight
  ones. One value per section — never a padded card inside a padded section.
- **Gap between controls:** 8–10 px. Between list rows: a `line` hairline,
  no gap.
- **Touch targets:** 44 px minimum, 56 px for primary actions.
- **Borders and shadows:** none. A hairline divides rows inside a surface;
  contrast between surfaces does the rest.

**Three named exceptions to "no borders", and no more:** the search-result
overlay's edge, the excluded tag's outline, and the `verschoben` badge when
it sits on a `paper` ground. Each one is a case where an element has left
the flow or lost its fill and would otherwise have no boundary at all. A new
exception needs a decision, not a stylesheet.

### Wells

Two round wells, and they are not interchangeable.

| Well | Size | Fill | Interactive |
| --- | --- | --- | --- |
| Icon well | 40 px | `lime-100` on `paper`/`surface`; `surface` on a `lime-100` ground | no |
| Control well | 44 px | `ink` with a `paper` glyph, or `paper` with an `ink` glyph on a dark or photo ground | yes |

The icon well is decoration that gives a section-leading or row-leading icon
a ground. It is never `lime-500`-filled on a light ground: a `lime-500` fill
on light means **active state** — the current step of an explain module, the
selected chip — and nothing else. The control well is a target and keeps the
44 px floor. An archive block has no wells at all; its icons sit bare in
`archive ink`.

## Components

### Button

| Variant | Fill | Text | Use |
| --- | --- | --- | --- |
| Primary on light | `ink` | `paper` | The one main action per section |
| Primary on dark | `lime-500` | `ink` | Same, inside an ink or photo section |
| Pulse | `himbeere-600` | `paper` | Paid conversion only |
| Secondary | `paper` | `ink` | Alternative action on a dark or photo ground |
| Quiet | transparent | `lime-800` | Tertiary, text plus arrow |

Height 56 px, padding 0 24 px, radius 999, weight 800, 18 px, with a 24 px
`arrow-right` where the action leads onward.

### Search field

One pill: `map-pin` icon, placeholder in `muted`, and the submit button as a
44 px pill nested inside the 56 px field with 6 px inset. On a photo the
field is `paper`; on a colour surface it is `paper` too. A search field on a
light ground repeats the hero's treatment — `paper` on `paper` has no edge
and is not a search field.

### Place-search result overlay

The autosuggest list that belongs to the search field.

- **3–4 rows**, never more. Each row reads `Ort (Gemeinde)` — the place
  name, then its municipality in parentheses on the same line. Matching runs
  over both names.
- Row 56 px, ground `paper`, `line` hairline between rows. Place name 18 px
  / 400 `ink`, the matched substring at 700; the municipality 15 px / 400
  `muted`.
- **The overlay floats above the content and never enters the flow.**
  Nothing below it moves when it opens, closes, or changes length. It is
  the one element in the system with a boundary of its own: a 1 px `line`
  hairline on all four sides, radius 0.
- Keyboard and ARIA follow TS-002 D5: `ArrowDown`/`ArrowUp` move the active
  row, `Enter` selects, `Escape` closes and returns focus to the field;
  `aria-expanded` and `aria-activedescendant` on the field, rows as options.
  The focus ring rule applies to the field, not to the active row, which is
  marked by a `surface` ground.
- No match is a designed row, never an empty panel — the honest "we do not
  have this place yet" line with its onward action. Where it routes is a
  spec question, not a design one.

### Badge and chip

Radius 999, mono 12–13 px, weight 700, padding 7 × 15 px. A badge labels
(category, kicker, award); a chip is tappable (a neighbouring place) and
therefore at least 40 px tall. Kickers are badges with an 18 px icon.

Because badge text is small, every fill/text pair must be checked against
4.5:1 before use — see the category table above. The placeholder badge is
`#9A6300` on `archive ground` (4.50:1) and is the reason that pair may not
grow into a heading.

**Tag** — the non-tappable size. 30 px, mono 13 px / 700, padding 5 × 12 px,
radius 999. A tag names a value the reader cannot act on: the places,
organisers and categories a calendar is configured for. Fill `ink` with
`paper` text, or `surface` with `ink` text inside a lime section.

**Excluded** — one state, for tag and chip alike. The fill goes away, a 1 px
`border` outline takes its place, the label is struck through and set in
`muted`. It is the only strikethrough in the system, and it means "this is
what your calendar leaves out".

### Kicker

Two forms. Both are mono, uppercase, 700, tracked `0.08em`.

| Form | Treatment | Use |
| --- | --- | --- |
| Kicker (bare) | no pill, no ground, 15 px, `lime-800` on light, `archive ink` in an archive block, `paper` on ink or photo | The standing eyebrow above a section head |
| Kicker (badge) | the badge above, with an 18 px icon | Where the kicker carries a mark: a step counter, an award, a status |

The bare kicker is the default. The badge kicker stays available and is the
alternative, not a decoration to be added on top.

### Event row

A flat row, hairline above: mono day number 28 px with the month beneath in
`lime-300`/`muted`, title 21 px/700, meta 15 px, and the category badge
right-aligned. Never a card.

**Parity with the app.** An event list on the website renders like the
calendar rows in the app: day numeral **and** month, and the category
present as icon *and* colour *with the label written out*. Never icon-only,
never colour-only, never without the category. The point of showing live
data on the website is that the reader recognises it again in the calendar;
a list that looks like something else proves nothing. The three-step drafts
drop the month and the category — they follow this rule, not the other way
round.

### Event-status badge

A status is not a category. A row may carry one status badge in addition to
its category badge, never instead of it.

| Status | Fill | Text | Ratio |
| --- | --- | --- | --- |
| `neu` | `lime-500` | `ink` | 10.20:1 |
| `verschoben` | `paper` | `ink` | 16.56:1 |
| `abgesagt` | `#B02A1C` (error) | `paper` | 6.31:1 |

On a `paper` ground the `verschoben` badge takes a 1 px `line` hairline —
the only way a paper badge has an edge, and one of the three named border
exceptions.

### Quote card

Somebody else's words plus the proof that they said them. One element.

- The quote **verbatim**, Lead 20 px / 400 `ink`. No paraphrase, no
  shortening that changes the sentence.
- The author underneath: mono 15 px / 700 `ink` for the name, then role and
  organisation, 15 px / 400 `muted`, on the next line. Both are required —
  a name without a role and an organisation is not a proof.
- The source last: mono 15 px `lime-800`, the concrete publication and
  article, with an 18 px `external-link` icon and an outbound link. **A
  quote without a named source and a working link does not ship.**
- Visually one element: one ground, one padding box, 8 px between the three
  parts and a `line` hairline above and below the whole. It is a flat block
  on the section ground, not a card floating on a surface.

### Contact section

One contact section exists for the whole site, and it looks the same
everywhere. There is no contact form.

- **Ground `lime-100`, fixed**, on every page and in every context. See the
  rhythm exception below.
- Portrait top left: `ratio-square`, clipped to radius 999, 96 px. This is
  an avatar at the logo's radius, not a photo surface — the
  `ratio-portrait` 4:5 rule governs the editorial portrait on `/ueber-uns`,
  not this one.
- Beside it the section head and the person's name at card title size.
  One `Lead` line names the channels.
- **Action rows**, 72 px, radius 999, full width, in order: a leading 24 px
  icon, a bold title (18 px / 700), a sub-label beneath it (15 px / 400),
  and a trailing 24 px `arrow-right`. The first row is the primary
  treatment (`ink` ground, `paper` title at 16.56:1, `lime-400` sub-label at
  11.21:1); every further row is secondary (`paper` ground, `ink` title,
  `muted` sub-label at 5.70:1). Each row carries its own ground, so nothing
  is ever read against `lime-100` directly.
- **Phone and mail rows** below them: no fill, a `lime-400` hairline above
  each, a 24 px `phone`/`mail` icon and the number or address set in mono
  18 px `ink`. 56 px, the whole row is the target.
- Audience addressing runs through the kicker and the copy. **Never through
  the ground** — that is what makes the section recognisable.

### Explain module

The three-step component. Used on `/mitmachen` for each of the three paths,
and reused unchanged on `/`.

- **Ordinal** at mono 48 px / 800 `ink`, with the module **title** at card
  title size beside it.
- **Graphic stage**: one box with a declared ratio, holding three states.
  The next state is cropped in at the trailing edge so the stage reads as
  something that continues. The box never changes size, so a state change
  cannot shift the page.
- **Three step lines** beneath it, each a numbered disc plus two lines: the
  bold core (18 px / 700) and the normal detail (15 px / 400). **Each line
  is a single line at 390 px viewport width** — that is the length budget
  the copy is written to, not a hope. The active step's disc is `lime-500`
  with `ink`; the others are `surface` with `muted`.
- **One CTA** at the bottom, the module's own conversion, at primary
  treatment.
- **The module plus its three step lines fit one phone screen** — one
  viewport height at the phone breakpoint. If they do not, the copy is too
  long; the module does not grow.
- **Motion exception.** The stage may auto-advance through its three
  states. This is the one exception to "one movement only" in the whole
  system, and it exists only here. 550 ms per transition with the standard
  easing, at least 4 s dwell per state, pausing on focus or on any
  interaction. The three step lines are also the controls: activating one
  shows its state. Under `prefers-reduced-motion` the stage shows **state 1
  static**, step 1 active, and the step lines remain the way to reach
  states 2 and 3.

### Transparent overlay header

The header as built today: no ground of its own, sitting over the hero
photo.

- Mark-only logo, 40 px, clipped to radius 999. No wordmark over a photo.
- The calendar entry as a `lime-500` pill, 44 px, `calendar-days` 24 px plus
  an `ink` label (10.20:1).
- Every other control in a 44 px `ink` control well with a `paper` glyph.
- Nothing else. The header carries no fill, no bar, no shadow.

The wells are what gives the controls contrast on an unknown photo. The
alternative the review asks for — a backdrop blur behind logo and controls,
so the photo stays visible through them — is a new primitive with a
rendering cost and is an **open decision**; until it is taken, the solid
wells above are the rule.

### Photo surface

Full width, no radius, no border. The photograph is the section's first
background layer with a `linear-gradient` above it in the same declaration —
transparent at 12–26 %, 0.82–0.86 at 38–62 %, 0.96 at the bottom. Text sits
in the dark part. Ink gradient by default, violet for the municipal path.

**The scrim colour comes from a scrim token derived from `ink` (and
`dark.paper` in the dark theme). A literal `rgba(0,0,0,…)` never enters the
stylesheet** — whichever ladder wins, the neutral look is expressed as a
token with an alpha ladder, not as a raw black. The ladder itself is an
**open decision**; see below.

**Crop and focal point.** The photo is `cover` with `object-position` taken
from the motif's declared focal point, never `center` by default. Village
photographs are sky-heavy, and a centred crop parks the motif in the
bottom third, exactly where the scrim is densest — the result is a dark
smear with a horizon above it. For a sky-heavy motif the focal point sits
at or above 40 % so the sky crops away and the motif lands above the
scrim's opaque band. A photograph that only works when the scrim covers its
subject is the wrong photograph.

**Motif per page.** `/` shows villages **with activity** — a street, a
building in use, people. `/dein-kalender` shows venues — culture houses,
Gemeindehäuser, halls, the places events happen in. `/mitmachen` shows the
act itself: a flyer, a phone, a hand. Never dark, never sad, never
empty-at-dusk. The full imagery rules live in `brand-identity/imagery.md`
in `go-to-market-os`; this is the website's cut of them.

**No text shadow.** The scrim does the work. The review asks for a soft one;
that request rides with the scrim decision and is not in force until it is
taken.

A photo that does not depict what the copy claims carries the placeholder
badge (`#9A6300` on `archive ground`, radius 999, mono 11 px): *"Nicht
motivgenau · Platzhalter"*. A missing photo becomes a diagonal hatch of
`surface-2` and `line` with the badge *"Foto gesucht"* and an invitation to
contribute one. Not a dashed drop zone, not file-picker chrome.

### Archive block

The "old world" section type: *what does not work today*, and nothing else.

- Ground `archive ground`. Kicker and the bold core line in `archive ink`;
  the detail line in `text-2`. Hairlines in `archive line`.
- **Neutral icons.** The glyph that names the channel — `megaphone` for
  flyers, `clock` for the paper's deadline, `users` for the own channels.
  Never `circle-x`, never a red cross, never `error`. The content is
  already the failure; the icon does not have to say it twice.
- No wells, no fills, no photos inside it. It is a quiet block.
- It is used for problem content only. The solution never appears on this
  ground.

### Logo

The sheep mark, 38–40 px, clipped to radius 999 — the same radius as every
control. Beside it the wordmark in two lines, 15 px / 800, or the URL in
mono when the context is editorial.

## Page Rhythm

The order of section types is part of the design, not a layout accident.

```
PHOTO    hero, headline and search on the image
COLOUR   lime-500, the promise plus place chips
COLOUR   ink, place name and this week's dates
PHOTO    one event of the week, image-led
COLOUR   lime-100, the actors' argument
PHOTO    hatched placeholder, "send us a photo"
COLOUR   surface, the municipal argument, deliberately sober
COLOUR   violet-500, provenance as badges
COLOUR   paper, context band into the other jobs
```

Rules:

- Never two photo sections in a row.
- At most two consecutive sections in the same colour family.
- Exactly one `himbeere` element per screen (`himbeere-600` for anything
  carrying text).
- The dark ink section carries the live data; it is the anchor of the page
  and appears once.

### "Per screen"

**One viewport height at the phone breakpoint — 360 × 800.** Take any
scroll position on the page at that size: the visible window holds at most
one `himbeere` element.

That is the definition because a section is not a screen and cannot be
counted as one; a viewport can. The phone is the measuring viewport because
it is the one every layout is authored at, it is where the whole site is
single-column, and it is the only size at which "what the eye takes in at
once" is a fixed quantity. The pulse only reads as a pulse if it is alone in
that window.

### Section grounds carry rhythm, not meaning

A ground tells the reader that a new section has started. It does not tell
them what kind of section it is. The alternation rules above stay exactly as
they are.

- **One exception: the contact section.** It keeps its fixed `lime-100`
  ground on every page and in every position (decision 2026-09-23). It is
  the only meaning-bearing ground in the system, because it is the one
  section a reader should recognise on sight, on any page. It is therefore
  **exempt from the alternation rule**: it does not count towards "at most
  two consecutive sections in the same colour family", and it does not
  break a run either — the sections on either side of it count against each
  other as if it were not there.
- **Problem content takes the `archive ground`.** "What does not work
  today" is an archive block (see above).
- **Solution content takes a fresh ground** — `lime-100` or `paper`.
  `surface` and `surface-2` are the sober greys: the municipal argument,
  a placeholder hatch, an inactive step. **Grey-green never carries
  positive content.** It reads dusty, which is right for the old world and
  wrong for what the product does.
- **Images inside a colour section run full-bleed.** A photograph framed
  by the section's 16 px padding turns into a picture in a mount and the
  section stops being a surface. Either the photo is its own photo section
  at full width, or it is not in the section at all.
- **The price section is highlighted.** A `lime-500` band carries the
  kicker, the headline and one line of framing; the tiers follow beneath it
  on `paper`.
- **The three price tiers are rows inside one section**, divided by a 1 px
  `line` hairline — never a 2 px lime rule, never three sections. They
  therefore count as a single `paper` section and do not trip the
  consecutive-ground rule.

## Aspect Ratios and Reserved Space

Every box that will hold asynchronous content declares its ratio or its
height **before** the content arrives. Nothing on this site is allowed to
push the page down after paint: live dates, photographs, and embedded
calendars all load late, and the layout must already be their shape.

### Media ratios

| Token | Ratio | Used for |
| --- | --- | --- |
| `ratio-hero` | **8:9** mobile, **21:9** from 900 px | The hero photo surface |
| `ratio-feature` | **7:5** | Event of the week, path sections, any photo carrying a headline |
| `ratio-proof` | **5:2** | Proof and press images inside a stream card |
| `ratio-map` | **16:9** | County map, place map |
| `ratio-portrait` | **4:5** | People, team |
| `ratio-square` | **1:1** | Logo mark, actor avatar, contact avatar, partner logo well, explain-module stage |

Declared as `aspect-ratio` on the media element, never as a fixed pixel
height — the ratio survives every viewport. The photograph is `cover` and
centred on its focal point; the gradient scrim is part of the same box, so
it scales with it.

### Fixed heights

Components whose content length varies but whose box must not move:

| Element | Height |
| --- | --- |
| Primary button | 56 px |
| Secondary control, nested submit, control well | 44 px |
| Icon well | 40 px |
| Chip (tappable) | 40 px |
| Tag (label only) | 30 px |
| Badge (label only) | 26 px, or 30 px with an icon |
| Event row | 76 px, two lines of content |
| Search field | 56 px |
| Search-result row | 56 px |
| Contact action row | 72 px |
| Contact phone / mail row | 56 px |
| Section vertical padding | 26–30 px standard, 20–24 px tight |

Event titles are clamped to two lines and meta to one, so a long title
never changes the row height. A place name is clamped to two lines at
display size. An explain module's step lines are clamped to one line each
at 390 px; the copy is written to that, so nothing clamps in practice.

### Reserved text space

Text that arrives with data reserves its height in line units:
`min-height: calc(<lines> * <line-height> * 1em)`. Live counts ("5 Termine
diese Woche") sit inside a fixed-height badge, so a change from one to two
digits does not reflow the row.

### Skeletons

A skeleton is the box at its declared ratio, filled with the placeholder
hatch: `repeating-linear-gradient(45deg, surface-2 0 16px, line 16px 32px)`.
Text skeletons are `line` bars at the text's own line height, 60 % width for
the last line of a paragraph.

Skeletons do not animate. The site has exactly one motion (see Motion), and
a pulsing skeleton would read as a second one. A skeleton that persists
longer than two seconds is replaced by the honest empty state — for a place
with no dates that is the publisher invitation, for a missing photograph the
"Foto gesucht" surface. Both are conversions, which is why they are designed
rather than hidden.

## Icons

One set only: **Lucide**, 24 × 24 grid, 2 px stroke, round caps and joins.
Icons are monochrome and inherit a single token colour; they are never
filled and never two-tone. An icon sits in a round ground only where that
ground is one of the two wells defined above — a 40 px icon well or a 44 px
control well.

Sizes: **24 px** standard (buttons, rows, list items, wells), **18 px**
inside a badge or kicker, **32 px** for a section-leading icon without a
well. No other size.

The icons in use, by role:

| Role | Icon |
| --- | --- |
| Forward, next step | `arrow-right` |
| Place, search field | `map-pin` |
| Dates, calendar connection | `calendar-days` |
| Confirmation, included feature | `check`, `circle-check` |
| Exclusion, today's failure | `circle-x` |
| Placeholder, missing clearance | `triangle-alert` |
| Explanation, data protection | `info` |
| WhatsApp path, homescreen | `smartphone` |
| Own website as a source | `globe` |
| Municipality, council, office | `landmark` |
| Culture, stage | `theater` |
| Merchants, delivery routes | `truck`, `store`, `shopping-basket` |
| Agriculture, harvest | `tractor`, `sprout` |
| Church, parish | `church` |
| Community, association | `users` |
| Festival | `party-popper` |
| Social, blood donation | `heart-pulse` |
| Award, funding | `trophy` |
| Press, announcement | `megaphone` |
| Print material, QR | `qr-code`, `download` |
| Contact | `mail`, `phone` |
| Time | `clock` |
| Embed, own website preview | `monitor` |
| Navigation, share, external | `menu`, `search`, `share-2`, `external-link` |
| Home, place page | `house` |
| Add a date | `plus` |
| Food, catering | `utensils` |
| Music, choir | `music` |

`circle-x` marks an exclusion in a feature comparison — a thing the reader
does *not* get. It never appears in an archive block, where the icons are
the neutral glyphs of the channel itself.

Any new requirement takes the matching Lucide glyph — no icon is drawn by
hand, and no glyph from another family enters the set.

## Motion

One movement only: sections rise 22 px and fade in over 550 ms
(`cubic-bezier(.2,.7,.3,1)`) when they enter the viewport, once. No
parallax, no hover choreography, no looping animation. Motion respects
`prefers-reduced-motion`.

**One exception, named:** the explain module's graphic stage may
auto-advance through its three states (see the component). It exists there
and nowhere else, and it has a `prefers-reduced-motion` fallback that is a
static state, not a faster animation.

## Accessibility

- Body text at 4.5:1 minimum, display type at 3:1, measured against the
  composite of photo plus gradient — not against the gradient alone.
- Focus ring: 3 px `violet-500`, 2 px offset, on every interactive element.
- Icons are decorative and always accompanied by text; alt text only where
  an image carries meaning.
- Atkinson Hyperlegible is the accessibility decision — do not substitute.
- Every published ratio in this document is recomputed when a token changes.
  A ratio that is stated and wrong is worse than one that is absent.

## Do Not

- No borders, no drop shadows, no cards floating on a surface, outside the
  three named exceptions.
- No radius between 0 and 999.
- No third typeface, no weight below 400 or between 400 and 700.
- No photo section adjacent to another photo section.
- No stock photography. An honest hatched placeholder is better and doubles
  as a conversion.
- No colour outside the scales above, and no literal `rgba(0,0,0,…)` scrim.
- No grey-green ground under positive content.
- No text shadow, no blur primitive, no second animation — until the open
  decisions below say otherwise.

## Open decisions

Three, and the guide states the current rule for each. Until a decision is
taken, what is written above is in force.

| # | Decision | Options | In force today |
| --- | --- | --- | --- |
| 1 | **Scrim ladder** | (a) the fixed ladder above, ending at 0.96; (b) a measured floor — "composite ≥ 4.5:1 behind body, ≥ 3:1 behind display, measured per photograph" — which is what makes the 0.72 neutral-black draft legal. The soft text shadow rides with this decision. | (a), and no text shadow |
| 2 | **Header contrast** | (a) the solid `ink` control wells the site has today; (b) a backdrop blur behind logo and controls — a new primitive with a rendering cost. | (a) |
| 3 | **Category taxonomy** | The token package carries five category keys, this guide carries six rows. Two taxonomies, one to be retired. **The taxonomy is not changed here.** The decision also covers whether website event rows keep the category the drafts dropped — this guide says they do. | The six rows above, category always present |
