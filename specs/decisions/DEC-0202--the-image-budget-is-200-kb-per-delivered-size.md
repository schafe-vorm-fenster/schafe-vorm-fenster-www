---
id: DEC-0202
title: The image budget is 200 KB per delivered size, and a photograph is delivered responsively
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #164 (PR #176). The founder photograph on `/ueber-uns` was blurred: the
100 KB image budget of NFR-WEB-0056 (DEC-0007, taken from the product's
`performance-budget.md`) held a 1152 px rendition, and the quote band laid it
over a desktop width as a CSS background, which has no `srcset`. The owner,
12.11.: image quality matters, the photographs must be sharp; the budget may
rise to 200 KB, and responsive images are expected to be delivered in several
sizes.

## Decision

1. **NFR-WEB-0056 reads 200 KB, not 100 KB**, per delivered image size (each
   `srcset` candidate, each file under `public/`). Every other budget of
   DEC-0007 stays. TS-WEB-0003 D1 and the `[FREE]` image-pipeline line carry
   the new figure.
2. **A photograph on a content page is a responsive `<img>`**, not a CSS
   background, wherever it is not the LCP hero: `photo-surface` takes
   `imageSizes` and renders `next/image` (`fill`, `object-fit: cover`,
   `object-position` from the focal point) under a scrim layer built from the
   same gradient variables. The hero keeps the background mode, because its
   preload links are the LCP instrument (TS-WEB-0003 D2).
3. **The renditions are made by `scripts/generate-images.mjs`** and nothing
   else. A placed photograph is never scaled up past its source and is encoded
   down a quality ladder to at most 200 KB; a `--force <id>` run reproduces it.
   The `square` ceiling is 1600 px.

## Consequences

`NFR-WEB-0056`, TS-WEB-0003 (D1, the `[FREE]` line), the generator and the two
renditions of `/ueber-uns` move together. The deviation from SRC-0007 line 23
is recorded in NFR-WEB-0056 and asked of the product in DEM-0078.
