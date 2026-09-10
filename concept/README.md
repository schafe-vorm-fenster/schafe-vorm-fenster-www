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
| Documents | communication principles, relevance model, information architecture | [`website-content-production.concept.md`](./website-content-production.concept.md) |
| Status | binding | draft, and not binding until its decision point |
| References | `audiences/`, `offerings/`, `proof/` by relative path | this repository's schemas, compositions, components, playbooks |

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

## The one concept document that lives here

`website-content-production.concept.md` specifies the content pipeline —
source layer, schema hierarchy, mapping skeleton, components, processes.
It lives in this repository because it is about how *this* repository
turns hub packages into rendered pages; the hub owns what is said, this
document owns how it gets here. TS-007 implements it.

## What stays in this repository

- `website-content-production.concept.md` — the content production system:
  source entities, the content schema hierarchy, page compositions,
  components, and the playbooks that transform hub records into
  multilingual page copy. It implements ADR-001 and DEC-020 and carries
  the relevance contract of TS-005. Draft; it is a working concept, not a
  governing document.
- `v1.0/` — the clickable prototype. It is an implementation artifact, not
  content: it renders the relevance model rather than defining it.
- `_archive/` — raw workshop input the concept documents were derived from.

## Rules

1. Do not copy the three governing concept documents into this
   repository. Link to them. A locally owned process concept is not a
   copy — it says how work is done here, not what the site communicates.
2. If a page contradicts a concept document, the concept document wins —
   or it is changed first, in `go-to-market-os`.
3. Conversion goal IDs, audience IDs, offering IDs, and proof IDs are
   defined in `go-to-market-os`. This repository consumes them and does not
   invent its own.
