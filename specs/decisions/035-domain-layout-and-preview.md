---
id: DEC-035
title: Domain layout — www is the website, apex serves the calendars until app.*; next.* is the migration preview
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

Current and target layout of `schafe-vorm-fenster.de`:

| Host | Today | Target |
| --- | --- | --- |
| `www.` | current website | relaunched website |
| apex (no subdomain) | the village calendars (`/:community`) | 301 → `www.` |
| `app.` | — | the village calendars (product moves here) |
| `next.` | product pre-launch preview (not live) | **website migration preview** (protected, noindex) |

The international domain is **`sheepoutside.com`** (registered 2026-05-05
via Key-Systems; no DNS yet, not in the Vercel team — wiring is a task).
The Polish domain is `owcezaoknem.pl`, the Austrian `schafvormfenster.at`
(both in the team).

## Consequences

- The apex→www redirect (TS-001 D2) applies only **after** the calendars
  move to `app.*`. Until then the apex keeps serving calendars.
- Once apex redirects to www, legacy `/:community` paths (svf.li QR
  codes) arrive at the website, which forwards them to the place's
  calendar on `app.*` preserving `etcc_*` (WEB-F-048).
- The product's pre-launch preview vacates `next.*` — an internal
  coordination point with the product, not a blocker.
- Resolves Q-001 and Q-027.
