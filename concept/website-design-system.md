---
title: "Website Design System — www.schafe-vorm-fenster.de"
created_at: 2026-09-10
updated_at: 2026-10-27
status: draft
source: workshop
intent: inform
brand: schafe-vorm-fenster
tags: ["website", "design-system", "ui", "style-guide"]
related:
  # The three hub concept documents, by their path in `go-to-market-os` — they
  # are not in this repository and may not be copied into it (concept/README.md
  # rule 1, AGENTS.md working rule 7). These read `./…` until 2026-09-25, which
  # resolved to nothing.
  - go-to-market-os/concept/website-communication-principles.concept.md # SRC-0001
  - go-to-market-os/concept/website-relevance-model.concept.md # SRC-0002
  - go-to-market-os/concept/website-information-architecture.concept.md # SRC-0003
  - ../specs/contracts/design-system-contract.md # SRC-0013 — the contract that binds this guide
---

## Purpose

This is the binding visual specification for `www.schafe-vorm-fenster.de`.
It names one direction — **Editorial with photo surfaces** — and defines the
tokens, components, and composition rules that produce it. Everything here
derives from the Brand & UI Kit; no colour, typeface, or radius outside this
document is permitted.

The companion file `Style Guide.dc.html` shows every rule rendered.
`Desktop Raster.dc.html` shows the layout grid at 1440 px, with static
renders in `v2.0/assets/desktop-raster/` (see *Layout Grid*).
`Geschichten Modul.dc.html` shows the story stage, renders in
`v2.0/assets/story-stage/` (see *Story stage*).

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
| `ink` | `#000000` | Primary text, dark sections, primary button fill, control wells. **Neutral black since 2026-10-12** (`DEC-0155`): it was `#171D0D`, which reads as dark green across a section, and dark green as a surface leaves the design. One value for the text and the dark ground; `brand-design` 2.9.0 carries it, and the website is pinned to it (`DEC-0160`) |
| `text-2` | `#39412C` | Body copy on light surfaces. **Not a fill**: it carries the lime hue and reads as dark green (`DEC-0160` amendment, 2026-10-13). The hover of an `ink` fill is the neutral `ink-hover` mix instead (`ink` + 18 % `paper`). |
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
| `lime-800` | `#486202` | Links and CTA text on light |
| `lime-900` | `#2D3F01` | Text on a lime-500 surface |

**`lime-700` to `lime-950` are never a fill** (`DEC-0155`, `DEC-0160`). Dark
green is for text, links and icons. A hover on `ink` is `ink-hover`, a neutral grey (`ink` mixed with 18 % `paper`, ≈ `#2D2D2C`; `paper` on it 13.24:1, `lime-500` 8.16:1), "Amtlich"
and every kicker badge that was dark green is `ink` with `paper` (20.17:1),
and a chip on a dark ground is `ink-hover` with `paper`. `TS-WEB-0017-A30`
(`check:brand`) fails a `background`, `background-color` or `fill` that names
one of the four, directly or through a custom property, and a board that
paints one.

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

**Version.** All three roles shipped in **2.8.0** (PR **#447**, merged
2026-09-23, merge commit `a1201c4`), and **the pin moved on 2026-09-25**:
`package.json` carried the exact version **`2.8.1`** where it carried
`0.1.3` (**`2.9.0`** since 2026-10-13, `DEC-0160`), so all three are consumable here now. The stand-in is gone with it:
`--color-placeholder-ground` was deleted from `app/styles/brand.css`, its one
call site (`app/styles/components.css` `--placeholder-ground`) reads
`--color-archive-ground` directly, and `scripts/check-contrast.ts` measures
that token instead of the retired alias. Measured in the production
stylesheet after the move: `--color-archive-ground: #fbf1dc`, and
`--color-placeholder-ground` is not emitted at all.

What each part of an archive block is set in:

- The **ground** is `--color-archive-ground`, the token.
- The **headline and the bold core line** are `ink` (18.72:1), the detail
  line `text-2` (9.52:1).
- The **kicker** is still set in `ink` rather than in `#9A6300`. Moving the
  archive foreground onto `archive.ink` (`#7A4F00`, 6.35:1) is available in
  the package now, and it is a **design change with its own
  re-measurement**, owned by this document, not something a pin move
  performs. Until that measurement is taken, `ink` is what ships.
- The **hairline** may now be `archive.line` `#DFCB9D` (1.42:1 on the
  ground) instead of `line` (1.32:1), on the same condition.

The pin move did what the pin move owns and nothing more: the two token
substitutions and the deletion of the interim. See the pin-move section in
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

The package's `color.categoryStatus` carried "PROVISIONAL — … canonical
source … was not reachable and has not been read" through **2.8.0**. PR
**#464** replaced the marker with the read source named above, and **2.8.1**
ships it: the note now begins *"Read 2026-09-24 from the canonical source:
packages/rural-event-categories/src/types/ruralEventCategory.ts in
classification-api"*. Read in the installed package on 2026-09-25.

| id | Label (`color.category.*.label`) | Icon | Coin fill (`dot`) | Glyph | Ratio | Bare icon (`bare`) on `paper` |
| --- | --- | --- | --- | --- | --- | --- |
| `community-life` | Gemeinschaft | `users` | `himbeere-600` `#BC1C5A` — see below | `paper` | 5.84:1 | `#BC1C5A`, 5.84:1 |
| `education-health` | Bildung & Gesundheit | `graduation-cap` | `#1FB2A6` | `ink` | 7.98:1 | `#178E85`, 3.85:1 |
| `everyday-supply` | Versorgung | `shopping-basket` | `#D4A017` | `ink` | 8.84:1 | `#B4830C`, 3.26:1 |
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

**Two corrections, both measured — one landed, one still open.**

1. `category.community-life.dot` and `.bare` shipped in **2.8.0** as
   `himbeere-500` `#E0286E`, and the package paired the coin with a `paper`
   glyph at **4.29:1** — below the floor. `ink` on it was **3.86:1** (4.70:1 since `ink` became neutral black), also
   below. Neither glyph worked at badge size, so the fill had to move:
   `himbeere-600` `#BC1C5A` clears at 5.84:1 with `paper` and is one step
   down the same ramp. PR **#464** made that change upstream and **2.8.1**
   ships it. Measured in the production stylesheet after the pin move:
   `--color-category-community-life: #bc1c5a`. No token substitution stands
   behind the table above any more — the package carries the value.
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
| `paper` on `himbeere-500` | 4.29:1 | Forbidden at label size — the reason `category.community-life` moves to `himbeere-600`. `ink` on it was worse (3.86:1; 4.70:1 since `ink` became neutral black). |
| `line` on `lime-100` | 1.27:1 | Invisible. `border.hairlineOnLime` shipped in brand-design **2.8.0** as `lime-300` `#C6E593`, which measures **1.19:1** on `lime-100` — weaker than the `line` it replaces. PR **#464** corrected it to `lime-500` `#A4D822`, **1.45:1**, which matches the 1.42:1 weight `line` has on `paper` instead of undercutting it. Measured 2026-09-24, shipped in **2.8.1**, and read in the production stylesheet on 2026-09-25 as `--border-hairline-on-lime: 1px solid #a4d822`. The pin moved the same day, so the hairline on a lime ground is `border.hairlineOnLime` and the `lime-400` interim (1.31:1) is retired. |

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
15 px anywhere — 147 literal `font-size` declarations in the production
stylesheet on 2026-09-25, none of them below 15 px; and `font.size.label` is
`0.9375rem` (15 px) as shipped in brand-design **2.8.0** and installed here
since the pin moved to **2.8.1**. Resolving C11 by raising the sizes rather
than by writing a badge-only exception is what keeps those four statements one
statement.

The consequence is a taller badge — see *Fixed heights*. Display sizes
always break by hand where the line reads better; the place name may split
across two lines (`SCHLAT / KOW`).

**Letter-spacing on mono labels is `0.08em`**, for both kicker roles and the
badge label. One value, everywhere. Both values shipped in brand-design
**2.8.0** — `font.letterSpacing.label` `0.06em → 0.08em` and
`font.size.label` `0.875rem → 0.9375rem` — and both arrive here with the pin
move to **2.8.1** on 2026-09-25. The `--font-size-label` override in
`app/styles/brand.css` was therefore deleted, **after** the pin moved and not
before: deleting it first would have dropped `chip`, `choice-group`,
`scope-picker` and the wordmark to the 14 px `0.1.3` shipped. The production
stylesheet reads `--font-size-label: .9375rem` and `--tracking-label: .08em`
from the package, with no override behind either.

## Shape and Space

- **Radius:** `999px` for controls and the logo, `0` everywhere else. A card
  that is wholly one link counts as a control (`DEC-0156`).
  There is no third value.
- **Horizontal padding:** 16 px inside the viewport below `md` (640 px);
  from `md` up the outer margin steps with the grid — see *Layout Grid*.
- **Vertical padding:** 26–30 px for standard sections, 20–24 px for tight
  ones. One value per section — never a padded card inside a padded section.
  Standard is 28 px in every tier; tight is 22 px, and 24 px from `xl`
  (`DEC-0178`).
- **Between blocks:** `space-4` (16 px, `--block-gap`) on the phone and the
  tablet, `space-6` (24 px) from `xl`; `space-2` (8 px, `--block-gap-bound`)
  between a section's kicker and the block it names, `space-3` (12 px) from
  `xl` (`DEC-0178`). Nothing else — see *Who owns which space* below.
- **Gap between controls:** 8–10 px. Between list rows: a `line` hairline,
  no gap.
