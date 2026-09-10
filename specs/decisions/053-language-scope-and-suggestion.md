---
id: DEC-053
title: One national language plus English per domain; the suggestion ships after launch
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

**Language sets**: every domain carries its national language plus
English — `.de` de+en, `.pl` pl+en, `.at` de+en, `sheepoutside.com` en
only. Further languages (uk, ru) arrive when a country actually needs
them; the mechanism carries them without a code change (TS-001 D7).

**First-visit suggestion**: built after phase 1, and it suggests a
**language only**, never a country. A country suggestion means a domain
change, and the "once per session" guarantee cannot survive it —
`sessionStorage` is bound to an origin, so the suggestion would reappear
on the new domain.

## Consequences

→ WEB-F-068, WEB-F-069, TS-010 D10, TS-001 D1. Resolves Q-010 and Q-011.
