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
