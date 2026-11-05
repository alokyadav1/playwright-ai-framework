---
name: self-healing
description: Repair element addressing after a confirmed locator failure, preserving element identity and expected behaviour. Uses locator-strategy for evidence and ranking, checks label consumers, and verifies affected scenarios within the planner's scope and retry limits.
---

# Self-healing locators

Healing changes how an existing element is addressed, never what the test expects or which business action it performs. This skill owns identity proof and allowed repair scope. locator-strategy owns candidate selection/verification; planner-workflow owns routing, state, scope, limits and completion.

## Preconditions

- The failure actually reached the locator, and the expected UI state/auth/data prerequisites were satisfied. A missing element caused by an earlier API/auth failure belongs to failure-analysis.
- The task authorizes repairs. A review, diagnosis-only or verification-only flow may propose a repair but cannot apply it.
- Read the current locator, its consumers, relevant requirement/case, stored snapshot and any usable trace. If a stored snapshot is missing, use locator-strategy for fresh discovery and say so. Require equivalent identity evidence from the case/code/trace; a new snapshot alone cannot prove continuity.
- Follow planner-workflow's isolation/reset checks before replaying an action. A discovery click can mutate the app just like a test run.

## Procedure

1. Record the initial diff and locate the failing expression/key and every consumer.
2. Recreate the exact state in a task-owned named CLI session. Capture a sanitized snapshot under `.playwright-cli/heal/` and compare with prior evidence.
3. Prove the candidate has the same purpose, container/landmark, place in the flow and effect. Role or wording may differ, but a different action, removed element or several plausible candidates means **not healed**. Check requirements when a changed role/name could alter behaviour.
4. Ask locator-strategy to rank stable, unique candidates across supported representations. Prefer the best evidenced candidate; do not choose brittle structural CSS merely to preserve the current storage format.
5. Apply the smallest coherent addressing change within authorized scope, using the allowed edits and label guard below. Record why a representation change was needed and its consumers.
6. Rerun the failing scenario, then affected consumers of changed addressing/labels with safe state. Apply planner-workflow's static checks and shared-consumer impact rules. If a prerequisite prevents reaching the locator, report it as **unverified**, not healed successfully.
7. Inspect the diff against the initial baseline. Verify changes are addressing-only plus the associated evidence/state artifacts. Correct only your own accidental edits; preserve user changes.

## Allowed repair scope

| Addressing change | Allowed edit |
|---|---|
| Existing JSON selector | Value of the existing key in `src/locators/*.json`; preserve template placeholders |
| Accessible name | Value of the existing label for the inspected store/locale, subject to the label guard |
| Role or existing label reference | Only the locator expression in the owning page/component; role changes require identity/behaviour evidence |
| Better supported representation | Coherent locator expression/import/JSON or label-key changes necessary for the same element, with consumer searches and locator-strategy evidence; data-generator owns new label keys |

Do not change actions, flow, waits, assertions, feature steps, data, network entries or config under HEAL. If evidence reveals a different cause, return to the parent DIAGNOSE flow; do not silently widen a locator-only request. Remove a superseded key only if all consumers are accounted for and its removal is within the authorized repair.

Changing JSON addressing to role-plus-label (or back) alone is a routine implementation decision, not an extra approval gate. If the user restricted edits to a file/strategy, prepare the concrete candidate, evidence, proposed diff and affected consumers, then ask before exceeding that explicit limit. If identity or intended behaviour is uncertain, do not apply any candidate.

## Label guard

Before modifying a label value or switching to a different key:

1. Search pages/components, verifications, steps, features, data/config and dynamic key resolution for uses. A key can reach an assertion through a step parameter; a direct search alone may not be sufficient.
2. If used only for addressing, observed text can identify the same element; document the snapshot and locale.
3. If also asserted, the approved source must already state the new text. If it states the old text, is silent, or consumers cannot be established, report a copy defect/spec ambiguity and leave the expectation unchanged. Any case-outcome correction goes through failure-analysis and planner approval rules.
4. Inspect other page consumers and locale fallback. Changing en-us can affect other locales missing that key. Edit only the inspected locale; list affected unverified contexts without guessing translations.

## Outcomes and records

- **Verified repair:** identity and behaviour preserved, candidate evidence recorded, required checks passed.
- **Applied but unverified/partially verified:** addressing change is evidenced but target or shared consumers could not be exercised; state the blocker.
- **Not healed:** identity/spec conflict, unsafe replay, missing evidence or change outside authorized scope. Explain the cause and proposed next action.

Write sanitized evidence and `healing-log.md` for a multi-step run, and update STATE.md under planner-workflow's rules. Retain the previous snapshot as comparison evidence; add/update a curated baseline only after a verified repair. No separate permission is needed for normal task records. A small repair may keep its record in the reply as the planner permits.

Report scenario/key, changed files, old/new addressing, selected rank, identity evidence, executed checks and remaining blockers. Do not label a structural-only guess as a successful heal. Follow the planner's cumulative attempt/page limits. If the same element repeatedly drifts, recommend a stable test id rather than another speculative repair.
