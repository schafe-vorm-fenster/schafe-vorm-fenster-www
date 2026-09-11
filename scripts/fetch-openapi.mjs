/**
 * Fetch and pin the OpenAPI specification of every ecosystem service the
 * website consumes.
 *
 * Pattern adopted from the sibling services (see
 * `events-api/src/clients/<service>/fetch-openapi.mjs`) and from the
 * product's documented convention, which specs/contracts/api-contracts.md
 * registers as SRC-011: fetch, validate, store locally, commit.
 *
 * The stored `openapi.json` is the review anchor — an upstream change
 * shows up as a diff in a pull request instead of as a surprise at
 * runtime.
 *
 * Usage:  pnpm fetch:openapi            all services
 *         pnpm fetch:openapi geo-api    one service
 */

import { config as loadEnv } from "dotenv";
import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

/**
 * One row per service. `host` names the environment variable that carries
 * the base URL; `fallback` is the production host, so the script works on
 * a fresh checkout before any .env exists. `token` is optional — every
 * service currently publishes its specification unauthenticated.
 */
const SERVICES = [
  { dir: "events-api", host: "EVENTSAPI_HOST", fallback: "https://events.api.schafe-vorm-fenster.de", token: "EVENTSAPI_READ_TOKEN" },
  { dir: "geo-api", host: "GEOAPI_HOST", fallback: "https://geo.api-v2.schafe-vorm-fenster.de", token: "GEOAPI_READ_TOKEN" },
  { dir: "calendar-api", host: "CALENDARAPI_HOST", fallback: "https://calendar.api.schafe-vorm-fenster.de", token: "CALENDARAPI_READ_TOKEN" },
  { dir: "classification-api", host: "CLASSIFICATIONAPI_HOST", fallback: "https://classify.api.schafe-vorm-fenster.de", token: "CLASSIFICATIONAPI_READ_TOKEN" },
  { dir: "assets-api", host: "ASSETSAPI_HOST", fallback: "https://assets.api.schafe-vorm-fenster.de", token: "ASSETSAPI_READ_TOKEN" },
  { dir: "envoy-api", host: "ENVOYAPI_HOST", fallback: "https://envoy.api.schafe-vorm-fenster.de", token: "ENVOYAPI_READ_TOKEN" },
];

const loadEnvironment = () => {
  for (const name of [".env", ".env.local", ".env.preview", ".env.production"]) {
    const file = path.join(rootDir, name);
    if (existsSync(file)) loadEnv({ path: file, override: true });
  }
};

/** Minimal shape check — enough to catch an error page served as 200. */
const validate = (spec, dir) => {
  const problems = [];
  const version = spec.openapi ?? spec.swagger;
  if (!version) problems.push("no `openapi` or `swagger` version field");
  else if (!String(version).startsWith("3.")) problems.push(`expected OpenAPI 3.x, got ${version}`);
  if (!spec.info?.title) problems.push("no `info.title`");
  if (!spec.paths || Object.keys(spec.paths).length === 0) problems.push("no `paths`");
  if (problems.length) throw new Error(`${dir}: invalid specification — ${problems.join("; ")}`);
  return { title: spec.info.title, version: spec.info.version ?? "—", paths: Object.keys(spec.paths).length };
};

const fetchOne = async ({ dir, host, fallback, token }) => {
  const base = process.env[host] || fallback;
  const url = new URL("/api/openapi", base).toString();
  const headers = { Accept: "application/json" };
  const secret = token ? process.env[token] : undefined;
  if (secret) headers["Sheep-Token"] = secret;

  const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) {
    const body = await response.text().catch(() => "<unreadable>");
    throw new Error(`${dir}: ${response.status} ${response.statusText} from ${url} — ${body.slice(0, 200)}`);
  }

  const spec = await response.json();
  const summary = validate(spec, dir);

  const outDir = path.join(rootDir, "src", "clients", dir);
  mkdirSync(outDir, { recursive: true });
  await writeFile(path.join(outDir, "openapi.json"), `${JSON.stringify(spec, null, 2)}\n`, "utf8");

  return { dir, base, ...summary };
};

const main = async () => {
  loadEnvironment();
  const only = process.argv.slice(2);
  const selected = only.length ? SERVICES.filter((s) => only.includes(s.dir)) : SERVICES;

  if (!selected.length) {
    console.error(`Unknown service. Known: ${SERVICES.map((s) => s.dir).join(", ")}`);
    process.exit(1);
  }

  const results = await Promise.allSettled(selected.map(fetchOne));
  let failed = 0;

  for (const [i, result] of results.entries()) {
    if (result.status === "fulfilled") {
      const { dir, title, version, paths } = result.value;
      console.log(`  ok    ${dir.padEnd(20)} ${title} v${version} · ${paths} paths`);
    } else {
      failed += 1;
      console.error(`  FAIL  ${selected[i].dir.padEnd(20)} ${result.reason.message}`);
    }
  }

  console.log(`\n${results.length - failed}/${results.length} specifications pinned.`);
  process.exit(failed ? 1 : 0);
};

await main();
