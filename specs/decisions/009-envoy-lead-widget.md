---
id: DEC-009
title: Lead capture runs through the envoy web-component widget
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

Contact, quote, and briefing submissions need a receiving process. The
ecosystem has envoy-api (communication engine); a website-embeddable
widget is planned but not finished.

## Decision

All lead forms are provided by an envoy web-component widget, embedded by
the website and themed via CSS variables. The widget owns data storage
through envoy-api; the website ships no own form backend.

## Consequences

The widget contract (CSS variable set, events, spam handling, delivery
date) is a formal demand to the envoy side (Q-022). The website spec
treats forms as an integration, not a feature. → WEB-F-090–092.

## Superseded in part 2026-09-24 — DEC-081

This record is not rewritten; one of the three form kinds it named is
withdrawn.

**The contact form is gone.** "All lead forms (contact, quote, briefing)"
was written when contact was a form in the footer. There is no general
contact form on the website any more: contact is a standing section of
static channel rows — video appointment, WhatsApp, phone, mail — rendered
on every page (DEC-081 §1/§2).

**The mechanism stands for the forms that remain.** The quote request on
`/deine-region/angebot` and the invoice step of the order flow are still
envoy widget instances under this record, themed through CSS variables,
with envoy owning storage and the website shipping no form backend
(WEB-F-091, WEB-F-092, DEC-025 untouched).

**Q-022 shrinks with it**: the contact form kind leaves the demand; the
widget's delivery date no longer decides whether a visitor can reach a
person.
