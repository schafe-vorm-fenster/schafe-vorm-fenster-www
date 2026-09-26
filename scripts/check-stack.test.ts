import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { BRAND, checkStack } from "./check-stack";

/**
 * `check:stack` is the instrument for four `static` criteria of
 * TS-WEB-0017, and until 2026-09-26 nothing tested it: the script was a
 * straight-line module that read the real repository and called
 * `process.exit`, so the only way to learn whether a rule fired was to break
 * the repository. That is also how the criteria drifted out of
 * `state/coverage.md` — a check nobody can exercise is a check nobody notices
 * has stopped checking.
 *
 * The fixtures below are a repository of the same *shape* — `package.json`,
 * `stack.allow.json`, `pnpm-lock.yaml`, `.npmrc` — built fresh per test in a
 * temporary directory and removed afterwards, never committed. Each case
 * starts from a green tree and breaks exactly one thing, so the assertion is
 * "this rule fires, and only this rule".
 */

let fixtureRoot: string | undefined;

afterEach(() => {
  if (fixtureRoot) rmSync(fixtureRoot, { recursive: true, force: true });
  fixtureRoot = undefined;
});

const NPMRC = [
  "@schafe-vorm-fenster:registry=https://npm.pkg.github.com",
  "@leafcutter-strict:registry=https://packages.leafcutteros.ai",
  "",
].join("\n");

interface TreeOverrides {
  readonly dependencies?: Record<string, string>;
  readonly packageManager?: string;
  readonly register?: Record<string, { reason: string }>;
  readonly denySet?: Record<string, string[]>;
  readonly npmrc?: string;
  readonly lock?: string | null;
  readonly extraLockfiles?: readonly string[];
}

/** A tree that passes every rule, minus whatever the case overrides. */
function tree(overrides: TreeOverrides = {}): string {
  fixtureRoot = mkdtempSync(join(tmpdir(), "check-stack-"));
  const root = fixtureRoot;

  const dependencies = overrides.dependencies ?? {
    next: "16.0.0",
    "lucide-react": "0.500.0",
    [BRAND]: "2.4.0",
  };
  const register =
    overrides.register ??
    Object.fromEntries(
      Object.keys(dependencies).map((name) => [name, { reason: `needed by the site: ${name}` }]),
    );

  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      name: "fixture",
      packageManager: overrides.packageManager ?? "pnpm@10.26.0",
      dependencies,
    }),
  );
  writeFileSync(
    join(root, "stack.allow.json"),
    JSON.stringify({ dependencies: register, denySet: overrides.denySet ?? {} }),
  );
  writeFileSync(join(root, ".npmrc"), overrides.npmrc ?? NPMRC);

  const lock = overrides.lock === undefined ? `  ${BRAND}@2.4.0:\n` : overrides.lock;
  if (lock !== null) writeFileSync(join(root, "pnpm-lock.yaml"), lock);
  for (const name of overrides.extraLockfiles ?? []) writeFileSync(join(root, name), "{}");

  mkdirSync(join(root, "node_modules"), { recursive: true });
  return root;
}

const forCriterion = (errors: readonly string[], id: string): string[] =>
  errors.filter((error) => error.startsWith(id));