- **Touch targets:** 44 px minimum, 56 px for primary actions.
- **Borders and shadows:** none. A hairline divides rows inside a surface;
  contrast between surfaces does the rest.

**Four named exceptions to "no borders", and no more:** the search-result
overlay's edge, the excluded tag's outline, the `verschoben` badge when
it sits on a `paper` ground, and the 2 px `ink` border of the secondary
action on a light ground (`DEC-0160`). Each one is a case where an element has left
the flow or lost its fill and would otherwise have no boundary at all. A new
exception needs a decision, not a stylesheet.

### Who owns which space

Vertical space has exactly one owner per level (`DEC-0171`, issues #90 and
#108). The layers, from the outside in:

| Layer | What it is | Owns |
| --- | --- | --- |
| Page | the list of sections, then context band and closing block (`page-frame`) | nothing — sections butt against each other |
| Section | `section-shell`: a ground, full bleed | its `padding-block` (*Vertical padding* above), and nothing between its blocks |
| Container | `.container`: the 1200 px content box and the outer margin (*Layout Grid*) | width and inline margin, never vertical space |
| Content stack | the container's content, marked `data-stack` | the space **between** its direct children: `--block-gap`, `--block-gap-bound` after the kicker |
| Block | a direct child of a stack: a heading, a paragraph, a module, a component | nothing outside its own box — **no outer margin** |
| Inside a block | the component's own layout | its own internal gaps, from the space scale |

**The spacing scale per level and tier** (`DEC-0178`). One token per level,
every value set in `app/styles/components.css` and nowhere else
(`TS-WEB-0017-A34`); the tiers are *Layout Grid*'s three, stepping at the
breakpoint tokens `md` (40rem) and `xl` (64rem):

| Level | Owner | Token | Mobile (< `md`) | Tablet (`md`–`xl`) | Desktop (≥ `xl`) |
| --- | --- | --- | --- | --- | --- |
| Section edge, standard | `section-shell` | `--section-padding-block` | 28 px | 28 px | 28 px |
| Section edge, tight | `section-shell` `density="tight"` | `--section-padding-block-tight` | 22 px | 22 px | 24 px (`space-6`) |
| Between blocks | the content stack `[data-stack]` | `--block-gap` | 16 px (`space-4`) | 16 px | 24 px (`space-6`) |
| Kicker → the block it names | the content stack | `--block-gap-bound` | 8 px (`space-2`) | 8 px | 12 px (`space-3`) |
| Between controls | the control group | `--control-gap` | 10 px | 10 px | 10 px |
| Inside a block | the component | the space scale, no level token | — | — | — |

Two invariants hold in every tier: the bound gap is half the block gap, and
no block gap is wider than the tightest section edge. The tablet keeps the
phone's values because the scale has no step between 16 and 24 px
(`DEM-0071`); the desktop's 24 px is the next step and the desktop gutter, so
blocks stand as far apart down the page as columns stand across it.

**The HTML contract.** A section is one `section-shell`; its container (or,
uncontained, its lede) carries `data-stack`; the stack's **direct children**
are the blocks; a kicker carries `data-kicker`, and the bound gap follows from
that alone. There is one attribute and no variant — no
`data-stack="bound"` or `"loose"`: the only closer step is the kicker's, and a
looser one would be a second section.

```html
<section class="section-shell standard paper">     <!-- owns padding-block -->
  <div class="container" data-stack>               <!-- owns the gaps -->
    <p data-kicker>Was andere sagen</p>            <!-- block -->
    <h2>…</h2>                                     <!-- block: --block-gap-bound above -->
    <p>…</p>                                       <!-- block: --block-gap above -->
    <div data-stack>                               <!-- a group of blocks is a stack -->
      <h3>…</h3><ul class="rows">…</ul>            <!-- rows: one block -->
    </div>
    <ProofCard />                                  <!-- block: no outer margin -->
  </div>
</section>
```

A component never sets its own outer margin and is never handed one through
`className` (`TS-WEB-0017-A32`, whose list of known hand-ins is empty since
`DEC-0178`); space it needs inside itself is padding or `gap` on an element
it owns. Four components render a `section` whose inside is their own layout
and **not** a stack: `story-stage` and `photo-surface` (the hero's and the
story's text stack, `DEC-0171`), `contact-section` (portrait, head, four
rows), and `legal-section` (long-form typography whose heading levels carry
their own air).

Rules that follow:

- **A block brings no outer margin.** Not a `margin-top` for "a bit more air",
  and not through a `className` a page hands to a component either: two
  single-class rules on one element are decided by the order the build ships
  the stylesheets in, which is how the stories on `/ueber-uns` lost their gap
  (#108). The paragraph's and the heading's element defaults are cleared by
  the stack as well, so a section that ends on a paragraph ends on its padding.
- **A wrapper that groups blocks is a stack itself.** `motion-reveal`, a
  chapter, a year of the archive: a box that holds several blocks either is a
  stack or is one block whose inside is a component's own business. An
  unruled wrapper is a hole in the system — nothing owns the space inside it.
- **Rows are one block.** Rows divided by a hairline (the price tiers, the
  archive entries, event rows) stand in one wrapper, so the stack never puts
  a gap between them.
- **A heading reads with what it names.** A year heading or a chapter heading
  stands nearer to the block below it than to the one above — the stack gap
  above it adds to the padding the previous block ends on.

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

## Layout Grid

**Surfaces run edge to edge; content sits in one container.** Photographs and
colour sections keep running across the full viewport width. Everything a
reader reads or operates stands in a container of **at most 1200 px**, and
that includes the hero. Header, hero text and every section start on the same
left edge (owner's design input of 2026-10-07, `DEC-0150`; it answers
round 4's F-4-1, where at 1280 × 800 the hero `h1` spanned 1214 px and the
search field 1091 px).

The rendered reference is `v2.0/Desktop Raster.dc.html`. It shows the home
page and a content page (`/dein-kalender`) at 1440 px with the 12-column
overlay switched on. Static renders, for readers who cannot run a board:

| File | Shows |
| --- | --- |
| `v2.0/assets/desktop-raster/home-1440.jpg` | `/` — header, hero with search, ink section *head 1–4 · list 5–12* |
| `v2.0/assets/desktop-raster/content-page-1440.jpg` | content page — hero with two CTAs side by side, text section, comparison *6 + 6* |
| `v2.0/assets/desktop-raster/overview.jpg` | the whole board, including the rule list and the three breakpoint tiers |

**The board is normative for position and width only.** Its display sizes
(72, 64, 56 and 48 px), the navigation pill in its header and its event-row
details are sketch, not specification. Where they differ from this document,
this document stands: type sizes are the ones under *Typography*, and the
header is the one under *Transparent overlay header*. The board arrived with
a dark-green, `ink`-tinted scrim; that scrim was replaced on import by the
neutral-black ladder under *Photo surface* (`DEC-0151`). Every grid value the board carries is written down below,
because no rule may be read from a board alone.

### Three tiers on six breakpoints

The grid has three tiers. They sit on the six `breakpoint.*` tokens
(`TS-WEB-0017 D2b`) and introduce no switch point of their own: 640 px is
`md` and 1024 px is `xl`.

| Breakpoint | From | Tier | Columns | Outer margin | Gutter | Content width |
| --- | --- | --- | --- | --- | --- | --- |
| base | 0 | Mobile | 1 | 16 px (`space-4`) | — | viewport − 32 px |
| `xs` | 360 px | Mobile | 1 | 16 px (`space-4`) | — | viewport − 32 px |
| `sm` | 428 px | Mobile | 1 | 16 px (`space-4`) | — | viewport − 32 px |
| `md` | 640 px | Tablet | 8 | 32 px (`space-8`) | 20 px (no token yet, `DEM-0071`) | viewport − 64 px |
| `lg` | 768 px | Tablet | 8 | 32 px (`space-8`) | 20 px (no token yet, `DEM-0071`) | viewport − 64 px |
| `xl` | 1024 px | Desktop | 12 | at least 48 px (`space-12`) | 24 px (`space-6`) | min(1200 px, viewport − 96 px) |
| `2xl` | 1280 px | Desktop | 12 | at least 48 px (`space-12`) | 24 px (`space-6`) | min(1200 px, viewport − 96 px) |

This is the six-row table `DEM-0042` asked for. The density of the scale
below 640 px stays (`DEC-0067`). The grid does not use those switch points,
and a component may still tune type step or spacing at `xs` or `sm`.

**1200 px is the content box, not the padded box.** The outer margin lies
outside it. At 1440 px the margin is 120 px; at the 1280 px reference
viewport it is 48 px and the content box is 1184 px; above about 1300 px only
the margin grows (`TS-WEB-0017 D2c`). `measure.page` (75rem) names the
1200 px, so the container is `measure.page` **plus** two outer margins and
not `measure.page` including them.

Column spans at the full 1200 px (column 78 px, gutter 24 px):

| Span | Width | Used for |
| --- | --- | --- |
| 4 | ≈ 384 px | Section head beside a list |
| 6 | ≈ 588 px | Search field; each half of a comparison |
| 7 | ≈ 690 px | Hero text; running text (about 65 characters) |
| 8 | ≈ 792 px | Section headline; the list beside a 4-column head |
| 12 | 1200 px | Lists, rows, multi-column blocks |

### Placement rules from `xl` (Desktop)

| Element | Rule |
| --- | --- |
| Container | At most 1200 px, centred. The header, the hero's content and every section use it, so they share one left edge |
| Surfaces | Photographs and colour sections stay full-bleed across the viewport. A photograph is never boxed into the container (see *Images inside a colour section run full-bleed*) |
| Header | Logo on the container's left edge, the calendar pill on its right edge. Its composition stays the *Transparent overlay header* |
| Hero text | Columns 1–7, anchored bottom-left in the container. **Never centred over the photograph** |
| Search | Columns 1–6 (≈ 590 px). A place name does not need 1200 px |
| Hero height | `/`: `min(80vh, 680px)`. Content pages: `min(70vh, 560px)`. This replaces `ratio-hero` from `xl` (see *Media ratios*) |
| Running text | At most 7 columns (≈ 690 px, about 65 characters), and never wider than `measure.text` |
| Headlines | At most 8 columns |
| Two-column | Section head in columns 1–4, list in columns 5–12 |
| Comparison | 6 + 6, for example *today* against *with your calendar* (*Comparison*) |
| Flow | Sources · arrow · target in one row (*Source-to-target flow*) |
| Buttons | Side by side with a 12 px gap (`space-3`), wrapping when they do not fit |

**The grid is horizontal only.** Container, columns and spans fix width and
left edge; the space between blocks is the content stack's, at every tier
(*Who owns which space*). A two-column section is two blocks side by side in
one stack, and the stack does not space them against each other.

**Below `xl` there are no columns side by side.** Head and list stack, both
halves of a comparison stack, and the CTA slot stays the column of
`DEC-0116 §4`. The tablet tier changes only margin, gutter and the column
count it offers. The board draws no tablet screen, so where hero text,
search and headlines sit within the eight tablet columns is open (`Q-0085`).
Until that is answered they take the full content width, with running text
capped by `measure.text`.

The one-tree rule holds at every tier (`TS-WEB-0017 D2d`). A tier changes
column span, margin and gutter. It never changes block order, block presence
or wording, so a two-column section is the same tree as its stacked form.
`explain-module` keeps its own switch at `lg` (*Explain module*). Three steps
side by side is that component's rule and not this grid's two-column
pattern.

## Components

### Button

| Variant | Fill | Text | Use |
| --- | --- | --- | --- |
| Primary on light | `ink` | `paper` | The one main action per section |
| Primary on dark | `lime-500` | `ink` | Same, inside an ink or photo section |
| Pulse | `himbeere-600` | `paper` | Paid conversion only |
| Secondary on dark | `paper` | `ink` | Alternative action on an `ink`, `violet-500` or photo ground |
| Secondary on light | transparent, **2 px `ink` border** | `ink` | Alternative action on `paper`, `surface`, `surface-2`, `lime-100` or `lime-500` (`DEC-0160`). Hover: `ink` fill, `paper` label. `ink` on `paper` 20.17:1, on `surface` 18.51:1, on `lime-100` 17.95:1, on `lime-500` 12.42:1. A `paper` pill on `paper` disappeared (review preview: `/` "Jetzt kostenlos anmelden", `/mitmachen` "Flyer per WhatsApp schicken", `#F9FBF7` on `#F9FBF7`) |
| Quiet | transparent | `lime-800` | Tertiary, text plus arrow |

Height 56 px, padding 0 24 px, radius 999, weight 800, 18 px, with a 24 px
`arrow-right` where the action leads onward.

**A button's fill is never its ground** (`DEC-0154`, owner's review
2026-10-12). The ground decides the secondary pair, as it decides the primary
one: it publishes `--ground-secondary-*`, and `button` and `outbound-link`
read it (`DEC-0160`). Primary on light hovers to `ink-hover` (`paper` label
13.24:1), never to a dark green.

A button that leaves the site (its `href` on another origin — the app
handover, WhatsApp) carries the 24 px `external-link` glyph **in place of** the
onward arrow: it does not lead onward on this site, it opens a new tab (see
*Links*, `DEC-0169`).

### Links

**A link to another origin opens a new tab, always** (owner's review
2026-10-27, issue #82, `DEC-0169`): the village calendar, the app, the booking
calendar, WhatsApp, an outlet's article, Wikimedia Commons, a partner. The
website stays where the visitor left it — before, following the calendar link
made it disappear.

- `target="_blank"` with `rel="noopener noreferrer"`. No component and no page
  chooses: the target is read off the href, in one place
  (`src/lib/routes/link-target.ts`, applied by `anchor`).
- **`tel:` and `mailto:` stay** — they open an app, not a document, and a new
  tab would only leave an empty one behind. A link into this site stays too.
- **Seen:** the `external-link` glyph after the label — 18 px on an inline
  link and on a secondary pill, 24 px in a button. **"öffnet neuen Tab" /
  "opens new tab" is never visible text, anywhere** (owner's review
  2026-10-27, issue #100: it stood beside "Original ansehen" on the press page
  and beside the quote link on `/ueber-uns`; "es gibt ja das Icon"). A visible
  marking stands only where `TS-WEB-0016 D16` asks for one, because a third
  party receives the visitor's data, and it names that recipient only.
- **Heard:** a visually hidden "öffnet neuen Tab" / "opens new tab" after the
  link, joined by `aria-describedby` — in the description, never in the
  accessible name or the label. Screen readers keep the hint; eyes get the
  glyph.
- Guarded twice: statically in `pnpm check` (`TS-WEB-0016-A25`) and in the
  browser on every route (`TS-WEB-0016-A24`, which also fails any visible
  "neuen Tab" / "new tab" text).

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
| on-ink | Any other surface that carries the search, the closing block on `/` included | `paper` ground, `ink` text, `muted` placeholder | `lime-500` fill, `ink` label (12.42:1) | none — `paper` on `ink` is 20.17:1 |

**A section that carries a search field takes the `ink` ground.** That is a
composition rule, not a field property: the closing block on `/` that binds
off with the Dorfkalender and the place search is an `ink` section, so the
reader meets the same shape they met in the hero. A search field never sits
on `paper`, `surface`, `surface-2` or `lime-100` — `paper` on `paper` has
no edge and is not a search field, and giving it one would need a fourth
border exception.

**On a stage the field stands alone** (`DEC-0159`, owner's review 2026-10-12,
issues #20 and #23). In the hero the placeholder carries the instruction
("Tipp den Ortsnamen ein") and no helper line stands under the field; the
"use my location" control sits directly beneath it, one `space-2` down, and
its explanation is the control's accessible description and tooltip rather
than a paragraph on the photograph. The field keeps its label for assistive
technology. A placeholder cannot wrap, so it sits at the meta size and must fit
the field at 360 px; typed text keeps the body size. Once a place is known the
stage **keeps** the field, as the search for another place — same height, same
placeholder style, same keyboard — so a place stage is never just a name on a
photograph.

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
- **The hovered and the active row keep the overlay's own text pair**: place
  name `ink` on `surface` (18.51:1), municipality `muted` on `surface`
  (5.24:1); at rest `ink` on `paper` (20.17:1) and `muted` on `paper`
  (5.70:1). Never the ground's link colour: the row is a link, and on the
  photo hero the ground's link hover is `lime-300`, which put the hovered
  place name at **1.23:1** on `surface` (owner's review 2026-10-27, issue #79).
  `check:contrast` measures the four pairs, `TS-WEB-0008-A17` the rendered
  rows on `/` and `/dein-ort`.
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

**The category's form follows the row, not the screen** (owner's decision of
2026-10-13, `DEC-0153` amendment). A row at least **30 rem** wide shows the
category as the badge; a narrower row shows the bare 24 px glyph in the
category colour, with the label in the markup for anyone listening
(`categoryDisplay.listRow`). The threshold is measured: date column 52 px, a
16 px gap, the meta "Wolgast · 19 km · 16:00" (157 px), a 16 px gap and the
longest category badge, "BILDUNG & GESUNDHEIT" (234 px), are 475 px. So the
meta line — place, distance, time — is never cut off by its category, in a
1184 px desktop list or in the story stage's 439 px panel. It is a container
query on the row (`container: event-row`), not a viewport switch point, and
`30rem` is the one container threshold this guide names
(`TS-WEB-0017-A4`, `A43`).

**In the explain module's calendar picture the meta takes two lines** (owner's
decision of 2026-10-13). That picture (`StageCalendar`, state 3 of the explain
module) draws three rows in a 192–352 px square, where even the glyph form
leaves "Wolgast · 19 km · 16:00" no room (52 + 16 + 157 + 16 + 24 = 265 px).
There the place stands on the first meta line and distance and time on the
second, and nothing is cut off. A list row keeps its one 76 px line
(`TS-WEB-0017-A43`).

### Event-status badge

A status is not a category. A row may carry one status badge in addition to
its category badge, never instead of it.

| Status | Fill | Text | Ratio |
| --- | --- | --- | --- |
| `neu` | `lime-500` | `ink` | 12.42:1 |
| `verschoben` | `paper` | `ink` | 20.17:1 |
| `abgesagt` | `#B02A1C` (error) | `paper` | 6.31:1 |

On a `paper` ground the `verschoben` badge takes a 1 px `line` hairline —
the only way a paper badge has an edge, and one of the four named border
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
- **On a photo surface** (`/ueber-uns`'s quote band, `DEC-0162` §1) the quote
  takes the story stage's treatment — a `lime-500` quotation mark, the quote at
  sub-head size / 700 — role and organisation in `lime-300`, and no hairlines:
  the reading band is its ground.

### Contact section

One contact section exists for the whole site, and it looks the same
everywhere. There is no contact form.

- **Ground `lime-100`, fixed**, on every page and in every context. See the
  rhythm exception below.
- Portrait top left: `ratio-square`, clipped to radius 999, 96 px. This is
  an avatar at the logo's radius, not a photo surface — the
  `ratio-portrait` 4:5 rule governs the editorial portrait on `/ueber-uns`,
  not this one.
- Beside it the section head and one line: the person's name in bold, then
  the `Lead` naming the channels in `muted`.
- **Two buttons**, pills at `height-button` (56 px), a leading 24 px icon and
  the bold title, nothing else — no sub-label, no trailing arrow. Video
  appointment takes the **filled** treatment (`ink` ground, `paper` title,
  `lime-500` icon); WhatsApp is **outlined** (`paper` ground, `ink` title, a
  2 px `ink` border, because `paper` alone does not stand off `lime-100`,
  TS-WEB-0017-A29). Side by side from `xl`, full width and stacked below.
- **Filled is a weight, not a conversion rank.** The first row is
  `data-cta="secondary"` — on every page, including the one whose primary
  conversion is a booking. `TS-WEB-0006 D3` allows exactly one
  `data-cta="primary"` per page and the contact section is never it
  (decision 2, 2026-09-23); a page that reaches the section already spent
  its primary above. The ink ground says "start here among these four
  channels", which is a reading order inside one component, and the earlier
  wording "the first row is the primary treatment" was read as the marker
  and is corrected.
- **Phone and mail** below the buttons as one small row: no fill, no
  hairline, a 24 px `phone`/`mail` icon and the number or address in mono at
  meta size, `ink`. 44 px, the whole item is the target; it wraps on the
  phone.
- From `xl` the head takes columns 1–5 and the actions 6–12, one row.
- Audience addressing runs through the kicker and the copy. **Never through
  the ground** — that is what makes the section recognisable.

### Explain module

The three-step component. Used on `/mitmachen` for each of the three
publishing paths, and on `/` for **one** of them — the WhatsApp path, in
whichever of the three block positions the entry trait gives it
(`TS-WEB-0019 D3a`, `DEC-0109`).

This sentence read *"and reused unchanged on `/`"* until 2026-09-25, and both
halves were wrong. Not **unchanged**: on `/` the component renders one path, not
three. Not for all three: the `embed` and `provenance` blocks on `/` stay plain
scenes, because a scene names a job and this module explains a path — and "who
built this" has no three steps, so forcing the component onto it would mint three
invented ones.

**Where it stands, on each page** (`DEC-0110`):

- **On `/` it stands inside a scene** — the scene's opener above it, the block's
  one concrete instance (the live event row) below it, the module in between as
  that scene's mechanism. It does not stand *where* a scene stood; the scene is
  still there and the module is its middle. So `/` carries three scene blocks,
  one of which contains a module, and the component gains **no** opener line and
  **no** instance slot of its own.
- **On `/mitmachen` it stands bare** — the hero is the WhatsApp scene and carries
  the opener and the instance for the page's one job, so the three path blocks
  are modules and nothing wraps them.
- The rule behind both: a scene wraps a module only where the module **is** the
  job introduction. Where another block already introduces the job, the module is
  a step detail.
- The block carries **one** CTA either way, and it is the module's own. Wrapping
  adds no second one.

- **The calendar state** draws three live event rows in a box that is at
  least square and grows where the rows need it, so no row is cut off. Their
  meta takes two lines, the place and then distance and time, so a long place
  is never cut off either (*Event row*, owner's decisions of 2026-10-13,
  `TS-WEB-0017-A43`, `A44`).
- **Ordinal** at mono 48 px / 800 `ink`, with the module **title** at card
  title size beside it.
- **Three step lines**, each a numbered disc plus two lines: the bold core
  (18 px / 700) and the normal detail (15 px / 400). **Each line is written
  to a single line at 390 px, and it is never cut off.** The length is a
  target the copy is written to (CG-025), not a clamp. **Readability comes
  before a fixed height** (owner, 2026-10-12): the copy is shortened or made
  equally long first; where every step genuinely needs two lines, the fixed
  height is two lines for all three. A line that is longer wraps, and the
  module reserves the height of its longest step so a change of step moves
  nothing. Until 2026-10-12 the lines were `text-overflow: ellipsis`;
  the owner's review rejects that, because a module that explains cannot hide
  its explanation behind "…" (`DEC-0154`). The render followed on 2026-10-13
  (`DEC-0161`), and `TS-WEB-0022-A20` now fails an ellipsis, a line clamp or
  clipped text at 390 and 1280 px. The active step's disc is `lime-500` with `ink`;
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
side, so there is a **graphic stage**: one box at **at least**
`ratio-square`, holding three states, the next cropped in at the trailing
edge so the stage reads as something that continues. **The square is a
minimum** (owner's decision of 2026-10-13, `DEC-0153` amendment 3): a state
whose content needs more height — the calendar state's three rows with
two-line titles and the stacked meta — grows the box, and the other states
stretch to it, so the tallest state sets the height for all three. That
height is reserved before paint (the calendar reserves its three rows), so
the box never changes size after it, and a state change cannot shift the
page. No row of the calendar is ever cut off, and it always shows three
(`TS-WEB-0017-A44`). From `lg` the same holds per column: each graphic is at
least square and the tallest sets the row. The three step lines sit beneath it. **The module
plus its three step lines fit one phone screen** — one viewport height at
the phone breakpoint. If they do not, the copy is too long and the build
reports it; the answer is shorter copy, then a taller fixed height, never a
truncated line. The module
reserves the height of its tallest step and does not grow when the step
changes.

**The stage swipes, and it has two arrows** (owner's review 2026-10-12,
`DEC-0161`). It is a horizontal scroll-snap container: the reader swipes from
state to state, and a swipe that settles on a state selects that step, so the
step lines and the stage always show the same one. Two arrow buttons sit over
its edges — real buttons with a name, 44 px, paper with an `ink` glyph and a
`border` ring so they read on every state's ground, `aria-disabled` at either
end rather than vanishing under focus. A swipe or an arrow is handwork and
stops the auto-advance for good. The advance and the step lines move the stage
by the same scroll, smooth, and instant under `prefers-reduced-motion`. The
scroll container takes keyboard focus below `lg`, so the arrow keys scroll it
too. From `lg` there is no stage, so there are no arrows.

**The graphics are drawn where no photograph exists.** A state that shows an
act — the flyer photographed with the phone, the flyer arriving in the chat —
is an inline-SVG illustration in brand tokens, not a grey panel and not a
hatch: no lettering, no place, and **no messenger's logo or trademark** (the
chat is ours, under our mark). An illustration is honest by its form: it does
not pretend to be a photograph, so it carries no placeholder badge.

**Every state of every path has its graphic, and no explain stage ships a
placeholder panel** (owner's review 2026-10-27, issue #88, `DEC-0174`). A grey
`media-frame`, a hatch or an empty box in a stage is a defect in production,
not a state: the reader sees a step without its picture. The calendar path's
first state is a date entered in your own calendar, as usual — a window with a
week grid, a few dates in it and the new one being entered; the website path's
first state is the dates kept on your own website, as usual — a browser window
with the site's list of dates and the next one being typed. The registration
state shows the same drawing in its diagonal slot, so the reader sees *that*
source being registered. A drawn calendar or website is **nobody's product**:
no logo (no Google mark), no product colours, no lettering. The chat state
carries **no header** — the paper bar with the mark and the brand name stood
white on the module's light ground and read as a stray strip (issue #89); the
bubbles alone say "a chat". `TS-WEB-0022-A22` fails a stage graphic that is
empty or marked as a placeholder, on every route that renders the module.

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
- **It starts on intersection, never on page load, and only when at least
  three quarters of the module are in the viewport** — an
  `IntersectionObserver` on the module element at `threshold: 0.75`, so the
  three quarters are three quarters of **the module's own height** and not of
  the viewport's (owner's answers to `Q-0081` and `Q-0083`, 2026-09-25, both
  amended into `DEC-0105 §6`). An advance keyed to load has finished cycling
  before the reader arrives, and a stage half off-screen animates where nobody
  is looking. The fraction is what makes the rule reachable at all on a short
  phone: the module is 630–690 px at 360 px width, so *"the whole module"*
  could not fit `TS-WEB-0006 D3`'s 360 × 640 fold viewport, while three
  quarters fit at both heights. **State 1 gets a full dwell before the first
  advance**, so a reader arriving mid-scroll sees step 1 rather than its end.
  Measured downward into the module, the graphic stage is fully visible when
  the pass starts; read *upward* the missing quarter comes off the top and
  crops the stage, which is `Q-0084` and not settled here.
- **One pass, then it stops at state 3. There is no loop**, and scrolling
  back does not restart it — once per page view, and "once" is spent by a
  pass that started. One pass is `4 000 + 550 + 4 000 + 550` ms = **9.1 s**
  at the dwell's 4 s floor, so it is moving content that runs longer than
  five seconds beside other content: **WCAG 2.2.2 (Pause, Stop, Hide)
  applies**, and the three step lines below are the mechanism it asks for.
  **Any interaction stops the pass for good** — a pause that resumes is not
  a stop. `TS-WEB-0002 D7` and `TS-WEB-0002-A13` carry the criterion,
  because a WCAG obligation does not live in a design guide alone.
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

### Story stage

**One module for a set of stories, not one section per story** (owner's
choice of 2026-10-07, `DEC-0153`). A page that argues with several
single-category stories, like `/dein-ort`'s bakery van, council meeting and
culture, tells them as **one day** on one stage. Readers pick the hours
instead of scrolling past three full-weight sections. That answers round 4's
F-4-5: the stacked stories read as repetition, not rhythm.

The rendered reference is `v2.0/Geschichten Modul.dc.html`, variant **1a**
(*Ein Tag — Geschichten zum Durchklicken*). Static renders are in
`v2.0/assets/story-stage/`, at 1440, 820 and 390 px, plus the colour variant.
Variant 1b, three cards side by side, is rejected: it is less communicative,
and three cards with a quote each are three times the module.

| Part | Rule |
| --- | --- |
| Ground | `ink`, padded `space-12`, `space-16` from `xl`. In the page rhythm the stage is a **photo** section (it is photo-led), so it never touches the page's live-data `ink` section |
| Head | Kicker badge with `clock` (e.g. *Ein Tag im Dorf*) · section headline · lead in `lime-200` |
| Media | One per story: the photograph with the neutral scrim (*Photo surface*, the same two gradients and text shadow), or, for a story without a photograph, a `violet-500` ground with the story's glyph as a large `violet-600` watermark. Never an empty frame. The quote sits at the bottom: a `lime-500` quotation mark, the quote in 22–34 px / 700, and the speaker with a 44 px `lime-500` initials disc |
| Panel | `paper`. The hours as 44 px pills (`surface`, chosen one `ink`), the hour in mono 36–52 px beside a 44 px icon well, the story headline (sub head), the story (body), then **"Im Kalender"** with **one live date of the story's own category** (`TS-WEB-0020` D3, A14) — the label stands only with a date of the active place's surroundings, never over an empty slot (`DEC-0168`) — and "Weiter um …". **No onward action**: the link back up to the page's own dates ("Was heute bei dir los ist") is gone (owner's review 2026-10-27, issue #85, `DEC-0170`) — the stage's one control is "Weiter um …" |
| Layout | Below `xl` media above panel; from `xl` 7 : 5 side by side (*Layout Grid*). Media **below `md` a flat band at least 220 px tall** — the quote on it sets the rest (274 px at 390, 301 px at 360, measured 2026-10-13) — **from `md` at least 400 px**, from `xl` `clamp(400px, 46cqi, 640px)`. The phone band is the owner's decision of 2026-10-13 (`DEC-0153` amendment); the desktop stays as the board draws it |
| Picking | A **native radio group**: the hours are the radios' labels, arrows move the pick, `:has(:checked)` shows it. It works **without JavaScript** and needs none. "Weiter um …" is a pointer shortcut to the next hour. Nothing advances by itself: the one auto-advance in the system is the explain module's |
| Height | Every story's media and text share one grid cell, so the stage is as tall as its tallest story and a pick moves nothing. An unpicked story is `visibility: hidden`, out of the accessibility tree |
| Count | 2–4 stories, **one stage per page**. A story that is its own argument with its own evidence module, like `/dein-ort`'s radius story, stays a section of its own |

**The photograph keeps its motif above the quote.** The board's own render
showed the problem at 390 px: the quote lay over the church's foot. Each
photograph on the stage therefore uses its **stage cut**, positioned at its
**anchor** (*Crop and focal point*, below).

### Story disclosure

**An accordion of stories** (`/ueber-uns` chapter 03, `DEC-0162`, rebuilt as an
accordion by `DEC-0175` §1). It is the proof stream told as stories, not a
second stream. **Nothing reorders and nothing reflows:** the owner's review of
2026-10-27 rejected the grid in which an opened card spanned the row and moved
the others ("hüpft und springt").

| Part | Rule |
| --- | --- |
| List | **One column at every width.** Items stack with `space-2` between them; an item never changes its column, its width or its place. Opening one grows only that item, downward — no sibling moves sideways, nothing above it moves at all |
| Item | A flat block on the section ground, radius 0, no border, no shadow. Closed: `lime-100`, `ink` type. Open: `violet-500`, `paper` type. The title keeps its size in both states, so the colour is the only change |
| Head | Mono kicker (the record's source and year) and the title as an `h3`, outside the toggle, so the outline holds every title whether open or not. The title is the record's verbatim claim, never truncated, at most 8 columns wide |
| Toggle | A native `<details>`/`<summary>` per item, **no shared `name`: several may be open**. An exclusive group would close the open item above the clicked one and pull the clicked one up under the pointer. The summary names the action ("Die Geschichte" / "Schließen") beside a 44 px control well with `plus`, turned to a close mark when open — a state, no transition |
| Load | The first item is open in the server HTML; nothing changes after hydration and nothing needs JavaScript. No layout shift on load |
| Motion | None. Opening and closing are state changes, so `prefers-reduced-motion` has nothing to reduce |
| Colour | No `himbeere` tile: `himbeere` is the pulse (the owner's design showed one, `DEC-0162` §2) |
| Gaps | A position without a cleared story renders nothing — no placeholder item (`DEC-0175` §3, *Do Not*) |

### Web-calendar overlay

**A drawing of the website calendar on a photograph** (`/`'s embed scene,
issue #32, `DEC-0162` §5), so the scene says "a calendar on your website" at a
glance.

- A flat `paper` block, radius 0, no border, no shadow: a `surface-2` browser
  strip, the calendar head with `calendar-days`, three rows of a mono day
  numeral, a category coin (fill and glyph tokens) and title bars.
- It names no event, no month and no place, so it claims no date. It is
  decorative; the photograph's `alt` names the photograph and the drawing.
- Below `xl` it hangs over the photograph's lower edge, right-aligned on the
  gutter; from `xl` it lies in the photograph's lower right on the container's
  edge. It never covers the photograph's focal point.
- It lies on a `media-frame`, never on a photo surface, so no reading band or
  scrim is involved.

### Transparent overlay header

The header as built today: no ground of its own, sitting over the hero
photo.

- Mark-only logo, 40 px, clipped to radius 999. No wordmark over a photo.
- The calendar entry as a `lime-500` pill, 44 px, `calendar-days` 24 px plus
  an `ink` label (12.42:1).
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
44 px `ink` control well with a `paper` glyph (20.17:1) — the treatment the
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

- **Neutral black — final, and the only scrim there is.** Not `ink`, not
  `violet-500`, not a tint of either. A tinted scrim dyes the photograph,
  which is what made the old one read "dreckig, schlammig". This is the one
  named exception to "never pure white or black" (see *Colour*).
  **The dark-green, `ink`-tinted scrim (`rgba(23,29,13,α)`, or any
  `color-mix()` from `ink` or `violet`) is wrong everywhere**: in code, in a
  board, in a sketch, in a generated page. No artefact in this repository may
  carry it, and none may be read as a precedent for it. A design input that
  arrives with a tinted scrim is taken for its other content and its scrim is
  replaced by this ladder on import (`DEC-0151`). `pnpm check:brand` fails a
  tinted gradient in `app/`, `src/` and every board in `concept/v2.0/`
  (`TS-WEB-0017-A22`).
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
  piece of type on a photo surface with **no fill of its own** — display,
  lead, the `quiet` button's label — carries:

```css
text-shadow: 0 1px 2px var(--color-scrim-45), 0 2px 10px var(--color-scrim-30);
```

  Two stops: a tight one that gives each glyph an edge where it crosses a
  detail, and a wide, faint one that lifts the whole block off a busy
  surface. It is soft by construction — no offset beyond 2 px, no stop above
  0.45 — because a hard shadow is a second design element and this one is
  meant to be invisible until you cover it up. It exists **only** on a photo
  surface, and only on type with no fill of its own there — a filled button
  (`primary-light`, `primary-dark`, `pulse`, `secondary`) carries none,
  because its own opaque background already gives the label its contrast,
  and neither does the search field's input text or placeholder: `.input`'s
  own background is transparent, but it sits inside `.field`'s opaque paper
  pill, which is the fill the design system means (DEC-0147). Type on any
  flat ground carries no shadow at all. PR **#464** gave
  the whole declaration a name of its own, `shadow.textOnPhoto`, and **2.8.1**
  ships it, so the component may read one token instead of composing two scrim
  steps. Read in the production stylesheet on 2026-09-25:
  `--shadow-text-on-photo: 0 1px 2px var(--color-scrim-45), 0 2px 10px var(--color-scrim-30)`.

- **It is still a token, and never a literal.** `color.scrim.*` is an alpha
  ladder in `@schafe-vorm-fenster/brand-design`; `TS-WEB-0017 D3` and
  `TS-WEB-0017-A5` reject an `rgba(…)` at a call site whatever its colour. The
  ladder this treatment needs is `0 · .30 · .35 · .38 · .45 · .72`. **2.8.0**
  carried `0 · .16 · .38 · .72 · .96` **derived from `ink`,
  `rgba(23,29,13,α)`** — the pre-decision shape. PR **#464** corrected it to
  `rgba(0,0,0,α)` at `0 · .30 · .35 · .38 · .45 · .72` and added
  `shadow.textOnPhoto`; **2.8.1** ships both and the pin moved onto it on
  2026-09-25. Read in the production stylesheet: `--color-scrim-72:
  #000000b8`, which is `rgba(0,0,0,0.72)` — neutral, with the `.16` and `.96`
  stops retired.

- **What the site renders: the ladder, and nothing else.** The
  `photo-surface` rewrite is done (`DEC-0116`).
  `src/components/photo-surface/photo-surface.module.css` composes the two
  gradients above from `var(--color-scrim-*)`, the `ink` and `violet` tone
  variants and the content-anchored 0.82 → 0.96 scrim are gone, and
  `pnpm check:contrast` reads the stops and fails one above 0.72. The
  `gradient` prop that once selected a tone was removed with `DEC-0151`, so no
  call site can ask for a tinted scrim again.

#### The ladder is fixed, and the motif carries the rest

**The ladder above is the rule — authored, not derived from any image**
(decision 5 as corrected by `DEC-0105` §1, 2026-09-25). The floors it is
written to are `NFR-WEB-0058` and `NFR-WEB-0059`:

> The composite of photograph **plus** scrim clears **4.5:1 behind body text**
> and **3:1 behind display type**, with the scrim at the **fixed** stop the
> ladder gives for that position and never above the `0.72` ceiling.

**The per-photograph measurement is withdrawn.** This section used to require
contrast to be measured against the actual photograph, per hero, and to
verify it by a `check:contrast` hero row that composited two gradients over
every rendition, sampled two text boxes and took the worst pixel. Nothing
performed it, there was no acceptance criterion behind it, and it is not
practical: the photographs are not chosen yet and the cost recurs on every
build. A requirement whose meter does not measure what it says reads as
covered, which is worse than a gap that admits it (`DEC-0105` §1).

**So the photograph's half of the pair is answered by the motif rules, not by
a number.** The `0.72` ceiling is the constraint on the scrim and *Crop and
focal point* below is the constraint on the picture: the focal point at or
above 40 % for a sky-heavy motif, and **"a photograph that only works when the
scrim covers its subject is the wrong photograph."** That sentence is
load-bearing rather than an aside — it is how a motif that would fail the
floor is excluded, and the remedy is a different crop or a different picture,
never a darker scrim, because the ceiling does not move.

> **What is checked, and what is a judgement.** `pnpm check:contrast` measures
> the **token set** (`TS-WEB-0002-A3`), in all four themes, before any page
> composes it; the fixed ladder is what puts the scrim half of the pair inside
> that layer. It does not open an image. The motif half is a judgement at the
> editorial gate, declared as one, and `DEM-0027` is where the measured ratios
> for colour world 3c are asked for. The static assertion of the `0.72`
> ceiling is the hero row of `check:contrast`, and the ban on a tinted scrim
> is `TS-WEB-0017-A22` in `check:brand`.

**Focal point and the reading band** (`DEC-0153`). A centred focal point is
right for a picture nobody writes on. It is wrong for a box with a reading band
in its lower part, like the story stage or a hero: there the band covers
whatever sits below 38 %, and a village motif under a big sky sits at 50–65 %.
So a photograph used under text declares two points:

- `focal`: where the motif is, in per cent of the photograph;
- `anchor`: where that point has to land in the box, in per cent, with
  `y ≤ 38`. The stage uses `{x: 50, y: 30}`.

`pnpm images:generate` then cuts a **stage rendition** (5:4) from the
original. It takes the largest window that puts the focal point exactly at
the anchor, zooming in only as far as that takes and never below the box's
pixel width. It reports where the point landed if the original is too small.
The component sets `background-position` to the anchor, and because a
`background-position` percentage aligns the same percentage of picture and
box, the focal point lands there in any box ratio. `TS-WEB-0020-A17` holds the
inventory to it. The motif rule below is unchanged: a photograph that only
works when the scrim covers its subject is still the wrong photograph.

**Crop and focal point.** The photo is `cover` with `object-position` taken
from the motif's declared focal point, never `center` by default. Village
photographs are sky-heavy, and a centred crop parks the motif in the
bottom third, exactly where the scrim is densest — the result is a dark
smear with a horizon above it. For a sky-heavy motif the focal point sits
at or above 40 % so the sky crops away and the motif lands above the
scrim's opaque band. A photograph that only works when the scrim covers its
subject is the wrong photograph.

**A place shows its own photograph** (owner's review 2026-10-12, `DEC-0167`).
The stage of a page with a chosen place (`/dein-ort?ort=…`, the home stage with
a place) shows a photograph **of that place**, never one fixed photograph for
every place. The photograph is the place's Wikidata image, read through geo-api
and delivered by assets-api, and it is shown only with a stated licence (and an
author, where the licence asks for attribution). It arrives after the page has
painted, as a layer over the stage's own photograph with the same scrim, so the
stage's geometry never changes; the page's own photograph stays the LCP. Its
**credit stands at the photograph** as a © control (`photo-credit`, issue #78,
`DEC-0168`): a 40 px round well with Lucide `copyright` in `paper` on
`scrim-45`, in the photograph's top-right corner — the corner, well and scrim
of the AI-edited mark, which stands down while a place photograph covers the
stage. Hover, keyboard focus and a tap open a `paper` card holding the full
credit — title linked to the source, author, licence, source — Escape closes
it; never a `title` tooltip, never standing text on the photograph.

**Every photo credit is that © control** (issue #101, `DEC-0168`). Wherever a
photograph carries a credit at the image — a place photograph, an inventory
image whose rights holder asks for one (`credit`), on a `photo-surface` or in
a `media-frame` — the credit is the `photo-credit` control in the picture's
top-right corner, its panel holding the full text ("Foto: openTransfer.de").
No credit is ever visible running text on or under a photograph, and never a
caption; where the AI-edited mark holds the corner, the control stands left of
it in the same row. No focal
point exists for these photographs, so they take the surface's default
`50% 40%`; the anchored crop below needs a declared focal point and does not
apply.

**The stage and the page name one place** (`DEC-0168`, issue #80). Without a
chosen place, a page whose modules speak about the configured example place
(Schlatkow) shows the example's photograph on its stage, unless its own
photograph depicts that place (the inventory's `place`). While a place's
photograph loads, the stage's own photograph is labelled "Beispielfoto": a
headline naming one place never stands over an unlabelled photograph of
another, for any length of time.

**A place without a usable photograph** (`Q-0089`, resolved by `DEC-0167`)
keeps the page's own photograph, and the same corner says honestly that it is
an example and not this place ("Beispielfoto · von {Ort} haben wir noch kein
Foto"). Never the photograph of a different place presented as this one, and
never a blank stage.

**Motif per page.** `/` shows villages **with activity** — a street, a
building in use, people. `/dein-kalender` shows venues — culture houses,
Gemeindehäuser, halls, the places events happen in. `/mitmachen` shows the
act itself: a flyer, a phone, a hand. Never dark, never sad, never
empty-at-dusk. The full imagery rules live in `brand-identity/imagery.md`
in `go-to-market-os`; this is the website's cut of them.

**An AI-edited photograph is a real photograph** (`Q-0092`, `DEC-0161`): a
real shot whose light, colour, crop or details were edited with an AI tool,
showing the same event at the same place. It takes `provenance: ai-edited`,
names its original in `source` and its edited master in `master`, and carries
**no** placeholder badge, because it depicts what the copy claims. The editing
is named on `/rechtliches` (`content/legal/image-credits.md`) and in
`data-provenance="ai-edited"` on the surface. An image a model made from a
prompt is not this; it is `generated`.

**An AI-edited photograph carries the sparkles mark** (`DEC-0165`, the owner's
decision of 2026-10-14, superseding `DEC-0161`'s "no visible badge"). Every
image with `provenance: ai-edited`, on a photo surface or in a media frame,
shows `ai-edited-mark` and no other image does:

- **Form.** A 40 px round well (the icon-well size) filled with the
  translucent `scrim-45`, carrying Lucide `sparkles` at 24 px in `paper`.
  Tokens only; the photograph shows through the well.
- **Place.** The photograph's **top-right** corner, `space-4` in from the
  edge; on a hero it sits below the transparent header
  (`--site-header-height` + `space-3`). Chosen by measurement: it is the one
  corner clear of the header and of the text stack at 390 and 1280 px by the
  widest margin, and the hero's reserved band keeps the stack out of it.
- **Contrast.** `paper` over the 0.45 well over a white pixel is 3.2 : 1, so
  the glyph clears the 3 : 1 non-text floor on any photograph;
  `TS-WEB-0007-A17` measures it on the rendered pixels.
- **Text alternative.** The mark is a non-interactive `role="img"` named
  "Mit KI bearbeitet" / "Edited with AI" (`aria-label` and `title`), and the
  image's `alt` ends with the same sentence in the page's language.

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

### Embedded calendar

The real Portalize widget on `/dein-kalender` and `/deine-region`
(`embed-frame`, `DEC-0173`). It renders into an open shadow root that the
page never styles directly. The only way in is the widget's own
`--portalize-*` custom properties on the mount.

- **Light ground.** The widget stands in a `violet-100` box inside the
  `violet-500` section and never on `violet-500` itself. The box is its
  ground for every pair below.
- **Every exposed colour is a token, and so is the mount's `color`.** Any
  property the page leaves unset falls back to `inherit`, and what the
  mount inherits from the section is `paper`. That is how the 2026-10-27
  review found the widget's titles at `paper` on `violet-100` (1.42:1) and
  on its own pale-pink cards (1.06:1), with its orange link at 3.29:1.
  Text takes `ink` (14.18:1) or `text-2` (7.21:1). Links and accents take
  `violet-500` (5.50:1). Control borders take `ink`. A card inside the
  widget takes `paper`, never the widget's own tint.
- **No organizer's showcase.** The own-events row and highlight stay off.
  The embedded licence belongs to one organizer, and the section introduces
  a place's calendar (`DEC-0173` §2).
- **Measured where it renders.** `check:contrast` sees tokens but not the
  widget. TS-WEB-0024-A20 reads every text in the rendered shadow root
  against its composited ground and holds it to 4.5:1, or 3:1 for large
  text and control borders.
### Proof stream

**A page's customer proof, as voices** (owner's review of 2026-10-27, #91,
`DEC-0172` §1). It replaces the grey feature card over hairline rows that the
polish brief's G-7 had left: a card floating on a `lime-100` ground, in
grey-green, over rows set in a hierarchy of their own. The language is
`/ueber-uns`'s (`DEC-0162`): chapter 02's inline proof and the quote card.

| Part | Rule |
| --- | --- |
| Item | A flat element **on the section's own ground**: no fill, radius 0, no shadow, a hairline above it (`line`, or `border.hairlineOnLime` on `lime-100`). Every item of a stream has the same structure |
| Order | The claim first, then the byline — the quote card's order, so a claim and a cited quote read alike |
| Claim | The record's claim verbatim. The first item (`feature`) at sub-head size / 700, at most 8 columns; the others (`compact`) at card size / 700. No quotation marks: a claim without a cited source is not a quote (*Quote card*, `DEC-0143` §3) |
| Byline | A 40 px **initials well** — the icon well's size and fill (`surface` on `lime-100`, `lime-100` on `paper`), mono 15 / 700 `ink`, hidden from assistive technology — beside the name in mono 15 / 700 and the role or place in 15 / 400 in the ground's meta colour on the next line. A cleared portrait or logo takes the well's place; no proof record carries one for a voice today |
| Layout | One column below `xl`. From `xl` the feature item keeps the whole row and the others stand side by side, 6 + 6 |
| Not | A filled card, a badge repeating the source, an image slot without a cleared image (G-9), a control-sized pill |

### Comparison

**Today against with your calendar, one pair per row** (#94, `DEC-0172` §2).
The two halves are two flat fields that butt against each other; a gap of
`space-2` separates the pairs on the section's ground.

| Part | Rule |
| --- | --- |
| Today | `archive ground`, the sentence in `text-2`, the label in `archive ink` — the old world (*Archive*); nothing positive on it |
| With your calendar | `lime-100`, the sentence in `ink`, the label in `lime-800` — the fresh ground for solution content (*Section grounds*) |
| Label | Mono 15 / 700, uppercase, **above** its sentence (the *Desktop Raster* board), with a colon for assistive technology only, so the pair reads aloud as one statement |
| Layout | Below `xl` the halves of a pair stack, today on top; from `xl` 6 + 6 in one row (*Placement rules*) |
| Not | A hairline text table, a checkmark or cross column, a radius, a product name in a label (`TS-WEB-0024` D4) |

### Source-to-target flow

**Where something comes from, and the one place it lands** — `/dein-kalender`'s
benefit band (#96, `DEC-0172` §3). Nothing in it is a control, so nothing in it
is drawn as one.

| Part | Rule |
| --- | --- |
| Ground | The `lime-500` highlight band, full-bleed (*Section grounds*) |
| Captions | One mono label over each side, in the ground's text colour (`lime-900`; `muted` inside the target field), saying which side is the way in and which the landing place |
| Sources | A plain list: a 24 px glyph and the source's name in body 18 / 700 `ink`, a wrapping row below `xl` and a column from it. No fill, no pill, no border |
| Arrow | `arrow-right` 32 px in `ink`, decorative (`aria-hidden`). Turned to point down while the parts stack |
| Target | One flat **square** `paper` field (radius 0 — a place, not a button; a fill that is not its ground), a 32 px glyph and the target's name at sub-head size / 800 |
| Layout | Below `xl` sources, arrow and target stack; from `xl` one row, sources · arrow · target. The benefit sentence closes the figure as its caption |
| Copy | The sources are other people's channels and never addressed to the reader; the reader's own website is the target and appears once (`SRC-0017` CG-040, `DEC-0172` §3) |

### Trust block

**What happens to the data, and who runs the service** (`TS-WEB-0024` D10,
`DEC-0172` §4). On `/dein-kalender` it stands on `violet-500`, the provenance
ground, so it never runs on from the proof section before it as one ground.
Each subject is a mono label in the ground's label colour over its paragraph,
under a hairline in the same colour; one column below `xl`, side by side from
it. No icons and no check marks (polish brief page 6, item 5).

## Page chrome revised 2026-10-12

Three elements the owner redesigned in the review of 2026-10-12. The images are
the reference for **layout and hierarchy**; where they differ from this guide
(radius, borders, icon sizes), this guide stands and the difference is an open
point, as with the board of *Layout Grid*. The squares in the images are
stand-ins for icons: the set is Lucide, 24 px, in a 40 px icon well (*Icons*).
Reference files are in `plan/reviews/2026-10-12/`.

### Context band

The hand-off for readers who came for something else. It is quieter than the
page's main content, and it must not look like a plain list.

- Heading *"Heute mit einem anderen Anliegen hier?"*, a mono kicker *"Auch
  interessant"* to its right on desktop and below it on the phone.
- Three **cards**, one per other job. Each card: a 40 px `lime-100` icon well
  with a `lime-800` Lucide glyph on the left, a bold title and one line
  beneath, a 44 px `ink` disc with a `lime-500` arrow on the right. One card
  per row on the phone, two per row from `lg`, three in one row from `xl`.
  The card fill is never the ground: `paper` cards on the band's `surface`,
  `surface` cards where the band is merged into a `paper` closing block.
- The cards are links; the whole card is the target (44 px minimum).
- The band is the **last block in `main`**, after the page's own closing
  block, except where that block is the closing search on `ink` (*Page
  Rhythm*, `DEC-0174`).
- **A whole-card link is a control** and takes radius 999, so the cards are
  pills (`DEC-0156`, answering `Q-0087`). A card that only contains a link
  stays at radius 0.
- On the phone the band is the full-width `surface` section; the rounded
  field in the phone frame is not a panel inside it (no padded card inside a
  padded section).

Reference: `Design - Kontextband Section - Desktop/Tablet/Mobile.png`; as-is:
`Ist - Kontextband.png`.

### Contact section, tidied

Same content and same priority (video appointment first, WhatsApp second), far
less on the field. **Built 2026-10-13 (issue #41)**; *Contact section* above
describes the result.

- Desktop: **one row** on `lime-100`. Avatar (96 px, radius 999), the title
  *"Direkter Kontakt"*, the name in bold with one description line beside it;
  then two pill buttons, *"Videotermin buchen"* (`ink` fill) and *"Per WhatsApp
  schreiben"* (`paper` fill); then phone and mail as one small row of mono
  text with their icons.
- Phone: stacked in the same order, the two buttons full width.
- Dropped from the as-is state: the sub-label under each action and the
  hairlines between rows. The footnote *"Öffnet den Buchungskalender bei
  Google."* is a data-protection notice (TS-WEB-0014) and **stays**, as one
  centred `meta` line under the buttons, until `Q-0088` is decided.
- Deviation from the image: the white WhatsApp pill takes a 2 px `ink` border
  (a fill is never its ground, TS-WEB-0017-A29).
- Both actions stay `data-cta="secondary"` (`TS-WEB-0006 D3`): the dark fill is a
  visual weight, never a conversion rank.

Reference: `Design - Kontakt Section - Desktop/Mobile.png`; as-is:
`Ist - Kontakt Desktop/Smartphone.png`.

### Site footer

- Ground **neutral black** (`ink`, see *Open decisions* 6).
- Row one: the logo (mark with the two-line wordmark, in `paper`) on the left,
  the language switch on the right as a **segmented control** (*Deutsch |
  English*, the active language filled `lime-500` with `ink` text, the other
  `paper` on an `ink`-lifted track — `ink` with 13 % `paper`, 15.52:1 for the
  `paper` label). It replaces *"Read this page in English: ENGLISH"*. Both
  segments are links to the same page in their language; the current one
  carries `aria-current="page"` (`TS-WEB-0001 D5`, `DEC-0158`).
- A hairline (`paper` at 22 % over `ink`), then **Presse · Impressum · Datenschutz ·
  Barrierefreiheit** in `paper`, bold (the press link first, to `/ueber-uns/archiv`, `DEC-0166`; never in the header), no underline at rest (the weight and the
  link row are the cue; hover adds the underline), a visible focus ring in
  `focus-dark` (`lime-400`, 13.66:1 on `ink`); at the right (desktop, from
  `xl`) or beneath (phone) *"© {year} {legal name}"* in `line` (14.19:1). Not
  `muted`: on `ink` it measures 3.54:1 (`DEC-0158` §2). The legal name is the
  imprint's, never written into code (`TS-WEB-0011 D4`).
- Phone: the same pieces stacked, the switch under the logo; from `md` logo
  and switch share row one.

Reference: `Design - Footer Section - Desktop/Mobile.png`; as-is:
`Ist - Footer Mobile.png`, `Ist - Kontakt und Footer Mobile.png`.

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
- **The page's own closing block comes before the context band, and the band
  is the last block in `main`** (owner's review 2026-10-27, issue #93,
  `DEC-0174`). The closing block is the page's conversion, so it belongs to
  the page's argument; the band is the hand-off for a reader who came for
  something else, and a conversion standing after it loses its context. Only
  the contact section and the footer follow the band. **The one exception is
  the closing search block on `ink`** (`/`): a search is not a conversion
  (`TS-WEB-0019` D2), and the rule above keeps the second `ink` section last.
  `TS-WEB-0006-A6` checks the order on every route.
- **The band is the page's only hand-off to another job.** No sentence in the
  page's own blocks repeats it — no *"if you want X instead, that is another
  offering: →"* line pointing at a page the band already offers (issue #92,
  `CG-045`, `TS-WEB-0006-A20`).

### Module rules

The owner's review of 2026-10-27 (`DEC-0170`, issues #84 and #86). They hold on
every page and are checked on every route (`e2e/module-rules.spec.ts`).

- **No proof quote under a live list.** A quote set as text under a list of
  dates reads as a caption of the dates. A story whose example *is* a live list
  (`value-story` with a live module as its example) carries no testimonial;
  the component does not render one there.
- **No two quotes in a row.** A section that ends on a quote is not followed by
  a section that carries one. The story stage opens on a quote, so whatever
  stands right before it does not end on one.
- **One module per job.** A job is said once on a page: no second module, and no
  closing block, repeats a module's instructions or its action. Where the
  page's conversion has a module of its own — `/dein-ort`'s homescreen
  instructions — that module **is** the closing block: heading, content, one
  control, the reassurance under it.
- **The context band comes after the page's own closing module.** Where the
  closing block is such a module, the band of the other three jobs follows it
  and is the last block in `main` (`/dein-ort`, `TS-WEB-0006` D2). Since
  `DEC-0174` §4 that holds for **every** closing block, a repeated link
  included (*Rules* above, issue #93); only the closing search on `ink` on `/`
  stays last.
- **The homescreen instructions take one pattern for both platforms.** A mono
  platform label over an open numbered list, iPhone then Android, side by side
  from `xl`. Neither platform hides behind a `details` disclosure: a bare
  native `summary` beside an open list reads as a different control and shows
  the browser's focus box.

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
| `ratio-hero` | **8:9** mobile, **21:9** from 900 px, **none from `xl`**: there the hero takes the height under *Layout Grid* | The hero photo surface |
| `ratio-feature` | **7:5** | Event of the week, path sections, any photo carrying a headline |
| `ratio-proof` | **5:2** | Proof and press images inside a stream card |
| `ratio-map` | **16:9** | County map, place map |
| `ratio-portrait` | **4:5** | People, team |
| `ratio-square` | **1:1** | Logo mark, actor avatar, contact avatar, partner logo well, explain-module stage |

Declared as `aspect-ratio` on the media element, never as a fixed pixel
height — the ratio survives every viewport. The photograph is `cover` and
centred on its focal point; the gradient scrim is part of the same box, so
it scales with it.

**One exception: the hero from `xl`.** At 21:9 a 1440 px hero would be
617 px tall, and at 1920 px it would be 823 px, deeper than the viewport. From `xl` the
hero therefore takes `min(80vh, 680px)` on `/` and `min(70vh, 560px)` on
content pages (`DEC-0150`). Both are declared in CSS before paint, so the box
is reserved exactly like a ratio, and nothing pushes the page down.

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
display size. An explain module's step lines are **not** clamped: they are
written to one line each at 390 px (CG-025) and wrap if they are longer,
inside the height the module reserves for its longest step.

### Reserved text space

A live list reserves its rows at the two-line row height while it loads
(`DEC-0163`). Above the fold it keeps that reserve when its answer is shorter,
so nothing below moves. **The nearby list gives it back** (owner's review
2026-10-27, issue #83): it stands below the fold, and a kept reserve under two
rows read as a gap of three empty rows before its calendar link. It reserves
for the skeleton only, and it first fills its five rows with the dates after
this week where the week has fewer (`TS-WEB-0008 D3`); its heading then names
the window its rows span.

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
| Edited with an AI tool (`ai-edited-mark`) | `sparkles` |
| Photo credit (`photo-credit`, every credited photograph) | `copyright` |

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

**And it runs once.** It begins when three quarters of the module are in the
viewport — three quarters of the module's own height, an
`IntersectionObserver` threshold of `0.75` on the module element, never on
page load — gives state 1 a full dwell first, and stops at state 3 after a
single 9.1 s pass. It does not loop, it does not restart on the way back up,
and any interaction ends it for good. That is `DEC-0105 §6` as amended twice
on 2026-09-25, and it is also what makes **WCAG 2.2.2** satisfiable: the step
lines are the mechanism that stops the movement (`TS-WEB-0002 D7`).

There is no second exception, and nothing below `lg` may be read as one: a
skeleton still does not pulse, and a looping animation anywhere else is
still forbidden.

## Accessibility

- Body text at 4.5:1 minimum (`NFR-WEB-0058`), display type and non-text
  contrast at 3:1 (`NFR-WEB-0059`), against the composite of photo plus scrim
  — not against the scrim alone. The scrim stop is the **fixed** one the
  ladder gives for that position, ceiling `0.72`; the per-photograph
  measurement is withdrawn (`DEC-0105` §1) and the motif is carried by the
  crop and focal-point rules instead (see *Photo surface*). `check:contrast`
  reaches the token layer; the ceiling assertion is **owed** with the
  component rewrite, and is named there.
- Focus ring: 3 px `violet-500`, 2 px offset, on every interactive element.
- A link to another origin opens a new tab and says so — the `external-link`
  glyph for the eye, a hidden note joined by `aria-describedby` for the ear,
  never inside the label (see *Links*, `DEC-0169`).
- What looks like a control is one (*Do Not*, `TS-WEB-0002-A14`): a reader
  who taps a pill and nothing happens has been misled.
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
  four named exceptions.
- No radius between 0 and 999.
- No third typeface, no weight below 400 or between 400 and 700.
- No photo section adjacent to another photo section.
- No stock photography. An honest hatched placeholder is better and doubles
  as a conversion.
- **No placeholder for a missing proof.** The hatch is for a missing
  *photograph* only. A proof position without a cleared proof renders nothing —
  no hatch, no flat panel, no badge, no sentence naming the gap ("Beleg
  fehlt"), and nothing backfills it (`DEC-0175` §3, owner's review 2026-10-27;
  `TS-WEB-0007-A19` walks every route for it).
- No colour outside the scales above; no colour literal at a call site, a
  scrim included — the ladder is a token like everything else.
- No grey-green ground under positive content.
- No type below 15 px, badges and tags included.
- No text shadow **off** a photo surface; the one on it is specified under
  *Photo surface* and has no other use.
- No blur outside the header primitive, and no second animation beyond the
  explain module's auto-advance below `lg`.
- No search field on a light ground.
- No readable content outside the 1200 px container, and no photograph or
  colour surface inside it. No hero text centred over the photograph.
- No side-by-side columns below `xl`, outside `explain-module`.
- No element shaped and sized like a button that is not a control: a pill
  36 px or taller with a fill or a 2 px border is a link, a button or a form
  control, or it is a picture of one inside an `aria-hidden` illustration
  (`DEC-0172` §5, `TS-WEB-0002-A14`). A value the reader cannot act on is a
  30 px tag; a group of sources is a list.

## Open decisions

**None is open.** Row 7 came from the owner's review of 2026-10-12 and was decided on 2026-10-13 (`DEC-0160`); row 6 was decided on 2026-10-12; the others were taken and are written into the rules above. The three that stood here were taken on
2026-09-23 and are written into the rules above rather than kept as
options:

| # | Was | Taken as | Where it now lives |
| --- | --- | --- | --- |
| 1 | Scrim ladder, and text shadow yes/no | **Decision 5**, as corrected by **DEC-0105 §1** — the draft is binding: neutral black, multi-stop, max 0.72, soft text shadow, and a **fixed** ladder. The "measured contrast floor instead of a fixed ladder" this row used to claim is withdrawn: nothing performed the per-photograph measurement, and the crop and focal-point rules carry the motif | *Colour* (the named exception), *Photo surface* |
| 2 | Header contrast — solid wells or a blur primitive | **Decision 6** — the blur primitive, with a documented capability fallback to the solid ink well and a stated performance-budget interaction | *Transparent overlay header* |
| 3 | Category taxonomy — five token keys or six guide rows | **Decision 7** — neither: the canonical list is `classification-api`'s four ids plus the `unknown` fallback, which is what the token package already carries. Event rows keep the category, as this guide always said | *Category colours* |
| 5 | Stacked single-category stories — round 4's F-4-5 | **DEC-0153** (owner's choice of board variant 1a, 2026-10-07): one story stage instead of three sections; focal point anchored above the reading band | *Story stage*, *Photo surface* |
| 6 | **Is the `ink` ground neutral black?** | **Decided 2026-10-12, `DEC-0155`: yes.** `neutral.ink` becomes `#000000` in `brand-design` 2.9.0 (`go-to-market-os` PR #620); one value for text and ground | The pin moved to `2.9.0` on 2026-10-13 (`DEC-0160`) and the interim override in `app/styles/brand.css` is deleted; `TS-WEB-0017-A28` fails any other value |
| 7 | **The secondary action on a light ground** | **Decided 2026-10-13, `DEC-0160`: (c)** — transparent, a 2 px `ink` border, an `ink` label; the fourth named border exception | *Button*, *Spacing* (the border exceptions) |
| 4 | Content width on desktop — round 4's F-4-1, and `DEM-0042`'s container table | **DEC-0150** (owner's design input, 2026-10-07): three tiers on the six breakpoints, a 1200 px content box, full-bleed surfaces, column placements from `xl` | *Layout Grid* |

What is still **outstanding** is not a decision but work owed elsewhere, and
each one is named at the rule it belongs to:

- **Upstream: done.** PR **#464** against
  `@schafe-vorm-fenster/brand-design` carried the four measured corrections to
  what 2.8.0 shipped — the neutral-black scrim base with its full ladder plus
  `shadow.textOnPhoto`, `category.community-life.dot` and `.bare`,
  `border.hairlineOnLime`, and the `color.categoryStatus` PROVISIONAL marker
  replaced by the source that has now been read. It is merged and published as
  **2.8.1**.
- **The pin move: done, 2026-09-25.** `0.1.3 → 2.8.1`, exact as
  `stack.allow.json` requires (DEC-0044), with the two interim declarations in
  `app/styles/brand.css` deleted afterwards rather than before.
- **Done since:** the `photo-surface` rewrite onto the scrim ladder and the
  `check:contrast` hero row (`DEC-0116`). **Still owed in this repository:**
  the archive-foreground re-measurement that would move the kicker off
  `#9A6300` onto `archive.ink` (*Archive*).
- **The grid is built (`DEC-0150`)** and held by `TS-WEB-0017-A23`–`A27`.
  Still owed upstream: a 20 px space token for the tablet gutter
  (`DEM-0071`); until it ships, `app/styles/base.css` writes `1.25rem`.

The full per-role list is `specs/contracts/design-system-contract.md` §5.
