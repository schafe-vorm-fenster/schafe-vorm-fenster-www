---
artefact: requirement
id: NFR-WEB-0024
class: NFR
form: Q1
domain: WEB
status: DRAFT
version: 0.1.0
area: privacy
source: "SRC-0006"
evidence_sufficiency: S1
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T16:45:00+02:00"
---

# NFR-WEB-0024

Persisted IP addresses on the geolocation path SHALL be = 0 addresses, measured by TS-WEB-0013-A6.

## Notes

Original statement: "IP geolocation (FUN-WEB-0160, FUN-WEB-0161, FUN-WEB-0162, CON-WEB-0073) shall process without storage; DPIA/legal check pending (Q-0008)." The DPIA clause is Q-0008, an open question rather than a requirement, and is kept here. TS-WEB-0013-A6: "The geo resolver returns at most county-level, writes nothing, and no returned or cached key contains an IP address." No test references A6 yet (W3).
