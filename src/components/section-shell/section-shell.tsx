import type { ElementType, ReactNode } from "react";

import styles from "./section-shell.module.css";

/** The grounds a section may stand on — SRC-0014 §Colour, §Page Rhythm. */
export const SECTION_SURFACES = [
  "paper",
  "surface",
  "surface-2",
  "lime-100",
  "lime-500",
  "ink",
  "violet-500",
  /** The "old world" ground of SRC-0014 §Archive block — problem content only. */
  "archive",
] as const;

export type SectionSurface = (typeof SECTION_SURFACES)[number];

export interface SectionShellProps {
  readonly surface?: SectionSurface;
  /**
   * The section's role, in the site's own fixed vocabulary — `WAS GERADE
   * ANSTEHT`, `WARUM DAS ZÄHLT`, `SO FUNKTIONIERT ES` … (polish brief G-3).
   * Mono, uppercase, no fill: a label, not a second badge. Every section
   * after the hero carries one, so no section begins with only a heading on
   * a new colour.
   */
  readonly kicker?: string;
  /**
   * One line tying this section to the one before it, where the argument
   * moves (G-3). It adds no claim; it names the joint. Rendered between the
   * kicker and the section's own heading, so the reader learns why she is
   * here before she is told what this is.
   */
  readonly transition?: string;
  /** 26–30 px standard, 20–24 px tight. One value per section. */
  readonly density?: "standard" | "tight";
  readonly id?: string;
  /** The stable `data-block` id a page's own composition sheet names (e.g. TS-WEB-0024 D2). */
  readonly dataBlock?: string;
  /** The id of the heading that names this section, for `aria-labelledby`. */
  readonly labelledBy?: string;
  /** An accessible name where the section carries no heading of its own. */
  readonly label?: string;
  /** `false` lets the child run edge to edge (a photo surface, a full band). */
  readonly contained?: boolean;
  readonly as?: ElementType;
  readonly className?: string;
  readonly children: ReactNode;
}

const SURFACE_CLASS: Record<SectionSurface, string> = {
  paper: styles.paper,
  surface: styles.surface,
  "surface-2": styles.surface2,
  "lime-100": styles.lime100,
  "lime-500": styles.lime500,
  ink: styles.ink,
  "violet-500": styles.violet500,
  archive: styles.archive,
};

/**
 * 13 `section-shell` [PROPOSED] — SRC-0014 §Shape and Space, §Page Rhythm.
 *
 * Structure: the one wrapper every block stands in. It takes a surface, a
 * density and — since polish brief G-3 — its role as a `kicker` and its
 * hand-off from the section before as a `transition` line. Sections butt
 * directly against each other; spacing never doubles, because only the shell
 * has padding, and the shell also flattens the trailing margin of its last
 * child so a paragraph's own `margin-bottom` cannot add a second padding to
 * the section's.
 * States: none of its own.
 * Inherits: radius 0, no border, no shadow; 16 px horizontal padding;
 * 26–30 px vertical standard, 20–24 px tight — **one value per section,
 * never a padded card inside a padded section**.
 * Space: the vertical rhythm is this component's whole job.
 * A11y: renders a `section` with an accessible name wherever it carries a
 * heading; contrast pairs come from the colour tables only.
 *
 * The rhythm rules the design system states — no two photo sections adjacent,
 * at most two consecutive sections of one colour family, exactly one
 * `himbeere` element per screen, the dark `ink` section once per page as the
 * live-data anchor (plus, at most, one closing search block as the page's last
 * section), the `archive` ground for problem content only — are composition
 * rules. They are checked where the page
 * is composed (`src/components/section-shell/rhythm.ts`), not by a single
 * section that cannot see its neighbours.
 */
export function SectionShell({
  surface = "paper",
  kicker,
  transition,
  density = "standard",
  id,
  dataBlock,
  labelledBy,
  label,
  contained = true,
  as: Element = "section",
  className,
  children,
}: SectionShellProps) {
  const classes = [
    styles.section,
    SURFACE_CLASS[surface],
    density === "tight" ? styles.tight : styles.standard,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const body = (
    <>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      {transition ? <p className={styles.transition}>{transition}</p> : null}
      {children}
    </>
  );

  return (
    <Element
      aria-label={label}
      aria-labelledby={labelledBy}
      className={classes}
      data-block={dataBlock}
      data-surface={surface}
      id={id}
    >
      {contained ? <div className="container">{body}</div> : body}
    </Element>
  );
}
