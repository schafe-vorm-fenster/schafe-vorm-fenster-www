import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { describe, expect, it } from "vitest";

import { FORBIDDEN_FORWARD_HEADERS, upstreamHeaders } from "@/src/clients/http";

/**
 * The static half of the BFF boundary — TS-008-A1 and TS-013-A3/A5.
 *
 * These read the source tree rather than running it, because the criteria are
 * about what exists, not about what happens: a forbidden endpoint that is
 * never called today is still one refactor away from being called.
 */

const ROOT = join(import.meta.dirname, "..", "..", "..");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (["node_modules", ".next", ".vercel", ".git"].includes(name)) return [];
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// `proxy.ts` sits at the repository root and is a client caller since F-2-49
// (`place-hop.ts` → `live-anchor.ts` → `places.ts`), so it belongs inside the
// boundary these criteria draw — it was outside every one of them until the
// differential review of that change said so.
const sourceFiles = [
  ...walk(join(ROOT, "app")),
  ...walk(join(ROOT, "src")),
  join(ROOT, "proxy.ts"),
]
  .filter((file) => /\.(ts|tsx)$/.test(file))
  .filter((file) => !/\.test\.tsx?$/.test(file))
  .map((file) => ({ path: relative(ROOT, file), source: readFileSync(file, "utf8") }));

const insideClients = (path: string) => path.startsWith(`src${sep}clients${sep}`);

describe("TS-008-A1: the forbidden endpoint and the closed host set", () => {
  it("references the forbidden geo-api address lookup nowhere in the source tree", () => {
    // Assembled from parts so this assertion is not its own counter-example.
    const forbidden = `findby${"address"}`;
    const offenders = sourceFiles.filter((file) => file.source.includes(forbidden));
    expect(offenders.map((file) => file.path)).toEqual([]);
  });

  it("names no ecosystem host outside src/clients", () => {
    const hosts = ["events.api.schafe-vorm-fenster.de", "geo.api-v2.schafe-vorm-fenster.de"];
    const offenders = sourceFiles.filter(
      (file) => !insideClients(file.path) && hosts.some((host) => file.source.includes(host)),
    );
    expect(offenders.map((file) => file.path)).toEqual([]);
  });

  it("reads a read token outside src/clients nowhere", () => {
    const offenders = sourceFiles.filter(
      (file) => !insideClients(file.path) && /_READ_TOKEN/.test(file.source),
    );
    expect(offenders.map((file) => file.path)).toEqual([]);
  });

  it("has no client component importing a service client", () => {
    const offenders = sourceFiles.filter(
      (file) =>
        /^\s*["']use client["']/m.test(file.source) && /from ["']@\/src\/clients\//.test(file.source),
    );
    expect(offenders.map((file) => file.path)).toEqual([]);
  });
});

describe("TS-013-A5: no client identity crosses the BFF boundary", () => {
  it("builds upstream requests from a closed header set", () => {
    expect(Object.keys(upstreamHeaders(false))).toEqual(["accept"]);
    expect(Object.keys(upstreamHeaders(true)).sort()).toEqual(["accept", "content-type"]);
  });

  it("carries none of the client-IP headers TS-013 D3 forbids forwarding", () => {
    const headerNames = Object.keys({ ...upstreamHeaders(true), ...upstreamHeaders(false) });
    for (const forbidden of FORBIDDEN_FORWARD_HEADERS) {
      expect(headerNames).not.toContain(forbidden);
    }
  });

  it("forwards no request header from the handlers into a client call", () => {
    // The clients take a config and a query — never a `Request` and never a
    // header bag — so there is no parameter through which one could arrive.
    const clients = sourceFiles.filter(
      (file) => insideClients(file.path) && file.path.endsWith("client.ts"),
    );
    expect(clients.length).toBeGreaterThan(0);
    for (const client of clients) {
      expect(client.source).not.toMatch(/headers\.get\(/);
      expect(client.source).not.toMatch(/\bRequest\b/);
    }
  });
});

describe("TS-008-A10: no static traction figure exists as a fallback", () => {
  it("ships no counters snapshot file — tier 3 is unreachable for the counters", () => {
    const snapshots = readdirSync(join(ROOT, "src", "generated", "snapshots"));
    expect(snapshots).not.toContain("counters.json");
    expect(snapshots).not.toContain("stats.json");
  });
});
