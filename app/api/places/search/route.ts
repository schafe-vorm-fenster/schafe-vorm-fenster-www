/**
 * `GET /api/places/search?q=` — the place search's only upstream (TS-WEB-0004 D5,
 * TS-WEB-0008 D7).
 *
 * GET only, per TS-WEB-0017 D4's "read-only by construction"; the browser reaches
 * geo-api through here and nowhere else, so no ecosystem host, token or
 * visitor IP is ever part of a client request (TS-WEB-0013 D2/D3).
 */

import { envelopeResponse, guard, problem } from "@/src/lib/live/bff";
import { searchPlaces } from "@/src/lib/live/places";

export async function GET(request: Request): Promise<Response> {
  const { rejected } = guard(request, "places/search");
  if (rejected) return rejected;

  const params = new URL(request.url).searchParams;
  // `zip` is the parameter TS-WEB-0004 D5 names beside `q`; both feed one search.
  const query = (params.get("q") ?? params.get("zip") ?? "").trim();
  if (query.length === 0 || query.length > 120) return problem(400, "q is required");

  const envelope = await searchPlaces({ query });
  return envelopeResponse(envelope, "activePlaces");
}
