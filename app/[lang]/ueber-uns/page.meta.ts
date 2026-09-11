import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-027 D1 — the `/ueber-uns` manifest.
 *
 * `primaryConversion: null` — the page carries no CTA treatment at all
 * (TS-006 D3); the closing block is the merged three-job offer (TS-006 D6).
 * `liveModules` names the operating counters (D4: years in operation + live
 * active places) at the closest `LiveModuleId` — `position-4-live-counters`,
 * TS-008's own live-counters position.
 */
export const pageMeta: PageMeta = {
  route: "about",
  focusJob: "why-us",
  primaryConversion: null,
  audiences: ["municipalities", "institutions", "counties"],
  liveModules: [
    {
      id: "position-4-live-counters",
      emptyState:
        "the sentence renders without the figure — no zero, no \"ca.\", no last-known value (D4); a missing field hides the whole module, never a substitute",
    },
  ],
  proofSlots: ["ueber-uns-3-proof-stream"],
};
