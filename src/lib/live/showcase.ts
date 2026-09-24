/**
 * The showcase community — what the live modules speak about before the
 * visitor has said where she is (TS-WEB-0010 stage 0).
 *
 * Position 1 needs a place slug and position 2 a coordinate. At stage 0 the
 * website has neither, and the two ways out are: render no live module at
 * all (which plan/guardrails.md forbids — "never as a hole"), or anchor the
 * modules on **one configured reference community**.
 *
 * This is that configuration, and since 2026-09-18 it names a **real place
 * with real dates**: Schlatkow in Vorpommern-Greifswald — the company's own
 * village, the one every piece of brand copy already names ("aus Schlatkow
 * für den ländlichen Raum"), and a community the village calendar covers with
 * dozens of upcoming entries of its own. Measured on 2026-09-18 against the
 * public site: 88 upcoming dates in and around it, 28 of them its own.
 *
 * It is **configuration, not data**: one import, no page hard-codes it, and
 * when the proxy hands the request geo down (`src/lib/personalization/`) the
 * anchor resolver gains a second source without any page changing.
 *
 * The **county** is Vorpommern-Greifswald, `geoname.8648415` — the id the
 * village calendar itself uses (`community-site/src/utils/community-county.ts`
 * `COUNTY_IDS.VORPOMMERN_GREIFSWALD`), so `region.ts` and the calendar agree
 * about which county that is.
 */

export const SHOWCASE_COUNTY = {
  id: "geoname.8648415",
  name: "Vorpommern-Greifswald",
} as const;

export const SHOWCASE_COMMUNITY = {
  communityId: "geoname.2838887",
  name: "Schlatkow",
  /** The geo-api slug — the app handover's only contract (DEC-0029). */
  slug: "schlatkow",
  lat: 53.92153,
  lng: 13.58116,
  county: SHOWCASE_COUNTY,
} as const;

/**
 * The two neighbouring counties the village calendar also covers. The place
 * index is built from all three, so a search may legitimately answer a place
 * outside `SHOWCASE_COUNTY`.
 */
export const COVERED_COUNTIES = [
  SHOWCASE_COUNTY,
  { id: "geoname.8648413", name: "Mecklenburgische Seenplatte" },
  { id: "geoname.3249091", name: "Uckermark" },
] as const;
