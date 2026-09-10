---
artefact: requirements
area: place-search
status: DRAFT
sources: [SRC-003, SRC-011]
decisions: [DEC-024, DEC-029]
---

# Place Search and Coverage

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-F-046 | The place search shall cover all of Germany. ZIP search works against today's geo-api; place/municipality **name** search requires the new Typesense-backed geo-api endpoint (demand Q-025). `findbyaddress` shall not be used (external Google lookup — slow, paid). | DEC-024 | S3 |
| WEB-F-023 | No website path shall contain a place slug. Place-specific paths belong to the app alone; on the website a place travels as a query parameter (`?ort=<slug>`). | DEC-037 | S3 |
| WEB-F-047 | Searching an uncovered place shall lead to `/dein-ort/starten` — "nothing entered in <place> yet" plus the founding flow, with the place as a query parameter. It is the escalation of the place-search axis (dates → no dates → no place) and therefore sits under `/dein-ort`. | DEC-024, DEC-036, DEC-037 | S3 |
| WEB-F-048 | Inherited URL contract: `svf.li` QR redirects target the **apex** `schafe-vorm-fenster.de/:community` (with `etcc_cmp`/`etcc_med`), which today serves the calendars directly. Once the calendars move to `app.*` and the apex redirects to `www.`, the website shall forward `/:community` paths to the place's calendar on `app.*`, preserving the campaign parameters. Until that move: nothing to do. | entre repo, DEC-028, DEC-035 | S3 |
| WEB-F-049 | Handover links into the app shall be built from geo-api community slugs (`/api/{token}/community/slug/{slug}`) — the only current contract. Registration prefill has no contract and stays a demand to the app. | DEC-029 | S3 |
