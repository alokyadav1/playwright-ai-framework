---
name: test-case-generator
description: Turn an FSD or PRD in docs/fsd into a requirements register and requirement-traceable test cases with ID, title, short description, preconditions, data required, steps and expected result. Use whenever the user adds a functional spec, asks for test cases, test scenarios, test design, coverage or traceability, even if they do not say "test case". Never invents values; unknowns are marked NEEDS INPUT.
---

# Test case generator (FSD to traceable test cases)

The goal is test cases a reviewer can trace back to a sentence in the specification. A test case that cannot be traced is noise; a test case with an invented expected result is worse, because it will pass review and then assert the wrong thing.

## Step 1: read the whole document first

Read every file for this feature in `docs/fsd/` before writing anything. Note the structure (sections, IDs, tables, flows), business rules, validation rules, limits, messages, roles, states, store or locale differences, integrations, and non-functional statements. For a very large document, go section by section but keep one running register.

## Step 2: build the requirements register

Write `docs/requirements/<slug>.requirements.md` (template in `references/templates.md`).

- **One row per atomic, verifiable statement.** Split "the user can add, edit and remove items" into three.
- **ID:** reuse the document's own IDs. If it has none, use `<DOC>-<section>-<seq>` (for example `CART-3.2-1`). IDs are stable; never renumber.
- **Source:** file and section or page, plus a short paraphrase. Quote at most 20 words.
- **Type:** functional, validation, business rule, UI, permission, integration, or non-functional.
- **Automatable by UI/API test:** Yes, Partly (say what is missing), or No (say why, for example a performance target).
- **Ambiguities and gaps** go in their own list: vague words ("fast", "appropriate"), missing limits, contradictions, undefined error text, unstated roles. Do not resolve them silently.

## Step 3: design test cases

Pick techniques that fit what the FSD actually specifies.

| Technique | Use when the FSD gives you... |
|---|---|
| Equivalence partitioning | valid and invalid input classes |
| Boundary values | explicit limits (min, max, length). Without a stated limit, ask, do not guess one |
| Decision table | combinations of rules or conditions |
| State transition | statuses and allowed or forbidden transitions |
| Negative and error paths | stated validation rules and messages |
| Role and permission matrix | roles with different rights |
| Locale or store variants | store- or locale-specific behaviour, RTL (Arabic) layout when stated |
| Integration points | calls to other systems with a stated outcome |

Coverage rules:

1. Every testable requirement is covered by at least one test case; every test case lists at least one requirement.
2. One test case verifies one behaviour. Several assertions about the same outcome are fine.
3. No generic filler ("verify the page loads") unless a requirement states it.
4. Prefer fewer, sharper cases over padding. If a technique has no input from the FSD, raise a question instead of inventing one.

## Step 4: write each test case in this exact shape

Use the template in `references/templates.md`. Fields, in order: **Test Case ID**, **Title**, **Requirement(s)** (traceability), **Short description**, **Preconditions**, **Data required**, **Steps**, **Expected result**, **Open items**.

- ID format `TC-<AREA>-<NNN>`, unique and stable.
- Write steps and expected results in business language: no selectors, no CSS, no URLs beyond what the FSD states.
- **Data required** names each data group as a dot path, with the attributes the test needs and a plain-English meaning, for example `credentials.customer` (email, password): login of a registered customer. Do not write values. Credentials never appear here.
- When an expected result checks UI text, list the label key under **Data required** (`label cartEmptyMessage`: text stated in §3.2, or `NEEDS INPUT`) and name that key in the expected result, so the data generator and the scenario use the same key.
- Each expected result ends with the requirement it proves, in brackets, for example `[CART-3.2]`.

## Step 5: never hallucinate

Any attribute you cannot determine from the document gets one of two markers.

- `NEEDS INPUT: <what is missing> (<where it should come from>)` for anything the document does not state: exact error or validation text, limits, product or account to use, URLs, timing, roles, locale-specific wording.
- `INFERRED (basis: <section>)` only for a conclusion that follows logically from stated text, for example "customer is logged in" from a rule that says "logged-in customer". No basis, no inference: use `NEEDS INPUT`.

Never write a plausible-sounding message, number or name to fill a gap. List every marker again under **Open questions** at the top of the test case file so the reviewer sees them in one place.

## Step 6: traceability and self-audit

Write `docs/test-cases/<slug>.traceability.md`: requirement to test cases, uncovered requirements with the reason, and test cases carrying open items. Before finishing, check:

- No requirement is both testable and uncovered without a stated reason.
- No test case without a requirement.
- No value that is not in the FSD or marked `NEEDS INPUT` / `INFERRED`.
- Steps are independent of other test cases and observable through the UI or an API.
- IDs unique; titles say what is verified, not how.

## Step 7: stop at checkpoint 1

Report: requirements total / testable / covered, test case count, number with open items, top open questions. Do not start data or automation work until the user approves or says to proceed.

## Updating an existing set

Keep IDs. Add new cases for new requirements. Mark removed requirements `DEPRECATED` and tag their cases deprecated; do not delete. Change only cases touched by the changed requirements, and note the change at the top of the file.
