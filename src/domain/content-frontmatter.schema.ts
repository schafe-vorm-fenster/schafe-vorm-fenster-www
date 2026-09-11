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

import { LOCALES } from "../lib/i18n/locales";

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

/**
 * TS-007 D8.1 / DEC-006: the pipeline takes a locale **set**, never a
 * hard-coded pair. The set is `src/lib/i18n/locales.ts`, which TS-001-A11
 * makes the single place a language is declared — adding one is a row there.
 */
export const ContentLocaleSchema = z.enum(LOCALES);

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

// ─────────────────────────────────────────────────────────────────────────────
// TS-007 — the content pipeline layer
//
// Added, not forked: everything above is the pre-relaunch taxonomy that
// `content/features/`, `content/support/` and `content/legal/` still validate
// against (TS-007 D4 calls them archive). Everything below is the schema the
// M3 pipeline reads — the page artifacts under `content/pages/**` and the
// per-slot metadata comments inside them.
//
// The full 26-type reshape of D5 is *not* done here. D5 rewrites the whole
// file against Layer C compositions that do not exist yet (TS-007's own open
// point "Layer C has no tactical spec"). What lands here is the part M3
// actually needs and can check today: the provenance key (D6), the lifecycle
// (D11), the slot vocabulary of concept B.3, and the `TS-###` spec binding
// that TS-017-A14 demands. See ADR-074.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The lifecycle of TS-007 D11: an agent emits `draft`, a person sets
 * `approved` at the editorial decision point. `imported` survives for the
 * legal family only (D10), which never enters generation.
 *
 * Kept beside `ContentStatusSchema` rather than replacing it: the archive
 * folders still carry `needs-review` and `ready`, and this run does not
 * rewrite archive content.
 */
export const LifecycleStatusSchema = z.enum([
  "draft",
  "in-review",
  "approved",
  "imported",
]);

export type LifecycleStatus = z.infer<typeof LifecycleStatusSchema>;

/**
 * The slot content types of concept B.3 — the 26 website content formats —
 * plus the four spellings the Phase-2 artifacts actually use and one
 * addition.
 *
 * `section` is the addition [PROPOSED]: B.3 has no generic prose block, and
 * 42 of the 172 shipped slots are exactly that (a heading plus body copy
 * that no other type describes). Naming it is better than forcing it into
 * `hero` or `trust-block`.
 */
export const SLOT_CONTENT_TYPES = [
  "hero",
  "scene",
  "value-story",
  "objection-list",
  "publishing-path",
  "comparison",
  "offer-tier",
  "feature-benefit",
  "form-step",
  "proof-card",
  "empty-proof-slot",
  "archive-entry",
  "origin-story",
  "anecdote",
  "person-profile",
  "partner-mention",
  "trust-block",
  "howto-block",
  "live-module-frame",
  "empty-state",
  "context-band",
  "closing-cta",
  "page-meta",
  "site-config",
  "error-page",
  "legal-section",
  "section",
] as const;

export const SlotContentTypeSchema = z.enum(SLOT_CONTENT_TYPES);

export type SlotContentType = z.infer<typeof SlotContentTypeSchema>;

/**
 * Spellings the content artifacts use for a B.3 type, normalised on read.
 * One vocabulary for content, schema and component (`src/components/README.md`
 * rule "the folder name is the inventory name"), without asking the writer to
 * re-edit eleven pages.
 */
export const SLOT_CONTENT_TYPE_ALIASES: Readonly<Record<string, SlotContentType>> = {
  form: "form-step",
  tier: "offer-tier",
  profile: "person-profile",
  configuration: "site-config",
  quote: "anecdote",
  teaser: "context-band",
};

/**
 * Where a slot's copy comes from. `sourced` and `generated` are TS-007 D6 and
 * the dummy-content rule; the other three are determinations the content map
 * made and the pipeline has to carry rather than flatten:
 *
 *   sourced-empty-by-design  a clearance-gated proof slot that stays empty
 *                            (SRC-001 rule 4, TS-007 D2) — never substituted
 *   withheld                 a slot a page spec forbids filling without a
 *                            named source (TS-024 D10, TS-026 D5)
 *   mixed                    a slot whose parts differ in provenance
 *
 * `demo` is orthogonal: it marks the slot the prototype shows in place of an
 * empty one, and it is what puts the `Demo-Daten` badge on the page.
 */
export const SlotProvenanceSchema = z.enum([
  "sourced",
  "generated",
  "sourced-empty-by-design",
  "withheld",
  "mixed",
]);

export type SlotProvenance = z.infer<typeof SlotProvenanceSchema>;

/**
 * A provenance reference of TS-007 D6 — `<package>@<version>#<record-id>`,
 * the exact installed version, never a range and never a repository path
 * (DEC-042). Two forms beyond the canonical one are accepted:
 *
 *   `ia`                     the copy shell with no source record, declared
 *                            against the information architecture (D6)
 *   `<package>@<version>`    a whole-package *pool* reference: the slot draws
 *                            from every record of that package and the
 *                            relevance engine (TS-005) picks. It still
 *                            resolves, and a version bump still selects the
 *                            file for P7 — which is all D6 asks of the key.
 *                            [PROPOSED — D6 writes only the `#record` form]
 */
