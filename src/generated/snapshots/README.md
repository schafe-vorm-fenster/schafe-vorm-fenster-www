# Build-time snapshots — tier 3 (TS-009 D8)

The last line of the three-tier fallback chain: what a live module renders
when the upstream is unreachable **and** the `last-good` store has nothing.
Read by `src/lib/live/snapshots.ts`, never by a page.

- **Committed on purpose.** D8's rule "keep the previous file when the build
  fetch fails" only works if a previous file exists in the source tree.
- **Never place-specific.** Tier 3 has no segment; the place name is
  re-anchored by the reader on the place actually asked for.
- **No counters file, and there must not be one.** TS-009 D6 removes the
  counter band rather than showing an old figure, so the tier-3 path is
  unreachable by construction.
- **Today's files are demo data**, produced from the mock backend. The build
  step that regenerates them from the real upstreams (TS-009-A12) is not
  built — `state/open.md` carries the row.
