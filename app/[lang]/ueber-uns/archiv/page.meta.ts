import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-028 D1 — the `/ueber-uns/archiv` manifest.
 *
 * `primaryConversion: null` — no conversion, no form, no hero photo (D1); the
 * closing block is the merged three-job offer (TS-006 D6).
 *
 * `liveModules: []`: the page is fully static from the build-time media-echo
 * fetch — "no relevance engine, no island, no BFF call" (D2/D8). TS-006 D1's
 * "≥ 1 live module" floor does not fit a page with none by design; the same
 * recorded contradiction as `dein-kalender/bestellen` and
 * `deine-region/angebot`.
 */
export const pageMeta: PageMeta = {
  route: "archive",
  focusJob: "why-us",
  primaryConversion: null,
  audiences: ["institutions", "municipalities"],
  liveModules: [],
  proofSlots: [],
};
