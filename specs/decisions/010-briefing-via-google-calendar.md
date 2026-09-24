---
id: DEC-010
title: Product briefings are booked via Google Calendar appointment links
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

`request-product-briefing` resolves to a Google Calendar appointment
schedule, reached by link (no embed). Google Workspace is already in use.

## Consequences

Linking out avoids third-party scripts on the page (DEC-013, DEC-015
untouched). Booking happens under Google's terms — acceptable because it
is an outbound navigation, not an on-page embed. → WEB-F-093.

## Superseded in part 2026-09-24 — DEC-081

This record is not rewritten; its **mechanism** stands and its
**placement** is withdrawn.

**Still true:** `request-product-briefing` resolves to a Google Calendar
appointment schedule, reached by a link. No embed, no Google script, no
iframe, no font, no CSP entry (DEC-013, DEC-015 untouched).

**Withdrawn:** that the link is placed as a page CTA. The appointment link
lives in the first action row of the contact section (DEC-081 §3); a
booking CTA anywhere on a page targets that section, in-page, and only the
section's row navigates off-site. The conversion event moves with it —
it fires on that row's click, with the route (DEC-081 §4, TS-016 D12).
