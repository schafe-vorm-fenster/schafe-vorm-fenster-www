/**
 * Hub goal-id resolution — TS-012 D4 rule 1 / TS-012-A3.
 *
 * "Every event ID in the registry resolves to a conversion goal ID in
 * `@schafe-vorm-fenster/goals`; an unknown ID fails the build." The
 * registry (`event-registry.ts`) is validated against this module, and
 * `event-registry.test.ts` is what makes an unknown id fail `pnpm check`
 * (part of `pnpm test`, TS-012-A3's static level).
 *
 * Reads the hub package's generated `index.json` (its frontmatter index,
 * `@schafe-vorm-fenster/goals` exports it at `./index.json`) rather than
 * globbing `conversion-goals/*.md` at runtime — the same shape the content
 * pipeline's source adapter reads for other hub packages (TS-007).
 */

import goalsIndex from "@schafe-vorm-fenster/goals/index.json";

interface GoalsIndexEntry {
  readonly path: string;
  readonly frontmatter?: {
    readonly id?: string;
  };
}

interface GoalsIndex {
  readonly files: readonly GoalsIndexEntry[];
}

const CONVERSION_GOAL_PATH = /^conversion-goals\/.+\.conversion-goal\.md$/;

function conversionGoalIds(index: GoalsIndex): ReadonlySet<string> {
  const ids = index.files
    .filter((file) => CONVERSION_GOAL_PATH.test(file.path))
    .map((file) => file.frontmatter?.id)
    .filter((id): id is string => Boolean(id));
  return new Set(ids);
}

/** Every conversion-goal id the hub package currently declares. */
export const HUB_CONVERSION_GOAL_IDS: ReadonlySet<string> = conversionGoalIds(
  goalsIndex as GoalsIndex,
);

export function isKnownConversionGoalId(id: string): boolean {
  return HUB_CONVERSION_GOAL_IDS.has(id);
}
