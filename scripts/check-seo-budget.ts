/**
 * `pnpm check:seo-budget` — TS-011-A7 (F-2-43).
 *
 * A7: "Every (path, language) has a unique non-empty title ≤ 60 chars and a
 * description of 120–158 chars; violations fail the build." Nothing measured
 * either.
 *
 * The source has since moved where TS-011 D5 wants it (F-2-72, closing
 * `state/open.md` rows 103 and 138): the values are the `seo` block of each
 * page artifact, read by `src/lib/content/page-seo.ts`. This guard did not
 * have to change for that — it measures whatever `pageTitle`/`pageDescription`
 * return — and it is now the thing that refuses a build where an artifact
 * forgot its block, because a missing entry is an empty string here.
 *
 * The numbers below are A7's, deliberately not D5's stricter reading of the
 * title ("≤ 60 characters **including** the suffix"). The shipped titles do
 * satisfy the stricter one — every non-home title leaves room for the
 * layout's ` — Schafe vorm Fenster` — and `src/lib/routes/metadata.test.ts`
 * is where that headroom is asserted, so this file keeps saying exactly what
 * the acceptance criterion says.
 *
 * Exit code of `main()`: number of errors (0 = green).
 */

import { fileURLToPath } from "node:url";

import { everyRoute } from "../src/lib/routes/routes";
import { pageDescription, pageTitle } from "../src/lib/routes/metadata";

export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 158;

export interface SeoBudgetResult {
  readonly errors: string[];
  readonly pagesChecked: number;
}

export function checkSeoBudget(): SeoBudgetResult {
  const errors: string[] = [];
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  let pagesChecked = 0;

  for (const { route, locale } of everyRoute()) {
    const where = `${route}/${locale}`;
    const title = pageTitle(route, locale);
    const description = pageDescription(route, locale);
    pagesChecked += 1;

    if (title.trim().length === 0) errors.push(`A7 ${where}: empty title`);
    else if (title.length > TITLE_MAX)
      errors.push(`A7 ${where}: title is ${title.length} chars, over ${TITLE_MAX} — "${title}"`);

    if (description.trim().length === 0) errors.push(`A7 ${where}: empty description`);
    else if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX)
      errors.push(
        `A7 ${where}: description is ${description.length} chars, outside ${DESCRIPTION_MIN}–${DESCRIPTION_MAX}`,
      );

    // Uniqueness is per language: the German and the English variant of one
    // page are two different documents to a search engine, but two German
    // pages sharing a title are the duplicate A7 is about.
    const titleKey = `${locale}:${title}`;
    const previousTitle = titles.get(titleKey);
    if (previousTitle) errors.push(`A7 ${where}: title collides with ${previousTitle} — "${title}"`);
    else titles.set(titleKey, where);

    const descriptionKey = `${locale}:${description}`;
    const previousDescription = descriptions.get(descriptionKey);
    if (previousDescription)
      errors.push(`A7 ${where}: description collides with ${previousDescription}`);
    else descriptions.set(descriptionKey, where);
  }

  return { errors, pagesChecked };
}

function main(): void {
  const { errors, pagesChecked } = checkSeoBudget();
  console.log(`seo budget check: ${pagesChecked} (path, language) pair(s)`);
  for (const message of errors) console.error(`  ERROR TS-011-${message}`);
  console.log(errors.length ? `${errors.length} error(s)` : "no errors");
  process.exit(errors.length);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();
