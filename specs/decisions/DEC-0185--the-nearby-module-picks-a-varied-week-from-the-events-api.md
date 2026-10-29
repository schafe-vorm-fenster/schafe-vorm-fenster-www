---
id: DEC-0185
title: The nearby module picks a varied week from the events-api instead of the first five by start time
status: accepted
date: 2026-10-28
decided_by: jan-henrik.hempel
---

## Context

Position 2 ("Diese Woche in der Nähe", TS-WEB-0008 D3 step 2) takes the
~15 km ring from geo-api, asks for the dates of those places from `now` on and
keeps the first five by start time (`nearby.ts`, `public-source.ts`). On
2026-10-28 the module showed one Halloween date and four online courses of one
organiser in Anklam, all starting 2 November at 18:30 — nothing prevents
repeats by organiser, category or series.

The owner's review of 2026-10-28 rejects both halves:

- the radius is cut on our side from geo-api positions; the events-api can do
  "nearby" itself, so geo-api should not be needed on this path;
- "the first five" is not a selection.

The relevance engine of TS-WEB-0005 runs for proof elements only; for dates,
TS-WEB-0008 D3's sentence "selection and ordering inside the set are
TS-WEB-0005" was never implemented.

## Decision (owner, 2026-10-28)

1. **The candidates come from the events-api's own nearby search**, not from a
   geo-api ring computed by us. geo-api leaves this path.
2. **The window is the next 7 days**, so the module fits its heading "Diese
   Woche in der Nähe". If the week yields fewer than five good dates — or
   nothing is on — the window widens to **14 days**. The heading follows the
   window as today (`week` / `upcoming`; CG-033).
3. **Five dates are picked from the candidates, not the first five:**
   - from **different categories** and **different organisers**;
   - **at least some that are not recurring dates** (`occurrence` other than
     `recurring`, `series`, `openinghours`, `schedule`);
   - **at most two recurring dates**;
   - shown in start order.
4. Where fewer than five dates satisfy the rules, the module shows what
   passes. It does not refill with duplicates.

## Settled the same day

- **Radius: the events-api's `region` scope, 20 km** (owner: "15 oder 20 ist
  vollkommen Wumpe"). `nearby` is 2.5 km upstream and too small for villages.
  The website computes no radius on the token path; `NEARBY_RADIUS_KM` is 20
  and serves the committed ring of the tokenless source and the cache key.
  Upstream also filters on the *event's own* `scope` attribute, so a date
  whose organiser marked it `community` is not in a `region` answer; that is
  the service's rule, not ours.
- **Token:** `EVENTSAPI_READ_TOKEN` stands in the Vercel project for Preview
  and Production (owner confirmed 2026-10-28). `state/open.md` row 77 is
  therefore closed for events-api.
- **Fields measured** on a real answer (Anklam, `region`, 14 days, 23 dates):
  `occurrence`, `categories`, `organizer.id`, `series.id`, `image.exists` and
  both geopoints are present. 21 dates `once`, 2 `recurring`; 5 organisers;
  2 categories; 18 of 23 are courses of one organiser (the vhs). Only 2 of 23
  carry an image, which is why images are not a rule.
- **The window takes ISO instants.** `after=now` and `before=14d` are a 400 on
  the scope route (they work on the id search); the website sends real
  instants.

## Where the rule lives

`src/lib/live/varied-week.ts`: a pure function, `pickVariedWeek(candidates,
now, count)`. It is **not** part of `src/lib/relevance/` (TS-WEB-0005), which
ranks items that carry clearance, a geo tier and a job relation. A date has
none of them; what makes five dates good is how they differ from each other.
Both token path and tokenless path call it, so the module answers the same
way from either source. The tokenless source (the public village calendar)
knows organiser and category but not `occurrence`, so the limit of two
recurring dates has nothing to act on there.

The rules, as built:

1. Per round, among the dates whose organiser is not yet on the list (and, once
   two recurring ones stand, only one-offs): the date whose category is least
   represented so far; then a one-off over a recurring one; then the earliest
   start; then the id.
2. A date with no organiser id is its own organiser.
3. The week (7 days) is picked first; where it passes fewer than five, the
   same rules run over the fortnight. What counts is what passes, not what
   exists: eight courses of one organiser are a thin week.
4. Result in start order; `window` is `week` while every row starts within 7
   days, else `upcoming`.

## Consequences

- TS-WEB-0008 D3 step 2 and A18 are amended; A18 now counts the fortnight.
- geo-api's point search is no longer asked by position 2.
  `communitiesNearPoint` (DEC-0181) has no production caller left; its cache
  and its 3 s budget are kept and tested directly. Removing them is a
  separate decision.
- Verified by `varied-week.test.ts` (the rules), `nearby-selection.integration.test.ts`
  (request, window, selection, resilience) and `public-source.integration.test.ts`.
