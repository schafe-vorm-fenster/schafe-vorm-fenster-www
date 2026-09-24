---
artefact: contract
id: SRC-0013
status: DRAFT
date: 2026-09-10
updated: 2026-09-24
decisions: [DEC-0044, DEC-0054]
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

Delivered as a versioned package like everything else (DEC-0042), so the
website consumes it as a dependency and a change arrives as a version
bump with a changelog.

## What already suffices

**One version number, and it is the package version.** The package is
published as `@schafe-vorm-fenster/brand-design`. `main` carries **2.8.0**
— the npm version, the one `pnpm view` reports, and the one every row below
cites. The website is pinned at the exact version **`0.1.3`**, which is
where the old two-number confusion came from: the token sheet inside
`0.1.3` declares its own `meta.version` `2.6.0`, an editorial kit number
that was then read as a package version. That kit number is not used in
this contract any more. **Every version stated below is a package version.**

Read from the pinned package `0.1.3` — the specs consume these and restate
none of them:

`color` (incl. `dark`, `category`, semantic `roles`) · `font`
(family, weight, size with `clamp()`, lineHeight, letterSpacing, usage) ·
`space` · `breakpoint` (xs…2xl) · `radius` · `border` · `shadow` ·
`target` · `measure` · `logo` · `button` · `categoryDisplay` · `print`.

**PR #447 is merged.** It was squash-merged on **2026-09-23** (merge commit
`a1201c4`), and the version bump landed with the releases that followed
(#449, #451, #455), so the package on `main` is **2.8.0**. Everything §5
marks as *shipped in 2.8.0* is published upstream today; nothing about it
is pending review. Four of the values it shipped are wrong and are
corrected in PR **#464** (open, unmerged, branch
`brand-design/measured-corrections-2026-09-24`).

None of it is consumable here yet: the pin is the exact string `0.1.3`, not
a range, so no upgrade arrives on its own — see *Consuming it* below. Until
the pin moves, the website's stand-ins live in `app/styles/brand.css`
(TS-WEB-0017 D3), never at a call site.

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

**The manifest must cover at least these ids.** SRC-0014 defines each one
visually; the manifest is what makes it generatable. The first block is
what the guide already carried; the second is what the 2026-09-22 review
added.

| id | Variants / notes |
| --- | --- |
| `button` | primary-on-light · primary-on-dark · pulse · secondary · quiet |
| `search-field` | **on-photo · on-ink** — two variants and no third; nested 44 px submit. A light ground is not a variant (SRC-0014 "Search field") |
| `badge` | category · kicker · status · placeholder. Mono **15 px**, 28 px tall, 32 px with an 18 px icon |
| `chip` | default · selected · **excluded**. Mono 15 px, 40 px tall |
| `tag` | the non-tappable 30 px size, mono **15 px**; default · **excluded** |
| `kicker` | **bare** (no pill, 15 px mono, tracking 0.08em) · badge |
| `event-row` | with category icon, colour **and** label; day numeral + month |
| `photo-surface` | **one variant** — neutral-black scrim from `color.scrim.*`, two multi-stop gradients, max `.72`, soft text shadow, focal point per motif. The ink and violet variants are retired (decision 5) |
| `logo` | mark-only · mark + wordmark · mark + URL |
| `icon-well` | 40 px, non-interactive — distinct from the 44 px control well |
| `control-well` | 44 px, interactive |
| `contact-section` | one component, one fixed `lime-100` ground, every page |
| `contact-action-row` | 72 px, two lines, trailing arrow; **filled · outlined** — a visual weight, never a conversion rank. Every row is `data-cta="secondary"` |
| `explain-module` | ordinal · title · three step lines · one **secondary** CTA. **Two layouts at one `min-width` switch (`lg` = 48rem)**: below it a three-state stage with the auto-advance; from it three steps side by side, no stage, no slide |
| `place-search-overlay` | 3–4 rows `Ort (Gemeinde)`, out of flow, combobox keyboard; plus the **non-interactive no-match row** (`TS-WEB-0008 D7a` owns its behaviour and wording) |
| `quote-card` | quote · author with role and organisation · sourced outbound link |
| `event-status-badge` | `neu` · `verschoben` · `abgesagt` |
| `overlay-header` | transparent over a photo; mark, calendar pill, controls on the **blur primitive** (`backdrop-filter`) with the solid `ink` control well as the declared fallback |
| `archive-block` | the "old world" section type: archive ground, archive ink, neutral icons |
| `price-tier-row` | three rows in **one** section, `line` hairline between them |

Two of these carry a rule the manifest has to express, not only name:

- `contact-section` is the single ground in the system that means
  something. Its ground is not a variant and not a prop.
- `explain-module` is the only component allowed to animate, and only
  **below `lg`** (§3).
