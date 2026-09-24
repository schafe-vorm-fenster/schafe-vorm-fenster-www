/**
 * Spec consistency checker
 *
 * Deterministic validation of specs/ — format, ID registries, reference
 * integrity, and the coverage rules of the tactical layer. Everything an
 * LLM would otherwise be trusted to eyeball.
 *
 * Checks
 * ──────
 *  E1  Frontmatter present and well-formed on governed artefacts
 *  E2  Requirement IDs ((FUN|NFR|CON)-WEB-####) unique across all files
 *  E3  Requirement rows carry 4 cells: id · statement · source · S0–S3
 *  E4  Sufficiency S3 requires a DEC-#### or ADR-### token in the row
 *  E5  Every referenced ID (FUN/NFR/CON-*, TS-*, DEC-*, Q-*, SRC-*, GL-*) exists
 *  E6  Tactical `implements:` ↔ Coverage table match bidirectionally
 *  E7  decisions/README.md index ↔ decision files match both ways
 *  E8  Acceptance criteria: unique ID, valid verification level
 *  E9  Coverage tables reference only existing acceptance criteria
 *  E10 Tests/features reference only IDs that exist
 *  E11 Requirement files carry a status from the requirement-shell contract
 *  E12 Tactical specs carry a `kind` and a status from the tactical contract
 *  E13 Source inventory rows carry a trust level from the source contract
 *  W1  (warning) requirements not covered by any tactical spec
 *  W2  (warning) covered requirements discharged by no acceptance criterion
 *  W3  (warning) acceptance criteria no test references
 *
 * Exit code: number of errors (0 = green). Warnings never fail the run.
 *
 * What this script delegates (DEC-0085)
 * ────────────────────────────────────
 * STRICT is a versioned dependency of this repository, so every controlled
 * vocabulary this script used to repeat is now read out of the installed
 * `@leafcutter-strict/library-schemas` contracts at startup: the evidence
 * sufficiency levels (E3/E4), the requirement and tactical status sets
 * (E11/E12), the four tactical kinds (E12) and the source trust levels
 * (E13). Change the package version and these checks follow it.
 *
 * The identifier shapes are the package's too (DEC-0086)
 * ──────────────────────────────────────────────────────
 * `method-identifier-and-locator-schema` composes an identifier as
 * `<TYPE>-<DOMAIN>-<NNNN>`, and `library-schemas` fixes the type tokens per
 * class: `(FUN|NFR|CON|BUS)-[A-Z]{2,5}-\d{4}` for a requirement,
 * `TS-[A-Z]{2,5}-\d{4}` for a tactical specification, `SRC-\d{4}` for a
 * source. Those three patterns are read out of the installed schemas rather
 * than spelled here — see `idPattern()` for the one repair they need — so a
 * narrowing upstream fails this check instead of passing unnoticed.
 *
 * What stays local, and why
 * ─────────────────────────
 *  - `DEC-<NNNN>`, `Q-<NNNN>` and `GL-<NNNN>`. STRICT's decision record is an
 *    `SDR-<yyyy>-<mmdd>-<nnnn>` taken at a numbered decision point, its
 *    nearest thing to an open question is a `DEM-<nnnn>` demand, and it
 *    defines no glossary identifier at all. None of the three is this
 *    repository's artefact, so the type token stays and only the composition
 *    and the four-digit width are the method's. Owed in DEC-0085 §6.
 *  - Statement grammar and the fit-criterion form. The requirement rows are
 *    shall-form prose, not the per-class slots of `method-statement-grammar`;
 *    nothing deterministic can be checked against them yet.
 *  - The chain. STRICT links requirement → need → goal; this repository links
 *    requirement → source → decision → question and requirement → tactical
 *    spec → acceptance criterion → test. E5/E6/E9/E10 and W1–W3 check the
 *    chain this repository actually has.
 *  - The locator form. `method-identifier-and-locator-schema` wants
 *    `<file>#L102` plus an excerpt; the rows carry source ids.
 * Each of those is recorded as owed in DEC-0085; the identifier row of its
 * §6 now points at DEC-0086, which closed it.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPECS_DIR = join(__dirname, "..", "specs");

// ── The vocabularies STRICT owns ─────────────────────────────────────────
// Read from the installed contracts, never copied. `library-schemas` ships
// the JSON Schemas but does not export them as subpaths, so the directory is
// resolved off an entry point the package does export.

const SCHEMA_DIR = join(
  dirname(createRequire(import.meta.url).resolve("@leafcutter-strict/library-schemas/pack.mjs")),
  "contracts",
  "schemas",
);

type JsonSchema = { properties?: Record<string, JsonSchema>; items?: JsonSchema; enum?: string[] };

function contract(name: string): JsonSchema {
  return JSON.parse(readFileSync(join(SCHEMA_DIR, `${name}.schema.json`), "utf8")) as JsonSchema;
}

/** Walk a dotted path of `properties`/`items` hops and return the enum it ends on. */
function vocabulary(schema: JsonSchema, path: string): Set<string> {
  let node: JsonSchema | undefined = schema;
  for (const step of path.split(".")) {
    node = step === "[]" ? node?.items : node?.properties?.[step];
  }
  const values = node?.enum;
  if (!values?.length) throw new Error(`library-schemas: no enum at ${path}`);
  return new Set(values);
}

