/**
 * The three publishing paths of `/mitmachen`, read off the content artifact
 * — TS-WEB-0022 D3/D4, DEC-0124.
 *
 * The artifact carries three kinds of list and this module is the only place
 * that knows their shape, so the page composes components and never parses:
 *
 * | List | Separator | Shape |
 * | --- | --- | --- |
 * | objection rows (slot 2, both halves) | ` — ` | core — detail |
 * | step lines (`*-steps-demo`) | ` — ` | core — detail, **exactly three** |
 * | sample event rows (`*-steps-demo`) | ` \| ` | title \| meta \| category \| label [\| status \| status label] |
 *
 * `" — "` is the separator because the copy is written around it: no
 * objection row and no step line carries an em dash inside its own sentence
 * (the Redaktion row reads "Redaktionsschluss, und eine Redaktion"). The
 * sample rows take `" | "` instead, because they have six fields rather than
 * two.
 *
 * A malformed slot **throws at render**. Three step lines is a determination
 * ("not two, not four", D4) and `ThreeOf` is how the component says so; a
 * silently padded tuple would put an empty line on the page instead of
 * failing the build that produced it.
 */

import { EVENT_CATEGORIES, type EventCategory } from "@/src/components/event-row/event-row";
import { EVENT_STATUSES, type EventStatus } from "@/src/components/event-status-badge/event-status-badge";

import type { ExplainStep } from "@/src/components/content-fragments";
import type { ThreeOf } from "@/src/components/explain-module/explain-module";
import type { ContentBlock } from "@/src/lib/content/types";

/** Core and detail of one authored line. */
export const CORE_DETAIL = " — ";

/** The fields of one authored sample event row. */
export const ROW_FIELD = " | ";

/** Every list of a slot, in document order — the reach rows, then the archive rows. */
export function listsOf(blocks: readonly ContentBlock[]): readonly (readonly string[])[] {
  return blocks.flatMap((block) => (block.kind === "list" ? [block.items] : []));
}

/** The n-th list of a slot, or an empty list where the slot carries none. */
export function listAt(blocks: readonly ContentBlock[], index: number): readonly string[] {
  return listsOf(blocks)[index] ?? [];
}

export interface CoreDetail {
  readonly core: string;
  readonly detail: string;
}

/**
 * `core — detail`. A line without the separator is all core and no detail:
 * the channel names itself and the failure is the whole sentence (the
 * rendering split of TS-WEB-0022 D3, [PROPOSED]).
 */
export function splitCoreDetail(line: string): CoreDetail {
  const at = line.indexOf(CORE_DETAIL);
  if (at === -1) return { core: line.trim(), detail: "" };
  return {
    core: line.slice(0, at).trim(),
    detail: line.slice(at + CORE_DETAIL.length).trim(),
  };
}

/**
 * Exactly three step lines, as the module's tuple type.
 *
 * @throws when the slot carries any other number — D4 fixes the count, and a
 *   content artifact that disagrees is a defect the build must show.
 */
export function threeSteps(items: readonly string[], slotId: string): ThreeOf<ExplainStep> {
  if (items.length !== 3) {
    throw new Error(
      `${slotId}: an explain module has exactly three step lines (TS-WEB-0022 D4), found ${items.length}`,
    );
  }
  const [one, two, three] = items.map(splitCoreDetail) as [CoreDetail, CoreDetail, CoreDetail];
  return [one, two, three];
}

/**
 * One authored row of a stage calendar — the `event-row` facts, without a
 * date. The date is not content: a written date ages, so the page derives
 * three upcoming days inside its cached helper and the artifact carries only
 * what the row says.
 */
export interface SampleRowSpec {
  readonly title: string;
  readonly meta: string;
  readonly category: EventCategory;
  readonly categoryLabel: string;
  readonly status?: EventStatus;
  readonly statusLabel?: string;
}

function isCategory(value: string): value is EventCategory {
  return (EVENT_CATEGORIES as readonly string[]).includes(value);
}

function isStatus(value: string): value is EventStatus {
  return (EVENT_STATUSES as readonly string[]).includes(value);
}

/**
 * `title | meta | category | label [| status | status label]` → the row.
 *
 * The category id and the status id are the system's own vocabularies, so an
 * unknown one throws rather than degrading to a default: a row whose colour
 * and glyph were picked by a typo says something the content did not.
 */
export function sampleRows(items: readonly string[], slotId: string): SampleRowSpec[] {
  return items.map((line) => {
    const fields = line.split(ROW_FIELD).map((field) => field.trim());
    const [title, meta, category, categoryLabel, status, statusLabel] = fields;
    if (fields.length < 4 || !title || !category || !categoryLabel) {
      throw new Error(
        `${slotId}: a sample event row is "title | meta | category | label [| status | status label]", found "${line}"`,
      );
    }
    if (!isCategory(category)) {
      throw new Error(`${slotId}: "${category}" is no event category (event-row.tsx)`);
    }
    if (status !== undefined && status !== "" && !isStatus(status)) {
      throw new Error(`${slotId}: "${status}" is no event status (event-status-badge.tsx)`);
    }
    return {
      title,
      meta: meta ?? "",
      category,
      categoryLabel,
      status: status === undefined || status === "" ? undefined : (status as EventStatus),
      statusLabel: statusLabel === undefined || statusLabel === "" ? undefined : statusLabel,
    };
  });
}

/**
 * Exactly three sample rows — the stage panel is a fixed picture at
 * `ratio-square`, not a list that grows (TS-WEB-0022-A19, DEC-0115).
 */
export function threeSampleRows(
  items: readonly string[],
  slotId: string,
): ThreeOf<SampleRowSpec> {
  const rows = sampleRows(items, slotId);
  if (rows.length !== 3) {
    throw new Error(`${slotId}: a stage calendar shows three rows, found ${rows.length}`);
  }
  return [rows[0], rows[1], rows[2]];
}
