import { describe, expect, it } from "vitest";

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { loadPage, slot } from "@/src/lib/content/loader";
import { LOCALES } from "@/src/lib/i18n/locales";

/**
 * TS-WEB-0028-A15 — the press page's rows are the installed media-echo
 * package, cited and never invented (DEC-0166, Q-0093).
 *
 * The rows live in the content artifact's table (`archiv-2-rows-demo`), the
 * way every page here carries hub content. This test is what keeps that
 * table a citation of the package rather than a copy that drifts: every
 * entry exactly once, its id, title, types, date, source and url verbatim,
 * the order of TS-WEB-0028 D2, and every quotation exactly the first quotation
 * of the entry's `## Original Text` / `## Key Quotes` section.
 */

const PACKAGE_DIR = join(process.cwd(), "node_modules/@schafe-vorm-fenster/media-echo");

interface IndexFile {
  readonly path: string;
  readonly frontmatter?: {
    readonly title: string;
    readonly type: readonly string[];
    readonly date: string | number;
    readonly source: string;
    readonly url?: string | null;
  };
}

interface Entry {
  readonly id: string;
  readonly title: string;
  readonly types: string;
  readonly date: string;
  readonly source: string;
  readonly url: string;
  readonly quote: string;
}

/** The first `>` paragraph under `## Original Text` or `## Key Quotes`. */
function firstQuotation(body: string): string {
  const section = /^## (?:Original Text|Key Quotes)\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(body);
  if (!section) return "";
  const lines: string[] = [];
  for (const line of section[1]!.split("\n")) {
    if (line.startsWith(">")) lines.push(line.slice(1).trim());
    else if (lines.length > 0) break;
  }
  return lines.filter(Boolean).join(" ");
}

function packageEntries(): Entry[] {
  const index = JSON.parse(readFileSync(join(PACKAGE_DIR, "index.json"), "utf8")) as {
    files: IndexFile[];
  };
  return index.files
    .filter((file) => file.path.endsWith(".media-echo.md") && file.frontmatter)
    .map((file) => {
      const fm = file.frontmatter!;
      const raw = readFileSync(join(PACKAGE_DIR, file.path), "utf8");
      const body = raw.split(/^---$/m).slice(2).join("---");
      return {
        id: file.path.split("/").pop()!.replace(/\.media-echo\.md$/, ""),
        title: fm.title,
        types: fm.type.join(", "),
        date: String(fm.date),
        source: fm.source,
        url: fm.url ?? "—",
        quote: firstQuotation(body) || "—",
      };
    });
}

/** First day of the stated precision — TS-WEB-0028 D2's sort key. */
function sortKey(date: string): string {
  const parts = date.split("-");
  while (parts.length < 3) parts.push("01");
  return parts.join("-");
}

const expected = packageEntries();

describe("TS-WEB-0028-A15: every media-echo entry is cited on the press page, verbatim", () => {
  it("reads the package at all", () => {
    expect(expected.length).toBeGreaterThan(0);
  });

  for (const locale of LOCALES) {
    it(`${locale}: the table holds every entry exactly once, field for field`, async () => {
      const page = await loadPage("archive", locale);
      const table = slot(page, "archiv-2-rows-demo").blocks.find((block) => block.kind === "table");
      expect(table?.kind).toBe("table");
      if (table?.kind !== "table") return;

      const rows = table.rows.map(([id, title, types, date, source, , url, quote]) => ({
        id: id ?? "",
        title: title ?? "",
        types: types ?? "",
        date: date ?? "",
        source: source ?? "",
        url: url ?? "",
        quote: quote ?? "",
      }));

      expect(rows.map((row) => row.id).sort()).toEqual(expected.map((entry) => entry.id).sort());
      for (const row of rows) {
        expect(row, row.id).toEqual(expected.find((entry) => entry.id === row.id));
      }
    });

    it(`${locale}: the rows are date-descending, ties by id ascending (D2)`, async () => {
      const page = await loadPage("archive", locale);
      const table = slot(page, "archiv-2-rows-demo").blocks.find((block) => block.kind === "table");
      if (table?.kind !== "table") throw new Error("no table");
      const ids = table.rows.map(([id]) => id ?? "");
      const ordered = [...expected]
        .sort((a, b) => a.id.localeCompare(b.id))
        .sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)))
        .map((entry) => entry.id);
      expect(ids).toEqual(ordered);
    });
  }

  it("cites at least one quotation, so the quotation path is exercised", () => {
    expect(expected.filter((entry) => entry.quote !== "—").length).toBeGreaterThan(0);
  });
});
