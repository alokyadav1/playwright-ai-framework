import { getByKey } from "../../src/core/data-key.js";
import { Given, Then, When } from "../../src/fixtures/index.js";

type Credentials = { email: string; password: string };
type VStripeDetails = {
  cardHolderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

Given("I am on the VPRO storefront homepage", async ({ accountPage }) => {
  await accountPage.openHomepage();
});

When("I sign in as the {string} user", async ({ accountPage, data }, userKey: string) => {
  const credentials = getByKey<Credentials>(data, userKey);
  await accountPage.signIn(credentials);
});

When("I search for the {string} product", async ({ productSearchPage, data }, productKey: string) => {
  const productName = getByKey<string>(data, `products.${productKey}.name`);
  await productSearchPage.searchForProduct(productName);
});

When("I open the first matching {string} product", async ({ productSearchPage, data }, productKey: string) => {
  const productSlug = getByKey<string>(data, `products.${productKey}.slug`);
  await productSearchPage.openProduct(productSlug);
});

When("I add the product to my cart", async ({ productPage }) => {
  await productPage.addToCart();
});

When("I navigate to my cart", async ({ cartPage }) => {
  await cartPage.open();
});

When("I proceed to checkout", async ({ cartPage }) => {
  await cartPage.proceedToCheckout();
});

When("I continue from the delivery address section", async ({ checkoutPage }) => {
  await checkoutPage.continueFromDeliveryAddress();
});

When("I continue to payment", async ({ checkoutPage }) => {
  await checkoutPage.continueToPayment();
});

When("I enter valid vStripe details from the {string}", async ({ paymentPage, data }, dataKey: string) => {
  const details = getByKey<VStripeDetails>(data, dataKey);
  await paymentPage.enterVStripeDetails(details);
});

When("I authorize payment with vStripe", async ({ paymentPage }) => {
  await paymentPage.authorizeVStripe();
});

Then(
  "the payment confirmation is displayed from the {string} message",
  async ({ paymentVerify, data }, messageKey: string) => {
    const message = getByKey<string>(data, messageKey);
    await paymentVerify.showsAuthorizationMessage(message);
  },
);

Then("the Place Order action is enabled", async ({ paymentVerify }) => {
  await paymentVerify.placeOrderIsEnabled();
});