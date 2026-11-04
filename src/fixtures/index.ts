import { test as base, createBdd } from "playwright-bdd";
import { ApiInterceptor } from "../core/ApiInterceptor.js";
import { AccountPage } from "../pages/AccountPage.js";
import { CartPage } from "../pages/CartPage.js";
import { CheckoutPage } from "../pages/CheckoutPage.js";
import { PaymentPage } from "../pages/PaymentPage.js";
import { ProductPage } from "../pages/ProductPage.js";
import { ProductSearchPage } from "../pages/ProductSearchPage.js";
import { CartVerifications } from "../verifications/CartVerifications.js";
import { PaymentVerifications } from "../verifications/PaymentVerifications.js";
import {
  readEnvConfig,
  readStoreData,
  readStoreLabels,
  type Labels,
  type StoreData,
} from "../core/runtime.js";

type Fixtures = {
  labels: Labels;
  data: StoreData;
  api: ApiInterceptor;
  accountPage: AccountPage;
  productSearchPage: ProductSearchPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  cartVerify: CartVerifications;
  paymentVerify: PaymentVerifications;
};

export const test = base.extend<Fixtures>({
  labels: ({}, use) => use(readStoreLabels()),
  data: ({}, use) => use(readStoreData()),
  api: ({ page }, use) =>
    use(new ApiInterceptor(page, readEnvConfig().apiBaseURL)),
  accountPage: ({ page, api, labels }, use) =>
    use(new AccountPage(page, api, labels)),
  productSearchPage: ({ page, api, labels }, use) =>
    use(new ProductSearchPage(page, api, labels)),
  productPage: ({ page, api, labels }, use) =>
    use(new ProductPage(page, api, labels)),
  cartPage: ({ page, api, labels }, use) =>
    use(new CartPage(page, api, labels)),
  checkoutPage: ({ page, api, labels }, use) =>
    use(new CheckoutPage(page, api, labels)),
  paymentPage: ({ page, api, labels }, use) =>
    use(new PaymentPage(page, api, labels)),
  cartVerify: ({ cartPage }, use) =>
    use(new CartVerifications(cartPage)),
  paymentVerify: ({ paymentPage }, use) =>
    use(new PaymentVerifications(paymentPage)),
});

export const { Given, When, Then } = createBdd(test);
