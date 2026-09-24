---
title: "Website Design System — www.schafe-vorm-fenster.de"
created_at: 2026-09-10
updated_at: 2026-09-24
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

**The method, so a number can be checked rather than believed.** WCAG 2.2
relative luminance over the sRGB hex — channel `c/255`, linearised as
`c ≤ 0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4`, weighted
`0.2126 R + 0.7152 G + 0.0722 B` — and the ratio `(L₁+0.05)/(L₂+0.05)`,
rounded to two places. Recomputed in full against
`@schafe-vorm-fenster/brand-design` on **2026-09-24**, for the token change
described under *Archive* below.

**One named exception to "never pure white or black": the scrim.** The
gradient laid over a photograph is neutral black. The reason is that a
scrim is not a surface colour. Nothing is *set in* it and nothing is read
*against* it as a ground; it is a filter over someone else's photograph,
and any tint in it shifts that photograph's colour — which is exactly what
the dark-green scrim did and what the review rejected (decision 5,
2026-09-23). The exception covers the scrim ladder and the text shadow that
rides with it, and nothing else: no section ground, no fill, no icon and no
text colour is ever `#000000` or `#FFFFFF`.

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

| Token | Hex | Use | Ratio |
| --- | --- | --- | --- |
| `color.archive.ground` | `#FBF1DC` | The section ground of an archive block | — |
| `color.archive.ink` | `#7A4F00` | Kicker, heading and the bold core line inside an archive block | 6.35:1 on the ground, 6.85:1 on `paper` |
| `color.archive.line` | `#DFCB9D` | Hairlines between archive rows — `line` disappears on this ground (1.32:1) | 1.42:1 on the ground — exactly the weight `line` has on `paper` |

`#9A6300` is **not** `archive ink`. It measures exactly 4.50:1 on
`#FBF1DC` — at the threshold, with no margin — so it stays what it is: a
status colour for short placeholder labels. `#7A4F00` clears the floor with
margin and is therefore the one that carries type.

**Version and interim.** All three roles **shipped**: PR **#447** was
squash-merged on **2026-09-23** (merge commit `a1201c4`), and the package
on `main` is **2.8.0**. They are published and reviewable upstream today.
What has not happened is the website's side: the pin here is still the
exact version `0.1.3`, so none of the three is consumable in this
repository yet. Until that pin moves, an archive block behaves as follows,
and the rule is not "wait":

- The **ground** is the stand-in `--color-placeholder-ground: #FBF1DC` in
  `app/styles/brand.css` — the one file a brand value may enter through
  (TS-WEB-0017 D3). No call site carries the literal.
- The **headline and the bold core line** are set in `ink` (15.37:1) and
  the detail line in `text-2` (9.52:1). Both are real tokens today and both
  clear the floor, so the block ships complete rather than half-drawn.
- The **kicker** is the one part that waits: it is set in `ink` with the
  block's other type until `archive.ink` resolves, not in `#9A6300`.
- The **hairline** is `line` until `archive.line` resolves, accepting that
  it is near-invisible (1.32:1) — an invisible hairline is a weaker
  failure than a literal, which `TS-WEB-0017-A5` rejects outright.

When the pin moves to `2.8.x`, the three tokens replace those stand-ins,
the `app/styles/brand.css` declaration becomes
`var(--color-archive-ground)` and then goes away with its call sites, and
every ratio in this document is recomputed (see *Accessibility*). The
foreground is not part of that swap — see the pin-move section in
`specs/contracts/design-system-contract.md`.

### Category colours

**The taxonomy is not the website's to invent.** The canonical list is the
classification the platform actually indexes events by:
`@schafevormfenster/rural-event-types` **`0.0.1`**, the package that lives
inside `classification-api` (repo root `3.4.2`) — **four** ids, read on
**2026-09-24**. The same source carries `unknown` as the value returned for
an event that has not been classified, which is a fifth rendering case and
not a fifth category. `color.category` in
`@schafe-vorm-fenster/brand-design` carries exactly these five keys, so the
package is already aligned and this guide's earlier six rows were the
outlier (decision 7, 2026-09-23).

