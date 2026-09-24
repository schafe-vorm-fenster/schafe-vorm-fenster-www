#!/usr/bin/env node
/**
 * STRICT identifier and file-name migration (DEC-0086)
 *
 * One rule, applied mechanically, so the rename is reviewable rather than
 * hopeful. `@leafcutter-strict/method-identifier-and-locator-schema` composes
 * an identifier as `<TYPE>-<DOMAIN>-<NNNN>` (its own example: `NEED-ACC-0004`)
 * and starts numbering at `0001`. The type tokens come from the installed
 * contracts — `FUN|NFR|CON|BUS` and `TS` from
 * `@leafcutter-strict/library-schemas`, `SRC`, `CONF`, `DEM`, `GOAL`, `NEED`
 * from `@leafcutter-os/schemas/spec` — and the domain token appears exactly
 * where those schemas carry one: on the chain artefacts, not on the
 * cross-cutting registers.
 *
 *   node scripts/migrate-identifiers.mjs --emit-map   writes the mapping table
 *   node scripts/migrate-identifiers.mjs --apply      rewrites ids and renames files
 *   node scripts/migrate-identifiers.mjs --verify     counts what is left
 *
 * Numbers are never reassigned: `WEB-F-007` becomes `FUN-WEB-0007`, the same
 * artefact with the same number, widened to the four digits the method fixes.
 */

import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const git = (...args) => execFileSync("git", args, { cwd: ROOT, maxBuffer: 1 << 28 }).toString("utf8");

/** Files whose pre-existing working-tree modifications must not be committed. */
const UNTOUCHED = new Set([
  "concept/v1.0/Wireframes Mobile.dc.html",
  "concept/website-content-production.concept.md",
]);

/** The mapping this migration writes, and the script that applies it, keep the old ids by design. */
const MAP_FILE = "specs/traceability/identifier-map.md";
const SELF = "scripts/migrate-identifiers.mjs";

/**
 * Records of decisions already taken keep their prose. Their concrete id
 * citations migrate (or the reference graph breaks); the `###` sketches of the
 * old scheme inside them do not, because they describe what was true then.
 */
const KEEP_SCHEME_SKETCH = (f) =>
  f.startsWith("plan/reviews/") ||
  f.startsWith("state/") ||
  f.startsWith("reports/") ||
  /^specs\/decisions\/(023|085|DEC-0023|DEC-0085)/.test(f);

// ── The rule ─────────────────────────────────────────────────────────────

const CLASS = { F: "FUN", Q: "NFR", C: "CON" };
const pad4 = (n) => String(Number(n)).padStart(4, "0");

/** Old id → new id, derived, never listed by hand. */
export function newId(old) {
  let m;
  if ((m = /^WEB-([FQC])-(\d{3})$/.exec(old))) return `${CLASS[m[1]]}-WEB-${pad4(m[2])}`;
  if ((m = /^TS-(\d{3})-A(\d+)$/.exec(old))) return `TS-WEB-${pad4(m[1])}-A${m[2]}`;
  if ((m = /^TS-(\d{3})$/.exec(old))) return `TS-WEB-${pad4(m[1])}`;
  if ((m = /^DEC-(\d{3})$/.exec(old))) return `DEC-${pad4(m[1])}`;
  if ((m = /^Q-(\d{3})$/.exec(old))) return `Q-${pad4(m[1])}`;
  if ((m = /^SRC-(\d{3})$/.exec(old))) return `SRC-${pad4(m[1])}`;
  if ((m = /^GL-(\d{3})$/.exec(old))) return `GL-${pad4(m[1])}`;
  if (old === "SSD-WEB") return "SSD-WEB-0001";
  throw new Error(`no rule for ${old}`);
}

/** Every concrete id of the old scheme, longest alternative first. */
export const OLD_ID =
  /(?<![A-Za-z0-9-])(TS-\d{3}-A\d+|WEB-[FQC]-\d{3}|TS-\d{3}|DEC-\d{3}|Q-\d{3}|SRC-\d{3}|GL-\d{3}|SSD-WEB)(?![0-9A-Za-z-])/g;

