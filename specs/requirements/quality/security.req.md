---
artefact: requirements
area: security
status: DRAFT
sources: [SRC-006]
decisions: [DEC-014, DEC-015, DEC-017]
---

# Security

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-Q-030 | An enforced Content-Security-Policy with an explicit allowlist shall be active from the first deployment; the initial list covers envoy, eTracker, and `app.schafe-vorm-fenster.de`. | DEC-015 | S3 |
| WEB-Q-031 | Every addition to the CSP allowlist is a reviewed change (PR), never a wildcard. | DEC-015 | S3 |
| WEB-Q-032 | Security headers shall be set site-wide: HSTS, `frame-ancestors` (deny except app-embed needs), referrer-policy, `X-Content-Type-Options`, permissions-policy. | DEC-015 | S3 |
| WEB-Q-033 | Dependency scanning shall run in CI (e.g. Trivy/Dependabot); critical findings block release. | DEC-015 | S3 |
| WEB-Q-034 | All traffic is HTTPS; HTTP redirects permanently. | platform default | S2 |
| WEB-Q-035 | Form abuse protection is honeypot fields, submission-timing checks, and server-side rate limiting — no captcha. Binds the envoy widget (Q-022). | DEC-014 | S3 |
| WEB-Q-036 | Production errors and availability shall be observed through Vercel-native means (logs, runtime errors, existing uptime monitoring); no additional tracking service. | DEC-017 | S3 |
