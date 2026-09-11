import { describe, expect, it } from "vitest";

import { domainConfigFor } from "@/src/lib/routes/host-matrix";
import { isAssetPath, landingDomainBlocks } from "@/src/lib/routes/landing-domain";

const at = domainConfigFor("www.schafvormfenster.at");
const pl = domainConfigFor("www.owcezaoknem.pl");
const com = domainConfigFor("www.sheepoutside.com");
const de = domainConfigFor("www.schafe-vorm-fenster.de");

describe("TS-004-A3: landing-only domain — `/` and legal 200, `/mitmachen` 404", () => {
  it("blocks every page outside the landing set on all three landing domains", () => {
    for (const domain of [at, pl, com])
      for (const path of [
        "/mitmachen",
        "/en/take-part",
        "/dein-ort",
        "/dein-kalender/bestellen",
        "/ueber-uns/archiv",
        "/start",
        "/api/places",
      ])
        expect(landingDomainBlocks(domain, path), `${domain.host}${path}`).toBe(true);
  });

  it("serves `/`, the legal route and the machine surfaces there", () => {
    for (const domain of [at, pl, com])
      for (const path of [
        "/",
        "/en",
        "/rechtliches",
        "/en/legal",
        "/robots.txt",
        "/sitemap.xml",
        "/llms.txt",
      ])
        expect(landingDomainBlocks(domain, path), `${domain.host}${path}`).toBe(false);
  });

  it("never blocks anything on a full-site domain", () => {
    for (const path of ["/mitmachen", "/dein-ort", "/start", "/api/places"])
      expect(landingDomainBlocks(de, path), path).toBe(false);
  });

  it("never blocks an asset — the one page the domain serves has to render", () => {
    for (const path of [
      "/_next/static/chunks/main.js",
      "/favicon.ico",
      "/logo.svg",
      "/fonts/atkinson.woff2",
      "/site.webmanifest",
    ])
      expect(landingDomainBlocks(at, path), path).toBe(false);
  });

  it("does not mistake a page for an asset", () => {
    expect(isAssetPath("/mitmachen")).toBe(false);
    expect(isAssetPath("/dein-ort/starten")).toBe(false);
    expect(isAssetPath("/_next/static/x")).toBe(true);
  });
});
