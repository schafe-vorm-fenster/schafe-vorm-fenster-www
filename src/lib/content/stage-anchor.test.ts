import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { parsePage } from "@/src/lib/content/loader";

/**
 * TS-WEB-0020-A17 / DEC-0153 — a photograph under a reading band keeps its
 * motif above the band.
 *
 * The neutral scrim is clear above 38 % and darkens to 0.72 at the bottom
 * (SRC-0014 §The scrim), and the story stage's quote sits in that lower part.
 * Every image entry that declares an `anchor` puts it inside the clear part,
 * carries a declared `focal` point to anchor, and has the stage cut
 * `pnpm images:generate` wrote for it — on disk, not only in the entry.
 */
const ARTIFACTS = ["content/pages/dein-ort/de.md", "content/pages/dein-ort/en.md"];

describe("TS-WEB-0020-A17: an anchored photograph keeps its focal point above the reading band", () => {
  const anchored = ARTIFACTS.flatMap((file) => {
    const page = parsePage(readFileSync(join(process.cwd(), file), "utf8"), {
      routeId: "place",
      locale: file.endsWith("en.md") ? "en" : "de",
      file,
      environment: "preview",
    });
    expect(page.ok, `${file} parses`).toBe(true);
    return page.ok ? page.images.filter((entry) => entry.anchor !== undefined).map((entry) => ({ file, entry })) : [];
  });

  it("finds the story stage's anchored photographs in both locales", () => {
    expect(anchored.length).toBeGreaterThanOrEqual(4);
  });

  for (const { file, entry } of anchored) {
    it(`${entry.id} (${file}): anchor in the clear band, a focal point, a stage cut on disk`, () => {
      expect(entry.anchor!.y, "anchor.y").toBeLessThanOrEqual(38);
      expect(entry.focal, "a declared focal point").toBeDefined();
      expect(entry.stage_file, "stage_file").toBeDefined();
      expect(() => statSync(join(process.cwd(), "public", entry.stage_file!))).not.toThrow();
    });
  }
});
