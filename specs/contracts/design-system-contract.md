---
artefact: contract
id: SRC-013
status: DRAFT
date: 2026-09-10
updated: 2026-09-23
decisions: [DEC-044, DEC-054]
---

# Design System Contract

What the website needs from the mobile-first styleguide in order to
generate its visual layer. Written as an expectation against
`@schafe-vorm-fenster/brand-design`, not as a design brief.

## The shape: keep the one you already have

The package already does the right thing — one authored source, two
outputs: machine-readable tokens (`tokens.json`, `tokens.css`,
`tokens.tailwind.js`) and a human-readable kit (`kit/…​.html`). **The
styleguide should extend that shape, not introduce a second one.** A
generator reads the manifest; a person reviews the kit; both come from
the same source, so they cannot drift.

Delivered as a versioned package like everything else (DEC-042), so the
website consumes it as a dependency and a change arrives as a version
bump with a changelog.

## What already suffices

Read from v2.6.0 — the specs consume these and restate none of them:

`color` (incl. `dark`, `category`, semantic `roles`) · `font`
(family, weight, size with `clamp()`, lineHeight, letterSpacing, usage) ·
`space` · `breakpoint` (xs…2xl) · `radius` · `border` · `shadow` ·
`target` · `measure` · `logo` · `button` · `categoryDisplay` · `print`.

## What is still missing

### 1. A component manifest — the piece that unblocks generation

One machine-readable entry per component:

| Field | Meaning |
| --- | --- |
| `id` | stable name, referenced from page specs |
| `variants` | the named forms it takes |
| `states` | see §3 — which of them this component implements |
| `slots` | named content holes, each required or optional |
| `tokens` | which token groups it consumes |
| `renders` | which website content type(s) it can render (§4) |

Components reference tokens; they never carry a colour, size or spacing
value of their own. That rule is what lets the linter check it.

**The manifest must cover at least these ids.** SRC-014 defines each one
visually; the manifest is what makes it generatable. The first block is
what the guide already carried; the second is what the 2026-09-22 review
added.

| id | Variants / notes |
| --- | --- |
| `button` | primary-on-light · primary-on-dark · pulse · secondary · quiet |
| `search-field` | on-photo · on-colour; nested 44 px submit |
| `badge` | category · kicker · status · placeholder |
| `chip` | default · selected · **excluded** |
| `tag` | the non-tappable 30 px size; default · **excluded** |
| `kicker` | **bare** (no pill, 15 px mono, tracking 0.08em) · badge |
| `event-row` | with category icon, colour **and** label; day numeral + month |
| `photo-surface` | ink · violet; scrim from a token, focal point per motif |
| `logo` | mark-only · mark + wordmark · mark + URL |
| `icon-well` | 40 px, non-interactive — distinct from the 44 px control well |
| `control-well` | 44 px, interactive |
| `contact-section` | one component, one fixed `lime-100` ground, every page |
| `contact-action-row` | 72 px, two lines, trailing arrow; primary · secondary |
| `explain-module` | ordinal · title · three-state stage · three step lines · one CTA |
| `place-search-overlay` | 3–4 rows `Ort (Gemeinde)`, out of flow, combobox keyboard |
| `quote-card` | quote · author with role and organisation · sourced outbound link |
| `event-status-badge` | `neu` · `verschoben` · `abgesagt` |
| `overlay-header` | transparent over a photo; mark, calendar pill, control wells |
| `archive-block` | the "old world" section type: archive ground, archive ink, neutral icons |
| `price-tier-row` | three rows in **one** section, `line` hairline between them |

Two of these carry a rule the manifest has to express, not only name:

- `contact-section` is the single ground in the system that means
  something. Its ground is not a variant and not a prop.
- `explain-module` is the only component allowed to animate (§3).

### 2. Composition rules

- Container width and outer gutter **per breakpoint — all six**, not
  only at the desktop end. The three switch points below 640 px are the
  reason the scale exists (TS-017 D2b), and they are the ones no
  delivered artefact currently gives a container width for.
- Section rhythm: which `space` token separates blocks, and at which of
  the six breakpoints it steps.
- The mobile-first rule stated normatively: `min-width` queries only, one
  component tree, no separate desktop layout.
- How the block order every page carries — focus · argument · context
  band · closing CTA (TS-006 D2) — maps onto layout.
- **Section grounds are rhythm, not meaning** (SRC-014). A generator picks
  a ground from the alternation rule, not from what the section says —
  with one exception the manifest has to encode: `contact-section` keeps
  its fixed ground everywhere and is exempt from the alternation count.
  Problem content takes the archive ground; solution content never takes a
  grey-green one.
