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
 *  E2  Requirement IDs (WEB-F/Q/C-###) unique across all files
 *  E3  Requirement rows carry 4 cells: id · statement · source · S0–S3
 *  E4  Sufficiency S3 requires a DEC-### or ADR-### token in the row
 *  E5  Every referenced ID (WEB-*, DEC-*, Q-*, SRC-*, TS-*, GL-*) exists
 *  E6  Tactical `implements:` ↔ Coverage table match bidirectionally
 *  E7  decisions/README.md index ↔ decision files match both ways
 *  W1  (warning) requirements not covered by any tactical spec
 *
 * Exit code: number of errors (0 = green). Warnings never fail the run.
 *
 * TODO(migration): This checker is an interim, repo-local implementation.
 * It will be migrated to a Leafcutter validator (LeafcutterOS) so the
 * checks are shared, versioned, and consumed as a package instead of
 * being maintained here. Per STRICT's tier model, deterministic checks
 * belong to shared tooling (`strict-core`), not to a consumer repository
 * — keep this script free of website-specific assumptions so the rule
 * set lifts out cleanly.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPECS_DIR = join(__dirname, "..", "specs");

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
  /\/decisions\/\d{3}-.+\.md$/,
  /\/(ssd|sources|glossary|questions|traceability|contracts)\/(?!README).+\.md$/,
];

for (const d of docs) {
  if (NEEDS_FRONTMATTER.some((re) => re.test(d.file)) && !d.frontmatter) {
    err(d.file, "E1 missing or unparsable frontmatter");
  }
}

// ── Registries: where IDs are DEFINED ────────────────────────────────────

const reqDefs = new Map<string, string>(); // WEB-x-### → file
const decDefs = new Set<string>();
const qDefs = new Set<string>();
const srcDefs = new Set<string>();
const tsDefs = new Set<string>();
const glDefs = new Set<string>();

const REQ_ROW = /^\|\s*(WEB-[FQC]-\d{3})\s*\|(.+)$/;

for (const d of docs) {
  if (/\.req\.md$/.test(d.file)) {
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
      if (!/^S[0-3]$/.test(suff)) err(d.file, `E3 ${id}: sufficiency "${suff}" is not S0–S3`);
      if (!source) err(d.file, `E3 ${id}: empty source cell`);
      // E4: S3 needs a decision anchor in the row itself
      if (suff === "S3" && !/(DEC-\d{3}|ADR-\d{3}|ADR-00\d)/.test(statement + " " + source)) {
        err(d.file, `E4 ${id}: S3 without DEC/ADR reference in the row`);
      }
    }
  }
  if (/\/decisions\/\d{3}-/.test(d.file)) {
    const id = d.frontmatter?.id;
    if (typeof id === "string" && /^DEC-\d{3}$/.test(id)) {
      decDefs.add(id);
      const fileNum = rel(d.file).match(/\/(\d{3})-/)?.[1];
      if (fileNum && id !== `DEC-${fileNum}`) err(d.file, `E1 frontmatter id ${id} does not match filename number ${fileNum}`);
    } else {
      err(d.file, "E1 decision without valid frontmatter id (DEC-###)");
    }
  }
  if (/open-questions\.md$/.test(d.file)) {
    for (const m of d.body.matchAll(/^\|\s*(Q-\d{3})\s*\|/gm)) qDefs.add(m[1]);
  }
  if (/source-inventory\.md$/.test(d.file)) {
    for (const m of d.body.matchAll(/^\|\s*(SRC-\d{3})\s*\|/gm)) srcDefs.add(m[1]);
  }
  if (/\.tactical\.md$/.test(d.file)) {
    const id = d.frontmatter?.id;
    if (typeof id === "string" && /^TS-\d{3}$/.test(id)) tsDefs.add(id);
    else err(d.file, "E1 tactical spec without valid frontmatter id (TS-###)");
  }
  if (/glossary\.md$/.test(d.file)) {
    for (const m of d.body.matchAll(/^\|\s*(GL-\d{3})\s*\|/gm)) glDefs.add(m[1]);
  }
  // contracts register may define an SRC id in frontmatter
  if (/\/contracts\//.test(d.file) && typeof d.frontmatter?.id === "string" && /^SRC-\d{3}$/.test(d.frontmatter.id as string)) {
    srcDefs.add(d.frontmatter.id as string);
  }
}

// ── E5: every REFERENCE resolves ─────────────────────────────────────────

const REF_PATTERNS: Array<[RegExp, (id: string) => boolean, string]> = [
  [/WEB-[FQC]-\d{3}/g, (id) => reqDefs.has(id), "requirement"],
  [/DEC-\d{3}/g, (id) => decDefs.has(id), "decision"],
  [/(?<![A-Z]-)\bQ-\d{3}\b/g, (id) => qDefs.has(id), "question"],
  [/SRC-\d{3}/g, (id) => srcDefs.has(id), "source"],
  [/\bTS-\d{3}\b/g, (id) => tsDefs.has(id), "tactical spec"],
  [/\bGL-\d{3}\b/g, (id) => glDefs.has(id), "glossary term"],
];

for (const d of docs) {
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
  const covIds = new Set([...covSection.matchAll(/^\|\s*(WEB-[FQC]-\d{3})/gm)].map((m) => m[1]));
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
  const indexed = new Set([...decReadme.raw.matchAll(/\[DEC-(\d{3})/g)].map((m) => `DEC-${m[1]}`));
  for (const id of decDefs) if (!indexed.has(id)) err(decReadme.file, `E7 ${id} exists as file but is missing from the index`);
  for (const id of indexed) if (!decDefs.has(id)) err(decReadme.file, `E7 index lists ${id} but no such decision file exists`);
}

// ── W1: uncovered requirements (report, not failure) ─────────────────────

const uncovered = [...reqDefs.keys()].filter((id) => !covered.has(id)).sort();
if (uncovered.length) {
  warnings.push(`W1 ${uncovered.length}/${reqDefs.size} requirements not yet covered by a tactical spec:`);
  warnings.push(`   ${uncovered.join(", ")}`);
}

// ── Report ───────────────────────────────────────────────────────────────

console.log(`specs check: ${files.length} files · ${reqDefs.size} requirements · ${decDefs.size} decisions · ${qDefs.size} questions · ${srcDefs.size} sources · ${tsDefs.size} tactical specs · ${glDefs.size} glossary terms`);
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
