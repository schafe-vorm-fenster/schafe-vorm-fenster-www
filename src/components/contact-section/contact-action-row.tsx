import { ConversionTracker } from "../conversion-tracker/conversion-tracker";
import { Icon, type IconName } from "../icon/icon";

import { contactRowConversions } from "./conversions";

import type { ContactChannelId } from "@/src/lib/contact/contact-channels";
import type { RouteId } from "@/src/lib/routes/routes";
import type { ReactNode } from "react";

import styles from "./contact-section.module.css";

/** Filled · outlined (pill buttons, icon and title) · inline (icon and mono value, no fill). */
export type ContactActionRowTreatment = "filled" | "outlined" | "inline";

const TREATMENT_CLASS: Record<ContactActionRowTreatment, string> = {
  filled: styles.filled,
  outlined: styles.outlined,
  inline: styles.inline,
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
  /** The bold title (CG-031 owner wording). Visually hidden on the inline rows, where the value is the line. */
  readonly title: string;
  /** What an inline row shows: the number or the address. The two buttons show their title only. */
  readonly value?: string;
  /** The route the section was rendered on — the payload's second attribute (D12). */
  readonly route: RouteId;
  /** The id of the D16 marking element that follows the control (row 1 only). */
  readonly describedBy?: string;
  readonly id?: string;
}

/**
 * `contact-action-row` [PROPOSED] — SRC-0014 §Contact section, tidied
 * (review 2026-10-12, issue #41), `specs/contracts/design-system-contract.md`,
 * TS-WEB-0016 D13.
 *
 * Structure: one `<a>`, the whole control the target. The two buttons
 * (filled, outlined) are a pill with a leading 24 px icon and the bold
 * title, nothing else: the sub-label and the trailing arrow of the earlier
 * rows are gone. The inline treatment (phone, mail) is the icon and the
 * value in mono at meta size, with the title kept for the accessible name.
 * States: none — static markup around a value the build already resolved.
 * Inherits: **filled · outlined** is a visual weight, never a conversion
 * rank — every row is `data-cta="secondary"` (DEC-0082 amendment B) and the
 * component cannot take `primary` at all.
 * Space: buttons `height-button` (56 px), radius 999; inline rows 44 px.
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
  const inline = treatment === "inline";

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
      {inline ? (
        <>
          <span className={styles.srOnly}>{title} </span>
          <span className={styles.mono}>{value}</span>
        </>
      ) : (
        <span className={styles.title}>{title}</span>
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