- `overlay-header` is the only component allowed to declare
  `backdrop-filter`, and it must declare its fallback in the same
  entry — a blur without a stated fallback is not a legal component.
- Exactly **one** `data-cta="primary"` per page (`TS-WEB-0006 D3`).
  `explain-module` and `contact-action-row` are therefore `secondary` by
  definition, not by configuration: neither may take `primary` as a prop
  value (decision 2, 2026-09-23). The manifest expresses that as a fixed
  value, not a default.

### 2. Composition rules

- Container width and outer gutter **per breakpoint — all six**, not
  only at the desktop end. The three switch points below 640 px are the
  reason the scale exists (TS-WEB-0017 D2b), and they are the ones no
  delivered artefact currently gives a container width for.
- Section rhythm: which `space` token separates blocks, and at which of
  the six breakpoints it steps.
- The mobile-first rule stated normatively: `min-width` queries only, one
  component tree, no separate desktop layout.
- How the block order every page carries — focus · argument · context
  band · closing CTA (TS-WEB-0006 D2) — maps onto layout.
- **Section grounds are rhythm, not meaning** (SRC-0014). A generator picks
  a ground from the alternation rule, not from what the section says —
  with one exception the manifest has to encode: `contact-section` keeps
  its fixed ground everywhere and is exempt from the alternation count.
  Problem content takes the archive ground; solution content never takes a
  grey-green one.
- The price tiers are **rows in one section**, not three sections — a
  composition rule, because the consecutive-ground count depends on it.
- **A section carrying a `search-field` takes the `ink` ground** (or is a
  photo surface). The field has only two variants and a light ground is
  neither, so the ground is a property of the *section*, not of the field —
  which is why it belongs here and not in §1. This is what the closing
  block on `/` needs so it stops being white on white (C14).
- **`explain-module` switches layout at `lg` (48rem) and nowhere else.**
  A generator does not choose that breakpoint; it is the component's own
  and the only `min-width` it declares.

### 3. States, named and specified

These are not decoration; the specs require them and the acceptance
criteria test them:

| State | Why it is required |
| --- | --- |
| skeleton | FUN-WEB-0106 — must reserve the final space, no layout shift (CLS < 0.1) |
| empty | FUN-WEB-0044/045 — a conversion occasion, never an error |
| stale | DEC-0019 — carries the "Stand: …" freshness label |
| focus-visible | WCAG 2.4.7/2.4.11 (TS-WEB-0002 D5) |
| hover · active · disabled · loading | ordinary interaction |
| `prefers-reduced-motion` · `prefers-contrast` · dark | TS-WEB-0002 D4 — three themes, browser-selected, no toggle |
| excluded | `chip` and `tag`: fill removed, `border` outline, label struck through in `muted` — "your calendar leaves this out" |
| active-step | `explain-module`: the current step line and the state it shows. A `lime-500` fill on a light ground means *active*, never decoration. From `lg` the active step is highlighted in place — a colour change, not a movement |
| auto-advance | `explain-module` **below `lg` only** — the one exception to the single-motion rule, and an owner decision (decision 8, 2026-09-23), not a component liberty. From `lg` there is no stage and nothing advances. Under `prefers-reduced-motion` the stage renders **state 1 static**. At every size the step lines are buttons: `Tab`, `Enter`/`Space`, `aria-current` — a step is never reachable only by waiting |
| blur-fallback | `overlay-header`: `@supports (backdrop-filter: …)` selects the blur; no support, `prefers-reduced-transparency`, or a route outside `TS-WEB-0003 D1` with the blur applied selects the solid `ink` well. The fallback is a declared state, not an absence |
| open · active-option | `place-search-overlay`: `aria-expanded` / `aria-activedescendant`, arrow keys, `Enter`, `Escape`; the overlay is out of flow, so opening it shifts nothing (same CLS floor as skeleton) |
| event status | `neu` · `verschoben` · `abgesagt` — a status badge sits **beside** the category badge, never instead of it |

### 4. The binding to content types

