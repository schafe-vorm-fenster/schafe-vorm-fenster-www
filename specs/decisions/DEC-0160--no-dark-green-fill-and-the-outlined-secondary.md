---
id: DEC-0160
title: The pin moves to brand-design 2.9.0, dark green leaves every fill, and a secondary action on a light ground is outlined in ink
status: accepted
date: 2026-10-13
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-12 (DEC-0154, DEC-0155) left four colour points
open after the `ink` decision:

- `@schafe-vorm-fenster/brand-design` **2.9.0** (neutral-black `ink`) was not
  yet the pin, so `app/styles/brand.css` carried an interim override of eight
  declarations (issue #19).
- A `secondary` button is a `paper` pill and disappears on a `paper` or
  `lime-100` ground (issue #28, `Q-0091`, SRC-0014 *Open decisions* 7). Five
  labels were listed as known failures in `e2e/cta-visible.spec.ts`
  (`TS-WEB-0017-A29`).
- `lime-700` to `lime-950` were still used as fills: the hover of every `ink`
  control, the "Amtlich" badge, the dark chip, and kicker badges in the boards
  (issue #57). The owner asked for a hover colour on black, and for a colour
  for "Amtlich" and the kicker badges.
- `e2e/a11y.spec.ts` failed on `/` and `/en` at 360 and 1280 px in the
  production build: axe `color-contrast (serious) ×1`.

## Decisions

1. **The pin is `2.9.0`, exact** (DEC-0044). `package.json`, the lockfile and
   TS-WEB-0017 D3 carry it. The interim block in `app/styles/brand.css` is
   deleted *after* the pin moved. `TS-WEB-0017-A28` now reads `#000000` from
   the package itself. Issue #19 (the date section on `/` read as dark green)
   is closed by it: the ink ground is the package's neutral black.
2. **A secondary action on a light ground is transparent, with a 2 px `ink`
   border and an `ink` label** (answers `Q-0091`, option (c)). The border is a
   fourth named border exception in SRC-0014. "Light ground" means `paper`,
   `surface`, `surface-2`, `lime-100` and `lime-500`. Hover fills the control
   `ink` with a `paper` label. A dark ground (`ink`, `violet-500`, a photograph)
   keeps the `paper` pill. The ground publishes the pair as custom properties
   (`--ground-secondary-*`), the same mechanism as `--ground-primary-*`, so
   `button` and `outbound-link` read it and no caller passes a tone.

   Measured: `ink` on `paper` 20.17:1, on `surface` 18.51:1, on `lime-100`
   17.95:1, on `lime-500` 12.42:1. The border is the label colour, so the
   control's edge has the same ratio against its ground. All five `#28` labels
   are out of `KNOWN`, and A29 passes on every route at 390 and 1280 px.
3. **No fill from `lime-700` to `lime-950`** (issue #57). Dark green is for
   text, links and icons.
   - **Hover on an `ink` fill → `text-2` `#39412C`**, the darkest step of the
     neutral ramp above `ink`. The token sheet has no neutral grey between
     `ink` and `text-2`. Label contrast: `paper` 10.26:1, `lime-500` 6.32:1.
     It applies to the primary button, the header CTA, the search submit, the
     contact row, the form-host submit and the selected chip.
   - **The dark chip** (`chip.dark`, on `ink`, `lime-500` or a photo) is
     `text-2` with `paper`, 10.26:1.
   - **"Amtlich" → `ink` with `paper`**, 20.17:1, the guide's tag pairing. On
     an `ink` ground (`section-shell` `.ink`/`.violet500`, a photo surface, a
     dark event list) it takes the `paper` pill with `ink` instead, so the badge
     never matches its ground.
   - **Kicker badges → `ink` with `paper`** wherever one was dark green (the
     four boards in `concept/v2.0/`). The code's `accent` kicker was already
     `lime-500` with `ink` (12.42:1) and stays, because it sits on `ink` and on
     photographs, where an `ink` pill would disappear.
   - **`TS-WEB-0017-A30`** (`check:brand`) fails a `background`,
     `background-color` or `fill` in `app/**/*.css` or `src/**/*.css` that names
     `lime-700` to `lime-950`. It also fails such a declaration that reads a
     custom property carrying one of them (aliases are followed), and a board
     background that writes their hex. Unit-tested in
     `scripts/check-brand.test.ts`.
4. **Meta text is ground-aware** (the a11y failure). The culprit was
   `closing-cta`'s reassurance line ("Kostenlos, ohne Anmeldung, dauerhaft."),
   which named `muted` itself. On the `ink` closing block of `/` that measures
   **3.53:1**. A new `--ground-meta` is `muted` on light (5.70:1 on `paper`),
   and `section-shell`'s dark grounds and the photo surface republish it as
   `lime-300` (15.03:1 on `ink`, 5.83:1 on `violet-500`).

## Consequences

- SRC-0014 *Open decisions* 7 is closed, and §Button, §Neutrals, §Lime and
  the border exceptions are updated. The contract notes the pin and the
  dark-green rule.
- `TS-WEB-0017` D3 records `2.9.0`. A29 lists only `#41`. A30 is new.
- `text-2` carries the lime hue at low chroma (R 57, G 65, B 44). As a hover
  it shows for a moment and only on a control, never as a surface. If the owner
  reads it as green, the fix belongs upstream: a neutral grey step in
  `brand-design`, followed by a pin move. It is not fixed here with a literal.
- The PNG renders of the boards in `concept/v2.0/assets` were not
  re-rendered.

## Amendment 2026-10-13: the hover is neutral grey, not `text-2`

`text-2` (`#39412C`, R 57 G 65 B 44) is the lime hue at low chroma. As a fill it
reads as the dark green the owner removed (issues #19, #57), the defect this
record exists to close. The hover of an `ink` fill and the dark chip therefore
take `--fill-ink-hover` (`app/styles/components.css`): `ink` mixed with 18 %
`paper`, ≈ `#2D2D2C`, a neutral grey built from tokens only. Contrast: `paper`
13.24:1, `lime-500` 8.16:1. `text-2` stays a text colour. A neutral grey step in
`@schafe-vorm-fenster/brand-design` would replace the mix; until one ships, the
mix is the value.
