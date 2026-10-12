/**
 * `pnpm check:reviews` — a review is not closed until every point is a task.
 *
 * Why this exists. The review of 2026-09-22 left its per-page points in the
 * review text, and nothing turned them into work. The didactic remark on
 * `/dein-kalender` ("Warum es heute hakt … zu früh, zu direkt") was never done,
 * the owner had to ask on 2026-10-12 why nothing had changed, and the guide had
 * meanwhile written the criticised pair into CG-005 as the model. A point that
 * stays in prose is not a task: nobody owns it.
 *
 * The rule. In `plan/reviews/<date>/<date> Review …md` from 2026-10-12 on, a
 * review is cut into points by lines that read `---`. Every block that carries
 * prose ends with a line naming where it went:
 *
 *     Issue: #51            (or `Issues: #34, #35`)
 *     Kein Task: <why>      (a remark that needs no work, with the reason)
 *
 * A block of only headings, links and images carries no point and needs
 * nothing. Reviews before the cut-over are history and are not read.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REVIEWS = join(ROOT, "plan", "reviews");

/** Reviews dated on or after this are held to the rule. */
export const FIRST_DATE = "2026-10-12";

const MARKER = /^(?:Issues?:\s*#\d+(?:\s*,\s*#\d+)*|Kein Task:\s*\S.*)\s*$/mu;

/** A line that is part of the page's furniture, not of a point. */
function isFurniture(line: string): boolean {
  const text = line.trim();
  return (
    text === "" ||
    /^-{3,}$/u.test(text) ||
    text.startsWith("#") ||
    /^`?https?:\/\/\S+`?$/u.test(text) ||
    /^!?\[[^\]]*\]\([^)]*\)$/u.test(text) ||
    /^Ist-Zustand:/u.test(text)
  );
}

export interface Unmarked {
  readonly block: number;
  readonly firstLine: string;
}

/** The blocks of one review that carry a point but name no issue and no reason. */
export function unmarkedPoints(text: string): Unmarked[] {
  return text
    .split(/\n---\n/u)
    .flatMap((block, index) => {
      const lines = block.split("\n");
      const prose = lines.find((line) => !isFurniture(line));
      if (prose === undefined || MARKER.test(block)) return [];
      return [{ block: index + 1, firstLine: prose.trim().slice(0, 80) }];
    });
}

function reviewFiles(): string[] {
  let folders: string[];
  try {
    folders = readdirSync(REVIEWS).filter((name) => statSync(join(REVIEWS, name)).isDirectory());
  } catch {
    return [];
  }
  return folders.flatMap((folder) =>
    readdirSync(join(REVIEWS, folder))
      .filter((name) => /^\d{4}-\d{2}-\d{2} Review .*\.md$/u.test(name) && name.slice(0, 10) >= FIRST_DATE)
      .map((name) => join(REVIEWS, folder, name)),
  );
}

function main() {
  const files = reviewFiles();
  let errors = 0;
  for (const file of files) {
    for (const point of unmarkedPoints(readFileSync(file, "utf8"))) {
      errors++;
      console.error(`  ERROR ${relative(ROOT, file)}: point ${point.block} has no task — "${point.firstLine}…". End it with "Issue: #<n>" or "Kein Task: <why>".`);
    }
  }
  console.log(`review check: ${files.length} review(s) from ${FIRST_DATE} on`);
  console.log(errors ? `${errors} point(s) without a task` : "every point has a task");
  process.exit(errors);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();
