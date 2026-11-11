---
name: gherkin-bdd
description: Write and maintain Gherkin feature files and map every step to a step definition, reusing existing scenarios and steps first and using data keys to avoid near-duplicate steps. Use whenever creating or editing .feature files or step definitions, converting test cases into scenarios, or when the user mentions Gherkin, BDD, scenarios, steps, Given, When or Then.
---

# Gherkin and step mapping

Feature files are the readable contract; step definitions are thin glue to the page layer. The two ways this goes wrong are duplicated steps that differ by one word, and scenarios full of UI mechanics. This skill prevents both.

## Inputs and outputs

- Input: **approved** test cases (`docs/test-cases/<slug>.test-cases.md`). No approved test cases, no scenarios.
- Output: `tests/features/<area>/<FeatureName>.feature`, `tests/steps/<area>.steps.ts`, and `docs/agent-runs/<slug>/step-map.md`.
- Feature file names are PascalCase (`CartContents.feature`, not `cart-contents.feature`). Area folders stay lowercase.
- One test case becomes one `Scenario` (or one `Scenario Outline` when the same test case runs with several data keys).

## Before writing anything

1. Run `npx --no-install bddgen export` (authoritative list of defined steps) and `npm run agent:inventory -- steps`.
2. Search `tests/features` for the exact approved case ID at the start of a scenario title (`CRT_001 - `). Also inspect legacy tags to avoid duplicating an existing case. If the scenario exists, update it; never add a second one.
3. Search for existing steps with the same intent (same verb and object). Reuse them. If one exists with a different literal, parameterize only when the meaning and all existing consumers remain valid. Search and preserve every consumer, or add a distinct business-intent expression. Do not broaden an existing step in a way that silently changes other scenarios.

## Scenario rules

- Every newly authored `Scenario` and `Scenario Outline` title starts with the exact approved case ID followed by ` - ` and the case title. Preserve separators and digits, for example `Scenario: CRT_001 - Verify user can add item to cart from pdp`.
- Never add a case ID as a tag, including `@CRT_001` or `@TC-CRT_001`. Tags describe area, suite or execution grouping, such as `@cart`, `@smoke`, `@regression` and `@i18n`, when approved. Requirement traceability lives in the cases, step map and scope. Preserve unrelated existing features unless the task calls for their migration.
- **Given** sets state (preconditions), **When** is one user action, **Then** is an observable outcome. `And` / `But` continue the previous keyword. Use one action per `When` or action `And`. Split navigation, data entry and submission when they are separate user intents. Multiple action steps are allowed. Never collapse them merely to have one `When`. Capitalize Given, When, Then and And, and use third-person `The user`.
- Declarative, present tense, business language: `The user opens the cart` describes business intent. Keep UI mechanics inside the owning page. No selectors, no CSS, no URL paths, no waits.
- `Background` only for steps shared by every scenario in the file.
- Scenarios are independent; none relies on another having run.
- Use data keys for account, catalog and other varying business inputs. Keep credentials, tokens and expected UI copy out of feature files. A count explicitly specified by the approved case may use an integer parameter.
- `Scenario Outline` only for the same flow over different data. Examples columns hold data keys, never raw values.
- Every individual approved expected outcome maps to a `Then` or assertion `And`, a binding and a verification method. Every assertion traces back to an approved outcome. Verify the specified entity identity and values as well as counts when required.

## Steps use data keys, not literals

Describe the intent in the step text and pass variation as a data key parameter:

```gherkin
Given The user is logged in as the "credentials.customer" user
And The user is viewing the "products.simpleProduct" product
When The user adds the product to the cart
And The user opens the cart
Then The user sees the "products.simpleProduct" product in the cart
```

- `{string}` carries a data key, normally a full path such as `"credentials.customer"` or `"products.simpleProduct"`. Preserve a short-key convention only when the reused binding explicitly defines its group prefix. `{int}` carries approved counts. Avoid regular expressions in step patterns.
- The step definition resolves the key with `getByKey(data, '...')`, which throws with the key name if it is missing or still a placeholder.
- Do not over-generalise. `When The user clicks {string}` or `Then The user sees the text {string}` are anti-patterns: they push UI mechanics into feature files and defeat reuse by readability. Parameterise by business entity (a product, a role, a coupon), not by UI element.
- One step, one responsibility. Do not join two actions with "and" inside the step text.
- Do not rename a step that other features use without updating every use (search first).

## Expected text comes from label keys

A step that verifies UI text takes the label key as a parameter. The feature file then shows which text is expected, and nothing is hard-coded in the verification class:

```gherkin
Then The user sees the cart empty message "cartEmptyMessage"
```

- The step text names where the message appears (here, the empty-cart state). The `{string}` is a key in `src/labels/{store}/{locale}.json`. The verification resolves it with `getLabel(labels, key)`, so the same scenario checks the correct text in every locale.
- Never write the literal text in a feature file or a verification class, and never hard-code a label key inside a verification method.
- A new message is a new label key (data-generator adds it), not a new step. Add a new step only for a new place where messages appear (for example an error banner versus the empty state).
- Label keys follow coding-standards: camelCase with an area prefix.

## Step definitions

- File per owning module in `tests/steps/<area>.steps.ts`. Import `Given`, `When`, `Then` from `../../src/fixtures/index.js`. Login bindings belong to Account, PDP actions to Product, and cart operations to Cart even when a Cart feature uses all three. Create a missing owning file rather than putting prerequisites in the current feature module.
- Thin: destructure the fixtures you need, resolve data keys, call one page or verification method.
- No `page.` calls, no selectors, no `expect` in steps. Assertions live in verification classes (see page-verification).
- Use Cucumber expressions. Optional text in parentheses is fine: `{int} item(s)`.
- Never define the same step twice, in any file.

## Step map (the mapping artifact)

Write `docs/agent-runs/<slug>/step-map.md` with one row per distinct step used by the new scenarios:

| Case / requirement / expected outcome | Step text | Definition | Calls | New / reused |
|---|---|---|---|---|
| CRT_001 / FR-CART-01 / add the viewed product | `The user adds the product to the cart` | `tests/steps/product.steps.ts` | `ProductPage.addToCart()` | reused |

Mark each as **reused** or **new**. A reviewer can then see at a glance what was added.

## Checks before handing over

1. There is one scenario or outline per in-scope case, with the exact case ID title prefix. Each outline example and selected project counts toward the scope `instances`. Never add case ID tags.
2. Map bindings first, then implement each missing step with its owning dependencies and fixture wiring. `npx --no-install bddgen` and `npm run check` must pass before handoff. Do not deliberately leave unresolved methods for another stage.
3. No two step definitions have the same pattern; `npx bddgen export` shows no near-duplicates you introduced.
4. Feature text contains no literal test data, credentials or expected UI text (label keys instead).
5. Feature file names are PascalCase.

See `references/examples.md` for a complete feature, step file and step map.

Use scoped preflight and verification for exact title-based collection and execution. A successful binding export establishes available expressions, while passing execution and the outcome map establish coverage.
