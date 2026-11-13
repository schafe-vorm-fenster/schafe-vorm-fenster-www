/**
 * `GET /api/places/nearest?lat=&lng=` — the covered community a coordinate
 * sits in or next to (DEC-0119; TS-WEB-0008 D7's coordinates row, TS-WEB-0010 D5).
 *
 * The one caller is the "use my location" control beside the place search,
 * and it calls only after the visitor activated it: the browser's
 * coordinates arrive here because the BFF is the browser's only data surface
 * (TS-WEB-0008 D10) — a client may not reach geo-api itself. What D5 forbids
 * is therefore kept on this side of the line: the coordinates are **read,
 * resolved and dropped** — not logged, not cached, not part of a cache key
 * (`nearestCoveredPlace` runs without `resilient()` for exactly that
 * reason), and the answer is `no-store` so no CDN keeps a URL that carries
 * them. What leaves is a place, and the browser navigates to `?ort=<slug>`.
 *
 * 404 when nothing resolves — the control then does nothing, which is D5's
 * "leaves the page exactly as it was". GET only (TS-WEB-0017 D4).
 */

import { readPoint } from "./point";

import { guard, problem } from "@/src/lib/live/bff";
import { nearestCoveredPlace } from "@/src/lib/live/places";

export async function GET(request: Request): Promise<Response> {
  const { rejected } = guard(request, "places/nearest");
  if (rejected) return rejected;

  const params = new URL(request.url).searchParams;
  const point = readPoint(params.get("lat"), params.get("lng"));
  if (point === undefined) return problem(400, "lat and lng are required");

  const envelope = await nearestCoveredPlace(point);
  if (envelope === undefined) return problem(404, "no covered place nearby");

  return Response.json(
    {
      data: envelope.data,
      tier: envelope.tier,
      fetchedAt: envelope.fetchedAt,
      stale: envelope.stale,
      demo: envelope.demo,
    },
    {
      status: 200,
      // Never `public, s-maxage`: the URL carries a visitor's coordinates and
      // a shared cache would store it (TS-WEB-0010 D5).
      headers: { "cache-control": "no-store", "content-type": "application/json" },
    },
  );
}
