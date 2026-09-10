---
id: DEC-044
title: Two brand packages, three levels of use
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

All brand material binds — at three different levels, delivered by two
packages, both already installed:

| Level | What | Where |
| --- | --- | --- |
| **Tokens** | colours, type scale, spacing — usable 1:1 | `@schafe-vorm-fenster/brand-design`, exports `./tokens.json`, `./tokens.css`, `./tokens.tailwind.js` |
| **Assets** | logos, fonts, the UI kit | same package, exports `./logos/*`, `./kit` |
| **Identity** | imagery rules, tone of voice — consumed by content generation, not by the runtime | `@schafe-vorm-fenster/brand-identity` |

The tokens are the runtime contract: no colour, font or spacing literal
is written by hand anywhere in the website (TS-017 D3). The identity
package feeds the content pipeline (TS-007), not the components.

## Context

An earlier reading found a third candidate, `@schafe-vorm-fenster/design-tokens`,
generated from the retired hub path. It is neither installed here nor
published by the hub any more; the tokens moved inside `brand-design`.
Q-033 is resolved: there was no competition, only a stale observation.
