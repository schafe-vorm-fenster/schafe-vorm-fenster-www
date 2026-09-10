---
id: DEC-031
title: Two-stage deployment model — migration preview now, full pipeline later
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

**Stage 1 (migration):** the `next-2026` branch gets its own preview
domain so the site deploys through to production-like without going
live; deployment protection on, `noindex`. The name is open — the
product already occupies `next.schafe-vorm-fenster.de` (Q-027).

**Stage 2 (operation):** feature-branch deployments with a GitHub
Actions pipeline modelled on `classification-api` (SRC-012): typecheck,
lint, tests with coverage, dead-code (knip) and duplication (jscpd)
checks, preview deployments, merge checks and auto-merge rules, rolling
deployment, e2e execution with rollout-or-rollback decision for
production.
