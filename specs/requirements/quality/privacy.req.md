---
artefact: requirements
area: privacy
status: DRAFT
sources: [SRC-0006, SRC-0001]
decisions: [DEC-0004]
---

# Privacy

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| NFR-WEB-0020 | Web analytics shall be cookieless and consent-banner-free: no tracking cookies, no persistent identifiers, no returning-visitor recognition. | SRC-0006, DEC-0004 | S3 |
| NFR-WEB-0021 | eTracker continues as the implementation — an interim decision, replaceable; its configuration shall be extracted from the legacy site (SRC-0010). One account, one property across all domains **and the app**; cross-domain conversions converge there. | SRC-0006, DEC-0004, DEC-0028 | S3 |
| NFR-WEB-0022 | No new ad-hoc tracking is introduced with the relaunch. | SRC-0006, DEC-0004 | S3 |
| NFR-WEB-0023 | The absence of tracking cookies is itself a communicated trust argument (data-protection block on `/dein-kalender`); the implementation must keep the claim true. | SRC-0001#boundaries, SRC-0003 | S2 |
| NFR-WEB-0024 | IP geolocation (FUN-WEB-0053) shall process without storage; DPIA/legal check pending (Q-0008). | SRC-0006 | S1 |
| NFR-WEB-0025 | Embedded live data and any third-party requests shall be reviewed for GDPR implications; self-hosting is preferred over third-party CDNs (fonts already self-hosted, NFR-WEB-0005). | derived; convention | S1 |
| NFR-WEB-0028 | Launch ships conversion measurement only: one eTracker event per conversion goal ID. The website measures up to the handover (app opens, registration start); completion is measured by the app in the shared account. Campaign attribution keeps the `etcc_*` convention. A/B experimentation (H1–H6) stays deferred. | DEC-0016, DEC-0028 | S3 |
