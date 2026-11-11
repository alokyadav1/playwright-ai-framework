# Gherkin, binding and traceability examples

## Executable framework example

See [FrameworkSmoke.feature](../../../../tests/features/framework/FrameworkSmoke.feature), [framework.steps.ts](../../../../tests/steps/framework.steps.ts), [FrameworkPage](../../../../src/pages/FrameworkPage.ts) and [FrameworkVerifications](../../../../src/verifications/FrameworkVerifications.ts) for a complete executable flow. Its in-memory HTML and fixed expected result belong to the framework smoke.

| Case | Requirement | Outcome | Then | Verification |
|---|---|---|---|---|
| FW_001 | FW-SMOKE | A successful result appears | The user sees the successful framework result | FrameworkVerifications.successIsVisible |

## Application scenario and owning modules

The following is an authoring pattern for an approved cart case. Its data and expected outcome must come from the actual approved case. The ZIP contains no live application feature or verified catalog values.

```gherkin
@cart
Feature: Cart contents

  @smoke
  Scenario: CRT_001 - Verify user can add item to cart from pdp
    Given The user is logged in as the "credentials.customer" user
    And The user is viewing the "products.simpleProduct" product
    When The user adds the product to the cart
    And The user opens the cart
    Then The user sees the "products.simpleProduct" product in the cart
```

Each step has one intent. The cart feature reuses Account and Product behavior. Its login binding belongs to `account.steps.ts`, PDP bindings to `product.steps.ts`, and cart bindings to `cart.steps.ts`. Inspect existing expressions before authoring any of them.

These binding bodies illustrate calls to existing exported APIs. Reuse existing expressions where available. The login precondition must establish the correct start page, and each missing binding and dependency is implemented together.

```ts
import { Given } from '../../src/fixtures/index.js';
import { getByKey } from '../../src/core/data-key.js';

type Product = { sku: string };

Given('The user is viewing the {string} product', async ({ productPage, data }, key: string) => {
  const product = getByKey<Product>(data, key);
  await productPage.openBySku(product.sku);
});
```

```ts
import { Then } from '../../src/fixtures/index.js';
import { getByKey } from '../../src/core/data-key.js';

type Product = { sku: string };

Then('The user sees the {string} product in the cart', async ({ cartVerify, data }, key: string) => {
  const product = getByKey<Product>(data, key);
  await cartVerify.containsProduct(product.sku);
});
```

Text assertions take label keys from the scenario, and the owning verification resolves them with `getLabel`. Add a new message step only for a distinct business outcome, preserving existing consumers.

## Step map

| Case / requirement | Expected outcome or action | Step | Owning binding | Existing API | Status |
|---|---|---|---|---|---|
| CRT_001 / approved cart rule | View the target product | The user is viewing the {string} product | product.steps.ts | ProductPage.openBySku(sku) | Confirm reused/new through export |
| CRT_001 / approved cart rule | Add the viewed product | The user adds the product to the cart | product.steps.ts | ProductPage.addToCart() | Confirm reused/new through export |
| CRT_001 / approved cart rule | Exact added product appears | The user sees the {string} product in the cart | cart.steps.ts | CartVerifications.containsProduct(sku) | Confirm reused/new through export |

If the approved outcome also specifies product name, price, quantity or total, map each to its own assertion. The example's product-presence check covers identity only.

## Outline pattern

```gherkin
  @regression
  Scenario Outline: CRT_004 - Verify supported product variants can be added
    Given The user is viewing the "<product>" product
    When The user adds the product to the cart
    And The user opens the cart
    Then The user sees the "<product>" product in the cart

    Examples:
      | product                |
      | products.simpleProduct |
      | products.bundleProduct |
```

Use an outline only when the approved case describes the same flow over those variants. Two rows on one configured project require `instances: 2` for that case in the scope. Each row needs independent state setup and cleanup. Never put the case ID in tags or use raw catalog values in Examples.