The package's own `color.categoryStatus` still reads "PROVISIONAL — …
canonical source … was not reachable and has not been read" — that note is
in the shipped **2.8.0** as well. It has now been read, and PR **#464**
replaces the marker with the read source named above.

| id | Label (`color.category.*.label`) | Icon | Coin fill (`dot`) | Glyph | Ratio | Bare icon (`bare`) on `paper` |
| --- | --- | --- | --- | --- | --- | --- |
| `community-life` | Gemeinschaft | `users` | `himbeere-600` `#BC1C5A` — see below | `paper` | 5.84:1 | `#BC1C5A`, 5.84:1 |
| `education-health` | Bildung & Gesundheit | `graduation-cap` | `#1FB2A6` | `ink` | 6.55:1 | `#178E85`, 3.85:1 |
| `everyday-supply` | Versorgung | `shopping-basket` | `#D4A017` | `ink` | 7.26:1 | `#B4830C`, 3.26:1 |
| `culture-tourism` | Kultur & Ausflug | `landmark` | `violet-500` `#531BDE` | `paper` | 7.82:1 | `#531BDE`, 7.82:1 |
| `unknown` | Ohne Kategorie | `circle-help` | `border` `#6F7467` | `paper` | 4.62:1 | `#6F7467`, 4.62:1 |

`#1FB2A6` and `#D4A017` are the two hexes in this document that belong to
no lime / violet / himbeere ramp. They are not exceptions to "no other hex":
they are `color.category.*` in the token package, a data scale whose job is
to be told apart, and they enter the site as those tokens like everything
else.

The `bare` values are list-row icons — non-text, so the floor is 3:1, which
all five clear. The `dot` values are coins carrying a glyph, so the floor is
4.5:1.

**Two corrections, both measured — one written, one still open.**

1. `category.community-life.dot` and `.bare` ship in **2.8.0** as
   `himbeere-500` `#E0286E`, and the package pairs the coin with a `paper`
   glyph at **4.29:1** — below the floor. `ink` on it is **3.86:1**, also
   below. Neither glyph works at badge size, so the fill has to move:
   `himbeere-600` `#BC1C5A` clears at 5.84:1 with `paper` and is one step
   down the same ramp. PR **#464** (open, unmerged, branch
   `brand-design/measured-corrections-2026-09-24`) makes that change
   upstream. The table above already states `himbeere-600`; the website
   renders it that way, by token substitution, until #464 lands and the pin
   moves.
2. `himbeere` is this system's **pulse** (see below) and a category colour
   on every event row spends it. The coin is data, not pulse, and does not
   count towards the one-`himbeere`-per-screen budget — but a
   `community-life` colour off the himbeere ramp entirely would remove the
   collision instead of carving it out, and that is the preferred fix.

Never assume `paper` text on a category fill — `lime-600` and `lime-500`
both require `ink`, and `himbeere-500` takes neither.

**The neighbouring-place chip is not a category.** It is a control, and it
keeps `#9A6300` on `paper` (4.85:1). That clears the floor with little
margin: good for a chip label and for nothing longer. For a run of text on
a light ground use `archive ink` `#7A4F00` (6.85:1 on `paper`) or
`lime-800` (6.67:1).

### Pairs that do not clear

