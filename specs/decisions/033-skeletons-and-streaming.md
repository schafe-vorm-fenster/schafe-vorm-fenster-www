---
id: DEC-033
title: Skeletons and streaming everywhere, especially for geo-personalized content
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

Every module whose data arrives after the shell — above all personalized
(geo) content — renders a skeleton immediately and streams in. No
blocking spinners, no layout shift: the skeleton reserves the final
space (ties into CLS < 0.1, TS-003 A7).
