import Image from "next/image";

import { ContactActionRow } from "./contact-action-row";

import {
  contactDisplayValue,
  contactHref,
  contactResponder,
} from "@/src/lib/contact/contact-channels";
import { dictionary } from "@/src/lib/i18n/dictionary";

import type { Locale } from "@/src/lib/i18n/locales";
import type { RouteId } from "@/src/lib/routes/routes";

import styles from "./contact-section.module.css";

/**
 * The one anchor every in-page booking CTA resolves to — `<route>#kontakt`
 * through the route facade, the same id in both locales (a DOM id is not
 * copy; owner default, DEC-0113).
 */
export const CONTACT_SECTION_ID = "kontakt";

/**
 * The portrait of the person who answers — the cleared team portrait of
 * `/ueber-uns` (`content/pages/ueber-uns/de.md`, image
 * `ueber-uns-team-jan-henrik-hempel`: Eigenaufnahme, unbeschränkte Nutzung,
 * kein Credit nötig). Clipped to a 96 px circle here; the 4:5 editorial
 * portrait rule does not apply to this avatar (SRC-0014 §Contact section).
 */
const PORTRAIT_SRC = "/images/real/ueber-uns-team-jan-henrik-hempel.webp";

export interface ContactSectionProps {
  readonly locale: Locale;
  /** The route the section was rendered on — every event carries it (TS-WEB-0016 D12). */
  readonly route: RouteId;
  readonly className?: string;
}

/**
 * `contact-section` [PROPOSED] — SRC-0014 §Contact section, DEC-0081 (and its
 * amendments), TS-WEB-0016 D12/D13/D16, CG-031.
 *
 * Structure (tidied, review 2026-10-12, issue #41): one section for the
 * whole site, rendered once by the layout between the closing CTA and the
 * footer (DEC-0081 §2 — T-10 mounts it). A 96 px round portrait, the section
 * head and one line beside it — the responder's name in bold, then the lead.
 * Then **four** actions in D13 order: two pill buttons, video appointment
 * (filled, outbound) and WhatsApp (outlined), and beneath them phone and mail
 * as one small row of mono values with their icons. From `xl` the head and
 * the actions share one row. The D16 outbound marking stands as its own
 * `meta` line **after** the buttons, associated by `aria-describedby`.
 * States: none — the values resolved at build time (`contact-channels.json`)
 * and a missing one failed the build, not this render.
 * Inherits: ground `lime-100`, fixed, on every page; each row carries its own
 * ground. Every row is `data-cta="secondary"`; no `data-cta="primary"` exists
 * inside (TS-WEB-0006 D3, DEC-0082 amendment B).
 * Space: section padding block; buttons 56 px; phone and mail 44 px.
 * A11y: a `section` named by its heading; real links; the title in each
 * link's name, the recipient out of it (TS-WEB-0016-A23). The lead and the D16
 * sentence are final since 2026-10-28 (`state/open.md` rows 216, 218); the
 * head is still a placeholder until the owner writes it (row 215), so the
 * section keeps `data-demo="true"` (DEC-0113).
 */
export function ContactSection({ locale, route, className }: ContactSectionProps) {
  const d = dictionary(locale).contactSection;
  const headingId = `${CONTACT_SECTION_ID}-heading`;
  const noteId = `${CONTACT_SECTION_ID}-appointment-note`;

  return (
    <section
      aria-labelledby={headingId}
      className={[styles.section, className].filter(Boolean).join(" ")}
      data-contact-section
      data-demo="true"
      id={CONTACT_SECTION_ID}
    >
      <div className={["container", styles.inner].join(" ")}>
        <div className={styles.head}>
          <Image
            alt={d.portraitAlt}
            className={styles.portrait}
            height={96}
            sizes="96px"
            src={PORTRAIT_SRC}
            width={96}
          />
          <div className={styles.titles}>
            <h2 className={styles.heading} id={headingId}>
              {d.heading}
            </h2>
            {/* Name and lead are one line now (review 2026-10-12, #41). */}
            <p className={styles.byline}>
              <span className={styles.name}>{contactResponder()}</span>
              <span aria-hidden="true"> · </span>
              <span className={styles.lead}>{d.lead}</span>
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <ul className={styles.buttons}>
            <li>
              <ContactActionRow
                channel="appointment"
                describedBy={noteId}
                href={contactHref("appointment")}
                locale={locale}
                route={route}
                title={d.rows.appointment}
                treatment="filled"
              />
            </li>
            <li>
              <ContactActionRow
                channel="whatsapp"
                href={contactHref("whatsapp")}
                locale={locale}
                route={route}
                title={d.rows.whatsapp}
                treatment="outlined"
              />
            </li>
          </ul>
          {/* D16: after the control, never inside its label; the `meta`
              role; associated through `aria-describedby` on row 1. Not a
              button, not a link, not a consent control. Kept although the
              owner's design drops it: Q-0088 is open. */}
          <p className={styles.note} id={noteId}>
            {d.outboundNote}
          </p>
          <ul className={styles.direct}>
            <li>
              <ContactActionRow
                channel="phone"
                href={contactHref("phone")}
                locale={locale}
                route={route}
                title={d.rows.phone}
                treatment="inline"
                value={contactDisplayValue("phone")}
              />
            </li>
            <li>
              <ContactActionRow
                channel="mail"
                href={contactHref("mail")}
                locale={locale}
                route={route}
                title={d.rows.mail}
                treatment="inline"
                value={contactDisplayValue("mail")}
              />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
