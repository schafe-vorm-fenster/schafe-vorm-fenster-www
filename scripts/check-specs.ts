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
 *  E3  Requirement documents carry a statement, a source and an S0–S3 level
 *  E4  Sufficiency S3 requires a DEC-#### or ADR-### token in the requirement
 *  E5  Every referenced ID (FUN/NFR/CON-*, TS-*, DEC-*, Q-*, SRC-*, GL-*) exists
 *  E6  Tactical `implements:` ↔ Coverage table match bidirectionally
 *  E7  decisions/README.md index ↔ decision files match both ways
 *  E8  Acceptance criteria: unique ID, valid verification level
 *  E9  Coverage tables reference only existing acceptance criteria
 *  E10 Tests/features reference only IDs that exist
 *  E11 Requirements carry a status from the requirement-shell contract
 *  E12 Tactical specs carry a `kind` and a status from the tactical contract
 *  E13 Source inventory rows carry a trust level from the source contract
 *  E14 Requirements carry the grammar form their class prescribes
 *  E15 No status but DRAFT while no decision policy binds this repository
 *  E16 Every artefact whose contract carries `version` has one
 *  W1  (warning) requirements not covered by any tactical spec
 *  W2  (warning) covered requirements discharged by no acceptance criterion
 *  W3  (warning) acceptance criteria no test references
 *  W4  (warning) requirements whose statement is not yet in its class's form
 *  W5  (report) what a decision point could resolve today, were one bound
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
 *  - Whether a statement really fills its slots. E14 checks that the form
 *    token belongs to the class and W4 counts the statements still outside
 *    it, but no regular expression can tell a filled slot from a plausible
 *    sentence. The fit criterion is still owed entirely.
 *  - The chain. STRICT links requirement → need → goal; this repository links
 *    requirement → source → decision → question and requirement → tactical
 *    spec → acceptance criterion → test. E5/E6/E9/E10 and W1–W3 check the
 *    chain this repository actually has.
 *  - The locator form. `method-identifier-and-locator-schema` wants
 *    `<file>#L102` plus an excerpt; the artefacts carry source ids.
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

/** Every governed artefact's status, for E15. */
const statuses: Array<[string, string, string]> = [];
/** Requirement → evidence level, for W5's sufficiency gate. */
const sufficiencyOf = new Map<string, string>();
/** "Nothing is decided at … requirement approval below S2" (library-schemas/policies). */
const GATE_S2 = new Set(["S2", "S3"]);

/**
 * The grammar form a class prescribes (`@leafcutter-strict/method-statement-grammar`).
 *
 * The method gives one shape per class — F, Q, C, B — and the shell contract
 * types `form` as that letter plus a digit, without saying what the digit
 * enumerates. The method defines exactly one variant per class, so `1` is
 * that variant and `0` says the description does not follow it yet: the
 * statement is the one extraction wrote, kept word for word because recasting
 * it would drop a qualification the form has no slot for. W4 counts them.
 */
const FORM_OF_CLASS: Record<string, string> = { FUN: "F", NFR: "Q", CON: "C", BUS: "B" };
const notInForm: string[] = [];

/**
 * Who may write a status other than DRAFT (E15).
 *
 * `@leafcutter-strict/foundation-draft-only-output` is a company-layer
 * foundation and it is blunt about it: an executor may not "approve, merge,
 * baseline, release, or change a status … An executor that writes
 * `status: APPROVED` has not saved a step; it has removed the record that
 * makes the approval auditable." A status changes at the decision point
 * named in the project's decision policy, and nowhere else.
 *
 * This repository has no decision policy. `library-schemas/policies` ships
 * three reference profiles and says no blueprint selects one, because "how
 * much authority an agent holds is a decision, and it should not arrive as
 * an install default" — and that "a pair the policy does not cover fails the
 * pipeline rather than falling back to something nobody decided". DEC-0085
 * §6 keeps the row open.
 *
 * So until a `POL-*` policy exists under `specs/`, DRAFT is the only status
 * anything here may carry, and E15 says so rather than letting a future run
 * quietly promote 155 requirements because their tests are green. Green
 * tests are evidence for a decision; they are not the decision. What the
 * evidence supports is reported instead, as W5.
 */
