/**
 * The manifest set — every route's `page.meta.ts`, in one place, so the
 * cross-page rules of TS-WEB-0006 D1 and D9 can be checked as a *set* rather than
 * one file at a time.
 *
 * `page-meta.ts` is the shape and the vocabulary; each route's own
 * `page.meta.ts` is the value; this module is the **register**. It exists
 * because two of TS-WEB-0006's acceptance criteria are statements about all
 * twelve manifests together, and neither can be expressed inside a single
 * route's test:
 *
 *   - **A1** "Every route has a `page.meta.ts` with all D1 fields" — the
 *     *every* is the part a per-route test cannot see. `MANIFESTS` is keyed
 *     by `RouteId`, so a new route without a manifest is a type error before
 *     it is a test failure.
 *   - **A11** "Manifest set validates both ways against the SRC-0003
 *     conversion map" — both directions need the whole set.
 *
 * There is deliberately **no second statement of a manifest's values here**:
 * this module re-exports what the twelve files already declare. A route's
 * brief has exactly one home, and it is next to its `page.tsx` (TS-WEB-0006 D1).
 */

import { pageMeta as ORDER_META } from "@/app/[lang]/dein-kalender/bestellen/page.meta";
import { pageMeta as CALENDAR_META } from "@/app/[lang]/dein-kalender/page.meta";
import { PLACE_META } from "@/app/[lang]/dein-ort/page.meta";
import { PLACE_START_META } from "@/app/[lang]/dein-ort/starten/page.meta";
import { pageMeta as REGION_QUOTE_META } from "@/app/[lang]/deine-region/angebot/page.meta";
import { pageMeta as REGION_META } from "@/app/[lang]/deine-region/page.meta";
import { pageMeta as TAKE_PART_META } from "@/app/[lang]/mitmachen/page.meta";
import { pageMeta as REGISTER_META } from "@/app/[lang]/mitmachen/registrieren/page.meta";
import { HOME_META } from "@/app/[lang]/page.meta";
import { pageMeta as LEGAL_META } from "@/app/[lang]/rechtliches/page.meta";
import { pageMeta as ARCHIVE_META } from "@/app/[lang]/ueber-uns/archiv/page.meta";
import { pageMeta as ABOUT_META } from "@/app/[lang]/ueber-uns/page.meta";

import type { ConversionGoalId, PageMeta } from "@/src/lib/pages/page-meta";
import type { RouteId } from "@/src/lib/routes/routes";

/** Route id → its manifest. Complete by type, not by review. */
export const MANIFESTS: Readonly<Record<RouteId, PageMeta>> = Object.freeze({
  home: HOME_META,
  place: PLACE_META,
  placeStart: PLACE_START_META,
  takePart: TAKE_PART_META,
  register: REGISTER_META,
  calendar: CALENDAR_META,
  order: ORDER_META,
  region: REGION_META,
  regionQuote: REGION_QUOTE_META,
  about: ABOUT_META,
  archive: ARCHIVE_META,
  legal: LEGAL_META,
});

/**
 * The conversion map of SRC-0003 (`go-to-market-os/concept/
 * website-information-architecture.concept.md` § "Conversion Map"), as data.
 *
 * Read exactly as the source writes it — goal → the pages that carry it.
 * Entries the source qualifies in prose are carried in `CARRIED_ELSEWHERE`
 * below rather than silently dropped.
 */
export const CONVERSION_MAP: Readonly<
  Partial<Record<ConversionGoalId, readonly RouteId[]>>
> = Object.freeze({
  "save-calendar-to-homescreen": ["place", "home"],
  // `/dein-ort` carries it as its *empty state* (`emptyState.primaryConversion`),
  // not as its default primary — which is what the map's "(empty state)" says.
  "register-as-publisher": ["takePart", "register", "placeStart", "place"],
  "publish-first-event": ["register"],
  "buy-calendar-licence": ["calendar", "order"],
  "request-licence-quote": ["region"],
  // `/ueber-uns` joins the three the concept's map names: DEC-0081 §6 gave the
  // trust surface a conversion of its own, and it is the briefing. The map in
  // SRC-0003 predates that decision, so this entry is the decision's, recorded
  // here rather than as a `MAP_DEVIATIONS` row — a deviation row says "the
  // manifest and the map disagree", and they do not: the map is simply older.
  "request-product-briefing": ["calendar", "region", "order", "about"],
});

/**
 * Goals the map assigns to no page at all, each with the question that would
 * change that. D9: "The check lists it as an accepted exception with its
 * question ID, so it stays visible instead of quietly passing."
 */
export const UNCARRIED_GOALS: Readonly<Partial<Record<ConversionGoalId, string>>> =
  Object.freeze({
    "order-promotion-material": "Q-0005 — no page yet; candidate /mitmachen/vor-ort-werben",
  });

