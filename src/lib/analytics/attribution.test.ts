import { describe, expect, it } from "vitest";

import {
  appendCampaignParams,
  CAMPAIGN_PARAMS,
  extractCampaignParams,
  hasCampaignParams,
} from "@/src/lib/analytics/attribution";
import { APP_URL } from "@/src/lib/live/app-handover";

describe("TS-WEB-0012-A6/A7: campaign attribution (etcc_*)", () => {
  it("names exactly the two parameters in productive use", () => {
    expect(CAMPAIGN_PARAMS).toEqual(["etcc_cmp", "etcc_med"]);
  });

  it("extracts both parameters off an entry URL", () => {
    const params = extractCampaignParams(
      new URLSearchParams("etcc_cmp=frühjahr&etcc_med=qr"),
    );
    expect(params).toEqual({ etcc_cmp: "frühjahr", etcc_med: "qr" });
  });

  it("extracts nothing beyond the two named parameters", () => {
    const params = extractCampaignParams(
      new URLSearchParams("etcc_cmp=x&utm_source=y&ort=schlatkow"),
    );
    expect(params).toEqual({ etcc_cmp: "x" });
  });

  it("appends both parameters onto the app handover link, and nothing else", () => {
    const url = appendCampaignParams(APP_URL, {
      etcc_cmp: "frühjahr",
      etcc_med: "qr",
    });
    const parsed = new URL(url);
    expect(`${parsed.origin}${parsed.pathname}`).toBe(APP_URL);
    expect(parsed.searchParams.get("etcc_cmp")).toBe("frühjahr");
    expect(parsed.searchParams.get("etcc_med")).toBe("qr");
    expect([...parsed.searchParams.keys()]).toHaveLength(2);
  });

  it("does not delay or otherwise change the handover link when there is nothing to attach", () => {
    expect(appendCampaignParams(APP_URL, {})).toBe(APP_URL);
  });

  it("reports whether a URL carries any campaign parameter", () => {
    expect(hasCampaignParams(new URLSearchParams("etcc_cmp=x"))).toBe(true);
    expect(hasCampaignParams(new URLSearchParams("ort=schlatkow"))).toBe(false);
  });
});
