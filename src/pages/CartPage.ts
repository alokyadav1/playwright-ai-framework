import type { Locator, Page } from "@playwright/test";
import type { ApiInterceptor } from "../core/ApiInterceptor.js";
import type { Labels } from "../core/runtime.js";
import { tpl } from "../core/tpl.js";
import cartLocators from "../locators/cart.json" with { type: "json" };
import { BasePage } from "./BasePage.js";

export class CartPage extends BasePage {
  readonly browserPage: Page;
  readonly headerCartItemCount: Locator;
  readonly itemRows: Locator;
  readonly proceedToCheckoutBtn: Locator;
  readonly orderSummaryHeading: Locator;
  private readonly cartHeaderLink: Locator;

  constructor(page: Page, api: ApiInterceptor, labels: Labels) {
    super(page, api);
    this.browserPage = page;
    this.headerCartItemCount = page.locator(cartLocators.headerCartItemCountText);
    this.itemRows = page.locator(cartLocators.itemRows);
    this.cartHeaderLink = page.getByRole("link", {
      name: labels.cartHeaderLink,
      exact: true,
    });
    this.proceedToCheckoutBtn = page.getByRole("button", {
      name: labels.cartProceedToCheckoutBtn,
      exact: true,
    });
    this.orderSummaryHeading = page.getByRole("heading", {
      name: labels.cartOrderSummaryHeading,
      exact: true,
    });
  }

  async open(): Promise<void> {
    await this.page.goto("/en/cart");
  }

  async openFromHeader(): Promise<void> {
    await this.cartHeaderLink.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutBtn.click();
  }

  itemRow(productSku: string): Locator {
    return this.page.locator(
      tpl(cartLocators.itemRowByVariantId, { variantId: this.variantId(productSku) }),
    );
  }

  itemImage(productSku: string): Locator {
    return this.itemRow(productSku).locator(
      tpl(cartLocators.itemImage, { variantId: this.variantId(productSku) }),
    );
  }

  itemNameLink(productSku: string): Locator {
    return this.itemRow(productSku).locator(
      tpl(cartLocators.itemNameLink, { variantId: this.variantId(productSku) }),
    );
  }

  itemQuantityInput(productSku: string): Locator {
    return this.itemRow(productSku).locator(cartLocators.itemQuantityInput);
  }

  itemUnitPrice(productSku: string): Locator {
    return this.itemRow(productSku).locator(cartLocators.itemUnitPriceText);
  }

  itemLineTotal(productSku: string): Locator {
    return this.itemRow(productSku).locator(cartLocators.itemLineTotalText);
  }

  private variantId(productSku: string): string {
    const separator = productSku.lastIndexOf("/");
    const variantId = productSku.slice(separator + 1);
    if (separator <= 0 || !variantId) {
      throw new Error("Cart product SKU must include a product path and variant ID");
    }
    return variantId;
  }
}