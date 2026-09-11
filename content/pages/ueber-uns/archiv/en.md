---
id: ueber-uns-archiv-de
page_id: TS-028
route: "/ueber-uns/archiv"
seo:
  "/ueber-uns/archiv":
    title: "Archive: coverage and evidence"
    description: "What has been written about the calendar, in chronological order and open to scrutiny — every row links to the original at the outlet."
    provenance: generated
content_type: section
status: draft
locale: en
sources:
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "ia"
derived_from:
  - "@schafe-vorm-fenster/media-echo@0.3.3"
  - "ia"
generated_by: "playbook-content-production@1.0.0"
generated_at: "2026-09-11"
tone_profile: "du-everywhere"
provenance: "sourced-empty-by-design at scale for the real list — 0/32 media-echo entries carry usage_rights today (Q-045); under the prototype completeness override, slot 2 additionally carries 6 generated, clearly-labelled demo rows (provenance: generated, demo: true) so the page is not empty in the prototype — state/open.md Dummy-Content; EN translation of content/pages/ueber-uns/archiv/de.md, same source ids per slot"
compliance_check: "state/content-map.md#compliance-checks — TS-028"
schema_note: "see content/pages/home/de.md — same TS-007/schema gap, state/open.md #37"
open_points:
  - "state/open.md #1 — Q-045, 0/32 media-echo entries cleared; this page renders zero rows until that changes"
---

# Archive (`/ueber-uns/archiv`)

No conversion of its own, no entry point via the main navigation
(TS-028 D1). Chronological, newest first — the only exception to
relevance sorting on this website, because this page serves scrutiny,
not reach (TS-028 D2).

## Slot 1 — Page heading

<!-- id: archiv-1-heading; content_type: section; provenance: sourced; derived_from: [ia]; status: draft -->

**h1:** Archive

Deliberately with no intro text selling the collection (TS-028 D1) —
the list is the page.

## Slot 2 — Archive rows

<!-- id: archiv-2-rows; content_type: archive-entry; provenance: sourced-empty-by-design; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

One row per cleared media-echo entry, generated from `title`, `type`,
`date`, `source`, `geo`. **As of today (2026-09-11): 0 of the 32
entries carry `usage_rights`**, so no row appears — a missing field is
not a clearance (TS-007 D2). No invented or paraphrased substitute
entry fills the real list; that would directly contradict SRC-001
rule 4. Once clearances exist, the list fills in with no text change
to this file.

<!-- id: archiv-2-rows-demo; content_type: archive-entry; provenance: generated; derived_from: []; status: draft; demo: true -->

**Demo rows (prototype, `Demo Data` badge):** For the full prototype
impression, this view shows six example archive rows instead of the
empty list — every row clearly marked as a demo, none of them a real
press or award mention:

| Title | Type | Date | Source | Place |
| --- | --- | --- | --- | --- |
| "Digital village calendars reach Vorpommern" (example) | Press | 2026-03-12 | Example newspaper | Example municipality Musterdorf |
| "Award for digital participation in rural areas" (example) | Award | 2025-11-04 | Example award for rural digitalisation | Example county Musterkreis |
| "Talk on community calendar projects" (example) | Conference | 2025-09-20 | Example conference Digital Village | Example town Musterheim |
| "Conversation about the village calendar on a regional podcast" (example) | Podcast | 2025-06-15 | Example podcast Rural Life Digital | Example region Musterland |
| "Portrait: how a village project became software" (example) | Portrait | 2025-02-08 | Example magazine Rural Living | Example municipality Musterdorf |
| "Mention in an overview of digital administration projects" (example) | Recognition | 2024-10-30 | Example association Municipal Digitalisation | Example county Mustermark |

Titles, dates, sources, and places are entirely invented and
consistently marked "(example)"; they appear only in the prototype and
disappear completely once real, cleared media-echo entries exist.

## Slot 3 — Context line per entry

<!-- id: archiv-3-context-line; content_type: archive-entry; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

Mechanical translation of the metadata for each cleared entry at build
time (TS-007 D3) — no editorial running text per entry, no room for
invention.

## Slot 4 — Type filter (chips)

<!-- id: archiv-4-type-filter; content_type: section; provenance: sourced; derived_from: ["@schafe-vorm-fenster/media-echo@0.3.3"]; status: draft -->

**Labels (from the hub vocabulary, localized):**

- Press
- Award
- Conference
- Podcast
- Portrait
- Recognition
- Social media
- All

Only types with at least one cleared entry get a chip (TS-028 D4) —
as long as no entry is cleared, no chip appears.
