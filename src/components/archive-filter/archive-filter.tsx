"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Chip } from "../chip/chip";

import { matchesSelection, toggleSelection } from "./selection";

import type { ReactNode } from "react";

import styles from "./archive-filter.module.css";

/**
 * The hydration-safe "are we past the first client paint" read — `false`
 * during SSR and the first client render, `true` from then on. This is the
 * documented replacement for a `useEffect(() => setMounted(true), [])` gate,
 * which the `react-hooks/set-state-in-effect` rule refuses: no subscription
 * ever fires, so the snapshot only changes because client and server disagree
 * on it once, which is exactly the progressive-enhancement gate this
 * component needs — the chip row is absent until then (TS-028 D4/D5).
 */
function subscribeNever() {
  return () => {};
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export interface ArchiveFilterType {
  readonly id: string;
  readonly label: string;
}

export interface ArchiveFilterProps {
  /** Only types with ≥ 1 cleared entry get a chip — the caller pre-filters. */
  readonly types: readonly ArchiveFilterType[];
  readonly allLabel?: string;
  readonly label?: string;
  /** The archive rows, server-rendered, each carrying `data-archive-type`. */
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * 34 `archive-filter` [PROPOSED] — TS-028 D4/D5.
 *
 * Structure: one row of `chip`s plus *all*, multi-select, OR-combined; only
 * types with ≥ 1 cleared entry get a chip. Filtering runs client-side over
 * rows already in the static HTML — no navigation, no refetch, no URL
 * change, no history entry. This is the one exception besides
 * `motion-reveal` and `back-to-top` where the inventory's server-first rule
 * yields to interactivity the determination itself requires (component
 * README updated to name it).
 * States: zero selected = all; an empty result is unreachable by
 * construction (every visible type has ≥ 1 row), implemented as a defensive
 * honest line rather than assumed. **Without JavaScript the chip row is not
 * displayed at all** — it renders only after mount, so a visitor with no JS
 * sees the full, unfiltered list rather than a dead control.
 * Inherits: chip radius 999, ≥ 40 px; filtering removes rows and never
 * reorders the ones that remain.
 * Space: the chip row's height is fixed once mounted; row removal does not
 * shift the rows that remain — hidden rows collapse to nothing rather than
 * leaving a gap, which is the one layout shift this component accepts,
 * because it happens once, on a deliberate user action, not on late data.
 * A11y: the visible row count stands in an `aria-live="polite"` region;
 * focus stays on the pressed chip (default button behaviour, untouched);
 * the pressed state is `chip`'s own fill-plus-check mark, never colour-only.
 */
export function ArchiveFilter({
  types,
  allLabel = "Alle",
  label = "Nach Typ filtern",
  children,
  className,
}: ArchiveFilterProps) {
  const mounted = useSyncExternalStore(subscribeNever, getClientSnapshot, getServerSnapshot);
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());
  const [visible, setVisible] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-archive-type]"));
    let shown = 0;
    for (const row of rows) {
      const rowTypes = (row.dataset.archiveType ?? "").split(" ").filter(Boolean);
      const show = matchesSelection(rowTypes, selected);
      row.hidden = !show;
      if (show) shown += 1;
    }
    setVisible(shown);
    setTotal(rows.length);
  }, [selected, mounted]);

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      {mounted ? (
        <div aria-label={label} className={styles.chips} role="group">
          <Chip onClick={() => setSelected(new Set())} selected={selected.size === 0}>
            {allLabel}
          </Chip>
          {types.map((type) => (
            <Chip
              key={type.id}
              onClick={() => setSelected((prev) => toggleSelection(prev, type.id))}
              selected={selected.has(type.id)}
            >
              {type.label}
            </Chip>
          ))}
        </div>
      ) : null}
      {mounted && visible !== null ? (
        <p aria-live="polite" className={styles.count}>
          {visible} von {total} Einträgen
        </p>
      ) : null}
      <div ref={listRef}>{children}</div>
    </div>
  );
}
