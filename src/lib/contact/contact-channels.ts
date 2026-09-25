/**
 * The contact section's values — TS-WEB-0016 D13 "Where the values come from".
 *
 * | Value | Source |
 * | --- | --- |
 * | the appointment URL | `BRIEFING_URL` — one configured value (D7), the environment wins |
 * | the WhatsApp number, the phone number, the e-mail address, who answers | `src/generated/contact-channels.json`, built from the hub record by `scripts/build-contact-channels.ts` |
 *
 * Nothing here is typed: a number or an address in this file would be the
 * hard-coding TS-WEB-0016-A16 forbids. The generated file is validated when
 * this module loads, so a missing row fails the build rather than rendering
 * an empty row (A16, D13).
 *
 * D14 §6 / the owner's note: **no prefilled text**. The WhatsApp row is the
 * bare click-to-chat URL, the mail row the bare `mailto:` — no `?text`, no
 * `subject`, no `body` — until a copy rule exists for the sentence. A19/A20
 * hold trivially while that is so.
 */

import generated from "@/src/generated/contact-channels.json";
import { BRIEFING_URL } from "@/src/lib/live/briefing";

import { CONTACT_CHANNEL_IDS } from "./hub-record";

import type { ContactChannelId, ContactChannelRecord, ContactChannelsFile } from "./hub-record";

/** The click-to-chat host, TS-WEB-0016 D13 row 2 — `https://wa.me/<number>`. */
const WHATSAPP_HOST = "https://wa.me/";

function validated(file: ContactChannelsFile): readonly ContactChannelRecord[] {
  const ids = file.channels.map((channel) => channel.id);
  if (ids.join(",") !== CONTACT_CHANNEL_IDS.join(",")) {
    throw new Error(
      `src/generated/contact-channels.json: expected ${CONTACT_CHANNEL_IDS.join(", ")}, found ${ids.join(", ") || "none"} — run pnpm build:contact-channels`,
    );
  }
  for (const channel of file.channels) {
    if (channel.address.trim() === "") {
      throw new Error(`src/generated/contact-channels.json: ${channel.id} has no address`);
    }
  }
  return file.channels;
}

const CHANNELS = validated(generated as ContactChannelsFile);

/** The four hub rows, D13 order, exactly as generated. */
export function contactChannels(): readonly ContactChannelRecord[] {
  return CHANNELS;
}

export function contactChannel(id: ContactChannelId): ContactChannelRecord {
  // `validated` guaranteed every id is present.
  return CHANNELS.find((channel) => channel.id === id)!;
}

/** Who answers — one person for all four channels (D13). */
export function contactResponder(): string {
  return CHANNELS[0]!.responder;
}

/** `+49 100 0000000` → `491000000000`: the bare digits `wa.me` and `tel:` take. */
export function digitsOf(number: string): string {
  return number.replace(/\D/g, "");
}

/**
 * The row's `href`, by scheme (D13): `https:` to the configured appointment
 * URL, `https:` to the click-to-chat host, `tel:`, `mailto:`.
 */
export function contactHref(id: ContactChannelId): string {
  const { address } = contactChannel(id);
  switch (id) {
    case "appointment":
      return BRIEFING_URL;
    case "whatsapp":
      return `${WHATSAPP_HOST}${digitsOf(address)}`;
    case "phone":
      return `tel:+${digitsOf(address)}`;
    case "mail":
      return `mailto:${address}`;
  }
}

/**
 * What the row shows as its value (CG-031: the sub-label says what the row
 * *is* — the number, the address). The appointment row has no address to
 * show; its sub-label is copy and lives in the dictionary.
 */
export function contactDisplayValue(id: Exclude<ContactChannelId, "appointment">): string {
  return contactChannel(id).address;
}

export { CONTACT_CHANNEL_IDS } from "./hub-record";
export type { ContactChannelId, ContactChannelRecord } from "./hub-record";
