/**
 * `GET /api/nearby?lat=&lng=&radius=` — position 2, TS-008 D3 step 2.
 *
 * The caller's radius is honoured **here**, not upstream: geo-api's proximity
 * search has no radius parameter (TS-008 D2.2), so the ~15 km cut is the
 * BFF's own and the answer says whether the upstream result cap truncated it.
 */

import { envelopeResponse, guard, problem } from "@/src/lib/live/bff";
import { nearbyEvents } from "@/src/lib/live/nearby";
import { NEARBY_RADIUS_KM } from "@/src/lib/live/widening";

function coordinate(raw: string | null, max: number): number | undefined {
  if (raw === null) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && Math.abs(value) <= max ? value : undefined;
}

export async function GET(request: Request): Promise<Response> {
  const { rejected } = guard(request, "nearby");
  if (rejected) return rejected;

  const params = new URL(request.url).searchParams;
  const lat = coordinate(params.get("lat"), 90);
  const lng = coordinate(params.get("lng"), 180);
  if (lat === undefined || lng === undefined) return problem(400, "lat and lng are required");

  const requestedRadius = Number(params.get("radius"));
  const radiusKm =
    Number.isFinite(requestedRadius) && requestedRadius > 0 && requestedRadius <= 50
      ? requestedRadius
      : NEARBY_RADIUS_KM;

  const envelope = await nearbyEvents({ lat, lng, radiusKm });
  return envelopeResponse(envelope, "dates");
}
