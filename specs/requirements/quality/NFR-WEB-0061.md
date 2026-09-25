---
artefact: requirement
id: NFR-WEB-0061
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
needs: [NEED-WEB-0017, NEED-WEB-0022, NEED-WEB-0029]
source:
  source_id: SRC-0006
  loc: "UNKNOWN"
  excerpt: "Das bedeutet auch keine wiederkehrenden User, keine Cookies fürs Tracking und so weiter."
evidence_sufficiency: S3
fit_criterion:
  scale: "Analytics cookies and persistent identifiers after a full journey across the website, excluding the registration surface of FUN-WEB-0205"
  operator: "="
  value: 0
  meter: "TS-WEB-0012-A2 — run by TS-WEB-0012-A1, TS-WEB-0012-A2, TS-WEB-0012-A9"
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0061

Analytics cookies and persistent identifiers after a full journey across the website, excluding the registration surface of FUN-WEB-0205, SHALL be = 0, measured by TS-WEB-0012-A2.

## Source

SRC-0006, DEC-0004

Unlocatable: the transcript is one line with no line terminators, so it supports no position scheme.

## Notes

"no tracking cookies, no persistent identifiers, no returning-visitor recognition" — all three are the same count. TS-WEB-0012-A2 walks the D1 inventory and reads `document.cookie` and web storage afterwards.

**The exception, and why the statement names it instead of the criterion quietly skipping it (DEC-0108 §3).** `/start` is a row of the `TS-WEB-0004 D1` inventory and since 2026-09-25 it renders a third party's form as a visible embed (`FUN-WEB-0205`, `TS-WEB-0016 D15`). The journey therefore runs through the embed, and whether a Google-hosted form sets a persistent identifier is precisely what nobody has confirmed (`CONF-0025` confidence, `DEM-0066`). A requirement that would be falsified by a route it silently includes is not a requirement. The scale excludes that one surface; everything else is unchanged, and the exception lapses with `FUN-WEB-0205`.

**The residual risk this exception carries, on the record.** On `/start` a third party is contacted **without the visitor having acted**, and no legal determination says that needs no consent. The owner accepted that risk on 2026-09-25 with the scenarios in front of him — he did not clear it. What is offered instead of consent is a notice above the embed (`FUN-WEB-0206`, `TS-WEB-0016 D17`). Two things would change it: the legal determination `DEM-0066` asks for, or the rebuild that removes Google (`Q-0022`, `DEC-0029`), after which this paragraph and the exception both go. `DEM-0066` is open and is not waived.

**What stays true site-wide:** `NFR-WEB-0062` — zero consent-banner components — is **not** narrowed and needs no exception. A notice is not a banner: nothing is gated, nothing is stored, and nothing on the page waits for it. The banner-free claim stands on `/start` too.
