import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CSP_HASHES_ASSET_PATH,
  hashSourceFor,
  MAX_SCRIPT_HASHES,
  resetScriptHashCache,
  scriptHashes,
} from "@/src/lib/security/csp-hashes";

/**
 * F-2-36 — the three defences this module lacked, one describe block each,
 * plus the Host-spoof case that proves the Deployment Protection bypass
 * secret never leaves for an origin the request chose.
 *
 * The module reads `process.env` at call time, so every test sets the
 * deployment's own identity explicitly rather than inheriting the runner's.
 */

const VALID_HASH = `sha256-${"A".repeat(43)}=`;
const SECOND_HASH = `sha256-${"B".repeat(43)}=`;

interface Call {
  readonly url: string;
  readonly bypass: string | undefined;
}

function stubFetch(body: unknown, ok = true): Call[] {
  const calls: Call[] = [];
  vi.stubGlobal("fetch", (input: URL | string, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    calls.push({
      url: String(input),
      bypass: headers.get("x-vercel-protection-bypass") ?? undefined,
    });
    return Promise.resolve({
      ok,
      json: () => Promise.resolve(body),
    } as Response);
  });
  return calls;
}

beforeEach(() => {
  resetScriptHashCache();
  vi.stubEnv("VERCEL_AUTOMATION_BYPASS_SECRET", "s3cret");
  vi.stubEnv("VERCEL_URL", "");
  vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
  vi.stubEnv("VERCEL_DEPLOYMENT_ID", "");
  vi.stubEnv("PORT", "3100");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  resetScriptHashCache();
});

describe("F-2-36 defence 1: the fetch origin comes from the deployment, never from the Host header", () => {
  it("fetches this deployment's own VERCEL_URL and ignores the request origin", async () => {
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");
    const calls = stubFetch({ hashes: [VALID_HASH] });

    await scriptHashes("https://attacker.example");

    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe(
      `https://sheep-abc123.vercel.app${CSP_HASHES_ASSET_PATH}`,
    );
  });

  it("never sends the bypass secret to a Host-chosen origin — the Host-spoof case", async () => {
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");
    const calls = stubFetch({ hashes: [VALID_HASH] });

    await scriptHashes("https://attacker.example");

    for (const call of calls) {
      expect(call.url.startsWith("https://attacker.example")).toBe(false);
      if (!call.url.startsWith("https://sheep-abc123.vercel.app"))
        expect(call.bypass).toBeUndefined();
    }
    expect(calls[0]!.bypass).toBe("s3cret");
  });

  it("falls back to VERCEL_PROJECT_PRODUCTION_URL when the deployment URL is absent", async () => {
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "www.schafe-vorm-fenster.de");
    const calls = stubFetch({ hashes: [VALID_HASH] });

    await scriptHashes("https://attacker.example");

    expect(calls[0]!.url).toBe(
      `https://www.schafe-vorm-fenster.de${CSP_HASHES_ASSET_PATH}`,
    );
  });

  it("refuses a malformed self-URL rather than fetching it", async () => {
    vi.stubEnv("VERCEL_URL", "evil.example/../..@other.example");
    const calls = stubFetch({ hashes: [VALID_HASH] });

    expect(await scriptHashes("https://attacker.example")).toEqual([]);
    expect(calls).toHaveLength(0);
  });

  it("off Vercel, fetches a known host without the secret", async () => {
    const calls = stubFetch({ hashes: [VALID_HASH] });

    expect(await scriptHashes("http://localhost:3100")).toEqual([VALID_HASH]);
    expect(calls[0]!.url).toBe(`http://localhost:3100${CSP_HASHES_ASSET_PATH}`);
    expect(calls[0]!.bypass).toBeUndefined();
  });

  it("off Vercel, does not fetch an origin outside the D1 host set at all", async () => {
    const calls = stubFetch({ hashes: [VALID_HASH] });

    expect(await scriptHashes("https://attacker.example")).toEqual([]);
    expect(calls).toHaveLength(0);
  });

  it("names the source it would use, for both branches", () => {
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");
    expect(hashSourceFor("https://attacker.example")).toEqual({
      origin: "https://sheep-abc123.vercel.app",
      sendBypass: true,
      cacheKey: "sheep-abc123.vercel.app",
    });
    vi.stubEnv("VERCEL_URL", "");
    expect(hashSourceFor("https://attacker.example")).toBeUndefined();
  });
});

