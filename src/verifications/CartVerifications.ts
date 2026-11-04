import { expect } from "@playwright/test";
import type { CartPage } from "../pages/CartPage.js";

export class CartVerifications {
  constructor(private readonly cartPage: CartPage) {}

  async cartPageIsOpen(): Promise<void> {
    await expect(this.cartPage.browserPage).toHaveURL(/\/cart(?:[?#].*)?$/);
  }

  async registeredCartIsDisplayed(): Promise<void> {
    await expect(this.cartPage.itemRows).not.toHaveCount(0);
  }

  async cartCountIs(count: number): Promise<void> {
    await expect(this.cartPage.headerCartItemCount).toHaveText(String(count));
  }

  async orderSummaryIsVisible(): Promise<void> {
    await expect(this.cartPage.orderSummaryHeading).toBeVisible();
  }

  async checkoutActionIsVisible(): Promise<void> {
    await expect(this.cartPage.proceedToCheckoutBtn).toBeVisible();
  }

  async containsProduct(productSku: string): Promise<void> {
    await expect(this.cartPage.itemNameLink(productSku)).toBeVisible();
  }

  async productImageIsDisplayed(productSku: string): Promise<void> {
    await expect(this.cartPage.itemImage(productSku)).toBeVisible();
  }

  async productNameIsDisplayed(productSku: string): Promise<void> {
    await expect(this.cartPage.itemNameLink(productSku)).toBeVisible();
  }

  async unitPriceIsDisplayed(productSku: string): Promise<void> {
    await expect(this.cartPage.itemUnitPrice(productSku)).toBeVisible();
  }

  async selectedQuantityIsDisplayed(productSku: string): Promise<void> {
    await expect(this.cartPage.itemQuantityInput(productSku)).toBeVisible();
  }

  async lineTotalIsDisplayed(productSku: string): Promise<void> {
    await expect(this.cartPage.itemLineTotal(productSku)).toBeVisible();
  }
}
