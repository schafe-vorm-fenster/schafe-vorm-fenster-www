/**
 * The briefing booking link — TS-016 D7 (S3): "One configured value
 * (environment/config), referenced by every S3 placement — never pasted per
 * page." Placements: `/dein-kalender`, `/deine-region`, and every step of
 * `/dein-kalender/bestellen` (TS-016 D1).
 *
 * The real Google Calendar appointment-schedule URL is not configured
 * anywhere yet (no source names it) — this is a placeholder value behind the
 * one constant every placement reads, so the real URL replaces it here once
 * it exists and touches no page. `state/open.md` — Mock aktiv.
 */
export const BRIEFING_URL =
  process.env.NEXT_PUBLIC_BRIEFING_URL ??
  "https://calendar.google.com/calendar/appointments/schedules/placeholder-briefing";
