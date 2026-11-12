---
id: DEC-0210
title: Every date selection prefers one-off dates, mixes the themes and takes culture on a tie
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #22. Three places choose a few dates out of many, and each did it its
own way: the drawn phone of the home intro took the earliest date per slot
(DEC-0194 §3), the nearby module a varied week (DEC-0185), and position 1 on
`/` and `/dein-ort` the first three by start time, "chronological, always".
Schlatkow on 2026-11-12 showed waste collection twice and a volleyball evening
at position 1, while the Adventsmarkt (culture) stood a few weeks behind them.

## Decision (owner, 2026-11-12)

1. **One preference, everywhere.** Every date selection prefers a
   **one-off date over a recurring one**, **mixes the themes**, and
   **takes culture (`culture-tourism`) on a tie**. This covers the home
   intro's phone, the nearby module and position 1 on `/` and `/dein-ort`.
2. **Position 1 is no longer strictly chronological.** DEC-0154's "owed by
   the owner's review" rule for #22 is closed by this record.
3. **Each selection keeps its own horizon.** The rule ranks inside the pool
   the selection already has; it never widens it. Position 1 chooses from the
   next 30 dates of its window (`PLACE_POOL`), the nearby module from the week,
   else the fortnight (DEC-0185 §2), the phone's slots from the lists the home
   island loads.

## The rule, as built

`src/lib/live/event-preference.ts` — `pickPreferred(candidates, count, options)`
and `compareByPreference(a, b)`; the only place the preference exists.

- *Recurring* is `occurrence` ∈ `recurring`, `series`, `openinghours`,
  `schedule`; *culture* is the category id `culture-tourism`
  (`categories.ts`).
- `pickPreferred` is greedy; each round takes, among the dates still allowed:
  1. a one-off over a recurring date;
  2. the date whose category is least represented so far;
  3. culture on a tie;
  4. the earliest start, then the id.
  The chosen dates are shown **in start order**.
- `compareByPreference` (one choice with no list around it): one-off, then
  culture, then earlier start, then id.
- Options: `distinctOrganisers` (one date per organiser; a date without an
  organiser id counts as its own) and `maxRecurring`. The nearby module sets
  both (DEC-0185: one per organiser, at most two recurring); position 1 sets
  neither.

| Selection | Code | Uses |
| --- | --- | --- |
| Home intro, slots 1–4 (one category each) and slot 5 (neighbours) | `dorfkalender.ts` `pickRows` | `compareByPreference` |
| Nearby module | `varied-week.ts` `pickVaried` | `pickPreferred` + organiser and recurring limits |
| Position 1 (`/`, `/dein-ort`), every source | `places.ts` `placeEvents`, `public-source.ts` `publicPlaceEvents` | `pickPreferred` |

## Consequences

- DEC-0185 §3's order of preference changes: a one-off now outranks category
  spread (it was the second key); the two-recurring cap stays. Where the week
  holds only recurring dates they still fill the list.
- The tokenless source (the public village calendar) carries no `occurrence`:
  there every date counts as a one-off and the preference acts through
  themes and culture only. The token path acts on all of it.
- `StoryExample` on `/dein-ort` now asks for exactly position 1's three rows,
  so "never a row position 1 already prints" compares against the same pick.
- Measured on Schlatkow, public source, 2026-11-12 (39 upcoming dates): the
  first three by start time were Altpapier, Gelber Sack, Volleyball
  (all supply or community life); the pick is Altpapier, Volleyball,
  Schlatkower Adventsmarkt (culture).
- Verified by `event-preference.test.ts` (the rule), `dorfkalender.test.ts`,
  `varied-week.test.ts` and `public-source.integration.test.ts` (nothing
  outside the window enters).
