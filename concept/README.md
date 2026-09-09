# Concept

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

## What stays in this repository

- `v1.0/` — the clickable prototype. It is an implementation artifact, not
  content: it renders the relevance model rather than defining it.
- `_archive/` — raw workshop input the concept documents were derived from.

## Rules

1. Do not copy the concept documents into this repository. Link to them.
2. If a page contradicts a concept document, the concept document wins —
   or it is changed first, in `go-to-market-os`.
3. Conversion goal IDs, audience IDs, offering IDs, and proof IDs are
   defined in `go-to-market-os`. This repository consumes them and does not
   invent its own.
