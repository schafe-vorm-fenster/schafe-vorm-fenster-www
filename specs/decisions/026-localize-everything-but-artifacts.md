---
id: DEC-026
title: Localized pages render localized content; original artifacts stay original
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

On non-German pages, everything the content pipeline generates renders in
the page language — including proof context, titles, and descriptions.
Original artifacts (a newspaper clipping, a quoted headline) remain in
their source language. The pipeline (GTM package → agent playbook →
per-language markdown in the content folder → server-rendered) carries
the translations; nothing is machine-translated at request time.
