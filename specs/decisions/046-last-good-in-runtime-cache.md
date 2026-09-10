---
id: DEC-046
title: The last-good store is the Vercel Runtime Cache
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

DEC-019 tier 2 — the last known answer, served with a freshness label
when the upstream API fails — is written to the **Vercel Runtime Cache**
on every successful fetch. Platform-native, no additional service
(keeping DEC-017).

**A cold region has no last-good and falls straight to tier 3**, the
build-time snapshot. That is accepted rather than worked around: tier 3
exists precisely so that every module always has content, and paying for
a durable global store to cover a first request in a cold region would
buy very little.

## Consequences

- The store is separate from the framework's `'use cache'` entries,
  because an expired entry is unreadable exactly when it is needed.
- Its keys follow the segmentation of TS-005 D8, so Q-030's cache
  measurement covers this store as well as the render cache.
- Resolves Q-036. Revisit only if cold-region tier-3 hits show up as a
  real quality problem in production.
