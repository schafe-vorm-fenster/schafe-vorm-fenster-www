---
artefact: source-inventory
status: DRAFT
date: 2026-09-09
---

# Source Inventory — Website Relaunch

| ID | Source | Type | Trust | Rationale | Status |
| --- | --- | --- | --- | --- | --- |
| SRC-0001 | `go-to-market-os/concept/website-communication-principles.concept.md` | concept, governed | medium | workshop result, frontmatter-governed, status draft but decision-backed | read |
| SRC-0002 | `go-to-market-os/concept/website-relevance-model.concept.md` | concept, governed | medium | operationalizes SRC-0001 §3–5; weights explicitly marked "set, not measured" | read |
| SRC-0003 | `go-to-market-os/concept/website-information-architecture.concept.md` | concept, governed | low | applies SRC-0001/002 to pages; reference for prototype v1.0 | read |
| SRC-0004 | `schafe-vorm-fenster-www/concept/v1.0/Wireframes Mobile.dc.html` | prototype | low | illustrative, derived from SRC-0001..003; diverges in places (see Q-0002) | read |
| SRC-0005 | `schafe-vorm-fenster-www/concept/v1.0/README.md` | prototype notes | low | lists blockers and content provenance; partly overtaken by events | read |
| SRC-0006 | `schafe-vorm-fenster-www/concept/_archive/Schafe Webseite Anforderungen.txt` | voice transcript, raw | low | rich single-author brain dump; uncertain values confirmed or opened via DEC-0001..008 / Q-register | read, mined |
| SRC-0007 | `community-calendar/docs/localization-architecture.md`, `domains.md`, `performance-budget.md` | external product docs | low | proven product mechanism; adopted for the website by DEC-0005..007; canonical copy stays in `community-calendar` | read |
| SRC-0008 | `go-to-market-os` — `audiences/`, `strategy/` (business-goals, conversion-goals, positioning, value-propositions), `offerings/`, `brands/profiles/schafe-vorm-fenster/`, `proof/`, `media-echo/verified/` | reference universe | medium | single source of truth per ADR-001; referenced by ID, never copied | referenced |
| SRC-0009 | `go-to-market-os/handbook/decisions/001–004` | ADRs | medium | repository-level decisions binding this spec (content SSOT, layer model, audience model) | read |
| SRC-0010 | `schafe-vorm-fenster-www/legacy-content/` | archive | low | pre-relaunch site; consulted only for lookups (legacy URL inventory, eTracker config) | lookup only |
| SRC-0011 | `specs/contracts/api-contracts.md` — OpenAPI specs of the ecosystem services (`<host>/api/openapi`) | machine contract | medium | services publish OpenAPI 3.0+; product consumes them via documented convention (DEC-0021) | registered |
| SRC-0014 | `concept/website-design-system.md` + boards in `concept/v2.0/` | design specification, governed | medium | workshop result 2026-09-10; closes the design-system contract (SRC-0013), binding per DEC-0056 | read |
| SRC-0016 | Glossary: Standardized Vocabulary — Google Doc `1c5pDyo2PpYFdhlDltrTEjNWyBtlmaILAMudeG0r1Gis` | vocabulary, governed | low | the canonical bilingual vocabulary: geographic terms, product terms, roles. To become `@schafe-vorm-fenster/glossary` (DEC-0062, Q-0057) | read |
| SRC-0015 | `src/clients/*/openapi.json` — the six pinned service specifications | machine contract | medium | fetched from production 2026-09-11 and committed; refreshed by `pnpm fetch:openapi` (DEC-0058) | read |
| SRC-0013 | `specs/contracts/design-system-contract.md` — the expectation against `@schafe-vorm-fenster/brand-design` | contract | medium | states what the component layer must deliver; tokens already read from the installed package v2.6.0 | registered |
| SRC-0012 | `classification-api/.github/workflows/` — reference CI/CD setup (typecheck · lint · coverage · knip · jscpd · preview · auto-merge · deploy) | external reference setup | medium | running production pipeline of a sibling service; adopted as the model by DEC-0031 | read |
| SRC-0017 | `concept/website-copy-guide.md` — the website's wording specification | copy specification, governed | high | derived rule by rule from the owner's review of 2026-09-22 (`plan/reviews/2026-09-23/`), binding per DEC-0080; inherits from SRC-0001 and the hub's `brand-identity/tone-of-voice.md` | read |
| SRC-0018 | `specs/contracts/copy-contract.md` — which copy rule is enforced by which mechanism | contract | high | states what schema, lint, e2e and the editorial gate owe SRC-0017; the copy counterpart of SRC-0013 | registered |

## Quality vectors

