---
artefact: source-inventory
status: DRAFT
date: 2026-09-09
---

# Source Inventory — Website Relaunch

| ID | Source | Type | Trust | Rationale | Status |
| --- | --- | --- | --- | --- | --- |
| SRC-001 | `go-to-market-os/concept/website-communication-principles.concept.md` | concept, governed | high | workshop result, frontmatter-governed, status draft but decision-backed | read |
| SRC-002 | `go-to-market-os/concept/website-relevance-model.concept.md` | concept, governed | high | operationalizes SRC-001 §3–5; weights explicitly marked "set, not measured" | read |
| SRC-003 | `go-to-market-os/concept/website-information-architecture.concept.md` | concept, governed | high | applies SRC-001/002 to pages; reference for prototype v1.0 | read |
| SRC-004 | `schafe-vorm-fenster-www/concept/v1.0/Wireframes Mobile.dc.html` | prototype | medium | illustrative, derived from SRC-001..003; diverges in places (see Q-002) | read |
| SRC-005 | `schafe-vorm-fenster-www/concept/v1.0/README.md` | prototype notes | medium | lists blockers and content provenance; partly overtaken by events | read |
| SRC-006 | `schafe-vorm-fenster-www/concept/_archive/Schafe Webseite Anforderungen.txt` | voice transcript, raw | medium | rich single-author brain dump; uncertain values confirmed or opened via DEC-001..008 / Q-register | read, mined |
| SRC-007 | `community-calendar/docs/localization-architecture.md`, `domains.md`, `performance-budget.md` | external product docs | high | proven product mechanism; adopted for the website by DEC-005..007; canonical copy stays in `community-calendar` | read |
| SRC-008 | `go-to-market-os` — `audiences/`, `strategy/` (business-goals, conversion-goals, positioning, value-propositions), `offerings/`, `brands/profiles/schafe-vorm-fenster/`, `proof/`, `media-echo/verified/` | reference universe | high | single source of truth per ADR-001; referenced by ID, never copied | referenced |
| SRC-009 | `go-to-market-os/handbook/decisions/001–004` | ADRs | high | repository-level decisions binding this spec (content SSOT, layer model, audience model) | read |
| SRC-010 | `schafe-vorm-fenster-www/legacy-content/` | archive | low | pre-relaunch site; consulted only for lookups (legacy URL inventory, eTracker config) | lookup only |
| SRC-011 | `specs/contracts/api-contracts.md` — OpenAPI specs of the ecosystem services (`<host>/api/openapi`) | machine contract | high | services publish OpenAPI 3.0+; product consumes them via documented convention (DEC-021) | registered |
| SRC-014 | `concept/website-design-system.md` + boards in `concept/v2.0/` | design specification, governed | high | workshop result 2026-09-10; closes the design-system contract (SRC-013), binding per DEC-056 | read |
| SRC-013 | `specs/contracts/design-system-contract.md` — the expectation against `@schafe-vorm-fenster/brand-design` | contract | high | states what the component layer must deliver; tokens already read from the installed package v2.6.0 | registered |
| SRC-012 | `classification-api/.github/workflows/` — reference CI/CD setup (typecheck · lint · coverage · knip · jscpd · preview · auto-merge · deploy) | external reference setup | high | running production pipeline of a sibling service; adopted as the model by DEC-031 | read |

## Notes

- SRC-006 is a transcription with recognition errors ("Scharfe vom
  Fenster", "host weiter noch Wurzel" = Vercel). Values were extracted
  conservatively; anything uncertain became a `Q-###` entry rather than a
  requirement value.
- SRC-007: the three files are adopted **by content**, not by copy. The
  stale copies formerly under `schafe-vorm-fenster-www/docs/` were deleted
  (DEC-008); the canonical mechanism documentation lives in the
  `community-calendar` repository.
- SRC-008 becomes a set of npm packages shortly; references by ID and path
  are then hardened into `devDependencies` (see WEB-F-080 ff.).