describe("TS-WEB-0017-A1: the framework is singular and every runtime dependency is justified", () => {
  it("passes a tree whose dependencies are all registered with a reason", () => {
    expect(checkStack(tree()).errors).toEqual([]);
  });

  it("fires when `next` is absent", () => {
    const result = checkStack(tree({ dependencies: { "lucide-react": "0.500.0", [BRAND]: "2.4.0" } }));
    expect(forCriterion(result.errors, "TS-WEB-0017-A1")).toContain(
      "TS-WEB-0017-A1 `next` is not a dependency",
    );
  });

  it("fires on a dependency the register does not carry", () => {
    const root = tree({
      dependencies: { next: "16.0.0", "lucide-react": "0.500.0", [BRAND]: "2.4.0", moment: "2.30.0" },
      register: {
        next: { reason: "the framework" },
        "lucide-react": { reason: "the icon set" },
        [BRAND]: { reason: "the tokens" },
      },
    });
    expect(forCriterion(checkStack(root).errors, "TS-WEB-0017-A1")).toEqual([
      "TS-WEB-0017-A1 dependency not in stack.allow.json: moment",
    ]);
  });

  it("fires on a register entry with an empty reason, and on one that is no dependency", () => {
    const root = tree({
      dependencies: { next: "16.0.0", "lucide-react": "0.500.0", [BRAND]: "2.4.0" },
      register: {
        next: { reason: "   " },
        "lucide-react": { reason: "the icon set" },
        [BRAND]: { reason: "the tokens" },
        "left-over": { reason: "removed last week" },
      },
    });
    expect(forCriterion(checkStack(root).errors, "TS-WEB-0017-A1")).toEqual([
      "TS-WEB-0017-A1 stack.allow.json entry has no reason: next",
      "TS-WEB-0017-A1 stack.allow.json registers a non-dependency: left-over",
    ]);
  });

  it("fires on a dependency the deny-set names, even when it is registered", () => {
    const root = tree({
      dependencies: { next: "16.0.0", "lucide-react": "0.500.0", [BRAND]: "2.4.0", lodash: "4.17.21" },
      denySet: { "already in the platform": ["lodash"] },
    });
    expect(forCriterion(checkStack(root).errors, "TS-WEB-0017-A1")).toEqual([
      "TS-WEB-0017-A1 deny-set dependency present: lodash",
    ]);
  });
});

describe("TS-WEB-0017-A2: one package manager, one lockfile, two mapped scopes", () => {
  it("fires on a second lockfile beside pnpm-lock.yaml", () => {
    const result = checkStack(tree({ extraLockfiles: ["package-lock.json", "yarn.lock"] }));
    expect(forCriterion(result.errors, "TS-WEB-0017-A2")).toEqual([
      "TS-WEB-0017-A2 a second lockfile exists: package-lock.json",
      "TS-WEB-0017-A2 a second lockfile exists: yarn.lock",
    ]);
  });

  it("fires when pnpm-lock.yaml is missing", () => {
    expect(forCriterion(checkStack(tree({ lock: null })).errors, "TS-WEB-0017-A2")).toEqual([
      "TS-WEB-0017-A2 pnpm-lock.yaml is missing",
    ]);
  });

  it("fires when `packageManager` does not pin an exact pnpm version", () => {
    expect(forCriterion(checkStack(tree({ packageManager: "npm@11.0.0" })).errors, "TS-WEB-0017-A2")).toEqual([
      "TS-WEB-0017-A2 packageManager does not pin pnpm: npm@11.0.0",
    ]);
    expect(forCriterion(checkStack(tree({ packageManager: "pnpm@10" })).errors, "TS-WEB-0017-A2")).toHaveLength(1);
  });

  it("fires per unmapped scope — the method registry is its own rule (DEC-0085)", () => {
    const onlyHub = checkStack(
      tree({ npmrc: "@schafe-vorm-fenster:registry=https://npm.pkg.github.com\n" }),
    );
    expect(forCriterion(onlyHub.errors, "TS-WEB-0017-A2")).toEqual([
      "TS-WEB-0017-A2 .npmrc does not map @leafcutter-strict to the method registry",
    ]);

    const none = checkStack(tree({ npmrc: "" }));
    expect(forCriterion(none.errors, "TS-WEB-0017-A2")).toHaveLength(2);
  });

  it("accepts the method registry with or without its trailing slash", () => {
    const withSlash = tree({
      npmrc: [
        "@schafe-vorm-fenster:registry=https://npm.pkg.github.com",
        "@leafcutter-strict:registry=https://packages.leafcutteros.ai/",
        "",
      ].join("\n"),
    });
    expect(forCriterion(checkStack(withSlash).errors, "TS-WEB-0017-A2")).toEqual([]);
  });
});