| Pair | Ratio | Rule |
| --- | --- | --- |
| `#9A6300` on `archive ground` `#FBF1DC` | 4.50:1 | At the floor, not above it. Placeholder badges only, never body, never a heading. The darker alternative is `archive ink`. |
| `paper` on `lime-600` | 2.49:1 | Forbidden. `lime-600` takes `ink`. |
| `paper` on `lime-500` | 1.62:1 | Forbidden. `lime-500` takes `ink` or `lime-900`. |
| `himbeere-500` on `paper` | 4.29:1 | Display fills at 32 px and above only. `himbeere-600` (5.84:1) for anything smaller or anything carrying text. |
| `paper` on `himbeere-500` | 4.29:1 | Forbidden at label size — the reason `category.community-life` moves to `himbeere-600`. `ink` on it is worse (3.86:1). |
| `line` on `lime-100` | 1.27:1 | Invisible. `border.hairlineOnLime` shipped in brand-design **2.8.0** as `lime-300` `#C6E593`, which measures **1.19:1** on `lime-100` — weaker than the `line` it replaces. PR **#464** (open) corrects it to `lime-500` `#A4D822`, **1.45:1**, which matches the 1.42:1 weight `line` has on `paper` instead of undercutting it. Measured 2026-09-24. Until #464 lands and the pin moves, the website's own interim hairline on a lime ground is `lime-400` (1.31:1); after it, the hairline is `border.hairlineOnLime` and the interim goes away. |

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
| Kicker / label (mono) | 15 px / uppercase / 0.08em | 700 |

**15 px is the floor, and there is no carve-out.** The badge, the chip, the
tag and the placeholder label are all mono 15 px / 700 like every other
label; a pill is not a reading aid that buys back three pixels. The guide
used to allow 11–13 px inside a badge, and that allowance is retired for
three reasons, all of them already true elsewhere: `TS-WEB-0002 D3` floors at
15 px and `TS-WEB-0002-A10` asserts it; the built site has no `font-size` below
15 px anywhere; and `font.size.label` is `0.9375rem` (15 px) as shipped in
brand-design **2.8.0**, which the website has been overriding it to since
F-2-44. Resolving C11 by raising the sizes rather than by writing a
badge-only exception is what keeps those four statements one statement.

The consequence is a taller badge — see *Fixed heights*. Display sizes
always break by hand where the line reads better; the place name may split
across two lines (`SCHLAT / KOW`).

**Letter-spacing on mono labels is `0.08em`**, for both kicker roles and the
badge label. One value, everywhere. Both values **shipped** in brand-design
**2.8.0** — `font.letterSpacing.label` `0.06em → 0.08em` and
`font.size.label` `0.875rem → 0.9375rem`. The website is still pinned at
`0.1.3`, so `app/styles/brand.css` carries the recorded `--font-size-label`
override until the pin moves; at `2.8.x` it is an exact no-op and is
deleted rather than kept.

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
44 px pill nested inside the 56 px field with 6 px inset. The field itself is
always `paper` — that is what makes it read as the thing you type into.

**The field needs a dark ground under it, and the section provides one.**
The rule used to say "on a colour surface it is `paper` too" and then that a
light ground "repeats the hero's treatment", which is a contradiction and is
why the closing search on `/` shipped as white on white. Resolved: a search
field only ever sits on a photo surface or on the `ink` section. There are
two variants and no third.

| Variant | Where | Field | Submit pill | Edge |
| --- | --- | --- | --- | --- |
| on-photo | The hero, over the scrim | `paper` ground, `ink` text, `muted` placeholder | `ink` fill, `paper` label | none — the scrim is the contrast |
| on-ink | Any other surface that carries the search, the closing block on `/` included | `paper` ground, `ink` text, `muted` placeholder | `lime-500` fill, `ink` label (10.20:1) | none — `paper` on `ink` is 16.56:1 |

**A section that carries a search field takes the `ink` ground.** That is a
composition rule, not a field property: the closing block on `/` that binds
off with the Dorfkalender and the place search is an `ink` section, so the
reader meets the same shape they met in the hero. A search field never sits
on `paper`, `surface`, `surface-2` or `lime-100` — `paper` on `paper` has
no edge and is not a search field, and giving it one would need a fourth
border exception.

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
- Keyboard and ARIA follow TS-WEB-0002 D5: `ArrowDown`/`ArrowUp` move the active
  row, `Enter` selects, `Escape` closes and returns focus to the field;
  `aria-expanded` and `aria-activedescendant` on the field, rows as options.
  The focus ring rule applies to the field, not to the active row, which is
  marked by a `surface` ground.
