---
id: DEC-0015
title: Strict security baseline from the start
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

Enforced CSP with an explicit allowlist (envoy, eTracker, `app.*`),
security headers (HSTS, frame-ancestors, referrer-policy, etc.), and
dependency scanning in CI are binding from the first deployment.

## Consequences

Every new external resource is a deliberate allowlist change. DEC-0013
keeps the list short. → NFR-WEB-0030–034.
