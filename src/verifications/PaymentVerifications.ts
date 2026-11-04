import { expect } from "@playwright/test";
import type { PaymentPage } from "../pages/PaymentPage.js";

export class PaymentVerifications {
  constructor(private readonly paymentPage: PaymentPage) {}

  async showsAuthorizationMessage(message: string): Promise<void> {
    await expect(this.paymentPage.authorizationMessage(message)).toBeVisible({ timeout: 20_000 });
  }

  async placeOrderIsEnabled(): Promise<void> {
    await expect(this.paymentPage.placeOrderBtn).toBeEnabled();
  }
}