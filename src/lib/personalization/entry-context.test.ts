import { describe, expect, it } from "vitest";

import { PRESS_REFERRER_HOSTS, resolveEntryTrait } from "./entry-context";
import { ENTRY_TRAITS } from "../relevance/types";

describe("TS-010-A3: every row of the D3 table is recognised from its fixture", () => {
  it("social — an Instagram, Facebook or WhatsApp referrer", () => {
    for (const referrer of [
      "https://l.instagram.com/",
      "https://m.facebook.com/",
      "https://www.facebook.com/x",
      "https://api.whatsapp.com/",
    ]) {
      expect(resolveEntryTrait({ referrer })).toBe("social");
    }
  });

  it("social — the campaign medium, with utm_medium as the accepted alias", () => {
    expect(resolveEntryTrait({ params: { etcc_med: "social" } })).toBe("social");
    expect(resolveEntryTrait({ params: { utm_medium: "social" } })).toBe("social");
  });

  it("professional — a LinkedIn referrer", () => {
    expect(resolveEntryTrait({ referrer: "https://www.linkedin.com/feed/" })).toBe("professional");
  });

  it("purchase-intent — an organic search onto a page whose focus job is run-our-own-calendar", () => {
    expect(
      resolveEntryTrait({
        referrer: "https://www.google.com/",
        focusJob: "run-our-own-calendar",
      }),
    ).toBe("purchase-intent");
  });

  it("reader-search — an organic search onto /dein-ort", () => {
    expect(resolveEntryTrait({ referrer: "https://duckduckgo.com/", routeId: "place" })).toBe(
      "reader-search",
    );
  });

  it("print-qr — the print campaign family", () => {
    expect(resolveEntryTrait({ params: { etcc_med: "print" } })).toBe("print-qr");
  });

  it("press — a host on the press and podcast allowlist", () => {
    expect(PRESS_REFERRER_HOSTS.length).toBeGreaterThan(0);
    expect(resolveEntryTrait({ referrer: "https://www.nordkurier.de/artikel" })).toBe("press");
    expect(
      resolveEntryTrait({ referrer: "https://example-podcast.de/", pressHosts: ["example-podcast.de"] }),
    ).toBe("press");
  });

  it("activated — the newsletter medium or the app", () => {
    expect(resolveEntryTrait({ params: { etcc_med: "newsletter" } })).toBe("activated");
    expect(resolveEntryTrait({ referrer: "https://app.schafe-vorm-fenster.de/lehre" })).toBe(
      "activated",
    );
  });

  it("direct — an empty, unknown or unparsable referrer, and our own pages", () => {
    expect(resolveEntryTrait({})).toBe("direct");
    expect(resolveEntryTrait({ referrer: "" })).toBe("direct");
    expect(resolveEntryTrait({ referrer: "not a url" })).toBe("direct");
    expect(resolveEntryTrait({ referrer: "https://irgendwo.example/" })).toBe("direct");
    expect(resolveEntryTrait({ referrer: "https://www.schafe-vorm-fenster.de/ueber-uns" })).toBe(
      "direct",
    );
  });

  it("lets stated intent win over inferred intent (TS-010 D2)", () => {
    expect(
      resolveEntryTrait({ referrer: "https://www.linkedin.com/", params: { etcc_med: "print" } }),
    ).toBe("print-qr");
  });

  it("returns a trait of the one shared vocabulary, never a second one", () => {
    const params = { etcc_med: "unbekannt" };
    expect(ENTRY_TRAITS).toContain(resolveEntryTrait({ params }));
  });

  it("reads a search-params object as well as URLSearchParams", () => {
    expect(resolveEntryTrait({ params: new URLSearchParams("etcc_med=newsletter") })).toBe(
      "activated",
    );
    expect(resolveEntryTrait({ params: { etcc_med: ["newsletter"] } })).toBe("activated");
  });

  it("never throws, whatever arrives", () => {
    expect(() => resolveEntryTrait({ referrer: "://", params: { etcc_med: "" } })).not.toThrow();
  });
});
