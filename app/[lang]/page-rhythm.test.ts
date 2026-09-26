import { describe, expect, it } from "vitest";

import { checkRhythm } from "@/src/components/section-shell/rhythm";

/**
 * TS-WEB-0019 — `/`'s full section sequence, by hand, in both shapes `D2` can
 * render.
 *
 * The home walk already checks the rhythm, but it reads the **DOM** of one live
 * load (`e2e/pages/home.spec.ts`, `checkRhythm(sections, 0)` at stage 0), so
 * S3 — the state that adds the widened-radius section — is never walked. DEC-0129
 * §11 moved two scene grounds partly *because* of that state, and that argument
 * was carried by prose alone until this file. Four other routes list their
 * sections here the same way (`dein-kalender`, `ueber-uns`, and two more).
 *
 * `himbeereCount = 0`: `/` renders no `himbeere` element — its one primary is
 * the search submit (D2, TS-WEB-0006-A3).
 *
 * The contact section is not a rhythm entry (SRC-0014, DEC-0117) and is left
 * out, as every page's own list leaves it out.
 */
describe("TS-WEB-0019: / section rhythm", () => {
  /*
   * S1 and S2 — no place, or a place with dates. Block 1 is the one `ink`
   * section; block 2a is the paper · lime-100 · violet-500 run of the three
   * scenes (the module's scene is the light one, DEC-0129 §11); then the proof
   * stream, `PageFrame`'s context band on `surface` (the unmerged branch, since
   * `/`'s closing block is a `module` variant), and the closing search block on
   * the second `ink`, which is the page's last section (DEC-0117).
   */
  it("has no violations in S1/S2 — without the widened-radius section", () => {
    const sections = [
      "photo", // hero
      "ink", // block 1′ — place-dates, the live data anchor
      "paper", // block 2a scene 1 — whatsapp, and it carries the module
      "lime-100", // block 2a scene 2 — embed
      "violet-500", // block 2a scene 3 — provenance, block 2b
      "lime-100", // block 2c — proof stream
      "surface", // PageFrame: context band
      "ink", // PageFrame: closing search block, last
    ] as const;
    expect(checkRhythm(sections, 0)).toEqual([]);
  });

  /*
   * S3 — a covered place with no dates. One section more: the widened radius
   * on `surface-2`, directly under the ink block (page.tsx, `emptyPlace`). It
   * is the state that forbids a second `paper` scene: `surface-2` · `paper` ·
   * `paper` would be three neutral grounds in a row.
   */
  it("has no violations in S3 — with the widened-radius section", () => {
    const sections = [
      "photo", // hero
      "ink", // block 1′ — the publish invitation
      "surface-2", // block 1's S3 module — this week nearby
      "paper", // block 2a scene 1 — whatsapp, and it carries the module
      "lime-100", // block 2a scene 2 — embed
      "violet-500", // block 2a scene 3 — provenance, block 2b
      "lime-100", // block 2c — proof stream
      "surface", // PageFrame: context band
      "ink", // PageFrame: closing search block, last
    ] as const;
    expect(checkRhythm(sections, 0)).toEqual([]);
  });

  /*
   * The ground the QA round removed, kept as the assertion that it may not come
   * back: with the module's scene on `lime-500` and the embed scene on `paper`,
   * S3 reads `surface-2` · `lime-500` · `paper` — legal to `checkRhythm`, which
   * is the point. The rule that forbids it is not a rhythm rule but the state
   * indicator's contrast (DEC-0129 §11), so the rhythm test can only pin the
   * shape the page does ship; this records that the two are different questions.
   */
  it("the pre-QA grounds were a rhythm the predicate allows — the defect was contrast", () => {
    const before = [
      "photo",
      "ink",
      "surface-2",
      "lime-500", // the whatsapp scene, where the active step disc measured 1.00:1
      "paper",
      "violet-500",
      "lime-100",
      "surface",
      "ink",
    ] as const;
    expect(checkRhythm(before, 0)).toEqual([]);
  });
});