const requirementShell = contract("requirement-shell");
const tacticalSpecification = contract("tactical-specification");
const sourceInventory = contract("source-inventory");

const SUFFICIENCY = vocabulary(requirementShell, "evidence_sufficiency");
const REQUIREMENT_STATUS = vocabulary(requirementShell, "status");
const TACTICAL_STATUS = vocabulary(tacticalSpecification, "status");
const TACTICAL_KIND = vocabulary(tacticalSpecification, "kind");
const SOURCE_TRUST = vocabulary(sourceInventory, "sources.[].trust");

/**
 * The identifier pattern a contract declares (DEC-0086).
 *
 * `@leafcutter-strict/library-schemas@0.4.1` ships every `pattern` with its
 * backslashes doubled — the JSON holds `\\\\d`, so `JSON.parse` yields `\\d`,
 * a literal backslash followed by `d`, and the expression matches nothing.
 * DEC-0085 recorded the bug; collapsing each doubled backslash is the
 * deterministic repair, and it is done here rather than by copying the regex,
 * so the tokens and the width stay the package's. Remove this when upstream
 * fixes the escaping — the call sites do not change.
 */
function idPattern(schema: JsonSchema, path: string): RegExp {
  let node: JsonSchema | undefined = schema;
  for (const step of path.split(".")) {
    node = step === "[]" ? node?.items : node?.properties?.[step];
  }
  const declared = (node as { pattern?: string } | undefined)?.pattern;
  if (!declared) throw new Error(`library-schemas: no pattern at ${path}`);
  return new RegExp(declared.replace(/\\\\/g, "\\"));
}

/** An anchored `^…$` pattern as an unanchored, group-free fragment. */
const bare = (re: RegExp) =>
  `(?:${re.source.replace(/^\^/, "").replace(/\$$/, "").replace(/\((?!\?)/g, "(?:")})`;

/**
 * The same pattern as a scanner over prose. Word-bounded on both sides, so
 * `TS-WEB-0019` never matches inside `TS-WEB-0019-A6` and `DEC-0008` never
 * inside `DEC-0085`.
 */
const scanner = (anchored: RegExp, flags = "g") =>
  new RegExp(`(?<![A-Za-z0-9-])${bare(anchored)}(?![0-9A-Za-z-])`, flags);

const REQUIREMENT_ID = idPattern(requirementShell, "id");
const TACTICAL_ID = idPattern(tacticalSpecification, "id");
const SOURCE_ID = idPattern(sourceInventory, "sources.[].id");

