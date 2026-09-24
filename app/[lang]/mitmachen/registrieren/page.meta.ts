import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-WEB-0023 D1 — the `/mitmachen/registrieren` manifest.
 *
 * `primaryConversion` is `publish-first-event`: completed only in the app,
 * never fired by this website (D6) — the handover itself fires
 * `register-as-publisher` with `stage: handover` (D6, TS-WEB-0012 D4), which is
 * measurement, not this field. No proof slot: the argument was made on
 * `/mitmachen` (TS-WEB-0022); this page does not re-argue it (D1).
 */
export const pageMeta: PageMeta = {
  route: "register",
  focusJob: "publish-our-dates",
  primaryConversion: "publish-first-event",
  audiences: ["actors"],
  liveModules: [
    {
      id: "place-search",
      emptyState:
        "the search field alone, no suggestion row — an upstream error is never shown as an error here (TS-WEB-0008 D7); an unresolved value leaves step 1 unanswered rather than failing (D5)",
    },
  ],
  proofSlots: [],
};
