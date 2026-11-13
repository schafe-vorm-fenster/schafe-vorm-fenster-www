# Decisions from the specification audit, 2026-09-25

The specs were audited twice — once for gaps and contradictions, once for
semantic soundness and fit — and the findings were put to Jan as confirming
and adversarial questions. These are his answers. Each becomes a decision
record or an amendment; this file is the record of what was decided and why.

## Governance — the largest change

| # | Question | Decision |
| --- | --- | --- |
| G1 | Concept documents or specs — which carries the truth? | **The specification carries the truth; a concept document is input and evidence.** This inverts `specs/README.md` rule 4. In STRICT terms it is what a source already is: a requirement *cites* a source, it does not obey one. |
| G2 | What happens when a spec and a source disagree? | **The spec wins, and the deviation is recorded** — at the artefact, naming the source line it contradicts and why, and as a demand against the source. Never silently. The conflict and demand registers exist for exactly this. |
| G3 | The two local guides (design system, copy guide) | **They are truth, not input.** They are prescriptive — components, measures, rules — so they move to the specification side and are carried through their contracts, which become the checkable binding. Both leave `status: draft`. |
| G4 | The hub concepts (principles, relevance model, IA) | **Stay in the hub, cited here as `SRC-####` with locators.** Copying is forbidden by the repo's own rule and the locators already exist. What changes is only that a contradiction is no longer a spec defect but a demand against the hub. |

## The sixteen review decisions — corrections

| # | Finding | Decision |
| --- | --- | --- |
| A1 | The audit read the review as demanding an embedded, consent-gated Google form in the contact section | **Two different things, and the audit conflated them.** The *registration* runs through an embedded Google form, and it must stay visibly embedded until it is rebuilt. The *contact component* — appointment, WhatsApp, phone, mail — links out to Google, with the privacy note small, under the link. No form is embedded there. |
| A2 | The contact form was the only channel that produced a message and was countable | **No form. The loss of measurability is accepted.** |
| A3 | `/ueber-uns`: the reasoning is about the reader who finished; the criterion put the CTA above the fold | **Closing block only.** The first viewport carries the origin story, not a sales ask. |
| A4 | Price order: the review said "free tier at the bottom" twice; the decision was "free first" | **Free first stands, but the button weight flips** — the paid tier gets the strong button, the free tier one quiet CTA. Recorded as a deliberate deviation from the review so the next reader does not take it for an oversight. |
| A5 | The IA contradicts four landed decisions | **Amend all four points in the hub** — contact out of the footer sentence, `/ueber-uns` gets its conversion, the conversion map gains the row, the village argument becomes 280 inhabitants without the salesperson clause. Not because the IA outranks the specs (it no longer does), but because misleading input produces misleading work. |
| A6 | The explain module is fixed in the guide and free in `TS-WEB-0022 D4` | **The three publishing paths on `/mitmachen` are the explain module.** The step count and the render form stop being free; the criteria gain the 390 px single-line and one-viewport assertions the copy guide already budgets for. |
| A7 | Seven decisions have no decision record | **One combined record for the design layer** (scrim, blur primitive, category taxonomy, motion exception, map date) and **one each** for the product name and the path-03 boundary. |
| A8 | Three elements wear the primary treatment on `/dein-kalender` | **The repeat may carry it.** The ladder gains the missing rung: everything that is not the primary conversion *or its repeat* is secondary. The tier-2 button is a purchase goal in its own right and keeps the strong weight per A4. |
| A9 | The scrim went to 0.72 on a per-photograph measurement that nothing performs | **A fixed value, taken from the design draft** — the authored ladder with its 0.72 ceiling. A measurement per image is not practical. The composite qualification stays a design rule; the crop and focal-point rules carry the motif responsibility. |
| A10 | `TS-WEB-0016 D12/D13` supersedes `DEC-0081 §4` with no record | **Four intent events, the second goal on row 1, and the decision record amended** to carry it. The contradicting criterion is corrected. |
| A11 | The path-03 price boundary exists in no spec | **A business rule**, cited by the requirement that applies it on `/mitmachen`, with the hint banner as a determination and a criterion behind it. |
