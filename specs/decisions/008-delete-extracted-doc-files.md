---
id: DEC-008
title: Extracted product-doc files are deleted
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

After extraction (DEC-005/007), the three remaining files under
`schafe-vorm-fenster-www/docs/` would duplicate the product repository.

## Decision

`domains.md`, `localization-architecture.md`, `performance-budget.md` are
deleted together with the product-only files; the whole `docs/` folder
goes. Specs reference `community-calendar` as the canonical source — the
same no-copy rule that applies to `go-to-market-os`.

## Consequences

The website repository holds no shadow copies of foreign documentation.