export const SOURCE_REF_PATTERN =
  /^(?:ia|@[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*@\d+\.\d+\.\d+(?:-[0-9a-z.-]+)?(?:#[A-Za-z0-9._-]+)?)$/;

export const SourceRefSchema = z
  .string()
  .regex(
    SOURCE_REF_PATTERN,
    "must be `<package>@<version>#<record-id>`, `<package>@<version>`, or `ia` (TS-007 D6)",
  );

/**
 * The per-slot metadata comment inside a page artifact
 * (`<!-- id: …; content_type: …; provenance: …; derived_from: […]; status: … -->`).
 *
 * **Strict** (F-2-40, F-2-46's owned clause): an unknown key is an error, not
 * a silently dropped one. A non-strict object would let a misspelt `status`
 * or `reviewed_by` pass validation and then be invisible to the editorial
 * gate — a gate that can be bypassed by a typo is not a gate.
 *
 * It carries what TS-007 D4/D6 would put in a per-slot file's own
 * frontmatter. `state/content-map.md` explains why the artifacts are one file
 * per page instead; ADR-074 records the determination that the loader reads
 * that shape as is.
 */
export const SlotMetaSchema = z.strictObject({
  id: z
    .string()
    .min(1)
    .describe("Locale-free slot id, kebab-case: `<route-segment>-<n>-<slot>`."),
  content_type: SlotContentTypeSchema,
  provenance: SlotProvenanceSchema,
  derived_from: z.array(SourceRefSchema),
  status: LifecycleStatusSchema,
  demo: z.boolean().optional().describe("True for a dummy-content slot; puts the `Demo-Daten` badge on the module."),
});

export type SlotMeta = z.infer<typeof SlotMetaSchema>;

/**
 * The `<title>` and meta description of **one route** in one language
 * (TS-011 D5, TS-021-A11).
 *
 * D5 is explicit that both are content, not code: they live in the page's own
 * frontmatter and are "never derived at runtime from body copy or from the
 * `h1`". `provenance` marks where the two strings came from in the same
 * vocabulary a slot uses — `generated` for copy this repository wrote from
 * the page's own focus slot rather than lifting from a hub record, which is
 * what the dummy-content rule (plan/guardrails.md) asks to be registered.
 *
 * The lengths are *not* checked here. TS-011-A7 owns those numbers and
 * `scripts/check-seo-budget.ts` is the one place they are written down; a
 * second copy in the schema would be a second thing to keep in step.
 */
export const PageSeoSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().min(1),
  provenance: SlotProvenanceSchema,
});

export type PageSeo = z.infer<typeof PageSeoSchema>;

/**
 * A page artifact's `seo` block, keyed by the **German route path** — the
 * same locale-free key the `route` field carries, so the `de` and the `en`
 * file of a page name their routes identically (TS-007 D4's rule for slot
 * ids, applied to routes).
 *
 * It is a map rather than a single pair because one artifact can serve more
 * than one route: `/deine-region/angebot` is specified by TS-026 together
 * with `/deine-region` and its slots live in that page's file
 * (`CONTENT_PAGE_DIRS` in `src/lib/content/loader.ts`). Two routes are two
 * documents to a search engine, so they get two titles.
 */
export const PageSeoMapSchema = z.record(
  z.string().startsWith("/", "must be a German route path from src/lib/routes/routes.ts"),
  PageSeoSchema,
);

export type PageSeoMap = z.infer<typeof PageSeoMapSchema>;

/**
 * The frontmatter of a page artifact under `content/pages/<route>/<locale>.md`.
 *
 * Extends the pre-relaunch base rather than replacing it, so
 * `pnpm check:frontmatter` keeps validating these files through the same
 * union — with the TS-007 fields now actually required instead of silently
 * dropped as unknown keys (which is what `state/open.md` #43 reported).
 */
export const PageFrontmatterSchema = BaseFrontmatterSchema.extend({
  status: LifecycleStatusSchema,
  /** The tactical spec the page realises — TS-017-A14. */
  page_id: z
    .string()
    .regex(/^TS-\d{3}$/, "must name the tactical spec as `TS-###` (TS-017-A14)"),
  /** The German route path the page answers on, per `src/lib/routes/routes.ts`. */
  route: z.string().startsWith("/"),
  /** TS-007 D6: one entry per record actually used; never empty. */
  derived_from: z.array(SourceRefSchema).min(1),
  /** TS-007 D6: `<playbook>@<version>`, so a prompt change is traceable. */
  generated_by: z.string().min(1),
  /** TS-007 D6: ISO date of the draft. */
  generated_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Page-level summary; the binding per-slot value is in the slot comment. */
  provenance: z.string().min(1),
  /**
   * TS-011 D5 — the indexed surface of every route this artifact serves.
   * Required: a page without it has no title and no description, and
   * `pnpm check:seo-budget` (TS-011-A7) fails the build rather than letting
   * a template in code answer for the content (F-2-72).
   */
  seo: PageSeoMapSchema,
  tone_profile: z.string().optional(),
  compliance_check: z.string().optional(),
  schema_note: z.string().optional(),
  open_points: z.array(z.string()).optional(),
  /** Where a price shown on the page comes from — TS-024/TS-025. */
  price_source_note: z.string().optional(),
  /** TS-007 D11: set by a person at the editorial decision point, never by an agent. */
  reviewed_by: z.string().optional(),
  reviewed_at: z.string().optional(),
  // F-2-40 / F-2-46's owned clause: **strict**. A non-strict object drops an
  // unknown key silently, so a misspelt `status`, `reviewed_by` or
  // `reviewed_at` would pass `check:frontmatter` and be invisible to the
  // editorial gate of D11. Adding a field here is deliberate; acquiring one
  // by typo is not.
}).strict();

export type PageFrontmatter = z.infer<typeof PageFrontmatterSchema>;
