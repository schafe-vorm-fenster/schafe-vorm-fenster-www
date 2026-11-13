---
artefact: requirement
id: CON-WEB-0091
class: CON
form: C1
domain: WEB
status: DRAFT
version: 0.1.0
area: scope-boundaries
needs: [NEED-WEB-0015]
source:
  source_id: SRC-0001
  loc: "go-to-market-os/concept/website-communication-principles.concept.md#L307"
  excerpt: "The website publishes prices only for offerings with"
evidence_sufficiency: S2
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-24T17:40:00+02:00"
---

# CON-WEB-0091

The solution SHALL publish a price only for an offering carrying `promotion: promoted`, imposed by SRC-0001 "Boundaries" and `@schafe-vorm-fenster/offerings`.

## Source

SRC-0001#boundaries, `@schafe-vorm-fenster/offerings`

Finding: The qualifier `promotion: promoted` wraps onto line 308; line 307 carries the rule itself.

## Notes

An offering carrying `promotion: withheld` — `portalize-website-widget` and `local-advertising` today — is not presented at all, which is CON-WEB-0015.
