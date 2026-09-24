---
artefact: requirements
area: personalization
status: DRAFT
sources: [SRC-0001, SRC-0006]
---

# Personalization Stages

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| FUN-WEB-0050 | The website shall operate the four knowledge stages of SRC-0001 §6 (0 nothing · 1 approximate location · 2 entry context · 3 stated concern) and never ask the visitor to classify herself. | SRC-0001#6-assumptions-not-switches | S2 |
| FUN-WEB-0051 | Stage 0 shall be complete and convincing on its own. | SRC-0001#6 | S2 |
| FUN-WEB-0052 | Higher stages shall change only selection and order of proof and live modules — never page structure, never the focus job, with the single exception FUN-WEB-0044. | SRC-0001#6 | S2 |
| FUN-WEB-0053 | Location shall be detected invisibly (IP geolocation; browser geolocation only after an interaction). County-level resolution is required, municipality-level desirable, place-level explicitly not pursued ("spooky"). | SRC-0006 (transcript), SRC-0001#6 | S2 |
| FUN-WEB-0054 | IP-based geolocation shall process without storing personal data; legal verification pending (Q-0008). | SRC-0006, SRC-0005#blockers | S1 |
| FUN-WEB-0055 | Entry context (referrer, UTM, campaign, deep link) shall preselect focus job and proof type per the context matrix (SRC-0002). | SRC-0001#6, SRC-0002#context-matrix | S2 |
| FUN-WEB-0056 | Regional content variation shall key on the visitor's state/county (e.g. Niedersachsen vs Mecklenburg-Vorpommern entry). | SRC-0006 | S2 |
