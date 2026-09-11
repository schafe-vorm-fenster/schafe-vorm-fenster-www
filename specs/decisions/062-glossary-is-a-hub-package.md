---
id: DEC-062
title: The glossary becomes a hub package; Actor is outward, Organizer is internal
status: accepted
date: 2026-09-11
decided_by: jan-henrik.hempel
---

## Decision

1. **The glossary moves into the hub as a package**, imported from its
   Google Doc the way the legal texts are, and published as
   `@schafe-vorm-fenster/glossary`. The content production concept calls
   the glossary "a first-class production input, not documentation" — so
   it has to be versioned, installable and checkable, not a link.
2. **Two registers for the same role.** The glossary as written says
   "Akteur = Organizer" and does not distinguish them. It must:

   | Register | Term | Used in |
   | --- | --- | --- |
   | outward — speaking **to** them | **Actor / Akteur** | website copy, audience model, the `actors` audience id |
   | internal — speaking **about** them | **Organizer** | data model, CRM, `calendar-api/organizers`, envoy registration |

   So the audience id `actors` is right and stays, and the APIs are right
   too. Website copy says Akteur; nothing user-facing says Organizer.

## Consequences

- The glossary gains the register distinction — a change to the source
  document, tracked as Q-056.
- `specs/glossary/glossary.md` becomes a pointer register: each `GL-###`
  names the canonical source and adds what the content concept asked for
  and it lacks — the word to use per locale, and the words not to use.
- The geographic terms are already consistent with TS-005 D1:
  Community = Dorf/Ort, Municipality = Gemeinde, County = Landkreis,
  State = Bundesland.
