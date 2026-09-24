---
id: DEC-0022
title: The new information architecture is authoritative; there is no news section
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

The old Strukturplan (archived) called for a news channel aggregating
newsletter, LinkedIn, and Instagram content. The new IA (SRC-0003) defines
eight pages and no news page. FUN-WEB-0086 still carried a "news section from
published posts" clause with no target page.

## Decision

The new IA is authoritative. No news section, no news page. Where old
concept material and SRC-0003 diverge, SRC-0003 wins — this rule holds
generally, not only for news.

## Consequences

FUN-WEB-0086 is narrowed to the press/archive case (`media-echo/verified/`
→ `/warum-wir/archiv` and inline proof). Published social posts are not
fetched or displayed. A future news feature would first change the IA in
`go-to-market-os`, then the specs.
