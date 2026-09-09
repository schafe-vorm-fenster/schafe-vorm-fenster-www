---
id: DEC-005
title: The product's locale model is adopted in full
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

`community-calendar/docs/localization-architecture.md` defines a proven
model: TLD default, URL-prefix override, server-side only, URL as the
preference, link-language propagation, hreflang matrix.

## Decision

All five rules are adopted as website requirements. → WEB-F-061–065.

## Consequences

Website and product behave identically at the locale level; the canonical
mechanism doc stays in the product repository.
