---
id: DEC-051
title: envoy carries newsletter signup and the invoice handover
status: accepted
date: 2026-09-10
decided_by: jan-henrik.hempel
---

## Decision

Two open systems resolve to the one that already owns the user lifecycle:

- **Newsletter**: signup and double opt-in run through envoy, alongside
  the lead forms it already provides. One system fewer, and the signup
  travels the same path as every other lead.
- **Invoicing**: the completed order goes to envoy as a structured event
  and from there into the existing accounting process. The website ends
  at the confirmation — it issues no invoice and runs no dunning.

## Consequences

Both become rows in the envoy contract (Q-022), which now covers lead
forms, newsletter signup with DOI, and order handover. The website
remains free of a form backend, a mailing system and an invoicing system.
Resolves Q-020 and Q-017.
