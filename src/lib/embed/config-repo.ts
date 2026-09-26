/**
 * The Portalize configuration repository — the target of the "Alle
 * Einstellungen im Detail" link under `/dein-kalender`'s configuration block.
 *
 * The 2026-09-22 review asks for the link ("Was alles konfiguriert werden
 * kann, steht technisch in der Portalize-Config fest … Dafür gibt es ein
 * Repo, das verlinken wir hier") and the design draft draws it, but **no
 * record in this repository names the URL** — not an offering, not a hub
 * package, not the environment. Inventing one would ship a link that goes
 * nowhere from the page that asks for 480 €, so the link is gated instead:
 * `null` means the block renders its six settings and no link at all
 * (`state/open.md`, DEC-0131 §4).
 *
 * The environment variable is the same S3 shape `src/lib/live/briefing.ts`
 * uses for the appointment URL: one configured value, referenced by the one
 * placement, never pasted into a page.
 */
export const CONFIG_REPO_URL: string | null =
  process.env.NEXT_PUBLIC_PORTALIZE_CONFIG_URL ?? null;
