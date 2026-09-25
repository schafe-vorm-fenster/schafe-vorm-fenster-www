---
artefact: requirement
id: BUS-WEB-0017
class: BUS
form: B1
domain: WEB
status: DRAFT
version: 0.1.0
area: scope-boundaries
needs: [NEED-WEB-0015, NEED-WEB-0016]
source:
  source_id: SRC-0008
  loc: "@schafe-vorm-fenster/offerings/community-calendar.offering.md#L111"
  excerpt: "**A source the platform already supports publishes free.**"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-25T09:30:00+02:00"
---

# BUS-WEB-0017

For a publishing path whose source the platform already supports, publishing counts as free of charge.

## Source

SRC-0008 — `@schafe-vorm-fenster/offerings`, `community-calendar.offering.md#L98`–`#L125` and `custom-data-integration.offering.md#L92`–`#L114`, read in the installed package at **0.3.5**. DEC-0107.

The position is given in the published package rather than in a hub repository path, because a published version is a fixed artefact and this one was the artefact read.

Finding: Re-resolved 2026-09-25 against 0.3.5. The offering now states this rule in its own words at line 111 of `community-calendar.offering.md`, with the three standard sources on lines 112–113 and the system-not-format test on lines 118–123; the previous locator, line 107, carried the included publishing paths and the excerpt wrapped onto line 108 even in 0.3.3. `custom-data-integration.offering.md` lines 104–110 now put the standard sources outside the paid scope in so many words, including "An ICS feed was named here as part of the paid scope until 2026-09-25 … and it was wrong".

Amendment 2026-09-25: the recorded deviation against `custom-data-integration.offering.md#L88` in 0.3.3 is withdrawn. That line — "Included: interpreting the source — an interface, an ICS feed, or a web interface" — does not exist in 0.3.5, which is the edit DEM-0065 required, so DEM-0065 is ANSWERED. Nothing is left for a `Deviation:` line to name.

## Rationale

It is true of the business whoever applies it — a website, a quotation, a support conversation or nobody. It has no system subject, which is question 1 of `@leafcutter-strict/method-requirement-classification`'s tree and the reason this is a business rule rather than a page behaviour.

The rule states only the **free** side, and that is deliberate rather than a half-rule. The paid side needs no artefact here: `custom-data-integration` is a published offering, `commercial_model: paid`, `promotion: on-request-only`, and its own record carries what it costs. What was missing from every register was the *free* side and the boundary between them, and a two-clause statement would be the compound `method-statement-grammar` forbids.

## Notes

Applied on the website by FUN-WEB-0204. The list of standard sources is the offering's, not this specification's, and it carries it since 0.3.5 — lines 112–113, with lines 230–234 stating that the list is owned there and grows as the platform learns to read more sources.

**The cooperations are not instances of this rule.** `kirche-mv.de`, VEVG Karlsburg and the Volkshochschulen are connected without an invoice as **explicit cooperations** (owner, 2026-09-25), not because their source is one the platform already supports. They remain the reference cases of the **paid** `custom-data-integration` add-on. Nothing in this specification may present them as examples of the free path, and the offering record's own Open Points now read the other way — `custom-data-integration.offering.md` lines 217–230 make `kirche-mv.de` free where no per-customer parser is needed and VEVG Karlsburg free "wherever" it offers an ICS export. That is the hub's statement, not this specification's, and DEM-0067 asks for it to be corrected rather than restating it here.
