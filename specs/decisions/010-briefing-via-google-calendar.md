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
