"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Chip } from "../chip/chip";
import { Icon } from "../icon/icon";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { DEFAULT_LOCALE } from "@/src/lib/i18n/locales";

import { matchesSelection, toggleSelection } from "./selection";

import type { Locale } from "@/src/lib/i18n/locales";
import type { ReactNode } from "react";

import chipStyles from "../chip/chip.module.css";
import styles from "./archive-filter.module.css";

/**
 * The hydration-safe "are we past the first client paint" read — `false`
 * during SSR and the first client render, `true` from then on. This is the
 * documented replacement for a `useEffect(() => setMounted(true), [])` gate,
 * which the `react-hooks/set-state-in-effect` rule refuses: no subscription
 * ever fires, so the snapshot only changes because client and server disagree
 * on it once, which is exactly the progressive-enhancement gate this
 * component needs — the chip row is inert until then (TS-WEB-0028 D4/D5).
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

/**
 * The reset's own space, held open while there is nothing to reset.
 *
 * The reset is the eighth item in a wrapping flex row, so whether it is in
 * the row decides where the row breaks. Measured on `/ueber-uns/archiv` at
 * the three DEC-0067 widths, pressing the first chip: at 360 px and 768 px the
 * reset happened to land on a line that already had room (row height 200 px
 * and 96 px, unchanged), but at **1024 px the seven type chips fit on one
 * line and the reset did not** — the chip row went 44 px → 96 px and pushed
 * all 31 rows down 52 px on a click. That is the "a chip row that re-wrapped"
 * case TS-WEB-0028-A13's own guard is written to catch, and it caught it.
 *
 * So the row always contains the reset's box and only ever changes what is
 * painted in it. `visibility: hidden` is the same mechanism, and the same
 * `.reserved` rule, that `ReservedChipRow` and the count line already use:
 * the box keeps its place in the wrap, and the copy is a `span` outside the
 * accessibility tree and the tab order, carrying neither `data-archive-reset`
 * nor a `button` role — so "a reset only exists while there is a selection to
 * clear" (polish brief page 11, item 1) still holds for every visitor and
 * every assistive technology. Only the layout knows it is there.
 */
function ReservedReset({ label }: { readonly label: string }) {
  return (
    <span aria-hidden="true" className={[styles.reset, styles.reserved].join(" ")}>
      <Icon name="circle-x" size={18} />
      {label}
    </span>
  );
}

/**
 * F-2-69 — the reserved chip row, rendered until hydration replaces it.
 *
 * The chip group is client-only by determination (TS-WEB-0028 D8: without
 * JavaScript the chip row is "not displayed (hidden until hydration)"), so it
 * enters the DOM only after mount. Inserted into a flow layout that had not
 * accounted for it, that insertion pushed the row list **262 px** down and
 * measured CLS 0.2197 on `/ueber-uns/archiv` — against TS-WEB-0028-A13 and
 * TS-WEB-0009-A8, which both ask for < 0.1.
 *
 * So the pre-hydration render reserves the box rather than leaving it out. It
 * reserves it with the **same labels in the same chip geometry** — the chip's
 * own classes, imported rather than re-declared, including the check glyph
 * the pressed *all* chip carries from the very first mounted render — laid
 * out by the same `.chips` rule. The reserved block therefore wraps to
 * exactly as many lines as the real one at every width, 360, 768 and 1024
 * alike (TS-WEB-0017 D2, mobile-first), instead of trusting one hand-measured
 * height that would only hold at the width it was measured at.
 *
 * It stays legal under TS-WEB-0028-A9 and D8: `visibility: hidden` (the `.reserved`
 * rule) means the chip row is *not visible*, and the reserved chips are spans
 * rather than buttons, carry no `role="group"` and are `aria-hidden`. A
 * `visibility: hidden` subtree is outside both the accessibility tree and the
 * tab order, so a visitor without JavaScript is offered nothing dead.
 */
function ReservedChipRow({
  types,
  allText,
}: {
  readonly types: readonly ArchiveFilterType[];
  readonly allText: string;
}) {
  const chipClass = [chipStyles.chip, chipStyles.light].join(" ");

  return (
    <div aria-hidden="true" className={[styles.chips, styles.reserved].join(" ")}>
      {/* The mounted row opens with nothing selected and therefore with the
          type chips alone — the *all* control is a reset and appears only
          once there is something to reset (polish brief page 11, item 1).
          The reserved copy is chip for chip the same row, so it wraps to the
          same number of lines at every width. */}
      {types.map((type) => (
        <span className={chipClass} key={type.id}>
          {type.label}
        </span>
      ))}
      {/* …and the reset's box too, so this row and the mounted one break at
          the same places. Without it the swap at hydration is itself a
          re-wrap at 1024 px. */}
      <ReservedReset label={allText} />
    </div>
  );
}

