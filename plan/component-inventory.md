# Component Inventory — M2 Build Brief

Eleven page implementations, one component set. This file exists so that
M2 does not produce eleven private variants of the same header, the same
skeleton and the same proof card.

**Status:** working document of the Project Manager for M2, answering
`state/open.md` row 4 (Q-044). The design system
(`concept/website-design-system.md`, SRC-014) is **binding** and is not
re-designed here. Six components are specified there — everything else on
these pages is *derived*, and every derivation is marked `[PROPOSED]`,
reviewed at the M2 customer acceptance.

**How an M2 developer uses it:** take the per-page composition sheet
(section 4), read the page's own tactical spec for data, counts, states
and acceptance criteria, and build from the inventory names in section 2
and 3. The names are stable: a page spec says *what* stands there, this
file says *which component* it is.

## Sources

| Source | What is taken from it |
| --- | --- |
| `concept/website-design-system.md` (SRC-014) | the six specified components, colour, typography, shape, page rhythm, aspect ratios, skeletons, icons, motion, a11y — binding |
| `concept/v2.0/*.dc.html` | rendered confirmation of the same rules (Bausteine, Seitenverhältnisse, Rhythmus); no rule is read *only* from a board |
| `specs/tactical/page-composition.tactical.md` (TS-006) | block order, context band, closing CTA, one primary conversion, no self-classification |
| `specs/tactical/pages/*.tactical.md` (TS-019…TS-029) | the modules each page composes, in order |
| `concept/website-content-production.concept.md` B.2/B.3 | the 26 content types and the fragments — the naming backbone (decision D-2) |
| TS-004 D4/D8, TS-008 D1/D5, TS-009 D4/D7, TS-016 D1/D6/D10, TS-001 D5, TS-002 D5 | header/footer/anchors, live modules, fallback tiers and skeletons, lead surfaces, link facade, landmarks |
| `plan/guardrails.md` | mock rule and dummy-content rule — every missing system is a labelled mock, never a hole |

## 1 Conventions

1. **Names are kebab-case and stable.** Where a component renders one of
   the 26 content types (concept B.3), it carries that type's name —
   `hero-block` is the component for type 1 `hero`, `proof-card` for
   type 10, `context-band` for type 21. One vocabulary for content,
   schema and component (decision D-2).
2. **Radius is 0 or 999, never between.** Sections, cards, surfaces,
   frames: `0`. Anything you touch — button, chip, badge, search field,
   logo, pill: `999`.
3. **No border, no shadow, no card floating on a surface.** A hairline
   (`line`) divides rows *inside* a surface; contrast between surfaces
   does the rest.
4. **Type roles only** (Display, Place name, Section head, Sub head,
   Card title, Lead, Body, Meta, Label-mono). Nothing below 15 px, two
   weights plus 800 for display.
5. **Every asynchronous box declares its ratio or height before paint.**
   Ratio tokens: `ratio-hero` 8:9 / 21:9, `ratio-feature` 7:5,
   `ratio-proof` 5:2, `ratio-map` 16:9, `ratio-portrait` 4:5,
   `ratio-square` 1:1. Fixed heights: button 56, secondary/nested/well
   44, chip 40, badge 26 (30 with icon), event row 76, search field 56.
6. **Four states, one vocabulary** — every component that depends on
   late or external data declares all four:
   - *loading* → `skeleton` at the final geometry, no animation, ≤ 2 s;
   - *empty* → the honest, designed state (publisher invitation,
     "Foto gesucht", or the module omitted) — never a blank box;
   - *error/degraded* → tier 2 `freshness-label` ("Stand: …"), tier 3
     build-time snapshot labelled as an example, or module omitted
     (TS-009 D4, TS-008 D5). **Never** a spinner, an error sentence, a
     warning icon or a retry control in front of the visitor;
   - *mocked* → per `plan/guardrails.md`: the component renders full
     dummy data plus the `demo-data-badge`, and gets a `Mock aktiv` row
     in `state/open.md`.
7. **One motion only** (`motion-reveal`): sections rise 22 px and fade
   over 550 ms `cubic-bezier(.2,.7,.3,1)`, once, on enter, respecting
   `prefers-reduced-motion`. Skeletons do not animate — a second motion
   would break the rule.
8. **Icons are Lucide, 24 / 18 / 32 px only**, monochrome, decorative,
   always accompanied by text.
9. **Focus ring: 3 px `violet-500`, 2 px offset, on every interactive
   element.** Touch targets ≥ 44 px (TS-002 D2 adopts 2.5.5 AAA).
10. **Every internal link goes through the route facade** (`route-link`,
    TS-001 D5 / TS-004 D3a). No hard-coded `href` in any component.

## 2 The inventory

Page column uses TS ids: 19 `/` · 20 `/dein-ort` · 21 `/dein-ort/starten`
· 22 `/mitmachen` · 23 `/mitmachen/registrieren` · 24 `/dein-kalender` ·
25 `/dein-kalender/bestellen` · 26 `/deine-region` (+ `/angebot`) ·
27 `/ueber-uns` · 28 `/ueber-uns/archiv` · 29 `/rechtliches`.
"all" = all eleven, via the shared layout.

### 2.1 Specified by the design system

| # | Component | Pages | Status | What it is |
| --- | --- | --- | --- | --- |
| 1 | `button` | all | [FIXED] | five variants: primary-on-light (`ink`/`paper`), primary-on-dark (`lime-500`/`ink`), pulse (`himbeere-600`/`paper`, paid conversion only), secondary (`paper`/`ink`), quiet (transparent/`lime-800`). 56 px, padding 0 24, radius 999, 800/18 px, 24 px `arrow-right` where it leads onward |
| 2 | `search-field` | 19·20·21·23·25·26 + 404 | [FIXED] | the control: one 56 px `paper` pill, `map-pin`, placeholder in `muted`, nested 44 px submit pill with 6 px inset |
| 3 | `badge` | all | [FIXED] | label, radius 999, mono 12–13/700, padding 7 × 15, height 26 (30 with an 18 px icon = kicker). Fill/text pairs from the category table only; `lime-600`/`lime-500` always with `ink` |
| 4 | `chip` | 19·21·25·28 | [FIXED] | the tappable sibling of `badge`: ≥ 40 px, radius 999 — neighbouring places, scope items, archive type filter |
| 5 | `event-row` | 19·20·21·22·26 | [FIXED] | flat row, hairline above, 76 px: mono day 28 px + month beneath, title 21/700 clamped to two lines, meta 15 px clamped to one, category `badge` right-aligned. Never a card |
| 6 | `photo-surface` | 19·20·21·22·24·26·27 | [FIXED] | full-width section, no radius/border: photograph as first background layer with the gradient in the same declaration (transparent at 12–26 %, .82–.86 at 38–62 %, .96 bottom), ink by default, violet for the municipal path |
| 7 | `logo` | all | [FIXED] | sheep mark 38–40 px clipped to radius 999, wordmark in two lines 15/800 or the URL in mono editorially. Radius 999 per `state/open.md` row 9 (concept doc wins) |

Seven rows, six specified components — badge and chip are one section of
the design system and two components in code (decision D-3).

### 2.2 Derived — chrome and layout

| # | Component | Pages | Status |
| --- | --- | --- | --- |
| 8 | `site-header` | all | [PROPOSED] |
| 9 | `site-footer` | all | [PROPOSED] |
| 10 | `language-switch` | all (in footer) | [PROPOSED] |
| 11 | `breadcrumb-trail` | 21·23·25·26/angebot·28 | [PROPOSED] |
| 12 | `skip-link` | all | [PROPOSED] |
| 13 | `section-shell` | all | [PROPOSED] |
| 14 | `motion-reveal` | all | [PROPOSED] |
| 15 | `route-link` | all | [PROPOSED] |
| 16 | `outbound-link` | 20·22·24·25·26·28 | [PROPOSED] |
| 17 | `section-nav` | 29 | [PROPOSED] |
| 18 | `back-to-top` | 29 | [PROPOSED] |
| 19 | `media-frame` | 19·20·22·24·26·27·28 | [PROPOSED] |
| 20 | `icon` | all | [PROPOSED] |

### 2.3 Derived — argument blocks (content types B.3)

| # | Component | Content type | Pages | Status |
| --- | --- | --- | --- | --- |
| 21 | `hero-block` | 1 `hero` | all except 28·29 | [PROPOSED] |
| 22 | `scene-block` | 2 `scene` | 19 (×3) · 21 (×2) · 22 · 26 | [PROPOSED] |
| 23 | `value-story` | 3 `value-story` | 20 (×4) | [PROPOSED] |
| 24 | `objection-list` | 4 `objection-list` | 22 | [PROPOSED] |
| 25 | `publishing-path` | 5 `publishing-path` | 22 (×3) | [PROPOSED] |
| 26 | `comparison-table` | 6 `comparison` | 24 (4 rows) | [PROPOSED] |
| 27 | `offer-tier` | 7 `offer-tier` | 24 (×3) | [PROPOSED] |
| 28 | `feature-benefit` | 8 `feature-benefit` | 26 | [PROPOSED] |
| 29 | `price-tag` | — (renders the price of 6/7/8) | 24·26·27 | [PROPOSED] |
| 30 | `proof-card` | 10 `proof-card` | 19·20·22·24·26·27 | [PROPOSED] |
| 31 | `proof-stream` | container for 10/11 | 19 (5) · 22 (3) · 24 (3) · 26 (3) · 27 (7) | [PROPOSED] |
| 32 | `empty-proof-slot` | 11 `empty-proof-slot` | 27 (always) · any stream | [PROPOSED] |
| 33 | `archive-row` | 12 `archive-entry` | 28 | [PROPOSED] |
| 34 | `archive-filter` | — | 28 | [PROPOSED] |
| 35 | `origin-story` | 13 `origin-story` | 27 | [PROPOSED] |
| 36 | `person-profile` | 15 `person-profile` | 27 | [PROPOSED] |
| 37 | `trust-block` | 17 `trust-block` | 24 | [PROPOSED] |
| 38 | `howto-block` | 18 `howto-block` | 20 | [PROPOSED] |
| 39 | `legal-section` | 26 `legal-section` | 29 (×6) | [PROPOSED] |

