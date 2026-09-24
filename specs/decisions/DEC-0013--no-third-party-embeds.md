---
id: DEC-0013
title: No third-party embeds
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

Embedded players (SoundCloud, YouTube, social posts) load third-party
trackers and would break the cookieless, banner-free promise.

## Decision

External media are represented by own previews (screenshot, quote from
`media-echo/`) plus an outbound link. No third-party players, no
click-to-load layer.

## Consequences

No consent UI is ever needed; the CSP allowlist stays minimal (DEC-0015).
→ FUN-WEB-0095.
