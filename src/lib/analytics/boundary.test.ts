import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * TS-012-A1, TS-012-A9, TS-012-A11 — static checks that do not need a
 * running app: the vendor is only ever addressed from inside this module,
 * no second analytics/tag/pixel vendor and no consent-banner component
 * exists in the tree, and no A/B testing package is a dependency.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const ANALYTICS_DIR = join(ROOT, "src", "lib", "analytics");
const SCAN_ROOTS = ["app", "src"];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function sourceFiles(): { path: string; text: string }[] {
  return SCAN_ROOTS.flatMap((base) => {
    const full = join(ROOT, base);
    try {
      statSync(full);
    } catch {
      return [];
    }
    return walk(full)
      .filter((file) => /\.(ts|tsx)$/.test(file))
      .filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"))
      .map((file) => ({ path: file, text: readFileSync(file, "utf8") }));
  });
}

describe("TS-012-A1: no analytics call site outside lib/analytics", () => {
  // The bare host also lives in the CSP allowlist (`src/lib/security/csp.ts`)
  // — a legitimate, non-call-site reference — so the script path is the
  // token, not the host by itself.
  const VENDOR_TOKENS = ["_etracker", "_etLoader", "code.etracker.com/code/e.js"];

  it("finds no eTracker vendor reference outside the module", () => {
    const offenders: string[] = [];
    for (const { path, text } of sourceFiles()) {
      if (path.startsWith(ANALYTICS_DIR)) continue;
      for (const token of VENDOR_TOKENS) {
        if (text.includes(token)) offenders.push(`${relative(ROOT, path)}: ${token}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("finds no consent-banner component anywhere in app/ or src/", () => {
    const offenders: string[] = [];
    for (const base of SCAN_ROOTS) {
      const full = join(ROOT, base);
      try {
        statSync(full);
      } catch {
        continue;
      }
      for (const file of walk(full)) {
        if (/consent[-.]?banner|cookie[-.]?banner|cookie[-.]?consent/i.test(file)) {
          offenders.push(relative(ROOT, file));
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("TS-012-A9: exactly one analytics vendor is set up", () => {
  it("names no second analytics/tag/pixel dependency in package.json", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const banned = [
      "react-ga",
      "react-ga4",
      "@amplitude/analytics-browser",
      "mixpanel-browser",
      "posthog-js",
      "@segment/analytics-next",
      "@vercel/analytics",
      "hotjar",
      "@microsoft/clarity",
      "fullstory",
    ];
    const present = Object.keys(deps).filter((name) => banned.includes(name));
    expect(present).toEqual([]);
  });
});

describe("TS-012-A11: no experimentation/A-B infrastructure ships (D8)", () => {
  it("names no A/B or feature-flag experimentation package", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const banned = [
      "@growthbook/growthbook",
      "@growthbook/growthbook-react",
      "launchdarkly-js-client-sdk",
      "@optimizely/optimizely-sdk",
      "@vercel/flags",
      "flags",
      "unleash-client",
      "@amplitude/experiment-js-client",
      "@splitsoftware/splitio",
    ];
    const present = Object.keys(deps).filter((name) => banned.includes(name));
    expect(present).toEqual([]);
  });
});
