---
artefact: requirements
area: place-search
status: DRAFT
sources: [SRC-003, SRC-011]
decisions: [DEC-024, DEC-029, DEC-079]
---

# Place Search and Coverage

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-046 | The place search shall ask for a **place name**. The typed string shall be matched against place names and against municipality names, and a match shall be offered as the place, rendered "Ort (Gemeinde)". A postcode shall not be offered as a product feature — not as an input mode, not in the label, the placeholder, a helper text or page copy, and no search surface shall state an interim. Where the names come from is an implementation detail and free (today the committed covered-community index of TS-008 D7, later a geo-api name endpoint — Q-025); what is promised to the visitor is the name, not the store that answers it. Search scope is the covered communities until Q-071 decides otherwise. `findbyaddress` shall not be used (external Google lookup — slow, paid). | DEC-079, DEC-024 | S3 |
| WEB-F-023 | No website path shall contain a place slug. Place-specific paths belong to the app alone; on the website a place travels as a query parameter (`?ort=<slug>`). | DEC-037 | S3 |
| WEB-F-047 | Searching a place the system does not carry shall lead to `/dein-ort/starten` — "nothing entered in <place> yet" plus the founding flow, with the place as a query parameter. A typed name that matches nothing is such a place: it yields no suggestion, is not an error, and shall still reach this route when the form is submitted, so the search never answers a visitor with silence and never asks her to type something else. It is the escalation of the place-search axis (dates → no dates → no place) and therefore sits under `/dein-ort`. | DEC-024, DEC-036, DEC-037, DEC-079 | S3 |
| WEB-F-048 | Inherited URL contract: `svf.li` QR redirects target the **apex** `schafe-vorm-fenster.de/:community` (with `etcc_cmp`/`etcc_med`), which today serves the calendars directly. Once the calendars move to `app.*` and the apex redirects to `www.`, the website shall forward `/:community` paths to the place's calendar on `app.*`, preserving the campaign parameters. Until that move: nothing to do. | entre repo, DEC-028, DEC-035 | S3 |
| WEB-F-049 | Handover links into the app shall be built from geo-api community slugs (`/api/{token}/community/slug/{slug}`) — the only current contract. Registration prefill has no contract and stays a demand to the app. | DEC-029 | S3 |
