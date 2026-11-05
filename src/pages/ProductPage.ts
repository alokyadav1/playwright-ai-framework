import type { Locator, Page } from "@playwright/test";
import type { ApiInterceptor } from "../core/ApiInterceptor.js";
import type { Labels } from "../core/runtime.js";
import productApis from "../network/product.apis.json" with { type: "json" };
import { BasePage } from "./BasePage.js";

export class ProductPage extends BasePage {
  private readonly addToCartBtn: Locator;

  constructor(page: Page, api: ApiInterceptor, labels: Labels) {
    super(page, api);
    this.addToCartBtn = page.getByRole("button", { name: labels.productAddToCartBtn, exact: true });
  }

  async openBySku(sku: string): Promise<void> {
    await this.page.goto(`/en/p/${sku}`);
  }

  async addToCart(): Promise<void> {
    const addToCart = this.api.intercept(productApis.addToCart);
    await this.addToCartBtn.click();
    await addToCart.wait();
  }
}
