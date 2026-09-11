/**
 * The briefing booking link — TS-016 D7 (S3): "One configured value
 * (environment/config), referenced by every S3 placement — never pasted per
 * page." Placements: `/dein-kalender`, `/deine-region`,
 * `/deine-region/angebot` and every step of `/dein-kalender/bestellen`
 * (TS-016 D1).
 *
 * **The URL is real** (F-2-32). This module used to state that "the real
 * Google Calendar appointment-schedule URL is not configured anywhere yet (no
 * source names it)" and default to a placeholder Google answers with "Termin
 * nicht gefunden" — so `request-product-briefing`, a wired conversion goal,
 * dead-ended on every one of its placements. The premise was false: the
 * installed hub package carries it.
 *
 *   `node_modules/@schafe-vorm-fenster/people/jan-henrik-hempel/jan-henrik-hempel.person.md:24`
 *   → `url: https://calendar.app.google/VG9bZoYVnFcX1W6F8`,
 *     labelled "Booking a video call … Public, brand-neutral, usable for
 *     Schafe vorm Fenster and for the AI-coaching track alike".
 *
 * Transcribed rather than imported, for the reason `src/lib/pricing/offerings.ts`
 * records for the offering packages: the hub packages are devDependencies of
 * the content pipeline, and the loader architecture never opens one at
 * request time (TS-007 D3). The environment variable still wins, so a
 * different schedule needs no code change.
 */
export const BRIEFING_URL =
  process.env.NEXT_PUBLIC_BRIEFING_URL ?? "https://calendar.app.google/VG9bZoYVnFcX1W6F8";

/** Who receives the visitor's data by following the link (TS-016 D9, DEC-013). */
export const BRIEFING_RECIPIENT = "Google";
