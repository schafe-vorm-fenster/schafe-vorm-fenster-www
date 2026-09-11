import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-026 D1 — the `/deine-region` manifest.
 *
 * `equalWeightConversion` is `request-product-briefing`: TS-026 D1 names it
 * as equal weight even though TS-006 D9's own conversion map assigns equal
 * weight explicitly only to `/dein-kalender` (open point, TS-026 "Open
 * points" — "`equalWeightConversion` is the wrong word for the briefing").
 * Recorded, not resolved here: rendered as the adjacent secondary action
 * beside the primary CTA (TS-006 D3), never a second primary treatment.
 *
 * `liveModules` names the interim module (D4) at the closest `page-meta.ts`
 * vocabulary match — `position-3-active-places-in-the-county` — since the
 * closed `LiveModuleId` set is TS-008's four positions plus the search, and
 * D4's "examples · counters · search" is exactly TS-008 position 3 read at
 * county scope.
 */
export const pageMeta: PageMeta = {
  route: "region",
  focusJob: "run-our-own-calendar",
  primaryConversion: "request-licence-quote",
  equalWeightConversion: "request-product-briefing",
  audiences: ["counties", "institutions", "municipalities"],
  liveModules: [
    {
      id: "position-3-active-places-in-the-county",
      emptyState:
        "no county anchor (stage 0) or upstream empty/failing (D4/A9): the module is absent from the DOM, no error styling, no retry — the place search and block 3's static copy still render",
    },
  ],
  proofSlots: ["deine-region-6-proof"],
};