### 2.4 Derived — live-module shells

| # | Component | Pages | Status |
| --- | --- | --- | --- |
| 40 | `live-module-frame` (type 19) | 19·20·21·22·26·27 | [PROPOSED] |
| 41 | `place-search` (module around `search-field`) | 19·20·21·23·25·26 + 404 | [PROPOSED] |
| 42 | `event-list` (TS-008 pos 1 / 2) | 19·20·21·22 | [PROPOSED] |
| 43 | `place-example-set` (pos 3) | 21·26 | [PROPOSED] |
| 44 | `live-counters` (pos 4) | 19·26·27 | [PROPOSED] |
| 45 | `embed-frame` (pos 1′) | 24·26 | [PROPOSED] |
| 46 | `empty-state-block` (type 20) | 19 (S3) · 20 (state B) | [PROPOSED] |

### 2.5 Derived — conversion blocks, forms and flows

| # | Component | Pages | Status |
| --- | --- | --- | --- |
| 47 | `context-band` (type 21) | all (layout) | [PROPOSED] |
| 48 | `closing-cta` (type 22) | all (layout) | [PROPOSED] |
| 49 | `newsletter-block` | footer (all) · 27 inline | [PROPOSED] |
| 50 | `envoy-form-mount` | footer contact (all) · 25 step 3 · 26/angebot | [PROPOSED] |
| 51 | `lead-fallback` | wherever 50 stands | [PROPOSED] |
| 52 | `response-promise` | 26 · 26/angebot | [PROPOSED] |
| 53 | `step-indicator` | 23·25 | [PROPOSED] |
| 54 | `choice-group` | 23 (steps 2, 3) | [PROPOSED] |
| 55 | `scope-picker` | 25 | [PROPOSED] |
| 56 | `code-snippet` | 25 (step 4) | [PROPOSED] |

### 2.6 Derived — placeholders, states, errors

| # | Component | Pages | Status |
| --- | --- | --- | --- |
| 57 | `skeleton` | every page with an island | [PROPOSED] |
| 58 | `placeholder-surface` ("Foto gesucht" hatch) | 19·20·22·24·26·27 | [PROPOSED] |
| 59 | `placeholder-badge` ("Nicht motivgenau · Platzhalter") | wherever a photo stands | [PROPOSED] |
| 60 | `demo-data-badge` (`Demo-Daten`, mock rule) | every mocked module | [PROPOSED] |
| 61 | `freshness-label` ("Stand: …" / "Beispiel") | every live module | [PROPOSED] |
| 62 | `status-badge` (alpha / availability) | 22 (`website-import`) | [PROPOSED] |
| 63 | `error-page` (type 25) | 404 · 500 (not one of the eleven) | [PROPOSED] |

**Count: 63 components — 7 rows [FIXED] (the six specified), 56
[PROPOSED].**

## 3 Determinations for the derived components

Each block: **structure · states · inherits · space · a11y**. Where the
design system is silent, the most conservative reading is taken and the
component stays `[PROPOSED]` until the M2 customer acceptance.

### 3.1 Chrome and layout

#### 8 `site-header` [PROPOSED] — TS-004 D4
- **Structure:** `logo` → `/`; the four job labels (Was ist los →
  `/dein-ort`, Termine veröffentlichen → `/mitmachen`, Dein Kalender →
  `/dein-kalender`, Warum wir → `/ueber-uns`); persistent "Kalender"
  `button` → `/dein-ort`. Sticky; its height is one CSS variable, read
  by `legal-section` for `scroll-margin-top` (TS-029 D3).
- **States:** static, no data — no loading, empty or error state. Renders
  identically at every personalization stage (TS-006 D8).
- **Inherits:** flat surface, no shadow, no border, hairline at most;
  controls radius 999; labels in Label-mono or Meta; header is *switch*
  between jobs, never fulfilment (TS-006 D4).
- **Space:** fixed height, declared before paint; 16 px side padding.
- **A11y:** one `header` landmark, one `nav` with an accessible name,
  ≥ 44 px targets, current page marked non-colour-only. The only
  navigation permitted above block 1 besides `breadcrumb-trail`.

#### 9 `site-footer` [PROPOSED] — TS-004 D4
- **Structure:** contact (`envoy-form-mount` target, S1) · `newsletter-block`
  (S5) · legal links Impressum / Datenschutz / Barrierefreiheit as
  anchors on `/rechtliches` · `language-switch`. Nothing renders after
  the closing CTA except this (TS-006 D2).
- **States:** the newsletter slot degrades per component 49; everything
  else is static.
- **Inherits:** flat surface (`surface` or `ink`), radius 0, hairline
  separators, Meta/Label-mono type.
- **Space:** no reserved-space problem — nothing here arrives late.
- **A11y:** one `footer` landmark, link list with an accessible name.

#### 10 `language-switch` [PROPOSED] — TS-001 D5
- **Structure:** plain `<a>` links per configured locale, emitting the
  prefix iff `lang !== tldDefault` (`de` bare, `/en/…`).
- **States:** none — no JS, no dropdown, no detection UI.
- **Inherits:** Label-mono 12 px, radius 999 if rendered as chips.
- **Space:** fixed; the label set is known at build time.
- **A11y:** `hreflang` on each link, current language marked
  `aria-current="true"`, ≥ 44 px.

#### 11 `breadcrumb-trail` [PROPOSED] — TS-006 D2 (FIXED by DEC-071 that it exists)
- **Structure:** one `nav` above block 1 on the five second-level pages,
  server-rendered plain links, last item (current page) not a link.
- **States:** static.
- **Inherits:** link treatment only, never CTA treatment; `data-cta`
  never appears inside it; Meta type.
- **Space:** one line, reserved.
- **A11y:** accessible name, ordered list, no skipped heading levels.

#### 12 `skip-link` [PROPOSED] — TS-002 D5
- **Structure:** first focusable element, jumps to `main`.
- **States:** visually hidden until focused.
- **Inherits:** `button` secondary treatment when visible, radius 999.
- **Space:** occupies none until focused; must not shift layout on focus.
- **A11y:** the reason it exists; visible 3 px `violet-500` ring.

#### 13 `section-shell` [PROPOSED] — SRC-014 §Shape and Space, §Page Rhythm
- **Structure:** the one wrapper every block stands in. Props: surface
  (`paper` · `surface` · `surface-2` · `lime-100` · `lime-500` · `ink` ·
  `violet-500` · photo) and density (standard / tight). Sections butt
  directly against each other.
- **States:** none of its own.
- **Inherits:** radius 0, no border, no shadow; horizontal padding 16 px;
  vertical padding 26–30 px standard, 20–24 px tight — **one value per
  section, never a padded card inside a padded section**. Rhythm rules
  are enforced here: no two photo sections adjacent, at most two
  consecutive sections of one colour family, exactly one `himbeere`
  element per screen, the dark `ink` section once per page as the
  live-data anchor.
- **Space:** vertical rhythm is the component's whole job.
- **A11y:** renders `section` with an accessible name where it carries a
  heading; contrast pairs taken from the colour tables only.

#### 14 `motion-reveal` [PROPOSED] — SRC-014 §Motion
- **Structure:** wrapper applying the site's single movement: rise 22 px
  + fade, 550 ms, `cubic-bezier(.2,.7,.3,1)`, once on enter.
- **States:** disabled entirely under `prefers-reduced-motion: reduce`.
- **Inherits:** it *is* the motion rule — nothing else on the site moves.
- **Space:** must not affect layout; transform only, never height.
- **A11y:** content is present and readable before the animation runs.

#### 15 `route-link` [PROPOSED] — TS-001 D5, TS-004 D3a
- **Structure:** the link facade. Takes a route id + params, emits the
  language-correct path. No component holds a literal internal `href`.
- **States:** none.
- **Inherits:** link treatment (`lime-800` on light), never CTA
  treatment unless wrapped in `button`.
- **Space:** inline.
- **A11y:** link text names its destination; no "hier klicken".

#### 16 `outbound-link` [PROPOSED] — TS-016 D9, DEC-013
- **Structure:** external link (app handover, outlet original, briefing
  schedule, `/start` fallback). Names source and subject in the link
  text; `external-link` icon 18/24 px; `rel="noopener"` when it opens a
  new tab; names the recipient where a third party receives data.
- **States:** static — no embed, no iframe, no third-party script.
- **Inherits:** secondary or quiet `button`, or inline link treatment.
- **Space:** inline; icon never shifts the line box.
- **A11y:** the new-tab behaviour is announced in the link text.

