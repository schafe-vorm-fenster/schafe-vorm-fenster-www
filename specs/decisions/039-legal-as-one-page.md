---
id: DEC-039
title: Legal content is one long page with anchor navigation
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

All legal content lives on **one** route — `/rechtliches` (EN `/legal`) —
as a long page with on-page navigation and stable anchors:
`#impressum`, `#datenschutz`, `#barrierefreiheit`, plus further sections
as the import delivers them. This continues the pattern of the current
site.

**The footer keeps the conventional link texts** — "Impressum",
"Datenschutz", "Barrierefreiheit" — each pointing at its anchor. German
practice expects the imprint to be recognisably labelled, and that
recognisability attaches to the link text, not to the route. "Impressum"
was rejected as a route name for being formalistic; it stays as the
label.

## Consequences

- Three routes collapse into one; anchors are stable and must not change
  once published (they are linked externally).
- The accessibility statement (WEB-Q-027) is a section with a stable
  anchor rather than its own page — still footer-reachable, as BFSG
  requires.
- The Google-Docs import (WEB-F-088) delivers the sections of one page
  instead of separate documents; section order is the page's concern.
- → WEB-F-029.
