---
id: DEC-0006
title: "Phase 1 languages: German and English on .de"
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

SRC-0006 names de+en for Germany first; per-country sets beyond that are
examples, not commitments. The product supports de/pl/en/uk/ru.

## Decision

Phase 1 ships `.de` in German and English (FUN-WEB-0066). The target picture
is language variants per country domain; exact sets stay open per country
(Q-0010, FUN-WEB-0068).

## Consequences

Translation workflows are built for two languages first but must not
hard-code the pair.
