import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-WEB-0022 D1 — the `/mitmachen` manifest, in the shape
 * `src/lib/pages/page-meta.ts` fixes (TS-WEB-0006 D1, wired into `_page-frame.tsx`
 * by the chrome work package).
 *
 * No price, no "Portalize", no `local-advertising` on this route (D1, D11;
 * DEC-0052 §1/§3). `equalWeightConversion` is absent — SRC-0003 gives this
 * focus job a single conversion.
 */
export const pageMeta: PageMeta = {
  route: "takePart",
  focusJob: "publish-our-dates",
  primaryConversion: "register-as-publisher",
  audiences: ["actors", "municipalities"],
  liveModules: [
    {
      // Path 1's third stage state reads TS-WEB-0008 position 1 for the
      // stage-0 anchor (TS-WEB-0022 D1 as amended by DEC-0196: the page's own
      // live example is gone, this panel is the one live module left). No row
      // of its own exists in TS-WEB-0008 D1's table (TS-WEB-0022 Open points).
      id: "position-1-dates-in-the-place",
      emptyState:
        "never empty — fewer than three rows, a failing upstream or a mocked envelope shows the slot's marked sample rows instead (DEC-0115); the /dein-ort focus-job switch never fires on this route",
    },
  ],
  proofSlots: ["mitmachen-2-objections", "mitmachen-7-proof", "mitmachen-8-closing"],
};