`@leafcutter-strict/method-source-quality-rating` rates each source on six
dimensions from 0 to 3 and takes the **minimum**, not the average: *"a source
is as weak as its weakest dimension. Keep the full vector, because the vector
says what to fix and the minimum does not."* The mapping is the method's:
3 on all is `high`, minimum 2 is `medium`, minimum 1 is `low`, and a 0 on
locatability or authority makes the source unusable as sole evidence.

The `Trust` column above is now this table's `Level`, computed rather than
asserted. `Was` records what the inventory asserted before the vectors were
scored; where
the two differ the source did not change, the rating did.

`Sch.` is the contract's `locator_scheme`. L = locatability, A = authority,
C = currency, Cp = completeness, Sp = specificity, IC = internal consistency.

| ID | Sch. | L | A | C | Cp | Sp | IC | Min | Level | Was | Defects (every dimension at 0 or 1) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SRC-0001 | line | 3 | 3 | 3 | 2 | 2 | 3 | 2 | medium | high | — |
| SRC-0002 | line | 3 | 3 | 3 | 2 | 3 | 3 | 2 | medium | high | — |
| SRC-0003 | line | 3 | 3 | 1 | 2 | 2 | 3 | 1 | low | high | currency: stale |
| SRC-0004 | line | 3 | 2 | 1 | 2 | 2 | 2 | 1 | low | medium | currency: stale |
| SRC-0005 | line | 3 | 2 | 1 | 2 | 2 | 3 | 1 | low | medium | currency: stale |
| SRC-0006 | none | 1 | 3 | 2 | 1 | 1 | 2 | 1 | low | medium | locatability: unlocatable · completeness: incomplete · specificity: vague |
| SRC-0007 | line | 3 | 3 | 1 | 2 | 3 | 3 | 1 | low | high | currency: stale |
| SRC-0008 | line | 2 | 3 | 2 | 2 | 2 | 3 | 2 | medium | high | — |
| SRC-0009 | line | 3 | 3 | 3 | 2 | 2 | 3 | 2 | medium | high | — |
| SRC-0010 | line | 3 | 1 | 3 | 2 | 2 | 2 | 1 | low | low | authority: unauthoritative |
| SRC-0011 | line | 3 | 3 | 3 | 2 | 3 | 3 | 2 | medium | high | — |
| SRC-0012 | line | 3 | 3 | 2 | 3 | 3 | 3 | 2 | medium | high | — |
| SRC-0013 | line | 3 | 3 | 3 | 2 | 3 | 3 | 2 | medium | high | — |
| SRC-0014 | line | 3 | 3 | 3 | 2 | 3 | 2 | 2 | medium | high | — |
| SRC-0015 | line | 3 | 3 | 2 | 3 | 3 | 3 | 2 | medium | high | — |
| SRC-0016 | none | 1 | 3 | 2 | 2 | 2 | 2 | 1 | low | high | locatability: unlocatable |
| SRC-0017 | line | 3 | 3 | 3 | 3 | 3 | 3 | 3 | high | high | — |
| SRC-0018 | line | 3 | 3 | 3 | 3 | 3 | 3 | 3 | high | high | — |

### What each score rests on

- **SRC-0001** — Cp 2: four requirements attributed to it are not in it
  (`CON-WEB-0033`, `FUN-WEB-0125`, `FUN-WEB-0135`, `FUN-WEB-0136`), measured
  by the locator run. Sp 2: a principles document states rules, not measures.
- **SRC-0002** — Sp 3: it carries the formula, the weights and the radius.
  Cp 2: Q-0019 — the `audiences` field its own `w_job` term needs is not
  modelled.
