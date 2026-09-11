import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-025 D1 — the `/dein-kalender/bestellen` manifest.
 *
 * `equalWeightConversion` is omitted: the briefing link is an exit on every
 * step (D5), not a second goal — equal weight lives on `/dein-kalender`
 * (WEB-F-014), not here.
 *
 * `liveModules` is empty — D1 fixes this explicitly ("none in V1 — the scope
 * preview is deferred, D4"), which conflicts with `checkPageMeta`'s own "no
 * live module declared" rule (`src/lib/pages/page-meta.ts`, itself TS-006
 * D1's "≥ 1 live module" floor). Recorded as a contradiction in
 * `state/open.md` rather than silently picking a side; `page.meta.test.ts`
 * asserts the violation by name so it stays visible instead of quietly
 * failing a future blanket check.
 */
export const pageMeta: PageMeta = {
  route: "order",
  focusJob: "run-our-own-calendar",
  primaryConversion: "buy-calendar-licence",
  audiences: ["municipalities", "institutions"],
  liveModules: [],
  proofSlots: [],
};
