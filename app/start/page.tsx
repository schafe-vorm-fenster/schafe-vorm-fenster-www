import { linkHref } from "@/src/components/route-link/href";
import { dictionary } from "@/src/lib/i18n/dictionary";
import { leadFormEmbedUrl } from "@/src/lib/routes/lead-fallback";
import { NOINDEX } from "@/src/lib/seo/indexable";

import styles from "./start.module.css";

import type { Metadata } from "next";

/**
 * The imprint's own contact address — the same constant `app/[lang]/_chrome.tsx`
 * reads for the lead fallback (its line 75), and row 4 of the hub's
 * `@schafe-vorm-fenster/goals` `contact-channels.md`. TS-WEB-0016 D15 wants the
 * address **beside** the embed, "so a visitor must be able to decline Google
 * and still reach a person" (D6's third rule). It moves onto T-01's generated
 * `src/generated/contact-channels.json` when that lands (T-01's record), as
 * the chrome's copy does.
 */
const CONTACT_EMAIL = "jan@schafe-vorm-fenster.de";

/**
 * The route serves one language (see `layout.tsx`), so the dictionary is read
 * once, here, rather than per request.
 */
const LOCALE = "de" as const;

/**
 * TS-WEB-0004 D1's `/start` row: `noindex`, absent from the sitemap. The
 * sitemap is built from the page registry, which this path is not in, so the
 * second half holds by construction. The first half is stated here
 * **unconditionally** — the `[lang]` layout adds `robots` only off
 * production, because those pages are meant to be indexed there; this one
 * never is. The proxy's `X-Robots-Tag` (TS-WEB-0015 D3) still covers every
 * non-production response on top.
 */
export const metadata: Metadata = {
  title: `${dictionary(LOCALE).pages.register} — ${dictionary(LOCALE).siteName}`,
  robots: NOINDEX,
};

/**
 * `/start` — the registration surface. TS-WEB-0016 D15 (the embed), D17 (the
 * notice), TS-WEB-0004 D1, DEC-0108, DEC-0121.
 *
 * Structure, in DOM order and top to bottom: the page heading; the notice
 * (D17 — one block, no heading, no list, not a control); the `iframe` of the
 * configured Google Form, visible and immediate — no click-to-load layer, no
 * `details`, nothing hidden or collapsed (D15 "Shape"); the e-mail address as
 * a `mailto:` link beside it (D15 "Beside it").
 *
 * States: one. The notice and the frame are part of the prerendered document
 * and carry no data dependency, so the notice is in the HTML before any frame
 * paints (D17 "Timing"). Nothing on the page waits for anything, and nothing
 * is stored (D17 "Not a control").
 *
 * What is deliberately absent: a conversion event (D15 "Measurement:
 * nothing" — the submission is Google's and the website does not observe
 * it), a consent component (NFR-WEB-0062), a data-protection claim
 * (TS-WEB-0013 D1 as narrowed by DEC-0108 §3 — a notice states what happens,
 * not what does not), and a `sandbox` attribute on the frame: the form needs
 * scripts, its own origin's storage and form submission to work at all, and a
 * sandbox that grants all three fences nothing (DEC-0121 §5).
 *
 * `data-demo="true"` on the notice and on the frame's title: the three facts
 * and the link target are the determination's, the **words** are not
 * (DEC-0108 §2 "The words"; `state/open.md` rows 215 and 216). The heading
 * and the e-mail line reuse wording that already exists — `pages.register`
 * and `lead-fallback.tsx`'s "oder per E-Mail:".
 */
export default function StartPage() {
  const d = dictionary(LOCALE);
  const privacyHref = linkHref("legal", { locale: LOCALE, hash: "datenschutz" });

  return (
    <main className={styles.page} id="main">
      <h1>{d.pages.register}</h1>
      {/* D17 — above the embed, in DOM order and visually, inside the same
          region. A paragraph and a link: no button, no checkbox, no dismiss,
          no `role`, nothing that could be read as a control. */}
      <p className={styles.notice} data-block="embed-notice" data-demo="true">
        {d.start.notice} <a href={privacyHref}>{d.start.noticeLink}</a>
      </p>
      {/* D15 — exactly one frame, of the configured form host, `?embedded=true`
          (`lead-fallback.ts`). Eager: the visitor came for the form. */}
      <iframe
        className={styles.frame}
        data-demo="true"
        loading="eager"
        src={leadFormEmbedUrl()}
        title={d.start.frameTitle}
      />
      <p className={styles.email}>
        {d.start.emailLead} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </main>
  );
}
