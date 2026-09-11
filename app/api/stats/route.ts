/**
 * `GET /api/stats` — position 4, the live counters (WEB-F-041, TS-008 D8).
 *
 * **204, not an empty object**, when the module must be removed from the page
 * (TS-009 D6: beyond the serve-stale window the counters are hidden, never
 * snapshotted and never zeroed). A body with missing figures is the other
 * case — a figure `/api/stats` has no field for simply is not in the payload,
 * and `live-counters` then renders one slot fewer.
 */

import { envelopeResponse, guard } from "@/src/lib/live/bff";
import { liveCounters } from "@/src/lib/live/counters";

export async function GET(request: Request): Promise<Response> {
  const { rejected } = guard(request, "stats");
  if (rejected) return rejected;

  const envelope = await liveCounters();
  if (envelope === undefined) {
    return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
  }

  return envelopeResponse(envelope, "counters");
}
