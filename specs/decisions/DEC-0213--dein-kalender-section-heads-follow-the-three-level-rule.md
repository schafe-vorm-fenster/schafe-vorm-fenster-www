---
id: DEC-0213
title: The section heads of /dein-kalender follow the three-level rule, and the copy guide gets CG-048
status: DRAFT
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #163, follow-up to DEC-0206 (PR #179): the rule of at most three text
levels before a section's content, an optional kicker and no repeated stem or
statement. The warn-check `e2e/section-heads.spec.ts` listed 11 findings on
`/dein-kalender` and `/en/your-calendar` (`/dein-kalender/bestellen` is
exempt, its heads are composed step by step). Issues #44 and #51 ask for the
order "solution first, then the problem" to be a rule of the copy guide.

## Decision

### 1. Two sections lose a level

| Section | Before | Now |
| --- | --- | --- |
| `embed-demo` | kicker, transition line, heading, intro (4 levels); heading and intro share "Kalender" | kicker, heading, intro; the transition "So sieht das aus, wenn es bei euch steht:" goes; the intro names the places and the period without "Kalender" |
| `trust` | kicker, transition line, heading; the line and the heading share "Daten" | kicker, heading; the transition "Bleibt die Frage, wem ihr da eigentlich eure Daten gebt." goes |

The two transitions were the polish brief's G-3 joints, which DEC-0206 §1
withdraws. They carried no claim of their own, so nothing is lost. The
`TRANSITIONS` constant leaves `app/[lang]/dein-kalender/page.tsx`.

### 2. Sections this PR does not touch, and why

| Section | Findings | Reason |
| --- | --- | --- |
| `embed-config` | kicker and intro share "Kalender", "Website" | head dictated by the owner, #162 / DEC-0204 |
| `tiers` | heading and intro share "Kalender" | head dictated by the owner, #165 / DEC-0205; the kicker "Was es kostet" repeats nothing and stays |
| `proof` | kicker and heading share "nutzt"/"benutzt" | the proof section is #160 |
| `contrast` | none | the comparison head is #159 / DEC-0203 §2 |

### 3. CG-048 — the solution first, then the problem, in every pair

`concept/website-copy-guide.md` gets CG-048, the next free number after
CG-047. It carries DEC-0203's pair-wise order inside a section (each problem
directly beside its solution; the problem named in the kicker at most) next to
CG-042's order of sections. Mechanism: `review`, row in
`specs/contracts/copy-contract.md`.

## Consequences

- The warn-check shows 6 findings fewer on the two routes (DE 6 to 3, EN 5
  to 2), every one of them in a section named in §2.
- `e2e/pages/dein-kalender.spec.ts` asserts that the two transition lines are
  gone and that the embed intro stands.
- Status stays `DRAFT` (`POL-GRADED-BY-IMPACT`, DEC-0089).
