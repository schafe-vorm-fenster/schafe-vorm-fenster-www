/**
 * `GET /api/region/{county}/examples` — position 3, DEC-034.
 *
 * A designed set of active example places, capped. Never a place list, never
 * an "alle Orte anzeigen" control — the cap is part of the contract, not a
 * pagination default.
 */

import { envelopeResponse, guard, problem } from "@/src/lib/live/bff";
import { regionExamples, REGION_EXAMPLE_MAX } from "@/src/lib/live/region";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ county: string }> },
): Promise<Response> {
  const { rejected } = guard(request, "region/examples");
  if (rejected) return rejected;

  const { county } = await params;
  if (county.length === 0 || county.length > 80) return problem(400, "county is required");

  const requestedMax = Number(new URL(request.url).searchParams.get("max"));
  const max =
    Number.isFinite(requestedMax) && requestedMax >= 1 && requestedMax <= REGION_EXAMPLE_MAX
      ? Math.trunc(requestedMax)
      : REGION_EXAMPLE_MAX;

  const envelope = await regionExamples({ county, max });
  return envelopeResponse(envelope, "activePlaces");
}
