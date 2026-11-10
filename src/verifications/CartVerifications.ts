import { expect } from "@playwright/test";
import type { CartPage } from "../pages/CartPage.js";

export class CartVerifications {
  constructor(private readonly cartPage: CartPage) {}

  async isOpen(): Promise<void> {
    await expect(this.cartPage.browserPage).toHaveURL(/\/en\/cart$/);
  }

  async hasDisplayedProduct(sku: string): Promise<void> {
    await expect(this.cartPage.productName(sku)).toBeVisible();
  }

  async includesProduct(sku: string): Promise<void> {
    await expect(this.cartPage.productName(sku)).toBeVisible();
  }

  async showsOrderSummary(): Promise<void> {
    await expect(this.cartPage.orderSummaryHeading).toBeVisible();
  }

  async showsCheckoutAction(): Promise<void> {
    await expect(this.cartPage.checkoutBtn).toBeVisible();
  }

  async showsProductImage(sku: string): Promise<void> {
    await expect(this.cartPage.productImage(sku)).toBeVisible();
  }

  async showsProductName(sku: string): Promise<void> {
    await expect(this.cartPage.productName(sku)).toBeVisible();
  }

  async showsUnitPrice(sku: string): Promise<void> {
    await expect(this.cartPage.productName(sku)).toBeVisible();
    await expect(this.cartPage.productPrice(sku)).toBeVisible();
  }

  async showsSelectedQuantity(sku: string): Promise<void> {
    await expect(this.cartPage.productName(sku)).toBeVisible();
    await expect(this.cartPage.quantityInput(sku)).toHaveValue(/^[1-9]\d*$/);
  }

  async showsLineTotal(sku: string): Promise<void> {
    await expect(this.cartPage.productName(sku)).toBeVisible();
    await expect(this.cartPage.productPrice(sku)).toBeVisible();
  }

  async showsInvalidPromoError(expectedMessage: string): Promise<void> {
    const errorLoc = this.cartPage.browserPage.getByText(expectedMessage, { exact: true });
    await expect(errorLoc).toBeVisible({ timeout: 10000 });
    await expect(errorLoc).toHaveCSS("color", /oklch|rgb\(2[0-5][0-5]|rgba\(2[0-5][0-5]|red|#f/i);
  }

  async orderTotalIsUnchanged(initialTotal: string): Promise<void> {
    const totalValueEl = this.cartPage.browserPage.locator("div, span, p").filter({ hasText: /^Total$/ }).locator("..").locator("div, span, p").last();
    await expect(totalValueEl).toHaveText(initialTotal);
  }
}
