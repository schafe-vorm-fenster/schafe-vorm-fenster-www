/**
 * The one switch — DEC-0218 §1 (issue 194).
 *
 * `NEXT_PUBLIC_ETRACKER_SECURE_CODE` carries the eTracker account's secure
 * code. It is set in the Vercel project, never in a committed file
 * (TS-WEB-0012 D2: "supplied as a build-time env var — never inlined in a
 * committed file"). Set, the loader is mounted on every page of `app/[lang]`
 * and the real adapter answers `getAnalyticsTracker()`; unset, nothing is
 * loaded and the mock answers — no error, no request, no warning.
 *
 * `NEXT_PUBLIC_`, because the code has to reach the browser twice: as the
 * loader's `data-secure-code` and as `et_et` in every virtual page view. It
 * is not a secret — the loader tag puts it in every page's markup — but it
 * still lives in the environment, so a second property or an account change
 * needs no commit. Next inlines the value at build time, so a change takes a
 * redeploy.
 *
 * The value is accepted only in the vendor's code shape; anything else is
 * treated as unset rather than written into a script attribute.
 */

const SECURE_CODE_SHAPE = /^[A-Za-z0-9]{1,32}$/;

export function etrackerSecureCode(): string | undefined {
  const value = process.env.NEXT_PUBLIC_ETRACKER_SECURE_CODE?.trim();
  return value && SECURE_CODE_SHAPE.test(value) ? value : undefined;
}
