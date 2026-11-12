---
id: DEC-0208
title: The context band is headed "Erfahre mehr über unsere Kalenderplattform" on every page
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #170. DEC-0195 §3 changed the band heading on `/` only and left the
fallback unchanged. The owner (12 Nov 2026): the section carries one name on
every page.

## Decision

1. **Scope of DEC-0195 §3 widens to every page.** The heading is
   "Erfahre mehr über unsere Kalenderplattform" (EN: "Learn more about our
   calendar platform") in the slots `mitmachen-9-context-band`,
   `dein-ort-9-context-band`, `dein-ort-starten-7-context-band` and
   `registrieren-6-context-band`, in the fallback `BAND_HEADING` of
   `app/[lang]/_page-frame.tsx` (used by `/deine-region` and `/ueber-uns`)
   and in the default of `ContextBand`. `/dein-kalender` and
   `/dein-kalender/bestellen` read the `home-10-context-band` slot.
2. **DEC-0195 §3's last sentence ("The fallback heading used by other pages is
   unchanged") no longer holds.** The rest of DEC-0195 stands.
3. **One source instead of a copy per page is not part of this change.** It
   follows with #163. Until then the wording lives in the slots above.
4. **DEC-0120 and DEC-0170 keep the old wording as history.**
   `concept/website-design-system.md` (Context band) names the new heading.
