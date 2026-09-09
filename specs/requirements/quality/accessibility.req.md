---
artefact: requirements
area: accessibility
status: DRAFT
sources: [SRC-006]
---

# Accessibility

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| WEB-Q-010 | The website shall conform to WCAG 2.2 level AA; AAA criteria are adopted where feasible ("the basics of AAA"). Full non-visual optimisation is explicitly not a launch criterion, but semantic and screen-reader basics are mandatory. | SRC-006 | S2 |
| WEB-Q-011 | Colour contrasts shall meet AA against the brand palette; where brand colours fail, the accessible variant wins. | SRC-006, brand kit | S2 |
| WEB-Q-012 | Markup shall be fully semantic with correct ARIA labelling; landmarks, headings, and structure sound. | SRC-006 | S2 |
| WEB-Q-013 | The site shall be fully keyboard-operable and screen-reader optimised. | SRC-006 | S2 |
| WEB-Q-014 | The site shall honour browser preference hints and render accordingly: `prefers-color-scheme` (dark and light theme), `prefers-contrast` (high-contrast theme), `prefers-reduced-motion`, reduced-data, and user font-size scaling. | SRC-006 | S2 |
| WEB-Q-015 | Theme selection follows the user's browser exclusively; the website provides no manual theme switcher. | SRC-006 | S2 |
| WEB-Q-016 | Brand typography (Catamaran) shall be verified for readability/accessibility as part of the brand kit application (Q-013). | SRC-006 | S1 |
| WEB-Q-017 | Text alternatives exist for all informative images; decorative images are marked as such. | SRC-006 (implied by AA) | S2 |
| WEB-Q-018 | Touch targets and mobile UX shall meet accessibility sizing on the primary (mobile) experience. | SRC-006 | S2 |
| WEB-Q-019 | Accessibility shall be tested automatically in CI (axe or equivalent) plus manual screen-reader spot checks per release. | derived; convention | S1 |
| WEB-Q-026 | The website shall target BFSG conformity (Barrierefreiheitsstärkungsgesetz); applicability is legally confirmed via Q-021. | DEC-012 | S3 |
| WEB-Q-027 | A published accessibility statement (Barrierefreiheitserklärung) shall exist as a footer-reachable page. | DEC-012 | S3 |
