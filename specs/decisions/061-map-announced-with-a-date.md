---
id: DEC-061
title: The map view is advertised with its date, not as existing
status: accepted
date: 2026-09-11
decided_by: jan-henrik.hempel
---

## Decision

The enterprise map view ships **January 2027** — Landkreis Rottweil has
bought it and goes live then. Until it runs, `/deine-region` names it as a
dated, forthcoming feature and never as an existing one. DEC-034's interim
module (active example places, live counters, place search) carries the
page in the meantime.

## Consequences

- Resolves Q-048 and dates DEC-034's "until the map project lands".
- An acceptance criterion checks that no wording claims a map that exists
  today; a second checks the date is stated wherever the feature is.
- Once the map ships, the interim module is swapped, not rewritten — the
  story copy was kept map-ready for exactly this.
