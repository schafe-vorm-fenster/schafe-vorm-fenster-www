---
artefact: contract
id: SRC-0013
status: DRAFT
date: 2026-09-10
updated: 2026-09-25
decisions: [DEC-0044, DEC-0054, DEC-0104]
---

# Design System Contract

What the website needs from the mobile-first styleguide in order to
generate its visual layer. Written as an expectation against
`@schafe-vorm-fenster/brand-design`, not as a design brief.

## The guide it binds is specification, not input

`concept/website-design-system.md` (SRC-0014) is **specification-side**
(DEC-0104 §3): it is prescriptive — components, measures, token values — so a
spec that contradicts it is a defect in the spec, not a licence to deviate.
**This contract is the binding**: a guide rule reaches the build through a row
here and nowhere else, because DEC-0080 §4's rule holds for the design layer
too — a rule with no mechanism is advice. The guide keeps `status: draft` and
keeps its place in `concept/`; DEC-0104 §3 says why the file did not move.

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
published as `@schafe-vorm-fenster/brand-design`, and **`latest` is 2.8.1**
(published 2026-09-24T10:39:38Z; the published set is `0.1.0`, `0.1.1`,
`0.1.2`, `0.1.3`, `2.6.0`, `2.7.0`, `2.8.0`, `2.8.1`). **The website is pinned
at the exact version `2.8.1` since 2026-09-25**, where it was pinned at
`0.1.3`. That old pin is where the two-number confusion came from: the token
sheet inside `0.1.3` declares its own `meta.version` `2.6.0`, an editorial kit
number that was then read as a package version — and `2.6.0` also exists as a
real package version, published 2026-09-15, which is what made the confusion
survive being noticed. That kit number is not used in this contract any more.
**Every version stated below is a package version.**

Read from the pinned package `2.8.1` — the specs consume these and restate
none of them:

`color` (incl. `dark`, `category`, semantic `roles`) · `font`
(family, weight, size with `clamp()`, lineHeight, letterSpacing, usage) ·
`space` · `breakpoint` (xs…2xl) · `radius` · `border` · `shadow` ·
`target` · `measure` · `logo` · `button` · `categoryDisplay` · `print`.

