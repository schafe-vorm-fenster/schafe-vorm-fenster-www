---
artefact: requirements
area: accessibility
status: DRAFT
sources: [SRC-0006]
---

# Accessibility

| ID | Requirement | Source | Suff. |
| --- | --- | --- | --- |
| NFR-WEB-0010 | The website shall conform to WCAG 2.2 level AA; AAA criteria are adopted where feasible ("the basics of AAA"). Full non-visual optimisation is explicitly not a launch criterion, but semantic and screen-reader basics are mandatory. | SRC-0006 | S2 |
| NFR-WEB-0011 | Colour contrasts shall meet AA: body text 4.5:1, display type 3:1 — measured against the composite of photo plus gradient, not the gradient alone. Where brand colours fail, the accessible variant wins. | SRC-0006, SRC-0014#accessibility, DEC-0056 | S3 |
| NFR-WEB-0012 | Markup shall be fully semantic with correct ARIA labelling; landmarks, headings, and structure sound. | SRC-0006 | S2 |
| NFR-WEB-0013 | The site shall be fully keyboard-operable and screen-reader optimised; the focus ring is 3 px `violet-500` at 2 px offset on every interactive element. | SRC-0006, SRC-0014, DEC-0056 | S3 |
| NFR-WEB-0014 | The site shall honour browser preference hints and render accordingly: `prefers-color-scheme` (dark and light theme), `prefers-contrast` (high-contrast theme), `prefers-reduced-motion`, reduced-data, and user font-size scaling. | SRC-0006 | S2 |
| NFR-WEB-0015 | Theme selection follows the user's browser exclusively; the website provides no manual theme switcher. | SRC-0006 | S2 |
| NFR-WEB-0016 | Brand typography (Atkinson Hyperlegible Next, DEC-0043) — no size below 15 px — shall be verified for readability/accessibility as part of the brand kit application (Q-0013). | SRC-0006 | S1 |
| NFR-WEB-0017 | Text alternatives exist for all informative images; decorative images are marked as such. | SRC-0006 (implied by AA) | S2 |
| NFR-WEB-0018 | Touch targets and mobile UX shall meet accessibility sizing on the primary (mobile) experience. | SRC-0006 | S2 |
| NFR-WEB-0019 | Accessibility shall be tested automatically in CI (axe or equivalent) plus manual screen-reader spot checks per release. | derived; convention | S1 |
| NFR-WEB-0026 | The website shall target BFSG conformity (Barrierefreiheitsstärkungsgesetz); applicability is legally confirmed via Q-0021. | DEC-0012 | S3 |
| NFR-WEB-0027 | A published accessibility statement (Barrierefreiheitserklärung) shall exist as a footer-reachable section with a stable anchor on `/rechtliches` (FUN-WEB-0029). | DEC-0012, DEC-0039 | S3 |