Every website content type (TS-WEB-0007 D5's Zod hierarchy) needs a component
that can render it, and the manifest's `renders` field is where that
binding is declared. This is the layer that turns *specs plus content*
into a page — without it, generation has blocks and text but no rule for
which renders which.

### 5. Token roles the new components need

The components in §1 reference token roles that the pinned package `0.1.3`
does not carry. SRC-0014 names them by role and states what the website does
until the pin moves; the package is where they belong.

**Two names for one value.** A role is written as its authored path
(`font.letterSpacing.label`, `font.size.label`, `color.archive.ground`) and
reaches a stylesheet as a custom property, which is not always the same
word: `font.letterSpacing.label` emits `--tracking-label`, not
`--letter-spacing-label`. The rows below name the role; `--tracking-label`,
`--font-size-label`, `--color-archive-ground` and the rest are what a
stylesheet writes. Where the two diverge, `tokens/svf-tokens.css` in the
package is the answer — grep it for the property before assuming the name.

Each row states the role, what the website needs, and **where it stands** —
one of three:

- **shipped in 2.8.0** — published upstream, on `main`, correct as it
  stands. It reaches the website when the pin moves and not before.
- **corrected in PR #464 (unmerged)** — shipped in 2.8.0 with a wrong
  value; the measured correction is written and reviewable in PR #464 on
  `brand-design/measured-corrections-2026-09-24`, and is not published.
- **open** — the package does not have it and neither does either PR.

| Role | Demand | Stands |
| --- | --- | --- |
| `scrim.*` | An alpha ladder over a **neutral-black** base, with the stops `0 · .30 · .35 · .38 · .45 · .72`. Decision 5 fixes the base: a scrim is not a surface colour, and a tinted one dyes the photograph. No component may write a literal `rgba(…)` of any colour — TS-WEB-0017 D3 rejects it — so the neutral look has to *be* a token | **Corrected in PR #464 (unmerged).** 2.8.0 shipped the pre-decision shape: `rgba(23,29,13,α)`, derived from `ink`, with stops `0 · .16 · .38 · .72 · .96`. #464 makes the base neutral black — `rgba(0,0,0,α)` — and the ladder `0 · .30 · .35 · .38 · .45 · .72`, and adds `shadow.textOnPhoto` = `0 1px 2px scrim-45, 0 2px 10px scrim-30` so the photo-surface text shadow is a token too |
| `archive.ground` | `#FBF1DC` | **Shipped in 2.8.0** as `color.archive.ground`. Stand-in `--color-placeholder-ground` in `app/styles/brand.css` until the pin moves |
| `archive.ink` | Must clear 4.5:1 on `archive.ground` **with margin**. `#9A6300` measures exactly 4.50:1 and is therefore a status colour, not this | **Shipped in 2.8.0**: `#7A4F00`, measured **6.35:1** on the ground and 6.85:1 on `paper`. Until the pin moves the archive block sets its heading in `ink` (15.37:1) and its body in `text-2` (9.52:1); only the kicker waits (SRC-0014 "Archive") |
| `archive.line` | A tan hairline for the archive ground — `line` measures 1.32:1 on it and is invisible | **Shipped in 2.8.0**: `#DFCB9D`, **1.42:1** on the ground, which is exactly the weight `line` has on `paper` |
| hairline on lime | `line` measures 1.27:1 on `lime-100`. The website uses `lime-400` (1.31:1, the weight `line` has on paper) | **Corrected in PR #464 (unmerged).** 2.8.0 shipped `border.hairlineOnLime` as `lime-300` `#C6E593`, **1.19:1** on `lime-100` — below what it replaces. #464 makes it `lime-500` `#A4D822`, **1.45:1**, which matches `line`'s 1.42:1 weight on `paper` instead of undercutting it. Measured 2026-09-24 |
| mono display size | The explain module's ordinal (~48 px) and the price figures (~54 px) have no size role | **Shipped in 2.8.0**: `font.size.displayMono` (3rem) |
| `font.letterSpacing.label` | One value, `0.08em` | **Shipped in 2.8.0**: `0.06em → 0.08em` |
| `font.size.label` | `0.875rem` (14 px) is below the 15 px floor | **Shipped in 2.8.0**: `0.9375rem`. Website override in `app/styles/brand.css` until the pin moves; at `2.8.x` it is an exact no-op and is deleted |
| **badge / tag / chip sizing** | The roles the components in §1 actually need, and which nothing carries today: a label size **at the 15 px floor** for badge, tag and chip alike (`font.size.label` is that role — the components take it, they do not get a smaller one of their own), and the three heights `badge 28` / `badge-with-icon 32` / `tag 30` / `chip 40` px beside `target.*`. C11 is resolved by **raising the sizes**, not by a badge-only carve-out: `TS-WEB-0002 D3` floors at 15 px, `TS-WEB-0002-A10` asserts it, and the built site already has no `font-size` below 15 px | `font.size.label` **shipped in 2.8.0**; the four heights **open** — `target` carries only the 44 px touch floor |
| `color.category` | The canonical taxonomy is **`@schafevormfenster/rural-event-types` `0.0.1`**, the package inside **`classification-api`** (repo root `3.4.2`), read on **2026-09-24**: four ids — `community-life`, `education-health`, `everyday-supply`, `culture-tourism` — plus `unknown`, the value returned for an event that has not been classified (decision 7, 2026-09-23) | **Keys aligned; two values corrected in PR #464 (unmerged).** The package's five keys *are* that list; SRC-0014's six rows were the outlier and now follow it. (a) `color.categoryStatus` still carries the "PROVISIONAL — … canonical source … was not reachable and has not been read" note in 2.8.0; #464 replaces it with the read source named in the demand column. (b) `community-life.dot` and `.bare` shipped as `himbeere-500` `#E0286E`, which carries **no** legal glyph at badge size — `paper` 4.29:1, `ink` 3.86:1; #464 moves both to `himbeere-600` `#BC1C5A` (5.84:1 with `paper`). Moving the category off the himbeere ramp entirely — himbeere is the pulse — remains **open** |
| event-status roles | `neu` · `verschoben` · `abgesagt` all clear contrast and none is named in the package | **Shipped in 2.8.0**: `color.status.event` |
| `button.treatment` | SRC-0014, the site and every draft use `radius.pill` with `border: 0` | **Shipped in 2.8.0**: an object — `treatment.web` = `pill`, `treatment.print` = `weighted-base`. Nothing retired; read `button.treatment.print` where `button.treatment` was read |
| `logo.*` | The names must match the files that ship, the SVG must carry tokens, and the mark is a full circle | **Shipped in 2.8.0**: the two shipping files named, `fill="white"`/`#222222` replaced by `paper`/`ink`, `logo.radius` = `radius.pill` everywhere including the favicon |

Where a role is missing, the manifest still references it by name. A
component that inlines a hex because the token is not there is the failure
this contract exists to prevent.

## Consuming it: the pin move the website owes

Nothing in §5 reaches the website by waiting. `package.json` pins
`@schafe-vorm-fenster/brand-design` at the exact string `"0.1.3"` — not a
caret, not a tilde — so a published 2.8.0 changes nothing here until
somebody writes the new version down. This is a deliberate **`0.1.3` →
`2.8.x`** upgrade, and it is website work, not upstream work.

**The upgrade is additive.** Measured against the pinned sheet: **25 new
custom properties, none removed.** Only **four** properties the two versions
share change value:

| Property | `0.1.3` → `2.8.x` |
| --- | --- |
| `--color-category-community-life` | new value (and still wrong — PR #464 corrects it to `#BC1C5A`) |
| `--color-category-community-life-bare` | same change, same correction |
| `--font-size-label` | `0.875rem` → `0.9375rem` |
| `--tracking-label` | `0.06em` → `0.08em` |

**What the upgrade settles in `app/styles/brand.css`:**

- `--font-size-label: 0.9375rem` becomes an **exact no-op** — the package
  then ships that value — and is deleted, not kept. Deleting it *before*
  the pin moves drops `chip`, `choice-group`, `scope-picker` and the
  wordmark back to 14 px.
- `--color-placeholder-ground: #FBF1DC` becomes
  `var(--color-archive-ground)`, and then goes away with its call sites.
  **The foreground is not part of that swap.** Moving the archive
  foreground off `--color-status-warning` (`#9A6300`, exactly 4.50:1 on the
  ground) onto `color.archive.ink` (`#7A4F00`, 6.35:1) is a design change
  with its own re-measurement, not a token substitution, and it is owned by
  SRC-0014, not by the upgrade.

**What the upgrade does not touch.** The `--font-sans` override and the
three metric-matched `@font-face` blocks in the same file stay exactly as
they are. They exist because a web font swaps in after first paint
(F-2-68), which is font-loading work the token package has no opinion
about. They are not stand-ins and nothing upstream retires them.

## What is explicitly not needed

Pixel-perfect mockups, an exhaustive Figma library, or documentation
prose. The kit is the visual reference; the manifest is the contract.
Anything not in the manifest is [FREE] for the generator, within TS-WEB-0002
and TS-WEB-0017.

## Consequence for the specs

Once the manifest lands, the page specs reference component ids, and
`check:specs` can verify that every component a page names exists — the
same closure the requirement → acceptance criterion → test matrix already
provides.

**One check is owed, and it is owed by the specs, not by the package.**
Decision 5 replaces the hero's fixed opacity ladder with a measured floor:
the composite of photograph **plus** scrim clears 4.5:1 behind body text and
3:1 behind display type, **per photograph**. `NFR-WEB-0011` already states that
requirement and `DEC-0056` fixes the basis, but nothing asserts it:
`pnpm check:contrast` measures the *token set* (`TS-WEB-0002-A3`) and knows
nothing about photographs, and axe in `e2e/a11y.spec.ts` judges what a page
happened to compose.

What is owed is a `check:contrast` **hero row** — composite the two
gradients over each hero rendition at its declared `object-position`, sample
the display and lead text boxes, take the worst pixel in each against the
type colour, exit non-zero under the floor — and the acceptance criterion
that binds it. It belongs with `TS-WEB-0002` (where the contrast guard lives) and
iterates the per-hero renditions `DEC-0077` and `TS-WEB-0003 D8` already own.
SRC-0014 states the requirement and marks the test as owed rather than
implying one exists; writing the row is the specs owner's, not this
contract's.
