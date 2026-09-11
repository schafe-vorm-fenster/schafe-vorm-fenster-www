---
id: rechtliches-de
page_id: TS-029
route: "/legal"
content_type: section
status: draft
locale: en
sources:
  - "ia"
derived_from:
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced — page-level composition/navigation copy only; the six sections themselves are content/legal/*.md, imported (5, DE only today) or generated-pending-counsel (1, accessibility, DE only today); EN translation of content/pages/rechtliches/de.md frame copy — the five imported legal documents themselves are NOT translated here, see slot 5"
compliance_check: "state/content-map.md#compliance-checks — TS-029"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #21 — accessibility statement is generated, provenance: generated, flagged for legal-counsel review before production"
  - "TS-029 open point #2 / state/open.md #53 — English siblings of the five imported documents do not exist yet; this playbook never machine-translates legal text, and the EN page frame below says so explicitly instead of silently showing German text under an English URL"
---

# Legal (`/legal`)

This file supplies **only** the page-frame copy (h1, navigation label,
footer link text). The six sections themselves come from
`content/legal/*.md` via import (TS-007 D10) — this playbook does not
rewrite legal text, it references it (repository working rule / the
Content & Translation role's "Must not: touch code outside content
files … never rewrite legal text"). Today, every one of those six
imported/generated documents exists in German only (see slot 5) —
this frame, unlike the documents it points to, is a genuine English
translation.

## Page header

<!-- id: rechtliches-1-header; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**h1:** Legal

**Navigation label (`<nav>`, named for accessibility):** Sections

## Section registry (order = TS-004 D8)

<!-- id: rechtliches-2-registry; content_type: legal-section; provenance: sourced; derived_from: [ia]; status: draft -->

| Anchor | Section name | Source |
| --- | --- | --- |
| `#imprint` | Imprint | `content/legal/imprint.md` (imported, German text) |
| `#privacy` | Privacy policy | `content/legal/privacy-policy.md` (imported, German text) |
| `#terms` | Terms of use | `content/legal/terms-of-use.md` (imported, German text) |
| `#community-guidelines` | Community guidelines | `content/legal/community-guidelines.md` (imported, German text) |
| `#data-processing` | Data processing agreement (DPA) | `content/legal/dpa.md` (imported, public, no access gate, German text) |
| `#accessibility` | Accessibility | `content/legal/accessibility.md` (generated, see below, German text) |

## Footer link text

<!-- id: rechtliches-3-footer-labels; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

- Imprint → `#imprint`
- Privacy → `#privacy`
- Accessibility → `#accessibility`

## Accessibility statement — origin

<!-- id: rechtliches-4-accessibility-note; content_type: section; provenance: generated; derived_from: []; status: draft -->

No Google Doc and no source exists for `#accessibility` yet (TS-029
D8, TS-004 D8: "to be written"). This page cannot go to production
without this section (release blocker). The text lives separately
under `content/legal/accessibility.md`, generated per the
dummy-content rule: conservatively worded, with no invented
inspection date, no claimed conformance level — and explicitly marked
for legal-counsel review before it goes live (`state/open.md` #21).
The document itself is German only today, like the other five; it is
not translated here.

## English siblings of the legal documents

<!-- id: rechtliches-5-en-gap; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**The legal texts on this page are provided in German only.** All six
sections above — the five imported documents and the accessibility
statement — exist in German today; `import.yaml` only ever declares
`locale: de` targets (TS-029 open point #2), and this playbook never
machine-translates or invents legal text. English siblings will be
imported once English source documents (Google Docs) exist and are
added to `import.yaml` — DEC-027 records that DE and EN versions of
the legal texts both arrive through that same import path, on its own
schedule, not through this page-copy run. This gap is registered as
its own row in `state/open.md` (#53) rather than papered over with a
translation this playbook is not permitted to produce.
