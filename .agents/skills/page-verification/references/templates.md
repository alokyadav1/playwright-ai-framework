# Implementation references

- [AccountPage](../../../../src/pages/AccountPage.ts) uses JSON and accessible-name locators.
- [CartVerifications](../../../../src/verifications/CartVerifications.ts) uses page-owned locators and web-first assertions.
- [Fixture registry](../../../../src/fixtures/index.ts) defines the custom BDD instance and fixture names.
- [ApiInterceptor](../../../../src/core/ApiInterceptor.ts) accepts an optional response-correlation predicate for overlapping calls.

## Imports and fixture contracts

```ts
import type { Locator, Page } from '@playwright/test';
import { getLabel } from '../core/label-key.js';
import type { Labels } from '../core/runtime.js';
import accountLocators from '../locators/account.json' with { type: 'json' };
```

Use the real module file and constructor being extended. AccountPage, ProductPage and CartPage currently extend BasePage and receive `(page, api, labels)`. CartVerifications currently receives CartPage only. Add labels to a verification constructor and its fixture only when a new approved text assertion needs them. Keep existing callers valid.

The data fixture uses `readStoreData({ decrypt: false })`. Bindings resolve only the selected entity with `getByKey<T>(data, key)`. Do not switch the fixture back to eager whole-file decryption.

## Page and assertion bodies

Build application CSS locators from the owning JSON. Semantic names come from validated labels, with scope and exact matching chosen from browser evidence.

```ts
this.addToCartBtn = page.getByRole('button', {
  name: getLabel(labels, 'productAddToCartBtn'),
  exact: true,
});
```

The following verification body is a pattern for a page exposing an empty-state locator. It requires an approved outcome, matching page property, labels constructor dependency and fixture wiring. It is not an existing CartVerifications API.

```ts
async showsEmptyMessage(labelKey: string): Promise<void> {
  await expect(this.cart.emptyMessage).toHaveText(getLabel(this.labels, labelKey));
}
```

A label key used to locate an element may be selected in the page. Expected copy is supplied by the scenario's key and validated in the verification. Assertions remain read-only. Use `toBeHidden` for hidden states and `toHaveValue` or `toHaveText` for exact values rather than reading `textContent` once.

## Optional wait registry

The following shape illustrates a verified registry entry and must be filled from authorized network evidence. The ZIP does not ship an application registry.

```json
{
  "viewCart": { "method": "GET", "path": "/cart/view", "status": 200, "timeout": 10000 }
}
```

```ts
const viewCart = this.api.intercept(this.apis.viewCart);
await this.page.goto('/cart');
await viewCart.wait();
```

Use only if that call always occurs and is browser-observable. Register all required handles before the action. For overlapping responses use the optional synchronous correlation predicate and verify the needed non-sensitive request identity, such as a query SKU. The registry alone ignores query strings. UI readiness covers cached, conditional or server-side calls.

## Module and component placement

PDP add-to-cart actions belong in ProductPage. Cart navigation, line removal and cart assertions belong in Cart files. Login belongs in Account files. New page, verification and fixture names follow coding-standards. Extract shared components only for demonstrated shared UI. A scenario spanning modules reuses those owning files rather than copying their code into one page.

Register missing fixtures lazily in `src/fixtures/index.ts` and list that file in BDD config. Clean up extra pages, contexts or other resources that a fixture creates. Do not place mutable state at module level. Typecheck each fully wired change, then run the scoped verification gate.
