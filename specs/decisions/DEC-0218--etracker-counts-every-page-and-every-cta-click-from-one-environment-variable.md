---
id: DEC-0218
title: eTracker counts every page and every CTA click, switched on by one environment variable
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #194 (owner, 12 Nov 2026). Until now the eTracker adapter and its loader
were written but not mounted (`state/open.md` rows 12 and 83), so the site
counted nothing. The owner asks for three things: page tracking on every page,
the eTracker code from an environment variable in Vercel, and an event on every
button and CTA, named after the conversion it serves.

## Decision

1. **One variable switches measurement on.** `NEXT_PUBLIC_ETRACKER_SECURE_CODE` carries the account's secure code.
   Set, the loader is mounted on every page of `app/[lang]` and on the per-language 404, and the real adapter answers.
   Unset, nothing is loaded, nothing is sent and nothing fails; the mock answers.
   `NEXT_PUBLIC_ETRACKER_REAL_ADAPTER` is retired. `/start` stays without measurement (`TS-WEB-0016 D15`).
2. **Every page view is counted, client navigation included, under a stable name.**
   `et_pagename` is `<lang>/<route trail>` (`de/calendar/order`), `et_areas` is `<lang>/<top-level route>`, the 404 is `<lang>/not-found`.
   The loader's own URL detection is set to `off` and a router hook sends one virtual page view per route change (`TS-WEB-0012` [FREE] row 2), so the stable names reach the report and no view is counted twice.
3. **Every CTA click reports one event.** Category is the hub conversion goal its target serves, or `navigation`, or `outbound`.
   Action is `click`. Object is the CTA id `<target>.<rank>`. Type is the page name.
   A CTA is any element with a `data-cta` rank, and every link that leaves the site (WhatsApp, phone, mail, booking, form, village calendar, outlets).
   The scheme lives in one module (`src/lib/analytics/cta-event.ts`) and one delegated listener; no component carries an event.
4. **The D4 conversion events stay as they are**, one per completed trigger, now sent with the goal id as category and the stage as action.
   A click and a conversion are told apart by the action, so `TS-WEB-0012-A5`'s "exactly one event with the correct goal ID and stage" still holds.
5. **The field mapping uses the vendor's documented calls**: `et_eC_Wrapper` for a virtual page view and `_etracker.sendEvent(new et_UserDefinedEvent(object, category, action, type))` for an event.
   The account-side check of how these fields appear in reports remains `Q-0040`.

## Consequences

- `TS-WEB-0012` D2, D4 and D7 change; `CON-WEB-0035` names the click events beside the conversion events.
  `FUN-WEB-0207` (page views) and `FUN-WEB-0208` (CTA clicks) are new. Criteria `TS-WEB-0012-A12` to `-A14` are new.
- Owner task: set `NEXT_PUBLIC_ETRACKER_SECURE_CODE` in the Vercel project for Preview and Production; the value never enters the repository.
