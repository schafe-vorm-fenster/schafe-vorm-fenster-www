---
id: DEC-0188
title: The homescreen headline on /dein-ort carries no icon
status: accepted
date: 2026-10-29
decided_by: jan-henrik.hempel
---

## Context

The howto block's headline ("So landet der Kalender auf deinem Homescreen")
stood beside a 24 px `smartphone` glyph. The owner's review of 2026-10-29:
icon and headline are not harmonious; options named were a one-line headline,
a bigger icon, or no icon.

## Decision

No icon. A glyph a fraction of a two-line display headline's height cannot
align with it at any width, and a larger one would compete with the headline
for the section's one point of emphasis. The two platform columns below
already say "iPhone" and "Android".

## Consequences

`howto-block` renders a plain `h2`. A bigger icon or a one-line headline stay
open if the owner wants them after seeing it.
