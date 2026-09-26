import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { parseBlocks } from "@/src/lib/content/blocks";

import {
  listAt,
  listsOf,
  sampleRows,
  splitCoreDetail,
  threeSampleRows,
  threeSteps,
} from "./paths";

/**
 * The artifact-side half of `/mitmachen` (DEC-0124): the two list formats the
 * page reads, and the guarantees it may lean on.
 *
 * The last block runs the **shipped** artifacts through the same reader the
 * page uses, in both locales. A step count is a determination (TS-WEB-0022 D4
 * "not two, not four"), a sample panel is a fixed square of three rows
 * (A19), and both are properties of the content file — so a content edit
 * that breaks one fails here rather than at the first page view.
 */

const LOCALES = ["de", "en"] as const;

const STEP_SLOTS = [
  "mitmachen-3a-path-whatsapp-steps-demo",
  "mitmachen-4a-path-calendar-steps-demo",
  "mitmachen-5a-path-website-steps-demo",
] as const;

/** The slots of a shipped artifact, by the id in their metadata comment. */
function slotsOf(locale: (typeof LOCALES)[number]): Map<string, string> {
  const file = readFileSync(`content/pages/mitmachen/${locale}.md`, "utf8");
  const slots = new Map<string, string>();
  const parts = file.split(/<!--\s*id:\s*/).slice(1);
  for (const part of parts) {
    const id = part.slice(0, part.indexOf(";")).trim();
    const body = part.slice(part.indexOf("-->") + 3);
    // Up to the next slot comment or the next `##` heading, whichever first.
    const end = body.search(/\n<!--\s*(id|clearance|source_note):|\n## /);
    slots.set(id, end === -1 ? body : body.slice(0, end));
  }
  return slots;
}

describe("splitCoreDetail", () => {
  it("splits a line on the first ` — ` and trims both halves", () => {
    expect(splitCoreDetail("Die Nachbarn — Im selben Dorf.")).toEqual({
      core: "Die Nachbarn",
      detail: "Im selben Dorf.",
    });
  });

  it("treats a line without the separator as all core", () => {
    expect(splitCoreDetail("Ein Satz ohne Trenner.")).toEqual({
      core: "Ein Satz ohne Trenner.",
      detail: "",
    });
  });

  it("keeps everything after the first separator in the detail", () => {
    expect(splitCoreDetail("A — B — C").detail).toBe("B — C");
  });
});

describe("listsOf / listAt", () => {
  const blocks = parseBlocks(
    ["**Head:** H", "", "- a", "- b", "", "**Kicker:** K", "", "- c", ""].join("\n"),
  );

  it("returns every list in document order", () => {
    expect(listsOf(blocks)).toEqual([["a", "b"], ["c"]]);
  });

  it("answers an empty list for a position the slot does not carry", () => {
    expect(listAt(blocks, 2)).toEqual([]);
  });
});

describe("threeSteps", () => {
  it("returns the three core/detail pairs as the module's tuple", () => {
    expect(threeSteps(["A — a.", "B — b.", "C — c."], "slot")).toEqual([
      { core: "A", detail: "a." },
      { core: "B", detail: "b." },
      { core: "C", detail: "c." },
    ]);
  });

  it("throws on any other count — three is the determination, not a default", () => {
    expect(() => threeSteps(["A — a.", "B — b."], "slot")).toThrow(/exactly three step lines/);
    expect(() => threeSteps(["A", "B", "C", "D"], "slot")).toThrow(/found 4/);
  });
});

describe("sampleRows", () => {
  it("reads the four required fields and leaves the status empty", () => {
    expect(sampleRows(["Kinderturnen | Sa · 10:00 | social | Vereinsleben"], "slot")).toEqual([
      {
        title: "Kinderturnen",
        meta: "Sa · 10:00",
        category: "social",
        categoryLabel: "Vereinsleben",
        status: undefined,
        statusLabel: undefined,
      },
    ]);
  });

  it("reads the optional status and its authored word", () => {
    const [row] = sampleRows(["Chorprobe | Do · 20:00 | culture | Kultur | verschoben | Verschoben"], "slot");
    expect(row.status).toBe("verschoben");
    expect(row.statusLabel).toBe("Verschoben");
  });

  it("throws on a row with fewer than four fields", () => {
    expect(() => sampleRows(["Chorprobe | Do · 20:00"], "slot")).toThrow(/sample event row/);
  });

  it("throws on a category or a status the system does not know", () => {
    expect(() => sampleRows(["A | B | dorffest | Fest"], "slot")).toThrow(/no event category/);
    expect(() => sampleRows(["A | B | social | Fest | wackelt | Wackelt"], "slot")).toThrow(
      /no event status/,
    );
  });
});

describe("threeSampleRows", () => {
  it("throws unless the panel has exactly three rows", () => {
    expect(() => threeSampleRows(["A | B | social | S"], "slot")).toThrow(/three rows/);
  });
});

describe("the shipped artifacts", () => {
  for (const locale of LOCALES) {
    const slots = slotsOf(locale);

    for (const id of STEP_SLOTS) {
      it(`${locale}: ${id} carries three step lines, each with a core and a detail`, () => {
        const body = slots.get(id);
        expect(body, `${id} is missing from content/pages/mitmachen/${locale}.md`).toBeDefined();
        const steps = threeSteps(listAt(parseBlocks(body ?? ""), 0), id);
        for (const step of steps) {
          expect(step.core.length).toBeGreaterThan(0);
          expect(step.detail.length).toBeGreaterThan(0);
        }
      });
    }

    for (const id of STEP_SLOTS.slice(1)) {
      it(`${locale}: ${id} carries three sample event rows`, () => {
        const rows = threeSampleRows(listAt(parseBlocks(slots.get(id) ?? ""), 1), id);
        expect(rows).toHaveLength(3);
      });
    }

    it(`${locale}: the objection slot carries a reach list and a channel list`, () => {
      const blocks = parseBlocks(slots.get("mitmachen-2-objections") ?? "");
      const lists = listsOf(blocks);
      expect(lists).toHaveLength(2);
      for (const list of lists) {
        expect(list).toHaveLength(3);
        for (const line of list) expect(splitCoreDetail(line).detail.length).toBeGreaterThan(0);
      }
    });

    it(`${locale}: no step line and no objection row states a price`, () => {
      const lines = [
        ...listsOf(parseBlocks(slots.get("mitmachen-2-objections") ?? "")).flat(),
        ...STEP_SLOTS.flatMap((id) => listAt(parseBlocks(slots.get(id) ?? ""), 0)),
      ];
      for (const line of lines) {
        expect(line, "TS-WEB-0022-A12: no figure on this route").not.toMatch(/\d+\s*€|480|\bab\b/);
      }
    });
  }
});