- **No match is a designed row, never an empty panel.** One row, 56 px, the
  same ground and hairline as the others, stating plainly that this place is
  not there yet. It shows a `map-pin` glyph in `muted`, the line in `ink`
  18 px / 400, and **no arrow** — the arrow is what says "this is a link"
  and this row is not one. It carries no button, no "try a postcode", no
  error colour and no `triangle-alert`: it is an empty result, not a fault.
  It is not counted against the 3–4 row budget, because it replaces the
  list rather than joining it.
- **The row is not interactive, and the spec owns that.** `TS-WEB-0008 D7a`
  determines it as "one non-interactive row stating that no place was
  found; the form still submits and reaches `/dein-ort/starten`", and
  `DEC-0079 §4` is the decision that there is no suggestion to offer. The
  onward action is therefore the field's own submit, which stays live — not
  a control inside the row. This guide described "a row with its onward
  action", which read as a second target and contradicted both; it does
  not any more. Where submitting routes, and what the row says, are
  `TS-WEB-0008 D7a`'s to state, asserted by `TS-WEB-0008-A15`; this entry describes
  only how the row looks.

### Badge and chip

Radius 999, **mono 15 px**, weight 700, padding 6 × 15 px. A badge labels
(category, kicker, award); a chip is tappable (a neighbouring place) and
therefore at least 40 px tall. Kickers are badges with an 18 px icon.

Badge text is label type at the 15 px floor, not small type — the badge got
taller rather than the type smaller (see *Typography*). Every fill/text pair
is still checked against 4.5:1 before use: the pill is not a contrast aid
either. See the category table above. The placeholder badge is `#9A6300` on
`archive ground` (4.50:1) and is the reason that pair may not grow into a
heading.

**Tag** — the non-tappable size. 30 px, mono 15 px / 700, padding 5 × 12 px,
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
  and a trailing 24 px `arrow-right`. The first row takes the **filled**
  treatment (`ink` ground, `paper` title at 16.56:1, `lime-400` sub-label at
  11.21:1); every further row is **outlined** (`paper` ground, `ink` title,
  `muted` sub-label at 5.70:1). Each row carries its own ground, so nothing
  is ever read against `lime-100` directly.
- **Filled is a weight, not a conversion rank.** The first row is
  `data-cta="secondary"` — on every page, including the one whose primary
  conversion is a booking. `TS-WEB-0006 D3` allows exactly one
  `data-cta="primary"` per page and the contact section is never it
  (decision 2, 2026-09-23); a page that reaches the section already spent
  its primary above. The ink ground says "start here among these four
  channels", which is a reading order inside one component, and the earlier
  wording "the first row is the primary treatment" was read as the marker
  and is corrected.
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
- **Three step lines**, each a numbered disc plus two lines: the bold core
  (18 px / 700) and the normal detail (15 px / 400). **Each line is a single
  line at 390 px viewport width** — that is the length budget the copy is
  written to, not a hope. The active step's disc is `lime-500` with `ink`;
  the others are `surface` with `muted`.
- **One CTA** at the bottom, the module's own conversion, at **secondary**
  treatment and marked `data-cta="secondary"`. Never `primary`: `TS-WEB-0006 D3`
  allows exactly one `data-cta="primary"` per page, and `/mitmachen` carries
  three of these modules (decision 2, 2026-09-23). The module's CTA points
  at the deeper page, whose own primary is the one that counts.

#### Two layouts, and the breakpoint decides which

The module is one component with one content tree and one `min-width`
switch, at **`lg` = `48rem` (768 px)** from the brand-design `breakpoint`
scale — the tablet step, and the only breakpoint this component uses.