export interface ArchiveFilterProps {
  /** Only types with ≥ 1 cleared entry get a chip — the caller pre-filters. */
  readonly types: readonly ArchiveFilterType[];
  /** The page's language — the three default labels come from it (F-2-33). */
  readonly locale?: Locale;
  readonly allLabel?: string;
  readonly label?: string;
  /** The archive rows, server-rendered, each carrying `data-archive-type`. */
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * 34 `archive-filter` [PROPOSED] — TS-WEB-0028 D4/D5.
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
 * honest line rather than assumed.
 * **Without JavaScript the chip row is not visible** — until mount the row is
 * a `visibility: hidden` copy of itself that only holds its own space
 * (`ReservedChipRow`, F-2-69), so a visitor with no JS sees the full,
 * unfiltered list and no dead control.
 * Inherits: chip radius 999, ≥ 40 px; filtering removes rows and never
 * reorders the ones that remain.
 * Space: the chip row and the count line occupy their final height from the
 * **server** render on, so neither hydration nor the first count measurement
 * moves the rows below them (TS-WEB-0028-A13, TS-WEB-0009-A8 — CLS < 0.1). Row removal
 * does not shift the rows that remain — hidden rows collapse to nothing
 * rather than leaving a gap, which is the one layout shift this component
 * accepts, because it happens once, on a deliberate user action, not on late
 * data.
 * A11y: the visible row count stands in an `aria-live="polite"` region;
 * focus stays on the pressed chip (default button behaviour, untouched);
 * the pressed state is `chip`'s own fill-plus-check mark, never colour-only.
 * Test seam: the wrapper carries `data-archive-filter` and flips
 * `data-hydrated` to `"true"` in the same render that swaps the reserved row
 * for the real one — the hydration signal F-2-71 needs, so an e2e assertion
 * can wait for the chips instead of racing them. An attribute flip costs no
 * layout.
 */
export function ArchiveFilter({
  types,
  locale = DEFAULT_LOCALE,
  allLabel,
  label,
  children,
  className,
}: ArchiveFilterProps) {
  // F-2-33: the three defaults were German literals, so `/en/about/archive`
  // read "Alle", "Nach Typ filtern" and "… von … Einträgen". A caller may
  // still override them; what it may not do any more is inherit German.
  const d = dictionary(locale).archiveFilter;
  const allText = allLabel ?? d.all;
  const labelText = label ?? d.label;
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
    <div
      className={[styles.wrapper, className].filter(Boolean).join(" ")}
      data-archive-filter
      data-hydrated={mounted ? "true" : "false"}
    >
      {/* The count stands **above** the chips (polish brief page 11, item 2):
          the page's first line then says how big the archive is, before it
          offers eight controls for narrowing it down. */}
      {mounted && visible !== null ? (
        <p aria-live="polite" className={styles.count}>
          {d.count.replace("{visible}", String(visible)).replace("{total}", String(total))}
        </p>
      ) : (
        /* The count is only known once the rows have been walked, one effect
           after mount — a second, smaller insertion if its line were left out
           until then. The reserved line holds the same single line box (same
           font, same size, same margin), invisible and out of the
           accessibility tree, so the count appears in place of its own
           placeholder rather than on top of the rows (F-2-69). */
        <p aria-hidden="true" className={[styles.count, styles.reserved].join(" ")}>
          &nbsp;
        </p>
      )}
      {mounted ? (
        <div aria-label={labelText} className={styles.chips} role="group">
          {types.map((type) => (
            <Chip
              key={type.id}
              onClick={() => setSelected((prev) => toggleSelection(prev, type.id))}
              selected={selected.has(type.id)}
            >
              {type.label}
            </Chip>
          ))}
          {/* Eight pills at 40 px each is a lot of furniture in front of a
              list nobody browses, and one of them — *all* — was pressed by
              default and did nothing when pressed again. It is a reset now,
              and a reset only exists while there is a selection to clear. */}
          {selected.size > 0 ? (
            <button
              className={styles.reset}
              data-archive-reset
              onClick={() => setSelected(new Set())}
              type="button"
            >
              <Icon name="circle-x" size={18} />
              {allText}
            </button>
          ) : (
            <ReservedReset label={allText} />
          )}
        </div>
      ) : (
        <ReservedChipRow allText={allText} types={types} />
      )}
      <div ref={listRef}>{children}</div>
    </div>
  );
}
