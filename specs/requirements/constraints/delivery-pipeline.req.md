---
artefact: requirements
area: delivery-pipeline
status: DRAFT
sources: [SRC-0012]
decisions: [DEC-0031]
---

# Delivery Pipeline

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| CON-WEB-0020 | Migration stage: the `next-2026` branch deploys to `next.schafe-vorm-fenster.de` (the product's pre-launch preview vacates it — internal coordination, not a blocker), with Vercel deployment protection enabled and `noindex`, so the full deploy chain runs without going live. | DEC-0031, DEC-0035 | S3 |
| CON-WEB-0021 | Operation stage: a GitHub Actions pipeline modelled on `classification-api` (SRC-0012) shall gate every merge — typecheck, lint, tests with coverage, dead-code (knip) and duplication (jscpd) checks, preview deployment per feature branch, merge checks and auto-merge rules. | DEC-0031 | S3 |
| CON-WEB-0022 | Production promotion shall be a rolling deployment gated by e2e execution with an explicit rollout-or-rollback decision. | DEC-0031 | S3 |
| CON-WEB-0023 | All preview/non-production deployments carry deployment protection and `noindex` — no preview content reaches search engines. | DEC-0031 | S3 |
