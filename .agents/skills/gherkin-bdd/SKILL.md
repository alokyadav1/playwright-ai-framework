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

1. Run `npx bddgen export` (authoritative list of defined steps) and `npm run agent:inventory steps`.
2. Search `tests/features` for the test case tag (`@TC-...`). If the scenario exists, update it; never add a second one.
3. Search for existing steps with the same intent (same verb and object). Reuse them. If one exists with a different literal, turn the literal into a parameter instead of copying the step.

## Scenario rules

- Tags on every scenario: `@TC-<ID>` and `@REQ-<id>` for each requirement, plus `@smoke`, `@regression` or `@i18n` when the test case or user says so. Add an area tag such as `@cart` on the Feature.
- Title = the test case title.
- **Given** sets state (preconditions), **When** is one user action, **Then** is an observable outcome. `And` / `But` continue the previous keyword. Prefer one `When` per scenario.
- Declarative, present tense, business language: "I open the cart", not "I click the cart icon". No selectors, no CSS, no URL paths, no waits.
- `Background` only for steps shared by every scenario in the file.
- Scenarios are independent; none relies on another having run.
- No credentials, tokens or real values anywhere in a feature file. Use data keys.
- `Scenario Outline` only for the same flow over different data. Examples columns hold data keys, never raw values.
- Every `Then` traces to a line of the test case's expected result. Do not add assertions the test case does not contain.

## Steps use data keys, not literals

Describe the intent in the step text and pass variation as a data key parameter:

```gherkin
Given I am logged in as the "customer" user
When I add the "simpleProduct" product to the cart
Then the cart contains 1 item
```

- `{string}` carries a data key (`"customer"` resolves to `credentials.customer`, `"simpleProduct"` to `products.simpleProduct`). `{int}` carries counts. Avoid regular expressions in step patterns.
- The step definition resolves the key with `getByKey(data, '...')`, which throws with the key name if it is missing or still a placeholder.
- Do not over-generalise. `When I click {string}` or `Then I see the text {string}` are anti-patterns: they push UI mechanics into feature files and defeat reuse by readability. Parameterise by business entity (a product, a role, a coupon), not by UI element.
- One step, one responsibility. Do not join two actions with "and" inside the step text.
- Do not rename a step that other features use without updating every use (search first).

## Expected text comes from label keys

A step that verifies UI text takes the label key as a parameter. The feature file then shows which text is expected, and nothing is hard-coded in the verification class:

```gherkin
Then the cart shows the empty message "cartEmptyMessage"
```

- The step text names where the message appears (here, the empty-cart state). The `{string}` is a key in `src/labels/{store}/{locale}.json`. The verification resolves it with `getLabel(labels, key)`, so the same scenario checks the correct text in every locale.
- Never write the literal text in a feature file or a verification class, and never hard-code a label key inside a verification method.
- A new message is a new label key (data-generator adds it), not a new step. Add a new step only for a new place where messages appear (for example an error banner versus the empty state).
- Label keys follow coding-standards: camelCase with an area prefix.

## Step definitions

- File per area: `tests/steps/<area>.steps.ts`. Import `Given`, `When`, `Then` from `src/fixtures`.
- Thin: destructure the fixtures you need, resolve data keys, call one page or verification method.
- No `page.` calls, no selectors, no `expect` in steps. Assertions live in verification classes (see page-verification).
- Use Cucumber expressions. Optional text in parentheses is fine: `{int} item(s)`.
- Never define the same step twice, in any file.

## Step map (the mapping artifact)

Write `docs/agent-runs/<slug>/step-map.md` with one row per distinct step used by the new scenarios:

| Step text | Definition | Calls |
|---|---|---|
| `I add the {string} product to the cart` | `tests/steps/cart.steps.ts` | `ProductPage.addToCart(sku)` |

Mark each as **reused** or **new**. A reviewer can then see at a glance what was added.

## Checks before handing over

1. Scenario count equals the number of in-scope test cases; every scenario has its `@TC-` tag.
2. `npx bddgen` passes with no missing step definitions.
3. No two step definitions have the same pattern; `npx bddgen export` shows no near-duplicates you introduced.
4. Feature text contains no literal test data, credentials or expected UI text (label keys instead).
5. Feature file names are PascalCase.

See `references/examples.md` for a complete feature, step file and step map.
