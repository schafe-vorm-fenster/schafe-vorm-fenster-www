---
id: DEC-0057
title: Place-parameter pages are indexable with a parameter-free canonical
status: accepted
date: 2026-09-11
decided_by: claude — flagged for review
---

## Context

Two specs disagreed, and three page specs had to pick one: TS-WEB-0011 D9 makes
`?ort=` pages indexable with a canonical pointing at the parameter-free
path; TS-WEB-0008 D7 proposed `noindex, follow`.

## Decision

**Indexable, with a parameter-free canonical.** TS-WEB-0008 D7's `noindex` rule
is withdrawn.

## Reasoning

The canonical already achieves what the `noindex` was reaching for. With
`/dein-ort?ort=lassan` canonicalising to `/dein-ort`, no place-specific
website URL can rank — which is exactly the separation DEC-0037 wants
between the website and the app's place pages. Adding `noindex` on top
does not bound the surface any further; it only risks muddying the signal
on the canonical target, and it would suppress a shared link entirely
rather than consolidating it.

## Consequences

- TS-WEB-0008 D7 loses its `noindex` clause; TS-WEB-0011 D9 stands.
- TS-WEB-0020 D5, TS-WEB-0021 D10 and TS-WEB-0025 D9 already follow TS-WEB-0011 — they need
  no change. TS-WEB-0025 D9's `noindex` for the **order flow** is a different
  case and stays: a checkout has no business in search results at all.
- Recorded as decided by the assistant during integration rather than by
  the project owner. Reverse it if the reasoning does not hold.