/** Local families: the method defines no identifier for any of the three. */
const DECISION_ID = /^DEC-\d{4}$/;
const QUESTION_ID = /^Q-\d{4}$/;
const GLOSSARY_ID = /^GL-\d{4}$/;
/** An acceptance criterion carries its spec's id; the contract leaves the id free. */
const ACCEPTANCE_ID = new RegExp(`${TACTICAL_ID.source.replace(/\$$/, "")}-A\\d+$`);

const list = (set: Set<string>) => [...set].join(" | ");

// ── File collection ──────────────────────────────────────────────────────

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(SPECS_DIR).filter((f) => f.endsWith(".md"));
const rel = (f: string) => relative(join(SPECS_DIR, ".."), f);

interface Doc {
  file: string;
  frontmatter: Record<string, unknown> | null;
  body: string;
  raw: string;
}

function parseDoc(file: string): Doc {
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { file, frontmatter: null, body: raw, raw };
  let frontmatter: Record<string, unknown> | null = null;
  try {
    frontmatter = yaml.load(m[1]) as Record<string, unknown>;
  } catch {
    /* reported as E1 below */
  }
  return { file, frontmatter, body: raw.slice(m[0].length), raw };
}

const docs = files.map(parseDoc);

const errors: string[] = [];
const warnings: string[] = [];
const err = (f: string, msg: string) => errors.push(`${rel(f)}: ${msg}`);

// ── E1: frontmatter on governed artefact types ───────────────────────────

const NEEDS_FRONTMATTER = [
  /\/requirements\/.+\.req\.md$/,
  /\/tactical\/.+\.tactical\.md$/,
  /\/decisions\/DEC-\d{4}--.+\.md$/,
  /\/(ssd|sources|glossary|questions|traceability|contracts)\/(?!README).+\.md$/,
];

for (const d of docs) {
  if (NEEDS_FRONTMATTER.some((re) => re.test(d.file)) && !d.frontmatter) {
    err(d.file, "E1 missing or unparsable frontmatter");
  }
}

// ── Registries: where IDs are DEFINED ────────────────────────────────────

const reqDefs = new Map<string, string>(); // (FUN|NFR|CON)-WEB-#### → file
const decDefs = new Set<string>();
const qDefs = new Set<string>();
const srcDefs = new Set<string>();
const tsDefs = new Set<string>();
const glDefs = new Set<string>();

const REQ_ROW = new RegExp(`^\\|\\s*(${bare(REQUIREMENT_ID)})\\s*\\|(.+)$`);

