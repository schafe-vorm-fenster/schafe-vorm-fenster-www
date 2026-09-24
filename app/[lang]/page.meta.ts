import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * `/` — the page brief of TS-WEB-0019 D1 in typed form (TS-WEB-0006 D1).
 *
 * `primaryConversion` is `save-calendar-to-homescreen` even though SRC-0003
 * gives home "no conversion of its own": the goal belongs to the **focus
 * job**, and home fulfils that job in place rather than linking to it
 * (TS-WEB-0006 D4), so it borrows `/dein-ort`'s goal. TS-WEB-0019 D1 states exactly
 * that.
 *
 * `audiences` is "all, ordered by entry context" (TS-WEB-0019 D1) — the order is
 * a runtime property of the proof stream (D4), not a second list, so the
 * sequence below is the stage-0 default: the reader first, then the people
 * who publish for her.
 */
export const HOME_META: PageMeta = {
  route: "home",
  focusJob: "know-what-is-on",
  primaryConversion: "save-calendar-to-homescreen",
  audiences: [
    "rural-residents",
    "actors",
    "municipalities",
    "institutions",
    "counties",
    "companies",
    "tech-leaders",
  ],
  liveModules: [
    {
      id: "place-search",
      emptyState: "the field alone — an upstream failure never becomes an error here (TS-WEB-0008 D7)",
    },
    {
      id: "position-1-dates-in-the-place",
      emptyState: "state S3: the nearby module under its own radius label plus the publish invitation (TS-WEB-0019 D2)",
    },
    {
      id: "position-2-this-week-nearby",
      emptyState: "the publisher invitation of `empty-state-block`; never an empty list (TS-WEB-0008 D4)",
    },
    {
      id: "position-4-live-counters",
      emptyState: "the module is absent — a missing figure is never estimated (TS-WEB-0008 D8, FUN-WEB-0041)",
    },
  ],
  // Exactly 5, never fewer by design (DEC-0048): an unfilled slot weakens the
  // claim, it does not shorten the stream (SRC-0001 §4).
  proofSlots: [
    "home-8-proof-stream-1",
    "home-8-proof-stream-2",
    "home-8-proof-stream-3",
    "home-8-proof-stream-4",
    "home-8-proof-stream-5",
  ],
};
