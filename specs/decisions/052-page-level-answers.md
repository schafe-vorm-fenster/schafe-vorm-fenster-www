---
id: DEC-052
title: Page-level answers — product name, promotion material, local advertising, newsletter placement, DPA
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decisions

1. **"Portalize" is introduced once**, on `/dein-kalender` at the 480 €
   tier: one sentence saying the calendar under your name is called
   Portalize. The name appears where the offer becomes concrete — so it
   is familiar before it turns up on the invoice, in the subdomain and in
   the embed code. Routes and navigation labels stay free of it
   (DEC-036). → Q-012.
2. **`order-promotion-material` stays unwired.** No page on the website,
   no call site; the goal remains in the hub. The registry entry without
   a call site is deliberate and recorded, not an oversight. → Q-005.
3. **Local advertising appears nowhere.** WEB-C-015's "at most one
   sentence" becomes "no occurrence" while the offering is `withheld` —
   advertising something you do not want to sell produces enquiries
   nobody can serve. The guard checks for absence. → Q-006.
4. **Newsletter: footer everywhere, plus inline on `/ueber-uns`.** A
   reader who has just read the origin story is the warmest signup
   moment. `/ueber-uns` has no primary conversion of its own, so the
   inline block competes with nothing — it is the exception that the
   one-conversion rule (WEB-F-003) allows precisely because that page is
   conversion-less. → Q-007.
5. **The Auftragsverarbeitungsvertrag is public**, as a section of
   `/rechtliches` at the reserved anchor `#auftragsverarbeitung`.
   Municipalities check it *before* buying; publishing it removes a
   procurement hurdle and fits the transparency positioning. → Q-029.

## Amendment 2026-09-24 — §4 re-derived, and the newsletter becomes a goal

§4's justification is spent and is replaced here rather than quietly
kept. `DEC-081` §6 gave `/ueber-uns` a primary conversion — the booking
— so the sentence "the page has no conversion of its own, so the inline
block competes with nothing" is no longer true of any page on this site.
`TS-027` carried that as an open point addressed to this record's owner.
This is the answer, and it is **keep the block**, for a different reason.

### 1. The new justification: two asks, two readiness levels

The block stays because the two asks on that page are **not competing
for the same visitor.** They serve two states a reader can be in when
she reaches the end of the origin story:

| State | Ask | Rung |
| --- | --- | --- |
| ready to talk | the booking | the page's primary conversion (`DEC-081` §6) |
| still looking | the newsletter | secondary, below it |

That is exactly the ladder `DEC-082` introduced: one primary per page,
and every other action sits beneath it at secondary treatment. A reader
who is not ready to book is not converted by making the booking louder;
she is converted by being asked for something smaller, or she leaves
with nothing. Before `DEC-081` this page asked her for nothing at all,
and the old justification was true only because the page was
under-specified.

The withdrawal option is explicitly rejected. Reading the newsletter as
competition for the booking would be correct if the two sat at the same
rung — they do not, and `DEC-082` is what makes the difference
statable.

### 2. Placement and treatment are unchanged

The block keeps the position and weight `TS-027 D8` gives it: after the
team block, before the context band, **secondary treatment, never the
primary marker.** `WEB-F-017` / `TS-027 D1`'s primary stays
`request-product-briefing`. The one-conversion rule (`WEB-F-003`) is not
being excepted here — under `DEC-082` it never needed an exception,
because a secondary ask is not a second conversion declaration.

What §4 asserted as an *exception to* the one-conversion rule is
therefore withdrawn as a construction: it was the right outcome reached
through a rule that `DEC-082` has since replaced.

### 3. The newsletter is now a conversion goal of its own

At the time of §4 the newsletter was not in the model: it existed only
as the `newsletter-whatsapp` surface inside other goals' `measured_on`,
which is why a "newsletter placement" decision could be taken without
naming what a signup pays into. The hub now carries
`subscribe-to-newsletter` in `@schafe-vorm-fenster/goals` (SRC-008).

Consequences for the website: the footer entry and this inline block
both carry a named goal, `TS-016 D1` S5's empty conversion-goal cell is
filled, and `WEB-F-017` gains the id as the page's secondary.

### 4. Two channels, and WhatsApp is preferred

**The newsletter reaches people by e-mail or by WhatsApp, and WhatsApp
is the preferred route.** The preference is the hub record's, with its
reasons; this record carries the consequence for the website, which is
that **a signup surface that offers e-mail only does not satisfy the
goal.** The channel set and what the WhatsApp route needs are
`TS-016 D10`.

Preferred means offered first, not offered alone. E-mail stays a full
route and is fully counted.

### 5. Q-020: the system is chosen, the system does not exist

Stated plainly, because §4 and `TS-027 D8` both depend on it:

- **The question of *which* system is closed.** `DEC-051` resolved
  Q-020: envoy carries signup and double opt-in, as a row of the Q-022
  contract.
- **No sending system is in operation.** Q-022's measurement of
  2026-09-11 records it in as many words — "No newsletter operation
  exists either (Q-020)" — and the envoy widget's delivery date is still
  UNKNOWN (`TS-016 D4` C10). Choosing a system did not produce one.
- **Therefore the block ships only when one does.** Neither the footer
  entry nor this inline block is built before a sending system exists
  and accepts a subscription. A form that collects an address nothing
  sends to is a lead thrown away with a confirmation message on top.
  `TS-016 D10` and `TS-027 D8` already say this; the amendment makes it
  a property of this decision rather than a rule inherited from a
  tactical spec.

Q-020 does not reopen. What is owed is delivery, and it is owed under
Q-022, plus the WhatsApp route of §4, which no system covers today.
