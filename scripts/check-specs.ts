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
 *  E2  Requirement IDs ((FUN|NFR|CON|BUS)-WEB-####) unique, class matches the id
 *  E3  Requirement documents carry a statement, a source and an S0–S3 level
 *  E4  Sufficiency S3 requires a DEC-#### or ADR-### token in the requirement
 *  E5  Every referenced ID (FUN/NFR/CON/BUS-*, TS-*, DEC-*, Q-*, SRC-*, GL-*)
 *      exists — or, in a decision record only, is a retired identifier
 *  E6  Tactical `implements:` ↔ Coverage table match bidirectionally
 *  E7  decisions/README.md index ↔ decision files match both ways
 *  E8  Acceptance criteria: unique ID, valid verification level
 *  E9  Coverage tables reference only existing acceptance criteria
 *  E10 Tests/features reference only IDs that exist
 *  E11 Requirements carry a status from the requirement-shell contract
 *  E12 Tactical specs carry a `kind` and a status from the tactical contract
 *  E13 Source inventory rows carry a trust level from the source contract
 *  E14 Requirements carry the grammar form their class prescribes
 *  E15 The decision policy binds every pair, and a status moves only at a
 *      decision point it names — with the record that makes it auditable
 *  E16 Every artefact whose contract carries `version` has one
 *  E17 Every artefact whose contract carries `ai_provenance` has one, with
 *      the four fields the contract names
 *  E18 Every requirement carries a `fit_criterion` — a measure in the shape
 *      the contract types, or `UNKNOWN`
 *  E19 Every requirement's `source` is the contract's locator — a position in
 *      a named file and an excerpt of at most 25 words, or `UNKNOWN`
 *  E20 Every source carries a six-dimension quality vector, and its trust
 *      level is the minimum of that vector rather than an assertion
 *  E21 Conflict records: unique id, the taxonomy's type, the contract's
 *      impact, status and outcome set, and both positions with their evidence
 *  E22 Demand rows: unique id, the taxonomy's defect type, a status, an
 *      addressee and a concrete request
 *  E23 STRICT decision records: the identifier, the fields both contracts
 *      require, the status enum, and a locator on every piece of evidence
 *  E24 Every requirement names at least one need — an existing `NEED-WEB-####`
 *      or the contract's `UNKNOWN` (`method-chain-linkage` step 1, upward)
 *  E25 Every need is the need contract's shape, names at least one existing
 *      goal, and names a stakeholder the specification document lists
 *  E26 Every goal is the goal contract's shape and falls inside scope — it
 *      names the specification document, and its parent goal resolves
 *  E27 A recorded deviation from a source names the line it contradicts and an
 *      existing demand against that source (DEC-0104 §2)
 *  W1  (warning) requirements not covered by any tactical spec
 *  W2  (warning) covered requirements discharged by no acceptance criterion
 *  W3  (warning) acceptance criteria no test references
 *  W4  (warning) requirements whose statement is not yet in its class's form
 *  W5  (report) what the bound policy resolves today, and what escalates
 *  W6  (report) how much of the provenance is UNKNOWN, because bound 3 of
 *      POL-GRADED-BY-IMPACT escalates on an unverifiable separation of duties
 *  W7  (report) the fit-criterion fill rate, because bound 2 of
 *      POL-GRADED-BY-IMPACT escalates on an UNKNOWN criterion
 *  W8  (report) the locator fill rate, and what stays unlocatable
 *  W9  (report) chain linkage, both directions: the five findings
 *      `method-chain-linkage` names, each as a fraction with its numerator
 *      and denominator, "never as a bare percentage"
 *  W10 (report) how many deviations from a source are recorded, and which
 *      requirements state a contradiction in prose that no record carries
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
 *  - Which missing link is a defect of the artefact and which means the need
 *    was never real. `method-chain-linkage` is explicit that "the counting is
 *    deterministic and belongs to the validator" and that the method covers
 *    what the numbers do not say. E24–E26 and W9 count; DEC-0103 reads.
 *  - Whether the excerpt really supports the statement. E19 checks that a
 *    locator is a position and that the excerpt is inside the method's
 *    25 words; only reading the source says whether those words carry the
 *    claim. DEC-0097 records what that reading found.
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

type JsonSchema = { properties?: Record<string, JsonSchema>; items?: JsonSchema; enum?: string[]; $defs?: Record<string, JsonSchema> };

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

/**
 * The two cross-cutting registers (DEC-0099).
 *
 * `@leafcutter-os/schemas` types `CONF-<nnnn>` and `DEM-<nnnn>`, and DEC-0086
 * §1 already recorded that neither carries a domain token: the domain sits on
 * the chain artefacts — goal, need, requirement, tactical specification — and
 * not on the registers that cut across them. The patterns are spelled here
 * rather than read, because those schemas are Zod modules rather than JSON
 * Schema and `idPattern()` reads JSON.
 */
const CONFLICT_ID = /^CONF-\d{4}$/;
const DEMAND_ID = /^DEM-\d{4}$/;

/**
 * The chain's two upper levels (DEC-0101, DEC-0102).
 *
 * `@leafcutter-os/schemas` is the only installed package that types a goal or
 * a need, and it types them as Zod modules rather than JSON Schema, so
 * `contract()` cannot read them and `idPattern()` cannot either. The module is
 * ESM-only and this script runs as CommonJS, so it is read as text rather than
 * imported: the identifier pattern and the field list come out of the shipped
 * `goal.schema.mjs` and `need.schema.mjs`, and a shape that stops matching
 * fails this check loudly instead of passing unnoticed. The package is not a
 * direct dependency of this repository — it arrives underneath
 * `@leafcutter-strict/library-schemas` — so it is resolved from there.
 */
const OS_SPEC_DIR = dirname(
  createRequire(
    createRequire(import.meta.url).resolve("@leafcutter-strict/library-schemas/pack.mjs"),
  ).resolve("@leafcutter-os/schemas/spec"),
);

interface ZodContract {
  id: RegExp;
  fields: string[];
}

function zodContract(name: string): ZodContract {
  const src = readFileSync(join(OS_SPEC_DIR, `${name}.schema.mjs`), "utf8");
  const body = src.split(/z\.object\(\{/)[1];
  if (!body) throw new Error(`@leafcutter-os/schemas: no object literal in ${name}.schema.mjs`);
  const declared = body.match(/id:\s*z\.string\(\)\.regex\((\/.+?\/)\)/)?.[1];
  if (!declared) throw new Error(`@leafcutter-os/schemas: no id pattern in ${name}.schema.mjs`);
  const fields = [...body.matchAll(/^\s{2}(\w+):\s*z\./gm)].map((m) => m[1]);
  if (fields.length < 5) throw new Error(`@leafcutter-os/schemas: ${name} declares ${fields.length} fields`);
  return { id: new RegExp(declared.slice(1, -1)), fields };
}

const goalContract = zodContract("goal");
const needContract = zodContract("need");
const GOAL_ID = goalContract.id;
const NEED_ID = needContract.id;

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
 * Until 2026-09-24 there was no such policy, and E15 was that sentence with
 * nothing behind it: `DRAFT` or an error. DEC-0088 adopted
 * `POL-GRADED-BY-IMPACT`, so E15 now enforces the policy instead of its
 * absence. Three rules, of which the first is the old one:
 *
 *  1. **No `POL-*` document under `specs/`** — `DRAFT` only, unchanged.
 *  2. **The bound policy is well-formed.** Exactly one policy binds. It
 *     carries the frontmatter its type declares (`id`, `policy-owner`,
 *     `modes`, `conformance-level`, `human-only`), `DP-14` is in `human-only`
 *     because "a governance change is never an agent's", and its Rules table
 *     binds all fourteen decision points across all four impact levels to a
 *     mode the frontmatter declares. That is the contract's own
 *     `policy-covers-every-pair` rule — an agent-evaluated rule upstream —
 *     made deterministic here. `library-schemas/policies`: "There is no
 *     default row: a pair the policy does not cover fails the pipeline rather
 *     than falling back to something nobody decided."
 *  3. **A status other than `DRAFT` is anchored in a decision record.** The
 *     record has to name the artefact, cite the policy by its id, and name a
 *     decision point. That holds in either mode: `HUMAN` because that is what
 *     a decision record is, `AGENT_BOUNDED` because
 *     `method-decision-policy-resolution` says "a record naming only the
 *     outcome cannot be audited against the policy". The shape of the record
 *     itself is not prescribed here — `SDR-####-####` is still owed in
 *     DEC-0085 §6 — only that one exists and can be found from the artefact.
 *
 * What E15 deliberately does not do is resolve the decision itself. It cannot
 * know whether the owner read the evidence. W5 reports the resolution the
 * policy gives for every governed artefact; the record is what says somebody
 * acted on it.
 */
const POLICY_ID = /^POL-[A-Z0-9-]+$/;
const policies: Doc[] = [];

/** The four impact levels of `@leafcutter-strict/method-impact-level-assignment`. */
const IMPACT_LEVELS = ["Low", "Medium", "High", "Critical"] as const;
/** The fourteen catalogue decision points; a project may add `DP-Pnn`, never remove one. */
const DECISION_POINTS = Array.from({ length: 14 }, (_, i) => `DP-${String(i + 1).padStart(2, "0")}`);
/** The four executor modes, from `library-schemas/documents/decision-policy.type.mjs`. */
const EXECUTOR_MODES = new Set(["HUMAN", "AGENT_PROPOSE", "AGENT_BOUNDED", "AUTO"]);

/**
 * The impact level an artefact's decision reaches, from its dependant count.
 *
 * `method-impact-level-assignment` is explicit that the count is the input —
 * "assigning the level from the dependants — a number the traceability matrix
 * supplies — is what makes it checkable" — and that the levels do not average:
 * "Take the highest level any criterion reaches."
 *
 * This is the floor, never the answer. The method's second cross-cutting rule
 * ("in a regulated domain, the lowest available level for a meaning change is
 * high") and its critical row can only raise it, and neither is derivable from
 * a count. W5 says so where it prints the number.
 */
const impactFromDependants = (n: number) => (n === 0 ? "Low" : n <= 2 ? "Medium" : "High");

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

/**
 * The provenance an artefact carries (E17).
 *
 * `requirement-shell` and `tactical-specification` both close their prose with
 * the same sentence — "Every record additionally carries `ai_provenance` — the
 * prompt, its version, the model and the time of the run" — and both `$defs`
 * type it as an object requiring exactly `prompt_id`, `prompt_version`,
 * `model` and `generated_at`, with `additionalProperties: false`. The field is
 * missing from the schemas' own top-level `required` list, which is why 184
 * artefacts could carry none and still validate; the contract prose is the
 * canonical form here, as DEC-0085 §6 has it, and the schema's omission is the
 * same class of upstream slip as the over-escaped `pattern` values.
 *
 * `@leafcutter-strict/foundation-evidence-discipline` supplies the value for a
 * field the input does not support: "Where the input does not support a value,
 * write `UNKNOWN`. An `UNKNOWN` is a valid, expected output. A fabricated
 * value is a defect — and the worse kind, because it reads exactly like a
 * supported one." So `UNKNOWN` passes here and is counted by W6 rather than
 * hidden: bound 3 of `POL-GRADED-BY-IMPACT` escalates on provenance that
 * cannot be checked, and the count is what says how far that reaches.
 */
/**
 * The fit criterion a requirement carries (E18).
 *
 * `requirement-shell` lists `fit_criterion` in its `required` array and types
 * it as a `oneOf`: the string `UNKNOWN`, or an object requiring `scale`,
 * `operator`, `value` and `meter`, with `unit` optional and
 * `additionalProperties: false`. The contract's own gloss — "Scale, operator,
 * value, unit and meter — or `UNKNOWN`, which is expected until a measure
 * arrives" — and `method-statement-grammar`'s FC form are the same shape:
 * `<scale>` `<operator>` `<value>` `<unit>`, measured by `<meter>`.
 *
 * What fills it here is DEC-0095: the acceptance criteria that verify the
 * requirement, and for a quality requirement the measure its own statement
 * already carries. Where no criterion of a requirement is referenced by a
 * test, nothing checks it, and the value is `UNKNOWN` rather than a criterion
 * nobody runs. W7 counts both sides.
 */
const FIT_FIELDS = ["scale", "operator", "value", "unit", "meter"] as const;
const FIT_REQUIRED = ["scale", "operator", "value", "meter"] as const;
let fitMeasured = 0;
let fitUnknown = 0;

const checkFitCriterion = (d: Doc, id: string) => {
  const fit = d.frontmatter?.fit_criterion;
  if (fit === "UNKNOWN") {
    fitUnknown += 1;
    return;
  }
  if (typeof fit !== "object" || fit === null || Array.isArray(fit)) {
    err(d.file, `E18 ${id}: fit_criterion is ${JSON.stringify(fit ?? null)} — the contract requires a measure or "UNKNOWN"`);
    return;
  }
  fitMeasured += 1;
  const record = fit as Record<string, unknown>;
  for (const extra of Object.keys(record))
    if (!(FIT_FIELDS as readonly string[]).includes(extra))
      err(d.file, `E18 ${id}: fit_criterion.${extra} is not one of ${FIT_FIELDS.join(", ")}`);
  for (const field of FIT_REQUIRED)
    if (record[field] === undefined || record[field] === null || record[field] === "")
      err(d.file, `E18 ${id}: fit_criterion.${field} is missing — the contract requires ${FIT_REQUIRED.join(", ")}`);
};

/**
 * The source locator a requirement carries (E19).
 *
 * `requirement-shell` types `source` as its `$defs/locator`: `source_id`,
 * `loc` and `excerpt`, `additionalProperties: false`, with `loc` and
 * `excerpt` required. `loc` is patterned
 * `^.+#(L\d+|P\d+|¶\d+|M\d+:\d+)$` — file plus line, page, paragraph or
 * timestamp — which is `method-identifier-and-locator-schema`'s table of
 * four schemes, and the method caps the excerpt at 25 words:
 *
 *   4. Pick the locator granularity the source supports — the finest
 *      available, never a finer one invented for tidiness.
 *   5. Attach an excerpt of at most 25 words to every locator, in the
 *      source's language.
 *
 * The pattern is read out of the installed schema rather than spelled here,
 * through the same repair `idPattern()` makes for the doubled backslashes.
 *
 * `UNKNOWN` is accepted for `loc` and for `excerpt`, and the contract's
 * pattern does not allow it — a recorded deviation (DEC-0097). The method
 * itself requires the value: "Where the source carries no position scheme at
 * all, the locator is `UNKNOWN` and the source is reported as unlocatable —
 * which is a defect of the source, not of the run." A pattern with no
 * `UNKNOWN` branch would force either a fabricated line number or an absent
 * field, and `foundation-evidence-discipline` rules out the first while the
 * contract's `required` rules out the second. W8 counts what is still
 * `UNKNOWN`, so the deviation is measured rather than merely tolerated.
 */
const LOCATOR_FIELDS = ["source_id", "loc", "excerpt"] as const;
const LOCATOR_REQUIRED = ["loc", "excerpt"] as const;
const locatorDef = requirementShell.$defs?.locator;
if (!locatorDef) throw new Error("library-schemas: requirement-shell has no $defs.locator");
const LOC_PATTERN = idPattern(locatorDef, "loc");
/** `maxLength` of the contract's excerpt, beside the method's 25-word cap. */
const EXCERPT_MAX_CHARS =
  (locatorDef.properties?.excerpt as { maxLength?: number } | undefined)?.maxLength ?? 200;
const EXCERPT_MAX_WORDS = 25;
let locResolved = 0;
let locUnknown = 0;

const checkLocator = (d: Doc, id: string) => {
  const loc = d.frontmatter?.source;
  if (typeof loc !== "object" || loc === null || Array.isArray(loc)) {
    err(d.file, `E19 ${id}: source is ${JSON.stringify(loc ?? null)} — the contract requires a locator with loc and excerpt`);
    return;
  }
  const record = loc as Record<string, unknown>;
  for (const extra of Object.keys(record))
    if (!(LOCATOR_FIELDS as readonly string[]).includes(extra))
      err(d.file, `E19 ${id}: source.${extra} is not one of ${LOCATOR_FIELDS.join(", ")}`);
  for (const field of LOCATOR_REQUIRED)
    if (typeof record[field] !== "string" || record[field] === "")
      err(d.file, `E19 ${id}: source.${field} is missing — the contract requires ${LOCATOR_REQUIRED.join(", ")}`);
  const where = record.loc;
  if (typeof where === "string" && where !== "UNKNOWN") {
    if (!LOC_PATTERN.test(where))
      err(d.file, `E19 ${id}: source.loc ${JSON.stringify(where)} is neither UNKNOWN nor <file>#L… / #P… / #¶… / #M…:…`);
    else locResolved += 1;
  } else if (where === "UNKNOWN") locUnknown += 1;
  const excerpt = record.excerpt;
  if (typeof excerpt === "string" && excerpt !== "UNKNOWN") {
    if (excerpt.length > EXCERPT_MAX_CHARS)
      err(d.file, `E19 ${id}: source.excerpt is ${excerpt.length} characters, over the contract's ${EXCERPT_MAX_CHARS}`);
    const words = excerpt.trim().split(/\s+/).length;
    if (words > EXCERPT_MAX_WORDS)
      err(d.file, `E19 ${id}: source.excerpt is ${words} words, over the method's ${EXCERPT_MAX_WORDS}`);
  }
};

/**
 * The deviation record (E27), and the contradiction that carries none (W10).
 *
 * DEC-0104 inverted `specs/README.md` rule 4: the specification carries the
 * truth and a source is cited, not obeyed. The price of that is rule 5 — a
 * deviation from a source is recorded twice, on the artefact and as a demand
 * against the source — and this is the half of it a script can hold.
 *
 * **E27.** A `Deviation:` line in a requirement's `## Source` section names
 * the exact source position it contradicts, in the same form E19 requires of
 * the `loc` field, and an existing `DEM-####`. A deviation without a position
 * is the defect `method-identifier-and-locator-schema` calls unlocatable; a
 * deviation without a demand is the silent override DEC-0104 exists to end.
 *
 * **W10.** The complement, and a warning rather than an error because it is a
 * prose match: a `Finding:` that says the requirement contradicts, overrides
 * or supersedes its source while no `Deviation:` line records it. E27 only
 * fires on a record that is already there; W10 is how the missing one shows.
 */
const DEVIATION_LINE = /^Deviation:.*$/gm;
/** A position inside a named source, as the `loc` pattern spells it. */
const DEVIATION_LOCATOR = /\S+#(?:L\d+|P\d+|¶\d+|M\d+:\d+)/;
/**
 * The vocabulary of a contradiction **with the source**, in a `Finding:` line.
 *
 * "Supersede" is deliberately not in it: in a `Finding:` it almost always
 * describes one decision record superseding another, which is the ordinary way
 * this repository moves, not a specification standing against its source.
 */
const CONTRADICTION_PROSE = /\b(?:contradicts?|contradiction|overrid(?:es?|ing)|deviat(?:es?|ion)|the opposite)\b/i;
/** `id` → the deviation lines it carries, checked once `demDefs` is complete. */
const deviations = new Map<string, string[]>();
/** Requirements whose prose states a contradiction that no `Deviation:` records. */
const unrecordedDeviations: string[] = [];

const collectDeviations = (d: Doc, id: string) => {
  const source = d.body.split(/^## /m).find((s) => s.startsWith("Source\n"));
  if (source === undefined) return;
  const lines = [...source.matchAll(DEVIATION_LINE)].map((m) => m[0]);
  if (lines.length) deviations.set(id, lines);
  else if (CONTRADICTION_PROSE.test(source.match(/^Finding:.*$/m)?.[0] ?? "")) unrecordedDeviations.push(id);
};

/**
 * The six-dimension source-quality vector (E20).
 *
 * `@leafcutter-strict/method-source-quality-rating` scores locatability,
 * authority, currency, completeness, specificity and internal consistency
 * from 0 to 3, and then:
 *
 *   Then take the **minimum**, not the average: a source is as weak as its
 *   weakest dimension. […] Map the minimum to a trust level: 3 on all is
 *   high, minimum 2 is medium, minimum 1 is low. A 0 on locatability or
 *   authority makes the source unusable as sole evidence.
 *
 * So the trust level is not an opinion that sits beside the vector; it is
 * computed from it. E20 recomputes it and fails where the register asserts a
 * different one — which is how DEC-0098 found that fifteen of the eighteen
 * levels had never been derived at all. The `locator_scheme` is the
 * contract's enum, read from the schema like every other vocabulary.
 */
const QUALITY_DIMENSIONS = [
  "locatability",
  "authority",
  "currency",
  "completeness",
  "specificity",
  "internal_consistency",
] as const;
const LOCATOR_SCHEME = vocabulary(sourceInventory, "sources.[].locator_scheme");
/** Source id → the level the register asserts, for E20 to check against. */
const assertedTrust = new Map<string, string>();
const vectorSources = new Set<string>();

/** The method's mapping, and nothing else: min 3 high, 2 medium, 1 low, 0 unusable. */
function trustOf(vector: number[]): string {
  const min = Math.min(...vector);
  return min >= 3 ? "high" : min === 2 ? "medium" : min === 1 ? "low" : "unusable";
}

function checkQualityVector(d: Doc, id: string, line: string) {
  const cells = line.split("|").map((c) => c.trim());
  // | ID | Sch. | L | A | C | Cp | Sp | IC | Min | Level | Was | Defects |
  const scheme = cells[2];
  const scores = cells.slice(3, 9).map((c) => Number(c));
  const min = Number(cells[9]);
  const level = cells[10];
  vectorSources.add(id);
  if (!LOCATOR_SCHEME.has(scheme ?? ""))
    err(d.file, `E20 ${id}: locator_scheme "${scheme ?? ""}" is not one of ${list(LOCATOR_SCHEME)}`);
  if (scores.length !== QUALITY_DIMENSIONS.length || scores.some((n) => !Number.isInteger(n) || n < 0 || n > 3)) {
    err(d.file, `E20 ${id}: the vector is not six integers 0–3 (${cells.slice(3, 9).join(", ")})`);
    return;
  }
  const computedMin = Math.min(...scores);
  if (min !== computedMin)
    err(d.file, `E20 ${id}: Min is ${min}, but the vector's minimum is ${computedMin}`);
  const computed = trustOf(scores);
  if (level !== computed)
    err(d.file, `E20 ${id}: Level is "${level}", but the vector ${scores.join("·")} produces "${computed}"`);
  const asserted = assertedTrust.get(id);
  if (asserted !== undefined && asserted !== computed)
    err(d.file, `E20 ${id}: the register says trust "${asserted}", the vector produces "${computed}"`);
}

/**
 * The conflict register (E21) and the demand register (E22).
 *
 * `@leafcutter-strict/method-conflict-taxonomy` fixes six conflict types and
 * `library-schemas`' `conflict-record` schema spells them, together with the
 * impact levels, the outcome set and the two statuses. `method-defect-taxonomy`
 * fixes eleven defect types. All of those are read here from the installed
 * contract where the contract has them, and spelled from the method's own
 * table where — as for the defect types — the schema does not.
 *
 * The conflict record's own rule, verbatim: "A conflict record that names only
 * the new candidate is half a record; the reviewer cannot see what it collides
 * with." So E21 requires two positions, each with a locator and an excerpt in
 * the same form E19 requires of a requirement.
 */
const conflictRecord = contract("conflict-record");
const CONFLICT_TYPE = vocabulary(conflictRecord, "type");
const CONFLICT_IMPACT = vocabulary(conflictRecord, "impact");
const CONFLICT_OUTCOME = vocabulary(conflictRecord, "permitted_outcomes.[]");
const CONFLICT_STATUS = vocabulary(conflictRecord, "status");

/**
 * The eleven defect types of `@leafcutter-strict/method-defect-taxonomy`.
 *
 * Spelled, not read: the method is prose and no installed schema enumerates
 * them. Each token is the method's own row label, lowercased and joined.
 */
const DEFECT_TYPE = new Set([
  "unlocatable", "unauthoritative", "stale", "vague", "incomplete", "contradictory",
  "single_source", "solution_only", "hearsay", "unmandated", "noise",
]);
const DEMAND_STATUS = new Set(["OPEN", "ANSWERED", "WAIVED"]);

function checkConflict(d: Doc, id: string) {
  const f = d.frontmatter ?? {};
  const one = (key: string, allowed: Set<string>) => {
    const v = f[key];
    if (typeof v !== "string" || !allowed.has(v))
      err(d.file, `E21 ${id}: ${key} ${JSON.stringify(v ?? null)} is not one of ${list(allowed)}`);
  };
  one("type", CONFLICT_TYPE);
  one("impact", CONFLICT_IMPACT);
  one("status", CONFLICT_STATUS);
  one("recommended_action", CONFLICT_OUTCOME);
  const permitted = f.permitted_outcomes;
  if (!Array.isArray(permitted) || permitted.length === 0)
    err(d.file, `E21 ${id}: permitted_outcomes is empty — the type derives it, it is not a free choice`);
  else {
    for (const o of permitted)
      if (typeof o !== "string" || !CONFLICT_OUTCOME.has(o))
        err(d.file, `E21 ${id}: permitted_outcomes ${JSON.stringify(o)} is not one of ${list(CONFLICT_OUTCOME)}`);
    if (typeof f.recommended_action === "string" && !permitted.includes(f.recommended_action))
      err(d.file, `E21 ${id}: recommended_action ${f.recommended_action} is not among its own permitted_outcomes`);
  }
  if (!Array.isArray(f.involved) || f.involved.length < 2)
    err(d.file, `E21 ${id}: involved names fewer than two artefacts — a record naming one side is half a record`);
  // Both positions, each with a locator and an excerpt.
  const positions = [...d.body.matchAll(/^ {2}`(.+?#(?:L\d+|P\d+|¶\d+|M\d+:\d+))`$/gm)];
  const excerpts = [...d.body.matchAll(/^ {2}> (.+)$/gm)];
  if (positions.length < 2)
    err(d.file, `E21 ${id}: ${positions.length} position locator(s) — the contract requires at least two`);
  if (excerpts.length !== positions.length)
    err(d.file, `E21 ${id}: ${positions.length} locator(s) but ${excerpts.length} excerpt(s)`);
  for (const e of excerpts)
    if (e[1].trim().split(/\s+/).length > EXCERPT_MAX_WORDS)
      err(d.file, `E21 ${id}: a position excerpt is over the method's ${EXCERPT_MAX_WORDS} words`);
}

/** Demand-register columns: | ID | Defect | Status | Blocks | From | Required | Answer format | Raised by | Q | */
function checkDemand(d: Doc, id: string, line: string) {
  const cells = line.split("|").map((c) => c.trim());
  const defect = cells[2];
  const status = cells[3];
  if (!DEFECT_TYPE.has(defect ?? ""))
    err(d.file, `E22 ${id}: defect "${defect ?? ""}" is not one of ${list(DEFECT_TYPE)}`);
  if (!DEMAND_STATUS.has(status ?? ""))
    err(d.file, `E22 ${id}: status "${status ?? ""}" is not one of ${list(DEMAND_STATUS)}`);
  // "More detail is not a demand" — the required input and the addressee are
  // the two fields that make a demand one, and neither may be empty.
  if (!cells[5] || cells[5] === "—")
    err(d.file, `E22 ${id}: no addressee — a demand addressed to nobody is a note`);
  if (!cells[6] || cells[6] === "—")
    err(d.file, `E22 ${id}: nothing is required — "More detail" is not a demand`);
}

const PROVENANCE_FIELDS = ["prompt_id", "prompt_version", "model", "generated_at"] as const;
const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
/** field → how many artefacts answer it `UNKNOWN` (W6). */
const unknownProvenance = new Map<string, number>(PROVENANCE_FIELDS.map((f) => [f, 0]));
let provenanceSubjects = 0;

const checkProvenance = (d: Doc, id: string) => {
  provenanceSubjects += 1;
  const p = d.frontmatter?.ai_provenance;
  if (typeof p !== "object" || p === null || Array.isArray(p)) {
    err(d.file, `E17 ${id}: no ai_provenance. Both contracts: "Every record additionally carries \`ai_provenance\`".`);
    return;
  }
  const record = p as Record<string, unknown>;
  for (const extra of Object.keys(record))
    if (!(PROVENANCE_FIELDS as readonly string[]).includes(extra))
      err(d.file, `E17 ${id}: ai_provenance.${extra} is not one of ${PROVENANCE_FIELDS.join(", ")}`);
  for (const field of PROVENANCE_FIELDS) {
    const value = record[field];
    if (typeof value !== "string" || !value.trim()) {
      err(d.file, `E17 ${id}: ai_provenance.${field} is ${JSON.stringify(value ?? null)}, not a string`);
      continue;
    }
    if (value === "UNKNOWN") {
      unknownProvenance.set(field, unknownProvenance.get(field)! + 1);
      continue;
    }
    if (field === "generated_at" && !RFC3339.test(value))
      err(d.file, `E17 ${id}: ai_provenance.generated_at "${value}" is neither UNKNOWN nor an RFC-3339 date-time`);
  }
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
  /\/(ssd|sources|glossary|questions|traceability|contracts|policy)\/(?!README).+\.md$/,
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
const confDefs = new Set<string>();
const demDefs = new Set<string>();
/** The chain's upper two levels, and what each one links to (E24–E26, W9). */
const goalDefs = new Map<string, { parent: string | null; scope: string }>();
const needDefs = new Map<string, { goals: string[]; stakeholder: string }>();
const reqNeeds = new Map<string, string[]>();
/** The specification document the chain answers to, and the stakeholders it lists. */
let ssdIdentifier = "";
let ssdStakeholders: string[] = [];

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
      checkProvenance(d, id);
      checkFitCriterion(d, id);
      checkLocator(d, id);
      collectDeviations(d, id);
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
      const suff = d.frontmatter?.evidence_sufficiency;
      if (!statement) err(d.file, `E3 ${id}: empty statement`);
      if (d.frontmatter?.source === undefined) err(d.file, `E3 ${id}: no source`);
      // E24: the requirement shell's `needs` is required with `minItems: 1` —
      // "At least one. A requirement without a need is a defect of the run,
      // not of the source." `UNKNOWN` is the contract's own value for a field
      // the input does not support, and W9 counts it rather than hiding it.
      const needs = d.frontmatter?.needs;
      if (!Array.isArray(needs) || needs.length < 1) {
        err(d.file, `E24 ${id}: needs is ${JSON.stringify(needs ?? null)}, not a list of at least one`);
      } else {
        reqNeeds.set(id, needs.map(String));
        for (const n of needs)
          if (typeof n !== "string" || (n !== "UNKNOWN" && !NEED_ID.test(n)))
            err(d.file, `E24 ${id}: needs entry ${JSON.stringify(n)} is neither a NEED id nor UNKNOWN`);
      }
      if (typeof suff !== "string" || !SUFFICIENCY.has(suff))
        err(d.file, `E3 ${id}: sufficiency ${JSON.stringify(suff ?? null)} is not one of ${list(SUFFICIENCY)}`);
      else sufficiencyOf.set(id, suff);
      // E4: S3 needs a decision anchor in the artefact itself
      // The decision anchor may sit in the statement, in the `## Source`
      // section that carries the references the contract's single locator
      // has no room for, or in the locator itself (DEC-0097).
      if (suff === "S3" && !/(DEC-\d{4}|ADR-\d{3}|ADR-00\d)/.test(d.raw)) {
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
  if (/\/conflicts\/CONF-\d{4}--/.test(d.file)) {
    const id = d.frontmatter?.id;
    if (typeof id === "string" && CONFLICT_ID.test(id)) {
      if (confDefs.has(id)) err(d.file, `E21 duplicate conflict id ${id}`);
      confDefs.add(id);
      const fileId = rel(d.file).match(/\/(CONF-\d{4})--/)?.[1];
      if (id !== fileId) err(d.file, `E21 frontmatter id ${id} does not match file name ${fileId}`);
      checkProvenance(d, id);
      checkConflict(d, id);
    } else err(d.file, "E21 conflict without valid frontmatter id (CONF-####)");
  }
  if (/\/goals\/GOAL-[A-Z]+-\d{4}\.md$/.test(d.file)) {
    const id = String(d.frontmatter?.id ?? "");
    if (!GOAL_ID.test(id)) {
      err(d.file, "E26 goal without valid frontmatter id (GOAL-<DOMAIN>-####)");
    } else if (goalDefs.has(id)) {
      err(d.file, `E26 duplicate goal id ${id}`);
    } else {
      if (!rel(d.file).endsWith(`/${id}.md`)) err(d.file, `E26 ${id}: file name does not carry the identifier`);
      for (const field of goalContract.fields)
        if (d.frontmatter?.[field] === undefined)
          err(d.file, `E26 ${id}: no \`${field}\` — @leafcutter-os/schemas' goalSchema requires it`);
      if (d.frontmatter?.level !== "L1") err(d.file, `E26 ${id}: level is ${JSON.stringify(d.frontmatter?.level ?? null)}, not L1`);
      const parent = d.frontmatter?.contributes_to;
      goalDefs.set(id, { parent: typeof parent === "string" ? parent : null, scope: String(d.frontmatter?.scope ?? "") });
      statuses.push([d.file, id, String(d.frontmatter?.status ?? "?")]);
      checkVersion(d, id);
    }
  }
  if (/\/needs\/NEED-[A-Z]+-\d{4}\.md$/.test(d.file)) {
    const id = String(d.frontmatter?.id ?? "");
    if (!NEED_ID.test(id)) {
      err(d.file, "E25 need without valid frontmatter id (NEED-<DOMAIN>-####)");
    } else if (needDefs.has(id)) {
      err(d.file, `E25 duplicate need id ${id}`);
    } else {
      if (!rel(d.file).endsWith(`/${id}.md`)) err(d.file, `E25 ${id}: file name does not carry the identifier`);
      for (const field of needContract.fields)
        if (d.frontmatter?.[field] === undefined)
          err(d.file, `E25 ${id}: no \`${field}\` — @leafcutter-os/schemas' needSchema requires it`);
      if (d.frontmatter?.level !== "L2") err(d.file, `E25 ${id}: level is ${JSON.stringify(d.frontmatter?.level ?? null)}, not L2`);
      const goals = d.frontmatter?.goals;
      if (!Array.isArray(goals) || goals.length < 1)
        err(d.file, `E25 ${id}: goals is ${JSON.stringify(goals ?? null)} — a need names at least one goal`);
      needDefs.set(id, {
        goals: Array.isArray(goals) ? goals.map(String) : [],
        stakeholder: String(d.frontmatter?.stakeholder ?? ""),
      });
      statuses.push([d.file, id, String(d.frontmatter?.status ?? "?")]);
      checkVersion(d, id);
    }
  }
  if (/demand-register\.md$/.test(d.file)) {
    for (const line of d.body.split("\n")) {
      const m = line.match(new RegExp(`^\\|\\s*(${bare(DEMAND_ID)})\\s*\\|`));
      if (!m) continue;
      if (demDefs.has(m[1])) err(d.file, `E22 duplicate demand id ${m[1]}`);
      demDefs.add(m[1]);
      checkDemand(d, m[1], line);
    }
  }
  if (/open-questions\.md$/.test(d.file)) {
    for (const m of d.body.matchAll(new RegExp(`^\\|\\s*(${bare(QUESTION_ID)})\\s*\\|`, "gm"))) qDefs.add(m[1]);
  }
  if (/source-inventory\.md$/.test(d.file)) {
    /**
     * The inventory carries two tables keyed by source id: the register, and
     * the six-dimension quality vectors DEC-0098 added. They are read
     * separately — `## Quality vectors` opens the second.
     */
    const [register, vectors] = d.body.split(/^## Quality vectors$/m);
    for (const line of register.split("\n")) {
      const m = line.match(new RegExp(`^\\|\\s*(${bare(SOURCE_ID)})\\s*\\|`));
      if (!m) continue;
      srcDefs.add(m[1]);
      // E13: the trust vocabulary belongs to the source-inventory contract
      const trust = line.split("|").map((c) => c.trim())[4];
      if (!SOURCE_TRUST.has(trust ?? ""))
        err(d.file, `E13 ${m[1]}: trust "${trust ?? ""}" is not one of ${list(SOURCE_TRUST)}`);
      else assertedTrust.set(m[1], trust);
    }
    for (const line of (vectors ?? "").split("\n")) {
      const m = line.match(new RegExp(`^\\|\\s*(${bare(SOURCE_ID)})\\s*\\|`));
      if (!m) continue;
      checkQualityVector(d, m[1], line);
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
    checkProvenance(d, String(d.frontmatter?.id ?? "?"));
  }
  if (/\.ssd\.md$/.test(d.file)) {
    const ssdId = String(d.frontmatter?.id ?? "?");
    ssdIdentifier = ssdId;
    // The specification-document contract's `stakeholders[]`: "Who holds a
    // position, in which role, with what mandate. A need may only name a
    // stakeholder listed here." E25 reads the list from here and nowhere else.
    const declared = d.frontmatter?.stakeholders;
    if (!Array.isArray(declared) || declared.length < 1)
      err(d.file, `E25 ${ssdId}: no stakeholders[] — a need may only name a stakeholder the specification lists`);
    else ssdStakeholders = declared.map(String);
    checkVersion(d, ssdId);
    // The specification document carries a status too, and `decision_policy_ref`
    // is the contract's own field for the policy that governs it (DEC-0088).
    statuses.push([d.file, ssdId, String(d.frontmatter?.status ?? "?")]);
  }
  if (/glossary\.md$/.test(d.file)) {
    for (const m of d.body.matchAll(new RegExp(`^\\|\\s*(${bare(GLOSSARY_ID)})\\s*\\|`, "gm"))) glDefs.add(m[1]);
  }
  // The decision policy that binds this repository (E15, W5).
  if (typeof d.frontmatter?.id === "string" && POLICY_ID.test(d.frontmatter.id as string)) {
    policies.push(d);
  }
  // contracts register may define an SRC id in frontmatter
  if (/\/contracts\//.test(d.file) && typeof d.frontmatter?.id === "string" && SOURCE_ID.test(d.frontmatter.id as string)) {
    srcDefs.add(d.frontmatter.id as string);
  }
}

// ── E27: a recorded deviation names a line and a demand ──────────────────

for (const [id, lines] of [...deviations].sort()) {
  const file = reqDefs.get(id) ?? id;
  for (const line of lines) {
    if (!DEVIATION_LOCATOR.test(line))
      err(file, `E27 ${id}: a Deviation: line names no position — "<file>#L…" is what makes the contradicted line checkable (DEC-0104 §2)`);
    const demands = [...line.matchAll(new RegExp(bare(DEMAND_ID), "g"))].map((m) => m[0]);
    if (!demands.length)
      err(file, `E27 ${id}: a Deviation: line names no DEM-#### — a deviation with no demand against the source is the silent override DEC-0104 ends`);
    for (const dem of demands)
      if (!demDefs.has(dem)) err(file, `E27 ${id}: Deviation: names ${dem}, which the demand register does not hold`);
  }
}

// ── E5: every REFERENCE resolves ─────────────────────────────────────────

const REF_PATTERNS: Array<[RegExp, (id: string) => boolean, string, boolean?]> = [
  [scanner(REQUIREMENT_ID), (id) => reqDefs.has(id), "requirement"],
  [scanner(DECISION_ID), (id) => decDefs.has(id), "decision"],
  [scanner(QUESTION_ID), (id) => qDefs.has(id), "question"],
  [scanner(SOURCE_ID), (id) => srcDefs.has(id), "source"],
  [scanner(TACTICAL_ID), (id) => tsDefs.has(id), "tactical spec"],
  [scanner(GLOSSARY_ID), (id) => glDefs.has(id), "glossary term"],
  [scanner(CONFLICT_ID), (id) => confDefs.has(id), "conflict"],
  [scanner(DEMAND_ID), (id) => demDefs.has(id), "demand"],
  [scanner(GOAL_ID), (id) => goalDefs.has(id), "goal", true],
  [scanner(NEED_ID), (id) => needDefs.has(id), "need", true],
];

/**
 * The fourth element: skip block quotations for this family.
 *
 * `method-identifier-and-locator-schema` composes its worked example as
 * `NEED-ACC-0004`, and DEC-0086 quotes that procedure verbatim. `ACC` is not
 * a domain of this repository and the quotation is not a citation — it is the
 * method saying what an identifier looks like. The exemption is only for the
 * two families whose contracts ship such an example, and only inside a
 * quotation, so a real citation outside one is still checked.
 */
const unquoted = (raw: string) => raw.split("\n").filter((l) => !/^\s*>/.test(l)).join("\n");

/**
 * The identifier map is the generated record of the rename (DEC-0086): it holds
 * every identifier this repository had *before* the migration beside the one it
 * has now, so it is the one file whose left-hand column is meant not to resolve.
 * Generated by `scripts/migrate-identifiers.mjs --emit-map`, never hand-edited.
 */
const GENERATED = /\/traceability\/identifier-map\.md$/;

/**
 * Identifiers a later decision retired (DEC-0087).
 *
 * A reclassification changes an identifier's type token and keeps its number
 * — never a renumber, which the method forbids outright. The artefact under
 * the old id no longer exists, but the decision record that retired it has
 * to be able to name it, or the record cannot say what it changed. The
 * `## Retired identifiers` table of the identifier map is the register; a
 * decision record may cite a row of it, and nothing else may.
 */
const retired = new Set(
  [...(docs.find((d) => GENERATED.test(d.file))?.raw ?? "")
    .split(/^## Retired identifiers$/m)[1]
    ?.split(/^## /m)[0]
    ?.matchAll(/^\|\s*`([A-Z]+-[A-Z]+-\d{4})`\s*\|/gm) ?? []].map((m) => m[1]),
);
/**
 * The two record kinds that may name a retired identifier.
 *
 * A decision record has to, or it cannot say what it changed (DEC-0086 §5).
 * A conflict record has the same need for the same reason: it records a
 * contradiction that was had, between the artefacts that had it, and several
 * of those artefacts were split or reclassified by the decision that resolved
 * it. A conflict record naming the survivors instead would be a record of a
 * conflict nobody had.
 *
 * The demand register has it once, and narrowly: one demand asks for two
 * dangling citations to be repointed, and it cannot ask for that without
 * naming them. `method-demand-recording` is explicit that "'More detail' is
 * not a demand".
 *
 * This is *not* the set of documents that can anchor a status move — that is
 * `DECISION_RECORD` below, and the two are deliberately different: a conflict
 * record says what collided, never what was decided.
 */
const NAMES_RETIRED = /\/(?:decisions\/DEC-\d{4}--|conflicts\/CONF-\d{4}--|demands\/demand-register\.md$)/;

/** An ADR of this repository. E7 indexes these; E15 no longer anchors on them. */
const DECISION_RECORD = /\/decisions\/DEC-\d{4}--/;

for (const d of docs) {
  if (GENERATED.test(d.file)) continue;
  for (const [re, exists, kind, skipQuotes] of REF_PATTERNS) {
    for (const m of (skipQuotes ? unquoted(d.raw) : d.raw).matchAll(re)) {
      if (exists(m[0])) continue;
      if (NAMES_RETIRED.test(d.file) && retired.has(m[0])) continue;
      err(d.file, `E5 reference to unknown ${kind} ${m[0]}`);
    }
  }
}

// ── E23: the STRICT decision records ─────────────────────────────────────
//
// `SDR-<yyyy>-<mmdd>-<nnnn>.yaml` beside the ADRs in `specs/decisions/`, one
// YAML document under the key `decision_record`, immutable once written
// (DEC-0100). Two contracts type it and they disagree in two places; this
// repository takes the wider of each and records the deviation:
//
//   · the identifier. `@leafcutter-os/schemas` types `SDR-\d{4}-\d{4}-\d{4}`
//     and `library-schemas@0.4.1` types `SDR-\d{4}-\d{4}` — no sequence
//     number, so two decisions on one day collide. The four-group form is
//     taken, because "never reuse, never renumber" needs a unique id (CONF-0023).
//   · the executor mode. `library-schemas` enumerates HUMAN, AGENT_PROPOSE,
//     AGENT_BOUNDED and AUTO; `@leafcutter-os/schemas` enumerates HUMAN and
//     AGENT only, which cannot express the `AGENT_BOUNDED` row that
//     POL-GRADED-BY-IMPACT actually uses. The four-value enum is taken, and it
//     is the one the policy's own frontmatter declares (CONF-0024).

const SDR_ID = /^SDR-\d{4}-\d{4}-\d{4}$/;
const decisionRecord = contract("decision-record");
const SDR_STATUS = vocabulary(decisionRecord, "status");
const SDR_REQUIRED = [
  // library-schemas `required`, plus what `@leafcutter-os/schemas` adds.
  "id", "dp", "subject", "impact", "mode", "executor", "accountable",
  "criteria", "outcome", "status", "evidence_sufficiency",
  "rationale", "evidence", "timestamp", "supersedes", "recorded_by",
] as const;

interface Sdr { file: string; raw: string; id: string; dp: string; subject: string; mode: string }
const sdrs: Sdr[] = [];

for (const file of walk(join(SPECS_DIR, "decisions")).filter((f) => /\/SDR-[\d-]+\.yaml$/.test(f))) {
  const raw = readFileSync(file, "utf8");
  let doc: Record<string, unknown> | null = null;
  try {
    doc = (yaml.load(raw) as { decision_record?: Record<string, unknown> })?.decision_record ?? null;
  } catch (e) {
    err(file, `E23 not parseable YAML: ${(e as Error).message}`);
    continue;
  }
  if (!doc) { err(file, "E23 no `decision_record` key — the contract types one YAML document under it"); continue; }
  const id = String(doc.id ?? "");
  if (!SDR_ID.test(id)) err(file, `E23 id ${JSON.stringify(doc.id ?? null)} is not SDR-<yyyy>-<mmdd>-<nnnn>`);
  const fileId = rel(file).match(/\/(SDR-[\d-]+)\.yaml$/)?.[1];
  if (fileId !== id) err(file, `E23 ${id}: file name carries ${fileId}`);
  for (const field of SDR_REQUIRED)
    if (doc[field] === undefined) err(file, `E23 ${id}: no \`${field}\` — the contract requires it`);
  if (!SDR_STATUS.has(String(doc.status ?? "")))
    err(file, `E23 ${id}: status ${JSON.stringify(doc.status ?? null)} is not one of ${list(SDR_STATUS)}`);
  // "A record with any UNKNOWN criterion cannot approve; it escalates."
  const criteria = Array.isArray(doc.criteria) ? doc.criteria : [];
  const unknown = criteria.filter((c) => JSON.stringify(c).includes("UNKNOWN"));
  if (unknown.length && String(doc.outcome ?? "").toUpperCase().includes("APPROVE"))
    err(file, `E23 ${id}: ${unknown.length} criterion/criteria are UNKNOWN and the outcome approves — the contract escalates instead`);
  // Every piece of evidence is a locator in the same form E19 requires.
  for (const e of (Array.isArray(doc.evidence) ? doc.evidence : []) as Array<Record<string, unknown>>) {
    const where = String(e.loc ?? "");
    if (where !== "UNKNOWN" && !LOC_PATTERN.test(where))
      err(file, `E23 ${id}: evidence loc ${JSON.stringify(where)} is not <file>#L… / #P… / #¶… / #M…:…`);
    if (String(e.excerpt ?? "").trim().split(/\s+/).length > EXCERPT_MAX_WORDS)
      err(file, `E23 ${id}: an evidence excerpt is over the method's ${EXCERPT_MAX_WORDS} words`);
  }
  sdrs.push({ file, raw, id, dp: String(doc.dp ?? ""), subject: String(doc.subject ?? ""), mode: String(doc.mode ?? "") });
}

const sdrIds = new Set(sdrs.map((r) => r.id));
if (sdrIds.size !== sdrs.length) err("specs/decisions", "E23 two decision records share an identifier");

// ── E25/E26 across the chain, and W9 both ways ───────────────────────────
//
// `method-chain-linkage` step 1, verbatim: "Every requirement names at least
// one need; every need names at least one goal and one stakeholder listed in
// the specification; every goal falls inside scope." E24 did the first clause
// inside the requirement loop; the other two need the whole registry, so they
// run here.

for (const [id, need] of needDefs) {
  for (const g of need.goals)
    if (!goalDefs.has(g)) err("specs/needs", `E25 ${id}: names goal ${g}, which no goal document defines`);
  if (!ssdStakeholders.includes(need.stakeholder))
    err(
      "specs/needs",
      `E25 ${id}: stakeholder "${need.stakeholder}" is not one the specification lists ` +
        `(${ssdStakeholders.join(", ") || "none"})`,
    );
}

for (const [id, goal] of goalDefs) {
  // "every goal falls inside scope" — the goal names the specification
  // document whose scope it falls inside, and that document exists.
  if (!goal.scope || goal.scope !== ssdIdentifier)
    err("specs/goals", `E26 ${id}: scope is ${JSON.stringify(goal.scope || null)}, not the specification document ${ssdIdentifier || "(none)"}`);
  if (goal.parent && !goalDefs.has(goal.parent))
    err("specs/goals", `E26 ${id}: contributes_to ${goal.parent}, which no goal document defines`);
  if (goal.parent === id) err("specs/goals", `E26 ${id}: contributes_to itself`);
}

/**
 * W9 — the linkage report (`method-chain-linkage` steps 3 and 4).
 *
 * Five findings, each with the repair the method names, and coverage "as a
 * fraction with its numerator and denominator — never as a bare percentage".
 * A goal counts as covered when a need names it **or** when a goal that
 * contributes to it is covered: the parent chain is the hub's own
 * `contributes_to`, read not invented (DEC-0101 §3), and a business goal that
 * eleven conversion goals pay into is not an uncovered goal.
 */
const orphanRequirements = [...reqNeeds].filter(([, ns]) => ns.every((n) => n === "UNKNOWN")).map(([id]) => id).sort();
const needsWithARequirement = new Set<string>();
for (const ns of reqNeeds.values()) for (const n of ns) if (n !== "UNKNOWN") needsWithARequirement.add(n);
const uncoveredNeeds = [...needDefs.keys()].filter((n) => !needsWithARequirement.has(n)).sort();
const orphanNeeds = [...needDefs].filter(([, n]) => n.goals.length === 0).map(([id]) => id).sort();

const goalsNamedByANeed = new Set<string>();
for (const n of needDefs.values()) for (const g of n.goals) goalsNamedByANeed.add(g);
const coveredGoals = new Set(goalsNamedByANeed);
for (let moved = true; moved; ) {
  moved = false;
  for (const [id, goal] of goalDefs)
    if (goal.parent && coveredGoals.has(id) && !coveredGoals.has(goal.parent)) {
      coveredGoals.add(goal.parent);
      moved = true;
    }
}
const uncoveredGoals = [...goalDefs.keys()].filter((g) => !coveredGoals.has(g)).sort();

// ── E20: every registered source carries a vector ────────────────────────

const withoutVector = [...srcDefs].filter((id) => !vectorSources.has(id)).sort();
if (withoutVector.length)
  err(
    "specs/sources/source-inventory.md",
    `E20 ${withoutVector.length} source(s) carry no quality vector: ${withoutVector.join(", ")}`,
  );

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
//
// The scan set is what actually runs, read off the runners instead of listed
// here by hand (DEC-0096). Until wave 5 it was three hand-written pairs —
// `src/`, `e2e/` and the journey features — and three runners' worth of files
// were invisible to it although every one of them runs on every commit
// through the husky hook:
//
//   · `app/**/*.test.ts` and root-level `proxy.test.ts`, both in the root
//     Vitest config's `test.include` and both carrying criterion citations;
//   · `scripts/**/*.test.ts`, the second Vitest config behind
//     `check:static-tests`;
//   · the meter scripts the `check` chain invokes directly —
//     `check-contrast.ts`, `check-csp.ts` and `check-seo-budget.ts` are
//     meters in their own right, named as such by DEC-0095 §4.
//
// Reading the globs out of the configs rather than repeating them is the same
// move DEC-0085 §4 made for the controlled vocabularies: narrowing a runner
// narrows this scan, instead of the two drifting apart unnoticed.

const REPO_DIR = join(SPECS_DIR, "..");

/** `test.include` of a Vitest config file, in the order the config lists it. */
function vitestInclude(configFile: string): string[] {
  const raw = readFileSync(join(REPO_DIR, configFile), "utf8");
  const block = raw.match(/include:\s*\[([\s\S]*?)\]/)?.[1];
  if (!block) throw new Error(`${configFile}: no test.include to read`);
  return [...block.matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

/**
 * The `scripts/*.ts` entry points `pnpm check` runs, read out of the chain in
 * `package.json`. A meter that is not in the chain does not run on every
 * commit and does not count here — `check:terms` is the one such script, and
 * the criteria it names stay in W3 until something in the chain runs it.
 */
function checkChainMeters(): string[] {
  const pkg = JSON.parse(readFileSync(join(REPO_DIR, "package.json"), "utf8")) as {
    scripts: Record<string, string>;
  };
  return (pkg.scripts.check ?? "")
    .split("&&")
    .map((step) => step.trim().match(/^pnpm\s+(check:[\w-]+)$/)?.[1])
    .flatMap((name) => {
      const target = name ? pkg.scripts[name]?.match(/tsx\s+(scripts\/[\w.-]+\.ts)/)?.[1] : undefined;
      return target ? [target] : [];
    });
}

/** A `test.include` glob as an anchored matcher over repository-relative paths. */
function globMatcher(glob: string): RegExp {
  const body = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "\u0000")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0000/g, "(?:[^/]*/)*");
  return new RegExp(`^${body}$`);
}

/** Every existing file a glob names. A glob with no wildcard is one file. */
function expandGlob(glob: string): string[] {
  const full = join(REPO_DIR, glob);
  if (!glob.includes("*")) {
    try { return statSync(full).isFile() ? [full] : []; } catch { return []; }
  }
  const head = glob.slice(0, glob.indexOf("*"));
  const root = join(REPO_DIR, head.endsWith("/") ? head : dirname(head));
  const match = globMatcher(glob);
  try {
    return walk(root).filter((f) => match.test(rel(f)));
  } catch { return []; /* directory absent yet */ }
}

const testGlobs = [
  ...vitestInclude("vitest.config.mts"),
  ...vitestInclude("scripts/vitest.config.mts"),
  "e2e/**/*.spec.ts",
  "e2e/**/*.spec.tsx",
  "specs/verification/journeys/**/*.feature",
  ...checkChainMeters(),
];

const referencedIds = new Set<string>();
const scannedTestFiles = new Set<string>();
for (const glob of testGlobs) {
  for (const f of expandGlob(glob)) {
    if (scannedTestFiles.has(f)) continue;
    scannedTestFiles.add(f);
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
// ── E15: the policy binds every pair, and a status moves only at one ─────

/** The rules table of a policy document: `DP-nn` → mode per impact level. */
function policyRules(doc: Doc): Map<string, Record<string, string>> {
  const rules = new Map<string, Record<string, string>>();
  const section = doc.body.split(/^## Rules$/m)[1]?.split(/^## /m)[0] ?? "";
  for (const line of section.split("\n")) {
    const cells = line.split("|").map((c) => c.trim());
    const dp = cells[1]?.match(/^(DP-(?:\d{2}|P\d{2}))\b/)?.[1];
    if (!dp) continue;
    rules.set(dp, Object.fromEntries(IMPACT_LEVELS.map((lvl, i) => [lvl, cells[2 + i] ?? ""])));
  }
  return rules;
}

/**
 * A record that could have moved this artefact's status (DEC-0100).
 *
 * It is an **SDR**, not an ADR. `decision-record` types what an SDR holds —
 * the decision point, the subject with its version, every criterion of that
 * decision point with its evidence, the mode and executor copied off the
 * policy row, the bounds evaluated and the subject's evidence sufficiency at
 * the time — and an ADR has a slot for none of it. DEC-0100 argues that they
 * are two artefacts rather than one; the consequence for this check is that
 * a status off `DRAFT` is anchored by the record of the executed decision
 * point, and a `DEC-####` beside it is reasoning, not the anchor.
 *
 * There are no SDRs today, and that is the honest state: no decision point
 * has been executed under `POL-GRADED-BY-IMPACT` since it was bound, which
 * is the same finding DEC-0089 reported from the other side.
 */
const anchoredBy = (id: string, policyId: string) =>
  sdrs.find(
    (r) =>
      (r.subject === id || new RegExp(`(?<![A-Za-z0-9-])${id}(?![0-9A-Za-z-])`).test(r.raw)) &&
      r.raw.includes(policyId),
  );

let boundRules: Map<string, Record<string, string>> | null = null;
let boundPolicy: string | null = null;

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
} else if (policies.length > 1) {
  for (const d of policies)
    err(
      d.file,
      `E15 ${policies.length} policies bind this repository (${policies
        .map((p) => p.frontmatter?.id)
        .join(", ")}). A decision point resolves against exactly one; two is a pair with two rows.`,
    );
} else {
  const doc = policies[0];
  const fm = doc.frontmatter ?? {};
  boundPolicy = String(fm.id);

  // The frontmatter the decision-policy type declares.
  for (const field of ["title", "policy-owner", "modes", "conformance-level", "human-only"]) {
    if (fm[field] === undefined) err(doc.file, `E15 ${boundPolicy}: frontmatter is missing \`${field}\``);
  }
  const modes = new Set((fm.modes as string[] | undefined) ?? []);
  for (const m of modes) if (!EXECUTOR_MODES.has(m)) err(doc.file, `E15 ${boundPolicy}: "${m}" is not an executor mode`);
  const humanOnly = new Set((fm["human-only"] as string[] | undefined) ?? []);
  if (!humanOnly.has("DP-14"))
    err(doc.file, `E15 ${boundPolicy}: human-only must include DP-14 — a governance change is never an agent's`);

  // Every pair is bound, to a mode the frontmatter declares.
  const rules = policyRules(doc);
  boundRules = rules;
  for (const dp of DECISION_POINTS) {
    const row = rules.get(dp);
    if (!row) {
      err(doc.file, `E15 ${boundPolicy}: no rule for ${dp}. A decision point is never removed.`);
      continue;
    }
    for (const level of IMPACT_LEVELS) {
      const mode = row[level];
      if (!mode) err(doc.file, `E15 ${boundPolicy}: ${dp} has no mode at ${level} impact`);
      else if (!modes.has(mode))
        err(doc.file, `E15 ${boundPolicy}: ${dp} at ${level} is ${mode}, which the frontmatter does not declare`);
    }
    if (humanOnly.has(dp) && IMPACT_LEVELS.some((l) => row[l] !== "HUMAN"))
      err(doc.file, `E15 ${boundPolicy}: ${dp} is in human-only but its row is not HUMAN at every level`);
  }

  // A status off DRAFT needs the record that makes it auditable.
  for (const [file, id, status] of statuses) {
    if (status === "DRAFT") continue;
    if (!anchoredBy(id, boundPolicy))
      err(
        file,
        `E15 ${id}: status ${status} without a decision record naming ${id}, citing ${boundPolicy} ` +
          `and a decision point. @leafcutter-strict/method-decision-policy-resolution: "a record ` +
          `naming only the outcome cannot be audited against the policy".`,
      );
  }
}

// ── W5: what the bound policy resolves today, and what escalates ─────────
// Not a decision. The impact level is the floor the dependant count gives —
// "assigning the level from the dependants … is what makes it checkable" —
// and the method's regulated-domain rule can only raise it.

const dp03 = [...reqDefs.keys()]
  .filter((id) => covered.has(id) && GATE_S2.has(sufficiencyOf.get(id) ?? ""))
  .sort();
const dp09 = [...tsDefs]
  .filter((ts) => {
    const own = [...acDefs.keys()].filter((a) => a.startsWith(ts + "-"));
    return own.length > 0 && own.every((a) => referencedIds.has(a));
  })
  .sort();

if (!boundRules || !boundPolicy) {
  warnings.push(`W5 nothing is APPROVED or VERIFIED because no decision policy binds this repository (DEC-0085 §6).`);
  warnings.push(
    `   were one bound: ${dp03.length}/${reqDefs.size} requirements meet DP-03's evidence gate ` +
      `(>= S2 and covered by a tactical spec); ${dp09.length}/${tsDefs.size} tactical specs meet ` +
      `DP-09's (every acceptance criterion referenced by a test).`,
  );
} else {
  // Dependants, from the chain this repository has: a requirement's are the
  // tactical specs that implement it, a tactical spec's are its criteria.
  const dependants = new Map<string, number>();
  for (const id of reqDefs.keys()) dependants.set(id, 0);
  for (const d of docs.filter((d) => /\.tactical\.md$/.test(d.file))) {
    for (const r of ((d.frontmatter?.implements as string[] | undefined) ?? []))
      if (dependants.has(r)) dependants.set(r, dependants.get(r)! + 1);
  }
  for (const ts of tsDefs) dependants.set(ts, [...acDefs.keys()].filter((a) => a.startsWith(ts + "-")).length);

  const tally = (ids: string[]) => {
    const byLevel: Record<string, number> = {};
    for (const id of ids) {
      const level = impactFromDependants(dependants.get(id) ?? 0);
      byLevel[level] = (byLevel[level] ?? 0) + 1;
    }
    return IMPACT_LEVELS.filter((l) => byLevel[l]).map((l) => `${byLevel[l]} ${l.toLowerCase()}`).join(" · ");
  };
  const agentRow = (dp: string, ids: string[]) =>
    ids.filter((id) => (boundRules!.get(dp)?.[impactFromDependants(dependants.get(id) ?? 0)] ?? "HUMAN") !== "HUMAN");

  const reqIds = [...reqDefs.keys()];
  const tsIds = [...tsDefs];
  warnings.push(
    `W5 ${boundPolicy} binds this repository. Impact from the dependant count, which is the floor: ` +
      `requirements ${tally(reqIds)}; tactical specs ${tally(tsIds)}.`,
  );
  warnings.push(
    `   DP-03 requirement approval: ${agentRow("DP-03", reqIds).length}/${reqIds.length} on an agent row, ` +
      `${dp03.length} meet the >= S2 gate; DP-08 tactical approval: ${agentRow("DP-08", tsIds).length}/${tsIds.length} ` +
      `on an agent row; DP-09 verification acceptance is ${boundRules.get("DP-09")?.Low ?? "?"} at every level, ` +
      `${dp09.length}/${tsIds.length} would meet its gate.`,
  );
  warnings.push(
    `   everything else escalates to the accountable role. Evidence for a decision, never the decision.`,
  );
}

const chainLine = (label: string, ids: string[], of: number, repair: string) =>
  warnings.push(`   ${label}: ${ids.length}/${of}${ids.length ? ` — ${ids.join(", ")} · ${repair}` : ""}`);

warnings.push(
  `W9 chain linkage (method-chain-linkage). Upward: ${reqNeeds.size - orphanRequirements.length}/${reqNeeds.size} ` +
    `requirements name a need, ${needDefs.size - orphanNeeds.length}/${needDefs.size} needs name a goal, ` +
    `${goalDefs.size}/${goalDefs.size} goals name the specification. Downward: ` +
    `${needsWithARequirement.size}/${needDefs.size} needs have a requirement, ` +
    `${coveredGoals.size}/${goalDefs.size} goals have a need below them, directly or through contributes_to.`,
);
chainLine("orphan requirement", orphanRequirements, reqNeeds.size, "find the need, or withdraw the requirement");
chainLine("orphan need", orphanNeeds, needDefs.size, "find the goal, or question the need");
chainLine("uncovered need", uncoveredNeeds, needDefs.size, "the need is unimplemented — or unnoticed");
chainLine("uncovered goal", uncoveredGoals, goalDefs.size, "the goal is aspiration, not work");
warnings.push(
  `   unverified requirement: the method's fifth finding is W7 and W3 below — ` +
    `${fitUnknown}/${fitMeasured + fitUnknown} requirements have no test below their fit criterion. ` +
    `It is counted once, there.`,
);

const deviationLines = [...deviations.values()].reduce((n, l) => n + l.length, 0);
warnings.push(
  `W10 recorded deviations: ${deviationLines} on ${deviations.size}/${reqDefs.size} requirements. ` +
    `DEC-0104: the specification carries the truth, and the deviation is recorded — on the artefact and as a demand.`,
);
if (unrecordedDeviations.length) {
  warnings.push(
    `   ${unrecordedDeviations.length} state a contradiction with the source in prose while no Deviation: line records it: ` +
      `${unrecordedDeviations.sort().join(", ")} · record it, or reword the Finding so it stops claiming one`,
  );
}

warnings.push(
  `W8 source locator: ${locResolved}/${locResolved + locUnknown} requirements resolve to a position in their source; ` +
    `${locUnknown} carry UNKNOWN because the source supports no position scheme or names no document. ` +
    `method-identifier-and-locator-schema reports an unlocatable source as a defect of the source.`,
);

warnings.push(
  `W7 fit_criterion: ${fitMeasured}/${fitMeasured + fitUnknown} requirements carry a measure, ` +
    `${fitUnknown} carry UNKNOWN because no acceptance criterion of theirs is referenced by a test. ` +
    `POL-GRADED-BY-IMPACT bound 2 escalates on an unknown criterion.`,
);

const unknownFields = [...unknownProvenance].filter(([, n]) => n > 0);
if (unknownFields.length) {
  warnings.push(
    `W6 ai_provenance is on ${provenanceSubjects}/${provenanceSubjects} artefacts; ` +
      `${unknownFields.map(([f, n]) => `${f} UNKNOWN on ${n}`).join(" · ")}. ` +
      `POL-GRADED-BY-IMPACT bound 3 escalates where the separation of duties cannot be checked.`,
  );
}

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

console.log(`specs check: ${files.length} files · ${goalDefs.size} goals · ${needDefs.size} needs · ${reqDefs.size} requirements · ${decDefs.size} decisions · ${qDefs.size} questions · ${srcDefs.size} sources · ${tsDefs.size} tactical specs · ${glDefs.size} glossary terms · ${acDefs.size} acceptance criteria · ${confDefs.size} conflicts · ${demDefs.size} demands · ${sdrs.length} decision records`);
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
