/**
 * The pure OR-combined multi-select rule (TS-028 D4/D5): zero selected means
 * every row shows, otherwise a row shows if it carries at least one of the
 * selected types. Kept apart from the DOM-touching component so the rule
 * itself is tested without a browser.
 */
export function matchesSelection(rowTypes: readonly string[], selected: ReadonlySet<string>): boolean {
  if (selected.size === 0) return true;
  return rowTypes.some((type) => selected.has(type));
}

/** Toggles one type in an immutable selection set — the chip's click rule. */
export function toggleSelection(selected: ReadonlySet<string>, type: string): Set<string> {
  const next = new Set(selected);
  if (next.has(type)) next.delete(type);
  else next.add(type);
  return next;
}
