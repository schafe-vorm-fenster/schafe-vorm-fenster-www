import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * `/dein-ort/starten` — the page brief of TS-021 D1 in typed form
 * (TS-006 D1).
 *
 * The focus job is **static**: this page is not the runtime focus-job change
 * of TS-008 D4 — that belongs to `/dein-ort` (TS-021 D1). It therefore
 * declares no `emptyState`.
 *
 * `proofSlots` is empty on purpose: "SRC-003 gives this page no proof block;
 * the live example is its credibility carrier" (D1).
 */
export const PLACE_START_META: PageMeta = {
  route: "placeStart",
  focusJob: "publish-our-dates",
  primaryConversion: "register-as-publisher",
  audiences: ["actors", "municipalities", "rural-residents"],
  liveModules: [
    {
      id: "place-search",
      emptyState: "the field alone — an upstream failure is never shown as an error (TS-008 D7)",
    },
    {
      id: "position-3-active-places-in-the-county",
      emptyState:
        "the module is absent from the DOM; the place search stands beside it, so the block never collapses (TS-008 D1, DEC-034)",
    },
  ],
  proofSlots: [],
};
