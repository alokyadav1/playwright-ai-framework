import { getByKey } from "../../src/core/data-key.js";
import { Given, Then, When } from "../../src/fixtures/index.js";

type CartProduct = { name: string; sku: string };

Given(
  "I have added the {string} product to my guest cart",
  async ({ accountPage, cartVerify, data, productPage }, productKey: string) => {
    const product = getByKey<CartProduct>(data, productKey);
    await accountPage.openHomepage();
    await productPage.openBySku(product.sku);
    await productPage.addToCart();
    await cartVerify.cartCountIs(1);
  },
);

When("I open the cart from the header", async ({ cartPage }) => {
  await cartPage.openFromHeader();
});

Then("the cart page is open", async ({ cartVerify }) => {
  await cartVerify.cartPageIsOpen();
});

Then("the registered user's cart is displayed", async ({ cartVerify }) => {
  await cartVerify.registeredCartIsDisplayed();
});

Then(
  "the cart item list includes the {string} product",
  async ({ cartVerify, data }, productKey: string) => {
    const product = getByKey<CartProduct>(data, productKey);
    await cartVerify.containsProduct(product.sku);
  },
);

Then("the order summary is visible", async ({ cartVerify }) => {
  await cartVerify.orderSummaryIsVisible();
});

Then("the checkout action is visible", async ({ cartVerify }) => {
  await cartVerify.checkoutActionIsVisible();
});

Then(
  "the {string} product image is displayed in the cart",
  async ({ cartVerify, data }, productKey: string) => {
    const product = getByKey<CartProduct>(data, productKey);
    await cartVerify.productImageIsDisplayed(product.sku);
  },
);

Then(
  "the {string} product name is displayed in the cart",
  async ({ cartVerify, data }, productKey: string) => {
    const product = getByKey<CartProduct>(data, productKey);
    await cartVerify.productNameIsDisplayed(product.sku);
  },
);

Then(
  "the unit price is displayed for the {string} cart product",
  async ({ cartVerify, data }, productKey: string) => {
    const product = getByKey<CartProduct>(data, productKey);
    await cartVerify.unitPriceIsDisplayed(product.sku);
  },
);

Then(
  "the selected quantity is displayed for the {string} cart product",
  async ({ cartVerify, data }, productKey: string) => {
    const product = getByKey<CartProduct>(data, productKey);
    await cartVerify.selectedQuantityIsDisplayed(product.sku);
  },
);

Then(
  "the line total is displayed for the {string} cart product",
  async ({ cartVerify, data }, productKey: string) => {
    const product = getByKey<CartProduct>(data, productKey);
    await cartVerify.lineTotalIsDisplayed(product.sku);
  },
);
