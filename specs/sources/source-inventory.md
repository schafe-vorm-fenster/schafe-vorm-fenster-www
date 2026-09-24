---
artefact: source-inventory
status: DRAFT
date: 2026-09-09
---

# Source Inventory — Website Relaunch

| ID | Source | Type | Trust | Rationale | Status |
| --- | --- | --- | --- | --- | --- |
| SRC-0001 | `go-to-market-os/concept/website-communication-principles.concept.md` | concept, governed | high | workshop result, frontmatter-governed, status draft but decision-backed | read |
| SRC-0002 | `go-to-market-os/concept/website-relevance-model.concept.md` | concept, governed | high | operationalizes SRC-0001 §3–5; weights explicitly marked "set, not measured" | read |
| SRC-0003 | `go-to-market-os/concept/website-information-architecture.concept.md` | concept, governed | high | applies SRC-0001/002 to pages; reference for prototype v1.0 | read |
| SRC-0004 | `schafe-vorm-fenster-www/concept/v1.0/Wireframes Mobile.dc.html` | prototype | medium | illustrative, derived from SRC-0001..003; diverges in places (see Q-0002) | read |
| SRC-0005 | `schafe-vorm-fenster-www/concept/v1.0/README.md` | prototype notes | medium | lists blockers and content provenance; partly overtaken by events | read |
| SRC-0006 | `schafe-vorm-fenster-www/concept/_archive/Schafe Webseite Anforderungen.txt` | voice transcript, raw | medium | rich single-author brain dump; uncertain values confirmed or opened via DEC-0001..008 / Q-register | read, mined |
| SRC-0007 | `community-calendar/docs/localization-architecture.md`, `domains.md`, `performance-budget.md` | external product docs | high | proven product mechanism; adopted for the website by DEC-0005..007; canonical copy stays in `community-calendar` | read |
| SRC-0008 | `go-to-market-os` — `audiences/`, `strategy/` (business-goals, conversion-goals, positioning, value-propositions), `offerings/`, `brands/profiles/schafe-vorm-fenster/`, `proof/`, `media-echo/verified/` | reference universe | high | single source of truth per ADR-001; referenced by ID, never copied | referenced |
| SRC-0009 | `go-to-market-os/handbook/decisions/001–004` | ADRs | high | repository-level decisions binding this spec (content SSOT, layer model, audience model) | read |
| SRC-0010 | `schafe-vorm-fenster-www/legacy-content/` | archive | low | pre-relaunch site; consulted only for lookups (legacy URL inventory, eTracker config) | lookup only |
| SRC-0011 | `specs/contracts/api-contracts.md` — OpenAPI specs of the ecosystem services (`<host>/api/openapi`) | machine contract | high | services publish OpenAPI 3.0+; product consumes them via documented convention (DEC-0021) | registered |
| SRC-0014 | `concept/website-design-system.md` + boards in `concept/v2.0/` | design specification, governed | high | workshop result 2026-09-10; closes the design-system contract (SRC-0013), binding per DEC-0056 | read |
| SRC-0016 | Glossary: Standardized Vocabulary — Google Doc `1c5pDyo2PpYFdhlDltrTEjNWyBtlmaILAMudeG0r1Gis` | vocabulary, governed | high | the canonical bilingual vocabulary: geographic terms, product terms, roles. To become `@schafe-vorm-fenster/glossary` (DEC-0062, Q-0057) | read |
| SRC-0015 | `src/clients/*/openapi.json` — the six pinned service specifications | machine contract | high | fetched from production 2026-09-11 and committed; refreshed by `pnpm fetch:openapi` (DEC-0058) | read |
| SRC-0013 | `specs/contracts/design-system-contract.md` — the expectation against `@schafe-vorm-fenster/brand-design` | contract | high | states what the component layer must deliver; tokens already read from the installed package v2.6.0 | registered |
| SRC-0012 | `classification-api/.github/workflows/` — reference CI/CD setup (typecheck · lint · coverage · knip · jscpd · preview · auto-merge · deploy) | external reference setup | high | running production pipeline of a sibling service; adopted as the model by DEC-0031 | read |
| SRC-0017 | `concept/website-copy-guide.md` — the website's wording specification | copy specification, governed | high | derived rule by rule from the owner's review of 2026-09-22 (`plan/reviews/2026-09-23/`), binding per DEC-0080; inherits from SRC-0001 and the hub's `brand-identity/tone-of-voice.md` | read |
| SRC-0018 | `specs/contracts/copy-contract.md` — which copy rule is enforced by which mechanism | contract | high | states what schema, lint, e2e and the editorial gate owe SRC-0017; the copy counterpart of SRC-0013 | registered |

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
