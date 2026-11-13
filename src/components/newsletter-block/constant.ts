/**
 * The one newsletter-availability constant — TS-WEB-0016 D10 / A21, DEC-0122.
 *
 * `null` until a sending system accepts a subscription (Q-0020,
 * `state/open.md` row 22). A21 forbids a form that posts nowhere and a
 * click-to-chat link whose arriving message nothing records, so while this
 * is `null` the block renders **nowhere** — not in the footer
 * (`app/[lang]/layout.tsx`), not inline on `/ueber-uns` — and the
 * `subscribe-to-newsletter` goal has no surface. The block itself keeps its
 * shape (`newsletter-block.tsx`); the two mount sites read this constant, so
 * the block *returns* with the owner's benefit heading the moment a system
 * is named here, the same construction `response-promise/constant.ts` uses
 * for the two-working-day promise: removed, never softened.
 */
export const NEWSLETTER_SENDING_SYSTEM: string | null = null;

/** `true` once a sending system is named — the one gate both mount sites read. */
export function newsletterOffered(): boolean {
  return NEWSLETTER_SENDING_SYSTEM !== null;
}
