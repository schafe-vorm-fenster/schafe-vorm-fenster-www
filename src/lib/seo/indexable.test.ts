import { describe, expect, it } from "vitest";

import {
  CANONICAL_PUBLIC_HOSTS,
  environmentFrom,
  isIndexable,
  normaliseHost,
} from "@/src/lib/seo/indexable";

describe("TS-015 D3: the indexability predicate", () => {
  it("is true only for production on a canonical host", () => {
    expect(isIndexable("production", "www.schafe-vorm-fenster.de")).toBe(true);
    for (const host of CANONICAL_PUBLIC_HOSTS) {
      expect(isIndexable("production", host)).toBe(true);
    }
  });

  it("is false on a production build reached under a non-canonical host", () => {
    expect(isIndexable("production", "schafe-vorm-fenster.vercel.app")).toBe(
      false,
    );
    expect(isIndexable("production", "schafe-vorm-fenster.de")).toBe(false);
    expect(isIndexable("production", "next.schafe-vorm-fenster.de")).toBe(false);
  });

  it("is false on every preview and local deployment", () => {
    expect(isIndexable("preview", "www.schafe-vorm-fenster.de")).toBe(false);
    expect(isIndexable(undefined, "localhost")).toBe(false);
  });

  it("ignores port and case in the host", () => {
    expect(normaliseHost("WWW.Schafe-Vorm-Fenster.de:443")).toBe(
      "www.schafe-vorm-fenster.de",
    );
    expect(isIndexable("production", "WWW.SCHAFE-VORM-FENSTER.DE:443")).toBe(
      true,
    );
  });

  it("maps VERCEL_ENV onto the three environments of TS-014 D5", () => {
    expect(environmentFrom("production")).toBe("production");
    expect(environmentFrom("preview")).toBe("preview");
    expect(environmentFrom("development")).toBe("development");
    expect(environmentFrom(undefined)).toBe("development");
  });
});
