---
id: DEC-030
title: The embed demo uses the finished Portalize loader
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

The embed demo on `/eigener-kalender` embeds the real Portalize widget
via its loader (`<script src=".../api/{organizerId}/load.js">`), web
component mode (default; iframe mode exists but is not used here).
Verified 2026-09-09: the hybrid widget is built and documented in the
`portalize` repository. Cookie-freedom of the embed and a place-filter
parameter for "the place just searched" are a demand to Portalize
(Q-026).
