import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-WEB-0023 D1 — the `/mitmachen/registrieren` manifest, as amended by
 * DEC-0176.
 *
 * `primaryConversion` is `publish-first-event`: completed only in the app,
 * never fired by this website (D6). The route embeds the Google Form for the
 * launch (DEC-0176, D10) and fires `register-as-publisher` at `stage:
 * handover` when the visitor moves on inside it or opens it in a new tab —
 * measurement, not this field. No live module: the place search of the flow's
 * step 1 is not rendered while the embed stands (D10). No proof slot: the
 * argument was made on `/mitmachen` (TS-WEB-0022); this page does not re-argue
 * it (D1).
 */
export const pageMeta: PageMeta = {
  route: "register",
  focusJob: "publish-our-dates",
  primaryConversion: "publish-first-event",
  audiences: ["actors"],
  liveModules: [],
  proofSlots: [],
};