**Below `lg` — the phone.** There is no room for three graphics side by
side, so there is a **graphic stage**: one box at `ratio-square`, holding
three states, the next cropped in at the trailing edge so the stage reads as
something that continues. The box never changes size, so a state change
cannot shift the page. The three step lines sit beneath it. **The module
plus its three step lines fit one phone screen** — one viewport height at
the phone breakpoint. If they do not, the copy is too long; the module does
not grow.

**From `lg` — tablet and up.** The three steps **stand side by side**, each
with its own graphic above its own two lines. There is no stage, no crop and
**no slide**: everything is visible at once, which is the whole reason the
stage existed. Nothing auto-advances here. An animation at this size may
only **highlight the active step** — the disc and its graphic take the
active treatment, the other two do not — and it moves nothing.

From `lg` the constraint is the row, not the viewport height.

#### Motion exception — the auto-advance

**This is an owner decision, not a guide liberty** (decision 8,
2026-09-23). It is the one exception to "one movement only" in the whole
system, it is scoped, and the scope is part of the exception:

- It exists **only below `lg`**, because only there is a state hidden.
  From `lg` there is nothing to advance to, so there is no auto-advance to
  grant — which is also why "no second animation" and "a motion exception"
  are no longer two rules pointing opposite ways.
- 550 ms per transition with the standard easing, at least 4 s dwell per
  state, **pausing on focus or on any interaction** and not resuming.
- The three step lines are also the controls: activating one shows its
  state. They are real buttons — reachable by `Tab`, operated by `Enter`
  and `Space`, with `aria-current` on the active one — **at every size**,
  below `lg` and above it alike. A step is never reachable only by waiting.
- Under `prefers-reduced-motion` the stage shows **state 1 static**, step 1
  active, and the step lines remain the way to reach states 2 and 3. The
  fallback is a static state, never a faster animation.
- The highlight-only animation from `lg` is not a second exception: it
  changes colour, not position, and a colour change on an active state is
  what *active* has always meant in this system.

### Transparent overlay header

The header as built today: no ground of its own, sitting over the hero
photo.

- Mark-only logo, 40 px, clipped to radius 999. No wordmark over a photo.
- The calendar entry as a `lime-500` pill, 44 px, `calendar-days` 24 px plus
  an `ink` label (10.20:1).
- Every other control in a 44 px round well — see the blur rule below for
  what fills it.
- Nothing else. The header carries no fill, no bar, no shadow.

#### The blur primitive

**Decision 6, 2026-09-23: the header treatment over a photograph is a
backdrop blur.** The problem it solves is that the logo mark and the
controls sit on an unknown photograph and a solid well solves contrast by
hiding the picture behind a disc. The blur keeps the photograph visible and
still separates the control from it.

`backdrop-filter` is the **only** blur in the system and this is the only
place it is used. It is a primitive, so it is defined once:

| Property | Value |
| --- | --- |
| Filter | `backdrop-filter: blur(12px) saturate(120%)` |
| Shape | the control's own shape — radius 999, 44 px well, 40 px logo mark. Never a bar across the header |
| Tint above it | `scrim.38` over the blurred area, so the glyph has a measured ground rather than whatever the photograph happens to be |
| Glyph | `paper` on the tinted blur |
| Also covered | the top scrim band of the hero (`scrim.35 → scrim.0` over the first 16 %) is what carries the header when the photograph behind it is bright; blur and band are one treatment, not two |

**The fallback is the solid ink well, and it is documented, not implied.**
Where `backdrop-filter` is unavailable the control falls back to the
44 px `ink` control well with a `paper` glyph (16.56:1) — the treatment the
site ships today, unchanged. It is selected by capability, never by user
agent:

```css
.header-control { background: var(--color-ink); }          /* the floor */
@supports (backdrop-filter: blur(12px)) {
  .header-control { background: var(--color-scrim-38);
                    backdrop-filter: blur(12px) saturate(120%); }
}
```

Three conditions take the fallback, and each is a real one:

