---
id: DEC-0204
title: The settings section explains the embedding in its head, drops the source-to-target band and labels its examples "Beispiel:"
status: accepted
date: 2026-11-12
decided_by: jan-henrik.hempel
---

## Context

Issue #162. Visitors did not understand "Was drinsteht, bestimmt ihr": the head
did not say that the calendar is embedded on the visitor's own website, and the
lime band "So kommen sie rein / Hier landen sie" (DEC-0172 §3) did not explain
the function.

## Decision

1. **Head.** Kicker "Euer Kalender auf eurer Website" (`kickers.yourSettings`),
   heading "Was drinsteht, bestimmt ihr." and a two-sentence lead that names
   the embedding, the neutral design (no logo of Schafe vorm Fenster; the hub
   record `portalize-calendar` carries branding as optional) and the channels.
2. **The flow band is removed** with its sentence. TS-WEB-0024 D12 and
   A24 retire; the section stays on `paper`. The slot fields `Quellen`, `Ziel`
   and the benefit paragraph leave the artefact.
3. **The list gets a mono label** "Das könnt ihr einstellen" and rewritten
   sentences without dashes.
4. **Examples are labelled "Beispiel:" in bold.** This lifts the decision of
   2026-09-18 (no visible marking of stand-in content) for these rows only:
   they are real use cases, not stand-ins. `e2e/content-compliance.spec.ts`
   exempts the label element `[data-example-label]` and nothing else.
5. **Tokens bind.** Pixel values of the issue map to the nearest design token;
   deviations are listed in the PR under "Owner-Frage".

## Consequences

`setting-row` renders the label (locale-aware); `Beispiel` in the artefact is
not authored. EN follows as a draft.
