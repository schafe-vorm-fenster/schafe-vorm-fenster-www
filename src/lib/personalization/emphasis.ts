/**
 * Emphasis and order — DEC-059, `plan/component-inventory.md` §5 D-1
 * (Q-052), TS-019 D3a.
 *
 * A page's focus job is stable at every stage. What the entry trait changes is
 * **the order of the scenes and which offer is emphasised** — nothing else.
 * This module is that mechanism, and it enforces the invariant structurally:
 * a trait's variant must be a **permutation** of the page's default order, so
 * no trait can add, remove or rewrite a block. A variant that is not one is
 * refused at render time (the default order stands) and reported by
 * `validateEmphasisTable()`, which a page's own test calls.
 *
 * The tables themselves belong to the pages — TS-019 D3a is the home page's.
 */

import type { EntryTrait } from "../relevance/types";

export type EmphasisTable<Id extends string> = Partial<Record<EntryTrait, readonly Id[]>>;

export interface EmphasisPlan<Id extends string> {
  readonly order: readonly Id[];
  /** The first position — the scene whose offer the page emphasises. */
  readonly emphasised: Id;
}

function isPermutation<Id extends string>(
  defaultOrder: readonly Id[],
  variant: readonly Id[],
): boolean {
  if (variant.length !== defaultOrder.length) return false;
  const wanted = [...defaultOrder].toSorted();
  const given = [...variant].toSorted();
  return wanted.every((id, index) => id === given[index]);
}

/** The order for one trait. Falls back to the default order, never throws. */
export function orderByTrait<Id extends string>(
  defaultOrder: readonly Id[],
  table: EmphasisTable<Id>,
  trait: EntryTrait,
): readonly Id[] {
  const variant = table[trait];
  if (variant === undefined || !isPermutation(defaultOrder, variant)) return [...defaultOrder];
  return [...variant];
}

/** The order plus the emphasised position, which is the first one. */
export function emphasise<Id extends string>(
  defaultOrder: readonly Id[],
  table: EmphasisTable<Id>,
  trait: EntryTrait,
): EmphasisPlan<Id> {
  const order = orderByTrait(defaultOrder, table, trait);
  return { order, emphasised: order[0] };
}

/** Every trait whose variant would change the page's structure. Empty is correct. */
export function validateEmphasisTable<Id extends string>(
  defaultOrder: readonly Id[],
  table: EmphasisTable<Id>,
): readonly string[] {
  return Object.entries(table)
    .filter(([, variant]) => !isPermutation(defaultOrder, variant as readonly Id[]))
    .map(([trait]) => `${trait}: the variant is not a permutation of the default order`);
}
