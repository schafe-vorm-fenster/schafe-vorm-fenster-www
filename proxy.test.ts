import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { proxy } from "@/proxy";
import { CSP_HASHES_ASSET_PATH, resetScriptHashCache } from "@/src/lib/security/csp-hashes";

/**
 * `proxy.ts` had no test of its own (F-2-36). These are the guarantees it
 * makes for *every* request on the site — the canonical-host redirect
 * (TS-001 D2), the CSP and HSTS headers (TS-014 D4/D5), `X-Robots-Tag`
 * (TS-015 D3) — plus the one a security finding put on it: a request that
 * chooses its own `Host` must not be able to aim the deployment's
 * secret-bearing self-fetch at an origin of its choosing.
 */

interface Call {
  readonly url: string;
  readonly bypass: string | undefined;
}

let calls: Call[] = [];

function stubFetch(): void {
  vi.stubGlobal("fetch", (input: URL | string, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    calls.push({
      url: String(input),
      bypass: headers.get("x-vercel-protection-bypass") ?? undefined,
    });
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ hashes: [] }),
    } as Response);
  });
}

function request(url: string, headers: Record<string, string> = {}): NextRequest {
  const parsed = new URL(url);
  return new NextRequest(url, {
    headers: { host: parsed.host, ...headers },
  });
}

beforeEach(() => {
  calls = [];
  resetScriptHashCache();
  stubFetch();
  vi.stubEnv("VERCEL_ENV", "");
  vi.stubEnv("VERCEL_URL", "");
  vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
  vi.stubEnv("VERCEL_DEPLOYMENT_ID", "");
  vi.stubEnv("VERCEL_AUTOMATION_BYPASS_SECRET", "s3cret");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  resetScriptHashCache();
});

describe("F-2-36: a spoofed Host cannot aim the self-fetch", () => {
  it("fetches the hash asset from the deployment's own origin, not the request's", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");

    await proxy(request("https://attacker.example/mitmachen"));

    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe(
      `https://sheep-abc123.vercel.app${CSP_HASHES_ASSET_PATH}`,
    );
    expect(calls[0]!.bypass).toBe("s3cret");
  });

  it("sends the bypass secret to no host the request named — the Host-spoof case", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");

    for (const host of [
      "attacker.example",
      "169.254.169.254",
      "internal.corp",
      "www.schafe-vorm-fenster.de.attacker.example",
    ]) {
      await proxy(request(`https://${host}/`));
    }

    for (const call of calls) {
      expect(new URL(call.url).host).toBe("sheep-abc123.vercel.app");
    }
    expect(calls.some((call) => call.url.includes("attacker.example"))).toBe(false);
  });

  it("off Vercel, does not fetch at all for an unknown host", async () => {
    await proxy(request("https://attacker.example/"));
    expect(calls).toHaveLength(0);
  });

  it("does not recurse into the hash asset's own request", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "sheep-abc123.vercel.app");

    await proxy(request(`https://sheep-abc123.vercel.app${CSP_HASHES_ASSET_PATH}`));

    expect(calls).toHaveLength(0);
  });
});

describe("TS-014 D4/D5: every response carries the policy", () => {
  it("sets a Content-Security-Policy on an ordinary request", async () => {
    const response = await proxy(request("http://localhost:3100/mitmachen"));
    const csp = response.headers.get("Content-Security-Policy");
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("grades HSTS by environment and omits it locally", async () => {
    expect(
      (await proxy(request("http://localhost:3100/"))).headers.get(
        "Strict-Transport-Security",
      ),
    ).toBeNull();

    vi.stubEnv("VERCEL_ENV", "production");
    expect(
      (await proxy(request("https://www.schafe-vorm-fenster.de/"))).headers.get(
        "Strict-Transport-Security",
      ),
    ).toBe("max-age=63072000; includeSubDomains");
  });
});

describe("TS-015 D3: X-Robots-Tag on everything that is not the production site", () => {
  it("marks a preview noindex", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const response = await proxy(request("https://sheep-abc123.vercel.app/"));
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });

  it("leaves the canonical production host indexable", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const response = await proxy(request("https://www.schafe-vorm-fenster.de/"));
    expect(response.headers.get("X-Robots-Tag")).toBeNull();
  });
});

describe("TS-001 D2: the canonical-host redirect", () => {
  it("redirects the bare apex to www with a 301, path and query intact", async () => {
    const response = await proxy(
      request("https://schafe-vorm-fenster.de/mitmachen?ort=beispieldorf"),
    );
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://www.schafe-vorm-fenster.de/mitmachen?ort=beispieldorf",
    );
  });

  it("never redirects a host outside the D1 matrix", async () => {
    const response = await proxy(request("https://sheep-abc123.vercel.app/"));
    expect(response.status).toBe(200);
  });
});
