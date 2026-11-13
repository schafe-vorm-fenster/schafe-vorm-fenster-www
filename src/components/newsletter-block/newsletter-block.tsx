import { RouteLink } from "../route-link/route-link";

import { NewsletterForm } from "./newsletter-form";

import { dictionary } from "@/src/lib/i18n/dictionary";
import { legalAnchor } from "@/src/lib/routes/legal-anchors";

import type { Locale } from "@/src/lib/i18n/locales";

import styles from "./newsletter-block.module.css";

export interface NewsletterBlockProps {
  readonly heading?: string;
  /**
   * One line saying what the letter actually carries, where the page has
   * authored one (`ueber-uns-6-newsletter`). The footer's own instance has
   * none: it is the same widget on all 24 routes and the page's inline one
   * is the one that argues for itself (polish brief page 10, item 7).
   */
  readonly lead?: string;
  readonly locale?: Locale;
  /**
   * The footer's form, on every one of the 24 routes: the email label is
   * read rather than drawn and the consent line sets tighter, so the block
   * is a heading, a field and one note instead of five stacked lines. The
   * page's own inline instance on `/ueber-uns` is unaffected.
   */
  readonly compact?: boolean;
  readonly className?: string;
}

/**
 * 49 `newsletter-block` [PROPOSED] — TS-WEB-0016 D10, S5, decision D-4.
 *
 * Structure: email address only, double opt-in, no cookie, no persistent
 * identifier; consent wording links `/rechtliches#datenschutz`. Footer on
 * every page; inline once on `/ueber-uns` (permitted only there).
 * States: Q-0020 (the sending system) is unanswered, so per the mock rule
 * this ships as a mock — the full UX, `data-mock="true"` on the block, and a
 * `Mock aktiv` row (`state/open.md` row 22). Nothing on the surface says so:
 * Jan's decision of 2026-09-18 keeps the marking out of the rendered copy.
 * No `state` prop: the mock is not late data arriving, it is the permanent
 * M2 shape until Q-0020 answers.
 * The email input carries no `name` — the one way a plain, no-JS `<form>`
 * can offer the full control surface (label, type="email", required) while
 * genuinely submitting nothing: an unnamed control is not a successful
 * control (HTML forms), so no address ever leaves the browser even if the
 * form is submitted before Q-0020 wires a real destination. That is unchanged
 * by F-3-11; what changed is that the form no longer *navigates*. It was the
 * only `<form>` on the site with neither `action` nor `onSubmit`, so one
 * mis-click on an ever-present footer widget reloaded the page with the query
 * string replaced — throwing away an unsent quote, `?orte=` on the order
 * flow, and `?ort=`/`?wer=` on the registration flow. `newsletter-form.tsx`
 * is the client half that cancels it and swaps in a `role="status"`
 * confirmation, the way `envoy-form-mount` already does.
 * Inherits: secondary treatment; the page still contains zero
 * `data-cta="primary"` elements on `/ueber-uns`.
 * Space: fixed height including the note line, so validation text never
 * shifts the footer.
 * A11y: label bound by `htmlFor`; the consent text is real content, not a
 * tooltip.
 *
 * Every string here comes from the dictionary (F-2-33): the block stands in
 * the footer of **every** route, so a German default was German on all
 * twelve `/en` pages. The consent link resolves through `legalAnchor`
 * (F-2-64) — it used to point at `#datenschutz` in both languages, and the
 * English legal page has no such id, so the link landed at the top of the
 * page instead of at the privacy section. And the mock says what it is
 * without naming the question behind it (F-2-35).
 */
export function NewsletterBlock({
  heading,
  lead,
  locale = "de",
  compact = false,
  className,
}: NewsletterBlockProps) {
  const words = dictionary(locale).newsletter;
  const [beforeLink, afterLink] = words.consent.split("%s");

  return (
    <div
      className={[styles.block, compact ? styles.compact : undefined, className]
        .filter(Boolean)
        .join(" ")}
      // The mock's marking, where Jan can read it and a visitor cannot
      // (2026-09-18). Q-0020, `state/open.md` row 22.
      data-mock="true"
      // F-3-11's own handle: the block is in the footer of all 24 routes and
      // the tests need to address *this* form rather than the page's.
      data-newsletter=""
    >
      {/* The dictionary heading is a placeholder (DEC-0120, state/open.md
          row 233): marked on its element, lifted when a page passes its own. */}
      <p className={styles.heading} data-demo={heading ? undefined : "true"}>
        {heading ?? words.heading}
      </p>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
      {/* The `<form>` itself is a client component (F-3-11): it has to cancel
          its own submit, and a server component cannot. The consent sentence
          is built here, because the link resolves through `legalAnchor` and
          `RouteLink`, both of which belong to the server tree. */}
      <NewsletterForm
        compact={compact}
        consent={
          <>
            {beforeLink}
            <RouteLink hash={legalAnchor("privacy", locale)} locale={locale} to="legal">
              {words.consentLinkLabel}
            </RouteLink>
            {afterLink}
          </>
        }
        emailLabel={words.emailLabel}
        emailPlaceholder={words.emailPlaceholder}
        submitLabel={words.submit}
        successBody={words.successBody}
        successHeadline={words.successHeadline}
      />
    </div>
  );
}
