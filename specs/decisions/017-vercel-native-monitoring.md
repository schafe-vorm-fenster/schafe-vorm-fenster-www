---
id: DEC-017
title: Production monitoring uses Vercel-native means
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

Error and availability monitoring relies on Vercel logs, runtime error
capture, and the existing uptime monitoring. No additional error-tracking
service, no new data flows.

## Consequences

→ WEB-Q-036. Revisit only if blind spots hurt in practice.
