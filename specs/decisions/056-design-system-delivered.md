---
id: DEC-056
title: The design system is delivered and binding
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

`concept/website-design-system.md` is the binding design specification for
the website, with the boards in `concept/v2.0/` as its visual reference.
It closes the contract stated in `specs/contracts/design-system-contract.md`
and lifts the gate DEC-054 held.

Two layers, and neither restates the other:

| Layer | Source |
| --- | --- |
| Tokens — colour, type, space, radius, border, shadow, breakpoints, targets, measure | `@schafe-vorm-fenster/brand-design` v2.6.0 |
| Application — colour roles, type scale by role, components, page rhythm, ratios, reserved space, icons, motion | `concept/website-design-system.md` |

## What it settles

- **Page rhythm** is normative: the order of section types, never two
  photo sections in a row, at most two consecutive sections of one colour
  family, exactly one `himbeere` element per screen, and the dark ink
  section carrying the live data once per page.
- **Reserved space** becomes a rule rather than an aspiration: every box
  that will hold asynchronous content declares its ratio or height before
  the content arrives, as `aspect-ratio`, never a pixel height. This is
  what makes CLS < 0.1 achievable rather than hoped for.
- **Skeletons** are specified down to the hatch, and they do **not**
  animate — the site has exactly one motion, and a pulsing skeleton would
  read as a second. A skeleton standing longer than two seconds is
  replaced by the honest empty state.
- **Icons** are one set only: Lucide, 24 × 24, 2 px stroke, monochrome,
  three sizes. No hand-drawn glyph, no second family.
- **Accessibility** is stated at the design level: body 4.5:1 and display
  3:1 measured against photo *plus* gradient, a 3 px violet focus ring at
  2 px offset on every interactive element, nothing below 15 px, and
  "Atkinson Hyperlegible is the accessibility decision — do not
  substitute."

## Consequences

- Q-023 is resolved; DEC-054's gate is lifted for everything the document
  covers.
- Superseded proposals: TS-017 D2's breakpoint numbers (tokens win),
  TS-002 D3's weight floor (the family ships 400/700 plus 800 for
  display), TS-003's font row (Atkinson, per DEC-043).
- One gap recorded rather than closed: the design system uses weight 800
  for display sizes while the tokens declare only 400 and 700 (Q-042).
- Icons are not a delivery: the specification names the set, and the
  website installs it into its own stack (WEB-C-007). The v2.0 boards
  render without them locally, which is cosmetic.
