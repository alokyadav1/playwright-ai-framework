import type { Locator, Page } from "@playwright/test";
import type { ApiInterceptor } from "../core/ApiInterceptor.js";
import type { Labels } from "../core/runtime.js";
import { BasePage } from "./BasePage.js";

export class CheckoutPage extends BasePage {
  private readonly addressContinueBtn: Locator;
  private readonly continueToPaymentBtn: Locator;

  constructor(page: Page, api: ApiInterceptor, labels: Labels) {
    super(page, api);
    this.addressContinueBtn = page.getByRole("button", {
      name: labels.checkoutAddressContinueBtn,
      exact: true,
    });
    this.continueToPaymentBtn = page.getByRole("button", {
      name: labels.checkoutContinueToPaymentBtn,
      exact: true,
    });
  }

  async continueFromDeliveryAddress(): Promise<void> {
    await this.addressContinueBtn.click();
  }

  async continueToPayment(): Promise<void> {
    await this.continueToPaymentBtn.click();
  }
}