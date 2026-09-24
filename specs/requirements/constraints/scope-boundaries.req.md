---
artefact: requirements
area: scope-boundaries
status: DRAFT
sources: [SRC-0001, SRC-0003]
---

# Scope Boundaries

From SRC-0001 "Boundaries" — what the website is not.

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| CON-WEB-0010 | The website does not explain features; help and instructions live in the app. | SRC-0001#boundaries | S2 |
| CON-WEB-0011 | Prices are published only for offerings with `promotion: promoted`; enterprise is on request; `portalize-website-widget` and `local-advertising` (`withheld`) are not offered on the website. | SRC-0001#boundaries, `@schafe-vorm-fenster/offerings` | S2 |
| CON-WEB-0012 | Municipalities and institutions are not separated: same product, same argument, one job. | SRC-0001#boundaries | S2 |
| CON-WEB-0013 | The AI-coaching track belongs to a different brand and does not appear on this website (affects: `tech-leaders` audience, coaching offerings, `ai-coaching` business goal). | SRC-0001#boundaries | S2 |
| CON-WEB-0014 | The product name "Portalize" is never a navigation label; the name is introduced once on `/dein-kalender` at the 480 € tier (DEC-0052), so it is familiar before the invoice. | SRC-0003#navigation | S2 |
| CON-WEB-0015 | Companies/local advertising shall not appear at all while the offering is `promotion: withheld` — advertising what you do not want to sell produces enquiries nobody can serve. The guard checks for absence. | DEC-0052 | S3 |
| CON-WEB-0016 | The website makes no claim it cannot prove with a cleared proof element or live data (umbrella rule binding FUN-WEB-0036/041). | SRC-0001#4, #5 | S2 |
