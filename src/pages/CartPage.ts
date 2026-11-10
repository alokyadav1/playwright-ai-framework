import type { Locator, Page } from "@playwright/test";
import type { ApiInterceptor } from "../core/ApiInterceptor.js";
import { getByKey } from "../core/data-key.js";
import type { Labels, StoreData } from "../core/runtime.js";
import { tpl } from "../core/tpl.js";
import cartLocators from "../locators/cart.json" with { type: "json" };
import { BasePage } from "./BasePage.js";
import type { ProductPage } from "./ProductPage.js";

export class CartPage extends BasePage {
  readonly browserPage: Page;
  readonly checkoutBtn: Locator;
  readonly orderSummaryHeading: Locator;
  readonly promoInput: Locator;
  readonly applyPromoBtn: Locator;
  readonly promoErrorMsg: Locator;
  readonly orderSummaryTotal: Locator;

  constructor(page: Page, api: ApiInterceptor, labels: Labels) {
    super(page, api);
    this.browserPage = page;
    this.checkoutBtn = page.getByRole("button", { name: labels.cartProceedToCheckoutBtn, exact: true });
    this.orderSummaryHeading = page.getByRole("heading", {
      name: labels.cartOrderSummaryHeading,
      exact: true,
    });
    this.promoInput = page.locator(cartLocators.promoInput);
    this.applyPromoBtn = page.locator(cartLocators.applyPromoBtn);
    this.promoErrorMsg = page.locator(cartLocators.promoErrorMsg);
    this.orderSummaryTotal = page.locator(cartLocators.orderSummaryTotal);
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

  async hasItems(): Promise<boolean> {
    await this.open();
    const count = await this.page.locator(cartLocators.itemRow).count();
    return count > 0;
  }

  async ensureCartHasItem(productPage: ProductPage, data: StoreData): Promise<void> {
    await this.open();
    const itemCount = await this.page.locator(cartLocators.itemRow).count();
    if (itemCount === 0) {
      const product = getByKey<{ sku: string }>(data, "cart.productInStock");
      await productPage.openBySku(product.sku);
      await productPage.addToCart();
      await this.open();
    }
  }

  async enterPromoCode(code: string): Promise<void> {
    await this.promoInput.fill(code);
  }

  async applyPromoCode(): Promise<void> {
    await this.applyPromoBtn.click();
  }

  async getOrderTotal(): Promise<string> {
    const totalValueEl = this.page.locator("div, span, p").filter({ hasText: /^Total$/ }).locator("..").locator("div, span, p").last();
    await totalValueEl.waitFor({ state: "visible", timeout: 10000 });
    return (await totalValueEl.textContent()) ?? "";
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
