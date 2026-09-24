---
artefact: requirement
id: NFR-WEB-0037
class: NFR
domain: WEB
status: DRAFT
area: security
source: "DEC-0025"
evidence_sufficiency: S3
---

# NFR-WEB-0037

External API tokens never reach the client. The website exposes use-case-tailored endpoints for client interactions and calls ecosystem APIs exclusively server-side (BFF).
