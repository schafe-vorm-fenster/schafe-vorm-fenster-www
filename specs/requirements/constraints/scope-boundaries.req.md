---
artefact: requirements
area: scope-boundaries
status: DRAFT
sources: [SRC-001, SRC-003]
---

# Scope Boundaries

From SRC-001 "Boundaries" — what the website is not.

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-C-010 | The website does not explain features; help and instructions live in the app. | SRC-001#boundaries | S2 |
| WEB-C-011 | Prices are published only for offerings with `promotion: promoted`; enterprise is on request; `portalize-website-widget` and `local-advertising` (`withheld`) are not offered on the website. | SRC-001#boundaries, `@schafe-vorm-fenster/offerings` | S2 |
| WEB-C-012 | Municipalities and institutions are not separated: same product, same argument, one job. | SRC-001#boundaries | S2 |
| WEB-C-013 | The AI-coaching track belongs to a different brand and does not appear on this website (affects: `tech-leaders` audience, coaching offerings, `ai-coaching` business goal). | SRC-001#boundaries | S2 |
| WEB-C-014 | The product name "Portalize" is never a navigation label; the name is introduced once on `/dein-kalender` at the 480 € tier (DEC-052), so it is familiar before the invoice. | SRC-003#navigation | S2 |
| WEB-C-015 | Companies/local advertising shall not appear at all while the offering is `promotion: withheld` — advertising what you do not want to sell produces enquiries nobody can serve. The guard checks for absence. | DEC-052 | S3 |
| WEB-C-016 | The website makes no claim it cannot prove with a cleared proof element or live data (umbrella rule binding WEB-F-036/041). | SRC-001#4, #5 | S2 |
