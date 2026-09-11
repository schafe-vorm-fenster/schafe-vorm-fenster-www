import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-029 — the `/rechtliches` manifest.
 *
 * [ASSUMPTION, documented per plan/guardrails.md — "ambiguity → documented
 * assumption + open-point entry, then keep working"]: TS-029's own open
 * point #5 says a sender surface has no focus job in the four-job sense, and
 * "this spec does not invent the value" for TS-006 D1's closed, exactly-one
 * field. Since `JobId` has no `null`/sender variant and an unsatisfiable
 * field cannot simply be left off a typed manifest, `focusJob: "why-us"` is
 * used here — TS-006 D2 itself groups the legal page with the other two
 * sender surfaces ("This holds for the sender surfaces too: `/ueber-uns`,
 * `/ueber-uns/archiv` and the one legal page `/rechtliches`"), so the merged
 * three-job closing block (TS-006 D6, same as those two) excludes the same
 * job here. Recorded in `state/open.md`, not decided by rewording TS-029's
 * own open point.
 *
 * `liveModules: []` — D7: "fully static, no live data, no client
 * dependencies". Same recorded contradiction with TS-006 D1's "≥ 1 live
 * module" floor as `archive`/`regionQuote`/`bestellen`.
 */
export const pageMeta: PageMeta = {
  route: "legal",
  focusJob: "why-us",
  primaryConversion: null,
  audiences: ["municipalities", "institutions", "rural-residents"],
  liveModules: [],
  proofSlots: [],
};
