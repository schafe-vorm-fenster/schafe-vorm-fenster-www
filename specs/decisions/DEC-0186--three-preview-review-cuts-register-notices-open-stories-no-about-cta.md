---
id: DEC-0186
title: Three cuts from the owner's preview review — no Google notices on the register route, open stories on /ueber-uns, no closing CTA on /ueber-uns
status: accepted
date: 2026-10-29
decided_by: jan-henrik.hempel
---

## Context

The owner's review of the preview on 2026-10-29 found three things that read
worse than their absence.

## Decision

1. **`/mitmachen/registrieren` carries no notice and no new-tab link.** The
   paragraph "Google stellt das Formular bereit …", the link "Formular direkt
   öffnen" and its marking "Daten gehen an Google" are removed. The framed form
   says at its foot that Google Forms provides it, and the marking was wrong
   anyway: the answers go into the organisation's own Google Sheet, not to
   Google as a recipient. The page is the heading, the frame and the context
   band. This amends DEC-0176 §3 and its amendment of 2026-10-28; the handover
   is still counted once when the visitor moves on inside the form. `/start` is
   unchanged. TS-WEB-0023-A19 and A20 are no longer asserted on the route.
2. **The stories of chapter 03 on `/ueber-uns` stand open.** The accordion of
   DEC-0175 §1 is dropped: toggling made the section harder to read than
   showing everything. Each story is the kicker, the record's claim as a pull
   quote under a large opening quote mark, and the story indented under a
   violet rule. One column at every width, nothing hidden, nothing toggled.
   TS-WEB-0027-A17 is asserted as "every story open" instead of "opens and
   closes in place".
3. **`/ueber-uns` has no closing CTA.** The single "Videotermin buchen" button
   before the context band is removed: the contact section follows the band
   closely, so the button only repeated it. DEC-0082 amendment C made that
   button the page's one primary conversion; the page now has no
   `data-cta="primary"`. `PageFrame` takes `closing: { variant: "none" }` for
   this. TS-WEB-0027-A1/A10 are asserted as "no primary, no `#closing-cta`".

## Consequences

`/ueber-uns` has no primary conversion of its own; the contact section is the
way forward. If the page is to carry one again, DEC-0082 amendment C is the
starting point.

The coverage budget (`specs/verification/coverage-budget.json`, DEC-0141) moves
in the same commit: MISSING 144 → 146. TS-WEB-0023-A19 (notice above the frame)
and A20 (new-tab link as handover) are let go because the elements they
asserted are removed by item 1; no other criterion loses its instrument.
