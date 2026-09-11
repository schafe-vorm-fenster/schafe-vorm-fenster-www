/**
 * DEC-070's re-resolution hop, as a **routing** decision — TS-021-A7,
 * TS-020 D2 row 5, TS-008 D7 row 3 (F-2-49).
 *
 * Two pages answer for the same `?ort=` value and each of them owes the
 * visitor one hop when the value belongs to the other:
 *
 * | From | When | To |
 * | --- | --- | --- |
 * | `/dein-ort` | geo-api has no community for the value (`uncovered`) | `/dein-ort/starten?ort=<query>` |
 * | `/dein-ort/starten` | the value resolves to a community (`covered`) | `/dein-ort?ort=<slug>` + the `etcc_*` set |
 *
 * ### Why this is not `redirect()` in the page any more
 *
 * It was, and against `next dev` it worked. Against a **production build** it
 * does not, and cannot: with Cache Components every route resumes from a
 * postponed prerender, and `redirect()` thrown during the resume is past the
 * point where the status line can still be changed. Next serialises it into
 * the flight payload — `NEXT_REDIRECT;replace;/dein-ort?ort=…;307` — so the
 * response is **200 with an empty document** and only a browser executing
 * JavaScript ever arrives (measured, F-2-49 retest: `next start` and the
 * round-3 preview, `x-nextjs-postponed: 1`). Next's own answer is explicit
 * (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md`):
 * *"If you'd like to redirect before the render process, use `next.config.js`
 * or Proxy."* `next.config.ts` cannot: the decision needs a geo lookup. So
 * the proxy asks this module, and the answer is a real 307 with a `Location`
 * header, before any body.
 *
 * The page keeps its own `redirect()` as the second line of defence — if a
 * deployment ever reaches a page without the proxy in front of it, the hop
 * still happens, one render later. The two can never both fire on one
 * request: after the proxy's hop the visitor is on the *other* route, whose
 * rule the same outcome does not satisfy.
 */

import { href, normalisePath } from "./routes";
import { extractCampaignParams } from "../analytics/attribution";
import { LOCALES } from "../i18n/locales";
import { resolvePlaceOutcome } from "../pages/live-anchor";

import type { Locale } from "../i18n/locales";
import type { RouteId } from "./routes";

/** The two routes that key on `?ort=` and hand each other the value. */
const HOP_ROUTES = ["place", "placeStart"] as const satisfies readonly RouteId[];

type HopRoute = (typeof HOP_ROUTES)[number];

export interface PlaceHopRoute {
  readonly route: HopRoute;
  readonly locale: Locale;
}

/**
 * Is this public path one of the two `?ort=` routes — and in which language?
 *
 * Derived from the route registry, in every language, so no path is typed
 * here (TS-001 D5). The proxy runs *before* `next.config.ts`'s rewrites
 * (`proxy.md`, "Execution order"), so the path it hands in is the public one
 * — `/dein-ort`, `/en/your-place` — never the internal `/de/…` form.
 */
export function placeHopRoute(pathname: string): PlaceHopRoute | undefined {
  const path = normalisePath(pathname);
  for (const locale of LOCALES) {
    for (const route of HOP_ROUTES) {
      if (normalisePath(href(route, locale)) === path) return { route, locale };
    }
  }
  return undefined;
}

/**
 * The one hop this request owes, or `undefined` for the overwhelming
 * majority that owe none.
 *
 * Mirrors the two page rules exactly, including what each carries:
 * `/dein-ort/starten` → `/dein-ort` keeps the campaign parameters (TS-023 D4
 * applies to the whole founding path), while `/dein-ort` → `/dein-ort/starten`
 * carries the query verbatim and nothing else, because TS-021 D4 re-validates
 * it on arrival.
 *
 * A value the grammar drops, a value geo-api cannot be asked about, and an
 * upstream that does not answer all take the same road: no hop, the page
 * renders its placeless variant at 200 (TS-020-A9, TS-021-A3/A5).
 */
export async function placeHop(
  pathname: string,
  search: URLSearchParams,
): Promise<string | undefined> {
  const hop = placeHopRoute(pathname);
  if (!hop) return undefined;

  const raw = search.getAll("ort");
  if (raw.length === 0) return undefined;

  const outcome = await resolvePlaceOutcome(raw.length === 1 ? raw[0] : raw);

  if (hop.route === "placeStart" && outcome.kind === "covered") {
    const campaign = extractCampaignParams(search);
    return withQuery(href("place", hop.locale), {
      ort: outcome.place.slug,
      ...campaign,
    });
  }

  if (hop.route === "place" && outcome.kind === "uncovered") {
    return withQuery(href("placeStart", hop.locale), { ort: outcome.query });
  }

  return undefined;
}

/** The same query assembly `linkHref` does, without the component import. */
function withQuery(
  path: string,
  query: Readonly<Record<string, string | undefined>>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") search.set(key, value);
  }
  const queryString = search.toString();
  return queryString ? `${path}?${queryString}` : path;
}
