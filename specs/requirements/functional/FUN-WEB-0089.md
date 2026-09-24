---
artefact: requirement
id: FUN-WEB-0089
class: FUN
domain: WEB
status: DRAFT
area: content-pipeline
source: "DEC-0020"
evidence_sufficiency: S3
---

# FUN-WEB-0089

Website content formats shall be defined as Zod schemas in this repository: frontmatter fields plus `describe()` guidance on lengths, phrasing, and tone per field — the schema is the binding contract for generation agents. Starting point: `src/domain/content-frontmatter.schema.ts` (reshape to the new formats).