- **SRC-0003** — C 1. This was the sharpest of the eighteen until 2026-09-25:
  line 35 said *"Contact and newsletter live in the footer"* against
  `CON-WEB-0061`, and line 205 gave `/ueber-uns` *"Primary conversion: none of
  its own"* against `FUN-WEB-0017`. **Both are amended** — hub commit `ee17e4e`
  (PR #510) — and the two requirements now cite lines 45 and 221 of the same
  document, which say what they say; `DEM-0001` is `ANSWERED` and the deviation
  records are withdrawn. C stays 1 on what is left: the `/dein-ort/starten`
  brief at line 143 is still *"Draft 2026-09-09 — … awaiting review"* after two
  weeks, with `FUN-WEB-0158` and `FUN-WEB-0159` resting on it (Q-0028,
  DEM-0025), and the companies open point at lines 274–275 is still open. Every
  locator into this file moved with the amendment, which is measured in the
  locator table of the re-resolution run rather than asserted here. **Whether
  the amendment lifts C from 1 to 2 — and with it the level from `low` to
  `medium`, since C is the only dimension at 1 — is not decided here**: a level
  is what the `S0–S3` gates read, so it has dependants, which puts it above the
  low impact level `POL-GRADED-BY-IMPACT` lets an agent decide at.
- **SRC-0004** — C 1: the v2.0 boards of SRC-0014 replaced its visual layer.
  A 2: a prototype is a role holder's illustration, not a mandate.
- **SRC-0005** — C 1 is the inventory's own words: *"partly overtaken by
  events"*.
- **SRC-0006** — **L 1, measured**: the file is 9,398 bytes on one line with
  no line terminators, so every claim in it resolves to `#L1` and the locator
  distinguishes nothing (DEC-0097 §3). Cp 1, measured: 18 of the 64
  requirements that cite it state something the transcript does not say.
  Sp 1: *"vernünftige Umleitungen"*, *"gute Beschreibungstexte"*, and a
  Lighthouse category transcribed as *"Dingsbumps"*. A 3 nevertheless — the
  speaker is the owner, and authority is not what is wrong with this source.
- **SRC-0007** — C 1: `docs/performance-budget.md` line 10 carries
  `FID < 100ms`, which the Core Web Vitals themselves superseded with INP.
  `NFR-WEB-0048` requires INP < 200 ms and the word INP appears nowhere in
  the three documents (DEC-0097 §4).
- **SRC-0008** — L 2: the registered source is a set of directories, so a
  citation of `SRC-0008` resolves to a tree; only naming the file inside
  reaches a line. Cp 2: Q-0049 and Q-0050 record artefacts the hub still owes.
- **SRC-0009** — Cp 2: `CON-WEB-0080` is not in ADR-001 and ADR-001 says the
  opposite, and `FUN-WEB-0179`'s supporting line sits under the ADR's own
  `## Open Questions`, phrased *"is better fetched at build time than
  versioned"* — an undecided preference the requirement hardened into a SHALL.
- **SRC-0010** — A 1: the pre-relaunch site states no author and carries no
  mandate. C 3, not 0: for the claim it is registered for — its own URL
  inventory and eTracker configuration — it is the record rather than a
  superseded one. The method re-rates at the point of use, and this is that.
- **SRC-0011** — Cp 2: Q-0037, Q-0038 and Q-0046 each record a field or an
  endpoint the specification needs and the published contracts do not have.
- **SRC-0012** — C 2: workflow files carry no date; nothing contradicts them.
- **SRC-0013** — Cp 2: Q-0044 — the `renders` binding of §4 is absent, and it
  is what turns specs plus content into a page.
- **SRC-0014** — IC 2: Q-0053 recorded a logo-radius collision with the
  brand-design README, Q-0054 that the logo files the tokens name do not
  ship, and `concept/v2.0/README.md` still cites a requirement identifier
  DEC-0093 retired. Cp 2: Q-0044 and Q-0058's residual.
- **SRC-0015** — C 2: a pinned copy of a moving contract, fetched 2026-09-11
  and not re-verified against production since. The method is explicit that
  *"currency in particular decays"*.
- **SRC-0016** — **L 1: it is the one source not readable from this
  repository.** It is a Google Doc id; no position inside it can be cited
  here, and no excerpt taken from it could be checked. IC 2: Q-0056 —
  *"Akteur = Organizer"* with no distinction between the outward and the
  internal register, which is one term with two meanings inside one document.
  No requirement rests on it today.
- **SRC-0017**, **SRC-0018** — 3 across the board, and they are the two
  sources written in this repository under a contract that says which rule is
  enforced by which mechanism. That is what a 3 on specificity looks like.

### What the rating changes, and what it does not

Nine sources drop from `high` to `medium`, three from `high` to `low`, three
from `medium` to `low`, and three are unchanged. Not one source changed; the
`high` on fifteen of them was asserted rather than derived, and the method's
bar for `high` is 3 on **all six**.

The rule this exists for, verbatim: *"An unlocatable or unauthoritative
source may corroborate other evidence. It may never be the sole evidence for
an artefact above draft status."* Every requirement in this repository is
`DRAFT` (DEC-0089), so nothing has to move today. What the vectors do is put
a price on moving: 64 requirements rest on `SRC-0006` alone, and it is `low`
with a measured defect on three of its six dimensions.

Each dimension at 0 or 1 raises a demand, as the method requires: *"a
defect for every dimension rated 0 or 1"*. Ten dimensions across seven
sources qualify, and they go into the demand register.

## Notes

- SRC-0006 is a transcription with recognition errors ("Scharfe vom
  Fenster", "host weiter noch Wurzel" = Vercel). Values were extracted
  conservatively; anything uncertain became a `Q-####` entry rather than a
  requirement value.
- SRC-0007: the three files are adopted **by content**, not by copy. The
  stale copies formerly under `schafe-vorm-fenster-www/docs/` were deleted
  (DEC-0008); the canonical mechanism documentation lives in the
  `community-calendar` repository.
- SRC-0008 becomes a set of npm packages shortly; references by ID and path
  are then hardened into `devDependencies` (see FUN-WEB-0171, CON-WEB-0077 ff.).