1. **The browser cannot do it** — no `@supports` match.
2. **`prefers-reduced-transparency`** is set. A blur is a transparency
   effect and this is the preference that asks for it to stop.
3. **The performance budget says no.** `backdrop-filter` forces a
   compositor layer that re-rasterises on scroll, over a sticky element,
   above the largest image on the page — which is the LCP element on four of
   the routes in `TS-WEB-0003 D2`. The budget interaction is therefore concrete,
   not theoretical: the treatment is legal only while the route stays inside
   `TS-WEB-0003 D1` (LCP < 2.5 s, INP < 200 ms, CLS < 0.1) with it applied. If a
   route falls out of that on the measured run, that route takes the
   fallback — the budget wins, and `TS-WEB-0003 D4`'s rule that Lighthouse is the
   floor and bytes are the proxy applies here unchanged.

The blur never carries contrast on its own. Whatever is behind it, the glyph
is read against `scrim.38`, which is why the tint is part of the primitive
and not a decoration on top of it.

### Photo surface

Full width, no radius, no border. The photograph is the section's first
background layer with the scrim above it in the same declaration. Text sits
in the dark part.

#### The scrim

**The 2026-09-23 draft is binding** (decision 5; *Design – Optimized Hero
Gradients and Colors*, variant 1b "Neutral · transparent"). It replaces the
old fixed ladder — transparent at 12–26 %, 0.82–0.86 at 38–62 %, 0.96 at the
bottom — and it replaces the ink-tinted and violet variants with one
treatment for **every** hero on the site, not only the home page.

- **Neutral black.** Not `ink`, not `violet-500`, not a tint of either. A
  tinted scrim dyes the photograph, which is what made the old one read
  "dreckig, schlammig". This is the one named exception to "never pure white
  or black" (see *Colour*).
- **Maximum 0.72.** Nothing in a scrim is ever more opaque than that. The
  0.96 step is retired; at 0.96 the photograph is gone and the text is
  sitting on a black band, which is the thing the reader was told it was not
  sitting on.
- **Multi-stop, two gradients**, exactly as the draft states them:

```css
background-image:
  linear-gradient(180deg, var(--color-scrim-35) 0,  var(--color-scrim-0)  16%),
  linear-gradient(180deg, var(--color-scrim-0)  38%, var(--color-scrim-38) 58%,
                          var(--color-scrim-72) 100%),
  url(<photo>);
```

  The first gradient is the top band that carries the header (see
  *Transparent overlay header*); the second is the reading band under the
  headline, the search field and the CTAs.

- **The soft text shadow is part of the treatment**, not an extra. Every
  piece of type on a photo surface — display, lead, button label, search
  placeholder — carries:

```css
text-shadow: 0 1px 2px var(--color-scrim-45), 0 2px 10px var(--color-scrim-30);
```

  Two stops: a tight one that gives each glyph an edge where it crosses a
  detail, and a wide, faint one that lifts the whole block off a busy
  surface. It is soft by construction — no offset beyond 2 px, no stop above
  0.45 — because a hard shadow is a second design element and this one is
  meant to be invisible until you cover it up. It exists **only** on a photo
  surface; type on any flat ground carries no shadow at all. PR **#464**
  gives the whole declaration a name of its own, `shadow.textOnPhoto`, so
  the component reads one token instead of composing two scrim steps.

- **It is still a token, and never a literal.** `color.scrim.*` is an alpha
  ladder in `@schafe-vorm-fenster/brand-design`; `TS-WEB-0017 D3` and
  `TS-WEB-0017-A5` reject an `rgba(…)` at a call site whatever its colour. The
  ladder this treatment needs is `0 · .30 · .35 · .38 · .45 · .72`. The
  shipped **2.8.0** carries `0 · .16 · .38 · .72 · .96` **derived from
  `ink`, `rgba(23,29,13,α)`** — the pre-decision shape, published. PR
  **#464** (open, unmerged, branch
  `brand-design/measured-corrections-2026-09-24`) corrects it to
  `rgba(0,0,0,α)` at `0 · .30 · .35 · .38 · .45 · .72`, and adds
  `shadow.textOnPhoto` = `0 1px 2px scrim-45, 0 2px 10px scrim-30` so the
  text shadow is a token too rather than two scrim steps composed at the
  call site.

