---
artefact: requirement
id: FUN-WEB-0205
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
  generated_at: "2026-09-25T09:50:00+02:00"
---

# FUN-WEB-0205

On the registration surface, the website SHALL render the registration form as a visible embed.

## Source

DEC-0013 amendment 2026-09-25 (A1 of `plan/reviews/2026-09-23/decisions-audit.md`).

Unlocatable: no registered source states it. `SRC-0010`, the pre-relaunch site, is where the embed exists — it is the surface behind the "Anmelden" entry of `legacy-content/app/components/navigation.ts` — but SRC-0010 is `lookup only` and carries no mandate (DEM-0008, waived), so it cannot be the evidence for a requirement.

Finding: This requirement was a gap, not a rewrite. `specs/` specified no registration embed anywhere: `TS-WEB-0023 D9` forbids every submission mechanism on `/mitmachen/registrieren`, `TS-WEB-0016 D6` required "linked, never embedded" for the Google Form, and the words "Google", "embed" and "iframe" do not occur in `TS-WEB-0023` at all. The audit asked whether the embed was already specified before writing it; it was not.

## Rationale

The registration and the contact component are two mechanisms, and the review conflated them. The contact component links out (`TS-WEB-0016 D7`, `D13`, `D16`); the registration receives an actual registration, and the only thing that does so today is the embedded Google Form. Removing the embed before there is a replacement would remove the capability.

"Visible" is the operative word and the reason this is a requirement rather than a note: a click-to-load layer, a `<details>` wrapper or a link that claims to be the form all satisfy "the registration runs through a Google Form" and none of them satisfies what was decided.

## Notes

The render form, the scope of the exception and what is owed are `TS-WEB-0016 D15`; `TS-WEB-0016-A22` is the criterion. It is an interim with a named end: the requirement lapses when the envoy widget lands (Q-0022) or the app registration entry gains a contract (DEC-0029).

**The consent treatment is settled and the legal question is not.** DEC-0108 (Q-0078, 2026-09-25) decided **ISOLATE**: the embed stays visible and immediate on this one route, with a notice above it (`FUN-WEB-0206`, `TS-WEB-0016 D17`) and no consent banner, no gate and no click-to-load layer. A notice is not consent, so `NFR-WEB-0062` stands unchanged; `NFR-WEB-0061` names this surface as its exception. `CONF-0025` is RESOLVED with outcome ISOLATE.

**The residual risk is the owner's, accepted with his eyes open:** this route contacts a third party without the visitor having acted, and no legal determination says that needs no consent. `DEM-0066` is open and stays open — it is one of the two things that reopen the decision, the other being the rebuild this requirement already lapses with.
