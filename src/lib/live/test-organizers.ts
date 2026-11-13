/**
 * A test organizer's dates are never shown — DEC-0173 §3, issues #52 and #97.
 *
 * The calendar app has accounts that exist to try things out, and their
 * dates ("Recurring TEST Event Schlatkow", "Allday TEST Event Schlatkow") sit
 * in the same events index as every real one. The village calendar's own site
 * drops them by **who organised them**, not by what they are called:
 * `community-site/src/filter/filterTestEvents.ts` excludes every event whose
 * calendar's organizer id is in `MATEO_TEST_USER_IDS`. This module is the same
 * rule, with the same configuration, so the two sites cannot disagree about
 * what a test date is:
 *
 *  - the list is the environment variable `MATEO_TEST_USER_IDS`,
 *    comma-separated, each entry trimmed, empty entries dropped;
 *  - an empty or absent list filters nothing;
 *  - an id matches exactly — ids are opaque, so no case folding;
 *  - a date with no organizer id is kept, as it is there.
 *
 * The ids live in configuration and never in code (`CONTRIBUTING.md`, live
 * data). No title heuristic is added: a real date may say "Test" — a
 * Feuerwehr siren test, a driving test — and the rule the calendar already
 * applies is the one this site applies.
 *
 * The list is read per call rather than once at module load, which is the one
 * difference from the community site's module: it lets a test set the variable
 * without re-importing, and the cost is one string split per adapter call.
 */

const VARIABLE = "MATEO_TEST_USER_IDS";

/** The configured test organizer ids — empty when the variable is unset. */
export function testOrganizerIds(
  env: Readonly<Record<string, string | undefined>> = process.env,
): ReadonlySet<string> {
  return new Set(
    (env[VARIABLE] ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );
}

/** Whether a date's organizer is one of the configured test accounts. */
export function isTestOrganizer(
  organizerId: string | undefined,
  ids: ReadonlySet<string> = testOrganizerIds(),
): boolean {
  return organizerId !== undefined && ids.has(organizerId);
}

/** Every date whose organizer is not a test account, in the order given. */
export function withoutTestOrganizers<T>(
  events: readonly T[],
  organizerOf: (event: T) => string | undefined,
): T[] {
  const ids = testOrganizerIds();
  if (ids.size === 0) return [...events];
  return events.filter((event) => !isTestOrganizer(organizerOf(event), ids));
}