- **What the site renders today is none of the above, and the rewrite is
  owed.** `app/styles/brand.css` declares **no scrim ladder** — the scrim
  is built in the component —
  `src/components/photo-surface/photo-surface.module.css` — the
  pre-decision way:
  `--photo-scrim: var(--color-neutral-ink)` with a
  `var(--color-violet-500)` tone variant, composed with `color-mix()` to
  82 %, 84 % and 96 %. That is the ink-tinted scrim with the violet variant
  that decision 5 retired, and 0.96 runs above the 0.72 ceiling this
  section sets. Because it is mixed from tokens rather than written as a
  hex literal, `pnpm check:brand` cannot see it: the guard catches colour
  literals, not a token used against its own rule. So the position is three
  things at once — **the ladder above is the rule**, **the package carries
  it once #464 lands**, and **the component does not implement it yet**.
  What the component rewrite involves, named so it is not mistaken for a
  token swap: the surface's two gradients in `.surface` / `.ink` /
  `.violet` (the variants collapse into one neutral treatment), the
  content-anchored second scrim in `.content::before` (its 0.82 floor and
  0.96 end are the same retired ladder), and the `check:contrast` hero row
  owed below, which is what would have caught this.

#### Contrast is measured, not assumed

The fixed-opacity rule is gone, and nothing replaces it with another fixed
number. **What is fixed is the outcome:**

> The composite of photograph **plus** scrim, sampled where the type
> actually sits, clears **4.5:1 behind body text** and **3:1 behind display
> type** — measured **per photograph**, not once for the component.

That is `NFR-WEB-0011` and this document's *Accessibility* rule stated as an
acceptance condition instead of as a recipe. A ladder cannot be measured
because the photograph is the other half of the pair: 0.72 over a dark
barn roof and 0.72 over a white gable are not the same surface. The
0.72 ceiling and the 4.5:1 floor together are what constrain the choice of
photograph — a motif that only clears the floor at 0.85 is the wrong motif,
and the answer is a different crop or a different picture, not a darker
scrim.

**How it is verified.** By `pnpm check:contrast`, extended to a hero row:
for each hero photograph and each rendition, composite the two gradients
over the image at the declared `object-position`, sample the text box of the
display line and of the lead line, and take the **worst** pixel in each box
against the type colour. Under the floor is an error, not a warning — the
same exit contract the token guard already has.

> **Owed, and named so nobody assumes it exists.** That row is not written.
> `pnpm check:contrast` today measures the **token set** (TS-WEB-0002-A3) and
> knows nothing about photographs; `NFR-WEB-0011` states the requirement and
> `DEC-0056` fixes the basis, but no acceptance criterion asserts the
> composite. The specs are a parallel owner's file, so this guide states the
> requirement and records the test as **owed**: a `check:contrast` hero row
> plus the acceptance criterion that binds it, against `TS-WEB-0002` (the guard
> lives with the contrast check) and cited from `TS-WEB-0003 D8`/`DEC-0077`, which
> already own the per-hero renditions the row would iterate. Until it
> exists, the measurement is a manual step at the editorial gate and every
> hero photograph carries its measured pair of ratios in its own record.

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

