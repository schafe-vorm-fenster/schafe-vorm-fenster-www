import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { checkTerms, RESPONSE_PROMISE_MODULE, termHits } from "./check-terms";

/** A throwaway tree, so nothing here depends on a committed fixture. */
function tree(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "terms-"));
  for (const directory of ["src", "app", "content"]) mkdirSync(join(root, directory));
  for (const [path, contents] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, contents, "utf-8");
  }
  return root;
}

describe("TS-026-A8: the response-time wording lint", () => {
  it("finds the wording in every spelling A7 names", () => {
    for (const line of [
      "Antwort in zwei Werktagen",
      "innerhalb von 48 Stunden",
      "wir melden uns schnellstmöglich",
      "within two working days",
      "two business days",
    ])
      expect(termHits(line), line).toHaveLength(1);
  });

  it("says nothing about ordinary copy", () => {
    expect(termHits("Wir melden uns bei dir, sobald der Prozess steht.")).toEqual([]);
  });

  it("fails the wording in a content file, with no exception", () => {
    const root = tree({ "content/pages/x/de.md": "Du hörst in zwei Werktagen von uns." });
    const { errors } = checkTerms(root);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("in a content file");
  });

  it("fails a second module writing the wording", () => {
    const root = tree({ "src/components/other/other.tsx": 'const t = "zwei Werktage";' });
    expect(checkTerms(root).errors[0]).toContain("outside src/components/response-promise");
  });

  it("allows the one module the criterion allows", () => {
    const root = tree({
      [`${RESPONSE_PROMISE_MODULE}/constant.ts`]: 'export const T = "zwei Werktage";',
    });
    expect(checkTerms(root).errors).toEqual([]);
  });
});
