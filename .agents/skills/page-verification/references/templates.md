# Templates (fictional cart example)

## `src/locators/cart.json`

```json
{
  "itemRows": "[data-testid=\"cart-item\"]",
  "emptyMessageText": "[data-testid=\"cart-empty\"]",
  "proceedToCheckoutBtn": "[data-testid=\"cart-checkout\"]",
  "removeBtn": "[data-testid=\"cart-remove-{sku}\"]"
}
```

## `src/network/cart.apis.json`

```json
{
  "viewCart": { "method": "GET", "path": "/cart/view", "status": 200 },
  "addToCart": { "method": "POST", "path": "/cart/items", "status": 200 }
}
```

## `src/labels/vpro/en-us.json`

```json
{
  "cartAddToCart": "Add To Cart",
  "cartEmptyMessage": "Your cart is empty"
}
```

## `src/pages/BasePage.ts`

```ts
import type { Page } from '@playwright/test';
import type { ApiInterceptor } from '../core/ApiInterceptor';

export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly api: ApiInterceptor,
  ) {}
}
```

## `src/pages/CartPage.ts`

```ts
import type { Locator, Page } from '@playwright/test';
import type { ApiInterceptor } from '../core/ApiInterceptor';
import type { Labels } from '../core/runtime';
import { tpl } from '../core/tpl';
import cartLocators from '../locators/cart.json';
import cartApis from '../network/cart.apis.json';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly locators = cartLocators;
  private readonly apis = cartApis;

  readonly itemRows: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page, api: ApiInterceptor, private readonly labels: Labels) {
    super(page, api);
    this.itemRows = page.locator(this.locators.itemRows);
    this.emptyMessage = page.locator(this.locators.emptyMessageText);
  }

  async open(): Promise<void> {
    const viewCart = this.api.intercept(this.apis.viewCart); // 1. intercept
    await this.page.goto('/cart');                            // 2. action
    await viewCart.wait();                                    // 3. wait
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.locator(this.locators.proceedToCheckoutBtn).click();
  }

  async removeItem(sku: string): Promise<void> {
    await this.page.locator(tpl(this.locators.removeBtn, { sku })).click();
  }

  async addToCart(): Promise<void> {
    const addToCart = this.api.intercept(this.apis.addToCart);
    await this.page.getByRole('button', { name: this.labels.cartAddToCart }).click();
    await addToCart.wait();
  }
}
```

## `src/verifications/CartVerifications.ts`

```ts
import { expect } from '@playwright/test';
import { getLabel } from '../core/label-key';
import type { Labels } from '../core/runtime';
import type { CartPage } from '../pages/CartPage';

export class CartVerifications {
  constructor(
    private readonly cart: CartPage,
    private readonly labels: Labels,
  ) {}

  async hasItems(count: number): Promise<void> {
    await expect(this.cart.itemRows).toHaveCount(count);
  }

  async showsEmptyMessage(labelKey: string): Promise<void> {
    await expect(this.cart.emptyMessage).toHaveText(getLabel(this.labels, labelKey));
  }
}
```

## `src/fixtures/index.ts` (registering the cart area)

```ts
import { test as base, createBdd } from 'playwright-bdd';
import { ApiInterceptor } from '../core/ApiInterceptor';
import { readEnvConfig, readStoreData, readStoreLabels, type Labels, type StoreData } from '../core/runtime';
import { CartPage } from '../pages/CartPage';
import { CartVerifications } from '../verifications/CartVerifications';

type Fixtures = {
  labels: Labels;
  data: StoreData;
  api: ApiInterceptor;
  cartPage: CartPage;
  cartVerify: CartVerifications;
};

export const test = base.extend<Fixtures>({
  labels: async ({}, use) => use(readStoreLabels()),
  data: async ({}, use) => use(readStoreData()),
  api: async ({ page }, use) => use(new ApiInterceptor(page, readEnvConfig().apiBaseURL)),
  cartPage: async ({ page, api, labels }, use) => use(new CartPage(page, api, labels)),
  cartVerify: async ({ cartPage, labels }, use) => use(new CartVerifications(cartPage, labels)),
});

export const { Given, When, Then } = createBdd(test);
```
