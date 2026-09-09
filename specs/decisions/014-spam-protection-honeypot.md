---
id: DEC-014
title: Spam protection is honeypot plus rate limiting
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

Forms are protected by invisible honeypot fields, submission-timing
checks, and server-side rate limiting. No captcha of any kind.

## Consequences

Accessibility and privacy stay untouched. The requirement binds the envoy
widget too (part of the Q-022 demand). → WEB-Q-035.
