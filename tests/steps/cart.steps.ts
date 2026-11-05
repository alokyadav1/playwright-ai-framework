import { getByKey } from "../../src/core/data-key.js";
import { Given, Then, When } from "../../src/fixtures/index.js";

type Product = { sku: string };

When("I open the cart from the header", async ({ cartPage, labels }) => {
  await cartPage.openFromHeader(labels);
});

Given("I have added the {string} product to my guest cart", async ({ data, productPage }, productKey: string) => {
  const product = getByKey<Product>(data, productKey);
  await productPage.openBySku(product.sku);
  await productPage.addToCart();
});

When("I add the {string} product to my cart", async ({ data, productPage }, productKey: string) => {
  const product = getByKey<Product>(data, productKey);
  await productPage.openBySku(product.sku);
  await productPage.addToCart();
});

Then("the cart page is open", async ({ cartVerify }) => {
  await cartVerify.isOpen();
});

Then("the registered user's cart includes the {string} product", async ({ cartVerify, data }, productKey: string) => {
  const product = getByKey<Product>(data, productKey);
  await cartVerify.hasDisplayedProduct(product.sku);
});

Then("the cart item list includes the {string} product", async ({ cartVerify, data }, productKey: string) => {
  const product = getByKey<Product>(data, productKey);
  await cartVerify.includesProduct(product.sku);
});

Then("the order summary is visible", async ({ cartVerify }) => {
  await cartVerify.showsOrderSummary();
});

Then("the checkout action is visible", async ({ cartVerify }) => {
  await cartVerify.showsCheckoutAction();
});

Then("the {string} product image is displayed in the cart", async ({ cartVerify, data }, productKey: string) => {
  const product = getByKey<Product>(data, productKey);
  await cartVerify.showsProductImage(product.sku);
});

Then("the {string} product name is displayed in the cart", async ({ cartVerify, data }, productKey: string) => {
  const product = getByKey<Product>(data, productKey);
  await cartVerify.showsProductName(product.sku);
});

Then("the unit price is displayed for the {string} cart product", async ({ cartVerify, data }, productKey: string) => {
  const product = getByKey<Product>(data, productKey);
  await cartVerify.showsUnitPrice(product.sku);
});

Then("the selected quantity is displayed for the {string} cart product", async ({ cartVerify, data }, productKey: string) => {
  const product = getByKey<Product>(data, productKey);
  await cartVerify.showsSelectedQuantity(product.sku);
});

Then("the line total is displayed for the {string} cart product", async ({ cartVerify, data }, productKey: string) => {
  const product = getByKey<Product>(data, productKey);
  await cartVerify.showsLineTotal(product.sku);
});
