---
id: DEC-0094
title: The four buried business rules are their own artefacts — and the one constraint filed as a functional requirement
status: accepted
date: 2026-09-24
decided_by: jan-henrik.hempel
---

## Context

DEC-0087 §2 ran the classification tree over all 155 statements, found exactly
one business rule, and named four more that carry one without being one:

> Four statements **carry** a business rule without being one, and are left
> alone. The method's own trap says why:
>
> > A business rule and the requirement that applies it are two artefacts. The
> > rule without a system subject; the requirement with one, depending on the
> > rule. Merging them hides the rule from every other consumer of it.
>
> Splitting each into a rule plus the requirement that applies it makes four
> new artefacts. That is extraction, not migration, and it is owed.

This is that extraction, and with it one misfiling DEC-0093 held back because
it belongs to the same question of what class a statement is in.

## Decision

### 1. Four rules come out, each with the requirement that applies it

The test is question 1 of
`@leafcutter-strict/method-requirement-classification`: *"Does it hold
independently of any executor?"* Each of these four does — none has a system
subject, and each is true whether a website, a person, a price list or nobody
applies it.

| Rule | As written | Applied by |
| --- | --- | --- |
| `BUS-WEB-0013` | For an enterprise engagement, the price is a quotation and not a list rate. | `FUN-WEB-0201` |
| `BUS-WEB-0014` | For brand ownership, the AI-coaching track belongs to a brand other than Schafe vorm Fenster. | `CON-WEB-0092` |
| `BUS-WEB-0015` | For a village-calendar licence, the billable unit is the organisation and not the place, the municipality or the region, and the number of places is unlimited. | `FUN-WEB-0202` |
| `BUS-WEB-0016` | For a quote request, the answer is due within two working days of its receipt. | `FUN-WEB-0203` |

All four are in the B form — `<condition>`, `<subject>` `<is or counts as>`
`<consequence>` — with no modal and no actor, because a rule that needs a
SHALL has an executor and is not a rule.

**What the merge was hiding, case by case.** This is the part worth recording,
because "the method says so" is not a reason:

- **`BUS-WEB-0015`** sat inside a *pricing display* requirement. The rule it
  states — the licence is billed per organisation with no place limit —
  governs the order flow, the invoice step and every quotation, none of which
  is a display. A reader of the checkout requirements had no way to reach it.
- **`BUS-WEB-0016`** sat inside a requirement about what the region page says.
  The two-working-day promise binds the lead-handling process behind the
  envoy widget whether or not any page mentions it; stated as a page
  requirement it read as a piece of copy.
- **`BUS-WEB-0013`** sat inside a publishing constraint, so "enterprise is
  priced on request" looked like a rule about the website rather than about
  the offering.
- **`BUS-WEB-0014`** sat inside a scope boundary, so a fact about who owns a
  brand read as a decision about one website's navigation.

Three parent statements carried a third clause as well, and each went to the
artefact that already holds it: the `promotion: withheld` clause to
`CON-WEB-0015`, the published-price limit to the new `CON-WEB-0091`, and the
enterprise price to `BUS-WEB-0013` and `FUN-WEB-0201`.

### 2. `FUN-WEB-0087` is a constraint, and it keeps its number

> Page copy production happens after this specification phase (project rule);
> specs use placeholders.

Nothing about that is something the website does. It is imposed from outside
the work by a decision already taken — DEC-0023 — which is question 2 of the
classification tree, so it is a constraint. It is `CON-WEB-0087`, the same
number, which was free in the constraint class.

It is also the second limit of `CON-WEB-0006`'s original statement ("the
specification method … ; specs precede content"). DEC-0093 recast that one to
carry the method only, on the understanding that the ordering rule has its own
artefact. This is it.

### 3. The parents, and what became of them

| Parent | Outcome |
| --- | --- |
| `CON-WEB-0011` | split into `BUS-WEB-0013` · `CON-WEB-0091` · `FUN-WEB-0201` |
| `CON-WEB-0013` | split into `BUS-WEB-0014` · `CON-WEB-0092` |
| `FUN-WEB-0020` | split into `BUS-WEB-0015` · `FUN-WEB-0202` |
| `FUN-WEB-0022` | split into `BUS-WEB-0016` · `FUN-WEB-0203` |
| `FUN-WEB-0087` | reclassified to `CON-WEB-0087`, number kept |

## Consequences

- **268 requirements become 273.** The business-rule class goes from one
  member to five. DEC-0087 called the empty `BUS` class a finding; the class
  was not empty, it was invisible, and four of its members were inside other
  artefacts.
- **`check:specs` W4 falls from 15/268 to 10/273** — the nine page rows of
  DEC-0093 §3 and `FUN-WEB-0068`, both left at `form: 0` with the reason on
  the artefact. Nothing else in this repository is outside its slot form.
- Five identifiers retired and registered in the identifier map with this
  record named. Every citation re-pointed; the mechanical sweep still finds
  zero retired identifiers cited outside a decision record.
- `TS-WEB-0018` now implements three business rules where it implemented one.
  That is what the split was for: the scope-boundaries specification is where
  a consumer of these rules would look, and now the rules are visible from it
  rather than folded into the requirements that apply them.
