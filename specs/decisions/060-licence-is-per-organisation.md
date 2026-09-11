---
id: DEC-060
title: The licence is priced per organisation; tiers differ by where the calendar runs
status: accepted
date: 2026-09-11
decided_by: jan-henrik.hempel
---

## Decision

**480 €/year is per organisation**, for a configured calendar embedded on
that organisation's own website. It is not priced per place, per
municipality or per region, and there is no place limit. Several
organisations in the same place or region each buying their own calendar
is the intended case, not an edge case.

**Enterprise (4 000 €/year) differs by features, not by territory:**

| Tier | Where the calendar runs | Extra |
| --- | --- | --- |
| free | in the Dorfkalender | — |
| 480 € | on your own website, configured | — |
| 4 000 € | on your own website | map view, white-label registration |

Reference case: Landkreis Rottweil, going live January 2027.

**The three tiers are sold under one question — "where should the
calendar run?"** — which keeps the IA's single-question requirement and
matches the real product difference. Not by organisation size: that would
ask the visitor to classify herself, which WEB-F-009 forbids.

## Consequences

- **Q-047 dissolves.** The order flow cannot assemble an unpriceable
  scope, because scope does not drive price. Scope determines what the
  calendar *shows*.
- TS-024 D6's tier module is restated around place of use.
- TS-025's scope selection is a configuration step, not a pricing step.
- `/deine-region` keeps its name (DEC-036 §4's reasoning is corrected:
  the name describes who it addresses, not the technical boundary), but
  the page argues features — map and own registration — rather than
  territory.
