/**
 * The hub's contact-channel record, read — `contact-channels.md` in
 * `@schafe-vorm-fenster/goals` (SRC-0008), the table under "The Channels".
 *
 * TS-WEB-0016 D13 "Where the values come from": the number, the WhatsApp
 * number, the address and who answers are **content**, and they resolve from
 * that record at build time — never typed per page, never stated in a spec
 * (DEC-0083 §1). This module is the one reader of the record. It is pure:
 * `scripts/build-contact-channels.ts` feeds it the file and writes
 * `src/generated/contact-channels.json`, and `contact-channels.test.ts` feeds
 * it the same file again and compares — so a hub release that moves a value
 * fails `pnpm check` until the generated file is rebuilt (DEC-0113).
 *
 * Why a generated file and not an import at request time: the hub packages
 * are devDependencies of the content pipeline and the loader architecture
 * never opens one at request time (TS-WEB-0007 D3) — the same reason
 * `src/lib/live/briefing.ts` transcribes the appointment URL and
 * `scripts/build-place-index.ts` commits the community index.
 */

/** The four channels, in the order the record and the section present them (D13). */
export const CONTACT_CHANNEL_IDS = ["appointment", "whatsapp", "phone", "mail"] as const;

export type ContactChannelId = (typeof CONTACT_CHANNEL_IDS)[number];

export interface ContactChannelRecord {
  /** 1–4, the row's position in the hub table. */
  readonly order: number;
  readonly id: ContactChannelId;
  /** The hub's own channel name, verbatim ("Video appointment", …). */
  readonly label: string;
  /** The address as the hub writes it — a URL, a formatted number, an e-mail. */
  readonly address: string;
  /** The conversion-goal ids the row pays into, hub ids verbatim. */
  readonly goals: readonly string[];
  /** Who answers — one person for all four channels. */
  readonly responder: string;
}

export interface ContactChannelsFile {
  readonly builtAt: string;
  /** `@schafe-vorm-fenster/goals@<version>#contact-channels.md`. */
  readonly source: string;
  readonly channels: readonly ContactChannelRecord[];
}

/** The hub's channel names → the website's channel ids (D12's `channel` value). */
const CHANNEL_BY_LABEL: Readonly<Record<string, ContactChannelId>> = {
  "Video appointment": "appointment",
  WhatsApp: "whatsapp",
  Phone: "phone",
  "E-mail": "mail",
};

/** `| 1 | Video appointment | `https://…` | `make-contact`, and … | Jan-Henrik Hempel |` */
const CHANNEL_ROW = /^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/;
const GOAL_ID = /`([a-z][a-z-]+)`/g;

/**
 * Reads the four channel rows out of the record. Throws on anything but four
 * rows in D13 order with a non-empty address each — a row whose value is
 * missing is a build failure, not an empty row (TS-WEB-0016-A16).
 */
export function parseContactChannels(markdown: string): readonly ContactChannelRecord[] {
  const rows: ContactChannelRecord[] = [];

  for (const line of markdown.split("\n")) {
    const match = CHANNEL_ROW.exec(line);
    if (!match) continue;
    const [, order, label, address, serves, responder] = match;
    const id = CHANNEL_BY_LABEL[label!];
    if (id === undefined) continue;
    const goals = [...serves!.matchAll(GOAL_ID)].map((goal) => goal[1]!);
    rows.push({
      order: Number(order),
      id,
      label: label!,
      address: address!.trim(),
      goals,
      responder: responder!.trim(),
    });
  }

  const ids = rows.map((row) => row.id);
  if (ids.join(",") !== CONTACT_CHANNEL_IDS.join(",")) {
    throw new Error(
      `contact-channels.md: expected the four channels ${CONTACT_CHANNEL_IDS.join(", ")} in that order, found ${ids.join(", ") || "none"}`,
    );
  }
  for (const row of rows) {
    if (row.address === "") throw new Error(`contact-channels.md: row ${row.order} (${row.id}) has no address`);
    if (row.responder === "") throw new Error(`contact-channels.md: row ${row.order} (${row.id}) names nobody who answers`);
    if (row.goals.length === 0) throw new Error(`contact-channels.md: row ${row.order} (${row.id}) serves no goal`);
  }

  return rows;
}
