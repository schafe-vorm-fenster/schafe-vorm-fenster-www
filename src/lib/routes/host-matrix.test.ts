import { describe, expect, it } from "vitest";

import {
  canonicalHostFor,
  DEFAULT_DOMAIN,
  domainConfigFor,
  DOMAIN_MATRIX,
  normaliseHost,
  renderedLanguage,
} from "@/src/lib/routes/host-matrix";

describe("TS-001 D1: the domain matrix", () => {
  it("names exactly the four phase-1 domains", () => {
    expect(DOMAIN_MATRIX.map((d) => d.host)).toEqual([
      "www.schafe-vorm-fenster.de",
      "www.owcezaoknem.pl",
      "www.schafvormfenster.at",
      "www.sheepoutside.com",
    ]);
  });

  it(".de is the only full-site domain; the rest are landing-only", () => {
    expect(DOMAIN_MATRIX.find((d) => d.kind === "full-site")?.host).toBe(
      "www.schafe-vorm-fenster.de",
    );
    expect(DOMAIN_MATRIX.filter((d) => d.kind === "landing")).toHaveLength(3);
  });

  it("each domain's TLD default matches D1's table", () => {
    const byHost = Object.fromEntries(DOMAIN_MATRIX.map((d) => [d.host, d.tldDefault]));
    expect(byHost["www.schafe-vorm-fenster.de"]).toBe("de");
    expect(byHost["www.owcezaoknem.pl"]).toBe("pl");
    expect(byHost["www.schafvormfenster.at"]).toBe("de");
    expect(byHost["www.sheepoutside.com"]).toBe("en");
  });
});

describe("TS-001-A6: unknown hosts mirror .de", () => {
  it("resolves *.vercel.app to the default domain", () => {
    expect(domainConfigFor("schafe-vorm-fenster-www.vercel.app")).toBe(DEFAULT_DOMAIN);
  });

  it("resolves localhost to the default domain", () => {
    expect(domainConfigFor("localhost:3100")).toBe(DEFAULT_DOMAIN);
  });

  it("resolves a known canonical or bare host to its own row", () => {
    expect(domainConfigFor("www.owcezaoknem.pl").tldDefault).toBe("pl");
    expect(domainConfigFor("owcezaoknem.pl").tldDefault).toBe("pl");
  });

  it("is case- and port-insensitive", () => {
    expect(normaliseHost("WWW.Schafe-Vorm-Fenster.de:443")).toBe(
      "www.schafe-vorm-fenster.de",
    );
  });
});

describe("TS-001-A4/D2: the canonical-host redirect target", () => {
  it("names the www. form for every known bare domain", () => {
    expect(canonicalHostFor("schafe-vorm-fenster.de")).toBe("www.schafe-vorm-fenster.de");
    expect(canonicalHostFor("owcezaoknem.pl")).toBe("www.owcezaoknem.pl");
    expect(canonicalHostFor("schafvormfenster.at")).toBe("www.schafvormfenster.at");
    expect(canonicalHostFor("sheepoutside.com")).toBe("www.sheepoutside.com");
  });

  it("is undefined for an already-canonical host", () => {
    expect(canonicalHostFor("www.schafe-vorm-fenster.de")).toBeUndefined();
  });

  it("is undefined for an unrecognised host — never redirects to a different domain", () => {
    expect(canonicalHostFor("schafe-vorm-fenster-www.vercel.app")).toBeUndefined();
    expect(canonicalHostFor("localhost")).toBeUndefined();
  });
});

describe("TS-001 D3, generalised: the rendered language per domain", () => {
  const deDomain = DOMAIN_MATRIX[0]!;
  const plDomain = DOMAIN_MATRIX[1]!;

  it("falls back to the TLD default with no recognised first segment", () => {
    expect(renderedLanguage("/mitmachen", deDomain)).toBe("de");
    expect(renderedLanguage("/", plDomain)).toBe("pl");
  });

  it("reads a recognised first segment as the language", () => {
    expect(renderedLanguage("/en/mitmachen", deDomain)).toBe("en");
  });

  it("ignores a first segment the domain does not offer", () => {
    expect(renderedLanguage("/uk/mitmachen", deDomain)).toBe("de");
  });
});