/** The `###` sketches that documentation uses to name a family. */
const OLD_SKETCH = /(?<![A-Za-z0-9-])(TS-###-A#|WEB-[FQC]-###|TS-###|DEC-###|Q-###|SRC-###|GL-###)(?![#0-9A-Za-z-])/g;
const SKETCH = {
  "WEB-F-###": "FUN-WEB-####",
  "WEB-Q-###": "NFR-WEB-####",
  "WEB-C-###": "CON-WEB-####",
  "TS-###-A#": "TS-WEB-####-A#",
  "TS-###": "TS-WEB-####",
  "DEC-###": "DEC-####",
  "Q-###": "Q-####",
  "SRC-###": "SRC-####",
  "GL-###": "GL-####",
};

// ── The files this migration may touch ───────────────────────────────────

function tracked() {
  return git("ls-files", "-z").split("\0").filter(Boolean).filter((f) => {
    if (UNTOUCHED.has(f)) return false;
    let st;
    try { st = lstatSync(join(ROOT, f)); } catch { return false; }
    return st.isFile() && !st.isSymbolicLink();
  });
}

const isText = (buf) => !buf.includes(0);

// ── File renames: a file that holds one identified artefact is named for it ──

/** old path → new path. */
function fileRenames() {
  const renames = new Map();
  for (const f of tracked()) {
    let m;
    if ((m = /^specs\/decisions\/(\d{3})-(.+)\.md$/.exec(f))) {
      renames.set(f, `specs/decisions/DEC-${pad4(m[1])}--${m[2]}.md`);
      continue;
    }
    if (/^specs\/tactical\/.*\.tactical\.md$/.test(f)) {
      const id = /^id:\s*(\S+)/m.exec(readFileSync(join(ROOT, f), "utf8"))?.[1];
      if (!id || !/^TS-\d{3}$/.test(id)) continue;
      renames.set(f, `${dirname(f)}/${newId(id)}--${basename(f)}`);
    }
  }
  return renames;
}

// ── Modes ────────────────────────────────────────────────────────────────

function collect() {
  const counts = new Map();
  for (const f of tracked()) {
    const buf = readFileSync(join(ROOT, f));
    if (!isText(buf)) continue;
    for (const m of buf.toString("utf8").matchAll(OLD_ID)) counts.set(m[1], (counts.get(m[1]) ?? 0) + 1);
  }
  return counts;
}

function familyOf(id) {
  if (/^WEB-F-/.test(id)) return ["requirement · functional", "FUN-WEB-<NNNN>"];
  if (/^WEB-Q-/.test(id)) return ["requirement · quality", "NFR-WEB-<NNNN>"];
  if (/^WEB-C-/.test(id)) return ["requirement · constraint", "CON-WEB-<NNNN>"];
  if (/^TS-\d{3}-A/.test(id)) return ["acceptance criterion", "TS-WEB-<NNNN>-A<n>"];
  if (/^TS-/.test(id)) return ["tactical specification", "TS-WEB-<NNNN>"];
  if (/^DEC-/.test(id)) return ["decision record", "DEC-<NNNN>"];
  if (/^Q-/.test(id)) return ["open question", "Q-<NNNN>"];
  if (/^SRC-/.test(id)) return ["source", "SRC-<NNNN>"];
  if (/^GL-/.test(id)) return ["glossary term", "GL-<NNNN>"];
  return ["specification document", "SSD-WEB-<NNNN>"];
}

function emitMap() {
  const counts = [...collect()].sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }));
  const renames = [...fileRenames()].sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }));
  const today = new Date().toISOString().slice(0, 10);
  const byFamily = new Map();
  for (const [id, n] of counts) {
    const [family, shape] = familyOf(id);
    const e = byFamily.get(family) ?? { shape, ids: 0, cites: 0 };
    e.ids++; e.cites += n; byFamily.set(family, e);
  }
  const out = [
    "---",
    "artefact: identifier-map",
    "status: DRAFT",
    `date: ${today}`,
    "decisions: [DEC-0086]",
    "generated_by: scripts/migrate-identifiers.mjs",
    "---",
    "",
    "# Identifier map",
    "",
    "## Purpose",
    "",
    "Every identifier this repository held before DEC-0086, against the one it",
    "holds now. Generated by `scripts/migrate-identifiers.mjs --emit-map`, never",
    "edited by hand: the new id is derived from the old one by rule, so this",
    "table is a record of the rename, not its source.",
    "",
    "This is the one file in the repository where the old identifier forms still",
    "appear. That is what it is for.",
    "",
    "## The rule",
    "",
    "`@leafcutter-strict/method-identifier-and-locator-schema` composes an",
    "identifier as `<TYPE>-<DOMAIN>-<NNNN>` and starts numbering at `0001`. No",
    "number is reassigned here — `WEB-F-007` becomes `FUN-WEB-0007`, the same",
    "artefact with the same number, widened to four digits.",
    "",
    "| Artefact | Old | New | Type token from | Domain token |",
    "| --- | --- | --- | --- | --- |",
    "| Functional requirement | `WEB-F-<NNN>` | `FUN-WEB-<NNNN>` | `library-schemas` requirement-shell | yes |",
    "| Quality requirement | `WEB-Q-<NNN>` | `NFR-WEB-<NNNN>` | `library-schemas` requirement-shell | yes |",
    "| Constraint | `WEB-C-<NNN>` | `CON-WEB-<NNNN>` | `library-schemas` requirement-shell | yes |",
    "| Tactical specification | `TS-<NNN>` | `TS-WEB-<NNNN>` | `library-schemas` tactical-specification | yes |",
    "| Acceptance criterion | `TS-<NNN>-A<n>` | `TS-WEB-<NNNN>-A<n>` | local (the contract leaves the id free) | inherited |",
    "| Decision record | `DEC-<NNN>` | `DEC-<NNNN>` | local (`SDR` is a different artefact) | no |",
    "| Open question | `Q-<NNN>` | `Q-<NNNN>` | local (`DEM` is a different artefact) | no |",
    "| Source | `SRC-<NNN>` | `SRC-<NNNN>` | `@leafcutter-os/schemas` source id | no |",
    "| Glossary term | `GL-<NNN>` | `GL-<NNNN>` | local (the method defines none) | no |",
    "| Specification document | `SSD-WEB` | `SSD-WEB-0001` | local | yes |",
    "",
    "## Scale",
    "",
    "| Family | New shape | Identifiers | Citations |",
    "| --- | --- | --- | --- |",
    ...[...byFamily].map(([f, e]) => `| ${f} | \`${e.shape}\` | ${e.ids} | ${e.cites} |`),
    `| **total** | | **${counts.length}** | **${counts.reduce((a, [, n]) => a + n, 0)}** |`,
    "",
    "## Every identifier",
    "",
    "| Old | New | Citations |",
    "| --- | --- | --- |",
    ...counts.map(([id, n]) => `| \`${id}\` | \`${newId(id)}\` | ${n} |`),
    "",
    "## Every renamed file",
    "",
    "A file that holds exactly one identified artefact is named for that",
    "artefact, the way `@leafcutter-strict/library-schemas` names",
    "`CONF-0001--where-the-output-contracts-live.md`. Files that hold a register",
    "of many identifiers keep their topic names.",
    "",
    "| Old path | New path |",
    "| --- | --- |",
    ...renames.map(([a, b]) => `| \`${a}\` | \`${b}\` |`),
    "",
  ].join("\n");
  writeFileSync(join(ROOT, MAP_FILE), out);
  console.log(`${MAP_FILE}: ${counts.length} identifiers, ${renames.length} file renames`);
}

