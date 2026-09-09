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
