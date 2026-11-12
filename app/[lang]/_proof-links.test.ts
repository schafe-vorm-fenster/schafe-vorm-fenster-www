import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { PROOF_DEEPLINKS, hubProofIds, proofDeeplink } from "./_proof-links";

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

/** The hub proof ids of home's `home-8-proof-stream` slot, off its `derived_from`. */
function homeDerivedFrom(locale: "de" | "en"): string[] {
  const source = read(`content/pages/home/${locale}.md`);
  const comment = /<!-- id: home-8-proof-stream;[^>]*derived_from: (\[[^\]]*\])/.exec(source);
  expect(comment).not.toBeNull();
  return JSON.parse(comment![1]) as string[];
}

describe("proof teaser deeplinks (issue #36)", () => {
  it("reads the hub proof ids off derived_from in order, skipping package-wide refs", () => {
    expect(
      hubProofIds([
        "@schafe-vorm-fenster/proof@0.3.5#a",
        "@schafe-vorm-fenster/proof@0.3.5",
        "@schafe-vorm-fenster/media-echo@0.3.3#b",
        "@schafe-vorm-fenster/proof@0.3.5#c",
      ]),
    ).toEqual(["a", "c"]);
  });

  it.each(["de", "en"] as const)("maps every home candidate (%s) to a deeplink", (locale) => {
    const derivedFrom = homeDerivedFrom(locale);
    const ids = hubProofIds(derivedFrom);
    const list = /\*\*(?:Kandidaten|Candidates)[^\n]*\n\n((?:\d\. [^\n]*\n)+)/.exec(
      read(`content/pages/home/${locale}.md`),
    );
    expect(list).not.toBeNull();
    // one hub id per authored line, so `index` is the join key
    expect(ids).toHaveLength(list![1].trim().split("\n").length);
    ids.forEach((_, index) => expect(proofDeeplink(derivedFrom, index)).toBeDefined());
  });

  it("targets an archive row that exists, by the hub media-echo id", () => {
    const archive = read("content/pages/ueber-uns/archiv/de.md");
    for (const [proofId, { to, hash }] of Object.entries(PROOF_DEEPLINKS)) {
      expect(to, proofId).toBe("archive");
      expect(archive, proofId).toContain(`| ${hash} |`);
    }
  });
});
