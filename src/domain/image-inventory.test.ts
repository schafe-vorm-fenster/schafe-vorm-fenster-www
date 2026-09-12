/**
 * The `images:` inventory of a page artifact — the register the dummy-content
 * rule (plan/guardrails.md) asks for, and the input `pnpm images:generate`
 * reads. The entry *is* the provenance record: there is no sidecar file, so
 * every rule that keeps an image honest has to be checkable here.
 */
import { describe, expect, it } from "vitest";

import {
  ImageEntrySchema,
  PageFrontmatterSchema,
} from "@/src/domain/content-frontmatter.schema";

const needed = {
  id: "home-hero",
  slot: "home-1-search-hero",
  ratio: "hero",
  provenance: "generated",
  brief: "Weite Feldlandschaft am frühen Abend, ein Dorf am Horizont.",
  style: "Dokumentarische Fotografie, natürliches Licht",
  alt: "Feldlandschaft mit einem Dorf am Horizont",
  status: "needed",
} as const;

describe("ImageEntrySchema", () => {
  it("accepts a brief waiting for the generator", () => {
    expect(ImageEntrySchema.safeParse(needed).success).toBe(true);
  });

  it("rejects an unknown key rather than dropping it", () => {
    const parsed = ImageEntrySchema.safeParse({ ...needed, statuz: "needed" });
    expect(parsed.success).toBe(false);
  });

  it("requires a source for a real asset — no unattributed photograph", () => {
    const parsed = ImageEntrySchema.safeParse({
      ...needed,
      provenance: "real",
      status: "real",
      brief: undefined,
    });
    expect(parsed.success).toBe(false);

    const withSource = ImageEntrySchema.safeParse({
      ...needed,
      provenance: "real",
      status: "real",
      source: "@schafe-vorm-fenster/people@0.3.6#jan-henrik-hempel",
    });
    expect(withSource.success).toBe(true);
  });

  it("requires a brief for a generated image", () => {
    const withoutBrief: Record<string, unknown> = { ...needed };
    delete withoutBrief.brief;
    expect(ImageEntrySchema.safeParse(withoutBrief).success).toBe(false);
  });

  it("requires file, width and height once an entry claims a rendition", () => {
    expect(
      ImageEntrySchema.safeParse({ ...needed, status: "generated" }).success,
    ).toBe(false);

    const written = ImageEntrySchema.safeParse({
      ...needed,
      status: "generated",
      file: "/images/generated/home-hero.webp",
      width: 1600,
      height: 686,
      model: "bfl/flux-pro-1.1",
      generated_at: "2026-09-12",
      prompt_hash: "0123456789abcdef",
    });
    expect(written.success).toBe(true);
  });

  it("keeps the id file-name-safe and the ratio inside the design system's table", () => {
    expect(ImageEntrySchema.safeParse({ ...needed, id: "Home Hero" }).success).toBe(
      false,
    );
    expect(ImageEntrySchema.safeParse({ ...needed, ratio: "banner" }).success).toBe(
      false,
    );
  });

  it("refuses an empty alt text — a decorative image gets no inventory entry", () => {
    expect(ImageEntrySchema.safeParse({ ...needed, alt: "" }).success).toBe(false);
  });
});

describe("PageFrontmatterSchema carries the inventory", () => {
  const frontmatter = {
    id: "home-de",
    page_id: "TS-019",
    route: "/",
    seo: {
      "/": { title: "t", description: "d", provenance: "generated" },
    },
    content_type: "section",
    status: "draft",
    locale: "de",
    derived_from: ["ia"],
    generated_by: "playbook-content-production@1.0.0",
    generated_at: "2026-09-11",
    provenance: "mixed",
  };

  it("accepts a page without images — the block is optional", () => {
    expect(PageFrontmatterSchema.safeParse(frontmatter).success).toBe(true);
  });

  it("validates every entry of the block", () => {
    expect(
      PageFrontmatterSchema.safeParse({ ...frontmatter, images: [needed] }).success,
    ).toBe(true);
    expect(
      PageFrontmatterSchema.safeParse({
        ...frontmatter,
        images: [{ ...needed, ratio: "banner" }],
      }).success,
    ).toBe(false);
  });
});