for (const d of docs) {
  if (/\.req\.md$/.test(d.file)) {
    // E11: the status vocabulary belongs to the requirement-shell contract
    const status = d.frontmatter?.status;
    if (typeof status !== "string" || !REQUIREMENT_STATUS.has(status)) {
      err(d.file, `E11 status ${JSON.stringify(status ?? null)} is not one of ${list(REQUIREMENT_STATUS)}`);
    }
    for (const line of d.body.split("\n")) {
      const m = line.match(REQ_ROW);
      if (!m) continue;
      const id = m[1];
      if (reqDefs.has(id)) {
        err(d.file, `E2 duplicate definition of ${id} (also in ${rel(reqDefs.get(id)!)})`);
      } else {
        reqDefs.set(id, d.file);
      }
      // E3: cell shape — id | statement | source | sufficiency
      const cells = line.split("|").map((c) => c.trim()).filter((c, i, a) => !(c === "" && (i === 0 || i === a.length - 1)));
      if (cells.length < 4) {
        err(d.file, `E3 ${id}: expected at least 4 cells (… · source · sufficiency), got ${cells.length}`);
        continue;
      }
      const suff = cells[cells.length - 1];
      const source = cells[cells.length - 2];
      const statement = cells.slice(1, -2).join(" ");
      if (!SUFFICIENCY.has(suff))
        err(d.file, `E3 ${id}: sufficiency "${suff}" is not one of ${list(SUFFICIENCY)}`);
      if (!source) err(d.file, `E3 ${id}: empty source cell`);
      // E4: S3 needs a decision anchor in the row itself
      if (suff === "S3" && !/(DEC-\d{4}|ADR-\d{3}|ADR-00\d)/.test(statement + " " + source)) {
        err(d.file, `E4 ${id}: S3 without DEC/ADR reference in the row`);
      }
    }
  }
  if (/\/decisions\/DEC-\d{4}--/.test(d.file)) {
    const id = d.frontmatter?.id;
    if (typeof id === "string" && DECISION_ID.test(id)) {
      decDefs.add(id);
      // The file is named for the artefact it holds (DEC-0086).
      const fileId = rel(d.file).match(/\/(DEC-\d{4})--/)?.[1];
      if (!fileId) err(d.file, `E1 ${id}: file name does not carry the identifier (DEC-####--<slug>.md)`);
      else if (id !== fileId) err(d.file, `E1 frontmatter id ${id} does not match file name ${fileId}`);
    } else {
      err(d.file, "E1 decision without valid frontmatter id (DEC-####)");
    }
  }
  if (/open-questions\.md$/.test(d.file)) {
    for (const m of d.body.matchAll(new RegExp(`^\\|\\s*(${bare(QUESTION_ID)})\\s*\\|`, "gm"))) qDefs.add(m[1]);
  }
  if (/source-inventory\.md$/.test(d.file)) {
    for (const line of d.body.split("\n")) {
      const m = line.match(new RegExp(`^\\|\\s*(${bare(SOURCE_ID)})\\s*\\|`));
      if (!m) continue;
      srcDefs.add(m[1]);
      // E13: the trust vocabulary belongs to the source-inventory contract
      const trust = line.split("|").map((c) => c.trim())[4];
      if (!SOURCE_TRUST.has(trust ?? ""))
        err(d.file, `E13 ${m[1]}: trust "${trust ?? ""}" is not one of ${list(SOURCE_TRUST)}`);
    }
  }
  if (/\.tactical\.md$/.test(d.file)) {
    const id = d.frontmatter?.id;
    if (typeof id === "string" && TACTICAL_ID.test(id)) {
      tsDefs.add(id);
      // The file is named for the artefact it holds (DEC-0086).
      if (!rel(d.file).split("/").pop()!.startsWith(`${id}--`))
        err(d.file, `E1 ${id}: file name does not carry the identifier (${id}--<slug>.tactical.md)`);
    } else err(d.file, "E1 tactical spec without valid frontmatter id (TS-<DOMAIN>-####)");
    // E12: kind and status belong to the tactical-specification contract
    const kind = d.frontmatter?.kind;
    if (typeof kind !== "string" || !TACTICAL_KIND.has(kind)) {
      err(d.file, `E12 kind ${JSON.stringify(kind ?? null)} is not one of ${list(TACTICAL_KIND)}`);
    }
    const tsStatus = d.frontmatter?.status;
    if (typeof tsStatus !== "string" || !TACTICAL_STATUS.has(tsStatus)) {
      err(d.file, `E12 status ${JSON.stringify(tsStatus ?? null)} is not one of ${list(TACTICAL_STATUS)}`);
    }
  }
  if (/glossary\.md$/.test(d.file)) {
    for (const m of d.body.matchAll(new RegExp(`^\\|\\s*(${bare(GLOSSARY_ID)})\\s*\\|`, "gm"))) glDefs.add(m[1]);
  }
  // contracts register may define an SRC id in frontmatter
  if (/\/contracts\//.test(d.file) && typeof d.frontmatter?.id === "string" && SOURCE_ID.test(d.frontmatter.id as string)) {
    srcDefs.add(d.frontmatter.id as string);
  }
}

// ── E5: every REFERENCE resolves ─────────────────────────────────────────

