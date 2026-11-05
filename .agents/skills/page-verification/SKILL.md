---
name: page-verification
description: Implement page objects, components, verification classes, API wait registry entries and fixture wiring following this framework's conventions (JSON locators and labels, intercept-action-wait API waits, assertions only in verification classes). Use whenever step definitions need page or verification methods, a new page or component is needed, an API wait must be added, or fixtures must be registered.
---

# Pages and verifications

Pages say what the user can do. Verifications say what must be true afterwards. Keeping them apart means a page method can be reused by a scenario that expects the opposite outcome, and a reader sees exactly what each test checks.

## Reuse first

Run `npm run agent:inventory pages` before writing. If a method with the same intent exists, reuse it. If a page exists, extend it; do not create `CartPage2`. New page files are for genuinely new pages.

## Page objects (`src/pages/<Name>Page.ts`)

- Extend `BasePage`. Constructor receives `(page, api, labels)` from the fixture.
- Import locators from `src/locators/<name>.json`. Build `Locator`s in the constructor from those strings. No selector strings in TypeScript.
- Role-based elements: `page.getByRole('button', { name: this.labels.cartAddToCart })`. Label keys come from the labels file.
- Methods are named for user intent (`proceedToCheckout`, `addToCart`) and contain actions only. No `expect`.
- Expose `readonly` locators that verification classes need to assert on.
- Never use `waitForTimeout` or `networkidle`. Rely on auto-waiting and web-first assertions, plus API waits where justified.
- Shared UI (header, modal, table) goes into `src/components/<Name>.ts` and is composed by pages.

## API waits

Add one only if the action **always** fires the call and the endpoint is on the configured `apiBaseURL`. A wait on a call that is sometimes cached turns into a new flaky failure.

1. Add the entry to `src/network/<area>.apis.json` (path relative to `apiBaseURL`, `*` matches one segment).
2. In the page method use three explicit steps, in this order:

```ts
const viewCart = this.api.intercept(this.apis.viewCart);   // 1. intercept BEFORE the action
await this.page.goto('/cart');                              // 2. the action that triggers the call
await viewCart.wait();                                      // 3. wait for it
```

Register every listener before the action. If one action triggers several calls, create all handles first, then `await Promise.all([a.wait(), b.wait()])`. Discover method, path and status with `playwright-cli requests` (see locator-strategy).

## Verifications (`src/verifications/<Name>Verifications.ts`)

- Constructor receives the page object and labels.
- Methods are named for outcomes (`hasItems`, `showsEmptyMessage`) and use web-first assertions on locators the page exposes: `await expect(this.cart.itemRows).toHaveCount(count)`.
- Do not read a value and then assert on it (`expect(await locator.textContent())`): that loses auto-retry and causes flakiness.
- Expected text comes from labels or data, never from string literals. A method that checks text takes a label key parameter and resolves it with `getLabel(this.labels, key)`; it never hard-codes the key. Example: `showsEmptyMessage(labelKey)`.
- Read-only: a verification never clicks or types.
- One method per distinct expectation, so a failure names exactly what broke.

## Fixtures (`src/fixtures/index.ts`)

Register each new page as `<area>Page` and each verification as `<area>Verify`. Fixtures are lazy and need no cleanup code unless the page opens extra resources. No module-level state.

## Step definitions

Thin glue only (see gherkin-bdd). Steps call page and verification methods and resolve data with `getByKey`.

## Finish

1. Complete the coherent step/page/fixture slice, then apply planner-workflow's validation matrix; do not repeatedly run checks while dependencies are knowingly incomplete.
2. Every new locator is logged and verified (locator-strategy).
3. Run affected scenarios only when the selected flow calls for execution and data/auth/reset prerequisites hold. Hand failures to failure-analysis without widening the parent's scope. Report unexecuted consumers explicitly.

Complete templates are in `references/templates.md`.
