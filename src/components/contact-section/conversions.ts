import type { ConversionBinding } from "../conversion-tracker/conversion-tracker";
import type { ContactChannelId } from "@/src/lib/contact/contact-channels";
import type { RouteId } from "@/src/lib/routes/routes";

/**
 * What one click on a contact row emits — TS-WEB-0016 D12/D13, DEC-0081
 * amendment 2026-09-25 §1–§3.
 *
 * Every row fires `make-contact` with **the channel** and **the route the
 * section was rendered on**. Row 1 additionally completes
 * `request-product-briefing` on the same click — two rungs of a ladder, not
 * one goal counted twice. Three rules, all checked in `conversions.test.ts`:
 * one event per goal id per click, rows 2–4 never fire the briefing goal,
 * and the payload carries nothing but the channel and the route (D4 rule 3,
 * A19: no per-visitor value, DEC-0071 §3: no geographic value).
 *
 * Both stages are `handover`: the site sees the click and nothing after it
 * (D12 counts an intent, and the registry says so).
 */
export function contactRowConversions(
  channel: ContactChannelId,
  route: RouteId,
): readonly ConversionBinding[] {
  const attributes = { channel, route } as const;
  const bindings: ConversionBinding[] = [
    { goalId: "make-contact", stage: "handover", attributes },
  ];
  if (channel === "appointment") {
    bindings.push({ goalId: "request-product-briefing", stage: "handover", attributes });
  }
  return bindings;
}
