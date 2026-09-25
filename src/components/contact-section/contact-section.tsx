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
 * Structure: one section for the whole site, rendered once by the layout
 * between the closing CTA and the footer (DEC-0081 §2 — T-10 mounts it). A
 * 96 px round portrait, the section head and the responder's name beside
 * it, one Lead line, then **four** action rows in D13 order: video
 * appointment (filled, outbound), WhatsApp (outlined), phone and mail (the
 * two hairline rows in mono). The D16 outbound marking stands as its own
 * `meta` line **after** row 1, associated by `aria-describedby`.
 * States: none — the values resolved at build time (`contact-channels.json`)
 * and a missing one failed the build, not this render.
 * Inherits: ground `lime-100`, fixed, on every page; each row carries its own
 * ground. Every row is `data-cta="secondary"`; no `data-cta="primary"` exists
 * inside (TS-WEB-0006 D3, DEC-0082 amendment B).
 * Space: section padding block; rows 72 / 72 / 56 / 56 px.
 * A11y: a `section` named by its heading; real links; the title in each
 * link's name, the recipient out of it (TS-WEB-0016-A23). The head, the lead,
 * row 1's sub-label and the D16 sentence are placeholders until the owner
 * writes them, so the section carries `data-demo="true"` (DEC-0113).
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
            <p className={styles.name}>{contactResponder()}</p>
          </div>
        </div>
        <p className={styles.lead}>{d.lead}</p>
        <ul className={styles.rows}>
          <li className={styles.item}>
            <ContactActionRow
              channel="appointment"
              describedBy={noteId}
              href={contactHref("appointment")}
              route={route}
              title={d.rows.appointment}
              treatment="filled"
              value={d.appointmentSub}
            />
            {/* D16: under the control, never inside its label; the `meta`
                role; associated through `aria-describedby` above. Not a
                button, not a link, not a consent control. */}
            <p className={styles.note} id={noteId}>
              {d.outboundNote}
            </p>
          </li>
          <li className={styles.item}>
            <ContactActionRow
              channel="whatsapp"
              href={contactHref("whatsapp")}
              route={route}
              title={d.rows.whatsapp}
              treatment="outlined"
              value={contactDisplayValue("whatsapp")}
            />
          </li>
          <li className={styles.item}>
            <ContactActionRow
              channel="phone"
              href={contactHref("phone")}
              route={route}
              title={d.rows.phone}
              treatment="hairline"
              value={contactDisplayValue("phone")}
            />
          </li>
          <li className={styles.item}>
            <ContactActionRow
              channel="mail"
              href={contactHref("mail")}
              route={route}
              title={d.rows.mail}
              treatment="hairline"
              value={contactDisplayValue("mail")}
            />
          </li>
        </ul>
      </div>
    </section>
  );
}
