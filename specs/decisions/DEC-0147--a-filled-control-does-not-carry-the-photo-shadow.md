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

**Amended the next day, same issue.** The search field's placeholder ("Dein
Ort") carried the same blur on the home hero. `search-field.module.css`'s
`.input` declares `background: transparent`, which reads as "no fill of its
own" in isolation — but `.input` sits inside `.field`'s opaque
`--color-neutral-paper` pill, the same fill the submit button already opts
out on. An element's own `background` is not the test; whether it sits on
an opaque ground, its own or an ancestor's, is.

## Consequences

- `concept/website-design-system.md` §The scrim: "button label" is qualified
  to the `quiet` variant and to genuine transparent type — not a blanket
  "every button label." "Search placeholder" is removed from the list of
  type that still carries the shadow.
- `src/components/button/button.module.css`: `primaryLight`, `primaryDark`,
  `pulse` and `secondary` each set `text-shadow: none`, at the same
  two-class specificity the component already uses to win regardless of
  CSS-module import order. `quiet` is unchanged.
- `src/components/search-field/search-field.module.css`: `.input` and
  `.input::placeholder` set `text-shadow: none` — the opaque `.field` pill
  around them is the fill, not their own (transparent) `background`.
- `src/components/photo-surface/photo-surface.module.css`'s comment is
  corrected to say why buttons and the search input are split from other
  type, instead of grouping them with it.
- The test, restated so the next instance of this defect is caught the same
  way: a control's own `background` declaration is not what decides whether
  it needs the shadow — whether the rendered element sits on an opaque
  ground, wherever that fill comes from, does.
