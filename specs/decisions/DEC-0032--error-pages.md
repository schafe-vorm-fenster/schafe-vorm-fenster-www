---
id: DEC-0032
title: Error pages — 404 converts, 500 stays static, module errors stay invisible
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

- **404**: real status 404, `noindex`, mini content — one sentence, the
  place search as dominant element, the four jobs as context band. No
  fuzzy place-slug guessing on arbitrary paths (rejected: recognition
  logic is hard and nobody owns it). Known legacy community-slug paths
  are handled by the redirect map (FUN-WEB-0048) *before* the 404.
- **500**: statically pre-rendered, minimal (logo, one sentence, home
  link) — no live modules, no search, nothing that can itself fail.
- **Live-module errors** never surface as error messages in content; the
  DEC-0019 cascade absorbs them.
