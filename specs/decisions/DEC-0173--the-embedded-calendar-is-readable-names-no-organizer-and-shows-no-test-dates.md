---
id: DEC-0173
title: The embedded calendar is readable, names no organizer, and shows no test dates. Every widget colour is a token on the box's light ground, the own-events showcase is off, and a test organizer's events are dropped on every surface, the embed included
status: accepted
date: 2026-10-27
decided_by: jan-henrik.hempel
---

## Context

The owner's review of 2026-10-27
(`plan/reviews/2026-10-27/2026-10-27 Review Termine veröffentlichen und Dein Kalender.md`)
found three faults in the real Portalize calendar on `/dein-kalender`, in the
section "Ein echter Kalender aus drei Nachbardörfern". It also confirmed an
older one from 2026-10-12:

- **#95, contrast.** The widget's heading was white on light violet, its card
  titles were white on pale pink, and its link was orange on violet. Measured
  2026-10-27 in the rendered shadow root: the heading 1.42:1 (`paper` on
  `violet-100`), three card titles 1.06:1 (`paper` on the widget's `#FFF1EB`),
  the link 3.29:1 and the star chip 3.75:1. Six of 115 texts failed AA.
  *Cause:* `embed-frame.module.css` set the widget's older `--portalize-*`
  properties but not the ones Portalize added with its own-events feature
  (portalize #140, 2026-10-14), and it did not set the mount's `color`. Each
  property left unset falls back to `inherit`, and the mount inherits the
  `violet-500` section's `paper`.
- **#98, wrong title.** The widget was headed "Termine von Verein zur
  Förderung von Kultur in den Orten Schlatkow, Schmatzin und Wolfradshof
  e.V.". *Cause:* the embedded organizer id `5f3745f3-…` is that Verein's
  Portalize licence. Its configured filter is the three villages
  (`filters.communities`), which matches the section copy. Portalize #140,
  however, puts every event of the *embedding* organizer into a showcase row
  above the list and titles that row with the organizer's name. The
  municipality has no active Portalize licence: `GET /api/{its id}/config`
  answers 403 "Portalize Not Active" (2026-10-27), so no municipal calendar
  can be embedded instead.
- **#97 and #52, test dates.** The widget showed "Allday TEST Event Schlatkow"
  and "Recurring TEST Event Schlatkow". *Cause:* Portalize's events route
  (`apps/widget-host/src/app/api/[organizerId]/events/route.ts`) passes the
  events-api answer through unfiltered. On 2026-10-27, 10 of the first 50
  events for this organizer belonged to one test account. The village
  calendar's own site drops these events by organizer id
  (`community-site/src/filter/filterTestEvents.ts`, list in
  `MATEO_TEST_USER_IDS`, applied in `getStaticProps`), so this site's
  tokenless source was already clean. Its token-scoped source (events-api,
  used when `EVENTSAPI_READ_TOKEN` is set) carried no such filter.

## Decisions

1. **Every colour the widget exposes is a token, measured on the box's light
   ground.** The widget keeps its `violet-100` box inside the `violet-500`
   section. The mount sets its base `color` to `ink` and sets every
   `--portalize-*` colour property, including the showcase and own-events
   ones, to a site token. Text gets `ink` (14.18:1 on `violet-100`) or
   `text-2` (7.21:1). Links and accents get `violet-500` (5.50:1). Control
   borders get `ink`, and cards get `paper`. The floor is the guide's (4.5:1
   for text, 3:1 for large text and control borders) and is measured where
   the widget renders, in its open shadow root (TS-WEB-0024-A20), because
   `check:contrast` only reads tokens. Measured afterwards: 100 texts, none
   below 7.21:1, filter-button borders 14.18:1, and no axe `color-contrast`
   violation in the block. SRC-0014 § *Embedded calendar* records the rule.
2. **The own-events showcase and highlight are off.** The mount carries
   `data-own-events-showcase="false"` and `data-own-events-highlight="false"`,
   which `embed-frame` sets by default (`SHOWCASE_CALENDAR.ownEvents`). The
   calendar stays the Verein's licence with its three-village filter, which is
   what the section copy describes. Nobody's events are singled out, and no
   title names an organizer. Embedding a municipal calendar would need the
   municipality's licence, which is not this site's decision.
3. **A test organizer's events are dropped on every surface, by the village
   calendar's rule.** An event whose organizer id is in `MATEO_TEST_USER_IDS`
   is a test event. The list is comma-separated, each id is trimmed and
   matched exactly, and an empty list filters nothing. No title heuristic is
   added: the rule is the one the calendar already applies, and a real event
   may say "Test". On this site, `src/lib/live/test-organizers.ts` applies it
   in both adapters before mapping (`organizer.id` from events-api,
   `calendar.organizer._id` from the public site). Every live module reads
   through them. The ids are configuration (`CONTRIBUTING.md`), never code.
   The widget reads events-api itself, so the rule goes into Portalize's
   events route (schafe-vorm-fenster/portalize#144). It takes effect once
   that is merged and `MATEO_TEST_USER_IDS` is set on the widget host.

## Consequences

- `SRC-0014` gains § *Embedded calendar*. `specs/contracts/design-system-contract.md`
  §2 and `specs/contracts/api-contracts.md` carry the two rules.
- `TS-WEB-0024` D5 gains three rows and criteria **A20** (contrast measured in
  the shadow root), **A21** (no own-events showcase) and **A22** (no test
  event in the widget). A22's e2e case is `fixme` until portalize#144 is
  deployed.
- `TS-WEB-0008` D2 gains the test-organizer row, the "owed" item for #52 is
  done, and criteria **A20** (both adapters, unit and module level) and
  **A21** (the page's own text) are added.
- `state/open.md` row 82 records the switches and the theming.
- Open, outside this repository: portalize#144 (merge, set the variable,
  deploy), and portalize#145. The widget's own-event organizer line uses a
  hard-coded `#c23400`, which measures 3.75:1 on `violet-100` if highlighting
  is ever switched back on.
