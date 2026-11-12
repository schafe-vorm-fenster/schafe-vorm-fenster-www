---
id: DEC-0191
title: The WhatsApp scene names the real number and the check-and-approve flow, offers the other ways as its one CTA, and loses the flyer row
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #141, the owner's annotated review of the WhatsApp scene on `/`
(2026-11-12): step 2 should carry the real WhatsApp number; step 3 should say
the date goes online automatically; the CTA "Jetzt kostenlos anmelden" should
become "further ways to get your dates online" as a CTA to "Termine
veröffentlichen"; "Aus dem Flyer geworden" is crossed out.

## Decision

1. **Step 2 carries the real number and the flow.** The step line holds the
   token `{whatsapp}`; the page substitutes the hub's `whatsapp` contact
   channel (`contactChannel("whatsapp")`, +49 156 78204630, confirmed by the
   owner as the flyer number too) at render time through
   `withChannelTokens` (`src/lib/contact/contact-channels.ts`). No second copy
   of the number exists in content or code (TS-WEB-0016-A16). The step says:
   send the flyer to us, check the date and approve it in the chat.
2. **Step 3 and the chat reply.** Step 3 says the date is put online
   automatically ("Termin wird automatisch online gestellt — In eurem Ort und
   drumherum."). The chat reply of state 2 follows the flow: "Danke! Bitte
   prüft den Termin und bestätigt ihn hier." / "Thanks! Please check the date
   and approve it here." No time and no deadline are claimed (CG-031,
   CG-033). The scene's Aha-Satz is unchanged.
3. **Both pages.** Items 1 and 2 apply on `/` (`home-4a-scene-whatsapp-steps-demo`)
   and on `/mitmachen` path 01 (`mitmachen-3a-path-whatsapp-steps-demo`), DE
   and EN. Both slots stay `provenance: generated; demo: true`; the wording of
   steps 2/3 and the reply is the owner's, recorded in the slots' notes.
4. **The CTA on `/` is a teaser plus one button.** The module's "Jetzt
   kostenlos anmelden" is replaced by a teaser in the owner's wording
   (second version, 2026-11-12): "Ihr könnt eure Termine auch in einem
   eigenen Kalender pflegen, zum Beispiel in einem Google Kalender, und wir
   importieren sie. Oder ihr habt eine Webseite, auf der schon alles steht?
   Dann holen wir die Termine von dort." and one secondary button "Mehr zum
   Veröffentlichen von Terminen" / "More on publishing dates" to `takePart`.
   The two ways are paths 02 and 03 on `/mitmachen`. **They stand below the
   module as the scene's `cta`, not inside it**: a teaser of two to three
   lines inside the module pushed it from 775 px to 873 px at 360 px, over
   the 800 px budget of TS-WEB-0022 D4 / TS-WEB-0019-A6, which is binding. So
   `explain-module`'s `cta` becomes optional (omitted only here), and the
   block still carries exactly one `data-cta` (TS-WEB-0019 D3a, DEC-0110 §1)
   — it is the scene's, not the module's, on `/`. `/mitmachen` keeps its own
   module CTA.
5. **The flyer row goes.** `FlyerExample` and its caption
   (`home-12-ui-strings`' first field) are removed from `/`. The scene is now
   opener · module. This reverses DEC-0163's polish-brief fix 3 (amended
   there) and is a deliberate, owner-decided exception to TS-WEB-0006 D7's
   "one concrete instance" for this scene; TS-WEB-0019 D3a, A6 and A7 carry
   the amendment. `SceneBlock.instance` becomes optional.

## Consequences

- `e2e/pages/home.spec.ts` (A6, A7) asserts the pair, the number in step 2,
  the teaser and the button label, and the absence of the flyer caption.
  `explain-module.test.tsx` and `contact-channels.test.ts` cover the teaser and
  the token.
- `state/open.md` rows 92, 244, 245 and 247 are updated.
