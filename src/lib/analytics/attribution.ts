/**
 * Campaign attribution — TS-012 D6.
 *
 * `etcc_cmp` (campaign) and `etcc_med` (medium) are the two parameters in
 * productive use, inherited from the `entre` QR-shortlink convention. The
 * website never sets or persists them (D1's storage ban, D6 "storage: none")
 * — it only reads them off the entry URL and forwards them, unchanged, onto
 * the one outbound link that crosses the measurement boundary (D5): the
 * `app.*` handover.
 *
 * The companion rule — a canonical URL strips *every* query parameter,
 * `etcc_*` included (TS-011 D9) — lives in `src/lib/seo`, not here: it is a
 * findability rule with no campaign-specific logic, and applies to
 * `?ort=…` exactly as it applies to `?etcc_cmp=…`.
 */

/** D6: the two parameters in productive use. Others may be adopted later. */
export const CAMPAIGN_PARAMS = ["etcc_cmp", "etcc_med"] as const;

export type CampaignParam = (typeof CAMPAIGN_PARAMS)[number];

export type CampaignParams = Partial<Record<CampaignParam, string>>;

/** Reads the D6 parameters off an entry URL's query string. Nothing else. */
export function extractCampaignParams(
  searchParams: URLSearchParams,
): CampaignParams {
  const found: CampaignParams = {};
  for (const key of CAMPAIGN_PARAMS) {
    const value = searchParams.get(key);
    if (value) found[key] = value;
  }
  return found;
}

/**
 * D6 "handover links": append the campaign params — and no other parameter
 * — onto an outbound `app.*` link, so the app's `completed` events land
 * under the same campaign (D3's shared property).
 */
export function appendCampaignParams(
  url: string,
  params: CampaignParams,
): string {
  const target = new URL(url);
  for (const key of CAMPAIGN_PARAMS) {
    const value = params[key];
    if (value) target.searchParams.set(key, value);
  }
  return target.toString();
}

/** Whether a URL carries any D6 campaign parameter. */
export function hasCampaignParams(searchParams: URLSearchParams): boolean {
  return CAMPAIGN_PARAMS.some((key) => searchParams.has(key));
}
