/**
 * BFF boundary guard — the static half of TS-WEB-0017 D4 (F-1-3, round 1).
 *
 *  A10 Every `app/**\/route.ts` handler exports `GET` and nothing else — no
 *      `POST`/`PUT`/`PATCH`/`DELETE`/`OPTIONS`/`HEAD` handler anywhere in the
 *      route tree. "Read-only by construction": a write handler in the
 *      website's route tree means the website took over a write the app
 *      owns (TS-WEB-0017 D4).
 *  A11 No hard-coded app URL (TS-WEB-0017 D4), in the form DEC-0177 gives it:
 *      the app has no domain of its own, so the retired app hostname
 *      (`app.schafe-vorm-fenster.de`) occurs in the **code** of no authored
 *      module — a comment may still name it as history — and the literal every
 *      link "to the app" uses (`APP_URL`) occurs in exactly one module, the
 *      handover module `src/lib/live/app-handover.ts`. A second copy of the
 *      URL is how a link drifts from the decision.
 *
 * Both rules hold today only because the features that would violate them
 * don't exist yet (no `app/api/*` route, no handover module) — F-1-3 is
 * exactly the demand to make that a machine check instead of a fact nobody
 * is watching.
 *
 * A11 exclusions, narrow and documented rather than a general carve-out:
 *   - `app/dev/**` — the component gallery's page is explicitly a
 *     non-production tool (`app/dev/components/page.tsx`: "This is not a
 *     production route... no page of the site links to it"). The gallery's
 *     own source (`src/components/gallery.tsx`) is no longer excepted: it
 *     imports `APP_URL` like everybody else.
 *   - test files — asserting an expected literal is not assembling a link.
 *
 * Exit code of `main()`: number of errors (0 = green).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const EXCLUDED_DIR_NAMES = new Set(["node_modules", ".next", ".vercel", ".git"]);

/** The app subdomain DEC-0035 planned and DEC-0177 retired: it has no DNS record. */
const APP_HOSTNAME = "app.schafe-vorm-fenster.de";

/** The literal of `APP_URL` (DEC-0177) — the one link "to the app". */
const APP_URL_LITERAL = "schafe-vorm-fenster.de/schlatkow.2838887";

/** The one module `APP_URL_LITERAL` may occur in. */
const APP_URL_HOME = join("src", "lib", "live", "app-handover.ts");

/** A11: files a hard-coded app literal is not held against. */
const APP_HOSTNAME_EXCEPTIONS = [join("app", "dev")];

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
  /** Modules whose code (comments removed) names the retired app hostname. */
  readonly occurrences: string[];
  /** Modules that carry `APP_URL`'s literal. */
  readonly appUrlModules: string[];
}

/**
 * The source with its comments blanked: block comments, and line comments that
 * open a line. A `//` inside a string (`"https://…"`) is code and stays.
 */
function codeOf(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/^\s*\/\/.*$/gm, "");
}

/** A11: no code names the retired app hostname; `APP_URL`'s literal lives in one module. */
export function checkAppHostname(root: string): AppHostnameCheckResult {
  const sourceFiles = [...walk(join(root, "app")), ...walk(join(root, "src"))].filter(
    (f) => /\.(ts|tsx)$/.test(f),
  );

  const occurrences: string[] = [];
  const appUrlModules: string[] = [];
  for (const file of sourceFiles) {
    const rel = relative(root, file);
    if (isTestFile(rel)) continue;
    if (APP_HOSTNAME_EXCEPTIONS.some((prefix) => rel.startsWith(prefix))) continue;
    const code = codeOf(readFileSync(file, "utf8"));
    if (code.includes(APP_HOSTNAME)) occurrences.push(rel);
    if (code.includes(APP_URL_LITERAL)) appUrlModules.push(rel);
  }

  const errors: string[] = [];
  if (occurrences.length > 0)
    errors.push(
      `A11 the retired app hostname ${APP_HOSTNAME} has no DNS record and occurs in code (DEC-0177): ${occurrences.join(", ")} — link to APP_URL from src/lib/live/app-handover.ts`,
    );
  const strays = appUrlModules.filter((rel) => rel !== APP_URL_HOME);
  if (strays.length > 0)
    errors.push(`A11 APP_URL's literal occurs outside ${APP_URL_HOME}: ${strays.join(", ")} — import APP_URL instead`);

  return { errors, occurrences, appUrlModules };
}

function main() {
  const routes = checkApiRoutes(ROOT);
  const hostname = checkAppHostname(ROOT);
  const errors = [...routes.errors, ...hostname.errors];

  console.log(
    `api-routes check: ${routes.routeFileCount} route.ts handler(s) · retired app hostname in ${hostname.occurrences.length} module(s) · APP_URL in ${hostname.appUrlModules.join(", ") || "none"}`,
  );
  for (const message of errors) console.error(`  ERROR TS-017-${message}`);
  console.log(errors.length ? `${errors.length} error(s)` : "no errors");
  process.exit(errors.length);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();
