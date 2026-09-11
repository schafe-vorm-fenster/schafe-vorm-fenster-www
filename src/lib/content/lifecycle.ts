/**
 * The editorial gate of TS-007 D11 — which lifecycle status renders in which
 * build (TS-007-A14, F-2-40).
 *
 * D11's table, verbatim:
 *
 * | Build | Includes |
 * | --- | --- |
 * | production | `status: approved` only |
 * | preview | `draft`, `in-review`, `approved` — so review happens on the rendered page |
 *
 * Two readings this module fixes, because D11's table leaves them implicit:
 *
 *  - **`imported` renders everywhere.** It is the legal family's status
 *    (D10), which never enters generation and therefore never reaches the
 *    editorial decision point that sets `approved`. Gating it out of
 *    production would remove the imprint from the production site.
 *  - **`development` is preview's set.** D11 names two builds; a local
 *    `next dev` or a local production build is neither a Vercel production
 *    deployment nor a preview, and the run's own prototype is built and
 *    reviewed there. The axis is therefore the *deployment target*
 *    (`VERCEL_ENV`, via `environmentFrom`), not `NODE_ENV` — a local
 *    `next build` is a production *bundle*, not a production *build* in
 *    D11's sense, and QA reads the prototype on exactly that.
 *
 * The gate is one predicate used in two places: `loader.ts` drops what must
 * not render, and `validate.ts` reports what a *production* build would drop,
 * whichever environment `check:content` itself runs in. Keeping the two on
 * one predicate is what stops the build gate and the renderer from
 * disagreeing.
 */

import type { LifecycleStatus } from "@/src/domain/content-frontmatter.schema";
import type { Environment } from "@/src/lib/security/csp";

import { environmentFrom } from "@/src/lib/seo/indexable";

/** D11: what a production build contains. */
export const PRODUCTION_STATUSES: readonly LifecycleStatus[] = ["approved", "imported"];

/** D11: what preview — and every local build — contains. */
export const PREVIEW_STATUSES: readonly LifecycleStatus[] = [
  "draft",
  "in-review",
  "approved",
  "imported",
];

/** The statuses one environment renders. */
export function renderableStatuses(
  environment: Environment,
): readonly LifecycleStatus[] {
  return environment === "production" ? PRODUCTION_STATUSES : PREVIEW_STATUSES;
}

/** D11's predicate: may content in this status render in this build? */
export function rendersIn(
  status: LifecycleStatus,
  environment: Environment,
): boolean {
  return renderableStatuses(environment).includes(status);
}

/**
 * The build this process is producing — the same `VERCEL_ENV` axis TS-014 D5
 * and TS-015 D3 use, so "production" means one thing across the codebase.
 */
export function contentEnvironment(
  env: Record<string, string | undefined> = process.env,
): Environment {
  return environmentFrom(env.VERCEL_ENV);
}
