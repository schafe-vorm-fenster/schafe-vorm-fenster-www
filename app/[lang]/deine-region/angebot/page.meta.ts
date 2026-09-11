import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-026 D1 — the `/deine-region/angebot` manifest.
 *
 * Same focus job and primary conversion as `/deine-region` (D1's table: the
 * quote request is the CTA on the parent route and the form here, one goal
 * throughout). No `equalWeightConversion` — the briefing link is the parent
 * page's secondary action; this route carries only the form (D1, D2).
 *
 * `liveModules: []`: this route carries the quote form only, no live-data
 * module (composition sheet §4: `breadcrumb-trail` → `hero-block` →
 * `envoy-form-mount` → `response-promise` → `lead-fallback` → `context-band`
 * → `closing-cta`). TS-006 D1's own "≥ 1 live module" floor does not fit a
 * pure form route — the same reading `dein-kalender/bestellen/page.meta.ts`
 * already recorded for its own form-flow route; not resolved here, tracked
 * once in `state/open.md`.
 */
export const pageMeta: PageMeta = {
  route: "regionQuote",
  focusJob: "run-our-own-calendar",
  primaryConversion: "request-licence-quote",
  audiences: ["counties", "institutions", "municipalities"],
  liveModules: [],
  proofSlots: [],
};
