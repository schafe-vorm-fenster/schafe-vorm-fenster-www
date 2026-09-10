---
artefact: requirements
area: privacy
status: DRAFT
sources: [SRC-006, SRC-001]
decisions: [DEC-004]
---

# Privacy

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-Q-020 | Web analytics shall be cookieless and consent-banner-free: no tracking cookies, no persistent identifiers, no returning-visitor recognition. | SRC-006, DEC-004 | S3 |
| WEB-Q-021 | eTracker continues as the implementation — an interim decision, replaceable; its configuration shall be extracted from the legacy site (SRC-010). One account, one property across all domains **and the app**; cross-domain conversions converge there. | SRC-006, DEC-004, DEC-028 | S3 |
| WEB-Q-022 | No new ad-hoc tracking is introduced with the relaunch. | SRC-006, DEC-004 | S3 |
| WEB-Q-023 | The absence of tracking cookies is itself a communicated trust argument (data-protection block on `/dein-kalender`); the implementation must keep the claim true. | SRC-001#boundaries, SRC-003 | S2 |
| WEB-Q-024 | IP geolocation (WEB-F-053) shall process without storage; DPIA/legal check pending (Q-008). | SRC-006 | S1 |
| WEB-Q-025 | Embedded live data and any third-party requests shall be reviewed for GDPR implications; self-hosting is preferred over third-party CDNs (fonts already self-hosted, WEB-Q-005). | derived; convention | S1 |
| WEB-Q-028 | Launch ships conversion measurement only: one eTracker event per conversion goal ID. The website measures up to the handover (app opens, registration start); completion is measured by the app in the shared account. Campaign attribution keeps the `etcc_*` convention. A/B experimentation (H1–H6) stays deferred. | DEC-016, DEC-028 | S3 |
