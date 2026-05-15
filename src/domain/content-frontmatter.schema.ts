/**
 * Content frontmatter schemas
 *
 * Hierarchy
 * ─────────
 *   BaseFrontmatterSchema          ← shared fields for all id-bearing content assets
 *     ├─ LegalFrontmatterSchema
 *     ├─ SectionFrontmatterSchema
 *     ├─ CollectionFrontmatterSchema
 *     ├─ MediaFrontmatterSchema
 *     ├─ ProfileFrontmatterSchema
 *     ├─ CatalogFrontmatterSchema
 *     ├─ ConfigurationFrontmatterSchema
 *     └─ MessagingFrontmatterSchema
 *          └─ ProductFrontmatterSchema  ← extends messaging with product fields
 *
 *   PressFrontmatterSchema         ← standalone (no id, press-coverage format)
 *   SupportFrontmatterSchema       ← standalone (no id, FAQ article format)
 *
 * Unions
 * ──────
 *   NormalizedFrontmatterSchema    ← discriminated union over content_type for all id-bearing types
 *   AnyFrontmatterSchema           ← all content asset types combined
 */

import { z } from "zod";

// ── Shared primitives ────────────────────────────────────────────────────────

export const ContentTypeSchema = z.enum([
  "catalog",
  "collection",
  "configuration",
  "legal",
  "media",
  "messaging",
  "profile",
  "section",
]);

export const ContentStatusSchema = z.enum([
  "draft",
  "imported",
  "needs-review",
  "ready",
]);

export const ContentLocaleSchema = z.enum(["de", "en"]);

export type ContentType = z.infer<typeof ContentTypeSchema>;
export type ContentStatus = z.infer<typeof ContentStatusSchema>;
export type ContentLocale = z.infer<typeof ContentLocaleSchema>;

// ── Base (all id-bearing normalized content assets) ──────────────────────────

export const BaseFrontmatterSchema = z.object({
  id: z.string().min(1),
  content_type: ContentTypeSchema,
  status: ContentStatusSchema,
  locale: ContentLocaleSchema,
  sources: z.array(z.string()).optional(),
});

export type BaseFrontmatter = z.infer<typeof BaseFrontmatterSchema>;

// ── Per-type schemas ─────────────────────────────────────────────────────────

/** Legal texts: imprint, privacy policy, terms of use, DPA, community guidelines. */
export const LegalFrontmatterSchema = BaseFrontmatterSchema.extend({
  content_type: z.literal("legal"),
});

/** Single editorial section or content block (e.g. hero, how-it-works). */
export const SectionFrontmatterSchema = BaseFrontmatterSchema.extend({
  content_type: z.literal("section"),
  image: z.string().optional(),
});

/** Ordered or curated set of items (e.g. testimonials). */
export const CollectionFrontmatterSchema = BaseFrontmatterSchema.extend({
  content_type: z.literal("collection"),
});

/** Messaging copy aimed at a specific audience or product area. */
export const MessagingFrontmatterSchema = BaseFrontmatterSchema.extend({
  content_type: z.literal("messaging"),
});

/**
 * Product/tariff description.
 * Extends messaging because product pages live alongside general messaging copy.
 * Use this schema when you need to validate or read product-specific fields.
 */
export const ProductFrontmatterSchema = MessagingFrontmatterSchema.extend({
  product_family: z.string().optional(),
  offer_type: z.enum(["addon", "free", "tariff"]).optional(),
  audience: z.string().optional(),
  price_model: z.string().optional(),
  image: z.string().optional(),
});

/** Media asset inventories: images, logos, team portraits, partner assets. */
export const MediaFrontmatterSchema = BaseFrontmatterSchema.extend({
  content_type: z.literal("media"),
});

/** People profiles: founders and team members. */
export const ProfileFrontmatterSchema = BaseFrontmatterSchema.extend({
  content_type: z.literal("profile"),
  image: z.string().optional(),
});

/** Support content catalogs and other enumerated inventories. */
export const CatalogFrontmatterSchema = BaseFrontmatterSchema.extend({
  content_type: z.literal("catalog"),
});

/** Global site settings, navigation, and contact channel configuration. */
export const ConfigurationFrontmatterSchema = BaseFrontmatterSchema.extend({
  content_type: z.literal("configuration"),
});

// ── Standalone schemas (distinct formats, no id field) ───────────────────────

/** Individual press coverage item in content/press/. */
export const PressFrontmatterSchema = z.object({
  title: z.string().min(1),
  abstract: z.string(),
  author: z.string(),
  publisher: z.string(),
  date: z.string(),
  locale: ContentLocaleSchema,
  status: ContentStatusSchema,
  categories: z.array(z.string()).optional(),
  image: z.string(),
  link: z.string().check(z.url()),
});

/** Individual FAQ support article in content/support/. */
export const SupportFrontmatterSchema = z.object({
  title: z.string().min(1),
  category: z.string().optional(),
  locale: ContentLocaleSchema,
  status: ContentStatusSchema,
});

// ── Inferred types ───────────────────────────────────────────────────────────

export type LegalFrontmatter = z.infer<typeof LegalFrontmatterSchema>;
export type SectionFrontmatter = z.infer<typeof SectionFrontmatterSchema>;
export type CollectionFrontmatter = z.infer<typeof CollectionFrontmatterSchema>;
export type MessagingFrontmatter = z.infer<typeof MessagingFrontmatterSchema>;
export type ProductFrontmatter = z.infer<typeof ProductFrontmatterSchema>;
export type MediaFrontmatter = z.infer<typeof MediaFrontmatterSchema>;
export type ProfileFrontmatter = z.infer<typeof ProfileFrontmatterSchema>;
export type CatalogFrontmatter = z.infer<typeof CatalogFrontmatterSchema>;
export type ConfigurationFrontmatter = z.infer<
  typeof ConfigurationFrontmatterSchema
>;
export type PressFrontmatter = z.infer<typeof PressFrontmatterSchema>;
export type SupportFrontmatter = z.infer<typeof SupportFrontmatterSchema>;

// ── Discriminated union over all normalized (id-bearing) types ───────────────

/**
 * Parses any normalized content file.
 * Discriminates on `content_type`, so the result is narrowed automatically.
 *
 * Note: product files use `content_type: "messaging"` and will resolve to
 * MessagingFrontmatter here. Use ProductFrontmatterSchema directly when you
 * need to validate product-specific fields.
 */
export const NormalizedFrontmatterSchema = z.discriminatedUnion(
  "content_type",
  [
    CatalogFrontmatterSchema,
    CollectionFrontmatterSchema,
    ConfigurationFrontmatterSchema,
    LegalFrontmatterSchema,
    MediaFrontmatterSchema,
    MessagingFrontmatterSchema,
    ProfileFrontmatterSchema,
    SectionFrontmatterSchema,
  ],
);

export type NormalizedFrontmatter = z.infer<typeof NormalizedFrontmatterSchema>;

// ── Union over all content asset types ───────────────────────────────────────

/** Parses any content file regardless of format. */
export const AnyFrontmatterSchema = z.union([
  NormalizedFrontmatterSchema,
  PressFrontmatterSchema,
  SupportFrontmatterSchema,
]);

export type AnyFrontmatter = z.infer<typeof AnyFrontmatterSchema>;
