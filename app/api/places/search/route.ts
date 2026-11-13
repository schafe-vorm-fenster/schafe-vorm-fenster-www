/**
 * `GET /api/places/search?q=` — the place search's only upstream (TS-WEB-0004 D5,
 * TS-WEB-0008 D7).
 *
 * `q` is a **place name** and nothing else (DEC-0079): five digits are matched
 * like any other string and match nothing. `zip` — the second parameter
 * TS-WEB-0004 D5 names — is **not** a second mode of the place search: it is
 * the order flow's scope step (TS-WEB-0025 D3, DEC-0079 §7) asking which
 * covered places a postcode holds, and it answers only when `q` is absent.
 *
 * GET only, per TS-WEB-0017 D4's "read-only by construction"; the browser reaches
 * geo-api through here and nowhere else, so no ecosystem host, token or
 * visitor IP is ever part of a client request (TS-WEB-0013 D2/D3).
 */

import { envelopeResponse, guard, problem } from "@/src/lib/live/bff";
import { searchPlaces, searchPlacesByZip } from "@/src/lib/live/places";

const MAX_QUERY_LENGTH = 120;

export async function GET(request: Request): Promise<Response> {
  const { rejected } = guard(request, "places/search");
  if (rejected) return rejected;

  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim();
  const zip = (params.get("zip") ?? "").trim();
  if (query.length === 0 && zip.length === 0) return problem(400, "q is required");
  if (query.length > MAX_QUERY_LENGTH || zip.length > MAX_QUERY_LENGTH) return problem(400, "q is too long");

  const envelope = query.length > 0 ? await searchPlaces({ query }) : await searchPlacesByZip({ query: zip });
  return envelopeResponse(envelope, "activePlaces");
}
