---
id: DEC-0116
title: The scrim is composed from the ladder and the header blurs — the choices the photo-surface rewrite had to take, and where the blur's budget condition lives
status: DRAFT
date: 2026-09-25
decided_by: the engineering team
---

## Context

`DEC-0105` §1 fixed the scrim as a ladder (`0 · .30 · .35 · .38 · .45 · .72`,
neutral black, ceiling `0.72`), §2 made the crop follow a focal point, and
§4 defined the blur primitive with a declared fallback. `concept/website-
design-system.md` §*The scrim* said on the same day that *"the component
does not implement it yet"* and named what the rewrite involves. Task T-04 is
that rewrite: `src/components/photo-surface/`, `hero-block`, `site-header`,
`logo`, the `focal` field, and the `check:contrast` hero row that would have
caught the old `color-mix()` to 96 %.

The determinations leave a handful of choices open that the code could not
leave open. They are recorded here, in one place, as `POL-GRADED-BY-IMPACT`
asks. The owner default that concerns this task — every engineer records
their defaults in their own reserved decision record, with a README index
line and a `state/open.md` row per placeholder — is followed; this task
produces no placeholder (its copy is `none`), so it adds no row.

## Decision

1. **The focal point defaults to `50% 40%` on every photo surface, not only
   on heroes.** The task text says "default 50 % 40 % for heroes"; the guide
   says *"never `center` by default"* of the photo surface as such, and a
   `ratio: feature` surface carries the same reading band. One default in one
   place (`photo-surface.module.css`, `background-position:
   var(--photo-focal, 50% 40%)`), no `--photo-focal` token in
   `app/styles/components.css`. The value is a content-side percentage pair:
   `ImageEntrySchema.focal = {x, y}`, both `0–100`, both required when the
   field is present; `RenderableImage.focal` passes it through, and every hero
   call site hands it to the surface as `focal={image?.focal}` — a one-line
   edit in seven page files owned by T-11 … T-16, made here so that T-20's
   per-motif values reach the crop without a second round of wiring.
   `photo-surface` refuses a value outside the frame rather than clamping it
   (`focalPosition`), the same rule `photoUrl` applies to the URL.

2. **The text shadow is inherited, and the flat-ground exception is two
   selectors.** `text-shadow: var(--shadow-text-on-photo)` is declared once,
   on `.surface`, and inherits to the display, the lead, the kicker badge and
   every link. Form controls do not inherit it (the user-agent sheet resets
   them), so `.surface :where(button, input, select, textarea)` and their
   `::placeholder` take `inherit` — the button label and the search
   placeholder the guide names. An overlay that opens from the surface onto
   its own flat paper ground — the place-search listbox, a dialog — is reset
   to `none`, because *"type on any flat ground carries no shadow"* outranks
   *"every piece of type on a photo surface"* for an element that is on a
   flat ground. Nothing else in the repository declares a `text-shadow`.

3. **The content-anchored second scrim is deleted, not re-tuned.** The
   `.content::before` gradient (0.82 → 0.96) existed so a long headline would
   still sit on a dark band. Its floor and its end are the retired ladder; the
   reading band replaces it, and a hero whose stack outgrows the band takes
   shorter copy or a different crop, never a darker scrim (DEC-0105 §2). The
   reserved photograph band (`55svh`) stays: it is about how much picture is
   visible, not about the scrim.

4. **The CTA slot is a column at every width.** `hero-block`'s `.cta` is
   `display: flex; flex-direction: column; gap: var(--space-3)` with no
   breakpoint variant — the 2026-09-23 draft draws the two conversions
   stacked on the phone and the guide draws nothing else. A button, or the
   conversion-tracker `span` around one, keeps its own width
   (`align-self: flex-start`); a search module handed in as the conversion
   (`/dein-ort` S0) stays a full-width block. The home page's search under the
   CTA slot moves to its own `.search` class so the column rule cannot
   shrink-wrap it.

5. **`gradient` stays in both interfaces as a documented no-op.** `/ueber-uns`
   still passes `gradient="ink"`; the prop selects nothing, and T-14 / T-19
   remove it. The `.ink` and `.violet` classes are gone.