const POLICY_ID = /^POL-[A-Z0-9-]+$/;
const policies: string[] = [];

/**
 * The version an artefact carries (E16).
 *
 * `@leafcutter-strict/method-version-increment` is a rule for *increments*
 * and nothing else: its inputs are "the artefact's current version and its
 * diff", and its output is major, minor or patch with the reason. It never
 * says what the first version of an artefact is, and `@leafcutter-os/schemas`
 * types `version` as a bare string with no pattern, so neither does the
 * contract. The value has to be argued rather than read off.
 *
 * Every artefact here starts at **0.1.0**, because the one thing this
 * repository can state about all of them is that none has passed a decision
 * point: DP-13 baseline release has never run, so nothing is at a released
 * baseline and a 1.x would claim one. The first increment the method governs
 * is the one after the first approval.
 *
 * Three contracts carry the field, so three kinds of artefact do:
 * `requirement-shell`, `tactical-specification` and `specification-document`.
 * The decision record, the glossary proposal, the question set and the source
 * inventory declare no `version`, and none is invented for them.
 */
const VERSION = /^\d+\.\d+\.\d+$/;
const checkVersion = (d: Doc, id: string) => {
  const v = d.frontmatter?.version;
  if (typeof v !== "string" || !VERSION.test(v))
    err(d.file, `E16 ${id}: version ${JSON.stringify(v ?? null)} is not <major>.<minor>.<patch>`);
};

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
  /\/requirements\/.+\/(?!README)[^/]+\.md$/,
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

/**
 * A requirement is one document (wave 2).
 *
 * `@leafcutter-os/schemas` types a requirement as `spec/requirements/<id>.md`,
 * level L3 — a document, not a row — and `library-schemas`'
 * `requirement-shell` contract records "a single requirement". So the id, the
 * class, the source locator and the evidence level are frontmatter, and the
 * statement is the body. The directory README is an index over them and
 * defines nothing.
 */
const REQUIREMENT_DOC = /\/requirements\/[^/]+\/(?!README)([^/]+)\.md$/;

