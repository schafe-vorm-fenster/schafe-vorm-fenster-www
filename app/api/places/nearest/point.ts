/**
 * The one input `GET /api/places/nearest` takes — a WGS-84 point — read out of
 * two query parameters and validated before anything is asked of a backend.
 *
 * A pure function on its own so the route's acceptance rule is testable
 * without a request: finite numbers, latitude within ±90, longitude within
 * ±180, both present. Anything else is a 400, never a lookup.
 */

export interface GeoPoint {
  readonly lat: number;
  readonly lng: number;
}

export function readPoint(lat: string | null, lng: string | null): GeoPoint | undefined {
  if (lat === null || lng === null) return undefined;
  const parsedLat = Number(lat.trim());
  const parsedLng = Number(lng.trim());
  if (lat.trim() === "" || lng.trim() === "") return undefined;
  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return undefined;
  if (Math.abs(parsedLat) > 90 || Math.abs(parsedLng) > 180) return undefined;
  return { lat: parsedLat, lng: parsedLng };
}
