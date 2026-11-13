/**
 * `GET /api/places/resolve?ort=` — what a place parameter resolves to, for
 * the pages that read `?ort=` in the browser since DEC-0163.
 *
 * Until DEC-0163 `/`, `/dein-ort`, `/dein-ort/starten`, `/mitmachen/registrieren`
 * and `/dein-kalender/bestellen` resolved the value server-side on every
 * request, which made them per-request renders whose inline flight payload no
 * build-time CSP hash could cover (#59). The pages are static now; their
 * client islands ask this route, which runs exactly the two server-side
 * resolvers those pages ran:
 *
 *  - `outcome` — TS-WEB-0008 D7's three outcomes (`resolvePlaceOutcome`):
 *    `none` · `covered` · `uncovered`, the state switch of `/` and `/dein-ort`
 *    and the founding page's re-resolution (TS-WEB-0021-A7);
 *  - `lookup` — the register flow's step-1 answer (`resolveRegisterPlace`):
 *    `resolved` · `ambiguous` · `unresolved`, also the order flow's scope chips.
 *
 * The raw value goes through the D4 validator (`readPlaceParameter`) inside
 * both resolvers; a value it drops answers `none` / `unresolved`. It never
 * leaves this route as anything but a field of the answer — no log line, no
 * upstream call with it beyond the lookup itself. GET only (TS-WEB-0017 D4).
 */

import { resolveRegisterPlace } from "@/app/[lang]/mitmachen/registrieren/resolve-place";
import { cacheControlFor } from "@/src/lib/live/cache-profiles";
import { guard, problem } from "@/src/lib/live/bff";
import { resolvePlaceOutcome } from "@/src/lib/pages/live-anchor";
import { readPlaceParameter } from "@/src/lib/pages/place-parameter";

import type { PlaceLookup } from "@/app/[lang]/mitmachen/registrieren/resolve-place";
import type { PlaceOutcome } from "@/src/lib/pages/live-anchor";

/** The answer's shape — `src/lib/live/browser.ts` reads it back. */
export interface PlaceResolution {
  readonly outcome: PlaceOutcome;
  readonly lookup: PlaceLookup;
}

const MAX_LENGTH = 200;

export async function GET(request: Request): Promise<Response> {
  const { rejected } = guard(request, "places/resolve");
  if (rejected) return rejected;

  const raw = new URL(request.url).searchParams.get("ort");
  if (raw === null) return problem(400, "ort is required");
  if (raw.length > MAX_LENGTH) return problem(400, "ort is too long");

  const value = readPlaceParameter(raw);
  const [outcome, lookup] = await Promise.all([
    resolvePlaceOutcome(raw),
    resolveRegisterPlace(value),
  ]);

  const body: PlaceResolution = { outcome, lookup };
  return Response.json(body, {
    status: 200,
    headers: { "cache-control": cacheControlFor("activePlaces"), "content-type": "application/json" },
  });
}