A photo that does not depict what the copy claims carries the placeholder
badge (`#9A6300` on `archive ground`, radius 999, mono 15 px): *"Nicht
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
COLOUR   ink, the closing Dorfkalender block with the place search
```

Rules:

- Never two photo sections in a row.
- At most two consecutive sections in the same colour family.
- Exactly one `himbeere` element per screen (`himbeere-600` for anything
  carrying text). A category coin is data, not pulse, and does not count —
  see *Category colours*.
- The dark ink section carries the live data; it is the anchor of the page
  and appears once. **A closing search block is the one further `ink`
  section a page may carry**, because a search field has no other legal
  ground (see *Search field*). It sits last, after the context band, and the
  two ink sections are never adjacent — on `/` the whole middle of the page
  lies between them.

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
| Badge (label only) | 28 px, or 32 px with an 18 px icon |
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

**One exception, named, and taken by the owner:** the explain module's
graphic stage may auto-advance through its three states — **decision 8,
2026-09-23**, not a liberty this document took for itself. Its scope is part
of it: only inside that component, and only **below `lg` (48 rem)**, where
one of the three states is hidden and there is something to advance to. From
`lg` the three steps stand side by side and nothing advances; the only
animation there changes the active step's colour, which is a state, not a
movement. The fallback under `prefers-reduced-motion` is state 1 static, not
a faster animation, and the step lines stay operable by keyboard at every
size.

There is no second exception, and nothing below `lg` may be read as one: a
skeleton still does not pulse, and a looping animation anywhere else is
still forbidden.

## Accessibility

- Body text at 4.5:1 minimum, display type at 3:1, measured against the
  composite of photo plus scrim — not against the scrim alone, and per
  photograph (see *Photo surface*). The check that asserts it is **owed**
  and named there.
- Focus ring: 3 px `violet-500`, 2 px offset, on every interactive element.
- 15 px is the type floor everywhere, with no exception for a badge, a chip
  or a tag (`TS-WEB-0002 D3`, `TS-WEB-0002-A10`).
- A blur is a transparency effect: `prefers-reduced-transparency` takes the
  solid fallback (see *Transparent overlay header*).
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
- No colour outside the scales above; no colour literal at a call site, a
  scrim included — the ladder is a token like everything else.
- No grey-green ground under positive content.
- No type below 15 px, badges and tags included.
- No text shadow **off** a photo surface; the one on it is specified under
  *Photo surface* and has no other use.
- No blur outside the header primitive, and no second animation beyond the
  explain module's auto-advance below `lg`.
- No search field on a light ground.

## Open decisions

**None in this document.** The three that stood here were taken on
2026-09-23 and are written into the rules above rather than kept as
options:

| # | Was | Taken as | Where it now lives |
| --- | --- | --- | --- |
| 1 | Scrim ladder, and text shadow yes/no | **Decision 5** — the draft is binding: neutral black, multi-stop, max 0.72, soft text shadow, and a measured contrast floor instead of a fixed ladder | *Colour* (the named exception), *Photo surface* |
| 2 | Header contrast — solid wells or a blur primitive | **Decision 6** — the blur primitive, with a documented capability fallback to the solid ink well and a stated performance-budget interaction | *Transparent overlay header* |
| 3 | Category taxonomy — five token keys or six guide rows | **Decision 7** — neither: the canonical list is `classification-api`'s four ids plus the `unknown` fallback, which is what the token package already carries. Event rows keep the category, as this guide always said | *Category colours* |

What is still **outstanding** is not a decision but work owed elsewhere, and
each one is named at the rule it belongs to:

- **Upstream, written but unmerged.** PR **#464** against
  `@schafe-vorm-fenster/brand-design` carries the four measured
  corrections to what 2.8.0 shipped: the neutral-black scrim base with its
  full ladder plus `shadow.textOnPhoto`, `category.community-life.dot` and
  `.bare`, `border.hairlineOnLime`, and the `color.categoryStatus`
  PROVISIONAL marker replaced by the source that has now been read.
- **In this repository.** The `0.1.3 → 2.8.x` pin move, which is what makes
  anything above consumable at all (`specs/contracts/design-system-contract.md`,
  *Consuming it*); the `photo-surface` component rewrite onto the scrim
  ladder (*Photo surface*); and the `check:contrast` hero row that would
  assert it (*Photo surface*).

The full per-role list is `specs/contracts/design-system-contract.md` §5.