6. **The blur primitive is two custom properties, and the mark carries it
   although the shipped mark is opaque.** The header publishes
   `--header-well` (the tint) and `--header-blur` (the filter) exactly as it
   already published the well; the 44 px wells and the logo's 40 px mark read
   them, so `logo.module.css` never has to know the header's state. The
   declaration order is the fallback order: the solid `ink` well first, then
   `@supports (backdrop-filter: blur(12px))` sets `scrim-38` +
   `blur(12px) saturate(120%)`, and `@media
   (prefers-reduced-transparency: reduce)` inside it puts the ink well back.
   The `scripting: none` branch and the overlay dialog reset both properties.
   The mark asset `@schafe-vorm-fenster/brand-design/logo.svg` paints an
   opaque paper rectangle, so on the mark the treatment is currently invisible
   behind the asset; it is declared anyway, because the guide defines the
   primitive on the mark's shape and the asset is the package's to change
   (TS-WEB-0017-A6 forbids a logo file here).

7. **The performance condition is a measured-run judgement, and this record
   is where a route takes the fallback.** DEC-0105 §4: the blur is legal
   only while a route stays inside `TS-WEB-0003 D1` with it applied. No
   Lighthouse run was made in this task; the blur ships on every hero route.
   When the measured run (`TS-WEB-0003 D4`) shows a route out of budget, that
   route's header sets `--header-blur: none; --header-well:
   var(--color-neutral-ink)` — the same declaration the reduced-transparency
   branch uses — and this record is amended with the route and the numbers.
   The budget wins; the switch is one declaration, not a redesign.

8. **`prefers-reduced-transparency` joins `TS-WEB-0002 D4` as `[PROPOSED]`.**
   One line, no renumbering, no status promotion; the open point on that spec
   now says the line exists and what is still open (its status, and that no
   criterion asserts the fallback under the preference — Playwright cannot
   emulate it). No new acceptance criterion is minted here.

9. **The `check:contrast` hero row is static and reads the stylesheet.** It
   parses the `--color-scrim-*` ladder off the installed token sheet (neutral
   black, alpha per name, the six stops present, none above `0.72`) and the
   two `linear-gradient()` bodies off `photo-surface.module.css` (exactly two,
   scrim tokens only, no `color-mix()`, no stop above the ceiling). It adds
   one measured pair: paper on the ceiling over a **white** pixel, `8.85:1`,
   so the ceiling can carry body text at its worst. It does not open an image
   — the photograph's half of the pair is the motif rule (DEC-0105 §2). It
   counts as one row in the check's tally.

10. **`e2e/site-header.spec.ts` is touched, minimally.** Two of its
    assertions read the well as opaque `ink` over the hero; under the blur
    primitive a browser with `backdrop-filter` computes `scrim-38`. The
    assertions now branch on `CSS.supports`. `e2e/cta-contrast.spec.ts` needed
    no code change — its ground walk already takes the last stop above 0.5
    alpha, which is now the `0.72` ceiling over white — only its comment.
    `e2e/photo-surface.spec.ts` is new and asserts the ladder, the shadow,
    the blur and the CTA stack as composed.

## Consequences

- `pnpm check:contrast` fails the day the surface composes a stop above
  `0.72`, a tinted scrim, or a third gradient — the assertion the guide said
  *"would fail today"* is in, and it passes: `69 token pair(s) across 4
  theme(s), plus the hero row (scrim ceiling 0.72) — no errors`.
- Every hero on the site is one treatment; the municipal violet path has no
  photo variant any more, as the design-system contract's `photo-surface`
  row says.
- Contrast on a photo surface is now two halves with two owners: the ladder
  (this repository, measured) and the motif (the editorial gate, T-20's
  `focal` values and the "wrong photograph" rule). A hero whose text lands
  on the band's light end is a crop or a copy problem, and is answered there.
- What this record does **not** do: it does not measure the blur's cost.
  Item 7 says where the result of that measurement lands.
