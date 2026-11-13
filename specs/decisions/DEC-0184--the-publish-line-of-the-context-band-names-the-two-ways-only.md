---
id: DEC-0184
title: The publish line of the context band names the two ways only
status: accepted
date: 2026-10-28
decided_by: jan-henrik.hempel
---

## Context

The context band's publish card read "Termine veröffentlichen" over the line
"Wie du einfach Termine per WhatsApp oder Kalender veröffentlichen kannst"
(DEC-0156, copy guide CG-030 example). The line repeats its own heading
("Termine … veröffentlichen") and runs to 72 characters, the longest of the
four card lines.

## Decision

The line is **"Per WhatsApp oder über deinen Kalender"** (owner, 2026-10-28):
the two ways, and nothing the heading already says. The English twin is
**"By WhatsApp or from your calendar"**.

It is set in the `context-band` slots that carry the publish item
(`content/pages/home/de.md`, `content/pages/home/en.md`,
`content/pages/dein-ort/de.md`) and in the registry fallback
`dictionary.contextBand.blurbs.publishDates`.

## Consequences

- The line stays a CG-030 statement (no question mark, well within
  `BAND_BLURB_MAX`), so the card carries no demo marking.
- "einfach" goes. The owner kept the shorter of the two proposals, and the
  card's heading and the WhatsApp path carry the ease.
- Verified by `src/lib/content/context-band.test.ts`.