- The price tiers are **rows in one section**, not three sections — a
  composition rule, because the consecutive-ground count depends on it.

### 3. States, named and specified

These are not decoration; the specs require them and the acceptance
criteria test them:

| State | Why it is required |
| --- | --- |
| skeleton | WEB-F-106 — must reserve the final space, no layout shift (CLS < 0.1) |
| empty | WEB-F-044/045 — a conversion occasion, never an error |
| stale | DEC-019 — carries the "Stand: …" freshness label |
| focus-visible | WCAG 2.4.7/2.4.11 (TS-002 D5) |
| hover · active · disabled · loading | ordinary interaction |
| `prefers-reduced-motion` · `prefers-contrast` · dark | TS-002 D4 — three themes, browser-selected, no toggle |
| excluded | `chip` and `tag`: fill removed, `border` outline, label struck through in `muted` — "your calendar leaves this out" |
| active-step | `explain-module`: the current step line and the stage state it shows. A `lime-500` fill on a light ground means *active*, never decoration |
| auto-advance | `explain-module` only — the one exception to the single-motion rule. Under `prefers-reduced-motion` the stage renders **state 1 static** and the step lines remain the control that reaches states 2 and 3 |
| open · active-option | `place-search-overlay`: `aria-expanded` / `aria-activedescendant`, arrow keys, `Enter`, `Escape`; the overlay is out of flow, so opening it shifts nothing (same CLS floor as skeleton) |
| event status | `neu` · `verschoben` · `abgesagt` — a status badge sits **beside** the category badge, never instead of it |

### 4. The binding to content types

Every website content type (TS-007 D5's Zod hierarchy) needs a component
that can render it, and the manifest's `renders` field is where that
binding is declared. This is the layer that turns *specs plus content*
into a page — without it, generation has blocks and text but no rule for
which renders which.

### 5. Token roles the new components need

The components in §1 reference token roles that the package does not carry
yet. SRC-014 names them by role and states what the website does until they
ship; the package is where they belong.

| Role | Demand |
| --- | --- |
| `scrim.*` | An alpha ladder derived from `ink` (light) and `dark.paper` (dark). No component may write a literal `rgba(0,0,0,…)` — TS-017 D3 would reject it anyway, and the neutral hero look has to be expressible as a token |
| `archive.ground` | `#FBF1DC` today, already a literal in `app/styles/brand.css` with a "reconcile" comment |
| `archive.ink` | Must clear 4.5:1 on `archive.ground` **with margin**. `#9A6300` measures exactly 4.50:1 and is therefore a status colour, not this |
| `archive.line` | A tan hairline for the archive ground — `line` measures 1.32:1 on it and is invisible |
| hairline on lime | `line` measures 1.27:1 on `lime-100`. The website uses `lime-400` (1.31:1, the weight `line` has on paper) until a token exists |
| mono display size | The explain module's ordinal (~48 px) and the price figures (~54 px) have no size role |
| `font.letterSpacing.label` | `0.06em` in the package, `0.08em` in SRC-014, ~0.1em in the drafts. SRC-014 settles it at **0.08em**; the package follows or the website records an override |
| `font.size.label` | `0.875rem` (14 px) is below the 15 px floor for a bare kicker. `0.9375rem`, or a recorded website override |
| `color.category` | Five PROVISIONAL keys against SRC-014's six rows. Two taxonomies; one has to be retired. **Not resolved here** — an open decision, and neither artefact changes its taxonomy until it is taken |
| event-status roles | `neu` · `verschoben` · `abgesagt` all clear contrast and none is named in the package |
| `button.treatment` | The package says weighted-base 6 px + 3 px edge; SRC-014, the site and every draft use `radius.pill` with `border: 0`. Record the web variant or retire weighted-base |
| `logo.*` | Four named files sit in `logos/legacy/` and never shipped; the shipped SVG carries `fill="white"` and `#222222`, neither a token; `logos/README.md` says `radius-lg` where SRC-014 and every draft use a full circle |

Where a role is missing, the manifest still references it by name. A
component that inlines a hex because the token is not there is the failure
this contract exists to prevent.

## What is explicitly not needed

Pixel-perfect mockups, an exhaustive Figma library, or documentation
prose. The kit is the visual reference; the manifest is the contract.
Anything not in the manifest is [FREE] for the generator, within TS-002
and TS-017.

## Consequence for the specs

Once the manifest lands, the page specs reference component ids, and
`check:specs` can verify that every component a page names exists — the
same closure the requirement → acceptance criterion → test matrix already
provides.
