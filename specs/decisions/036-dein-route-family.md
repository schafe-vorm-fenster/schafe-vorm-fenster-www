---
id: DEC-036
title: Routes speak in the second person — the dein family
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Decision

1. **The rule:** website routes address the visitor (dein/deine). The
   first person (mein-…) is reserved for the logged-in app space, where
   ownership is real. The website is the pre-ownership space: "mein"
   would claim possession, "dein" promises it — and print already speaks
   this voice ("Dein Dorf. Deine Termine."), so the seam
   poster → QR → URL → page stays in one register.
2. **The family:**

   | Route | Carries | EN |
   | --- | --- | --- |
   | `/dein-ort` | Dorfkalender, reading | `/your-place` |
   | `/dein-ort/starten` | founding flow, uncovered place | `/your-place/start` |
   | `/dein-kalender` + `/bestellen` | `portalize-calendar` (480 €) | `/your-calendar` + `/order` |
   | `/deine-region` + `/angebot` | `portalize-enterprise` | `/your-region` + `/quote` |
   | `/deine-termine` | reserved: `portalize-website-widget` | `/your-events` |
   | `/mitmachen` + `/registrieren` | publishing (verbs, unchanged) | `/take-part` + … |

3. **Three word classes:** possessive bases name what the visitor *gets*;
   verbs name what the visitor *does*; **sender surfaces** — the pages
   that speak about us rather than to the visitor — use plain convention
   (`/ueber-uns`, `/rechtliches`). Those pages are scanned, not browsed:
   due diligence wants a familiar landmark, and the distinctive voice
   belongs in the headline ("Gebaut in einem Dorf, betrieben aus einem
   Dorf"), not the URL. Amended 2026-09-10, superseding `/warum-wir`,
   which framed a trust surface as a sales argument. `/mitmachen` therefore stays a
   verb — the actor owns nothing at entry, they act. A bare verb without
   an object is not a base: the founding page is `/dein-ort/starten`
   (start *what*? your place), not `/starten` — amended 2026-09-10,
   superseding the earlier `/mitmachen/neuer-ort` draft.
4. `region` was chosen over `orte`/`landkreis` after deliberation: the
   offering's common denominator across counties, state bodies, and
   networks is geographic scope — "irgendwie geht es immer um geo".
5. Superseded candidates from earlier rounds: `/eigener-kalender`
   (semantically belongs to the widget), `/veranstaltungskalender` (the
   dates are more than Veranstaltungen), `/regionaler-kalender`,
   `zusammenstellen` (→ `bestellen`, invoice language). Nav label:
   "Dein Kalender".

## Consequences

IA amended first (DEC-022), specs synchronised after. The naming rule is
a candidate for the communication principles in `go-to-market-os`.