function apply() {
  const renames = fileRenames();
  const base = new Map();
  for (const [from, to] of renames) base.set(basename(from), basename(to));
  const bases = [...base.keys()].sort((a, b) => b.length - a.length);
  const baseRe = new RegExp(bases.map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");

  let touched = 0, ids = 0, sketches = 0, paths = 0;
  for (const f of tracked()) {
    if (f === MAP_FILE || f === SELF) continue;
    const buf = readFileSync(join(ROOT, f));
    if (!isText(buf)) continue;
    const before = buf.toString("utf8");
    let after = before.replace(baseRe, (m) => { paths++; return base.get(m); });
    after = after.replace(OLD_ID, (_, id) => { ids++; return newId(id); });
    if (!KEEP_SCHEME_SKETCH(f)) after = after.replace(OLD_SKETCH, (_, s) => { sketches++; return SKETCH[s]; });
    if (after !== before) { writeFileSync(join(ROOT, f), after); touched++; }
  }
  for (const [from, to] of renames) git("mv", from, to);
  console.log(`rewrote ${ids} identifiers, ${sketches} family sketches and ${paths} path references in ${touched} files; renamed ${renames.size} files`);
}

function verify() {
  const left = new Map();
  for (const f of tracked()) {
    if (f === MAP_FILE || f === SELF) continue;
    const buf = readFileSync(join(ROOT, f));
    if (!isText(buf)) continue;
    const n = [...buf.toString("utf8").matchAll(OLD_ID)].length;
    if (n) left.set(f, n);
  }
  if (!left.size) console.log("verify: no old-format identifier remains outside the map and this script");
  else for (const [f, n] of left) console.log(`verify: ${f} still has ${n}`);
  process.exit(left.size ? 1 : 0);
}

const mode = process.argv[2];
if (mode === "--emit-map") emitMap();
else if (mode === "--apply") apply();
else if (mode === "--verify") verify();
else { console.error("usage: migrate-identifiers.mjs --emit-map | --apply | --verify"); process.exit(2); }