#### 17 `section-nav` [PROPOSED] — TS-029 D4
- **Structure:** one `nav` ("Abschnitte" / "Sections") listing the
  registry sections in order, server-rendered plain links. ≥ 1024 px:
  sticky column beside the text, below the header. < 1024 px: once,
  below the `h1`, not sticky.
- **States:** current-section marking via `IntersectionObserver` is
  progressive enhancement; without JS there is no marker and nothing
  else changes. Never hidden behind a phone toggle.
- **Inherits:** Meta/Label-mono, hairline separators, radius 0 list.
- **Space:** the list length is known at build time.
- **A11y:** accessible name, `aria-current="true"` plus a non-colour-only
  mark, ≥ 44 px targets.

#### 18 `back-to-top` [PROPOSED] — TS-029 D4
- **Structure:** one fixed bottom-right control below `xl`, appearing
  past section one, returning to `section-nav`.
- **States:** hidden above `xl` and before section one. No overlay, no
  floating menu.
- **Inherits:** `button` secondary, radius 999, ≥ 44 px.
- **Space:** fixed overlay; never covers a primary CTA.
- **A11y:** real button with a text label, keyboard reachable, smooth
  scroll only under `prefers-reduced-motion: no-preference`.

#### 19 `media-frame` [PROPOSED] — SRC-014 §Aspect Ratios
- **Structure:** the ratio box for any image that is not a full-width
  `photo-surface`: proof images, portraits, path images, screenshots.
  `aspect-ratio` on the media element, `cover`, centred.
- **States:** *loading* → `skeleton` hatch at the same ratio; *missing
  asset* → `placeholder-surface`; *asset not depicting the claim* →
  `placeholder-badge`; *mocked/generated image* → `demo-data-badge` and
  `provenance: generated` in metadata (dummy-content rule).
- **Inherits:** radius 0, no border, no shadow; ratio tokens only —
  never a fixed pixel height.
- **Space:** the ratio is declared before the asset arrives; this
  component is the site's CLS defence together with `skeleton`.
- **A11y:** meaningful `alt` from content frontmatter, `alt=""` when
  decorative.

#### 20 `icon` [PROPOSED] — SRC-014 §Icons
- **Structure:** Lucide only, 24 × 24 grid, 2 px stroke, round caps; the
  role→glyph table of the design system is the allowed set.
- **States:** none.
- **Inherits:** monochrome, inherits one token colour; never filled,
  never two-tone, never in a coloured circle unless that circle is a
  44 px control well.
- **Space:** 24 px standard, 18 px inside a badge/kicker, 32 px section
  lead. No other size.
- **A11y:** decorative and always accompanied by text; `aria-hidden`.

### 3.2 Argument blocks

#### 21 `hero-block` [PROPOSED] — content type 1
- **Structure:** kicker `badge` (optional) · headline in Display or
  Place-name role · lead · one `button` · optional media via
  `photo-surface` (`ratio-hero`). Carries the page's single
  `data-cta="primary"` where the page declares a conversion.
- **States:** on `/` and `/dein-ort` the hero swaps content by place
  knowledge (S1/S2/S3, A/B) — **the reserved space is identical across
  states so no swap shifts layout** (TS-019 FREE clause). Where
  `primaryConversion` is `null` (27, 28) it carries no CTA treatment.
- **Inherits:** Display 54/0.90/−0.045em/800; a place name may break by
  hand across two lines and is clamped to two lines; text sits in the
  dark part of the gradient.
- **Space:** `ratio-hero` (8:9 mobile, 21:9 from 900 px); headline
  reserves its line count via `min-height: calc(lines × lh × 1em)`.
- **A11y:** exactly one `h1` per page, contrast measured against the
  composite of photo + gradient, not the gradient alone.

#### 22 `scene-block` [PROPOSED] — content type 2, TS-006 D7
- **Structure:** three parts, always: opener as the visitor's own
  question · exactly **one** `mechanism` declared as a prop (`whatsapp`,
  `embed`, `calendar-connection`, `website-import`, `provenance`) · one
  concrete instance, live or proof-backed. Its own CTA is secondary.
- **States:** the concrete instance degrades with its data source (tier
  2 `freshness-label`, tier 3 snapshot labelled as an example); the
  scene never disappears.
- **Inherits:** a feature list is not a permitted block type anywhere; no
  generic claims. Alternating COLOUR/PHOTO per rhythm.
- **Space:** instance box declares its ratio (`ratio-feature`).
- **A11y:** the opener is the block heading; one mechanism, one heading.

#### 23 `value-story` [PROPOSED] — content type 3, TS-020 D3
- **Structure:** aspect → why it matters → live example → testimonial.
  Four render on `/dein-ort`, always, in both states.
