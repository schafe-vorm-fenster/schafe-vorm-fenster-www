import { ConversionTracker } from "../conversion-tracker/conversion-tracker";
import { Icon, type IconName } from "../icon/icon";

import { contactRowConversions } from "./conversions";

import type { ContactChannelId } from "@/src/lib/contact/contact-channels";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

import styles from "./contact-section.module.css";

/** Filled · outlined (72 px, two lines, trailing arrow) · hairline (56 px, mono value). */
export type ContactActionRowTreatment = "filled" | "outlined" | "hairline";

const TREATMENT_CLASS: Record<ContactActionRowTreatment, string> = {
  filled: styles.filled,
  outlined: styles.outlined,
  hairline: styles.hairline,
};

const ICON: Record<ContactChannelId, IconName> = {
  appointment: "calendar-days",
  whatsapp: "smartphone",
  phone: "phone",
  mail: "mail",
};

export interface ContactActionRowProps {
  readonly channel: ContactChannelId;
  readonly href: string;
  readonly treatment: ContactActionRowTreatment;
  /** The bold title (CG-031 owner wording). Visually hidden on the hairline rows, where the value is the line. */
  readonly title: string;
  /** The sub-label — what the row *is*: the number, the address, what a booking covers. */
  readonly value: string;
  /** The route the section was rendered on — the payload's second attribute (D12). */
  readonly route: RouteId;
  /** The id of the D16 marking element that follows the control (row 1 only). */
  readonly describedBy?: string;
  readonly id?: string;
}

/**
 * `contact-action-row` [PROPOSED] — SRC-0014 §Contact section,
 * `specs/contracts/design-system-contract.md`, TS-WEB-0016 D13.
 *
 * Structure: one `<a>`, the whole row the target — a leading 24 px icon, a
 * bold title with a sub-label beneath it, a trailing 24 px `arrow-right`.
 * The hairline treatment (rows 3–4) is the icon and the value in mono at
 * body size, with the title kept for the accessible name only.
 * States: none — static markup around a value the build already resolved.
 * Inherits: **filled · outlined** is a visual weight, never a conversion
 * rank — every row is `data-cta="secondary"` (DEC-0082 amendment B) and the
 * component cannot take `primary` at all.
 * Space: 72 px, or 56 px on the hairline variant; radius 999.
 * A11y: a real link; the title is in the accessible name, the D16 marking
 * is not (it is `aria-describedby`, rendered by the section *after* the
 * control). Every click emits its goals through `conversion-tracker`, one
 * wrapper per goal id so no goal fires twice for one click (`conversions.ts`).
 */
export function ContactActionRow({
  channel,
  href,
  treatment,
  title,
  value,
  route,
  describedBy,
  id,
}: ContactActionRowProps) {
  const hairline = treatment === "hairline";

  const anchor = (
    <a
      aria-describedby={describedBy}
      className={[styles.row, TREATMENT_CLASS[treatment]].join(" ")}
      data-channel={channel}
      data-cta="secondary"
      href={href}
      id={id}
    >
      <Icon className={styles.glyph} name={ICON[channel]} size={24} />
      {hairline ? (
        <>
          <span className={styles.srOnly}>{title} </span>
          <span className={styles.mono}>{value}</span>
        </>
      ) : (
        <>
          <span className={styles.text}>
            <span className={styles.title}>{title}</span>
            <span className={styles.sub}>{value}</span>
          </span>
          <Icon className={styles.arrow} name="arrow-right" size={24} />
        </>
      )}
    </a>
  );

  // One `ConversionTracker` per goal id, nested: the click bubbles through
  // each `display: contents` wrapper once, so row 1 fires its two goals once
  // each and rows 2–4 their one (DEC-0081 amendment §3).
  return contactRowConversions(channel, route).reduceRight<ReactNode>(
    (child, binding) => (
      <ConversionTracker
        attributes={binding.attributes}
        goalId={binding.goalId}
        stage={binding.stage}
      >
        {child}
      </ConversionTracker>
    ),
    anchor,
  );
}