/**
 * Where a goal is carried by the *chrome* rather than by a manifest field.
 * `register-as-publisher` "additionally appears via the context band on
 * every page — carried by D5, not by a per-page declaration" (D9), which is
 * `app/[lang]/_page-frame.tsx` → `context-band`, and is why the check does
 * not expect it as a `primaryConversion` on the other nine routes.
 */
export const CARRIED_BY_CHROME: readonly ConversionGoalId[] = Object.freeze([
  "register-as-publisher",
  // The two standing asks. `make-contact` is the contact section above the
  // footer (DEC-0081), `subscribe-to-newsletter` the newsletter block; both
  // stand on every page beneath whatever that page's own conversion is, and
  // the hub says the same from its side — `channel-matrix.md`, "Two Standing
  // Asks That Are Not Rows": a matrix row asserts a *primary* goal for one
  // audience on one surface, and these two are primary for none.
  "make-contact",
  "subscribe-to-newsletter",
]);

/**
 * The deviations between the twelve manifests and the map, each recorded
 * with the spec that decided it. A deviation in this table is *reported*,
 * never silently accepted — the test prints the list, so a new one has to be
 * added here on purpose.
 *
 * Shape: `route → goal → why`. The three entries are all cases where a
 * per-page tactical spec (TS-WEB-0023/TS-WEB-0025/TS-WEB-0026) made a determination the
 * concept's one-line map does not carry.
 */
export const MAP_DEVIATIONS: Readonly<
  Record<string, { readonly goal: ConversionGoalId; readonly why: string }>
> = Object.freeze({
  "register:register-as-publisher": {
    goal: "register-as-publisher",
    why: "TS-WEB-0023 D6 — the route's `primaryConversion` is `publish-first-event`; `register-as-publisher` fires here as the handover *event* (TS-WEB-0012 D4), which is measurement, not a manifest field",
  },
  "order:request-product-briefing": {
    goal: "request-product-briefing",
    why: "TS-WEB-0025 D5 — the briefing link is an exit on every step of the order flow, not a second goal; equal weight lives on `/dein-kalender` (FUN-WEB-0014)",
  },
  "regionQuote:request-licence-quote": {
    goal: "request-licence-quote",
    why: "TS-WEB-0026 D1 — the quote request is the CTA on `/deine-region` and the *form* on `/deine-region/angebot`: one goal across the parent route and its flow child",
  },
  "region:request-product-briefing": {
    goal: "request-product-briefing",
    why: "TS-WEB-0026 D1 declares it as `equalWeightConversion`; the map names it for `/deine-region` too, so this is an agreement, kept here because TS-WEB-0026's own open point questions the word",
  },
});

/**
 * The five routes whose manifest declares no live module, each with the
 * determination that put it there. TS-WEB-0006 D1 sets a "≥ 1 live module" floor
 * and names its own exemption for three **sender surfaces**; four per-page
 * specs contradict the floor for their own route (state/open.md row 117). Both
 * kinds are carried here as named, reasoned exceptions rather than resolved by
 * weakening `checkPageMeta`.
 *
 * Two of the entries are of the second kind and **TS-WEB-0006-A1 does not admit
 * them**: A1 permits the empty set "on exactly the three sender surfaces D1
 * names (`/ueber-uns`, `/ueber-uns/archiv`, `/rechtliches`), and on no other
 * route", while TS-WEB-0025 D1 (`order`) and TS-WEB-0026 D1/D2 (`regionQuote`)
 * determine the empty set for their own routes. The conflict is recorded, not
 * resolved: resolving it means amending A1 or amending two page specs, which is
 * the spec owner's call (DEC-0132 §6, state/open.md).
 */
export const NO_LIVE_MODULE: Readonly<Partial<Record<RouteId, string>>> = Object.freeze({
  // The three sender surfaces of TS-WEB-0006 D1 / DEC-0084 §3.
  about:
    "TS-WEB-0027 D4 / DEC-0084 §3 — the counter module is deleted: the places figure has no upstream field (Q-0037) and the years figure is not live, so the only buildable module here is the static traction claim FUN-WEB-0041 forbids",
  order: "TS-WEB-0025 D1 — none in V1, the scope preview is deferred (D4)",
  regionQuote: "TS-WEB-0026 D1/D2 — the quote form only, no live-data module",
  archive: "TS-WEB-0028 D2/D8 — fully static from the build-time media-echo fetch",
  legal: "TS-WEB-0029 D7 — fully static, no live data, no client dependencies",
});

/** Every goal a manifest declares, primary or equal weight, empty state included. */
export function declaredGoals(meta: PageMeta): ConversionGoalId[] {
  const goals: ConversionGoalId[] = [];
  if (meta.primaryConversion !== null) goals.push(meta.primaryConversion);
  if (meta.equalWeightConversion !== undefined) goals.push(meta.equalWeightConversion);
  if (meta.emptyState !== undefined) goals.push(meta.emptyState.primaryConversion);
  return goals;
}
