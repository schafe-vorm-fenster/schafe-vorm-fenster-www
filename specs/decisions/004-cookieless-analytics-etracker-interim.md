---
id: DEC-004
title: Cookieless analytics as requirement, eTracker as interim
status: accepted
date: 2026-09-09
decided_by: jan-henrik.hempel
---

## Context

SRC-006: track without a cookie banner; "we keep using eTracker for now".

## Decision

Binding property: cookieless, banner-free, GDPR-compliant analytics
(WEB-Q-020). eTracker is the current implementation, explicitly interim
and replaceable (WEB-Q-021); its config is extracted from the legacy site.

## Consequences

Tool migration later does not touch the requirement; any successor must
satisfy WEB-Q-020 unchanged.
