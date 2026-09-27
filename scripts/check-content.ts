/**
 * `pnpm check:content` — the content pipeline gate (TS-WEB-0007 D12).
 *
 * Reads the eleven page artifacts in every configured locale, validates them
 * against the schema in `src/domain/content-frontmatter.schema.ts`, and
 * resolves every provenance reference against the installed hub packages.
 * Errors exit non-zero with the file, the slot and the record named;
 * warnings are printed and do not fail the run.
 *
 * The rules themselves live in `src/lib/content/validate.ts`, so the same
 * checks run in the unit and integration tests. This file is the runner.
 */

import { checkContentTree } from "../src/lib/content/validate";

import type { Finding } from "../src/lib/content/validate";

/**
 * Which acceptance criterion a row of D12 discharges — printed with the
 * finding, because a meter has no test title to carry the id
 * (`scripts/check-coverage.ts`: *"the id in its failure message is the link"*).
 *
 * `TS-WEB-0007-A13` declares its level as `tool`: an external tool is the
 * verdict, and this command is that tool for glossary conformance — the avoid
 * list and the product-name count (rows 11). The two other copy rows are
 * verified by test titles in `src/lib/content/validate.test.ts` as well and are
 * named here for the same reason: a reader of a failure should not have to look
 * up which criterion just broke.
 *
 * `claim-budget` deliberately names **no** criterion. `CG-027`'s count is
 * assigned to `schema` by `specs/contracts/copy-contract.md:112` and no
 * acceptance criterion carries it: A16 of TS-WEB-0006 (spelled out so this
 * sentence is not scanned as coverage, DEC-0134) is the *manual* review
 * gate for the rules SRC-0018 assigns to review, and a meter cannot close a
 * manual criterion (`scripts/check-coverage.ts`) — naming it here would have
 * bought a false green, which is the exact defect DEC-0141 was built for. The
 * rule has a source; it does not yet have a criterion (DEC-0145 §4).
 */
const CRITERION: Partial<Record<Finding["check"], string>> = {
  "avoid-list": "TS-WEB-0007-A13",
  "product-name": "TS-WEB-0007-A13",
  "copy-structure": "TS-WEB-0006-A8",
  register: "TS-WEB-0029-A15",
  "price-figure": "TS-WEB-0006-A12",
};

function print(finding: Finding): void {
  const where = finding.slot ? `${finding.file} › ${finding.slot}` : finding.file;
  const criterion = CRITERION[finding.check];
  const line =
    `  ${where}\n    [${finding.check}${criterion ? `, ${criterion}` : ""}] ` +
    finding.message;
  if (finding.level === "error") console.error(line);
  else console.warn(line);
}

async function main(): Promise<void> {
  const started = Date.now();
  const missingLocale = process.argv.includes("--warn-missing-locale")
    ? "warning"
    : "error";

  const findings = await checkContentTree({ missingLocale });
  const errors = findings.filter((finding) => finding.level === "error");
  const warnings = findings.filter((finding) => finding.level === "warning");

  console.log(
    `\nChecked the content pipeline in ${Date.now() - started} ms — ${errors.length} error(s), ${warnings.length} warning(s).\n`,
  );

  if (warnings.length > 0) {
    console.warn(`${warnings.length} warning(s):`);
    warnings.forEach(print);
    console.warn("");
  }

  if (errors.length === 0) {
    console.log(
      "Content pipeline is valid (TS-WEB-0007 D12) — rows 11, 13, 14, 15 and 16 measured: " +
        "TS-WEB-0007-A13 (glossary conformance), TS-WEB-0006-A8 (copy structure), " +
        "TS-WEB-0029-A15 (register), TS-WEB-0006-A12 (a price is read, never typed), " +
        "and CG-027 (the claim budget of a proof card, a contract rule with no criterion yet).",
    );
    return;
  }

  console.error(`Found ${errors.length} error(s):`);
  errors.forEach(print);
  console.error("");
  process.exit(1);
}

void main();