- **States:** *example ladder*: place → surroundings ≤ 15 km (labelled
  with that place's own name) → county → build-time snapshot labelled as
  such → the publish invitation takes the example box. *Testimonial*:
  uncleared → the story renders three-part and the slot is **absent from
  the DOM** (clearance is known at build time, so no async box, no
  shift). Never a paraphrase, an anonymous quote or a stock portrait.
- **Inherits:** Card title 21/700, Body 18/1.5, Meta 15; category colours
  on the example's badge.
- **Space:** example box reserves `event-row` height (76 px) or
  `ratio-feature`; the absent testimonial reserves nothing.
- **A11y:** heading per story, no heading-level skip.

#### 24 `objection-list` [PROPOSED] — content type 4, TS-022 D3
- **Structure:** one headline + *n* items; each item = the channel in
  the visitor's own words + the one concrete way it fails. One proof
  slot beside the block. No numeral asserting how many channels exist.
- **States:** proof slot visibly empty when nothing clears
  (`empty-proof-slot`), never backfilled.
- **Inherits:** not a Q&A block and not `FAQPage` markup; `circle-x`
  icon for the failure role; status red `#B02A1C` only as the failure
  narrative, never as an error state.
- **Space:** item count is content-driven; no late data, no reservation
  problem.
- **A11y:** a real list; the failure is text, never colour alone.

#### 25 `publishing-path` [PROPOSED] — content type 5, TS-022 D4
- **Structure:** one mechanism per block, `Step` items inside (index,
  title, body, hint, status badge). Three instances on `/mitmachen`,
  ordered whatsapp · calendar-connection · website-import.
- **States:** a path whose hub record is not `generally-available`
  renders `status-badge` and may not be presented as dependable.
- **Inherits:** `ratio-feature` for its media; step numbers in
  Label-mono; radius 0 for the block, 999 for anything tappable.
- **Space:** media ratio declared; step list is static content.
- **A11y:** ordered list for steps, badge text readable (not colour).

#### 26 `comparison-table` [PROPOSED] — content type 6, TS-024 D4
- **Structure:** exactly four rows, two columns (today · with the
  product), one sentence per cell. Grid, list or two columns — free —
  but the four rows must be machine-countable.
- **States:** static content; no data dependency.
- **Inherits:** **no checkmark/cross column**, no feature matrix; hairline
  between rows, no card; `circle-x` / `circle-check` only if the design
  owner approves an icon column — default is text only.
- **Space:** rows are content-sized; no late content.
- **A11y:** if rendered as a table, real `th` scope; if as a list, each
  row is one item with both cells labelled.

#### 27 `offer-tier` [PROPOSED] — content type 7, TS-024 D6/D6a
- **Structure:** one question heading above three tiers; each tier =
  short argument + `price-tag` + CTAs. Order `community-calendar`,
  `portalize-calendar`, `portalize-enterprise`, each carrying
  `data-offering`. Tier 2's CTA is primary-on-light, **never Pulse**;
  tier 3's is quiet.
- **States:** static; the price comes from the offering package.
- **Inherits:** **not an audience selector** — no tab, toggle, radio or
  `select` anywhere (TS-006 D8). No feature matrix. Radius 0 panels,
  hairline separation, never floating cards.
- **Space:** equal-height tiers so the group does not reflow when copy
  differs in length.
- **A11y:** three headings at one level; CTA labels distinguish the
  tiers ("Kalender bestellen" ≠ three identical "Mehr erfahren").

#### 28 `feature-benefit` [PROPOSED] — content type 8, TS-026 block 5
- **Structure:** feature ↔ what it does for you, optional `proof_ref`.
  Carries "what the enterprise licence adds": territory cut, map view
  (dated January 2027, DEC-061), white-label registration,
  `custom-data-integration` as the add-on.
- **States:** an unshippable claim is **removed, not qualified**
  (TS-026 A17).
- **Inherits:** never a checkmark grid; `ratio-feature` media; no price.
- **Space:** media ratio declared before paint.
- **A11y:** pairs are readable in linear order.

#### 29 `price-tag` [PROPOSED] — TS-006 D10, TS-018 D3
- **Structure:** the only component that renders a price. Reads amount,
  currency, interval and `vat` from `@schafe-vorm-fenster/offerings` —
  no literal figure in any page or component source.
- **States:** `promoted` + public price → the figure with its net
  qualifier and interval; `promoted` without a public price → "auf
  Anfrage" (no figure, no range, no "ab", no order of magnitude);
  `on-request` → mentioned, never priced; `withheld` → nothing.
- **Inherits:** mono type role for the number; the free tier is a
  permanence statement, not a price.
- **Space:** fixed-height slot so a currency change does not reflow.
- **A11y:** the figure and its qualifier are one readable string.

#### 30 `proof-card` [PROPOSED] — content type 10
- **Structure:** context line · claim · attribution · `GeoBadge` ·
  optional image in `media-frame` at `ratio-proof` · link.
- **States:** *image without cleared usage right* →
  `placeholder-surface` + "Foto gesucht" badge, never a borrowed photo
  and never a text-only card without the badge (TS-024 D9); *element not
  cleared* → the card does not exist (clearance is a hard filter);
  *mocked press entry* (Q-045) → `demo-data-badge`, `Mock aktiv` row.
- **Inherits:** `ratio-proof` 5:2; radius 0; the card sits **inside** a
  colour section, so it never counts as a photo section.
- **Space:** fixed card height per stream; ratio declared before load.
- **A11y:** the quote's attribution is text, not an image.

#### 31 `proof-stream` [PROPOSED] — TS-005 D5–D8, DEC-048
- **Structure:** the container: count per page (19 → 5, 22/24/26 → 3,
  27 → 7), order from the relevance engine, grid or scroller free.
- **States:** an unfilled slot **weakens the claim, it never shortens
  the stream by design** — on `/ueber-uns` exactly one
  `empty-proof-slot` is visible and is never backfilled; elsewhere an
  empty slot renders nothing rather than a substitute.
- **Inherits:** card height fixed per surface; no two photo sections in
  a row is unaffected — stream images are cards inside a colour section.
- **Space:** element count is a property of the surface, not of the
  answer; the skeleton reserves exactly that count.
- **A11y:** reading order equals the engine's order; the empty slot sits
  in that order, in the accessibility tree.

#### 32 `empty-proof-slot` [PROPOSED] — content type 11, TS-027 D5
- **Structure:** the placeholder hatch at `ratio-proof` with a label
  badge and one sentence naming what is missing.
- **States:** **terminal, not transitional** — it is not a skeleton, it
  does not animate, and it is identical before and after hydration.
  Today it always renders on `/ueber-uns` (all five testimonials
  `unverified`).
- **Inherits:** hatch `repeating-linear-gradient(45deg, surface-2 0 16px,
  line 16px 32px)`; placeholder badge `#9A6300` on `#FBF1DC`.
- **Space:** `ratio-proof`, identical to a filled card.
- **A11y:** real content with its label and sentence in the
  accessibility tree, never `aria-hidden`.

#### 33 `archive-row` [PROPOSED] — content type 12, TS-028 D7
- **Structure:** the `event-row` shape, not a card: date at stated
  precision · original title in its source language · outlet · type
  badge(s) · one localized context line · one outbound link. **Two fixed
  variants — with preview, without** — each declaring its own height.
- **States:** no "Foto gesucht" hatch here (that surface is a conversion
  invitation and this page has no conversion); video/audio/PDF → no
  player, no embed, no download: a still or nothing; no link where the
  entry has no outlet URL; uncleared entries do not exist anywhere
  (HTML, chip counts, row total, JSON-LD).
- **Inherits:** hairline between rows, no gap; title clamped to two
  lines, meta to one; year `h2` spine, row titles are not headings.
- **Space:** both variants occupy their final height before images load;
  preview ≤ 100 KB at `ratio-proof`, lazy and async-decoded.
- **A11y:** heading outline `h1` → year `h2`, no skipped level.

#### 34 `archive-filter` [PROPOSED] — TS-028 D4/D5
- **Structure:** one row of `chip`s plus *all*, multi-select,
  OR-combined; only types with ≥ 1 cleared entry get a chip; client-side
  over rows already in the static HTML — no navigation, no refetch, no
  URL change, no history entry.
- **States:** zero selected = all; empty result unreachable by
  construction, implemented as a defensive honest line; without JS the
  chip row is **not displayed** (never dead).
- **Inherits:** chip radius 999, ≥ 40 px; filtering removes rows and
  never reorders them.
- **Space:** the chip row height is fixed; row removal must not shift
  the rows that remain.
- **A11y:** visible row count in an `aria-live="polite"` region; focus
  stays on the pressed chip; pressed state is not colour-only.

#### 35 `origin-story` [PROPOSED] — content type 13, TS-027 D3
- **Structure:** `h1` "Gebaut in einem Dorf, betrieben aus einem Dorf."
  · the causal chain (village of ~400 → free community calendar → 480 €
  licence, price via `price-tag`) · founder photo from
  `@schafe-vorm-fenster/people` · one inline `proof-card` for the
  honorary-mayor claim.
- **States:** photo not depicting the claim → `placeholder-badge`;
  missing → `placeholder-surface`.
- **Inherits:** `photo-surface` with ink gradient at `ratio-hero`;
  Display type.
- **Space:** `ratio-hero` declared before paint (this is an LCP element).
- **A11y:** the headline is the page's only `h1`.

#### 36 `person-profile` [PROPOSED] — content type 15, TS-027 D7
- **Structure:** portrait · name · role line · optional bio, read from
  `@schafe-vorm-fenster/people`; nothing about a person is written into
  website copy.
- **States:** a person without a usable portrait gets the "Foto gesucht"
  hatch — **never omitted, never a blank box**.
- **Inherits:** `ratio-portrait` 4:5, radius 0, no shadow.
- **Space:** ratio declared; equal card heights so the grid does not
  reflow with name length.
- **A11y:** the portrait's `alt` names the person; no `Person` JSON-LD
  node (TS-011 D4).

#### 37 `trust-block` [PROPOSED] — content type 17, TS-024 D10
- **Structure:** one block, three subjects (data protection ·
  operations · AI), links to `/rechtliches#datenschutz` and
  `/rechtliches#auftragsverarbeitung`. Occurs once per page.
- **States:** a sentence without a hub record behind it **does not
  ship** — today the data-protection part alone renders. No claim
  stronger than TS-013 D1 supports.
- **Inherits:** sober `surface` section; `info` / `circle-check` icons;
  no badge implying certification.
- **Space:** static content.
- **A11y:** the two links name their targets.

#### 38 `howto-block` [PROPOSED] — content type 18, TS-020 D4
- **Structure:** one iOS and one Android instruction side by side, both
  always rendered, plus the action to `{APP_HOST}/{slug}`. **No
  branching:** no user-agent sniffing, no `navigator.standalone`, no
  `beforeinstallprompt`.
- **States:** missing screenshot → `placeholder-surface`; non-matching
  screenshot → `placeholder-badge`. No mock screenshot is drawn.
- **Inherits:** `smartphone` icon; secondary CTA treatment (the primary
  marker sits in block 1); `ratio-portrait` or `ratio-square` for the
  screenshots.
- **Space:** byte-identical DOM under both UAs, so the box never varies.
- **A11y:** both instructions readable in linear order.

#### 39 `legal-section` [PROPOSED] — content type 26, TS-029 D1–D6
- **Structure:** one section per registry entry, in registry order; the
  `id` is the registry anchor for the page language, **never slugified
  from the heading**; markdown headings inside get no auto ids; `h2` per
  section, imported document headings shifted to `h3`+.
- **States:** registry entry with no document renders nothing (no empty
  heading, no placeholder) while the anchor stays reserved; a retired
  section keeps its anchor and renders a one-line pointer; the missing
  accessibility statement fails the **production** build and is omitted
  in preview.
- **Inherits:** `line` hairline plus one padding step between sections,
  never a card; Body 18/1.5; measure 66 ch ideal / 80 ch hard maximum
  (decision D-7).
- **Space:** `scroll-margin-top` = sticky header height + one section
  padding step, from the same CSS variable as the header.
- **A11y:** after an in-page jump focus moves to the section heading
  (`tabindex="-1"`); smooth scroll only under
  `prefers-reduced-motion: no-preference`; unknown fragment → top of
  page, never an error.

### 3.3 Live-module shells

#### 40 `live-module-frame` [PROPOSED] — content type 19, TS-008, TS-009
- **Structure:** the shell every live module stands in: title template
  naming its own radius ("in `<place>`", "in der Umgebung", "im Kreis
  `<county>`"), subline, the module body, optional `Cta`. A widened
  module never presents itself as the narrower one.
- **States:** *loading* → `skeleton` built from **this same layout
  component** so the two cannot drift; *empty* → the module's declared
  conversion state (publisher invitation) or omission, never an empty
  box; *tier 2* → last cached answer + `freshness-label` "Stand: …";
  *tier 3* → build-time snapshot labelled as an example; *counters, cold
  cache* → hide the module, never tier 3; *mocked upstream* →
  `demo-data-badge` + `Mock aktiv` row. **Never** a spinner, an error
  sentence, a warning icon or a retry control.
- **Inherits:** radius 0; the dark `ink` section carries the live data
  and appears once per page.
- **Space:** the frame declares the module's final geometry before the
  data arrives; a skeleton older than ~2 s is replaced by the honest
  empty state.
- **A11y:** skeleton is `aria-hidden="true"`; where arriving content
  changes the page's *meaning* (the `/dein-ort` focus-job shift) the
  frame's container is a `role="status"` region announced once.

#### 41 `place-search` [PROPOSED] — TS-008 D7
- **Structure:** `search-field` + results; a `<form method="get">` so it
  works without JavaScript, typeahead as enhancement only. Results are
  `chip`s (≥ 40 px). ZIP-only until Q-025 lands, and the placeholder
  says so.
- **States:** *no hit* → navigate to `/dein-ort/starten?ort=<raw query>`
  (the classification is made once, by the BFF, at search time);
  *covered with dates* → `/dein-ort?ort=<slug>`; *covered without dates*
  → `/dein-ort?ort=<slug>` empty state; *upstream error* → not a
  classification: the visitor stays where she is, no error styling;
  *mocked geo-api capability* (Q-025/032/038/051) → `demo-data-badge` on
  the result set, `Mock aktiv` row.
- **Inherits:** the 56 px pill with nested 44 px submit; on a photo and
  on a colour surface alike the field is `paper`.
- **Space:** 56 px fixed; the result list reserves its row count.
- **A11y:** labelled input, results reachable by keyboard, no focus
  steal; raw input is escaped wherever echoed and never rendered as data.

#### 42 `event-list` [PROPOSED] — TS-008 pos 1 / 2
- **Structure:** `event-row`s inside a `live-module-frame`: position 1 =
  the next **3** dates of the known place; position 2 = **5** dates this
  week nearby (~15 km), each row naming its own place.
- **States:** as component 40. Zero results at position 1/2 → the
  conversion state (`empty-state-block`), not an empty list.
- **Inherits:** category colours per the category table; hairline
  between rows, no gap; 76 px rows.
- **Space:** the skeleton renders exactly the row count the module will
  render; a shorter answer leaves the last rows empty rather than
  shrinking the box.
- **A11y:** a list; the date is readable text, not an image.

#### 43 `place-example-set` [PROPOSED] — TS-008 pos 3, DEC-034
- **Structure:** a small **designed set** of active example places —
  never a place list, never an "alle Orte anzeigen" control. Capped at
  6 on `/deine-region`; on `/dein-ort/starten` it is the nearest active
  place. Copy says "examples", never "the most active places".
- **States:** empty or upstream error → **module absent from the DOM**,
  no error styling, no retry; the surrounding block never collapses
  because `place-search` is static. Interim ranking (dates per place in
  the next 30 days) is ours and is labelled as examples; mocked ranking
  carries `demo-data-badge`.
- **Inherits:** `chip` or `event-row` presentation (free), radius 999
  for chips.
- **Space:** fixed row/chip count reserved before paint.
- **A11y:** each example names its place in text.

#### 44 `live-counters` [PROPOSED] — TS-008 pos 4, D8
- **Structure:** one band, three figure slots (places · dates · updates
  today), each figure inside a fixed-height `badge`.
- **States:** only figures present in the upstream response render — a
  missing field means **no counter**, never an estimate, never a
  substitute (today only the dates figure renders, Q-037). Cold cache →
  hide the module, never tier 3. Mocked stats fields → `demo-data-badge`
  + `Mock aktiv` row (`state/open.md` row 6).
- **Inherits:** mono type for numbers; no static traction figure anywhere
  (`reach-and-usage` is expired).
- **Space:** the fixed-height badge means one digit → two digits does not
  reflow the row.
- **A11y:** the figure and its label are one readable string.

#### 45 `embed-frame` [PROPOSED] — TS-008 D6, DEC-030
- **Structure:** the real Portalize widget loaded from the allowlisted
  host, deferred, never render-blocking, excluded from the LCP path. The
  heading states the radius/filter it is actually showing; while Q-026 is
  open it is labelled an example and must not say "your place".
- **States:** *loader blocked or failing* → the block's copy and CTA
  remain, **no empty frame, no error sentence**, and the page height
  above the block is unchanged; *cookie check*: after full load
  `document.cookie` is empty and no storage entry is set.
- **Inherits:** violet embed frame, radius 0.
- **Space:** the container declares its height before the loader runs;
  the page never reflows.
- **A11y:** the widget may use a shadow root; the page does not reach
  into it; axe must pass including inside that root.

#### 46 `empty-state-block` [PROPOSED] — content type 20, TS-020 D2, TS-008 D4
- **Structure:** headline naming the place · lead · `Cta` · fallback
  note. On `/dein-ort` state B it **occupies the module slot** and the
  focus job shifts (`register-as-publisher` → `/mitmachen`); on `/` S3 it
  is the publisher invitation beside the nearby module, and the shift
  stays a link.
- **States:** it *is* the empty state — so: no empty box, no error
  styling, no retry, no spinner. Trigger is "no future dates at all"
  (`after=now`, unbounded), not "nothing this week".
- **Inherits:** `himbeere` is the empty-place pulse — exactly one
  himbeere element per screen; the direct address ("du könntest die
  Erste sein") belongs **only** here, never on `/dein-ort/starten`.
- **Space:** occupies the same reserved geometry as the dates module, so
  A↔B is not a layout change.
- **A11y:** announced once via the frame's `role="status"`; the `h1`
  stays the place name at the same DOM position.

### 3.4 Conversion blocks, forms, flows

#### 47 `context-band` [PROPOSED] — content type 21, TS-006 D5
- **Structure:** one component, rendered by the **layout** on every page,
  filled from the job registry as *all four jobs minus this page's focus
  job* — never a hand-written list. Three entries, phrased as an offer in
  the visitor's own voice, targets from the registry via `route-link`.
- **States:** two modes — `band` (default, after the last argument block,
  before the closing CTA) and `merged` (on `primaryConversion: null`
  pages 27 and 28 it merges with the closing block and renders **once**,
  as the last block). Suppressed on flow steps 2/3 of `/mitmachen/
  registrieren` (decision D-5).
- **Inherits:** secondary treatment, never the primary; `paper` surface;
  no `data-cta="primary"` inside it.
- **Space:** three equal entries, fixed height.
- **A11y:** a `nav` with an accessible name; three links, each naming its
  job.

#### 48 `closing-cta` [PROPOSED] — content type 22, TS-006 D6
- **Structure:** the last block: **identical** to the primary conversion
  — same goal id, same target, same label — plus its reassurance.
  Nothing renders after it but `site-footer`.
- **States:** `primaryConversion: null` → the merged three-job block
  (see 47); on `/dein-kalender` it repeats the paid goal in
  primary-on-light/dark, **never Pulse** (Pulse occurs exactly once per
  screen, in the focus block).
- **Inherits:** `button` primary; reassurance in Meta; the permanence
  promise only where a cleared backing exists — otherwise **removed, not
  softened**.
- **Space:** fixed height.
- **A11y:** not `data-cta="primary"` (that marker belongs to block 1).

#### 49 `newsletter-block` [PROPOSED] — TS-016 D10, S5
- **Structure:** email address only, double opt-in, no cookie, no
  persistent identifier; consent wording links `/rechtliches#datenschutz`.
  Footer on every page; inline once on `/ueber-uns` (permitted **only**
  there, because that page has no conversion of its own).
- **States:** *sending system undecided* (Q-020) — per the run's mock
  rule the block **ships as a labelled mock**: full UX, `demo-data-badge`,
  no address leaves the browser, no subscription is claimed, plus a
  `Mock aktiv` row (decision D-4, `state/open.md` row 22). Widget failure → the
  static `lead-fallback`.
- **Inherits:** secondary treatment; the page still contains zero
  `data-cta="primary"` elements on `/ueber-uns`.
- **Space:** fixed height including the note line, so validation text
  does not shift the footer.
- **A11y:** label association and error identification are part of the
  widget demand; the website's acceptance still covers them.

#### 50 `envoy-form-mount` [PROPOSED] — TS-016 D1/D2/D5
- **Structure:** mount point only — a custom element with attributes
  (form kind, page language, source route, offering/goal context) and a
  theming wrapper carrying CSS variables. The website holds nothing,
  posts nothing, proxies nothing; the browser talks to envoy directly.
  Surfaces: footer contact (S1), `/deine-region(/angebot)` quote (S2),
  `/dein-kalender/bestellen` step 3 invoice (S4). One instance of a form
  kind per page, never more.
- **States:** *script blocked, erroring, or not delivered* →
  `lead-fallback`, server-rendered, never an empty slot and never a
  spinner that does not resolve; *submission error* → the widget owns the
  message, the page adds nothing and does not retry; *JS disabled* →
  same static fallback; *widget undelivered at M2* (Q-022) → the mock
  behind the same interface module, `demo-data-badge`, `Mock aktiv` row
  (`state/open.md` row 7).
- **Inherits:** the page renders and is fully usable without the widget;
  no field value ever reaches our origin, logs or analytics.
- **Space:** the slot reserves the widget's geometry before load.
- **A11y:** axe passes including inside the shadow root; no page CSS
  targets the widget's internals.

#### 51 `lead-fallback` [PROPOSED] — TS-016 D6, DEC-069
- **Structure:** **one** component reused by every lead surface: an
  outbound link to our own `/start` path (which redirects to the form),
  naming Google as the recipient, **plus** the email address beside it,
  plus the briefing link on S2 and S4.
- **States:** it is itself the degraded state; it is server-rendered
  markup, not script-generated. Linked, never embedded (DEC-013).
- **Inherits:** `outbound-link` marking; secondary treatment; never above
  the primary CTA.
- **Space:** fixed height so the swap widget↔fallback does not reflow.
- **A11y:** the visitor is told where the link goes before following it.

#### 52 `response-promise` [PROPOSED] — TS-006 D11, TS-026 D5
- **Structure:** one constant, one component, three call sites (the CTA
  on `/deine-region`, the form on `/deine-region/angebot`, the
  confirmation after submit) — so the three cannot disagree.
- **States:** while the constant is `null` (Q-022 C11 unanswered) the
  component **renders nothing**: no response-time wording of any kind,
  removed rather than softened.
- **Inherits:** Meta type, `clock` icon, no badge implying certification.
- **Space:** renders no reserved space when null.
- **A11y:** plain text beside the submit action.

#### 53 `step-indicator` [PROPOSED] — TS-023 D8, TS-025 D2
- **Structure:** a kicker `badge` ("Schritt 2 von 3" / "… von 4"),
  reserved height, above the step's heading.
- **States:** static per step; the step itself travels in the URL
  (`schritt=` on `/dein-kalender/bestellen`, derived from the answers
  present on `/mitmachen/registrieren`, where `schritt` may only move
  backwards).
- **Inherits:** badge radius 999, mono 12/700.
- **Space:** reserved so it cannot shift the layout between steps.
- **A11y:** the step count is text; after each advance focus moves to the
  new step's heading.

#### 54 `choice-group` [PROPOSED] — TS-023 D8 (Q-044 gap, decision D-6)
- **Structure:** single-choice control for "who publishes" (step 2) and
  "which publishing path" (step 3). **The design system specifies no
  such control**, so the conservative reading: tappable `chip`s in a
  radiogroup — radius 999, ≥ 44 px, one selected state using the
  existing selected-chip treatment (`lime-500` fill with `lime-900`/
  `ink` text), submitted by a `<form method="get">` so it works without
  JavaScript.
- **States:** unanswered · answered · invalid value dropped and the step
  re-asked (never an error page).
- **Inherits:** not self-classification — it asks who *publishes*, which
  is account data, and it must not change what any page shows.
- **Space:** fixed row height; the option list is known at build time
  (step 2's vocabulary is UNKNOWN → placeholder options carry
  `demo-data-badge` until the app team delivers the list).
- **A11y:** real `radiogroup` semantics with a group label; selection is
  not colour-only.

#### 55 `scope-picker` [PROPOSED] — TS-025 D3/D3a
- **Structure:** `place-search` + removable `chip`s; each hit, each ZIP's
  places and a county become chips (a county is **one** chip, never
  expanded into a place list). Above 12 chips the row collapses to
  "n Orte ausgewählt" plus a disclosure. Selection lives in the URL.
- **States:** *empty scope* → designed empty state and step 3 is
  unreachable (also by editing `schritt=3`); *no live preview in V1*
  (DEC-069) — the step shows what was chosen and its count, and claims
  nothing about content; *reload* → scope restored from the URL.
- **Inherits:** chips ≥ 40 px, radius 999; scope does not drive price
  (480 € is per organisation).
- **Space:** ticking a chip must produce **zero** layout shift in and
  below the block.
- **A11y:** every chip removable by keyboard; focus moves to the
  scope-change announcement (`aria-live`).

#### 56 `code-snippet` [PROPOSED] — TS-025 D7
- **Structure:** the loader snippet as **selectable, server-rendered
  text** in a code block plus a copy control; never produced by a
  download or a script-only path. Permanent note beside it: copy the code
  now (not a dialog, not an unload prompt).
- **States:** *code cannot be issued synchronously* → step 4 shows the
  confirmation, names when the code arrives, and the
  `buy-calendar-licence` event does **not** fire; *mocked `organizerId`*
  (Q-046, `state/open.md` row 2) → full instant-embed experience with
  dummy code and `demo-data-badge`, `Mock aktiv`; *reload* → the code is
  gone, because nothing is stored.
- **Inherits:** mono type role; radius 0 block; `copy`/`check` icons.
- **Space:** the block reserves its height for the longest snippet.
- **A11y:** the code is reachable and copyable by keyboard; the copy
  control confirms in text.

### 3.5 Placeholders, states, errors

#### 57 `skeleton` [PROPOSED] — SRC-014 §Skeletons, TS-009 D7
- **Structure:** the box at its declared ratio filled with
  `repeating-linear-gradient(45deg, surface-2 0 16px, line 16px 32px)`;
  text skeletons are `line` bars at the text's own line height, 60 %
  width on a paragraph's last line. Built from the **same layout
  component** as the real module.
- **States:** it is a state. It **does not animate** (the site has
  exactly one motion); under `prefers-reduced-motion: reduce` at most an
  opacity change. Persisting longer than ~2 s → replaced by the honest
  empty state (publisher invitation, "Foto gesucht") — both of which are
  conversions, which is why they are designed rather than hidden.
- **Inherits:** never renders a fake value that could be read as data —
  no example figures, no placeholder place name.
- **Space:** fixed height from a fixed item count (3 dates, 5 places, n
  cards); a shorter answer leaves the last rows empty rather than
  shrinking the box.
- **A11y:** `aria-hidden="true"`.

#### 58 `placeholder-surface` [PROPOSED] — SRC-014 §Photo surface
- **Structure:** a missing photograph becomes the diagonal hatch of
  `surface-2` and `line` with the badge "Foto gesucht" and an invitation
  to contribute one.
- **States:** terminal, not transitional; it is a **conversion**, so it
  carries its CTA — except on `/ueber-uns/archiv`, which has no
  conversion and therefore uses a text-only row instead (TS-028 D6).
- **Inherits:** hatch tokens as above; badge `#9A6300` on `#FBF1DC`
  (6.0:1), radius 999.
- **Space:** the declared ratio of the box it replaces.
- **A11y:** real content in the accessibility tree; never `aria-hidden`.

#### 59 `placeholder-badge` [PROPOSED] — SRC-014 §Photo surface
- **Structure:** "Nicht motivgenau · Platzhalter", mono 11 px, radius
  999, on any photograph that does not depict what the copy claims.
- **States:** present or absent; never softened into a caption.
- **Inherits:** `#9A6300` on `#FBF1DC`; `triangle-alert` at 18 px where
  an icon is used.
- **Space:** sits inside the photo box, no layout effect.
- **A11y:** readable text, 4.5:1 checked at badge size.

#### 60 `demo-data-badge` [PROPOSED] — `plan/guardrails.md` mock rule
- **Structure:** the label `Demo-Daten` on every module fed by a mock or
  by generated content. Same treatment as `placeholder-badge` —
  `#9A6300` on `#FBF1DC`, radius 999, mono 11–12 px — because the design
  system's one "this is not real" token pair is the conservative reading
  (decision D-8).
- **States:** present while the mock is active; removed when the real
  system lands (one `Mock aktiv` row per occurrence).
- **Inherits:** dummy data is obviously fictitious and never contains
  real persons, customers or real-looking testimonials.
- **Space:** badge height 26 / 30 px, reserved.
- **A11y:** text, in the accessibility tree, never colour-only.

#### 61 `freshness-label` [PROPOSED] — TS-008 D5, TS-009 D4
- **Structure:** tier 2 → "Stand: `<time>`" beside the module's heading;
  tier 3 → the snapshot labelled as an example.
- **States:** absent at tier 1 (fresh). Never an error sentence, never a
  warning icon, never a retry control — failures are logged server-side.
- **Inherits:** Meta 15 px in `muted`; `clock` icon at 18 px where used.
- **Space:** reserved in the frame's header row so its appearance does
  not shift the module.
- **A11y:** plain text; the time is machine-readable via `<time>`.

#### 62 `status-badge` [PROPOSED] — TS-022 D4
- **Structure:** availability badge on a mechanism whose hub record is
  not `generally-available` (today: `website-import`, alpha).
- **States:** rendered while the record says so; removed only when the
  record changes — never removed by copy decision.
- **Inherits:** badge geometry; `#9A6300` on `#FBF1DC` for "not yet
  dependable", never a category colour.
- **Space:** badge height, reserved.
- **A11y:** the badge text says what it claims; not colour-only.

#### 63 `error-page` [PROPOSED] — content type 25, TS-004 D2/D6, DEC-032
- **Structure:** 404 → `place-search` + the jobs band (`context-band`),
  real 404 status, `noindex`; 500 → static, minimal, **no data
  dependency of any kind**.
- **States:** the 404's search streams like everywhere else; the 500 has
  no island.
- **Inherits:** full page rhythm, header and footer; no apology styling,
  no illustration outside the design system.
- **Space:** the search reserves 56 px as everywhere.
- **A11y:** `h1`, landmarks, status code matching the page.

## 4 Per-page composition sheets

Each sheet is the ordered module list for one page, in inventory names.
Build a page from **this sheet plus the page's own tactical spec** — the
spec owns counts, data, states, manifest values and acceptance criteria;
the sheet owns which component renders what.

Every page is wrapped by the shared layout: `skip-link` → `site-header`
→ (`breadcrumb-trail` on the five second-level pages) → `main` →
`context-band` → `closing-cta` → `site-footer`. Blocks 3 and 4 are
rendered **by the layout from `page.meta.ts`**, never hand-placed
(TS-006 D2). Every section stands in a `section-shell` wrapped by
`motion-reveal`; the rhythm rules are checked per page, not per block.

### TS-019 `/` — home *(longest list: 11 own modules)*
`focusJob: know-what-is-on` · `primaryConversion: save-calendar-to-homescreen` · proof 5

| # | Module | Component(s) | Section |
| --- | --- | --- | --- |
| 1 | focus block, state S1 (no place known) | `photo-surface` (`ratio-hero`) + `hero-block` + `place-search` **as the dominant element**; the search submit carries `data-cta="primary"` | PHOTO hero |
| 1′ | focus block, state S2 (place + dates) | `hero-block` (place name) + `live-module-frame` + `event-list` (3 rows) + `button` → app handover | COLOUR ink |
| 1″ | focus block, state S3 (place, no dates) | `empty-state-block` (publisher invitation, link only — the shift is not the page here) + `live-module-frame` + `event-list` (nearby, own radius label) | COLOUR ink |
| 2 | scene 1 | `scene-block` `mechanism="whatsapp"` | COLOUR |
| 3 | scene 2 | `scene-block` `mechanism="embed"` | PHOTO |
| 4 | scene 3 | `scene-block` `mechanism="provenance"` | COLOUR |
| 5 | provenance stamps | `badge` row (kicker variant) inside `section-shell` | COLOUR violet |
| 6 | proof stream | `proof-stream` (5) of `proof-card` / `empty-proof-slot` | COLOUR / cards |
| 7 | live counters | `live-counters` (today: dates figure only) — inline in 5 or 6, no section of its own | inline |
| 8 | context band | `context-band` (`band` mode) | COLOUR paper |
| 9 | closing CTA | `closing-cta` | COLOUR paper |

Scene order varies by entry trait (ordering only, never the set — see
decision D-1). S4 (uncovered place) is not a state of this page: the
search navigates away.

### TS-020 `/dein-ort` — your place
`focusJob: know-what-is-on` · `save-calendar-to-homescreen` · `emptyState` declared

| # | Module | Component(s) |
| --- | --- | --- |
| 1 | focus block, state A | `hero-block` (place name `h1`) + `live-module-frame` (`role="status"`) + `event-list` (3) + `button` primary → `{APP_HOST}/{slug}` |
| 1′ | focus block, state B | same frame, `empty-state-block` occupies the module slot; primary CTA becomes `register-as-publisher` → `/mitmachen` |
| 2 | four value stories | `value-story` ×4 (example ladder; testimonial slot absent while uncleared) |
| 3 | this week nearby | `live-module-frame` + `event-list` (5, each row naming its place) — in state B this is the **first** evidence |
| 4 | homescreen block | `howto-block` (iOS + Android always, no branching) — in state B kept, demoted below 3 |
| 5–6 | band + closing | `context-band` · `closing-cta` |

Unchanged between A and B: route, URL, canonical, hreflang, title,
header, footer, band, block order, every DOM position. `h1` is the place
name in both.

### TS-021 `/dein-ort/starten` — start the calendar
`focusJob: publish our dates` · `register-as-publisher` · no proof slot

| # | Module | Component(s) |
| --- | --- | --- |
| 0 | trail | `breadcrumb-trail` |
| 1 | focus block | `hero-block` — acknowledgment naming the searched place (escaped text, clamped to two display lines) + `button` primary → `/mitmachen/registrieren?ort=<value>` |
| 2.1 | what it takes | `scene-block` `mechanism="whatsapp"` |
| 2.2 | live example | `live-module-frame` + `place-example-set` (nearest **active** place) or `event-list` — headed as an example, never as "your place" |
| 2.3 | who usually starts it | `scene-block` (Verein, Feuerwehr, Kirche, Gemeinde — a scene, never a role switcher) |
| 2.4 | search again | `place-search` |
| 3–4 | band + closing | `context-band` · `closing-cta` (same goal and target as block 1) |

The searched place may appear in `h1`, body copy, CTA labels and the
registration `href` — and **nowhere** as data.

### TS-022 `/mitmachen` — the publishing entry
`focusJob: publish our dates` · `register-as-publisher` · proof 3

| # | Slot | Component(s) |
| --- | --- | --- |
| 1 | hero | `hero-block` carrying the WhatsApp scene (`data-block="scene"`) + `button` primary |
| 2 | why today's channels fail | `objection-list` + one proof slot (`proof-card` / `empty-proof-slot`) |
| 3 | three paths | `publishing-path` ×3 (`whatsapp`, `calendar-connection`, `website-import` + `status-badge`), ending with one `aside` + `route-link` → `/dein-kalender` |
| 4 | live example | `live-module-frame` + `event-list` ("in `<place>`") — the page's single ink section |
| 5 | proof | `proof-stream` (3) of `proof-card` |
| 6–7 | band + closing | `context-band` · `closing-cta` (reassurance = permanence promise, removed if unbacked) |

### TS-023 `/mitmachen/registrieren` — register *(a flow, not an argument)*
`focusJob: publish our dates` · `primaryConversion: publish-first-event` (fired by the app)

| # | Module | Component(s) |
| --- | --- | --- |
| 0 | trail | `breadcrumb-trail` |
| 1 | step indicator | `step-indicator` ("Schritt n von 3") |
| 2 | step 1 — which place | `place-search` + result `chip`s (community level, never the Gemeinde) |
| 3 | step 2 — who publishes | `choice-group` (vocabulary UNKNOWN → placeholder options + `demo-data-badge`) |
| 4 | step 3 — which path | `choice-group` (exactly three) |
| 5 | handover | one `button` primary wrapping `outbound-link` → app registration entry, `etcc_*` preserved, no unconfirmed slug appended |
| 6 | band | `context-band` **on step 1 only** (decision D-5) |
| 7 | closing | `closing-cta` = the handover, rendered in the last state only |

Zero argument blocks. No proof, no live module besides the step-1 search.
Every advance is a real GET navigation with a shareable URL.

### TS-024 `/dein-kalender` — the 480 € page
`focusJob: run-our-own-calendar` · `buy-calendar-licence` + equal-weight `request-product-briefing` · proof 3 ×3 slots

| # | `data-block` | Component(s) |
| --- | --- | --- |
| 1 | `focus` | `hero-block` + `button` **pulse** (`data-cta="primary"`) → `/dein-kalender/bestellen` + adjacent secondary `outbound-link` (briefing, `data-cta="equal-weight"`) |
| 2 | `contrast` | `comparison-table` (exactly 4 rows) |
| 3 | `embed-demo` | `embed-frame` (position 1′) |
| 4 | `tiers` | `offer-tier` ×3 + `price-tag` (one figure: 480, from the package) |
| 5 | `proof` | `proof-stream` (3) of `proof-card` with `media-frame` / `placeholder-surface` |
| 6 | `trust` | `trust-block` → `/rechtliches#datenschutz`, `#auftragsverarbeitung` |
| 7–8 | band + closing | `context-band` · `closing-cta` (same goal, **not** pulse) |

Pulse occurs exactly once on the page, in `focus`.

### TS-025 `/dein-kalender/bestellen` — order flow
`focusJob: run our own calendar` · `buy-calendar-licence` · no live module, no proof

| # | Module | Component(s) |
| --- | --- | --- |
| 0 | trail | `breadcrumb-trail` |
| 1 | step indicator | `step-indicator` ("… von 4", `schritt=1..4` in the URL) |
| 2 | steps 1+2 — scope | `place-search` + `scope-picker` (chips, county = one chip, collapse above 12). **No live preview in V1** (DEC-069) |
| 3 | step 3 — invoice | `envoy-form-mount` (authority field set) with `lead-fallback` |
| 4 | step 4 — code | `code-snippet` + confirmation, plus the lost-state note |
| — | on every step | briefing `outbound-link` (secondary, never above the primary CTA) |
| 5–6 | band + closing | `context-band` · `closing-cta`, rendered **once**, after step 4 |

No payment field anywhere; nothing is stored; the flow is `noindex,
follow` on every step.

### TS-026 `/deine-region` — the region page *(longest list after home: 9 own modules)*
`focusJob: run-our-own-calendar` · `request-licence-quote` · equal-weight briefing · proof 3

| # | Block | Component(s) | Surface |
| --- | --- | --- | --- |
| 1 | focus | `photo-surface` (`ratio-hero`) + `hero-block` + `scene-block` `mechanism="embed"` + `button` primary → `/deine-region/angebot` + briefing `outbound-link` | photo |
| 2 | the territory question | `section-shell` copy block + one proof slot | colour, sober |
| 3 | what is already live here | `live-module-frame` + `place-example-set` (≤ 6) + `live-counters` + `place-search` — **one swappable slot**, replaced by the map module at `ratio-map` in 2027 | colour ink |
| 4 | the product | `embed-frame` (position 1′) | colour |
| 5 | what it adds | `feature-benefit` (+ `price-tag` "auf Anfrage"; the 480 comparison at most once) | photo `ratio-feature` |
| 6 | proof | `proof-stream` (3) of `proof-card` | colour |
| 7 | quote CTA | `button` primary (repeat) + `response-promise` (renders nothing while null) | colour |
| 8–9 | band + closing | `context-band` · `closing-cta` | paper |

**No map anywhere**: no canvas, no map library, no map image, no hatched
`ratio-map` box, no "Karte folgt" caption.

#### `/deine-region/angebot`
`breadcrumb-trail` → `hero-block` → `envoy-form-mount` (quote, S2) +
`response-promise` + `lead-fallback` → confirmation state (same promise
constant) → `context-band` → `closing-cta`.

### TS-027 `/ueber-uns` — the trust surface *(9 own modules)*
`focusJob: understand-who-is-behind-it` · `primaryConversion: null` · proof 7

| # | Block | Component(s) |
| --- | --- | --- |
| 1 | origin | `photo-surface` (`ratio-hero`, ink gradient) + `origin-story` (`h1`, founder photo, `price-tag` 480) + one inline `proof-card` (honorary mayor) |
| 2 | operating counters | `live-counters` (years in operation + live active places; no static traction figure) |
| 3 | proof stream | `proof-stream` (7) = 6 × `proof-card` + exactly one `empty-proof-slot` (type-reserved for `testimonial`, never backfilled) |
| 4 | archive | one `route-link` → `/ueber-uns/archiv`, **zero** teasers, counts or thumbnails |
| 5 | team | `person-profile` ×n (`ratio-portrait`, "Foto gesucht" where no portrait) |
| 6 | newsletter | `newsletter-block` (inline — permitted only here) |
| 7 | closing | `context-band` in `merged` mode = the three-job block, rendered **once**, as the last block |

The page contains zero `data-cta="primary"` elements. Exactly one photo
section (block 1); stream images are cards inside a colour section.

### TS-028 `/ueber-uns/archiv` — the archive
`primaryConversion: null` · no conversion, no form, no hero photo

| # | Block | Component(s) |
| --- | --- | --- |
| 0 | trail | `breadcrumb-trail` |
| 1 | page head | `h1` (the LCP element — text, never an image) |
| 2 | filter | `archive-filter` (`chip` row + *all*, `aria-live` row count; hidden without JS) |
| 3 | the record | year `h2` + `archive-row` ×n, `date` descending, two fixed variants (with / without preview at `ratio-proof`) |
| 4 | closing | `context-band` in `merged` mode |

No relevance engine, no island, no BFF call — one static build artefact
for everyone. Uncleared entries exist nowhere: not in HTML, chip counts,
row total or JSON-LD (today that is **all** of them — mocked per
`state/open.md` row 1 with `demo-data-badge`).

### TS-029 `/rechtliches` — the one legal page
No focus job in the four-job sense (open point, TS-029 #5) · no conversion of its own

| # | Block | Component(s) |
| --- | --- | --- |
| 1 | page head | `h1` ("Rechtliches" / "Legal") |
| 2 | section navigation | `section-nav` (sticky column ≥ 1024 px, inline below the `h1` under it) |
| 3 | the sections | `legal-section` ×6 in registry order, ids from the registry, `scroll-margin-top` from the header variable |
| 4 | back to top | `back-to-top` (< `xl`, past section one) |
| 5–6 | band + closing | `context-band` · `closing-cta` (TS-006 D2: the sender surfaces end in blocks 3 and 4 too) |

Fully static; the only client JS is the current-section marker.

### Module-count ranking

| Page | Own modules (excl. layout) |
| --- | --- |
| TS-019 `/` | **11** (3 focus states + 3 scenes + stamps + stream + counters) |
| TS-026 `/deine-region` | **9** |
| TS-027 `/ueber-uns` | **9** |
| TS-024 `/dein-kalender` | 8 |
| TS-020 `/dein-ort` | 7 (incl. the second focus state) |
| TS-021 `/dein-ort/starten` | 6 |
| TS-022 `/mitmachen` | 6 |
| TS-025 `/dein-kalender/bestellen` | 6 |
| TS-023 `/mitmachen/registrieren` | 6 |
| TS-029 `/rechtliches` | 5 |
| TS-028 `/ueber-uns/archiv` | 4 |

## 5 Decisions taken

Decisions the Project Manager takes so M2 can start; each is a working
decision with its reasoning, reviewable at the M2 customer acceptance.
Nobody is asked (`plan/guardrails.md`).

### D-1 — Q-052: entry context sets emphasis and order, never the focus job

**Decision.** On `/` the focus job is `know-what-is-on` at every stage.
The entry trait changes **the order of the scenes and which offer is
emphasised** — nothing else. Block 1, the primary CTA, the context band
and the closing CTA are invariant; the only runtime focus-job change on
the whole website stays `/dein-ort`'s empty state.

**Reasoning, two lines.** (1) The other reading contradicts the
conversion map: a trait-swapped focus job would make `/` declare goals
SRC-003 does not assign it, which TS-006 D9 validates in both
directions — and SRC-001 §6 permits a stage to change *selection and
order* only. (2) Module one is always the place search (TS-006 D4: the
job is fulfilled in place, never linked), so the page's structure cannot
vary by entry anyway; "focus job set by entry context" was an imprecise
sentence, not a second design.

**Status.** This is the same reading a parallel human session recorded as
**DEC-059** ("The home page's focus job is stable; entry context changes
emphasis only", accepted 2026-09-11), which also sharpens the IA brief to
"the emphasised offer is set by entry context". No new ADR is written
here — decision numbering is contended by that session, and DEC-059
already carries the decision. The behaviour is built in **M4** (TS-010
stages, TS-019 D3a scene order); if an implementation-level record turns
out to be needed, it is written there.

### D-2 — Component names follow the 26 content types

Where a component renders one of the content types of the content
concept (B.3), it carries that type's name (`hero-block` for `hero`,
`proof-card`, `context-band`, `closing-cta`, `live-module-frame`,
`legal-section`, …). Reasoning: TS-007 D5 makes the Zod schema the
binding output contract and TS-007 check 9 validates slot bindings —
one vocabulary across content, schema and component keeps that check
meaningful, and page specs already speak in content types (TS-020 D1,
TS-022 D2). Where no content type exists (chrome, live shells, form
mounts, states) the name is new and kebab-case.

### D-3 — `badge` and `chip` are two components

The design system specifies them in one section, but a chip is tappable
and therefore ≥ 40 px while a badge is a 26/30 px label. Splitting them
in code is the conservative reading of the ≥ 40 px rule; both stay
`[FIXED]` because both geometries are specified.

### D-4 — The newsletter block ships in M2 as a labelled mock

TS-016 D10 says the footer carries the newsletter entry only when a
sending system exists and forbids "a placeholder form that discards
addresses". The run's mock rule requires every missing external system to
be built as a mock with labelled dummy data, never as a hole. Both hold
if the block ships with the full UX, a `demo-data-badge`, **no address
leaving the browser** and no claim that a subscription happened — that is
not a form pretending to work, it is a visibly demo module.
→ `state/open.md` row 22, marked `Mock aktiv`.

### D-5 — The context band is suppressed on flow steps 2 and 3

TS-006 D5 renders the band on every page; TS-023 D7 suppresses it
mid-flow because a mid-flow exit offer costs the conversion the page
exists for. M2 follows TS-023 (the page-level spec), renders the band on
step 1, and records the deviation rather than silently satisfying
TS-006-A6. → `state/open.md` row 24.

### D-6 — The single-choice control is chip-derived

Q-044's sharpest gap: `/mitmachen/registrieren` steps 2 and 3 need a
control the design system does not specify. The most conservative
reading is to derive it from an existing specified control rather than
invent a new shape: tappable chips in a real `radiogroup`, radius 999,
≥ 44 px, submitted by a plain GET form. No new radius, no new geometry,
no new colour. → `state/open.md` row 23.

### D-7 — The reading measure applies to every reading surface

TS-029 D5 sets 66 ch ideal / 80 ch maximum for the legal page. The design
system has no measure token, so M2 applies the same measure to every
long-form text column (`legal-section`, `objection-list`, `trust-block`,
`origin-story` body) instead of letting each page invent one.
→ `state/open.md` row 25.

### D-8 — `Demo-Daten` reuses the placeholder token pair

The mock rule demands a `Demo-Daten` label; the design system has exactly
one "this is not real" pair (`#9A6300` on `#FBF1DC`, 6.0:1, radius 999,
mono). Reusing it — rather than minting a colour outside the scales —
is the conservative reading, and it puts placeholder photography,
unresolved clearance and demo data into one visual register.

### D-9 — Four states are declared by every data-dependent component

Loading / empty / error-degraded / mocked (section 1, rule 6). Reasoning:
TS-008 D5 insists emptiness, staleness and failure are three different
things and the mock rule adds a fourth; a component that declares only
"has data / has none" will reintroduce the spinner and the error sentence
both specs forbid.

## 6 Open points added to `state/open.md`

| Row | Point | Kind |
| --- | --- | --- |
| 22 | Newsletter block ships as a labelled mock while Q-020 is unanswered (D-4) | `Mock aktiv` |
| 23 | Single-choice control has no design-system component (Q-044 residue, D-6) | design review |
| 24 | Context band suppressed on registration steps 2–3 — TS-023 D7 against TS-006 D5/A6 (D-5) | spec conflict |
| 25 | Design system has no measure token; 66/80 ch generalised from TS-029 D5 (D-7) | design review |
| 26 | Content type `partner-mention` is composed by no page spec — not built in M2 | scope |

## 7 Deliberately not built in M2

- `partner-mention` (content type 16) — the content concept assigns it to
  `/deine-region` and `/ueber-uns`, but neither page spec composes it.
  Unspecified features die here (`plan/guardrails.md`). → row 26.
- The **scope preview** and `GET /api/scope/preview` — deferred by
  DEC-069; `scope-picker` ships without it.
- The **map module** — DEC-061 dates it January 2027; block 3 of
  `/deine-region` stays one swappable slot and nothing on the page
  depicts a map.
- `/deine-termine` and `/mitmachen/vor-ort-werben` — reserved names that
  answer 404 (DEC-071); no component, no link, not in the sitemap.
- Any **role switcher, audience tab, segmented entry or interstitial** —
  forbidden on every page at every stage (TS-006 D8); it must not appear
  in the component inventory either (TS-006-A9).
