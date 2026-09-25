# Concept

## Two kinds of concept, two homes

`go-to-market-os` owns **what the website says**. This repository owns
**how that is produced and rendered**. The line is ADR-002's folder-class
test applied across repository boundaries: a document that governs
content is content and belongs to the hub; a document that governs the
work done in this repository belongs here.

| | Lives in `go-to-market-os` | Lives here |
| --- | --- | --- |
| Answers | what the website communicates | how it is produced |
| Documents | communication principles, relevance model, information architecture, brand voice | [`website-content-production.concept.md`](./website-content-production.concept.md), [`website-design-system.md`](./website-design-system.md), [`website-copy-guide.md`](./website-copy-guide.md) |
| Status | binding | draft, and not binding until its decision point |
| References | `audiences/`, `offerings/`, `proof/` by relative path | this repository's schemas, compositions, components, playbooks |

**Three local documents, two classes** (DEC-0104 §3). The folder holds one
*working concept* and two *prescriptive specifications*, and the difference
decides what happens when one of them disagrees with a spec:

| | Working concept | Prescriptive, bound by a contract |
| --- | --- | --- |
| Document | `website-content-production.concept.md` | `website-design-system.md` (SRC-0014) · `website-copy-guide.md` (SRC-0017) |
| Holds | how this repository turns hub packages into rendered pages | components, measures, token values, forty-one numbered copy rules |
| Side | input | **specification** — a spec that contradicts it is a defect in the spec |
| Binding | TS-WEB-0007 implements it | [`design-system-contract.md`](../specs/contracts/design-system-contract.md) (SRC-0013) · [`copy-contract.md`](../specs/contracts/copy-contract.md) (SRC-0018) — every rule assigned to a mechanism |
| Status | draft | draft — being truth is not being approved |

Both prescriptive documents stay in this folder rather than moving under
`specs/`. DEC-0104 §3 gives the four reasons: `specs/` holds the method's
artefact families and neither guide is one of them, the specification side is a
status carried by a contract rather than a directory, a move would retire
several hundred verified locators for no gain in checkability, and this folder
was already two classes — what was missing was this table, not a different path.

## Where the website concept lives

**The three concept documents that govern this website are not in this
repository.** They live in `go-to-market-os`, which is the single source of
truth for the concept and for all content — see
[ADR-001](https://github.com/schafe-vorm-fenster/go-to-market-os/blob/main/handbook/decisions/001-content-source-of-truth.adr.md).

**Local path:** `/Users/jan-henrik.hempel/Projects/go-to-market-os`
(sibling of this repository in the workspace)

**Repository:** <https://github.com/schafe-vorm-fenster/go-to-market-os> (private)

Beyond the three documents below, that repository also holds the audiences,
conversion goals, positioning and value propositions, offerings and pricing,
tone of voice, brand, proof, and media echo. `specs/README.md` in this
repository maps each of them to its path.

They are binding for information architecture, navigation, page briefs, and
copy. Read them before building or changing a page.

| Document | What it governs | Path in `go-to-market-os` |
| --- | --- | --- |
| **Communication Principles** | The seven principles, the four jobs, and the eight-point compliance check a page brief must pass | [`concept/website-communication-principles.concept.md`](https://github.com/schafe-vorm-fenster/go-to-market-os/blob/main/concept/website-communication-principles.concept.md) |
| **Relevance Model** | How proof and live content are selected and ordered: the two axes, the scoring formula, the sequence rule, the context matrix | [`concept/website-relevance-model.concept.md`](https://github.com/schafe-vorm-fenster/go-to-market-os/blob/main/concept/website-relevance-model.concept.md) |
| **Information Architecture** | The eight pages, their page briefs, and the conversion map | [`concept/website-information-architecture.concept.md`](https://github.com/schafe-vorm-fenster/go-to-market-os/blob/main/concept/website-information-architecture.concept.md) |

The documents reference `strategy/conversion-goals/`, `audiences/`,
`offerings/`, `proof/`, and `media-echo/` by relative path. Those folders
exist only in `go-to-market-os`, which is why the documents cannot live
here.

## The three concept documents that live here

`website-content-production.concept.md` specifies the content pipeline —
source layer, schema hierarchy, mapping skeleton, components, processes.
It lives in this repository because it is about how *this* repository
turns hub packages into rendered pages; the hub owns what is said, this
document owns how it gets here. TS-WEB-0007 implements it.

`website-design-system.md` specifies how the brand is applied to this
website: colour roles, type scale, components, page rhythm, aspect ratios
and reserved space, icons, motion, accessibility. It consumes the tokens
of `@schafe-vorm-fenster/brand-design` and adds the layer above them —
the components and composition that the tokens alone do not carry. The
visual boards are in [`v2.0/`](v2.0/).

`website-copy-guide.md` is the same move one layer over: it consumes the
hub's tone of voice (`packages/identity/brand-identity/tone-of-voice.md`)
and the communication principles, and adds the website's own cut — the
register per page, the structure of a section, the per-block length
budgets at 390 px, and the use/avoid word list. It is bound to the build
by [`../specs/contracts/copy-contract.md`](../specs/contracts/copy-contract.md),
exactly as the design system is bound by the design-system contract
(DEC-0080).

## What stays in this repository

- `website-content-production.concept.md` — the content production system:
  source entities, the content schema hierarchy, page compositions,
  components, and the playbooks that transform hub records into
  multilingual page copy. It implements ADR-001 and DEC-0020 and carries
  the relevance contract of TS-WEB-0005. Draft; it is a working concept, not a
  governing document.
- `website-design-system.md` (SRC-0014) — the binding visual specification,
  bound by the design-system contract (SRC-0013, DEC-0056). Specification-side,
  not concept input (DEC-0104 §3).
- `website-copy-guide.md` (SRC-0017) — the binding wording specification,
  bound by the copy contract (SRC-0018, DEC-0080). It governs how the
  website writes; what it says stays in the hub. Specification-side, not
  concept input (DEC-0104 §3).
- `v1.0/` — the clickable prototype. It is an implementation artifact, not
  content: it renders the relevance model rather than defining it.
- `_archive/` — raw workshop input the concept documents were derived from.

## Rules

1. Do not copy the three governing concept documents into this
   repository. Link to them. A locally owned process concept is not a
   copy — it says how work is done here, not what the site communicates.
2. **The specification carries the truth; a hub concept document is input and
   evidence** (DEC-0104, `specs/README.md` rule 4). A page is built to the
   spec. Where the spec and a hub concept document disagree, the spec stands
   and the deviation is recorded twice — on the artefact and as a `DEM-####`
   against the source (`specs/README.md` rule 5). It is never settled
   silently, and it is no longer settled by the source winning by default.
2a. The two prescriptive local documents are the exception, because they are
   not input: a page or a spec that contradicts `website-design-system.md` or
   `website-copy-guide.md` is wrong, and the correction goes into the page or
   the spec. Correcting a guide is a decision with a record — DEC-0082 §2 and
   DEC-0080 §3 are what that looks like.
3. Conversion goal IDs, audience IDs, offering IDs, and proof IDs are
   defined in `go-to-market-os`. This repository consumes them and does not
   invent its own.
