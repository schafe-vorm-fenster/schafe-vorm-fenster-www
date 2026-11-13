---
id: DEC-0053
title: One national language plus English per domain; the suggestion ships after launch
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

**Language sets**: every domain carries its national language plus
English — `.de` de+en, `.pl` pl+en, `.at` de+en, `sheepoutside.com` en
only. Further languages (uk, ru) arrive when a country actually needs
them; the mechanism carries them without a code change (TS-WEB-0001 D7).

**First-visit suggestion**: built after phase 1, and it suggests a
**language only**, never a country. A country suggestion means a domain
change, and the "once per session" guarantee cannot survive it —
`sessionStorage` is bound to an origin, so the suggestion would reappear
on the new domain.

## Consequences

→ FUN-WEB-0068, FUN-WEB-0069, TS-WEB-0010 D10, TS-WEB-0001 D1. Resolves Q-0010 and Q-0011.
