---
artefact: requirements
area: personalization
status: DRAFT
sources: [SRC-001, SRC-006]
---

# Personalization Stages

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-050 | The website shall operate the four knowledge stages of SRC-001 §6 (0 nothing · 1 approximate location · 2 entry context · 3 stated concern) and never ask the visitor to classify herself. | SRC-001#6-assumptions-not-switches | S2 |
| WEB-F-051 | Stage 0 shall be complete and convincing on its own. | SRC-001#6 | S2 |
| WEB-F-052 | Higher stages shall change only selection and order of proof and live modules — never page structure, never the focus job, with the single exception WEB-F-044. | SRC-001#6 | S2 |
| WEB-F-053 | Location shall be detected invisibly (IP geolocation; browser geolocation only after an interaction). County-level resolution is required, municipality-level desirable, place-level explicitly not pursued ("spooky"). | SRC-006 (transcript), SRC-001#6 | S2 |
| WEB-F-054 | IP-based geolocation shall process without storing personal data; legal verification pending (Q-008). | SRC-006, SRC-005#blockers | S1 |
| WEB-F-055 | Entry context (referrer, UTM, campaign, deep link) shall preselect focus job and proof type per the context matrix (SRC-002). | SRC-001#6, SRC-002#context-matrix | S2 |
| WEB-F-056 | Regional content variation shall key on the visitor's state/county (e.g. Niedersachsen vs Mecklenburg-Vorpommern entry). | SRC-006 | S2 |
