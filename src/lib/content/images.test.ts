import { describe, expect, it } from "vitest";

import { pageImage, slotImages } from "@/src/lib/content/images";
import { parsePage } from "@/src/lib/content/loader";

import type { PageContent } from "@/src/lib/content/types";

/**
 * The inventory as a page sees it. The rules that matter here are the ones a
 * component would otherwise have to re-decide per call site: an entry with no
 * file is not renderable, a generated entry always carries the badge, and a
 * real one never does.
 */
const artifact = (images: string) => `---
id: home-de
page_id: TS-019
route: "/"
seo:
  "/":
    title: "T"
    description: "D"
    provenance: generated
content_type: section
status: draft
locale: de
derived_from:
  - "ia"
generated_by: "playbook@1.0.0"
generated_at: "2026-09-12"
provenance: "mixed"
${images}---

## Slot 1

<!-- id: home-1-search-hero; content_type: hero; provenance: sourced; derived_from: [ia]; status: draft -->

**Headline:** Was ist bei dir los?
`;

const page = (images: string): PageContent =>
  parsePage(artifact(images), {
    routeId: "home",
    locale: "de",
    file: "content/pages/home/de.md",
  });

const GENERATED = `images:
  - id: home-hero
    slot: home-1-search-hero
    ratio: hero
    provenance: generated
    brief: "Ein Dorf am Horizont."
    alt: "Ein Dorf am Horizont"
    status: generated
    file: /images/generated/home-hero.webp
    width: 800
    height: 900
    wide_file: /images/generated/home-hero-wide.webp
    wide_width: 1400
    wide_height: 600
    model: bfl/flux-pro-1.1
    generated_at: "2026-09-12"
    prompt_hash: "0123456789abcdef"
  - id: home-scene
    slot: home-1-search-hero
    ratio: feature
    provenance: generated
    brief: "Ein Schaukasten."
    alt: "Ein Schaukasten"
    status: needed
`;

const REAL = `images:
  - id: founder
    slot: home-1-search-hero
    ratio: portrait
    provenance: real
    source: "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel"
    alt: "Jan-Henrik Hempel"
    credit: "@rightvisionstudios & NØRD2026"
    lcp: true
    status: real
    file: /images/real/founder.webp
    width: 1152
    height: 1440
`;

describe("the page's image inventory", () => {
  it("hands a generated image its badge, its two renditions and a placeholder id", () => {
    const image = pageImage(page(GENERATED), "home-hero");
    expect(image).toMatchObject({
      src: "/images/generated/home-hero.webp",
      wideSrc: "/images/generated/home-hero-wide.webp",
      alt: "Ein Dorf am Horizont",
      width: 800,
      height: 900,
      notDepicting: true,
      priority: false,
      placeholderId: "generated:bfl/flux-pro-1.1",
    });
  });

  it("returns undefined for an entry with no file — the module keeps its hatch", () => {
    expect(pageImage(page(GENERATED), "home-scene")).toBeUndefined();
  });

  it("returns undefined for an id the inventory does not carry", () => {
    expect(pageImage(page(GENERATED), "nope")).toBeUndefined();
  });

  it("never badges a real photograph, and carries its credit and LCP flag", () => {
    const image = pageImage(page(REAL), "founder");
    expect(image).toMatchObject({
      src: "/images/real/founder.webp",
      notDepicting: false,
      priority: true,
      credit: "@rightvisionstudios & NØRD2026",
    });
    expect(image?.placeholderId).toBeUndefined();
  });

  it("lists a slot's usable images and drops the ones with no file", () => {
    expect(slotImages(page(GENERATED), "home-1-search-hero").map((i) => i.id)).toEqual([
      "home-hero",
    ]);
    expect(slotImages(page(GENERATED), "elsewhere")).toEqual([]);
  });

  it("is empty, never undefined, for a page with no inventory", () => {
    expect(page("").images).toEqual([]);
    expect(pageImage(page(""), "home-hero")).toBeUndefined();
  });
});