const REF_PATTERNS: Array<[RegExp, (id: string) => boolean, string]> = [
  [scanner(REQUIREMENT_ID), (id) => reqDefs.has(id), "requirement"],
  [scanner(DECISION_ID), (id) => decDefs.has(id), "decision"],
  [scanner(QUESTION_ID), (id) => qDefs.has(id), "question"],
  [scanner(SOURCE_ID), (id) => srcDefs.has(id), "source"],
  [scanner(TACTICAL_ID), (id) => tsDefs.has(id), "tactical spec"],
  [scanner(GLOSSARY_ID), (id) => glDefs.has(id), "glossary term"],
];

/**
 * The identifier map is the generated record of the rename (DEC-0086): it holds
 * every identifier this repository had *before* the migration beside the one it
 * has now, so it is the one file whose left-hand column is meant not to resolve.
 * Generated by `scripts/migrate-identifiers.mjs --emit-map`, never hand-edited.
 */
const GENERATED = /\/traceability\/identifier-map\.md$/;

for (const d of docs) {
  if (GENERATED.test(d.file)) continue;
  for (const [re, exists, kind] of REF_PATTERNS) {
    for (const m of d.raw.matchAll(re)) {
      if (!exists(m[0])) err(d.file, `E5 reference to unknown ${kind} ${m[0]}`);
    }
  }
}

// ── E6: implements ↔ Coverage, bidirectional ─────────────────────────────

const covered = new Set<string>();

