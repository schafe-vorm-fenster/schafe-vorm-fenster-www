/**
 * "6 km", never "0 km": a date in the next village is at least a kilometre away.
 *
 * Its own module since DEC-0163: the browser renders the live rows now, and
 * `distance.ts` imports the 230 KB covered-community index to measure — the
 * formatter must not drag that into a client bundle.
 */
export function formatDistance(km: number): string {
  return `${Math.max(1, Math.round(km))} km`;
}
