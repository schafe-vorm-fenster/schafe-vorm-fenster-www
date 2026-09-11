---
id: DEC-065
title: How the four hardest rules are verified — and where the coverage stops
status: accepted
date: 2026-09-11
decided_by: jan-henrik.hempel
---

## Context

Fourteen requirements were covered by a determination but discharged by no
acceptance criterion — invisible to a QA walker. Four of them needed a
decision about *how* they can be checked at all.

## Decisions

1. **Claims are declared in content** (WEB-F-036). The content schema
   gains a `claims` field: whoever writes a text names the claims in it
   and their proof ids. A declared claim with a dangling or uncleared
   proof id fails the build; a claim deliberately without proof renders
   in its weakened form. This moves the judgement to content generation,
   where it is made anyway, instead of leaving it to a reviewer's ear.

2. **List ordering is unit-tested with a spot check** (WEB-F-030), not
   proven site-wide. **Stated limitation:** this shows the engine orders
   correctly and that two rendered pages are not in date order. It does
   **not** prove that every list uses the engine. A list that bypasses it
   passes.

3. **BFSG conformity rests on the WCAG AA regime already specified**
   (WEB-Q-026). The accessibility statement is fed by self-assessment
   backed by this spec's acceptance criteria, and it must name that
   method. **Stated limitation:** automated checks cover only part of the
   BITV test steps; the statement may not imply an audit that did not
   happen.

4. **Only phase 1 is verified** (WEB-F-068). The target picture beyond
   de + en on `.de` is deliberately unchecked and becomes checkable when
   a second country gains content. The requirement stands as a recorded
   intention, not as a verified property.

## Consequences

W2 reaches zero: all 155 requirements now carry at least one acceptance
criterion. Three of the four decisions above buy that at the price of
partial coverage, and each says so in the criterion itself — so a later
reader cannot mistake a green check for more assurance than it gives.
