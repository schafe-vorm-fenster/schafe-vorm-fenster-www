---
id: DEC-037
title: The website never carries a place slug in a path
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

No website path ever contains a place slug. Place-specific paths belong
to the app alone (`app.schafe-vorm-fenster.de/<slug>`, today the apex per
DEC-035). Where a website page is about a specific place — `/dein-ort`,
`/dein-ort/starten` — the place travels as a **query parameter**, so the
URL stays shareable without founding a second place-page namespace.

## Reasoning

The app owns place pages. Mirroring them on the website would duplicate
the same content under two hosts and make the two compete in search.
The website's place-aware pages are marketing surfaces that adapt to a
place; they are not the place's calendar.

## Consequences

- `/dein-ort/starten` is collision-free: no path segment can be mistaken
  for a place slug.
- Inherited `/:community` paths (svf.li QR codes) are forwarded to the
  app, never rendered by the website (WEB-F-048).
- Per-place SEO landing pages, should they ever be wanted, are a
  deliberate future decision — not something that happens by accident.
- → WEB-F-023.
