import type { Locator, Page } from "@playwright/test";
import type { ApiInterceptor } from "../core/ApiInterceptor.js";
import type { Labels } from "../core/runtime.js";
import { tpl } from "../core/tpl.js";
import cartLocators from "../locators/cart.json" with { type: "json" };
import { BasePage } from "./BasePage.js";

export class CartPage extends BasePage {
  readonly browserPage: Page;
  readonly checkoutBtn: Locator;
  readonly orderSummaryHeading: Locator;

  constructor(page: Page, api: ApiInterceptor, labels: Labels) {
    super(page, api);
    this.browserPage = page;
    this.checkoutBtn = page.getByRole("button", { name: labels.cartProceedToCheckoutBtn, exact: true });
    this.orderSummaryHeading = page.getByRole("heading", {
      name: labels.cartOrderSummaryHeading,
      exact: true,
    });
  }

  async open(): Promise<void> {
    await this.page.goto("/en/cart");
  }

  async openFromHeader(labels: Labels): Promise<void> {
    await this.page.getByRole("link", { name: labels.cartHeaderLink, exact: true }).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutBtn.click();
  }

  productImage(sku: string): Locator {
    return this.itemRow(sku).locator(this.productLocator(cartLocators.productImage, sku));
  }

  productName(sku: string): Locator {
    return this.itemRow(sku).locator(this.productLocator(cartLocators.productName, sku));
  }

  productPrice(sku: string): Locator {
    return this.itemRow(sku).locator(cartLocators.productPriceText);
  }

  quantityInput(sku: string): Locator {
    return this.itemRow(sku).locator(cartLocators.quantityInput);
  }

  private itemRow(sku: string): Locator {
    const productLink = this.page.locator(this.productLocator(cartLocators.productLink, sku));
    return this.page.locator(cartLocators.itemRow).filter({ has: productLink });
  }

  private productLocator(locator: string, sku: string): string {
    return tpl(locator, { productId: this.productId(sku) });
  }

  private productId(sku: string): string {
    return sku.slice(sku.lastIndexOf("/") + 1);
  }
}
