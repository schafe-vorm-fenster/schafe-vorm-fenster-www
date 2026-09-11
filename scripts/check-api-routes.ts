/**
 * BFF boundary guard — the static half of TS-017 D4 (F-1-3, round 1).
 *
 *  A10 Every `app/**\/route.ts` handler exports `GET` and nothing else — no
 *      `POST`/`PUT`/`PATCH`/`DELETE`/`OPTIONS`/`HEAD` handler anywhere in the
 *      route tree. "Read-only by construction": a write handler in the
 *      website's route tree means the website took over a write the app
 *      owns (TS-017 D4).
 *  A11 The app hostname (`app.schafe-vorm-fenster.de`) occurs in at most one
 *      authored module — the DEC-029 handover builder, or, until that is
 *      built, `src/lib/routes/routes.ts`'s `APP_ORIGIN` constant — and
 *      nowhere else: "no hard-coded app URL" (TS-017 D4).
 *
 * Both rules hold today only because the features that would violate them
 * don't exist yet (no `app/api/*` route, no handover module) — F-1-3 is
 * exactly the demand to make that a machine check instead of a fact nobody
 * is watching.
 *
 * A11 exclusions, narrow and documented rather than a general carve-out:
 *   - `app/dev/**` and `src/components/gallery.tsx` — the component gallery
 *     is explicitly a non-production tool (`app/dev/components/page.tsx`:
 *     "This is not a production route... no page of the site links to it")
 *     and its demo props are not "a link assembled" in the D4 sense. The
 *     gallery's source lives in `src/components/` (only ever imported by
 *     the `app/dev/**` page), so both paths are named.
 *   - `src/lib/security/csp.ts` — TS-014 D1 independently and deliberately
 *     names `app.schafe-vorm-fenster.de` in the CSP allowlist's single typed
 *     structure (TS-014 D7), a different determination for a different
 *     reason (a reserved policy slot, not a navigable link). That file is
 *     owned by the developer currently working TS-014 in this round; TS-017
 *     D4 governs link construction, not CSP directives.
 *   - test files — asserting an expected literal is not assembling a link.
 *
 * Exit code of `main()`: number of errors (0 = green).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const EXCLUDED_DIR_NAMES = new Set(["node_modules", ".next", ".vercel", ".git"]);

/** The four-segment public-facing app subdomain named in TS-014 D1 / TS-017 D4. */
const APP_HOSTNAME = "app.schafe-vorm-fenster.de";

/** A11: files a hard-coded app-hostname literal is not held against. */
const APP_HOSTNAME_EXCEPTIONS = [
  join("app", "dev"),
  join("src", "components", "gallery.tsx"),
  join("src", "lib", "security", "csp.ts"),
];

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];

function walk(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((name) => {
    if (EXCLUDED_DIR_NAMES.has(name)) return [];
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function isTestFile(path: string): boolean {
  return /\.(test|integration\.test)\.tsx?$/.test(path);
}

/**
 * Which HTTP-method handlers a route module exports, read off its source
 * text. Matches the function, const-arrow and named-re-export
 * (`export { GET, POST } from "./handlers"`) handler styles; deliberately
 * ignores other named exports (`dynamic`, `revalidate`, `runtime`, …) —
 * Next.js route segment config, not a write handler.
 */
function exportedMethods(source: string): HttpMethod[] {
  const found = new Set<HttpMethod>();
  for (const method of HTTP_METHODS) {
    const functionStyle = new RegExp(`export\\s+(async\\s+)?function\\s+${method}\\b`);
    const constStyle = new RegExp(`export\\s+const\\s+${method}\\s*[:=]`);
    if (functionStyle.test(source) || constStyle.test(source)) {
      found.add(method);
      continue;
    }
    // `export { GET, POST } from "./handlers"` or `export { GET, POST };` —
    // a named-export list, with or without a re-export source.
    for (const match of source.matchAll(/export\s*\{([^}]*)\}/g)) {
      const names = (match[1] ?? "").split(",").map((n) => n.trim().split(/\s+as\s+/).pop());
      if (names.includes(method)) {
        found.add(method);
        break;
      }
    }
  }
  return [...found];
}

export interface ApiRoutesCheckResult {
  readonly errors: string[];
  readonly routeFileCount: number;
}

/** A10: every `app/**\/route.ts` exports `GET` and nothing else. */
export function checkApiRoutes(root: string): ApiRoutesCheckResult {
  const errors: string[] = [];
  const routeFiles = walk(join(root, "app")).filter(
    (f) => basename(f) === "route.ts",
  );

  for (const file of routeFiles) {
    const rel = relative(root, file);
    const methods = exportedMethods(readFileSync(file, "utf8"));
    if (!methods.includes("GET"))
      errors.push(`A10 ${rel}: exports no GET handler`);
    const forbidden = methods.filter((m) => m !== "GET");
    for (const method of forbidden)
      errors.push(`A10 ${rel}: exports ${method} — website route handlers are GET-only`);
  }

  return { errors, routeFileCount: routeFiles.length };
}

export interface AppHostnameCheckResult {
  readonly errors: string[];
  readonly occurrences: string[];
}

/** A11: the app hostname occurs in at most one authored module. */
export function checkAppHostname(root: string): AppHostnameCheckResult {
  const sourceFiles = [...walk(join(root, "app")), ...walk(join(root, "src"))].filter(
    (f) => /\.(ts|tsx)$/.test(f),
  );

  const occurrences: string[] = [];
  for (const file of sourceFiles) {
    const rel = relative(root, file);
    if (isTestFile(rel)) continue;
    if (APP_HOSTNAME_EXCEPTIONS.some((prefix) => rel.startsWith(prefix))) continue;
    const source = readFileSync(file, "utf8");
    if (source.includes(APP_HOSTNAME)) occurrences.push(rel);
  }

  const errors =
    occurrences.length > 1
      ? [
          `A11 the app hostname occurs in ${occurrences.length} modules, not one: ${occurrences.join(", ")}`,
        ]
      : [];

  return { errors, occurrences };
}

function main() {
  const routes = checkApiRoutes(ROOT);
  const hostname = checkAppHostname(ROOT);
  const errors = [...routes.errors, ...hostname.errors];

  console.log(
    `api-routes check: ${routes.routeFileCount} route.ts handler(s) · app hostname in ${hostname.occurrences.length} module(s)`,
  );
  for (const message of errors) console.error(`  ERROR TS-017-${message}`);
  console.log(errors.length ? `${errors.length} error(s)` : "no errors");
  process.exit(errors.length);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();
