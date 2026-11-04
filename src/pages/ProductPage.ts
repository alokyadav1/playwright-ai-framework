import type { Locator, Page } from "@playwright/test";
import type { ApiInterceptor } from "../core/ApiInterceptor.js";
import type { Labels } from "../core/runtime.js";
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
    await this.addToCartBtn.click();
  }
}