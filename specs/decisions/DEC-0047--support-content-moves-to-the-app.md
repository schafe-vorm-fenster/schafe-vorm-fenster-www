---
id: DEC-0047
title: Support articles move to the app; /hilfe redirects there
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

The 37 articles in `content/support/` migrate to the app, where help
belongs (CON-WEB-0010). The website keeps no help section.

`/hilfe` and `/hilfe/{slug}` redirect to the app's help URLs. That needs
a URL contract the app does not publish yet — a demand to the app team.
**Interim until it lands:** `/hilfe/*` redirects to the app root, so the
inherited URLs keep their rank and land somewhere sensible rather than
404ing.

## Consequences

- `content/support/` leaves this repository once the migration runs; it
  stays as archive until then (repo rule: archive, not starting point).
- The redirect map (TS-WEB-0011 D1/D2) carries the interim target and is
  updated to per-article targets when the contract exists.
- TS-WEB-0018's A13 gets its target.
- Resolves Q-0039; opens a demand to the app team, tracked as Q-0041.

## Update, 2026-09-27 — the interim step is closed

DEC-0146 named "the app" as `community-site` (not `community-calendar`,
abandoned the same day). `community-site#204` ships `/hilfe` and
`/hilfe/{slug}` at the legacy site's own 36 slugs — the per-article URL
contract Q-0041 asked for. `redirect-map.ts`'s `/hilfe` row now targets
`https://schafe-vorm-fenster.de/hilfe{,/{slug}}` instead of the app root
(`preservePath`); Q-0041 and `state/open.md` row 8 are resolved.

Not carried over: `src/lib/live/app-handover.ts`'s `HELP_ARTICLE_MAP`/
`helpUrl()`, a two-entry mock built against `APP_ORIGIN`
(`app.schafe-vorm-fenster.de`, the *calendar* handover, DEC-0029/DEC-0035 —
a different hostname on a different timeline than community-site's). Both
functions have no caller anywhere in this tree, so leaving them stale costs
nothing today; `state/open.md` row 8 carries it as a follow-up rather than
silently fixing an unused module as a side effect of the redirect work.
