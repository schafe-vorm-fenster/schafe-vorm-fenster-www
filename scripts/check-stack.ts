/**
 * Stack guard — the static half of TS-017 D1, D5 and D7.
 *
 *  A1  `next` present · no dependency from the deny-set · every `dependencies`
 *      entry has a reason line in stack.allow.json, and every register entry
 *      exists as a dependency.
 *  A2  `pnpm-lock.yaml` is the only lockfile · `packageManager` pins pnpm ·
 *      `.npmrc` maps the `@schafe-vorm-fenster` scope to the private registry.
 *  A7  The brand package is pinned to an exact version, and the lockfile
 *      resolves that same version.
 *  A17 Exactly one icon dependency.
 *
 * Exit code: number of errors (0 = green).
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors: string[] = [];
const fail = (criterion: string, message: string) =>
  errors.push(`${criterion} ${message}`);

const read = (file: string) => readFileSync(join(ROOT, file), "utf8");

interface PackageJson {
  packageManager?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface Register {
  dependencies: Record<string, { reason: string; decision?: string }>;
  denySet: Record<string, string[]>;
}

const pkg = JSON.parse(read("package.json")) as PackageJson;
const register = JSON.parse(read("stack.allow.json")) as Register;
const deps = pkg.dependencies ?? {};

// ── A1: the framework is singular and every runtime dependency is justified ──

if (!("next" in deps)) fail("A1", "`next` is not a dependency");

const denied = new Set(Object.values(register.denySet ?? {}).flat());
for (const name of Object.keys(deps)) {
  if (denied.has(name)) fail("A1", `deny-set dependency present: ${name}`);
}

const registered = Object.keys(register.dependencies ?? {});
for (const name of Object.keys(deps)) {
  const entry = register.dependencies?.[name];
  if (!entry) fail("A1", `dependency not in stack.allow.json: ${name}`);
  else if (!entry.reason?.trim())
    fail("A1", `stack.allow.json entry has no reason: ${name}`);
}
for (const name of registered) {
  if (!(name in deps))
    fail("A1", `stack.allow.json registers a non-dependency: ${name}`);
}

// ── A2: one package manager, one lockfile, one registry ─────────────────────

for (const lockfile of ["package-lock.json", "yarn.lock", "bun.lockb"]) {
  if (existsSync(join(ROOT, lockfile)))
    fail("A2", `a second lockfile exists: ${lockfile}`);
}
if (!existsSync(join(ROOT, "pnpm-lock.yaml")))
  fail("A2", "pnpm-lock.yaml is missing");
if (!/^pnpm@\d+\.\d+\.\d+/.test(pkg.packageManager ?? ""))
  fail("A2", `packageManager does not pin pnpm: ${pkg.packageManager}`);

const npmrc = existsSync(join(ROOT, ".npmrc")) ? read(".npmrc") : "";
if (!/^@schafe-vorm-fenster:registry=https:\/\/npm\.pkg\.github\.com$/m.test(npmrc))
  fail("A2", ".npmrc does not map @schafe-vorm-fenster to GitHub Packages");

// ── A7: the brand package is pinned exact, and the lockfile agrees ──────────

const BRAND = "@schafe-vorm-fenster/brand-design";
const brandRange = deps[BRAND];
if (!brandRange) {
  fail("A7", `${BRAND} is not a runtime dependency`);
} else if (!/^\d+\.\d+\.\d+$/.test(brandRange)) {
  fail("A7", `${BRAND} is not pinned exact: ${brandRange}`);
} else {
  const lock = read("pnpm-lock.yaml");
  if (!lock.includes(`${BRAND}@${brandRange}`))
    fail("A7", `pnpm-lock.yaml does not resolve ${BRAND}@${brandRange}`);
}

// ── A17: exactly one icon dependency ────────────────────────────────────────

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
const icons = Object.keys(deps).filter((name) => ICON_PACKAGES.includes(name));
if (icons.length !== 1 || icons[0] !== "lucide-react")
  fail("A17", `expected exactly one icon dependency (lucide-react), found: ${icons.join(", ") || "none"}`);

// ── Report ──────────────────────────────────────────────────────────────────

const depCount = Object.keys(deps).length;
console.log(
  `stack check: ${depCount} runtime dependencies · ${registered.length} register entries · ${denied.size} deny-set entries`,
);
for (const message of errors) console.error(`  ERROR TS-017-${message}`);
console.log(errors.length ? `${errors.length} error(s)` : "no errors");
process.exit(errors.length);
