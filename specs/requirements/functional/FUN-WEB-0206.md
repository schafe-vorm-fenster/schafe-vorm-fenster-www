---
artefact: requirement
id: FUN-WEB-0206
class: FUN
form: F1
domain: WEB
status: DRAFT
version: 0.1.0
area: forms-and-leads
needs: [NEED-WEB-0004]
source:
  source_id: UNKNOWN
  loc: "UNKNOWN"
  excerpt: "UNKNOWN"
evidence_sufficiency: S3
fit_criterion: UNKNOWN
ai_provenance:
  prompt_id: UNKNOWN
  prompt_version: UNKNOWN
  model: "Claude Opus 5 (1M context)"
  generated_at: "2026-09-25T15:20:00+02:00"
---

# FUN-WEB-0206

On the registration surface, the website SHALL render, above the embed, a notice of what loading the embedded form does.

## Source

DEC-0108 (owner's answer to Q-0078, 2026-09-25).

Unlocatable: no registered source states it. The owner's answer is the evidence and this repository's only register for it is the decision record, as it was for `FUN-WEB-0205`.

Finding: This is a gap the isolation decision opened, not a rewrite. `TS-WEB-0016 D15` specified the embed and explicitly left the consent treatment open; nothing specified anything above the embed. The notice is what the owner chose **instead** of a consent banner and instead of a click-to-load layer, so it did not exist before the choice was made.

## Rationale

The embed contacts a third party on load, without the visitor acting. She cannot be asked — a consent gate contradicts the "visible" of `FUN-WEB-0205` and a banner is what `NFR-WEB-0062` forbids — so the minimum that is still honest is that she is **told**, in the same breath as the thing happening.

"Above the embed" is the operative part and the reason this is a requirement rather than a note: a notice under the form, or beside it, or inside the data-protection page only, is information she meets after the request has already gone out. The order is the whole content of the obligation.

It is not a control. Nothing on the page waits for it, it is not dismissible, and it grants nothing — a notice that can be clicked is a consent gate with a different label.

## Notes

The position, the three facts it must convey and the link target are `TS-WEB-0016 D17`; `TS-WEB-0016-A22` is the criterion, extended for it rather than a new one minted, because the notice and the embed are one determination's two halves.

**The words are not here.** The sentence is copy and the content phase writes it (`DEC-0083 §1`, repository working rule 4). This requirement fixes what the notice must achieve.

It lapses with `FUN-WEB-0205`: when the envoy widget lands (`Q-0022`) or the app registration entry gains a contract (`DEC-0029`), there is no embed to stand above.

The need is `NEED-WEB-0004` — *"a rural resident who would contribute needs to see what the step from reading to publishing would involve"* — because what the step involves includes handing her data to Google. No need in the register states a data-protection transparency need from the registrant's side; the three that do (`NEED-WEB-0017`, `NEED-WEB-0022`, `NEED-WEB-0029`) are the buying stakeholders' and are not who stands on this route.
