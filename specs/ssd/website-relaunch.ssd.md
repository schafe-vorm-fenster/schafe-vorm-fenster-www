---
artefact: ssd
id: SSD-WEB-0001
status: DRAFT
version: 0.1.0
decision_policy_ref: POL-GRADED-BY-IMPACT
date: 2026-09-09
sources: [SRC-0001, SRC-0003, SRC-0006, SRC-0008, SRC-0009]
# The specification-document contract's `stakeholders[]`, read off the
# `## Stakeholders` section below and carrying nothing the section does not
# already say. A need may name one of these and nothing else (DEC-0102 §3);
# `tech-leaders` is out of scope and is therefore not one of them.
stakeholders: [rural-residents, actors, municipalities, institutions, counties, companies]
goals: [GOAL-WEB-0001, GOAL-WEB-0002]
---

# SSD — Schafe vorm Fenster Website Relaunch

## Purpose

The website communicates what Schafe vorm Fenster is, organised around the
concerns a visitor has right now, and converts each concern into its one
primary action. It argues with live data and proof instead of claims
(SRC-0001 "The Architecture in One Paragraph").

## Scope

- In scope: `www.schafe-vorm-fenster.de` and its country/language variants
  (DEC-0003: `.de`, `.pl`, `.at`, one international domain — TLD open, Q-0001).
- Out of scope: the product itself (village calendars on
  `app.schafe-vorm-fenster.de`), help and instructions (live in the app),
  the AI-coaching track (different brand; SRC-0001 "Boundaries").

## Goals

Referenced, not restated (SRC-0008):

| Goal | Reference |
| --- | --- |
| Recurring licence revenue (100 subscriptions · 50k € ARR) | `@schafe-vorm-fenster/goals`recurring-licence-revenue/` |
| Proven outside the home regions | `@schafe-vorm-fenster/goals`proven-outside-home-regions/` |
| Positioning | `@schafe-vorm-fenster/messaging` |

`ai-coaching` and `gmbh-conversion` business goals exist but are not
carried by this website.

## Stakeholders

The audience model (two axes: audience × relation) is defined in
`@schafe-vorm-fenster/audiences` (ADR-003, SRC-0009). The website serves, in
the priority order given per page by SRC-0003:

`rural-residents` · `actors` · `municipalities` · `institutions` ·
`counties` · `companies` — each defined in
`@schafe-vorm-fenster/audiences`<id>.audience.md` with `communication_goals`
and `information_needs` (these are the STRICT needs layer for this spec).
`tech-leaders` belongs to the coaching track and is out of scope.

## Success Measures

The websites' conversions are the conversion goals referenced per page in
the `pages` area of `requirements/functional/`, defined in
`@schafe-vorm-fenster/goals`.

## Constraints Summary

See `requirements/constraints/`. Binding: Next.js + Vercel (DEC-0002),
brand kit (`@schafe-vorm-fenster/brand-design`),
mobile-first, cookieless analytics (DEC-0004).

## Open Issues

Tracked in `questions/open-questions.md` (`Q-####`).
