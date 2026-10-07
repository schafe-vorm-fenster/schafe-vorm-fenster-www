---
id: DEC-0152
title: A story's example is chosen, not left over — strict category, the searched place's surroundings, no placeholders, distance on every nearby row, and the quotes where they argue
status: accepted
date: 2026-10-07
decided_by: jan-henrik.hempel
---

## Context

Round 4 (DEC-0149) left four `/dein-ort` findings open:

- **F-4-2.** Story 2, the council meeting, showed a women's-sport date.
- **F-4-3.** Two quotes sat under the wrong stories.
- **F-4-6.** The nearby module printed two identical upstream rows, both titled
  "hier könnte dein Termin stehen".
- **F-4-7.** Nearby rows named a place but not how far away it is.

On 2026-10-07 the owner settled all four:

- The pairing of quote and story is to be derived from the content, not
  waited on.
- Examples are to be found in the data: the right category, preferably with
  text and an image, from the right surroundings. The site will later look
  for fitting content dynamically anyway.

Measured before deciding, on the public village-calendar page for Schlatkow
(88 dates):

- The source carries `description`, `tags`, `scope` and the community of
  every date. It carries no image.
- The token API carries `description.de` and `image`. The client did not
  parse either.
- The two placeholder rows are live `events-api` data, which DEM-0070
  already recorded.

## Decision

1. **Strict category (TS-WEB-0020-A14).** A story's example is a date of
   D3's events-api category or no date at all. The old selector fell back
   to "any unused row". The new `selectStoryExamples`
   (`src/lib/pages/story-examples.ts`) filters on the category and then ranks:
   - topic words (for story 2: a sitting, the Gemeindevertretung);
   - a real description;
   - an image;
   - within 15 km;
   - nearer;
   - sooner.

   A story with no date of its category shows no example.
2. **The searched place's surroundings.** The pool used to be the
   showcase village's leftovers. `exampleEvents` (`src/lib/live/examples.ts`)
   now draws on the anchor place's whole widening for the coming weeks, from
   the community through the region. Each date carries its distance from the
   place. The token path asks for the county. The rows position 1 and story
   4 already show are excluded.
3. **No placeholders, no duplicates, wherever a date enters.** `fitEvents`
   (`src/lib/live/quality.ts`) drops the calendars' own empty-slot
   invitation and keeps one of every date with the same title, start and
   place. It runs in both adapters, so the home page, position 1 and the
   nearby module all benefit. It is not a content filter: an unusual real
   title passes. DEM-0070 stays open upstream, because the two entries are
   still in `events-api`. The website just no longer shows them.
4. **Distance on nearby rows (TS-WEB-0020-A15).** A row reads
   "Rubkow · 6 km · 19:00": straight-line kilometres from the anchor,
   measured against the committed place index. The owner's example said
   "10 Minuten". Minutes would need a road network the index does not have,
   and a figure that only looks precise is worse than an honest one.
5. **Text and image travel with the date.** `LiveEvent` gains `description`,
   `tags`, `imageUrl`, `scope`, `communityId` and `distanceKm`. The
   events-api client parses `description.de`, `image` and `image.exists`, and
   the community-site client parses `description` and `tags`. Today only the
   ranking uses them. They are what a later detail view or a dynamic content
   pick reads.
6. **Quotes moved to the stories they argue (F-4-3).**
   - Holger Wendt (Rubkow): "… reduziert den Arbeitsaufwand unserer
     Gemeinde". A mayor on his municipality's dates now closes story 2, the
     council meeting.
   - Dr. A. Zschiesche (Groß Kiesow): "… Landbevölkerung, aber auch mobile
     Händler als Gewinner". The benefit beyond one's own village now closes
     story 4, the fifteen-minute radius.
   - Stories 1 (Kurzweg, the bakery's route) and 3 (Eichler, "Angebote …
     auffindbar") already fit, and stay.
   - D3's testimonial column, both locales' artifacts and their
     `derived_from` follow the swap. The clearance state is unchanged
     (DEM-0069).
7. **Demo dates speak the same vocabulary.** The mock fixtures carried design
   tone names (`fest`, `merchants`) as `categoryId`, so every demo row read
   "Sonstiges" and no story could find its category under `LIVE_DATA=mock`.
   They now carry events-api ids and a description. The demo nearby ring
   drops the anchor village, as the real one does.

## Consequences

- `TS-WEB-0020-A14` and `A15` are tests now, no longer `test.fixme`. They live
  in `e2e/pages/dein-ort.spec.ts`. The unit tests are
  `src/lib/live/quality.test.ts` and `src/lib/pages/story-examples.test.ts`.
- `state/open.md`: row 290 (F-4-3) is resolved by item 6. F-4-6 and F-4-7
  are resolved in this repository. F-4-5 (consolidating the three stories)
  stays open, because it needs a design pattern.
- Images: no source this site can reach without a token carries one. The
  token path would rank image-bearing dates first, but the deployment has
  no `EVENTSAPI_READ_TOKEN`. Until it has one, the ranking stops at text.
- Observed while verifying: the public village-calendar page served a Vercel
  challenge (`x-vercel-mitigated: challenge`, HTTP 403) to Node's `fetch`
  from the development machine after the day's test traffic. `curl` from
  the same machine and the deployed preview's BFF were unaffected
  (`tier: live`). This is recorded so that a degraded local run is not
  mistaken for a code defect. The local walk used `LIVE_DATA=mock`.