for (const d of docs.filter((d) => /\.tactical\.md$/.test(d.file))) {
  const impl = (d.frontmatter?.implements as string[] | undefined) ?? [];
  const implSet = new Set(impl);
  const covSection = d.body.split(/^## Coverage$/m)[1]?.split(/^## /m)[0] ?? "";
  if (!covSection.trim()) {
    err(d.file, "E6 missing Coverage section");
    continue;
  }
  const covIds = new Set([...covSection.matchAll(new RegExp(`^\\|\\s*(${bare(REQUIREMENT_ID)})`, "gm"))].map((m) => m[1]));
  for (const id of implSet) {
    if (!covIds.has(id)) err(d.file, `E6 ${id} listed in implements: but absent from Coverage table`);
    covered.add(id);
  }
  for (const id of covIds) {
    if (!implSet.has(id)) err(d.file, `E6 ${id} in Coverage table but not in implements:`);
  }
}

// ── E7: decisions index ↔ files ──────────────────────────────────────────

const decReadme = docs.find((d) => /\/decisions\/README\.md$/.test(d.file));
if (decReadme) {
  const indexed = new Set([...decReadme.raw.matchAll(/\[DEC-(\d{4})/g)].map((m) => `DEC-${m[1]}`));
  for (const id of decDefs) if (!indexed.has(id)) err(decReadme.file, `E7 ${id} exists as file but is missing from the index`);
  for (const id of indexed) if (!decDefs.has(id)) err(decReadme.file, `E7 index lists ${id} but no such decision file exists`);
}

// ── W1: uncovered requirements (report, not failure) ─────────────────────

const uncovered = [...reqDefs.keys()].filter((id) => !covered.has(id)).sort();
if (uncovered.length) {
  warnings.push(`W1 ${uncovered.length}/${reqDefs.size} requirements not yet covered by a tactical spec:`);
  warnings.push(`   ${uncovered.join(", ")}`);
}

// ── E8/E9: acceptance criteria and their levels ──────────────────────────

const LEVELS = new Set(["static", "unit", "integration", "e2e", "tool", "manual"]);
const acDefs = new Map<string, { file: string; level: string }>();
const acByReq = new Map<string, Set<string>>();   // requirement → AC ids

for (const d of docs.filter((d) => /\.tactical\.md$/.test(d.file))) {
  const tsId = (d.frontmatter?.id as string) ?? "";
  const acSection = d.body.split(/^## Acceptance criteria$/m)[1]?.split(/^## /m)[0] ?? "";
  for (const m of acSection.matchAll(new RegExp(`^\\|\\s*(${bare(ACCEPTANCE_ID)})\\s*\\|\\s*([a-z0-9]+)\\s*\\|`, "gm"))) {
    const [, id, level] = m;
    if (acDefs.has(id)) err(d.file, `E8 duplicate acceptance criterion ${id}`);
    if (!LEVELS.has(level)) err(d.file, `E8 ${id}: unknown level "${level}" (expected ${[...LEVELS].join(" | ")})`);
    if (!id.startsWith(tsId + "-")) err(d.file, `E8 ${id} does not carry this spec's id (${tsId})`);
    acDefs.set(id, { file: d.file, level });
  }

  // Coverage: bare A# resolve within the spec
  const covSection = d.body.split(/^## Coverage$/m)[1]?.split(/^## /m)[0] ?? "";
  for (const line of covSection.split("\n")) {
    const reqM = line.match(new RegExp(`^\\|\\s*(${bare(REQUIREMENT_ID)})`));
    if (!reqM) continue;
    const ids = new Set<string>();
    for (const a of line.matchAll(/\bA(\d+)\b/g)) {
      const full = `${tsId}-A${a[1]}`;
      if (!acDefs.has(full)) err(d.file, `E9 coverage of ${reqM[1]} references ${full}, which is not defined`);
      else ids.add(full);
    }
    if (ids.size) acByReq.set(reqM[1], new Set([...(acByReq.get(reqM[1]) ?? []), ...ids]));
  }
}

// ── E10/W3: what the tests reference ─────────────────────────────────────

const testGlobs = [
  ["src", /\.(test|integration\.test)\.tsx?$/],
  ["e2e", /\.spec\.tsx?$/],
  ["specs/verification/journeys", /\.feature$/],
] as const;

const referencedIds = new Set<string>();
for (const [dir, pattern] of testGlobs) {
  const full = join(SPECS_DIR, "..", dir);
  let entries: string[] = [];
  try { entries = walk(full).filter((f) => pattern.test(f)); } catch { /* dir absent yet */ }
  for (const f of entries) {
    const raw = readFileSync(f, "utf8");
    for (const m of raw.matchAll(new RegExp(`(?<![A-Za-z0-9-])(${bare(ACCEPTANCE_ID)}|${bare(REQUIREMENT_ID)})(?![0-9A-Za-z-])`, "g"))) {
      const id = m[1];
      const known = id.startsWith("TS-") ? acDefs.has(id) : reqDefs.has(id);
      if (!known) err(f, `E10 references unknown id ${id}`);
      else referencedIds.add(id);
    }
  }
}

// ── W2/W3: the closure gaps ──────────────────────────────────────────────

const coveredNoAc = [...covered].filter((id) => !acByReq.has(id)).sort();
if (coveredNoAc.length) {
  warnings.push(`W2 ${coveredNoAc.length} requirement(s) covered by a tactical spec but discharged by no acceptance criterion:`);
  warnings.push(`   ${coveredNoAc.join(", ")}`);
}

const acsByLevel = new Map<string, number>();
for (const { level } of acDefs.values()) acsByLevel.set(level, (acsByLevel.get(level) ?? 0) + 1);
const untested = [...acDefs.keys()].filter((id) => !referencedIds.has(id)).sort();
if (untested.length) {
  warnings.push(`W3 ${untested.length}/${acDefs.size} acceptance criteria have no test referencing them:`);
  warnings.push(`   ${untested.join(", ")}`);
}

// ── Report ───────────────────────────────────────────────────────────────

console.log(`specs check: ${files.length} files · ${reqDefs.size} requirements · ${decDefs.size} decisions · ${qDefs.size} questions · ${srcDefs.size} sources · ${tsDefs.size} tactical specs · ${glDefs.size} glossary terms · ${acDefs.size} acceptance criteria`);
if (acDefs.size) {
  const pyramid = [...LEVELS].map((l) => `${l} ${acsByLevel.get(l) ?? 0}`).join(" · ");
  console.log(`  verification pyramid: ${pyramid}`);
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
}
if (warnings.length) {
  console.log(`\nwarnings:`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
}
if (!errors.length) console.log("\n✓ no errors");
process.exit(errors.length ? 1 : 0);
