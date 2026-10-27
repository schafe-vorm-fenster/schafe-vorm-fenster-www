import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * `/dein-ort` — the page brief of TS-WEB-0020 D1 in typed form (TS-WEB-0006 D1).
 *
 * `emptyState` is the field only this page fills: `/dein-ort` is the one
 * surface whose focus job changes at runtime (FUN-WEB-0153, FUN-WEB-0154, TS-WEB-0008 D4), and
 * TS-WEB-0006-A10 calls that "the one registered exception" — a register needs an
 * entry, and this is it.
 */
export const PLACE_META: PageMeta = {
  route: "place",
  focusJob: "know-what-is-on",
  primaryConversion: "save-calendar-to-homescreen",
  // SRC-0003: readers first, then "actors who do not yet know they are actors".
  audiences: ["rural-residents", "actors"],
  liveModules: [
    {
      id: "position-1-dates-in-the-place",
      emptyState:
        "state B: the publish offer occupies the module slot — no empty box, no error styling, no retry (TS-WEB-0020 D2)",
    },
    {
      id: "position-2-this-week-nearby",
      emptyState:
        "the module is omitted rather than shown empty; in state B it is the first evidence (TS-WEB-0020 D2)",
    },
    {
      id: "place-search",
      emptyState: "the field alone — an upstream failure is never shown as an error (TS-WEB-0008 D7)",
    },
  ],
  // Three `value-story` testimonial slots, one per story on the stage
  // (TS-WEB-0020 D3). The candidates are `usage_rights: unverified` (Q-0014)
  // and ship pre-clearance (DEC-0149); an uncleared quote is never
  // substituted. Story 4, the radius, has no slot: its example is a live
  // list, and no proof quote stands under a live list (DEC-0170, issue #84).
  proofSlots: [
    "dein-ort-3-story-baeckerwagen",
    "dein-ort-4-story-ratssitzung",
    "dein-ort-5-story-kultur",
  ],
  emptyState: {
    focusJob: "publish-our-dates",
    primaryConversion: "register-as-publisher",
  },
};
