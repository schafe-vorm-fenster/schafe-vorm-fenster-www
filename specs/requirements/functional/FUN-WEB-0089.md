---
artefact: requirement
id: FUN-WEB-0089
class: FUN
form: F1
domain: WEB
status: DRAFT
area: content-pipeline
source: "DEC-0020"
evidence_sufficiency: S3
---

# FUN-WEB-0089

For every website content format, the repository SHALL define a Zod schema — frontmatter fields plus `describe()` guidance on lengths, phrasing and tone per field — as the binding contract for generation agents.

## Notes

Starting point: `src/domain/content-frontmatter.schema.ts` (reshape to the new formats).