**PR #447 is merged.** It was squash-merged on **2026-09-23** (merge commit
`a1201c4`), and the version bump landed with the releases that followed
(#449, #451, #455), so **2.8.0** carries it. Four of the values it shipped
were wrong; PR **#464** corrected all four and **2.8.1** publishes them, so
§5 no longer marks anything *corrected in PR #464 (unmerged)*.

**All of it is consumable here since 2026-09-25**, because the pin moved to the
exact string `2.8.1` — see *Consuming it* below. The two stand-ins that lived in
`app/styles/brand.css` (TS-WEB-0017 D3) are deleted with it, in that order.

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
| skeleton | FUN-WEB-0198, FUN-WEB-0199, FUN-WEB-0200, CON-WEB-0089, CON-WEB-0090 — must reserve the final space, no layout shift (CLS < 0.1) |
| empty | FUN-WEB-0153, FUN-WEB-0154, FUN-WEB-0045 — a conversion occasion, never an error |
| stale | DEC-0019 — carries the "Stand: …" freshness label |
| focus-visible | WCAG 2.4.7/2.4.11 (TS-WEB-0002 D5) |
| hover · active · disabled · loading | ordinary interaction |
| `prefers-reduced-motion` · `prefers-contrast` · dark | TS-WEB-0002 D4 — three themes, browser-selected, no toggle |
| excluded | `chip` and `tag`: fill removed, `border` outline, label struck through in `muted` — "your calendar leaves this out" |
| active-step | `explain-module`: the current step line and the state it shows. A `lime-500` fill on a light ground means *active*, never decoration. From `lg` the active step is highlighted in place — a colour change, not a movement |
| auto-advance | `explain-module` **below `lg` only** — the one exception to the single-motion rule, and an owner decision (decision 8, 2026-09-23; trigger and end per `DEC-0105 §6` as amended 2026-09-25), not a component liberty. It **starts on the first intersection of the whole module with the viewport, never on load**, gives state 1 a full dwell first, runs **one pass** of 9.1 s and **stops at state 3** — no loop, no restart on scrolling back, and any interaction ends it for good. From `lg` there is no stage and nothing advances. Under `prefers-reduced-motion` the stage renders **state 1 static**. At every size the step lines are buttons: `Tab`, `Enter`/`Space`, `aria-current` — a step is never reachable only by waiting, and they are the mechanism **WCAG 2.2.2** requires (`TS-WEB-0002 D7`) |
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

The components in §1 reference token roles that the pinned package `2.8.1`
does not carry. Since the pin moved on 2026-09-25 this list is short: the four
rows that read *corrected in PR #464 (unmerged)* are published and installed,
and what is left **open** is open in every published version. SRC-0014 names
each by role and states what the website does meanwhile.

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

- **shipped in 2.8.0** — published upstream and correct as it stands.
  **Installed here since the pin moved to 2.8.1 on 2026-09-25.**
- **corrected in PR #464, shipped in 2.8.1** — 2.8.0 shipped a wrong value and
  the measured correction is published. All four rows that read *corrected in
  PR #464 (unmerged)* until 2026-09-25 are in this state, and each states the
  value read from the installed package.
- **open** — the package does not have it, in any published version.

| Role | Demand | Stands |
| --- | --- | --- |
| `scrim.*` | An alpha ladder over a **neutral-black** base, with the stops `0 · .30 · .35 · .38 · .45 · .72`. Decision 5 fixes the base: a scrim is not a surface colour, and a tinted one dyes the photograph. No component may write a literal `rgba(…)` of any colour — TS-WEB-0017 D3 rejects it — so the neutral look has to *be* a token | **Corrected in PR #464, shipped in 2.8.1.** 2.8.0 shipped the pre-decision shape: `rgba(23,29,13,α)`, derived from `ink`, with stops `0 · .16 · .38 · .72 · .96`. 2.8.1 ships the neutral-black base and the full ladder — read in the installed sheet: `--color-scrim-0/30/35/38/45/72` = `rgba(0,0,0,0 / 0.30 / 0.35 / 0.38 / 0.45 / 0.72)`, with `.16` and `.96` retired — and `shadow.textOnPhoto` = `0 1px 2px var(--color-scrim-45), 0 2px 10px var(--color-scrim-30)`. **The `photo-surface` component still does not implement the ladder**, which is a rewrite and not a token swap; SRC-0014 *Photo surface* owns it |
| `archive.ground` | `#FBF1DC` | **Shipped in 2.8.0** as `color.archive.ground`, installed. The `--color-placeholder-ground` stand-in is **deleted** (2026-09-25): its one call site, `--placeholder-ground` in `app/styles/components.css`, reads `--color-archive-ground`, and `scripts/check-contrast.ts` measures that token. The production stylesheet emits `--color-archive-ground: #fbf1dc` and no `--color-placeholder-ground` |
| `archive.ink` | Must clear 4.5:1 on `archive.ground` **with margin**. `#9A6300` measures exactly 4.50:1 and is therefore a status colour, not this | **Shipped in 2.8.0**: `#7A4F00`, measured **6.35:1** on the ground and 6.85:1 on `paper`. Until the pin moves the archive block sets its heading in `ink` (15.37:1) and its body in `text-2` (9.52:1); only the kicker waits (SRC-0014 "Archive") |
| `archive.line` | A tan hairline for the archive ground — `line` measures 1.32:1 on it and is invisible | **Shipped in 2.8.0**: `#DFCB9D`, **1.42:1** on the ground, which is exactly the weight `line` has on `paper` |
| hairline on lime | `line` measures 1.27:1 on `lime-100`. The website used `lime-400` (1.31:1, the weight `line` has on paper) as an interim | **Corrected in PR #464, shipped in 2.8.1.** 2.8.0 shipped `border.hairlineOnLime` as `lime-300` `#C6E593`, **1.19:1** on `lime-100` — below what it replaces. 2.8.1 makes it `lime-500` `#A4D822`, **1.45:1**, which matches `line`'s 1.42:1 weight on `paper` instead of undercutting it. Measured 2026-09-24; read in the production stylesheet as `--border-hairline-on-lime: 1px solid #a4d822`, so the `lime-400` interim is retired |
| mono display size | The explain module's ordinal (~48 px) and the price figures (~54 px) have no size role | **Shipped in 2.8.0**: `font.size.displayMono` (3rem) |
| `font.letterSpacing.label` | One value, `0.08em` | **Shipped in 2.8.0**: `0.06em → 0.08em` |
| `font.size.label` | `0.875rem` (14 px) is below the 15 px floor | **Shipped in 2.8.0**: `0.9375rem`, installed. The `app/styles/brand.css` override is **deleted** (2026-09-25), after the pin moved and not before. Measured in the production stylesheet: `--font-size-label: .9375rem` with no override behind it, and 0 of 147 literal `font-size` declarations below 15 px |
| **badge / tag / chip sizing** | The roles the components in §1 actually need, and which nothing carries today: a label size **at the 15 px floor** for badge, tag and chip alike (`font.size.label` is that role — the components take it, they do not get a smaller one of their own), and the three heights `badge 28` / `badge-with-icon 32` / `tag 30` / `chip 40` px beside `target.*`. C11 is resolved by **raising the sizes**, not by a badge-only carve-out: `TS-WEB-0002 D3` floors at 15 px, `TS-WEB-0002-A10` asserts it, and the built site already has no `font-size` below 15 px | `font.size.label` **shipped in 2.8.0**; the four heights **open** — `target` carries only the 44 px touch floor |
| `color.category` | The canonical taxonomy is **`@schafevormfenster/rural-event-types` `0.0.1`**, the package inside **`classification-api`** (repo root `3.4.2`), read on **2026-09-24**: four ids — `community-life`, `education-health`, `everyday-supply`, `culture-tourism` — plus `unknown`, the value returned for an event that has not been classified (decision 7, 2026-09-23) | **Keys aligned; two values corrected in PR #464 (unmerged).** The package's five keys *are* that list; SRC-0014's six rows were the outlier and now follow it. (a) `color.categoryStatus` carried the "PROVISIONAL — … canonical source … was not reachable and has not been read" note through 2.8.0; **2.8.1** replaces it with the read source named in the demand column, and the installed note begins "Read 2026-09-24 from the canonical source: packages/rural-event-categories/src/types/ruralEventCategory.ts in classification-api". (b) `community-life.dot` and `.bare` shipped as `himbeere-500` `#E0286E`, which carries **no** legal glyph at badge size — `paper` 4.29:1, `ink` 3.86:1; **2.8.1** moves both to `himbeere-600` `#BC1C5A` (5.84:1 with `paper`), read in the production stylesheet as `--color-category-community-life: #bc1c5a`. Moving the category off the himbeere ramp entirely — himbeere is the pulse — remains **open** |
| event-status roles | `neu` · `verschoben` · `abgesagt` all clear contrast and none is named in the package | **Shipped in 2.8.0**: `color.status.event` |
| `button.treatment` | SRC-0014, the site and every draft use `radius.pill` with `border: 0` | **Shipped in 2.8.0**: an object — `treatment.web` = `pill`, `treatment.print` = `weighted-base`. Nothing retired; read `button.treatment.print` where `button.treatment` was read |
| `logo.*` | The names must match the files that ship, the SVG must carry tokens, and the mark is a full circle | **Shipped in 2.8.0**: the two shipping files named, `fill="white"`/`#222222` replaced by `paper`/`ink`, `logo.radius` = `radius.pill` everywhere including the favicon |

Where a role is missing, the manifest still references it by name. A
component that inlines a hex because the token is not there is the failure
this contract exists to prevent.

## Consuming it: the pin move the website owes

**Done, 2026-09-25.** `package.json` pins
`@schafe-vorm-fenster/brand-design` at the exact string `"2.8.1"` — where it
pinned `"0.1.3"`. It stays **exact**, not a caret or a tilde: `stack.allow.json`
records the reason with DEC-0044, *"pinned exact so a brand change arrives as a
reviewable version bump"*, and `scripts/check-stack.ts` A7 fails a range and
checks that the lockfile resolves the same version. A caret would also let a
future release move values that every row of §5 states as measured, which is
the drift this contract exists to catch. `2.8.1` is `latest` at the time of the
move, so nothing is left behind by choosing exactness.

Nothing in §5 reached the website by waiting, which is why this was website work
rather than upstream work.

**The upgrade is additive.** Measured against the pinned sheet: **25 new
custom properties, none removed.** Only **four** properties the two versions
share change value:

| Property | `0.1.3` → `2.8.x` |
| --- | --- |
| `--color-category-community-life` | `#BC1C5A` — 2.8.0's new value was still wrong and 2.8.1 carries the correction |
| `--color-category-community-life-bare` | same change, same correction |
| `--font-size-label` | `0.875rem` → `0.9375rem` |
| `--tracking-label` | `0.06em` → `0.08em` |

**What the upgrade settled in `app/styles/brand.css`, and in which order:**

1. The pin moved first, and the install was verified: `2.8.1` in
   `node_modules`, with the four corrected values read out of
   `tokens/svf-tokens.css`.
2. `--font-size-label: 0.9375rem` was then deleted as an **exact no-op** — the
   package ships that value. Deleting it *before* the pin moved would have
   dropped `chip`, `choice-group`, `scope-picker` and the wordmark back to
   14 px, which is why the order is stated rather than assumed. Measured after:
   the production stylesheet carries `--font-size-label: .9375rem` from the
   package, and 0 of its 147 literal `font-size` declarations are below 15 px.
3. `--color-placeholder-ground: #FBF1DC` was deleted **with** its call sites
   rather than kept as `var(--color-archive-ground)`: one alias for one value in
   one place is a second name, not a layer. `--placeholder-ground` in
   `app/styles/components.css` reads `--color-archive-ground`, and
   `scripts/check-contrast.ts` measures the same token — necessarily, because
   `readTokenBlocks` keeps only `#hex` declarations and would not have followed
   a `var()` indirection. The pair it measures is unchanged:
   `--color-status-warning` on the ground, at 4.50:1, and the `why` now says so
   instead of repeating SRC-0014's 6.0:1 claim.
   **The foreground is not part of that swap.** Moving the archive foreground
   off `--color-status-warning` (`#9A6300`, exactly 4.50:1 on the ground) onto
   `color.archive.ink` (`#7A4F00`, 6.35:1) is a design change with its own
   re-measurement, not a token substitution, and it is owned by SRC-0014.

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

**The hero row this section used to owe is withdrawn** (DEC-0105 §1,
2026-09-25). Decision 5 was read here as replacing the hero's fixed opacity
ladder with a measured floor — *"the composite of photograph plus scrim …
per photograph"* — and what was owed was a `check:contrast` hero row that
composited the two gradients over each rendition at its declared
`object-position`, sampled the display and lead text boxes and took the worst
pixel. Nothing performed it, no acceptance criterion bound it, and it is not
practical on every build for a photograph set that is not chosen yet.

**The ladder is fixed instead**, with its `0.72` ceiling (§5's `scrim.*` row),
and `NFR-WEB-0058`/`NFR-WEB-0059` now carry the composite qualification in
their own statements rather than in a Notes block. `pnpm check:contrast`
measures the *token set* (`TS-WEB-0002-A3`), which is the layer the fixed
ladder puts the scrim half of the pair into; axe in `e2e/a11y.spec.ts` judges
what a page happened to compose. The photograph half is SRC-0014's crop and
focal-point rules and `DEM-0027`, not a number.

**What is still owed, and it is the specs' and the component's, not this
contract's:** the `photo-surface` rewrite onto the neutral ladder — the
component still composes `color-mix()` to 82 %, 84 % and 96 % from `ink`, which
is the retired ink-tinted scrim and a step above the ceiling — and, with it,
the static assertion of the ceiling plus the acceptance criterion that binds
it. The assertion is deliberately not added first: against today's component it
would fail, and a check that fails is not a check.