describe("F-2-36 defence 2: the cache is keyed by deployment, not by nothing", () => {
  it("fetches once per deployment, not once per process", async () => {
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");
    vi.stubEnv("VERCEL_DEPLOYMENT_ID", "dpl_one");
    const calls = stubFetch({ hashes: [VALID_HASH] });

    await scriptHashes("https://whatever.example");
    await scriptHashes("https://whatever.example");
    expect(calls).toHaveLength(1);

    vi.stubEnv("VERCEL_DEPLOYMENT_ID", "dpl_two");
    vi.stubEnv("VERCEL_URL", "sheep-def456.vercel.app");
    await scriptHashes("https://whatever.example");
    expect(calls).toHaveLength(2);
    expect(calls[1]!.url).toContain("sheep-def456.vercel.app");
  });
});

describe("F-2-36 defence 3: only a real sha256 source reaches script-src", () => {
  it("drops every entry that is not exactly a sha256 base64 token", async () => {
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");
    stubFetch({
      hashes: [
        VALID_HASH,
        "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        "'; script-src * 'unsafe-inline'; x '",
        "sha384-" + "A".repeat(43) + "=",
        42,
        null,
        { hash: VALID_HASH },
        SECOND_HASH,
      ],
    });

    expect(await scriptHashes("https://whatever.example")).toEqual([
      VALID_HASH,
      SECOND_HASH,
    ]);
  });

  it("caps the set so a hostile asset cannot grow the header without bound", async () => {
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");
    const many = Array.from(
      { length: MAX_SCRIPT_HASHES + 50 },
      (_, index) => `sha256-${String(index).padStart(43, "A")}=`,
    );
    stubFetch({ hashes: many });

    expect(await scriptHashes("https://whatever.example")).toHaveLength(
      MAX_SCRIPT_HASHES,
    );
  });

  it("de-duplicates", async () => {
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");
    stubFetch({ hashes: [VALID_HASH, VALID_HASH, SECOND_HASH] });

    expect(await scriptHashes("https://whatever.example")).toEqual([
      VALID_HASH,
      SECOND_HASH,
    ]);
  });
});

describe("the failure modes stay values, not exceptions", () => {
  it("returns [] on a non-ok response", async () => {
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");
    stubFetch({ hashes: [VALID_HASH] }, false);
    expect(await scriptHashes("https://whatever.example")).toEqual([]);
  });

  it("returns [] when the body is not the expected shape", async () => {
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");
    stubFetch({ nope: true });
    expect(await scriptHashes("https://whatever.example")).toEqual([]);
  });

  it("returns [] when the fetch throws", async () => {
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");
    vi.stubGlobal("fetch", () => Promise.reject(new Error("network")));
    expect(await scriptHashes("https://whatever.example")).toEqual([]);
  });
});

describe("the off-Vercel fallback is a host allowlist, not a port scanner", () => {
  it("admits only the port this process listens on", async () => {
    vi.stubEnv("PORT", "3100");
    const calls = stubFetch({ hashes: [VALID_HASH] });

    expect(await scriptHashes("http://localhost:31337")).toEqual([]);
    expect(calls).toHaveLength(0);

    expect(await scriptHashes("http://localhost:3100")).toEqual([VALID_HASH]);
    expect(calls).toHaveLength(1);
  });

  it("refuses a public D1 host on a chosen port", async () => {
    const calls = stubFetch({ hashes: [VALID_HASH] });

    expect(await scriptHashes("https://www.schafe-vorm-fenster.de:8443")).toEqual([]);
    expect(calls).toHaveLength(0);

    expect(await scriptHashes("https://www.schafe-vorm-fenster.de")).toEqual([VALID_HASH]);
    expect(calls).toHaveLength(1);
    expect(calls[0]!.bypass).toBeUndefined();
  });

  it("refuses a look-alike host that merely ends in a D1 domain", async () => {
    const calls = stubFetch({ hashes: [VALID_HASH] });
    expect(
      await scriptHashes("https://www.schafe-vorm-fenster.de.attacker.example"),
    ).toEqual([]);
    expect(calls).toHaveLength(0);
  });
});
