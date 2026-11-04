import type { Locator, Page } from "@playwright/test";
import type { ApiInterceptor } from "../core/ApiInterceptor.js";
import type { Labels } from "../core/runtime.js";
import { tpl } from "../core/tpl.js";
import productSearchLocators from "../locators/product-search.json" with { type: "json" };
import { BasePage } from "./BasePage.js";

export class ProductSearchPage extends BasePage {
  private readonly searchInput: Locator;

  constructor(page: Page, api: ApiInterceptor, labels: Labels) {
    super(page, api);
    this.searchInput = page.getByRole("textbox", { name: labels.productSearchInput, exact: true });
  }

  async searchForProduct(name: string): Promise<void> {
    await this.searchInput.fill(name);
    await this.searchInput.press("Enter");
  }

  async openProduct(productSlug: string): Promise<void> {
    const productLink = this.page.locator(
      tpl(productSearchLocators.productLink, { productSlug }),
    );
    await productLink.click();
  }

}