import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-022 D1 — the `/mitmachen` manifest, in the shape
 * `src/lib/pages/page-meta.ts` fixes (TS-006 D1, wired into `_page-frame.tsx`
 * by the chrome work package).
 *
 * No price, no "Portalize", no `local-advertising` on this route (D1, D11;
 * DEC-052 §1/§3). `equalWeightConversion` is absent — SRC-003 gives this
 * focus job a single conversion.
 */
export const pageMeta: PageMeta = {
  route: "takePart",
  focusJob: "publish-our-dates",
  primaryConversion: "register-as-publisher",
  audiences: ["actors", "municipalities"],
  liveModules: [
    {
      // TS-022 D5 ties the live example to TS-008 position 1 — no row of its
      // own exists in TS-008 D1's table (open point, TS-022 Open points).
      id: "position-1-dates-in-the-place",
      emptyState:
        "never empty — a zero-date candidate is skipped and the next active covered place is taken instead (D5); the /dein-ort focus-job switch never fires on this route",
    },
  ],
  proofSlots: ["mitmachen-2-objections", "mitmachen-7-proof", "mitmachen-8-closing"],
};
