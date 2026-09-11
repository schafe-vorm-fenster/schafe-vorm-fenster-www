import { describe, expect, it } from "vitest";

import { createHubResolver, parseSourceRef } from "@/src/lib/content/source-refs";

describe("TS-007-A7: the source adapter resolves `<package>@<version>#<record-id>`", () => {
  const resolver = createHubResolver();

  it("parses the three accepted address forms", () => {
    expect(parseSourceRef("@schafe-vorm-fenster/proof@0.3.5#regional-footprint")).toEqual({
      raw: "@schafe-vorm-fenster/proof@0.3.5#regional-footprint",
      kind: "record",
      packageName: "@schafe-vorm-fenster/proof",
      version: "0.3.5",
      recordId: "regional-footprint",
    });
    expect(parseSourceRef("@schafe-vorm-fenster/proof@0.3.5")?.kind).toBe("pool");
    expect(parseSourceRef("ia")?.kind).toBe("ia");
  });

  it("refuses a repository path and a version range (TS-007 D1, DEC-042)", () => {
    expect(parseSourceRef("packages/evidence/proof/founder.proof.md")).toBeNull();
    expect(parseSourceRef("@schafe-vorm-fenster/proof@^0.3.5#x")).toBeNull();
    expect(parseSourceRef("")).toBeNull();
  });

  it("resolves a record against the installed package and returns it", () => {
    const result = resolver.resolve(
      "@schafe-vorm-fenster/proof@0.3.5#founder-former-volunteer-mayor",
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.record?.usage_rights).toBe("cleared");
  });

  it("fails loudly on a version that does not match the installed package", () => {
    const result = resolver.resolve("@schafe-vorm-fenster/proof@9.9.9#regional-footprint");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.problem).toBe("version-mismatch");
    expect(result.message).toContain("0.3.5");
  });

  it("fails loudly on an unknown record id", () => {
    const result = resolver.resolve("@schafe-vorm-fenster/proof@0.3.5#no-such-record");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.problem).toBe("unknown-record");
  });

  it("fails on a package that is not installed", () => {
    const result = resolver.resolve("@schafe-vorm-fenster/strategy@1.0.0#positioning");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.problem).toBe("unknown-package");
  });

  it("fails on a malformed ref", () => {
    const result = resolver.resolve("proof#regional-footprint");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.problem).toBe("malformed");
  });

  it("resolves `ia` — the copy shell with no source record (TS-007 D6)", () => {
    const result = resolver.resolve("ia");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.record).toBeNull();
  });

  it("resolves a whole-package pool ref against the installed version only", () => {
    expect(resolver.resolve("@schafe-vorm-fenster/media-echo@0.3.3").ok).toBe(true);
    const stale = resolver.resolve("@schafe-vorm-fenster/media-echo@0.1.0");
    expect(stale.ok).toBe(false);
    if (stale.ok) return;
    expect(stale.problem).toBe("version-mismatch");
  });
});
