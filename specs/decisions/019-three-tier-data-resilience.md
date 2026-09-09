---
id: DEC-019
title: Live data is served through a three-tier resilience chain
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

Live modules depend on app APIs; the site must ship fast (server-rendered,
cached) and must not break when the app is down.

## Decision

1. **Live:** fetch server-side, stream into the page, cache the response.
2. **Stale:** on API failure, serve the last cached answer, labelled with
   its freshness ("Stand: …").
3. **Build fallback:** on empty cache, serve a build-time snapshot.

The page shell never blocks on an API (streaming). Exception: live
counters follow "counted live or not shown" (WEB-F-041) — they may serve
tier 2 with a timestamp but are hidden instead of falling to tier 3.

## Consequences

Tiers 1+2 map to stale-while-revalidate on Vercel; tier 3 is a build
artifact refreshed per deployment. → WEB-F-100–105.
