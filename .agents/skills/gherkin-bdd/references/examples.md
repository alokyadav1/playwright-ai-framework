# Example (fictional cart feature)

## `tests/features/cart/CartContents.feature`

```gherkin
@cart
Feature: Cart contents
  A customer can see the products they added to the cart.

  @TC-CART-001 @REQ-CART-3.1 @smoke
  Scenario: Added product appears in the cart
    Given I am logged in as the "customer" user
    When I add the "simpleProduct" product to the cart
    And I open the cart
    Then the cart contains 1 item

  @TC-CART-002 @REQ-CART-3.2
  Scenario: Empty cart shows the empty message
    Given I am logged in as the "customer" user
    When I open the cart
    Then the cart shows the empty message "cartEmptyMessage"
```

## `tests/steps/cart.steps.ts`

```ts
import { Given, When, Then } from '../../src/fixtures';
import { getByKey } from '../../src/core/data-key';

type Credentials = { email: string; password: string };
type Product = { sku: string };

Given('I am logged in as the {string} user', async ({ loginPage, data }, role: string) => {
  const creds = getByKey<Credentials>(data, `credentials.${role}`);
  await loginPage.login(creds.email, creds.password);
});

When('I add the {string} product to the cart', async ({ productPage, data }, productKey: string) => {
  const product = getByKey<Product>(data, `products.${productKey}`);
  await productPage.addToCart(product.sku);
});

When('I open the cart', async ({ cartPage }) => {
  await cartPage.open();
});

Then('the cart contains {int} item(s)', async ({ cartVerify }, count: number) => {
  await cartVerify.hasItems(count);
});

Then('the cart shows the empty message {string}', async ({ cartVerify }, labelKey: string) => {
  await cartVerify.showsEmptyMessage(labelKey);
});
```

## `docs/agent-runs/<slug>/step-map.md`

| Step text | Definition | Calls | New / reused |
|---|---|---|---|
| `I am logged in as the {string} user` | `tests/steps/cart.steps.ts` | `LoginPage.login(email, password)` | reused |
| `I add the {string} product to the cart` | `tests/steps/cart.steps.ts` | `ProductPage.addToCart(sku)` | new |
| `I open the cart` | `tests/steps/cart.steps.ts` | `CartPage.open()` | new |
| `the cart contains {int} item(s)` | `tests/steps/cart.steps.ts` | `CartVerifications.hasItems(count)` | new |
| `the cart shows the empty message {string}` | `tests/steps/cart.steps.ts` | `CartVerifications.showsEmptyMessage(labelKey)` | new |

## Scenario Outline with data keys

```gherkin
  @TC-CART-004 @REQ-CART-3.5
  Scenario Outline: Each product type can be added
    Given I am logged in as the "customer" user
    When I add the "<product>" product to the cart
    Then the cart contains 1 item

    Examples:
      | product       |
      | simpleProduct |
      | bundleProduct |
```
