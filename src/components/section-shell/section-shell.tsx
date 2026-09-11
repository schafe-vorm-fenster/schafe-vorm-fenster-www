import type { ElementType, ReactNode } from "react";

import styles from "./section-shell.module.css";

/** The grounds a section may stand on — SRC-014 §Colour, §Page Rhythm. */
export const SECTION_SURFACES = [
  "paper",
  "surface",
  "surface-2",
  "lime-100",
  "lime-500",
  "ink",
  "violet-500",
] as const;

export type SectionSurface = (typeof SECTION_SURFACES)[number];

export interface SectionShellProps {
  readonly surface?: SectionSurface;
  /** 26–30 px standard, 20–24 px tight. One value per section. */
  readonly density?: "standard" | "tight";
  readonly id?: string;
  /** The stable `data-block` id a page's own composition sheet names (e.g. TS-024 D2). */
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
};

/**
 * 13 `section-shell` [PROPOSED] — SRC-014 §Shape and Space, §Page Rhythm.
 *
 * Structure: the one wrapper every block stands in. It takes a surface and a
 * density, and sections butt directly against each other — spacing never
 * doubles, because only the shell has padding.
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
 * live-data anchor — are composition rules. They are checked where the page
 * is composed (`src/components/section-shell/rhythm.ts`), not by a single
 * section that cannot see its neighbours.
 */
export function SectionShell({
  surface = "paper",
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

  return (
    <Element
      aria-label={label}
      aria-labelledby={labelledBy}
      className={classes}
      data-block={dataBlock}
      data-surface={surface}
      id={id}
    >
      {contained ? <div className="container">{children}</div> : children}
    </Element>
  );
}
