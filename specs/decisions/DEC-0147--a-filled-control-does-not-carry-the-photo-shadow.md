---
id: DEC-0147
title: A control with its own opaque fill does not carry the photo-surface text shadow
status: accepted
date: 2026-09-27
decided_by: jan-henrik.hempel
---

## Decision

SRC-0014 §The scrim (`concept/website-design-system.md`) states the photo
surface's text shadow reaches "every piece of type on a photo surface —
display, lead, **button label**, search placeholder." That line is narrowed:
the shadow is for type with **no fill of its own** sitting directly on the
photograph. A control that paints its own opaque background — every `Button`
variant except `quiet` — does not carry it. Its own fill already gives the
label all the contrast the shadow exists to add; on `secondary`'s near-white
pill the shadow added nothing but blur.

Measured, not assumed: on `/dein-kalender`, "Kalender bestellen" (pulse,
`himbeere-600` fill) and "Beratungstermin buchen" (secondary, near-white
fill) both carried the full shadow; only "Meinen Standort verwenden" (quiet,
transparent) needed it (schafe-vorm-fenster-www#8).

## Consequences

- `concept/website-design-system.md` §The scrim: "button label" is qualified
  to the `quiet` variant and to genuine transparent type — not a blanket
  "every button label."
- `src/components/button/button.module.css`: `primaryLight`, `primaryDark`,
  `pulse` and `secondary` each set `text-shadow: none`, at the same
  two-class specificity the component already uses to win regardless of
  CSS-module import order. `quiet` is unchanged.
- `src/components/photo-surface/photo-surface.module.css`'s comment is
  corrected to say why buttons are split from other type, instead of
  grouping them with it.
- Search-field placeholders and other genuinely transparent type keep the
  shadow; this decision is scoped to controls with their own fill.
