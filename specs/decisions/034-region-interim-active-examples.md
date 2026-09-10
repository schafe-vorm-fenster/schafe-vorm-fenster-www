---
id: DEC-034
title: Region page interim — active examples instead of place lists
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

Until the map project lands, the region page shows **no full place
lists** — a county already has hundreds of places; lists collapse at any
level above the village. Instead: a small set of *active example places*
(activity-ranked, proximity-aware where geolocation exists), live
counters ("{n} places in county X are already in"), and the place search
for everything else. The story copy stays map-ready so the later map only
swaps the module. Activity ranking needs an events-per-place signal —
folded into the geo/events API demands.
