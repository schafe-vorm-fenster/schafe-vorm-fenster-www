---
artefact: ssd
id: SSD-WEB
status: DRAFT
date: 2026-09-09
sources: [SRC-001, SRC-003, SRC-006, SRC-008, SRC-009]
---

# SSD — Schafe vorm Fenster Website Relaunch

## Purpose

The website communicates what Schafe vorm Fenster is, organised around the
concerns a visitor has right now, and converts each concern into its one
primary action. It argues with live data and proof instead of claims
(SRC-001 "The Architecture in One Paragraph").

## Scope

- In scope: `www.schafe-vorm-fenster.de` and its country/language variants
  (DEC-003: `.de`, `.pl`, `.at`, one international domain — TLD open, Q-001).
- Out of scope: the product itself (village calendars on
  `app.schafe-vorm-fenster.de`), help and instructions (live in the app),
  the AI-coaching track (different brand; SRC-001 "Boundaries").

## Goals

Referenced, not restated (SRC-008):

| Goal | Reference |
| --- | --- |
| Recurring licence revenue (100 subscriptions · 50k € ARR) | `@schafe-vorm-fenster/goals`recurring-licence-revenue/` |
| Proven outside the home regions | `@schafe-vorm-fenster/goals`proven-outside-home-regions/` |
| Positioning | `@schafe-vorm-fenster/messaging` |

`ai-coaching` and `gmbh-conversion` business goals exist but are not
carried by this website.

## Stakeholders

The audience model (two axes: audience × relation) is defined in
`@schafe-vorm-fenster/audiences` (ADR-003, SRC-009). The website serves, in
the priority order given per page by SRC-003:

`rural-residents` · `actors` · `municipalities` · `institutions` ·
`counties` · `companies` — each defined in
`@schafe-vorm-fenster/audiences`<id>.audience.md` with `communication_goals`
and `information_needs` (these are the STRICT needs layer for this spec).
`tech-leaders` belongs to the coaching track and is out of scope.

## Success Measures

The websites' conversions are the conversion goals referenced per page in
`requirements/functional/pages.req.md`, defined in
`@schafe-vorm-fenster/goals`.

## Constraints Summary

See `requirements/constraints/`. Binding: Next.js + Vercel (DEC-002),
brand kit (`@schafe-vorm-fenster/brand-design`),
mobile-first, cookieless analytics (DEC-004).

## Open Issues

Tracked in `questions/open-questions.md` (`Q-###`).
