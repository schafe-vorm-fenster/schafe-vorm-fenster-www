import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-024 D1 — the `/dein-kalender` manifest.
 *
 * `request-licence-quote` is deliberately absent — it belongs to
 * `/deine-region` (WEB-F-016); tier 3 links there, it opens no quote here.
 * `counties` is served by the tier-3 link, not by a block of its own (D1).
 */
export const pageMeta: PageMeta = {
  route: "calendar",
  focusJob: "run-our-own-calendar",
  primaryConversion: "buy-calendar-licence",
  equalWeightConversion: "request-product-briefing",
  audiences: ["municipalities", "institutions", "actors", "counties"],
  liveModules: [
    {
      id: "position-1b-embed-demo",
      emptyState:
        "loader blocked or failing: the heading, copy and CTA stay, no empty frame, no error sentence, no reflow (D5)",
    },
  ],
  // Named verbatim as TS-024 D1 gives them — three inline proof-bearing
  // slots, not the page's own `data-block` ids (D2's `contrast`/`tiers`/
  // `trust`), which is what TS-024-A1 checks against.
  proofSlots: ["tiers-480", "contrast", "trust"],
};
