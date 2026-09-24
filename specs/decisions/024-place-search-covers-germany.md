---
id: DEC-024
title: Place search covers all of Germany; an uncovered place is a conversion moment
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

1. The place search offers all of Germany, not only covered places.
2. A place without coverage gets a dedicated flow: "nothing happening
   here yet" plus a "start the calendar in my place" landing — a page
   this website owns (pending its addition to the IA, per DEC-022).
3. Name search becomes a new geo-api endpoint backed by the existing
   Typesense index (demand Q-025). `findbyaddress` is **forbidden** for
   this use: it triggers an external Google Maps lookup — slow and paid.
4. Proof elements that reference places are drawn only from covered
   places (events-api data present).

## Context

Coverage is fragmented; the wireframes do not handle the unknown place
(verified 2026-09-09). geo-api currently searches by ZIP and geoname IDs
only.

## Amendment 2026-09-23 — DEC-079

This record is not rewritten; two of its four points are re-read.

**Point 3 is superseded.** Name search was described here as something
geo-api has to build first. It is not: the website searches by name
today, over the committed covered-community index, and `Q-025` continues
as an upstream demand that blocks nothing that ships (DEC-079 §2).
`findbyaddress` stays forbidden — that half of point 3 is untouched.

**Point 1 is now an open question, not a settled fact.** "All of
Germany" was written when the ZIP lookup was assumed to be the search:
geo-api resolves any German postcode, so coverage looked Germany-wide by
construction. The name index knows the ~1,760 covered communities only,
so a name outside them yields no suggestion — and still reaches
`/dein-ort/starten` on submit, which is point 2 working as intended.
Whether Germany-wide *finding by name* becomes a requirement is
**Q-071**; until it is answered, read point 1 as the target, not as the
current state.

**Points 2 and 4 stand unchanged** and still carry WEB-F-047 and the
proof rule.

## Amendment 2026-09-24 — point 1 is settled

The first amendment left point 1 as an open question (`Q-071`). It is now
answered: **suggestions cover the covered communities, and Germany-wide
finding by name is the target, not the shipped state** (DEC-079 amendment
2026-09-24).

Read point 1 as: the place search is *open to* all of Germany — it never
tells a visitor that her place is out of scope, and a name it cannot
suggest still reaches `/dein-ort/starten` (point 2). What it *finds by
name* is the covered set, until `Q-025` provides a name endpoint.

Points 2, 3 and 4 stand as the first amendment left them.