describe("TS-WEB-0017-A7: the brand package is pinned exact and the lockfile agrees", () => {
  it("fires on a range instead of an exact version", () => {
    const root = tree({
      dependencies: { next: "16.0.0", "lucide-react": "0.500.0", [BRAND]: "^2.4.0" },
    });
    expect(forCriterion(checkStack(root).errors, "TS-WEB-0017-A7")).toEqual([
      `TS-WEB-0017-A7 ${BRAND} is not pinned exact: ^2.4.0`,
    ]);
  });

  it("fires when the lockfile resolves a different version than package.json pins", () => {
    const root = tree({ lock: `  ${BRAND}@2.3.9:\n` });
    expect(forCriterion(checkStack(root).errors, "TS-WEB-0017-A7")).toEqual([
      `TS-WEB-0017-A7 pnpm-lock.yaml does not resolve ${BRAND}@2.4.0`,
    ]);
  });

  it("fires when the brand package is not a runtime dependency at all", () => {
    const root = tree({ dependencies: { next: "16.0.0", "lucide-react": "0.500.0" } });
    expect(forCriterion(checkStack(root).errors, "TS-WEB-0017-A7")).toEqual([
      `TS-WEB-0017-A7 ${BRAND} is not a runtime dependency`,
    ]);
  });

  it("reports the missing lockfile once, as A2's finding, and does not also blame A7", () => {
    const result = checkStack(tree({ lock: null }));
    expect(forCriterion(result.errors, "TS-WEB-0017-A7")).toEqual([]);
  });
});

describe("TS-WEB-0017-A17: exactly one icon dependency, and it is Lucide", () => {
  it("fires on a second icon family", () => {
    const root = tree({
      dependencies: {
        next: "16.0.0",
        "lucide-react": "0.500.0",
        "react-icons": "5.0.0",
        [BRAND]: "2.4.0",
      },
    });
    expect(forCriterion(checkStack(root).errors, "TS-WEB-0017-A17")).toEqual([
      "TS-WEB-0017-A17 expected exactly one icon dependency (lucide-react), found: lucide-react, react-icons",
    ]);
  });

  it("fires when the one icon family is not Lucide", () => {
    const root = tree({
      dependencies: { next: "16.0.0", "@heroicons/react": "2.2.0", [BRAND]: "2.4.0" },
    });
    expect(forCriterion(checkStack(root).errors, "TS-WEB-0017-A17")).toEqual([
      "TS-WEB-0017-A17 expected exactly one icon dependency (lucide-react), found: @heroicons/react",
    ]);
  });

  it("fires when no icon dependency is present at all", () => {
    const root = tree({ dependencies: { next: "16.0.0", [BRAND]: "2.4.0" } });
    expect(forCriterion(checkStack(root).errors, "TS-WEB-0017-A17")).toEqual([
      "TS-WEB-0017-A17 expected exactly one icon dependency (lucide-react), found: none",
    ]);
  });
});

describe("TS-WEB-0017-A2: every message names the criterion it belongs to", () => {
  it("prefixes each error with a full acceptance-criterion id, never a bare A-number", () => {
    const result = checkStack(
      tree({
        dependencies: { "react-icons": "5.0.0" },
        register: {},
        npmrc: "",
        lock: null,
        packageManager: "npm@11.0.0",
        extraLockfiles: ["yarn.lock"],
      }),
    );
    expect(result.errors.length).toBeGreaterThan(5);
    for (const error of result.errors) {
      expect(error).toMatch(/^TS-WEB-0017-A(1|2|7|17) /);
    }
  });

  it("counts what it read, so the report line is measured and not guessed", () => {
    const result = checkStack(tree({ denySet: { "already in the platform": ["lodash", "moment"] } }));
    expect(result.dependencyCount).toBe(3);
    expect(result.registerCount).toBe(3);
    expect(result.denySetCount).toBe(2);
  });
});
