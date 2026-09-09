# Tactical Specifications

## Purpose

The layer below the requirement shells: one tactical spec per system,
rule set, or page consolidates every requirement that touches it and
resolves it into buildable, verifiable detail. **These are the
generation prompts** — the one-shot website generation reads this layer.

## Provenance tags

Every determination carries one of three tags:

- **[FIXED]** — derivable from a source or decision; binding.
- **[PROPOSED]** — set by this spec because the sources are silent;
  binding once confirmed, until then a proposal awaiting its decision
  point.
- **[FREE]** — explicitly left to the generator. An unmarked gap is a
  defect, not freedom.

## Format

`<area>.tactical.md` with frontmatter: `id` (TS-###), `profile`
(system · rule · interaction · procedure), `implements` (WEB-* IDs),
`sources`, `decisions`. Sections: Purpose · Determinations ·
Free for the generator · Acceptance criteria · Coverage · Open points.

**The unit of a tactical spec is one coherent solution — one buildable
system, one testable rule set, one page — not one requirement.**
Requirements and solutions map N:M; the `implements:` list claims
coverage, and the mandatory **Coverage** section proves it by mapping
every implemented requirement to the determinations and acceptance
criteria that discharge it. A requirement no tactical spec covers is
visible in the RTM; a requirement listed but not discharged is a defect
of the spec.

## Contents

| ID | File | Profile | Implements |
| --- | --- | --- | --- |
| TS-001 | `locale-routing.tactical.md` | system | WEB-F-060–069 |
| TS-002 | `accessibility.tactical.md` | rule | WEB-Q-010–019, 026–027 |
| TS-003 | `performance.tactical.md` | rule | WEB-Q-001–008, WEB-F-105 |
