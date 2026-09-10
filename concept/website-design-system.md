---
title: "Website Design System — www.schafe-vorm-fenster.de"
created_at: 2026-09-10
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

### Neutrals

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#171D0D` | Primary text, dark sections, primary button fill |
| `text-2` | `#39412C` | Body copy on light surfaces |
| `muted` | `#606657` | Labels, meta, placeholder text |
| `border` | `#6F7467` | Input outlines where an outline is unavoidable |
| `line` | `#D1D6CB` | Hairline dividers inside a surface |
| `surface-2` | `#E2E7DB` | Secondary flat section, placeholder hatching |
| `surface` | `#EEF2E9` | Standard flat section, round icon wells |
| `paper` | `#F9FBF7` | Page ground, text on dark |

### Lime — the surface colour

| Token | Hex | Use |
| --- | --- | --- |
| `lime-100` | `#E5F2D1` | Section ground for the actors' argument |
| `lime-200` | `#D5ECB4` | Chat bubbles, subtle fills |
| `lime-300` | `#C6E593` | Secondary text on ink or violet |
| `lime-400` | `#B6DE6D` | Icons and links on ink |
| `lime-500` | `#A4D822` | Primary action, active state, headline accent |
| `lime-600` | `#83AF09` | Category: merchants (always with `ink` text — paper on it is 2.5:1) |
| `lime-800` | `#486202` | Links and CTA text on light, category: official |
| `lime-900` | `#2D3F01` | Text on a lime-500 surface, chips on lime |

### Violet — the voice colour

| Token | Hex | Use |
| --- | --- | --- |
| `violet-50` | `#F5F6FE` | Info panels on light |
| `violet-100` | `#CFD1FC` | Secondary text on violet |
| `violet-500` | `#531BDE` | Provenance section, embed frame, category: culture |
| `violet-600` | `#4617BF` | Badges inside a violet section |

### Himbeere — the pulse

Used sparingly and never twice on one screen: the empty-place state, the
"photo wanted" badge, the paid conversion (`buy-calendar-licence`,
`request-licence-quote`).

| Token | Hex | Use |
| --- | --- | --- |
| `himbeere-100` | `#FDD1D9` | Secondary text on himbeere |
| `himbeere-500` | `#E0286E` | Large display fills only (32 px and above) |
| `himbeere-600` | `#BC1C5A` | Pulse fill for buttons, badges, pills; pressed state |

### Status

`#B02A1C` for the failure narrative ("six channels, half the village hears
nothing"), `#9A6300` on `#FBF1DC` for placeholders and unresolved clearance.

### Category colours

Every event carries one, each with the text colour that clears 4.5:1 at
badge size (12 px / 700):

| Category | Fill | Text | Ratio |
| --- | --- | --- | --- |
| Fest | `himbeere-600` `#BC1C5A` | `paper` | 5.5:1 |
| Merchants | `lime-600` `#83AF09` | `ink` | 6.8:1 |
| Culture | `violet-500` `#531BDE` | `paper` | 8.9:1 |
| Official | `lime-800` `#486202` | `paper` | 7.2:1 |
| Social | `#B02A1C` | `paper` | 6.1:1 |
| Neighbouring place | `#9A6300` | `paper` | 5.0:1 |

Never assume paper text on a category fill — `lime-600` and `lime-500` both
require `ink`.

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
| Card title | 21 px / 1.15 / −0.012em | 700 |
| Lead | 20 px / 1.35 | 600 |
| Body | 18 px / 1.50 | 400 |
| Meta | 15 px / 1.35 | 400 |
| Label (mono) | 12 px / uppercase / 0.08em | 700 |

Nothing below 15 px. Display sizes always break by hand where the line
reads better — the place name may split across two lines (`SCHLAT / KOW`).

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
field is `paper`; on a colour surface it is `paper` too.

### Badge and chip

Radius 999, mono 12–13 px, weight 700, padding 7 × 15 px. A badge labels
(category, kicker, award); a chip is tappable (a neighbouring place) and
therefore at least 40 px tall. Kickers are badges with an 18 px icon.

Because badge text is small, every fill/text pair must be checked against
4.5:1 before use — see the category table above. The placeholder badge is
`#9A6300` on `#FBF1DC` (6.0:1).

### Event row

A flat row, hairline above: mono day number 28 px with the month beneath in
`lime-300`/`muted`, title 21 px/700, meta 15 px, and the category badge
right-aligned. Never a card.

### Photo surface

Full width, no radius, no border. The photograph is the section's first
background layer with a `linear-gradient` above it in the same declaration —
transparent at 12–26 %, 0.82–0.86 at 38–62 %, 0.96 at the bottom. Text sits
in the dark part. Ink gradient by default, violet for the municipal path.

A photo that does not depict what the copy claims carries the placeholder
badge (`#9A6300` on `#FBF1DC`, radius 999, mono 11 px): *"Nicht motivgenau ·
Platzhalter"*. A missing photo becomes a diagonal hatch of `surface-2` and
`line` with the badge *"Foto gesucht"* and an invitation to contribute one.

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
| `ratio-square` | **1:1** | Logo mark, actor avatar, partner logo well |

Declared as `aspect-ratio` on the media element, never as a fixed pixel
height — the ratio survives every viewport. The photograph is `cover` and
centred; the gradient scrim is part of the same box, so it scales with it.

### Fixed heights

Components whose content length varies but whose box must not move:

| Element | Height |
| --- | --- |
| Primary button | 56 px |
| Secondary control, nested submit, icon well | 44 px |
| Chip (tappable) | 40 px |
| Badge (label only) | 26 px, or 30 px with an icon |
| Event row | 76 px, two lines of content |
| Search field | 56 px |
| Section vertical padding | 26–30 px standard, 20–24 px tight |

Event titles are clamped to two lines and meta to one, so a long title
never changes the row height. A place name is clamped to two lines at
display size.

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
filled, never two-tone, never in a coloured circle unless that circle is a
44 px control well.

Sizes: **24 px** standard (buttons, rows, list items), **18 px** inside a
badge or kicker, **32 px** for a section-leading icon. No other size.

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

Any new requirement takes the matching Lucide glyph — no icon is drawn by
hand, and no glyph from another family enters the set.

## Motion

One movement only: sections rise 22 px and fade in over 550 ms
(`cubic-bezier(.2,.7,.3,1)`) when they enter the viewport, once. No
parallax, no hover choreography, no looping animation. Motion respects
`prefers-reduced-motion`.

## Accessibility

- Body text at 4.5:1 minimum, display type at 3:1, measured against the
  composite of photo plus gradient — not against the gradient alone.
- Focus ring: 3 px `violet-500`, 2 px offset, on every interactive element.
- Icons are decorative and always accompanied by text; alt text only where
  an image carries meaning.
- Atkinson Hyperlegible is the accessibility decision — do not substitute.

## Do Not

- No borders, no drop shadows, no cards floating on a surface.
- No radius between 0 and 999.
- No third typeface, no weight below 400 or between 400 and 700.
- No photo section adjacent to another photo section.
- No stock photography. An honest hatched placeholder is better and doubles
  as a conversion.
- No colour outside the scales above.