for (const d of docs) {
  const reqFile = d.file.match(REQUIREMENT_DOC);
  if (reqFile) {
    const id = d.frontmatter?.id;
    if (typeof id !== "string" || !REQUIREMENT_ID.test(id)) {
      err(d.file, "E1 requirement without valid frontmatter id (<CLASS>-<DOMAIN>-####)");
    } else {
      // The file is named for the artefact it holds (DEC-0086 §4).
      if (reqFile[1] !== id) err(d.file, `E1 frontmatter id ${id} does not match file name ${reqFile[1]}`);
      if (reqDefs.has(id)) {
        err(d.file, `E2 duplicate definition of ${id} (also in ${rel(reqDefs.get(id)!)})`);
      } else {
        reqDefs.set(id, d.file);
      }
      // The class token of the id is the `class` field, and nothing else.
      const cls = d.frontmatter?.class;
      if (cls !== id.slice(0, id.indexOf("-")))
        err(d.file, `E2 ${id}: class ${JSON.stringify(cls ?? null)} does not match the id's type token`);
      // E11: the status vocabulary belongs to the requirement-shell contract
      const status = d.frontmatter?.status;
      if (typeof status !== "string" || !REQUIREMENT_STATUS.has(status)) {
        err(d.file, `E11 ${id}: status ${JSON.stringify(status ?? null)} is not one of ${list(REQUIREMENT_STATUS)}`);
      }
      statuses.push([d.file, id, String(status)]);
      checkVersion(d, id);
      // E14: the grammar form belongs to the class (`method-statement-grammar`)
      const form = d.frontmatter?.form;
      const expectedForm = FORM_OF_CLASS[id.slice(0, id.indexOf("-"))];
      if (typeof form !== "string" || !new RegExp(`^${expectedForm}[01]$`).test(form)) {
        err(d.file, `E14 ${id}: form ${JSON.stringify(form ?? null)} is not ${expectedForm}0 or ${expectedForm}1`);
      } else if (form.endsWith("0")) {
        notInForm.push(id);
      }
      // E3: the attributes the shell requires — statement, source, sufficiency.
      // The statement is the body down to the first section heading; `##
      // Rationale` and `## Notes` carry what the form has no slot for.
      const statement = d.body.replace(/^#[^\n]*\n/m, "").split(/^## /m)[0].trim();
      const source = typeof d.frontmatter?.source === "string" ? d.frontmatter.source.trim() : "";
      const suff = d.frontmatter?.evidence_sufficiency;
      if (!statement) err(d.file, `E3 ${id}: empty statement`);
      if (!source) err(d.file, `E3 ${id}: empty source`);
      if (typeof suff !== "string" || !SUFFICIENCY.has(suff))
        err(d.file, `E3 ${id}: sufficiency ${JSON.stringify(suff ?? null)} is not one of ${list(SUFFICIENCY)}`);
      else sufficiencyOf.set(id, suff);
      // E4: S3 needs a decision anchor in the artefact itself
      if (suff === "S3" && !/(DEC-\d{4}|ADR-\d{3}|ADR-00\d)/.test(statement + " " + source)) {
        err(d.file, `E4 ${id}: S3 without DEC/ADR reference in the requirement`);
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
    statuses.push([d.file, String(d.frontmatter?.id ?? "?"), String(tsStatus)]);
    checkVersion(d, String(d.frontmatter?.id ?? "?"));
  }
  if (/\.ssd\.md$/.test(d.file)) {
    checkVersion(d, String(d.frontmatter?.id ?? "?"));
  }
  if (/glossary\.md$/.test(d.file)) {
    for (const m of d.body.matchAll(new RegExp(`^\\|\\s*(${bare(GLOSSARY_ID)})\\s*\\|`, "gm"))) glDefs.add(m[1]);
  }
  // A decision policy, if this repository ever adopts one (E15).
  if (typeof d.frontmatter?.id === "string" && POLICY_ID.test(d.frontmatter.id as string)) {
    policies.push(d.frontmatter.id as string);
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
// ── E15: only a decision point moves a status off DRAFT ──────────────────

if (!policies.length) {
  for (const [file, id, status] of statuses) {
    if (status !== "DRAFT")
      err(
        file,
        `E15 ${id}: status ${status} — no decision policy binds this repository, so no decision ` +
          `point exists to set it. @leafcutter-strict/foundation-draft-only-output: an executor ` +
          `"may not approve, merge, baseline, release, or change a status". Adopt a POL-* policy first.`,
      );
  }
}

// ── W5: what the evidence would support, were a decision point bound ─────
// Not a decision. The sufficiency gate is the policies' own: "Nothing is
// decided at goal acceptance or requirement approval below S2."

const dp03 = [...reqDefs.keys()]
  .filter((id) => covered.has(id) && GATE_S2.has(sufficiencyOf.get(id) ?? ""))
  .sort();
const dp09 = [...tsDefs]
  .filter((ts) => {
    const own = [...acDefs.keys()].filter((a) => a.startsWith(ts + "-"));
    return own.length > 0 && own.every((a) => referencedIds.has(a));
  })
  .sort();
warnings.push(
  `W5 nothing is APPROVED or VERIFIED because no decision policy binds this repository (DEC-0085 §6).`,
);
warnings.push(
  `   were one bound: ${dp03.length}/${reqDefs.size} requirements meet DP-03's evidence gate ` +
    `(>= S2 and covered by a tactical spec); ${dp09.length}/${tsDefs.size} tactical specs meet ` +
    `DP-09's (every acceptance criterion referenced by a test).`,
);

if (notInForm.length) {
  warnings.push(`W4 ${notInForm.length}/${reqDefs.size} requirements are not yet in the slot form their class prescribes:`);
  warnings.push(`   ${notInForm.sort().join(", ")}`);
}

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
