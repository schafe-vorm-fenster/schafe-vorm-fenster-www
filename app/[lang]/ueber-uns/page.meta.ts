import type { PageMeta } from "@/src/lib/pages/page-meta";

/**
 * TS-WEB-0027 D1 — the `/ueber-uns` manifest.
 *
 * `primaryConversion: request-product-briefing` (DEC-0081 §6): the trust
 * surface has a conversion of its own, and it is the booking. Exactly one
 * `data-cta="primary"` renders it, **in the closing block only** — DEC-0082
 * amendment C makes this route the one named exception to TS-WEB-0006 D3's fold
 * clause, because a sales ask in the first viewport is addressed to a reader
 * who has not finished reading about the sender. The repeat rung is therefore
 * empty: there is nothing to repeat below a CTA that is already last.
 *
 * `liveModules: []` — the sender-surface exemption TS-WEB-0006 D1 carries since
 * DEC-0084 §3, for `/ueber-uns`, `/ueber-uns/archiv` and `/rechtliches` and no
 * other route. The operating-counter module is deleted (D4): one of its two
 * figures has no upstream field (Q-0037) and the other is not live, so the only
 * buildable module here is the static traction claim FUN-WEB-0041 forbids.
 *
 * `focusJob` is `why-us`, the id TS-WEB-0006 D1's closed four-job set carries for
 * "understand who is behind it" (`JOB_IDS`, `HEADER_JOBS[3]`); the spec names
 * the job by SRC-0001's phrase, the registry by its id, and there is only one
 * registry (DEC-0132 §7).
 */
export const pageMeta: PageMeta = {
  route: "about",
  focusJob: "why-us",
  primaryConversion: "request-product-briefing",
  // D1's priority order, SRC-0003's "1 municipalities and funders · 2
  // everyone" resolved against `@schafe-vorm-fenster/audiences` [PROPOSED].
  audiences: ["municipalities", "institutions", "counties", "actors", "rural-residents"],
  liveModules: [],
  proofSlots: ["ueber-uns-3-proof-stream"],
};
