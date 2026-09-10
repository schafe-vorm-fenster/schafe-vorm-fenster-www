---
id: DEC-047
title: Support articles move to the app; /hilfe redirects there
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

The 37 articles in `content/support/` migrate to the app, where help
belongs (WEB-C-010). The website keeps no help section.

`/hilfe` and `/hilfe/{slug}` redirect to the app's help URLs. That needs
a URL contract the app does not publish yet — a demand to the app team.
**Interim until it lands:** `/hilfe/*` redirects to the app root, so the
inherited URLs keep their rank and land somewhere sensible rather than
404ing.

## Consequences

- `content/support/` leaves this repository once the migration runs; it
  stays as archive until then (repo rule: archive, not starting point).
- The redirect map (TS-011 D1/D2) carries the interim target and is
  updated to per-article targets when the contract exists.
- TS-018's A13 gets its target.
- Resolves Q-039; opens a demand to the app team, tracked as Q-041.
