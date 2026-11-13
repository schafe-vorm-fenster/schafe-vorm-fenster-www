/**
 * Stack guard — the static half of TS-WEB-0017 D1, D5 and D7.
 *
 *  TS-WEB-0017-A1  `next` present · no dependency from the deny-set · every
 *      `dependencies` entry has a reason line in stack.allow.json, and every
 *      register entry exists as a dependency.
 *  TS-WEB-0017-A2  `pnpm-lock.yaml` is the only lockfile · `packageManager`
 *      pins pnpm · `.npmrc` maps the `@schafe-vorm-fenster` scope to the
 *      private registry and the `@leafcutter-strict` scope to the method
 *      registry (DEC-0085).
 *  TS-WEB-0017-A7  The brand package is pinned to an exact version, and the
 *      lockfile resolves that same version.
 *  TS-WEB-0017-A17 Exactly one icon dependency. Its second clause — "every
 *      icon name used resolves to a Lucide export" — is carried by the type
 *      system rather than by this script: `src/components/icon/icon.tsx` is
 *      the only place a glyph enters, it imports each one by name from
 *      `lucide-react`, and `pnpm typecheck` fails on a name that package does
 *      not export. What a dependency list cannot see is therefore checked
 *      where it is visible, and this script closes the clause it can.
 *
 * ── Why the full identifiers ──────────────────────────────────────────────
 *
 * Until 2026-09-26 every message here was prefixed with a bare `A1`/`A2` and
 * the report line pasted `TS-017-` in front of it, which is not an identifier
 * this repository defines: `check:coverage` could not attribute the meter to a
 * criterion, so four criteria this script actually guards read as MISSING
 * (`state/coverage.md`). A `static` criterion is closed by a
 * `scripts/check-*.ts` in the `check` chain that **names it** — the meter has
 * no test title to carry the link, so the identifier in its failure message
 * *is* the link (`scripts/check-coverage.ts`, verdict METERED). The constants
 * below are that link, and they are also what a reader sees when the check
 * fails.
 *
 * `checkStack(root)` is pure — no console output, no `process.exit` — so
 * `scripts/check-stack.test.ts` can feed it a fixture tree of the same shape,
 * which is how `check-brand.ts` is built too.
 *
 * Exit code of `main()`: number of errors (0 = green).
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The four criteria this meter is the instrument for, spelled out once. */
const A1 = "TS-WEB-0017-A1";
const A2 = "TS-WEB-0017-A2";
const A7 = "TS-WEB-0017-A7";
const A17 = "TS-WEB-0017-A17";

/** The brand package D3 pins (TS-WEB-0017-A7). */
export const BRAND = "@schafe-vorm-fenster/brand-design";

/** The one icon family the design system allows, and the families it does not. */
const ICON_PACKAGES = [
  "lucide-react",
  "lucide",
  "react-icons",
  "@heroicons/react",
  "@tabler/icons-react",
  "react-feather",
  "@fortawesome/react-fontawesome",
  "phosphor-react",
  "@phosphor-icons/react",
];
const ALLOWED_ICON_PACKAGE = "lucide-react";

/** The lockfiles that must not stand beside `pnpm-lock.yaml` (TS-WEB-0017-A2). */
const FOREIGN_LOCKFILES = ["package-lock.json", "yarn.lock", "bun.lockb"];

