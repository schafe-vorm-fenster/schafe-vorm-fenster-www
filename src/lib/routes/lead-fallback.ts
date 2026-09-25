/**
 * The registration form `/start` embeds — TS-WEB-0016 D6 / D15 (DEC-0108),
 * TS-WEB-0004 D1, DEC-0121.
 *
 * D6 fixes the shape and D1 fixes the path: every lead surface links to our
 * own `/start`, never to a third-party URL, "so that the swap to envoy
 * changes this one route and no lead surface". This module is that one
 * decision.
 *
 * Until 2026-09-25 `/start` was a 302 to the form. Since D15 it **renders**
 * the form as a visible embed (FUN-WEB-0205): the same Google Form that
 * already runs on the live site, the same audience, inside an `iframe`. The
 * form URL is read from `LEAD_FALLBACK_URL` when that is configured, so a
 * form swap is an environment change rather than a deploy; the constant
 * below is the value the live site uses today and is not a credential (it
 * is the form's public `viewform` URL).
 */

import { ALLOWLIST } from "../security/csp";

/** The live site's current lead form — a public Google Forms `viewform` URL. */
const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdO5AlaOpDWGwukrIge-qPvXAeiEVMgEwAViC-CmvkWLAjL3g/viewform";

/**
 * The form host — the one origin `frame-src` admits (TS-WEB-0014 D1, the
 * fifth row). `csp.ts` owns the value; this is the same constant read from
 * the routing side, so the allowlist and the embed cannot name two hosts.
 */
export const LEAD_FORM_ORIGIN: string = ALLOWLIST.googleForms;

/**
 * The configured target. Only an absolute `https:` URL is accepted — a
 * misconfigured value falls back to the form rather than turning `/start`
 * into an open redirect (its shape while `/start` was a redirect; kept so a
 * link surface can still name the form's canonical `viewform` URL).
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

/**
 * The `iframe` source of `/start` — the configured form with Google Forms'
 * own `?embedded=true`, the parameter its share dialog writes into the embed
 * snippet: it drops the host page's chrome (the Google header and footer)
 * so the frame carries the form and nothing else (DEC-0121 §2).
 *
 * Only a URL on the allowlisted form origin is framed. `frame-src` names that
 * one origin (TS-WEB-0014 D1), so a configured URL anywhere else would be a
 * frame the browser refuses — an empty box where the registration should
 * be. It falls back to the built-in form instead: the swap D15 foresees
 * (envoy, or the app's own registration) is a route change, never a value
 * that turns this embed into a frame of an unknown host.
 */
export function leadFormEmbedUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const target = new URL(leadFallbackUrl(env));
  const form = target.origin === LEAD_FORM_ORIGIN ? target : new URL(GOOGLE_FORM_URL);
  form.searchParams.set("embedded", "true");
  return form.toString();
}
