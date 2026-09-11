/**
 * Where `/start` sends a visitor — TS-016 D6 / DEC-069, TS-004 D1.
 *
 * D6 fixes the shape and D1 fixes the path: every lead surface links to our
 * own `/start`, never to a third-party URL, "so that the swap to envoy
 * changes this one redirect and no lead surface". This module is that one
 * decision.
 *
 * The target today is the Google Form that already runs at this exact URL on
 * the live site — the same form, the same audience, one hop. It is read from
 * `LEAD_FALLBACK_URL` when that is configured, so the envoy swap is an
 * environment change rather than a deploy; the constant below is the value
 * the live site uses today and is not a credential (it is the form's public
 * viewform URL, and DEC-069 forbids embedding it).
 */

/** The live site's current lead form — a public Google Forms `viewform` URL. */
const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdO5AlaOpDWGwukrIge-qPvXAeiEVMgEwAViC-CmvkWLAjL3g/viewform";

/**
 * The configured target. Only an absolute `https:` URL is accepted — a
 * misconfigured value falls back to the form rather than turning `/start`
 * into an open redirect.
 */
export function leadFallbackUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const configured = env.LEAD_FALLBACK_URL;
  if (!configured) return GOOGLE_FORM_URL;
  try {
    const parsed = new URL(configured);
    if (parsed.protocol !== "https:") return GOOGLE_FORM_URL;
    return parsed.toString();
  } catch {
    return GOOGLE_FORM_URL;
  }
}
