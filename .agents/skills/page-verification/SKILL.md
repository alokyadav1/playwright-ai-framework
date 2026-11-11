---
name: page-verification
description: Implement page objects, components, verification classes, API wait registry entries and fixture wiring following this framework's conventions (JSON locators and labels, intercept-action-wait API waits, assertions only in verification classes). Use whenever step definitions need page or verification methods, a new page or component is needed, an API wait must be added, or fixtures must be registered.
---

# Pages and verifications

Pages say what the user can do. Verifications say what must be true afterwards. Keeping them apart means a page method can be reused by a scenario that expects the opposite outcome, and a reader sees exactly what each test checks.

## Reuse first

Run `npm run agent:inventory -- pages` before writing. If a method with the same intent exists, reuse it. If a page exists, extend it; do not create `CartPage2`. New page files are for genuinely new owning modules. Account owns login, ProductSearch owns search, Product owns PDP, Cart owns cart operations, Checkout owns checkout navigation, and Payment owns payment actions. Keep methods, locators, verification classes and bindings in those owning files even for cross-module features. Create missing owning files. Reuse existing CommonPage helpers where present and applicable.

## Page objects (`src/pages/<Name>Page.ts`)

- Extend `BasePage`. Constructor receives `(page, api, labels)` from the fixture.
- Use `.js` extensions on local ESM imports and `with { type: 'json' }` on JSON imports. Import locators from `src/locators/<name>.json`. Build `Locator`s in the constructor from those strings. No selector strings in TypeScript.
- Role-based elements: `page.getByRole('button', { name: getLabel(this.labels, 'productAddToCartBtn'), exact: true })`. Label keys come from the labels file.
- Methods are named for user intent (`proceedToCheckout`, `addToCart`) and contain actions only. No `expect`.
- Expose `readonly` locators that verification classes need to assert on.
- Never use `waitForTimeout` or `networkidle`. Rely on auto-waiting and web-first assertions, plus API waits where justified.
- Shared UI (header, modal, table) goes into `src/components/<Name>.ts` and is composed by pages when there are demonstrated shared consumers. Keep single-page UI in its owning page. Follow locator-strategy for associated-label, text and frame scoping.

## API waits

Add one only if the action **always** fires the call and the endpoint is on the configured `apiBaseURL`. A wait on a call that is sometimes cached turns into a new flaky failure.

1. Reuse or add the entry to `src/network/<area>.apis.json` (path relative to `apiBaseURL`, `*` matches one segment). This is an optional extension point, so create the owning file only when a verified call needs it. `src/api` setup clients and plain API specs are separately scoped extension work.
2. In the page method use three explicit steps, in this order:

```ts
const viewCart = this.api.intercept(this.apis.viewCart);   // 1. intercept BEFORE the action
await this.page.goto('/cart');                              // 2. the action that triggers the call
await viewCart.wait();                                      // 3. wait for it
```

Register every listener before the action. If one action triggers several calls, create all handles first, then `await Promise.all([a.wait(), b.wait()])`. Discover sanitized method, origin, path and status using the named-session CLI (see locator-strategy). The interceptor matches method, origin and path, and ignores query strings unless its optional correlation predicate checks them. For overlapping calls pass a safe predicate such as `response => new URL(response.url()).searchParams.get('sku') === sku`. Never log payloads or secrets. Use UI readiness when a request is conditional, cached or server-side, because the browser cannot guarantee observing it.

## Verifications (`src/verifications/<Name>Verifications.ts`)

- Constructor receives the page object, plus labels only when its assertions consume labels. Existing verification constructors without labels remain valid.
- Methods are named for outcomes (`hasItems`, `showsEmptyMessage`) and use web-first assertions on locators the page exposes: `await expect(this.cart.itemRows).toHaveCount(count)`.
- Do not read a value and then assert on it (`expect(await locator.textContent())`): that loses auto-retry and causes flakiness. Prefer `toHaveText`, `toHaveValue`, `toHaveCount`, `toBeEnabled`, `toBeDisabled` and `toBeHidden` as appropriate. Use `toBeHidden()` for a hidden-element expectation. A visibility assertion does not prove an expected price, quantity or product identity.
- Expected text comes from labels or data, never from string literals. A method that checks text takes a label key parameter and resolves it with `getLabel(this.labels, key)`; it never hard-codes the key. Example: `showsEmptyMessage(labelKey)`.
- Read-only: a verification never clicks or types.
- One method per distinct expectation, so a failure names exactly what broke.

## Fixtures (`src/fixtures/index.ts`)

Register each new page as `<area>Page` and each verification as `<area>Verify`. Fixtures are lazy and need no cleanup code unless the page opens extra resources. No module-level state.

## Step definitions

Thin glue only (see gherkin-bdd). Steps call page and verification methods and resolve data with `getByKey`. Wire each missing binding together with its dependencies and fixture registration. Preserve existing fixture names and constructor contracts.

## Finish

1. Typecheck after each wired group of files, then run the complete `npm run check` gate.
2. Every new locator is logged and verified (locator-strategy).
3. Run scoped preflight and title-based verification. Hand failures to failure-analysis and rerun affected consumers of shared changes.

Complete templates are in `references/templates.md`.

The included FrameworkPage is an isolated framework smoke fixture. Its in-memory HTML and fixed expected result exercise the harness. Use the storefront conventions above when implementing application scenarios.