interface PackageJson {
  packageManager?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface Register {
  dependencies: Record<string, { reason: string; decision?: string }>;
  denySet: Record<string, string[]>;
}

export interface StackCheckResult {
  readonly errors: string[];
  readonly dependencyCount: number;
  readonly registerCount: number;
  readonly denySetCount: number;
}

/**
 * Runs the four checks rooted at `root` (the repository root in production; a
 * fixture directory of the same shape in tests) and returns every violation
 * found, each prefixed with the full identifier of the criterion it belongs
 * to.
 */
export function checkStack(root: string): StackCheckResult {
  const errors: string[] = [];
  const fail = (criterion: string, message: string) => errors.push(`${criterion} ${message}`);
  const read = (file: string) => readFileSync(join(root, file), "utf8");

  const pkg = JSON.parse(read("package.json")) as PackageJson;
  const register = JSON.parse(read("stack.allow.json")) as Register;
  const deps = pkg.dependencies ?? {};

  // ── A1: the framework is singular and every runtime dependency is justified ─

  if (!("next" in deps)) fail(A1, "`next` is not a dependency");

  const denied = new Set(Object.values(register.denySet ?? {}).flat());
  for (const name of Object.keys(deps)) {
    if (denied.has(name)) fail(A1, `deny-set dependency present: ${name}`);
  }

  const registered = Object.keys(register.dependencies ?? {});
  for (const name of Object.keys(deps)) {
    const entry = register.dependencies?.[name];
    if (!entry) fail(A1, `dependency not in stack.allow.json: ${name}`);
    else if (!entry.reason?.trim()) fail(A1, `stack.allow.json entry has no reason: ${name}`);
  }
  for (const name of registered) {
    if (!(name in deps)) fail(A1, `stack.allow.json registers a non-dependency: ${name}`);
  }

  // ── A2: one package manager, one lockfile, one registry ────────────────────

  for (const lockfile of FOREIGN_LOCKFILES) {
    if (existsSync(join(root, lockfile))) fail(A2, `a second lockfile exists: ${lockfile}`);
  }
  if (!existsSync(join(root, "pnpm-lock.yaml"))) fail(A2, "pnpm-lock.yaml is missing");
  if (!/^pnpm@\d+\.\d+\.\d+/.test(pkg.packageManager ?? ""))
    fail(A2, `packageManager does not pin pnpm: ${pkg.packageManager}`);

  const npmrc = existsSync(join(root, ".npmrc")) ? read(".npmrc") : "";
  if (!/^@schafe-vorm-fenster:registry=https:\/\/npm\.pkg\.github\.com$/m.test(npmrc))
    fail(A2, ".npmrc does not map @schafe-vorm-fenster to GitHub Packages");
  if (!/^@leafcutter-strict:registry=https:\/\/packages\.leafcutteros\.ai\/?$/m.test(npmrc))
    fail(A2, ".npmrc does not map @leafcutter-strict to the method registry");

  // ── A7: the brand package is pinned exact, and the lockfile agrees ─────────

  const brandRange = deps[BRAND];
  if (!brandRange) {
    fail(A7, `${BRAND} is not a runtime dependency`);
  } else if (!/^\d+\.\d+\.\d+$/.test(brandRange)) {
    fail(A7, `${BRAND} is not pinned exact: ${brandRange}`);
  } else if (!existsSync(join(root, "pnpm-lock.yaml"))) {
    // A2 already reported the missing lockfile; A7 has nothing to compare.
  } else {
    const lock = read("pnpm-lock.yaml");
    if (!lock.includes(`${BRAND}@${brandRange}`))
      fail(A7, `pnpm-lock.yaml does not resolve ${BRAND}@${brandRange}`);
  }

  // ── A17: exactly one icon dependency ──────────────────────────────────────

  const icons = Object.keys(deps).filter((name) => ICON_PACKAGES.includes(name));
  if (icons.length !== 1 || icons[0] !== ALLOWED_ICON_PACKAGE)
    fail(
      A17,
      `expected exactly one icon dependency (${ALLOWED_ICON_PACKAGE}), found: ${icons.join(", ") || "none"}`,
    );

  return {
    errors,
    dependencyCount: Object.keys(deps).length,
    registerCount: registered.length,
    denySetCount: denied.size,
  };
}

function main() {
  const { errors, dependencyCount, registerCount, denySetCount } = checkStack(ROOT);
  console.log(
    `stack check: ${dependencyCount} runtime dependencies · ${registerCount} register entries · ${denySetCount} deny-set entries`,
  );
  for (const message of errors) console.error(`  ERROR ${message}`);
  console.log(errors.length ? `${errors.length} error(s)` : "no errors");
  process.exit(errors.length);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();
