---
artefact: requirements
area: security
status: DRAFT
sources: [SRC-0006]
decisions: [DEC-0014, DEC-0015, DEC-0017]
---

# Security

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| NFR-WEB-0030 | An enforced Content-Security-Policy with an explicit allowlist shall be active from the first deployment; the initial list covers envoy, eTracker, and `app.schafe-vorm-fenster.de`. | DEC-0015 | S3 |
| NFR-WEB-0031 | Every addition to the CSP allowlist is a reviewed change (PR), never a wildcard. | DEC-0015 | S3 |
| NFR-WEB-0032 | Security headers shall be set site-wide: HSTS, `frame-ancestors` (deny except app-embed needs), referrer-policy, `X-Content-Type-Options`, permissions-policy. | DEC-0015 | S3 |
| NFR-WEB-0033 | Dependency scanning shall run in CI (e.g. Trivy/Dependabot); critical findings block release. | DEC-0015 | S3 |
| NFR-WEB-0034 | All traffic is HTTPS; HTTP redirects permanently. | platform default | S2 |
| NFR-WEB-0035 | Form abuse protection is honeypot fields, submission-timing checks, and server-side rate limiting — no captcha. Binds the envoy widget (Q-0022). | DEC-0014 | S3 |
| NFR-WEB-0036 | Production errors and availability shall be observed through Vercel-native means (logs, runtime errors, existing uptime monitoring); no additional tracking service. | DEC-0017 | S3 |
| NFR-WEB-0037 | External API tokens never reach the client. The website exposes use-case-tailored endpoints for client interactions and calls ecosystem APIs exclusively server-side (BFF). | DEC-0025 | S3 |
| NFR-WEB-0038 | The website's client-facing endpoints are protected by rate limiting and origin checks; no client-side auth tokens for public read data. | DEC-0025 | S3 |
